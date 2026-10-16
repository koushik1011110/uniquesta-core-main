// server-only DB layer — MySQL strictly required (in-memory mode disabled)
import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";

export type DbPool = mysql.Pool;

let pool: DbPool | null = null;
let lastDbError: string | null = null;
let initPromise: Promise<void> | null = null;

export function isConnected(): boolean {
  return pool !== null;
}

export function getDbError(): string | null {
  return lastDbError;
}

export function isMemoryMode(): boolean {
  // STRICT REQUIREMENT: In-memory mode is completely disabled.
  return false;
}

export function getPool(): DbPool | null {
  return pool;
}

// Memory store stubs — completely empty, no temporary storage allowed
const emptyMemStore: Record<string, Map<string | number, any>> = {};

export function getMemStore() {
  return emptyMemStore;
}
export function memList(_table: string): any[] {
  return [];
}
export function memGet(_table: string, _id: string | number): any {
  return null;
}
export function memCreate(_table: string, data: any): any {
  return data;
}
export function memUpdate(_table: string, _id: string | number, _patch: any): any {
  return null;
}
export function memDelete(_table: string, _id: string | number): boolean {
  return false;
}
export function memClear(): void {}

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
  if (pool) return;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    loadDotEnv();
    const host = getEnv("DB_HOST", "127.0.0.1");
    const port = parseInt(getEnv("DB_PORT", "3306"), 10);
    const user = getEnv("DB_USER", "root");
    const password = getEnv("DB_PASSWORD", getEnv("DB_PASS", ""));
    const database = getEnv("DB_NAME", "uniquesta_abroad");

    // Strictly connect to MySQL — in-memory fallback is disabled completely
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
      lastDbError = null;
      console.log(`[DB] Connected to MySQL ${host}:${port}/${database}`);
    } catch (e: any) {
      lastDbError = e?.message ?? String(e);
      console.error("[DB] MySQL connection failed (in-memory fallback disabled):", lastDbError);
      pool = null;
    } finally {
      initPromise = null;
    }
  })();
  return initPromise;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  if (!pool) {
    throw new Error(`Database connection failed: MySQL is not active (${lastDbError || "not connected"}). Please start MySQL service.`);
  }
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}
export async function execute(sql: string, params?: any[]) {
  if (!pool) {
    throw new Error(`Database connection failed: MySQL is not active (${lastDbError || "not connected"}). Please start MySQL service.`);
  }
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
    config JSON NULL,
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
  CREATE TABLE IF NOT EXISTS b2c_partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    ambassador_type VARCHAR(100) DEFAULT 'Student Ambassador',
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    branch VARCHAR(100) DEFAULT 'Guwahati HQ',
    reward_type VARCHAR(20) DEFAULT 'flat_rate',
    reward_amount INT DEFAULT 15000,
    reward_pct DECIMAL(5,2) DEFAULT 10.00,
    tier VARCHAR(50) DEFAULT 'Silver Ambassador',
    status VARCHAR(20) DEFAULT 'Active',
    total_referrals INT DEFAULT 0,
    successful_admissions INT DEFAULT 0,
    total_earnings INT DEFAULT 0,
    payout_balance INT DEFAULT 0,
    payout_mode VARCHAR(50) DEFAULT 'UPI / Direct Bank',
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
  try { await pool!.query("ALTER TABLE settings ADD COLUMN config JSON NULL"); } catch {}
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
    { code:"INV-4210", student:"Priya Nair", student_id:1, amount:"₹ 1,24,000", amount_value:124000, currency:"INR", type:"Tuition Instalment", date:"2026-07-23", due_date:"2026-07-20", status:"Paid", branch:"Mumbai", payment_method:"Bank Transfer", notes:"First semester tuition for Monash University." },
    { code:"INV-4211", student:"Rohit Verma", student_id:2, amount:"₹ 45,000", amount_value:45000, currency:"INR", type:"Service Fee", date:"2026-07-22", due_date:"2026-07-25", status:"Paid", branch:"Delhi NCR", payment_method:"UPI (GPay)", notes:"Consultation & documentation processing fee." },
    { code:"INV-4212", student:"Ananya Iyer", student_id:3, amount:"₹ 82,500", amount_value:82500, currency:"INR", type:"Application Fee", date:"2026-07-22", due_date:"2026-08-05", status:"Pending", branch:"Bengaluru", payment_method:"Net Banking", notes:"3 University direct applications filing charges." },
    { code:"INV-4213", student:"Vikram Singh", student_id:4, amount:"₹ 2,10,000", amount_value:210000, currency:"INR", type:"Visa & Travel", date:"2026-07-21", due_date:"2026-07-15", status:"Overdue", branch:"Guwahati HQ", payment_method:"Bank Transfer", notes:"Priority UK visa express fee & accommodation deposit." },
    { code:"INV-4214", student:"Sneha Kulkarni", student_id:5, amount:"€ 6,200", amount_value:558000, currency:"EUR", type:"University Fee", date:"2026-07-20", due_date:"2026-07-18", status:"Paid", branch:"Mumbai", payment_method:"International Wire", notes:"TU Munich semester 1 enrollment remittance." },
    { code:"INV-4215", student:"Arjun Sengupta", student_id:6, amount:"₹ 1,50,000", amount_value:150000, currency:"INR", type:"Tuition Instalment", date:"2026-07-19", due_date:"2026-07-16", status:"Paid", branch:"Guwahati HQ", payment_method:"Bank Transfer", notes:"B.Sc Nursing Year 1 fee instalment." },
    { code:"INV-4216", student:"Tanvi Deshmukh", student_id:7, amount:"₹ 35,000", amount_value:35000, currency:"INR", type:"Service Fee", date:"2026-07-18", due_date:"2026-08-02", status:"Pending", branch:"Mumbai", payment_method:"UPI (PhonePe)", notes:"Visa interview preparation & mock tests." },
    { code:"INV-4217", student:"Manav Chawla", student_id:8, amount:"$ 3,500", amount_value:294000, currency:"USD", type:"University Fee", date:"2026-07-17", due_date:"2026-07-14", status:"Paid", branch:"Delhi NCR", payment_method:"Wire Transfer", notes:"NYU admission confirmation deposit." },
    { code:"INV-4218", student:"Ishita Baruah", student_id:9, amount:"₹ 95,000", amount_value:95000, currency:"INR", type:"Tuition Instalment", date:"2026-07-16", due_date:"2026-08-10", status:"Pending", branch:"Guwahati HQ", payment_method:"Bank Transfer", notes:"GNM course semester fee instalment." },
    { code:"INV-4219", student:"Pradeep Reddy", student_id:10, amount:"₹ 1,75,000", amount_value:175000, currency:"INR", type:"Tuition Instalment", date:"2026-07-15", due_date:"2026-07-12", status:"Paid", branch:"Hyderabad", payment_method:"Demand Draft", notes:"M.S. Ramaiah University Allied Health fee." },
    { code:"INV-4220", student:"Nandini Saxena", student_id:11, amount:"₹ 48,000", amount_value:48000, currency:"INR", type:"Visa & Travel", date:"2026-07-14", due_date:"2026-07-08", status:"Overdue", branch:"Bengaluru", payment_method:"UPI", notes:"Australia biometrics & flight booking assistance." },
    { code:"INV-4221", student:"Devansh Jain", student_id:12, amount:"₹ 85,000", amount_value:85000, currency:"INR", type:"Application Fee", date:"2026-07-12", due_date:"2026-07-10", status:"Paid", branch:"Mumbai", payment_method:"Credit Card", notes:"Canada SDS visa application and GIC account setup." },
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
        { name:"Meera Shah", role:"Employee · Senior Counsellor", initials:"MS", status:"approved", time:"22 Jul · 10:14 AM", comment:"Submitted with flight, hotel and client meet taxi receipts.", step_order:0 },
        { name:"Rahul Deshmukh", role:"Branch Manager · Mumbai", initials:"RD", status:"approved", time:"22 Jul · 03:40 PM", comment:"Verified against quarterly branch outreach budget. Fully endorsed.", step_order:1 },
        { name:"Anjali Kapoor", role:"Finance · AP Lead", initials:"AK", status:"current", time:"In review · 6h", comment:"GST invoices verified. Passed for operational review.", step_order:2 },
        { name:"Vivek Ramanathan", role:"Director · Operations", initials:"VR", status:"upcoming", time:"Est. 24 Jul", comment:"", step_order:3 },
        { name:"Mohammad Iqbal", role:"CEO · Executive Sign-off", initials:"MI", status:"upcoming", time:"Est. 25 Jul", comment:"", step_order:4 },
        { name:"Payment Released", role:"Finance · Payouts", initials:"₹", status:"released", time:"Est. 26 Jul", comment:"Direct NEFT release within 24h.", step_order:5 },
      ]
    },
    {
      code:"REIMB-2026-0285", title:"North-East College Outreach & Seminars Tour", amount:"₹ 65,000", amount_value:65000, category:"Marketing & Events", submitted_by:"Pranab Barman", submitted_date:"23 Jul 2026 · 11:30 AM", period:"19 Jul – 22 Jul 2026", branch:"Guwahati HQ", attachments:5, status:"In Review", current_stage:3,
      steps:[
        { name:"Pranab Barman", role:"Regional Coordinator · North East", initials:"PB", status:"approved", time:"23 Jul · 11:30 AM", comment:"Conducting career guidance workshops in 4 nursing institutes.", step_order:0 },
        { name:"Mohammad Iqbal", role:"Branch Head · Guwahati HQ", initials:"MI", status:"approved", time:"23 Jul · 02:15 PM", comment:"Pre-approved high-impact campaign. Endorsed.", step_order:1 },
        { name:"Anjali Kapoor", role:"Finance · AP Lead", initials:"AK", status:"approved", time:"23 Jul · 05:45 PM", comment:"Venue hall hire & banner print receipts audited. Within budget.", step_order:2 },
        { name:"Vivek Ramanathan", role:"Director · Operations", initials:"VR", status:"current", time:"In review · 2h", comment:"Reviewing ROI from 120 seminar attendees.", step_order:3 },
        { name:"Mohammad Iqbal", role:"CEO · Executive Sign-off", initials:"MI", status:"upcoming", time:"Est. 25 Jul", comment:"", step_order:4 },
        { name:"Payment Released", role:"Finance · Payouts", initials:"₹", status:"released", time:"Est. 26 Jul", comment:"NEFT release pending.", step_order:5 },
      ]
    },
    {
      code:"REIMB-2026-0286", title:"UK University Delegates Annual Dinner & Networking", amount:"₹ 38,200", amount_value:38200, category:"Client Fair Advance", submitted_by:"Karan Mehta", submitted_date:"24 Jul 2026 · 09:45 AM", period:"21 Jul 2026", branch:"Delhi NCR", attachments:4, status:"In Review", current_stage:4,
      steps:[
        { name:"Karan Mehta", role:"Branch Head · Delhi NCR", initials:"KM", status:"approved", time:"24 Jul · 09:45 AM", comment:"Hosted dinner for King's College London and Manchester university deans.", step_order:0 },
        { name:"Karan Mehta", role:"Branch Manager · Delhi NCR", initials:"KM", status:"approved", time:"24 Jul · 10:15 AM", comment:"Self-sanctioned branch dinner allocation.", step_order:1 },
        { name:"Anjali Kapoor", role:"Finance · AP Lead", initials:"AK", status:"approved", time:"24 Jul · 12:30 PM", comment:"Itemized hotel banquet bill verified against attendee list.", step_order:2 },
        { name:"Vivek Ramanathan", role:"Director · Operations", initials:"VR", status:"approved", time:"24 Jul · 03:00 PM", comment:"High-value partner relationship meeting. Sanctioned.", step_order:3 },
        { name:"Mohammad Iqbal", role:"CEO · Executive Sign-off", initials:"MI", status:"current", time:"In review · 1h", comment:"Final executive sign-off required for disbursement.", step_order:4 },
        { name:"Payment Released", role:"Finance · Payouts", initials:"₹", status:"released", time:"Est. 26 Jul", comment:"Direct NEFT release.", step_order:5 },
      ]
    },
    {
      code:"REIMB-2026-0287", title:"Regional Office High-Speed Network & Router Setup", amount:"₹ 22,400", amount_value:22400, category:"Office Supplies", submitted_by:"Divya Rao", submitted_date:"24 Jul 2026 · 02:15 PM", period:"24 Jul 2026", branch:"Bengaluru", attachments:3, status:"In Review", current_stage:1,
      steps:[
        { name:"Divya Rao", role:"Branch Head · Bengaluru", initials:"DR", status:"approved", time:"24 Jul · 02:15 PM", comment:"Purchased Cisco dual-band gigabit routers for counseling cubicles.", step_order:0 },
        { name:"Divya Rao", role:"Branch Manager · Bengaluru", initials:"DR", status:"current", time:"In review · 30m", comment:"Awaiting branch head endorsement.", step_order:1 },
        { name:"Anjali Kapoor", role:"Finance · AP Lead", initials:"AK", status:"upcoming", time:"Est. 25 Jul", comment:"", step_order:2 },
        { name:"Vivek Ramanathan", role:"Director · Operations", initials:"VR", status:"upcoming", time:"Est. 26 Jul", comment:"", step_order:3 },
        { name:"Mohammad Iqbal", role:"CEO · Executive Sign-off", initials:"MI", status:"upcoming", time:"Est. 27 Jul", comment:"", step_order:4 },
        { name:"Payment Released", role:"Finance · Payouts", initials:"₹", status:"released", time:"Est. 28 Jul", comment:"NEFT payout.", step_order:5 },
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
  const b2bPartners = [
    { code: "B2B-101", name: "Rahul Deshmukh", company_name: "Apex Global Overseas Consultancy", email: "rahul@apexglobal.edu", phone: "+91 98200 44551", city: "Mumbai", branch: "Mumbai", profit_share_type: "percentage", partner_share_pct: 30, admin_share_pct: 70, flat_rate_amount: 25000, tier: "Gold Partner (30%)", status: "Active", total_students: 8, total_revenue: 680000, partner_earnings: 204000, admin_earnings: 476000, payout_balance: 45000, notes: "Premier education partner in Western Maharashtra." },
    { code: "B2B-102", name: "Vikram Singhania", company_name: "EduPathways International", email: "vikram@edupathways.in", phone: "+91 98111 88992", city: "Delhi", branch: "Delhi NCR", profit_share_type: "percentage", partner_share_pct: 35, admin_share_pct: 65, flat_rate_amount: 30000, tier: "Platinum Partner (35%)", status: "Active", total_students: 12, total_revenue: 1140000, partner_earnings: 399000, admin_earnings: 741000, payout_balance: 85000, notes: "Top volume recruiting partner for Canada & UK universities." },
    { code: "B2B-103", name: "Meera Shah", company_name: "Southern Skies Study Abroad", email: "meera@southernskies.com", phone: "+91 98450 12344", city: "Bengaluru", branch: "Bengaluru", profit_share_type: "percentage", partner_share_pct: 25, admin_share_pct: 75, flat_rate_amount: 25000, tier: "Silver Partner (25%)", status: "Active", total_students: 5, total_revenue: 410000, partner_earnings: 102500, admin_earnings: 307500, payout_balance: 22500, notes: "Specialized in Australian nursing & engineering admissions." },
    { code: "B2B-104", name: "Pranab Barman", company_name: "Brahmaputra Educational Affiliates", email: "pranab@brahmaputraedu.org", phone: "+91 94350 77112", city: "Guwahati", branch: "Guwahati HQ", profit_share_type: "flat_rate", partner_share_pct: 20, admin_share_pct: 80, flat_rate_amount: 20000, tier: "Associate Partner (20%)", status: "Active", total_students: 4, total_revenue: 320000, partner_earnings: 80000, admin_earnings: 240000, payout_balance: 10000, notes: "North-East regional affiliate focusing on UK foundation courses." },
  ];
  const b2cPartners = [
    { code: "B2C-201", name: "Aarav Sharma", ambassador_type: "Student Ambassador", email: "aarav.sharma@gmail.com", phone: "+91 98640 11223", city: "Guwahati", branch: "Guwahati HQ", reward_type: "flat_rate", reward_amount: 15000, reward_pct: 10, tier: "Gold Ambassador", status: "Active", total_referrals: 6, successful_admissions: 4, total_earnings: 60000, payout_balance: 15000, payout_mode: "UPI (aarav@oksbi)", notes: "University of Toronto 3rd year student. Highly active on Instagram." },
    { code: "B2C-202", name: "Pooja Das", ambassador_type: "Campus Influencer", email: "pooja.das@cotton.edu", phone: "+91 98540 99881", city: "Guwahati", branch: "Guwahati HQ", reward_type: "flat_rate", reward_amount: 15000, reward_pct: 10, tier: "Silver Ambassador", status: "Active", total_referrals: 5, successful_admissions: 3, total_earnings: 45000, payout_balance: 0, payout_mode: "Bank NEFT (HDFC 4921)", notes: "President of student council at Cotton University." },
    { code: "B2C-203", name: "Rohan Varma", ambassador_type: "Freelance Counselor", email: "rohan.varma@counsel.me", phone: "+91 98200 33445", city: "Mumbai", branch: "Mumbai", reward_type: "percentage", reward_amount: 20000, reward_pct: 12, tier: "Platinum Ambassador", status: "Active", total_referrals: 9, successful_admissions: 6, total_earnings: 95000, payout_balance: 25000, payout_mode: "UPI (rohan@icici)", notes: "Independent career mentor recommending students for overseas master's." },
    { code: "B2C-204", name: "Tanvi Deshmukh", ambassador_type: "Alumni Ambassador", email: "tanvi.deshmukh@alumni.monash.edu", phone: "+91 98111 66554", city: "Pune", branch: "Mumbai", reward_type: "flat_rate", reward_amount: 15000, reward_pct: 10, tier: "Silver Ambassador", status: "Active", total_referrals: 3, successful_admissions: 2, total_earnings: 30000, payout_balance: 15000, payout_mode: "Bank NEFT (SBI 8820)", notes: "Monash University graduate helping local candidates with visa & admission advice." },
  ];
  return { students, leads, applications, universities, colleges, courses, indiaStudents, invoices, employees, approvals, referralStudents, commissions, paymentRequests, branches, travelDrivers, travelAgencies, travelBookings, b2bPartners, b2cPartners };
}

// seedMemory removed — in-memory fallback disabled
