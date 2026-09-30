// server-only DB layer — MySQL primary, in-memory fallback
import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";

export type DbPool = mysql.Pool;

let pool: DbPool | null = null;
let useMemory = false;
let initPromise: Promise<void> | null = null;

// In-memory fallback store: tableName -> Map<id, row>
const memStore: Record<string, Map<string | number, any>> = {};
const memSeq: Record<string, number> = {};

function getMemTable(name: string) {
  if (!memStore[name]) {
    memStore[name] = new Map();
    memSeq[name] = 1;
  }
  return memStore[name];
}
function nextMemId(name: string) {
  const id = memSeq[name] ?? 1;
  memSeq[name] = id + 1;
  return id;
}

export function isMemoryMode() {
  return useMemory || !pool;
}
export function getPool() {
  return pool;
}
export function getMemStore() {
  return memStore;
}

export function memList(table: string) {
  const map = getMemTable(table);
  // dedup by numeric id — Map contains both id and code keys pointing to same row
  const byId = new Map<string | number, any>();
  for (const row of map.values()) {
    const key = row.id;
    if (key != null && !byId.has(key)) byId.set(key, row);
  }
  // fallback: if table has no numeric id (should not happen), return unique by JSON
  if (byId.size === 0) {
    const seen = new Set<string>();
    const out: any[] = [];
    for (const row of map.values()) {
      const k = JSON.stringify(row);
      if (!seen.has(k)) {
        seen.add(k);
        out.push(row);
      }
    }
    return out;
  }
  return Array.from(byId.values());
}
export function memGet(table: string, id: string | number) {
  return getMemTable(table).get(id) ?? null;
}
export function memCreate(table: string, data: any) {
  const tbl = getMemTable(table);
  const id = data.id ?? nextMemId(table);
  const row = { ...data, id };
  // auto id for string-code tables keep provided id
  tbl.set(id, row);
  // also set by code if code exists for lookup
  if (row.code) tbl.set(row.code, row);
  if (row.email && table === "users") tbl.set(row.email, row);
  return row;
}
export function memUpdate(table: string, id: string | number, patch: any) {
  const tbl = getMemTable(table);
  const existing = tbl.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch, id: existing.id };
  tbl.set(id, updated);
  if (updated.code) tbl.set(updated.code, updated);
  if (updated.email && table === "users") tbl.set(updated.email, updated);
  // also update numeric id entry if id was code
  if (typeof id === "string" && existing.id !== id) {
    tbl.set(existing.id, updated);
  }
  return updated;
}
export function memDelete(table: string, id: string | number) {
  const tbl = getMemTable(table);
  const existing = tbl.get(id);
  if (!existing) return false;
  tbl.delete(id);
  tbl.delete(existing.id);
  if (existing.code) tbl.delete(existing.code);
  if (existing.email && table === "users") tbl.delete(existing.email);
  return true;
}
export function memClear() {
  for (const k of Object.keys(memStore)) memStore[k].clear();
}

function loadDotEnv() {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          process.env[key] = val;
        }
      }
    }
  } catch {}
}

function getEnv(name: string, fallback: string) {
  // @ts-ignore
  const env = (typeof process !== "undefined" ? (process as any).env : {}) ?? {};
  return env[name] ?? fallback;
}

export async function initDb(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    loadDotEnv();
    const host = getEnv("DB_HOST", "127.0.0.1");
    const port = parseInt(getEnv("DB_PORT", "3306"), 10);
    const user = getEnv("DB_USER", "root");
    const password = getEnv("DB_PASSWORD", getEnv("DB_PASS", ""));
    const database = getEnv("DB_NAME", "uniquesta_abroad");
    const waitForDb = getEnv("DB_WAIT", "false") === "true";

    // Try to connect; if fails, fallback to memory
    try {
      // First connect without database to create it
      const tmp = await mysql.createConnection({ host, port, user, password });
      await tmp.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      await tmp.end();
      pool = mysql.createPool({
        host,
        port,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
      });
      // Test query
      await pool.query("SELECT 1");
      await createTables();
      await seedIfEmpty();
      console.log(`[DB] Connected to MySQL ${host}:${port}/${database}`);
    } catch (e: any) {
      console.warn("[DB] MySQL not available, using in-memory store:", e?.message ?? e);
      useMemory = true;
      pool = null;
      seedMemory();
    }
    if (waitForDb && useMemory) {
      console.warn("[DB] DB_WAIT=true but still in memory mode");
    }
  })();
  return initPromise;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  if (!pool || useMemory) throw new Error("DB not available (memory mode)");
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}
export async function execute(sql: string, params?: any[]) {
  if (!pool || useMemory) throw new Error("DB not available (memory mode)");
  const [result] = await pool.execute(sql, params);
  return result as mysql.ResultSetHeader;
}
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

// ---------- Schema ----------
async function createTables() {
  if (!pool) return;
  const ddl = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'staff',
    designation VARCHAR(150) NULL,
    branch VARCHAR(255) DEFAULT 'Guwahati HQ',
    reports_to VARCHAR(255) NULL,
    phone VARCHAR(50) NULL,
    status VARCHAR(50) DEFAULT 'Active',
    avatar VARCHAR(512) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    head VARCHAR(255) NULL,
    target_year INT DEFAULT 2026,
    revenue DECIMAL(12,2) DEFAULT 0,
    students INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    dob VARCHAR(50) NULL,
    passport VARCHAR(50) NULL,
    country VARCHAR(100) NOT NULL,
    course VARCHAR(255) NOT NULL,
    university VARCHAR(255) NOT NULL,
    intake VARCHAR(100) NOT NULL,
    counselor VARCHAR(255) NULL,
    counselor_id INT NULL,
    branch VARCHAR(255) NOT NULL,
    lead_score INT DEFAULT 0,
    stage VARCHAR(100) DEFAULT 'Lead',
    stage_index INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS student_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    due_date VARCHAR(100) NULL,
    owner VARCHAR(255) NULL,
    priority VARCHAR(20) DEFAULT 'Medium',
    status VARCHAR(20) DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS student_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    size VARCHAR(50) NULL,
    status VARCHAR(50) DEFAULT 'Verified',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS student_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    author VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS student_followups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    scheduled_at VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    note VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS student_comms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    channel VARCHAR(50) NOT NULL,
    direction VARCHAR(20) DEFAULT 'Outbound',
    subject VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(50) NULL,
    source VARCHAR(100) NOT NULL,
    score INT DEFAULT 0,
    city VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'New Enquiry',
    assigned_to VARCHAR(255) NULL,
    branch VARCHAR(255) NULL,
    student_id INT NULL,
    student_code VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    student VARCHAR(255) NOT NULL,
    student_id INT NULL,
    university VARCHAR(255) NOT NULL,
    program VARCHAR(255) NOT NULL,
    intake VARCHAR(100) NOT NULL,
    stage VARCHAR(100) DEFAULT 'Documents',
    progress INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'In Progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS universities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    tier VARCHAR(50) DEFAULT 'Tier 1',
    courses INT DEFAULT 0,
    intakes VARCHAR(255) NOT NULL,
    commission VARCHAR(50) NOT NULL,
    rating DECIMAL(3,1) DEFAULT 4.5,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS colleges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    affiliated_university VARCHAR(255) NOT NULL,
    courses_offered JSON,
    annual_intake INT DEFAULT 0,
    deadline VARCHAR(50) NULL,
    tuition_fee VARCHAR(100) NULL,
    hostel_fee VARCHAR(100) NULL,
    contact_person VARCHAR(255) NULL,
    contact_number VARCHAR(50) NULL,
    email VARCHAR(255) NULL,
    website VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'Active',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    eligibility VARCHAR(500) NOT NULL,
    tuition_fee VARCHAR(100) NOT NULL,
    registration_fee VARCHAR(100) NOT NULL,
    seats_available INT DEFAULT 0,
    total_seats INT DEFAULT 0,
    session VARCHAR(50) NOT NULL,
    min_percentage VARCHAR(10) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS india_students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(512) NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    dob VARCHAR(50) NULL,
    gender VARCHAR(20) NULL,
    category VARCHAR(50) NULL,
    father_name VARCHAR(255) NULL,
    father_phone VARCHAR(50) NULL,
    address TEXT NULL,
    counselor VARCHAR(255) NULL,
    branch VARCHAR(255) NOT NULL,
    preferred_state VARCHAR(100) NULL,
    preferred_college VARCHAR(255) NULL,
    preferred_course VARCHAR(255) NULL,
    session VARCHAR(50) NOT NULL,
    stage_index INT DEFAULT 0,
    registration_fee_paid BOOLEAN DEFAULT FALSE,
    total_fee INT DEFAULT 0,
    paid_fee INT DEFAULT 0,
    scholarship INT DEFAULT 0,
    discount INT DEFAULT 0,
    remarks TEXT NULL,
    applied_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    student VARCHAR(255) NOT NULL,
    student_id INT NULL,
    amount VARCHAR(100) NOT NULL,
    amount_value INT NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    type VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(50) NULL,
    role VARCHAR(100) NOT NULL,
    designation VARCHAR(150) NULL,
    branch VARCHAR(100) NOT NULL,
    reports_to VARCHAR(255) NULL,
    user_id INT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    avatar VARCHAR(512) NULL,
    joined_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS approvals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    amount VARCHAR(100) NOT NULL,
    amount_value INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    submitted_by VARCHAR(255) NOT NULL,
    submitted_date VARCHAR(100) NOT NULL,
    period VARCHAR(100) NULL,
    branch VARCHAR(255) NOT NULL,
    attachments INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'In Review',
    current_stage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS approval_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    approval_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    initials VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    time VARCHAR(100) NULL,
    comment TEXT NULL,
    step_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (approval_id) REFERENCES approvals(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS referral_students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    university VARCHAR(255) NOT NULL,
    program VARCHAR(255) NOT NULL,
    intake VARCHAR(100) NOT NULL,
    status VARCHAR(100) NOT NULL,
    stage VARCHAR(100) NOT NULL,
    referred_date DATE NOT NULL,
    commission_est VARCHAR(100) NOT NULL,
    partner_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS commissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inv_id VARCHAR(50) NOT NULL UNIQUE,
    student VARCHAR(255) NOT NULL,
    university VARCHAR(255) NOT NULL,
    intake VARCHAR(100) NOT NULL,
    course_fee VARCHAR(100) NOT NULL,
    rate VARCHAR(20) NOT NULL,
    amount VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Eligible',
    paid_date VARCHAR(100) NULL,
    utr VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS payment_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    req_id VARCHAR(50) NOT NULL UNIQUE,
    date DATE NOT NULL,
    amount VARCHAR(100) NOT NULL,
    bank VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Processing',
    utr VARCHAR(100) NULL,
    notes TEXT NULL,
    partner_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY,
    legal_name VARCHAR(255) NOT NULL,
    support_email VARCHAR(255) NOT NULL,
    two_factor BOOLEAN DEFAULT TRUE,
    whatsapp_notify BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS travel_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_ref VARCHAR(50) NOT NULL UNIQUE,
    passenger_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(50) NOT NULL,
    travel_type VARCHAR(100) DEFAULT 'Bus & Fleet Trip',
    vehicle_type VARCHAR(100) DEFAULT 'AC Luxury Bus',
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    departure_date VARCHAR(50) NOT NULL,
    return_date VARCHAR(50) NULL,
    airline_carrier VARCHAR(100) NULL,
    pnr VARCHAR(100) NULL,
    passengers_count INT DEFAULT 1,
    customer_price INT DEFAULT 0,
    agency_cost INT DEFAULT 0,
    admin_margin INT DEFAULT 0,
    total_amount VARCHAR(100) NULL,
    amount_value INT DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'Pending',
    agency_payment_status VARCHAR(50) DEFAULT 'Pending',
    assigned_agency VARCHAR(255) NULL,
    agency_contact VARCHAR(100) NULL,
    assigned_driver VARCHAR(255) NULL,
    driver_phone VARCHAR(50) NULL,
    vehicle_number VARCHAR(50) NULL,
    trip_status VARCHAR(50) DEFAULT 'Booking Confirmed',
    notes TEXT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS travel_drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    vehicle_number VARCHAR(50) NOT NULL,
    experience VARCHAR(50) NULL,
    rating DECIMAL(3,1) DEFAULT 4.8,
    status VARCHAR(50) DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS travel_agencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NULL,
    city VARCHAR(100) NOT NULL,
    commission_tier VARCHAR(100) DEFAULT 'Standard Partner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS b2b_partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    branch VARCHAR(100) DEFAULT 'Mumbai',
    profit_share_type VARCHAR(20) DEFAULT 'percentage',
    partner_share_pct DECIMAL(5,2) DEFAULT 25.00,
    admin_share_pct DECIMAL(5,2) DEFAULT 75.00,
    flat_rate_amount INT DEFAULT 25000,
    tier VARCHAR(50) DEFAULT 'Silver Partner (25%)',
    status VARCHAR(20) DEFAULT 'Active',
    total_students INT DEFAULT 0,
    total_revenue INT DEFAULT 0,
    partner_earnings INT DEFAULT 0,
    admin_earnings INT DEFAULT 0,
    payout_balance INT DEFAULT 0,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'approval',
    reference_id VARCHAR(100) NULL,
    sender_name VARCHAR(255) NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `;
  const statements = ddl.split(";").map(s => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    await pool!.query(stmt);
  }
}

async function seedIfEmpty() {
  if (!pool) return;
  const [users] = await pool.query("SELECT COUNT(*) as c FROM users") as any;
  if (users[0].c > 0) return;
  // seed minimal data via memory seeder then insert into DB
  const mem = buildSeedData();
  // insert branches
  for (const b of mem.branches) {
    await pool.query("INSERT INTO branches (name,city,region,head,revenue,students) VALUES (?,?,?,?,?,?)", [b.name,b.city,b.region,b.head,b.revenue,b.students]);
  }
  // users
  const bcrypt = await import("bcryptjs");
  const hash = await bcrypt.hash("admin123", 10);
  await pool.query("INSERT INTO users (name,email,password_hash,role,branch) VALUES (?,?,?,?,?)", ["Mohammad Iqbal","admin@uniquesta.com",hash,"super_admin","Guwahati HQ"]);
  // students (empty by default - no dummy records)
  for (const s of mem.students) {
    await pool.query("INSERT INTO students (code,name,email,phone,dob,passport,country,course,university,intake,counselor,branch,lead_score,stage,stage_index,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [s.code,s.name,s.email,s.phone,s.dob,s.passport,s.country,s.course,s.university,s.intake,s.counselor,s.branch,s.lead_score,s.stage,s.stage_index,s.status]);
  }
  for (const l of mem.leads) {
    await pool.query("INSERT INTO leads (name,email,phone,source,score,city,status,assigned_to,branch) VALUES (?,?,?,?,?,?,?,?,?)",
      [l.name,l.email,l.phone,l.source,l.score,l.city,l.status,l.assigned_to,l.branch]);
  }
  for (const a of mem.applications) {
    await pool.query("INSERT INTO applications (code,student,university,program,intake,stage,progress,status) VALUES (?,?,?,?,?,?,?,?)",
      [a.code,a.student,a.university,a.program,a.intake,a.stage,a.progress,a.status]);
  }
  for (const u of mem.universities) {
    await pool.query("INSERT INTO universities (name,country,city,tier,courses,intakes,commission,rating) VALUES (?,?,?,?,?,?,?,?)",
      [u.name,u.country,u.city,u.tier,u.courses,u.intakes,u.commission,u.rating]);
  }
  for (const c of mem.colleges) {
    await pool.query("INSERT INTO colleges (code,name,state,city,affiliated_university,courses_offered,annual_intake,deadline,tuition_fee,hostel_fee,contact_person,contact_number,email,website,status,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [c.code,c.name,c.state,c.city,c.affiliatedUniversity,JSON.stringify(c.coursesOffered),c.annualIntake,c.deadline,c.tuitionFee,c.hostelFee,c.contactPerson,c.contactNumber,c.email,c.website,c.status,c.notes]);
  }
  for (const cr of mem.courses) {
    await pool.query("INSERT INTO courses (code,name,category,duration,eligibility,tuition_fee,registration_fee,seats_available,total_seats,session,min_percentage,description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [cr.code,cr.name,cr.category,cr.duration,cr.eligibility,cr.tuitionFee,cr.registrationFee,cr.seatsAvailable,cr.totalSeats,cr.session,cr.minPercentage,cr.description]);
  }
  for (const s of mem.indiaStudents) {
    await pool.query("INSERT INTO india_students (code,name,phone,email,dob,gender,category,father_name,father_phone,address,counselor,branch,preferred_state,preferred_college,preferred_course,session,stage_index,registration_fee_paid,total_fee,paid_fee,scholarship,discount,remarks,applied_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [s.code,s.name,s.phone,s.email,s.dob,s.gender,s.category,s.fatherName,s.fatherPhone,s.address,s.counselor,s.branch,s.preferredState,s.preferredCollege,s.preferredCourse,s.session,s.stageIndex,s.registrationFeePaid,s.totalFee,s.paidFee,s.scholarship,s.discount,s.remarks,s.appliedDate]);
  }
  for (const inv of mem.invoices) {
    await pool.query("INSERT INTO invoices (code,student,amount,amount_value,currency,type,date,status) VALUES (?,?,?,?,?,?,?,?)",
      [inv.code,inv.student,inv.amount,inv.amount_value,inv.currency,inv.type,inv.date,inv.status]);
  }
  for (const e of mem.employees) {
    await pool.query("INSERT INTO employees (name,email,phone,role,branch,status) VALUES (?,?,?,?,?,?)",
      [e.name,e.email,e.phone,e.role,e.branch,e.status]);
  }
  for (const ap of mem.approvals) {
    const [res] = await pool.query("INSERT INTO approvals (code,title,amount,amount_value,category,submitted_by,submitted_date,period,branch,attachments,status,current_stage) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [ap.code,ap.title,ap.amount,ap.amount_value,ap.category,ap.submitted_by,ap.submitted_date,ap.period,ap.branch,ap.attachments,ap.status,ap.current_stage]) as any;
    const id = (res as any).insertId;
    for (const st of ap.steps) {
      await pool.query("INSERT INTO approval_steps (approval_id,name,role,initials,status,time,comment,step_order) VALUES (?,?,?,?,?,?,?,?)",
        [id, st.name, st.role, st.initials, st.status, st.time, st.comment, st.step_order]);
    }
  }
  for (const r of mem.referralStudents) {
    await pool.query("INSERT INTO referral_students (code,name,email,country,university,program,intake,status,stage,referred_date,commission_est) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [r.code,r.name,r.email,r.country,r.university,r.program,r.intake,r.status,r.stage,r.referred_date,r.commission_est]);
  }
  for (const c of mem.commissions) {
    await pool.query("INSERT INTO commissions (inv_id,student,university,intake,course_fee,rate,amount,status,paid_date,utr) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [c.inv_id,c.student,c.university,c.intake,c.course_fee,c.rate,c.amount,c.status,c.paid_date,c.utr]);
  }
  for (const p of mem.paymentRequests) {
    await pool.query("INSERT INTO payment_requests (req_id,date,amount,bank,status,utr,notes) VALUES (?,?,?,?,?,?,?)",
      [p.req_id,p.date,p.amount,p.bank,p.status,p.utr,p.notes]);
  }
  await pool.query("INSERT INTO settings (id,legal_name,support_email,two_factor,whatsapp_notify) VALUES (1,'Uniquesta Overseas Pvt Ltd','care@uniquesta.com',1,1) ON DUPLICATE KEY UPDATE legal_name=VALUES(legal_name)");
}

export function buildSeedData() {
  const students: any[] = [];
  const leads = [
    { name:"Ishaan Bhatt", email:"ishaan.b@gmail.com", phone:"+91 98200 11111", source:"Instagram Ad", score:84, city:"Pune", status:"New Enquiry", assigned_to:"Mohammad Iqbal", branch:"Guwahati HQ" },
    { name:"Riya Malhotra", email:"riya.m@gmail.com", phone:"+91 98111 22222", source:"Website Form", score:71, city:"Delhi", status:"New Enquiry", assigned_to:"Mohammad Iqbal", branch:"Guwahati HQ" },
    { name:"Aditya Ghosh", email:"aditya.g@gmail.com", phone:"+91 98300 33333", source:"Referral", score:66, city:"Kolkata", status:"New Enquiry", assigned_to:"Mohammad Iqbal", branch:"Guwahati HQ" },
    { name:"Neha Pillai", email:"neha.p@gmail.com", phone:"+91 98400 44444", source:"Google Ads", score:78, city:"Kochi", status:"Contacted", assigned_to:"Mohammad Iqbal", branch:"Guwahati HQ" },
    { name:"Sameer Khan", email:"sameer.k@gmail.com", phone:"+91 98500 55555", source:"Walk-in", score:92, city:"Mumbai", status:"Contacted", assigned_to:"Mohammad Iqbal", branch:"Guwahati HQ" },
    { name:"Meera Kapoor", email:"meera.k@gmail.com", phone:"+91 98600 66666", source:"Education Fair", score:88, city:"Bengaluru", status:"Qualified", assigned_to:"Mohammad Iqbal", branch:"Guwahati HQ" },
    { name:"Karthik Rao", email:"karthik.r@gmail.com", phone:"+91 98700 77777", source:"Referral", score:81, city:"Hyderabad", status:"Qualified", assigned_to:"Mohammad Iqbal", branch:"Guwahati HQ" },
    { name:"Zoya Sheikh", email:"zoya.s@gmail.com", phone:"+91 98800 88888", source:"Website Form", score:74, city:"Lucknow", status:"Qualified", assigned_to:"Mohammad Iqbal", branch:"Guwahati HQ" },
    { name:"Devansh Jain", email:"devansh.j@gmail.com", phone:"+91 98900 99999", source:"Instagram Ad", score:90, city:"Ahmedabad", status:"Counselling Booked", assigned_to:"Mohammad Iqbal", branch:"Guwahati HQ" },
  ];
  const applications: any[] = [];
  const universities = [
    { name:"University of Toronto", country:"Canada", city:"Toronto", tier:"Tier 1", courses:214, intakes:"Fall, Winter", commission:"15%", rating:4.8 },
    { name:"Monash University", country:"Australia", city:"Melbourne", tier:"Tier 1", courses:186, intakes:"Feb, Jul", commission:"18%", rating:4.7 },
    { name:"University of Manchester", country:"UK", city:"Manchester", tier:"Tier 1", courses:240, intakes:"Sept, Jan", commission:"14%", rating:4.6 },
    { name:"New York University", country:"USA", city:"New York", tier:"Tier 1", courses:302, intakes:"Fall, Spring", commission:"10%", rating:4.9 },
    { name:"TU Munich", country:"Germany", city:"Munich", tier:"Tier 1", courses:128, intakes:"Winter, Summer", commission:"€ 2,400", rating:4.7 },
    { name:"King's College London", country:"UK", city:"London", tier:"Tier 1", courses:198, intakes:"Sept", commission:"15%", rating:4.6 },
  ];
  const colleges = [
    { code:"COL-001", name:"M. S. Ramaiah University of Applied Sciences", state:"Karnataka", city:"Bengaluru", affiliatedUniversity:"Autonomous State University", coursesOffered:["B.Sc Nursing","B.Pharm","MBA","BCA","BPT"], annualIntake:450, deadline:"30 Aug 2026", tuitionFee:"₹ 1,80,000 / year", hostelFee:"₹ 85,000 / year", contactPerson:"Dr. K. S. Murthy", contactNumber:"+91 98450 12345", email:"admissions@msruas.ac.in", website:"www.msruas.ac.in", status:"Admissions Open", notes:"Direct admission for high scoring candidates." },
    { code:"COL-002", name:"Guwahati Medical College & Institute of Nursing", state:"Assam", city:"Guwahati", affiliatedUniversity:"Srimanta Sankaradeva University of Health Sciences", coursesOffered:["B.Sc Nursing","GNM","BMLT","Radiology","OT Technology"], annualIntake:280, deadline:"15 Sep 2026", tuitionFee:"₹ 1,10,000 / year", hostelFee:"₹ 55,000 / year", contactPerson:"Dr. Anupam Baruah", contactNumber:"+91 94350 98765", email:"admissions@gmch-nursing.edu.in", website:"www.gmch.assam.gov.in", status:"Admissions Open", notes:"Assam state nursing council approved." },
    { code:"COL-003", name:"Apollo College of Nursing & Allied Health", state:"Tamil Nadu", city:"Chennai", affiliatedUniversity:"The Tamil Nadu Dr. M.G.R. Medical University", coursesOffered:["B.Sc Nursing","ANM","GNM","BPT","OT Technology"], annualIntake:320, deadline:"25 Aug 2026", tuitionFee:"₹ 1,65,000 / year", hostelFee:"₹ 90,000 / year", contactPerson:"Sister Rosamma Thomas", contactNumber:"+91 98840 76543", email:"admissions@apollonursing.edu.in", website:"www.apollonursing.edu.in", status:"Near Capacity", notes:"100% placement guarantee." },
    { code:"COL-004", name:"Assam Down Town University", state:"Assam", city:"Guwahati", affiliatedUniversity:"UGC Recognized Private University", coursesOffered:["B.Pharm","D.Pharm","BBA","MBA","BCA","Hotel Management"], annualIntake:600, deadline:"20 Aug 2026", tuitionFee:"₹ 1,25,000 / year", hostelFee:"₹ 65,000 / year", contactPerson:"Pranab Goswami", contactNumber:"+91 98640 44332", email:"admissions@adtu.in", website:"www.adtu.in", status:"Active", notes:"Scholarships available." },
  ];
  const courses = [
    { code:"CRS-001", name:"B.Sc Nursing", category:"Nursing", duration:"4 Years", eligibility:"10+2 with PCB & English (Min 45%)", tuitionFee:"₹ 1,50,000 / year", registrationFee:"₹ 10,000", seatsAvailable:34, totalSeats:120, session:"2026-27", minPercentage:"45%", description:"Comprehensive 4-year degree course." },
    { code:"CRS-002", name:"GNM (General Nursing & Midwifery)", category:"Nursing", duration:"3 Years", eligibility:"10+2 Any Stream (Min 40%)", tuitionFee:"₹ 95,000 / year", registrationFee:"₹ 5,000", seatsAvailable:18, totalSeats:80, session:"2026-27", minPercentage:"40%", description:"Diploma course focused on general nursing." },
    { code:"CRS-003", name:"BPT (Bachelor of Physiotherapy)", category:"Allied Health", duration:"4.5 Years", eligibility:"10+2 PCB (Min 50%)", tuitionFee:"₹ 1,60,000 / year", registrationFee:"₹ 10,000", seatsAvailable:22, totalSeats:60, session:"2026-27", minPercentage:"50%", description:"Professional degree covering biomechanics." },
    { code:"CRS-004", name:"B.Pharm (Bachelor of Pharmacy)", category:"Pharmacy", duration:"4 Years", eligibility:"10+2 PCB / PCM (Min 50%)", tuitionFee:"₹ 1,45,000 / year", registrationFee:"₹ 10,000", seatsAvailable:28, totalSeats:100, session:"2026-27", minPercentage:"50%", description:"PCI approved 4-year degree." },
  ];
  const indiaStudents: any[] = [];
  const invoices = [
    { code:"INV-4210", student:"Priya Nair", amount:"₹ 1,24,000", amount_value:124000, currency:"INR", type:"Tuition Instalment", date:"2026-07-23", status:"Paid" },
    { code:"INV-4211", student:"Rohit Verma", amount:"₹ 45,000", amount_value:45000, currency:"INR", type:"Service Fee", date:"2026-07-22", status:"Paid" },
    { code:"INV-4212", student:"Ananya Iyer", amount:"₹ 82,500", amount_value:82500, currency:"INR", type:"Application Fee", date:"2026-07-22", status:"Pending" },
    { code:"INV-4213", student:"Vikram Singh", amount:"₹ 2,10,000", amount_value:210000, currency:"INR", type:"Visa & Travel", date:"2026-07-21", status:"Overdue" },
    { code:"INV-4214", student:"Sneha Kulkarni", amount:"€ 6,200", amount_value:6200, currency:"EUR", type:"University Fee", date:"2026-07-20", status:"Paid" },
  ];
  const employees = [
    { name:"Meera Shah", email:"meera@uniquesta.com", phone:"+91 98200 11111", role:"Senior Counsellor", branch:"Mumbai", status:"Active" },
    { name:"Karan Mehta", email:"karan@uniquesta.com", phone:"+91 98200 22222", role:"Counsellor", branch:"Delhi NCR", status:"Active" },
    { name:"Divya Rao", email:"divya@uniquesta.com", phone:"+91 98200 33333", role:"Regional Head", branch:"Bengaluru", status:"On Leave" },
    { name:"Harpreet Kaur", email:"harpreet@uniquesta.com", phone:"+91 98200 44444", role:"Visa Officer", branch:"Chandigarh", status:"Active" },
    { name:"Rahul Reddy", email:"rahul.r@uniquesta.com", phone:"+91 98200 55555", role:"Counsellor", branch:"Hyderabad", status:"Active" },
    { name:"Anita Thomas", email:"anita@uniquesta.com", phone:"+91 98200 66666", role:"Branch Manager", branch:"Kochi", status:"Active" },
  ];
  const approvals = [
    {
      code:"REIMB-2026-0284", title:"Client visit — Bengaluru university fair", amount:"₹ 48,650", amount_value:48650, category:"Travel & Meals", submitted_by:"Meera Shah", submitted_date:"22 Jul 2026 · 10:14 AM", period:"18 Jul – 21 Jul 2026", branch:"Mumbai · Andheri West", attachments:6, status:"In Review", current_stage:2,
      steps:[
        { name:"Meera Shah", role:"Employee · Senior Counsellor", initials:"MS", status:"approved", time:"22 Jul · 10:14 AM", comment:"Submitted with bills.", step_order:0 },
        { name:"Rahul Deshmukh", role:"Branch Manager · Mumbai", initials:"RD", status:"approved", time:"22 Jul · 03:40 PM", comment:"Verified against plan.", step_order:1 },
        { name:"Anjali Kapoor", role:"Finance · AP Lead", initials:"AK", status:"current", time:"In review · 6h", comment:"Awaiting cab receipt category.", step_order:2 },
        { name:"Vivek Ramanathan", role:"Director · Operations", initials:"VR", status:"upcoming", time:"Est. 24 Jul", comment:"", step_order:3 },
        { name:"Neha Malhotra", role:"CEO", initials:"NM", status:"upcoming", time:"Est. 25 Jul", comment:"", step_order:4 },
        { name:"Payment Released", role:"Finance · Payouts", initials:"₹", status:"released", time:"Est. 26 Jul", comment:"NEFT within 24h.", step_order:5 },
      ]
    }
  ];
  const referralStudents: any[] = [];
  const commissions: any[] = [];
  const paymentRequests = [
    { req_id:"PR-2026-044", date:"2026-07-10", amount:"₹ 3,50,000", bank:"HDFC Bank (**** 4921)", status:"Completed", utr:"UTR994820194", notes:"Payout for June Intake" },
    { req_id:"PR-2026-049", date:"2026-07-21", amount:"₹ 2,00,000", bank:"HDFC Bank (**** 4921)", status:"Processing", utr:"Batch #882-P", notes:"Part payout" },
  ];
  const branches = [
    { name:"Guwahati HQ", city:"Guwahati", region:"North East", head:"Mohammad Iqbal", revenue:9.8, students:2140 },
    { name:"Mumbai", city:"Mumbai", region:"West", head:"Rahul Deshmukh", revenue:9.8, students:2140 },
    { name:"Delhi NCR", city:"Delhi", region:"North", head:"Karan Mehta", revenue:8.4, students:1876 },
    { name:"Bengaluru", city:"Bengaluru", region:"South", head:"Divya Rao", revenue:7.6, students:1642 },
    { name:"Hyderabad", city:"Hyderabad", region:"South", head:"Rahul Reddy", revenue:6.1, students:1310 },
  ];
  const travelDrivers = [
    { name: "Rajesh Sharma", phone: "+91 98200 45678", vehicle_type: "32-Seater Luxury AC Bus", vehicle_number: "AS-01-BK-9921", experience: "8 years", rating: 4.9, status: "Available" },
    { name: "Bikram Das", phone: "+91 98540 22334", vehicle_type: "Force Traveller (17-Seater)", vehicle_number: "AS-01-TC-4402", experience: "5 years", rating: 4.8, status: "On Trip" },
    { name: "Suraj Singh", phone: "+91 94350 99881", vehicle_type: "Toyota Innova Crysta (7-Seater)", vehicle_number: "AS-01-EA-1124", experience: "6 years", rating: 4.9, status: "On Trip" },
    { name: "Manish Choudhury", phone: "+91 98641 55667", vehicle_type: "45-Seater Semi-Sleeper Coach", vehicle_number: "AS-01-MX-8833", experience: "10 years", rating: 4.7, status: "Available" },
    { name: "Pranab Kalita", phone: "+91 98311 77442", vehicle_type: "Swift Dzire Sedan (4-Seater)", vehicle_number: "AS-01-DZ-3390", experience: "4 years", rating: 4.8, status: "Available" },
  ];
  const travelAgencies = [
    { name: "Royal Wheels & Tours", contact_person: "Vikram Singhania", phone: "+91 98540 11223", email: "info@royalwheels.com", city: "Guwahati", commission_tier: "Primary Vendor (Wholesale)" },
    { name: "Himalayan Express Fleet Agency", contact_person: "Tenzin Norbu", phone: "+91 94350 77889", email: "booking@himalayanexpress.in", city: "Shillong / Guwahati", commission_tier: "Fleet Partner" },
    { name: "Green Valley Bus Services", contact_person: "Altaf Hussain", phone: "+91 98111 88990", email: "ops@greenvalleybus.com", city: "Silchar", commission_tier: "Bus Fleet Operator" },
    { name: "Direct Customer (In-house / Direct)", contact_person: "Admin Office", phone: "+91 98200 11111", email: "travel@uniquesta.com", city: "Guwahati HQ", commission_tier: "100% In-house Margin" },
  ];
  const travelBookings = [
    {
      booking_ref: "UQ-TRV-1001",
      passenger_name: "Aman Barman (Group of 14)",
      phone: "+91 98640 12345",
      email: "aman.barman@gmail.com",
      travel_type: "Group Outstation Tour",
      vehicle_type: "Force Traveller (17-Seater)",
      origin: "Guwahati Paltan Bazar",
      destination: "Kaziranga & Shillong Tour (3 Days)",
      departure_date: "2026-10-02",
      return_date: "2026-10-05",
      passengers_count: 14,
      customer_price: 32000,
      agency_cost: 24000,
      admin_margin: 8000,
      total_amount: "₹ 32,000",
      amount_value: 32000,
      payment_status: "Partial",
      agency_payment_status: "Pending Completion",
      assigned_agency: "Royal Wheels & Tours",
      agency_contact: "+91 98540 11223",
      assigned_driver: "Bikram Das",
      driver_phone: "+91 98540 22334",
      vehicle_number: "AS-01-TC-4402",
      trip_status: "Assigned to Driver",
      notes: "Early morning 6:30 AM pickup from Paltan Bazar. AC required, 2 child passengers.",
      status: "Active",
    },
    {
      booking_ref: "UQ-TRV-1002",
      passenger_name: "Pooja Sharma & Family",
      phone: "+91 98201 99882",
      email: "pooja.sharma@yahoo.com",
      travel_type: "Intercity Cab",
      vehicle_type: "Toyota Innova Crysta (7-Seater)",
      origin: "Guwahati Airport (GAU)",
      destination: "Hotel Vivanta, Khanapara, Guwahati",
      departure_date: "2026-09-28",
      passengers_count: 5,
      customer_price: 4500,
      agency_cost: 3200,
      admin_margin: 1300,
      total_amount: "₹ 4,500",
      amount_value: 4500,
      payment_status: "Paid",
      agency_payment_status: "Paid",
      assigned_agency: "Direct Customer (In-house / Direct)",
      agency_contact: "+91 98200 11111",
      assigned_driver: "Suraj Singh",
      driver_phone: "+91 94350 99881",
      vehicle_number: "AS-01-EA-1124",
      trip_status: "On Trip",
      notes: "Flight 6E-442 arriving at 2:15 PM. Driver holding name placard at Gate 2.",
      status: "Active",
    },
    {
      booking_ref: "UQ-TRV-1003",
      passenger_name: "St. Xavier College Student Group",
      phone: "+91 94351 22331",
      email: "tours@stxaviers.edu",
      travel_type: "Educational Bus Excursion",
      vehicle_type: "45-Seater Semi-Sleeper Coach",
      origin: "Guwahati Campus",
      destination: "Cherrapunjee (Sohra) Caves & Waterfalls",
      departure_date: "2026-10-10",
      return_date: "2026-10-12",
      passengers_count: 38,
      customer_price: 65000,
      agency_cost: 50000,
      admin_margin: 15000,
      total_amount: "₹ 65,000",
      amount_value: 65000,
      payment_status: "Paid",
      agency_payment_status: "₹20,000 Advance Released",
      assigned_agency: "Green Valley Bus Services",
      agency_contact: "+91 98111 88990",
      assigned_driver: "Manish Choudhury",
      driver_phone: "+91 98641 55667",
      vehicle_number: "AS-01-MX-8833",
      trip_status: "Booking Confirmed",
      notes: "Luggage space for 38 students. PA system & emergency first-aid kit required.",
      status: "Active",
    },
    {
      booking_ref: "UQ-TRV-1004",
      passenger_name: "Rituraj Bordoloi",
      phone: "+91 98711 33445",
      email: "rituraj.b@gmail.com",
      travel_type: "Airport Drop",
      vehicle_type: "Swift Dzire Sedan (4-Seater)",
      origin: "Six Mile, Guwahati",
      destination: "Guwahati Airport (GAU)",
      departure_date: "2026-09-27",
      passengers_count: 2,
      customer_price: 1800,
      agency_cost: 1200,
      admin_margin: 600,
      total_amount: "₹ 1,800",
      amount_value: 1800,
      payment_status: "Pending",
      agency_payment_status: "Pending",
      assigned_agency: "Himalayan Express Fleet Agency",
      agency_contact: "+91 94350 77889",
      assigned_driver: "Pranab Kalita",
      driver_phone: "+91 98311 77442",
      vehicle_number: "AS-01-DZ-3390",
      trip_status: "Assigned to Driver",
      notes: "Early morning pickup at 4:30 AM sharp. Customer will pay ₹1,800 cash to driver.",
      status: "Active",
    },
    {
      booking_ref: "UQ-TRV-1005",
      passenger_name: "Debashree Goswami (Corporate Team)",
      phone: "+91 98642 88990",
      email: "debashree@techtalk.in",
      travel_type: "Corporate Bus Booking",
      vehicle_type: "32-Seater Luxury AC Bus",
      origin: "Guwahati Tech Park",
      destination: "Umiam Lake Resort, Barapani",
      departure_date: "2026-09-29",
      passengers_count: 28,
      customer_price: 28000,
      agency_cost: 21000,
      admin_margin: 7000,
      total_amount: "₹ 28,000",
      amount_value: 28000,
      payment_status: "Paid",
      agency_payment_status: "Paid",
      assigned_agency: "Royal Wheels & Tours",
      agency_contact: "+91 98540 11223",
      assigned_driver: "Rajesh Sharma",
      driver_phone: "+91 98200 45678",
      vehicle_number: "AS-01-BK-9921",
      trip_status: "Booking Confirmed",
      notes: "Corporate executive retreat. Refreshments & bottled water inside bus.",
      status: "Active",
    },
  ];
  return { students, leads, applications, universities, colleges, courses, indiaStudents, invoices, employees, approvals, referralStudents, commissions, paymentRequests, branches, travelDrivers, travelAgencies, travelBookings };
}

function seedMemory() {
  const data = buildSeedData();
  // helper to push into memory tables
  const pushMany = (tbl: string, rows: any[]) => {
    const m = getMemTable(tbl);
    for (const r of rows) {
      const id = r.id ?? r.code ?? r.req_id ?? r.inv_id ?? nextMemId(tbl);
      const row = { ...r, id };
      m.set(id, row);
      if (r.code) m.set(r.code, row);
      if (r.req_id) m.set(r.req_id, row);
      if (r.inv_id) m.set(r.inv_id, row);
      if (r.email && tbl === "users") m.set(r.email, row);
    }
  };
  // seed users — pre-hashed admin123 (bcrypt 10 rounds)
  const hash = "$2b$10$RMi2Kk9fjzFc68wCSK6F6us0RnJB56Z.JV4lWDfDEQ2xm9qNr0DzO";
  pushMany("users", [
    { id: 1, name: "Mohammad Iqbal", email: "admin@uniquesta.com", password_hash: hash, role: "super_admin", branch: "Guwahati HQ" },
  ]);
  pushMany("branches", data.branches.map((b,i)=>({ id:i+1, ...b })));
  pushMany("students", data.students.map((s,i)=>({ id:i+1, ...s })));
  pushMany("leads", data.leads.map((l,i)=>({ id:i+1, ...l })));
  pushMany("applications", data.applications.map((a,i)=>({ id:i+1, ...a })));
  pushMany("universities", data.universities.map((u,i)=>({ id:i+1, ...u })));
  pushMany("colleges", data.colleges.map((c,i)=>({ id:i+1, ...c, courses_offered: c.coursesOffered })));
  pushMany("courses", data.courses.map((c,i)=>({ id:i+1, ...c })));
  pushMany("india_students", data.indiaStudents.map((s,i)=>({ id:i+1, ...s })));
  pushMany("invoices", data.invoices.map((inv,i)=>({ id:i+1, ...inv })));
  pushMany("employees", data.employees.map((e,i)=>({ id:i+1, ...e })));
  // approvals with steps stored separately
  data.approvals.forEach((ap,i)=>{
    const aid = i+1;
    pushMany("approvals", [{ id: aid, ...ap }]);
    ap.steps.forEach((st, idx)=>{
      pushMany("approval_steps", [{ id: idx+1 + i*10, approval_id: aid, ...st }]);
    });
  });
  pushMany("referral_students", data.referralStudents.map((r,i)=>({ id:i+1, ...r })));
  pushMany("commissions", data.commissions.map((c,i)=>({ id:i+1, ...c })));
  pushMany("payment_requests", data.paymentRequests.map((p,i)=>({ id:i+1, ...p })));
  pushMany("travel_drivers", data.travelDrivers.map((d,i)=>({ id:i+1, ...d })));
  pushMany("travel_agencies", data.travelAgencies.map((a,i)=>({ id:i+1, ...a })));
  pushMany("travel_bookings", data.travelBookings.map((b,i)=>({ id:i+1, ...b })));
  pushMany("settings", [{ id:1, legal_name:"Uniquesta Overseas Pvt Ltd", support_email:"care@uniquesta.com", two_factor:true, whatsapp_notify:true }]);
  // ensure seq counters beyond inserted
  for (const k of Object.keys(memSeq)) {
    const tbl = memStore[k];
    if (tbl) memSeq[k] = tbl.size + 10;
  }
}
