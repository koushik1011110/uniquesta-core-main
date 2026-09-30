import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { t as require_promise } from "../_libs/mysql2+[...].mjs";
import { n as compare, r as hash } from "../_libs/bcryptjs.mjs";
import { t as require_jsonwebtoken } from "../_libs/jsonwebtoken+[...].mjs";
import { a as numberType, i as literalType, n as booleanType, o as objectType, r as enumType, s as stringType, t as arrayType } from "../_libs/zod.mjs";
import processModule from "node:process";
import fs from "node:fs";
import path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/index.js
var ssr_exports = /* @__PURE__ */ __exportAll({
	default: () => server_default,
	t: () => renderErrorPage
});
var import_promise = /* @__PURE__ */ __toESM(require_promise());
var import_jsonwebtoken = /* @__PURE__ */ __toESM(require_jsonwebtoken());
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
var CAUSE_DEPTH_LIMIT = 5;
var DESCRIPTION_LENGTH_LIMIT = 8e3;
function describeError(error) {
	const parts = [];
	let current = error;
	for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
		if (!(current instanceof Error)) {
			parts.push(typeof current === "string" ? current : safeStringify(current));
			break;
		}
		const label = depth === 0 ? "" : "caused by: ";
		const status = describeStatus(current);
		parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
		current = current.cause;
	}
	return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error) {
	const { status, statusCode } = error;
	const value = status ?? statusCode;
	return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
function isErrorLike(value) {
	return value instanceof Error;
}
var originalConsoleError = console.error.bind(console);
console.error = (...args) => {
	originalConsoleError(...args.map((arg) => {
		if (!isErrorLike(arg)) return arg;
		record(arg);
		return describeError(arg);
	}));
};
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
var pool = null;
var useMemory = false;
var initPromise = null;
var memStore = {};
var memSeq = {};
function getMemTable(name) {
	if (!memStore[name]) {
		memStore[name] = /* @__PURE__ */ new Map();
		memSeq[name] = 1;
	}
	return memStore[name];
}
function nextMemId(name) {
	const id = memSeq[name] ?? 1;
	memSeq[name] = id + 1;
	return id;
}
function isMemoryMode() {
	return useMemory || !pool;
}
function getMemStore() {
	return memStore;
}
function memList(table) {
	const map = getMemTable(table);
	const byId = /* @__PURE__ */ new Map();
	for (const row of map.values()) {
		const key = row.id;
		if (key != null && !byId.has(key)) byId.set(key, row);
	}
	if (byId.size === 0) {
		const seen = /* @__PURE__ */ new Set();
		const out = [];
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
function memGet(table, id) {
	return getMemTable(table).get(id) ?? null;
}
function memCreate(table, data) {
	const tbl = getMemTable(table);
	const id = data.id ?? nextMemId(table);
	const row = {
		...data,
		id
	};
	tbl.set(id, row);
	if (row.code) tbl.set(row.code, row);
	if (row.email && table === "users") tbl.set(row.email, row);
	return row;
}
function memUpdate(table, id, patch) {
	const tbl = getMemTable(table);
	const existing = tbl.get(id);
	if (!existing) return null;
	const updated = {
		...existing,
		...patch,
		id: existing.id
	};
	tbl.set(id, updated);
	if (updated.code) tbl.set(updated.code, updated);
	if (updated.email && table === "users") tbl.set(updated.email, updated);
	if (typeof id === "string" && existing.id !== id) tbl.set(existing.id, updated);
	return updated;
}
function memDelete(table, id) {
	const tbl = getMemTable(table);
	const existing = tbl.get(id);
	if (!existing) return false;
	tbl.delete(id);
	tbl.delete(existing.id);
	if (existing.code) tbl.delete(existing.code);
	if (existing.email && table === "users") tbl.delete(existing.email);
	return true;
}
function loadDotEnv() {
	try {
		const envPath = path.resolve(processModule.cwd(), ".env");
		if (fs.existsSync(envPath)) {
			const content = fs.readFileSync(envPath, "utf-8");
			for (const line of content.split("\n")) {
				const trimmed = line.trim();
				if (!trimmed || trimmed.startsWith("#")) continue;
				const eqIdx = trimmed.indexOf("=");
				if (eqIdx > 0) {
					const key = trimmed.slice(0, eqIdx).trim();
					let val = trimmed.slice(eqIdx + 1).trim();
					if (val.startsWith("\"") && val.endsWith("\"") || val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
					processModule.env[key] = val;
				}
			}
		}
	} catch {}
}
function getEnv(name, fallback) {
	return ((typeof processModule !== "undefined" ? processModule.env : {}) ?? {})[name] ?? fallback;
}
async function initDb() {
	if (initPromise) return initPromise;
	initPromise = (async () => {
		loadDotEnv();
		const host = getEnv("DB_HOST", "127.0.0.1");
		const port = parseInt(getEnv("DB_PORT", "3306"), 10);
		const user = getEnv("DB_USER", "root");
		const password = getEnv("DB_PASSWORD", getEnv("DB_PASS", ""));
		const database = getEnv("DB_NAME", "uniquesta_abroad");
		const waitForDb = getEnv("DB_WAIT", "false") === "true";
		try {
			const tmp = await import_promise.createConnection({
				host,
				port,
				user,
				password
			});
			await tmp.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
			await tmp.end();
			pool = import_promise.createPool({
				host,
				port,
				user,
				password,
				database,
				waitForConnections: true,
				connectionLimit: 10,
				queueLimit: 0,
				enableKeepAlive: true
			});
			await pool.query("SELECT 1");
			await createTables();
			await seedIfEmpty();
			console.log(`[DB] Connected to MySQL ${host}:${port}/${database}`);
		} catch (e) {
			console.warn("[DB] MySQL not available, using in-memory store:", e?.message ?? e);
			useMemory = true;
			pool = null;
			seedMemory();
		}
		if (waitForDb && useMemory) console.warn("[DB] DB_WAIT=true but still in memory mode");
	})();
	return initPromise;
}
async function query(sql, params) {
	if (!pool || useMemory) throw new Error("DB not available (memory mode)");
	const [rows] = await pool.query(sql, params);
	return rows;
}
async function execute(sql, params) {
	if (!pool || useMemory) throw new Error("DB not available (memory mode)");
	const [result] = await pool.execute(sql, params);
	return result;
}
async function queryOne(sql, params) {
	return (await query(sql, params))[0] ?? null;
}
async function createTables() {
	if (!pool) return;
	const statements = `
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
  `.split(";").map((s) => s.trim()).filter(Boolean);
	for (const stmt of statements) await pool.query(stmt);
}
async function seedIfEmpty() {
	if (!pool) return;
	const [users] = await pool.query("SELECT COUNT(*) as c FROM users");
	if (users[0].c > 0) return;
	const mem = buildSeedData();
	for (const b of mem.branches) await pool.query("INSERT INTO branches (name,city,region,head,revenue,students) VALUES (?,?,?,?,?,?)", [
		b.name,
		b.city,
		b.region,
		b.head,
		b.revenue,
		b.students
	]);
	const hash = await (await import("../_libs/bcryptjs.mjs").then((n) => n.t)).hash("admin123", 10);
	await pool.query("INSERT INTO users (name,email,password_hash,role,branch) VALUES (?,?,?,?,?)", [
		"Mohammad Iqbal",
		"admin@uniquesta.com",
		hash,
		"super_admin",
		"Guwahati HQ"
	]);
	for (const s of mem.students) await pool.query("INSERT INTO students (code,name,email,phone,dob,passport,country,course,university,intake,counselor,branch,lead_score,stage,stage_index,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
		s.code,
		s.name,
		s.email,
		s.phone,
		s.dob,
		s.passport,
		s.country,
		s.course,
		s.university,
		s.intake,
		s.counselor,
		s.branch,
		s.lead_score,
		s.stage,
		s.stage_index,
		s.status
	]);
	for (const l of mem.leads) await pool.query("INSERT INTO leads (name,email,phone,source,score,city,status,assigned_to,branch) VALUES (?,?,?,?,?,?,?,?,?)", [
		l.name,
		l.email,
		l.phone,
		l.source,
		l.score,
		l.city,
		l.status,
		l.assigned_to,
		l.branch
	]);
	for (const a of mem.applications) await pool.query("INSERT INTO applications (code,student,university,program,intake,stage,progress,status) VALUES (?,?,?,?,?,?,?,?)", [
		a.code,
		a.student,
		a.university,
		a.program,
		a.intake,
		a.stage,
		a.progress,
		a.status
	]);
	for (const u of mem.universities) await pool.query("INSERT INTO universities (name,country,city,tier,courses,intakes,commission,rating) VALUES (?,?,?,?,?,?,?,?)", [
		u.name,
		u.country,
		u.city,
		u.tier,
		u.courses,
		u.intakes,
		u.commission,
		u.rating
	]);
	for (const c of mem.colleges) await pool.query("INSERT INTO colleges (code,name,state,city,affiliated_university,courses_offered,annual_intake,deadline,tuition_fee,hostel_fee,contact_person,contact_number,email,website,status,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
		c.code,
		c.name,
		c.state,
		c.city,
		c.affiliatedUniversity,
		JSON.stringify(c.coursesOffered),
		c.annualIntake,
		c.deadline,
		c.tuitionFee,
		c.hostelFee,
		c.contactPerson,
		c.contactNumber,
		c.email,
		c.website,
		c.status,
		c.notes
	]);
	for (const cr of mem.courses) await pool.query("INSERT INTO courses (code,name,category,duration,eligibility,tuition_fee,registration_fee,seats_available,total_seats,session,min_percentage,description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [
		cr.code,
		cr.name,
		cr.category,
		cr.duration,
		cr.eligibility,
		cr.tuitionFee,
		cr.registrationFee,
		cr.seatsAvailable,
		cr.totalSeats,
		cr.session,
		cr.minPercentage,
		cr.description
	]);
	for (const s of mem.indiaStudents) await pool.query("INSERT INTO india_students (code,name,phone,email,dob,gender,category,father_name,father_phone,address,counselor,branch,preferred_state,preferred_college,preferred_course,session,stage_index,registration_fee_paid,total_fee,paid_fee,scholarship,discount,remarks,applied_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
		s.code,
		s.name,
		s.phone,
		s.email,
		s.dob,
		s.gender,
		s.category,
		s.fatherName,
		s.fatherPhone,
		s.address,
		s.counselor,
		s.branch,
		s.preferredState,
		s.preferredCollege,
		s.preferredCourse,
		s.session,
		s.stageIndex,
		s.registrationFeePaid,
		s.totalFee,
		s.paidFee,
		s.scholarship,
		s.discount,
		s.remarks,
		s.appliedDate
	]);
	for (const inv of mem.invoices) await pool.query("INSERT INTO invoices (code,student,amount,amount_value,currency,type,date,status) VALUES (?,?,?,?,?,?,?,?)", [
		inv.code,
		inv.student,
		inv.amount,
		inv.amount_value,
		inv.currency,
		inv.type,
		inv.date,
		inv.status
	]);
	for (const e of mem.employees) await pool.query("INSERT INTO employees (name,email,phone,role,branch,status) VALUES (?,?,?,?,?,?)", [
		e.name,
		e.email,
		e.phone,
		e.role,
		e.branch,
		e.status
	]);
	for (const ap of mem.approvals) {
		const [res] = await pool.query("INSERT INTO approvals (code,title,amount,amount_value,category,submitted_by,submitted_date,period,branch,attachments,status,current_stage) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [
			ap.code,
			ap.title,
			ap.amount,
			ap.amount_value,
			ap.category,
			ap.submitted_by,
			ap.submitted_date,
			ap.period,
			ap.branch,
			ap.attachments,
			ap.status,
			ap.current_stage
		]);
		const id = res.insertId;
		for (const st of ap.steps) await pool.query("INSERT INTO approval_steps (approval_id,name,role,initials,status,time,comment,step_order) VALUES (?,?,?,?,?,?,?,?)", [
			id,
			st.name,
			st.role,
			st.initials,
			st.status,
			st.time,
			st.comment,
			st.step_order
		]);
	}
	for (const r of mem.referralStudents) await pool.query("INSERT INTO referral_students (code,name,email,country,university,program,intake,status,stage,referred_date,commission_est) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [
		r.code,
		r.name,
		r.email,
		r.country,
		r.university,
		r.program,
		r.intake,
		r.status,
		r.stage,
		r.referred_date,
		r.commission_est
	]);
	for (const c of mem.commissions) await pool.query("INSERT INTO commissions (inv_id,student,university,intake,course_fee,rate,amount,status,paid_date,utr) VALUES (?,?,?,?,?,?,?,?,?,?)", [
		c.inv_id,
		c.student,
		c.university,
		c.intake,
		c.course_fee,
		c.rate,
		c.amount,
		c.status,
		c.paid_date,
		c.utr
	]);
	for (const p of mem.paymentRequests) await pool.query("INSERT INTO payment_requests (req_id,date,amount,bank,status,utr,notes) VALUES (?,?,?,?,?,?,?)", [
		p.req_id,
		p.date,
		p.amount,
		p.bank,
		p.status,
		p.utr,
		p.notes
	]);
	await pool.query("INSERT INTO settings (id,legal_name,support_email,two_factor,whatsapp_notify) VALUES (1,'Uniquesta Overseas Pvt Ltd','care@uniquesta.com',1,1) ON DUPLICATE KEY UPDATE legal_name=VALUES(legal_name)");
}
function buildSeedData() {
	return {
		students: [],
		leads: [
			{
				name: "Ishaan Bhatt",
				email: "ishaan.b@gmail.com",
				phone: "+91 98200 11111",
				source: "Instagram Ad",
				score: 84,
				city: "Pune",
				status: "New Enquiry",
				assigned_to: "Mohammad Iqbal",
				branch: "Guwahati HQ"
			},
			{
				name: "Riya Malhotra",
				email: "riya.m@gmail.com",
				phone: "+91 98111 22222",
				source: "Website Form",
				score: 71,
				city: "Delhi",
				status: "New Enquiry",
				assigned_to: "Mohammad Iqbal",
				branch: "Guwahati HQ"
			},
			{
				name: "Aditya Ghosh",
				email: "aditya.g@gmail.com",
				phone: "+91 98300 33333",
				source: "Referral",
				score: 66,
				city: "Kolkata",
				status: "New Enquiry",
				assigned_to: "Mohammad Iqbal",
				branch: "Guwahati HQ"
			},
			{
				name: "Neha Pillai",
				email: "neha.p@gmail.com",
				phone: "+91 98400 44444",
				source: "Google Ads",
				score: 78,
				city: "Kochi",
				status: "Contacted",
				assigned_to: "Mohammad Iqbal",
				branch: "Guwahati HQ"
			},
			{
				name: "Sameer Khan",
				email: "sameer.k@gmail.com",
				phone: "+91 98500 55555",
				source: "Walk-in",
				score: 92,
				city: "Mumbai",
				status: "Contacted",
				assigned_to: "Mohammad Iqbal",
				branch: "Guwahati HQ"
			},
			{
				name: "Meera Kapoor",
				email: "meera.k@gmail.com",
				phone: "+91 98600 66666",
				source: "Education Fair",
				score: 88,
				city: "Bengaluru",
				status: "Qualified",
				assigned_to: "Mohammad Iqbal",
				branch: "Guwahati HQ"
			},
			{
				name: "Karthik Rao",
				email: "karthik.r@gmail.com",
				phone: "+91 98700 77777",
				source: "Referral",
				score: 81,
				city: "Hyderabad",
				status: "Qualified",
				assigned_to: "Mohammad Iqbal",
				branch: "Guwahati HQ"
			},
			{
				name: "Zoya Sheikh",
				email: "zoya.s@gmail.com",
				phone: "+91 98800 88888",
				source: "Website Form",
				score: 74,
				city: "Lucknow",
				status: "Qualified",
				assigned_to: "Mohammad Iqbal",
				branch: "Guwahati HQ"
			},
			{
				name: "Devansh Jain",
				email: "devansh.j@gmail.com",
				phone: "+91 98900 99999",
				source: "Instagram Ad",
				score: 90,
				city: "Ahmedabad",
				status: "Counselling Booked",
				assigned_to: "Mohammad Iqbal",
				branch: "Guwahati HQ"
			}
		],
		applications: [],
		universities: [
			{
				name: "University of Toronto",
				country: "Canada",
				city: "Toronto",
				tier: "Tier 1",
				courses: 214,
				intakes: "Fall, Winter",
				commission: "15%",
				rating: 4.8
			},
			{
				name: "Monash University",
				country: "Australia",
				city: "Melbourne",
				tier: "Tier 1",
				courses: 186,
				intakes: "Feb, Jul",
				commission: "18%",
				rating: 4.7
			},
			{
				name: "University of Manchester",
				country: "UK",
				city: "Manchester",
				tier: "Tier 1",
				courses: 240,
				intakes: "Sept, Jan",
				commission: "14%",
				rating: 4.6
			},
			{
				name: "New York University",
				country: "USA",
				city: "New York",
				tier: "Tier 1",
				courses: 302,
				intakes: "Fall, Spring",
				commission: "10%",
				rating: 4.9
			},
			{
				name: "TU Munich",
				country: "Germany",
				city: "Munich",
				tier: "Tier 1",
				courses: 128,
				intakes: "Winter, Summer",
				commission: "€ 2,400",
				rating: 4.7
			},
			{
				name: "King's College London",
				country: "UK",
				city: "London",
				tier: "Tier 1",
				courses: 198,
				intakes: "Sept",
				commission: "15%",
				rating: 4.6
			}
		],
		colleges: [
			{
				code: "COL-001",
				name: "M. S. Ramaiah University of Applied Sciences",
				state: "Karnataka",
				city: "Bengaluru",
				affiliatedUniversity: "Autonomous State University",
				coursesOffered: [
					"B.Sc Nursing",
					"B.Pharm",
					"MBA",
					"BCA",
					"BPT"
				],
				annualIntake: 450,
				deadline: "30 Aug 2026",
				tuitionFee: "₹ 1,80,000 / year",
				hostelFee: "₹ 85,000 / year",
				contactPerson: "Dr. K. S. Murthy",
				contactNumber: "+91 98450 12345",
				email: "admissions@msruas.ac.in",
				website: "www.msruas.ac.in",
				status: "Admissions Open",
				notes: "Direct admission for high scoring candidates."
			},
			{
				code: "COL-002",
				name: "Guwahati Medical College & Institute of Nursing",
				state: "Assam",
				city: "Guwahati",
				affiliatedUniversity: "Srimanta Sankaradeva University of Health Sciences",
				coursesOffered: [
					"B.Sc Nursing",
					"GNM",
					"BMLT",
					"Radiology",
					"OT Technology"
				],
				annualIntake: 280,
				deadline: "15 Sep 2026",
				tuitionFee: "₹ 1,10,000 / year",
				hostelFee: "₹ 55,000 / year",
				contactPerson: "Dr. Anupam Baruah",
				contactNumber: "+91 94350 98765",
				email: "admissions@gmch-nursing.edu.in",
				website: "www.gmch.assam.gov.in",
				status: "Admissions Open",
				notes: "Assam state nursing council approved."
			},
			{
				code: "COL-003",
				name: "Apollo College of Nursing & Allied Health",
				state: "Tamil Nadu",
				city: "Chennai",
				affiliatedUniversity: "The Tamil Nadu Dr. M.G.R. Medical University",
				coursesOffered: [
					"B.Sc Nursing",
					"ANM",
					"GNM",
					"BPT",
					"OT Technology"
				],
				annualIntake: 320,
				deadline: "25 Aug 2026",
				tuitionFee: "₹ 1,65,000 / year",
				hostelFee: "₹ 90,000 / year",
				contactPerson: "Sister Rosamma Thomas",
				contactNumber: "+91 98840 76543",
				email: "admissions@apollonursing.edu.in",
				website: "www.apollonursing.edu.in",
				status: "Near Capacity",
				notes: "100% placement guarantee."
			},
			{
				code: "COL-004",
				name: "Assam Down Town University",
				state: "Assam",
				city: "Guwahati",
				affiliatedUniversity: "UGC Recognized Private University",
				coursesOffered: [
					"B.Pharm",
					"D.Pharm",
					"BBA",
					"MBA",
					"BCA",
					"Hotel Management"
				],
				annualIntake: 600,
				deadline: "20 Aug 2026",
				tuitionFee: "₹ 1,25,000 / year",
				hostelFee: "₹ 65,000 / year",
				contactPerson: "Pranab Goswami",
				contactNumber: "+91 98640 44332",
				email: "admissions@adtu.in",
				website: "www.adtu.in",
				status: "Active",
				notes: "Scholarships available."
			}
		],
		courses: [
			{
				code: "CRS-001",
				name: "B.Sc Nursing",
				category: "Nursing",
				duration: "4 Years",
				eligibility: "10+2 with PCB & English (Min 45%)",
				tuitionFee: "₹ 1,50,000 / year",
				registrationFee: "₹ 10,000",
				seatsAvailable: 34,
				totalSeats: 120,
				session: "2026-27",
				minPercentage: "45%",
				description: "Comprehensive 4-year degree course."
			},
			{
				code: "CRS-002",
				name: "GNM (General Nursing & Midwifery)",
				category: "Nursing",
				duration: "3 Years",
				eligibility: "10+2 Any Stream (Min 40%)",
				tuitionFee: "₹ 95,000 / year",
				registrationFee: "₹ 5,000",
				seatsAvailable: 18,
				totalSeats: 80,
				session: "2026-27",
				minPercentage: "40%",
				description: "Diploma course focused on general nursing."
			},
			{
				code: "CRS-003",
				name: "BPT (Bachelor of Physiotherapy)",
				category: "Allied Health",
				duration: "4.5 Years",
				eligibility: "10+2 PCB (Min 50%)",
				tuitionFee: "₹ 1,60,000 / year",
				registrationFee: "₹ 10,000",
				seatsAvailable: 22,
				totalSeats: 60,
				session: "2026-27",
				minPercentage: "50%",
				description: "Professional degree covering biomechanics."
			},
			{
				code: "CRS-004",
				name: "B.Pharm (Bachelor of Pharmacy)",
				category: "Pharmacy",
				duration: "4 Years",
				eligibility: "10+2 PCB / PCM (Min 50%)",
				tuitionFee: "₹ 1,45,000 / year",
				registrationFee: "₹ 10,000",
				seatsAvailable: 28,
				totalSeats: 100,
				session: "2026-27",
				minPercentage: "50%",
				description: "PCI approved 4-year degree."
			}
		],
		indiaStudents: [],
		invoices: [
			{
				code: "INV-4210",
				student: "Priya Nair",
				amount: "₹ 1,24,000",
				amount_value: 124e3,
				currency: "INR",
				type: "Tuition Instalment",
				date: "2026-07-23",
				status: "Paid"
			},
			{
				code: "INV-4211",
				student: "Rohit Verma",
				amount: "₹ 45,000",
				amount_value: 45e3,
				currency: "INR",
				type: "Service Fee",
				date: "2026-07-22",
				status: "Paid"
			},
			{
				code: "INV-4212",
				student: "Ananya Iyer",
				amount: "₹ 82,500",
				amount_value: 82500,
				currency: "INR",
				type: "Application Fee",
				date: "2026-07-22",
				status: "Pending"
			},
			{
				code: "INV-4213",
				student: "Vikram Singh",
				amount: "₹ 2,10,000",
				amount_value: 21e4,
				currency: "INR",
				type: "Visa & Travel",
				date: "2026-07-21",
				status: "Overdue"
			},
			{
				code: "INV-4214",
				student: "Sneha Kulkarni",
				amount: "€ 6,200",
				amount_value: 6200,
				currency: "EUR",
				type: "University Fee",
				date: "2026-07-20",
				status: "Paid"
			}
		],
		employees: [
			{
				name: "Meera Shah",
				email: "meera@uniquesta.com",
				phone: "+91 98200 11111",
				role: "Senior Counsellor",
				branch: "Mumbai",
				status: "Active"
			},
			{
				name: "Karan Mehta",
				email: "karan@uniquesta.com",
				phone: "+91 98200 22222",
				role: "Counsellor",
				branch: "Delhi NCR",
				status: "Active"
			},
			{
				name: "Divya Rao",
				email: "divya@uniquesta.com",
				phone: "+91 98200 33333",
				role: "Regional Head",
				branch: "Bengaluru",
				status: "On Leave"
			},
			{
				name: "Harpreet Kaur",
				email: "harpreet@uniquesta.com",
				phone: "+91 98200 44444",
				role: "Visa Officer",
				branch: "Chandigarh",
				status: "Active"
			},
			{
				name: "Rahul Reddy",
				email: "rahul.r@uniquesta.com",
				phone: "+91 98200 55555",
				role: "Counsellor",
				branch: "Hyderabad",
				status: "Active"
			},
			{
				name: "Anita Thomas",
				email: "anita@uniquesta.com",
				phone: "+91 98200 66666",
				role: "Branch Manager",
				branch: "Kochi",
				status: "Active"
			}
		],
		approvals: [{
			code: "REIMB-2026-0284",
			title: "Client visit — Bengaluru university fair",
			amount: "₹ 48,650",
			amount_value: 48650,
			category: "Travel & Meals",
			submitted_by: "Meera Shah",
			submitted_date: "22 Jul 2026 · 10:14 AM",
			period: "18 Jul – 21 Jul 2026",
			branch: "Mumbai · Andheri West",
			attachments: 6,
			status: "In Review",
			current_stage: 2,
			steps: [
				{
					name: "Meera Shah",
					role: "Employee · Senior Counsellor",
					initials: "MS",
					status: "approved",
					time: "22 Jul · 10:14 AM",
					comment: "Submitted with bills.",
					step_order: 0
				},
				{
					name: "Rahul Deshmukh",
					role: "Branch Manager · Mumbai",
					initials: "RD",
					status: "approved",
					time: "22 Jul · 03:40 PM",
					comment: "Verified against plan.",
					step_order: 1
				},
				{
					name: "Anjali Kapoor",
					role: "Finance · AP Lead",
					initials: "AK",
					status: "current",
					time: "In review · 6h",
					comment: "Awaiting cab receipt category.",
					step_order: 2
				},
				{
					name: "Vivek Ramanathan",
					role: "Director · Operations",
					initials: "VR",
					status: "upcoming",
					time: "Est. 24 Jul",
					comment: "",
					step_order: 3
				},
				{
					name: "Neha Malhotra",
					role: "CEO",
					initials: "NM",
					status: "upcoming",
					time: "Est. 25 Jul",
					comment: "",
					step_order: 4
				},
				{
					name: "Payment Released",
					role: "Finance · Payouts",
					initials: "₹",
					status: "released",
					time: "Est. 26 Jul",
					comment: "NEFT within 24h.",
					step_order: 5
				}
			]
		}],
		referralStudents: [],
		commissions: [],
		paymentRequests: [{
			req_id: "PR-2026-044",
			date: "2026-07-10",
			amount: "₹ 3,50,000",
			bank: "HDFC Bank (**** 4921)",
			status: "Completed",
			utr: "UTR994820194",
			notes: "Payout for June Intake"
		}, {
			req_id: "PR-2026-049",
			date: "2026-07-21",
			amount: "₹ 2,00,000",
			bank: "HDFC Bank (**** 4921)",
			status: "Processing",
			utr: "Batch #882-P",
			notes: "Part payout"
		}],
		branches: [
			{
				name: "Guwahati HQ",
				city: "Guwahati",
				region: "North East",
				head: "Mohammad Iqbal",
				revenue: 9.8,
				students: 2140
			},
			{
				name: "Mumbai",
				city: "Mumbai",
				region: "West",
				head: "Rahul Deshmukh",
				revenue: 9.8,
				students: 2140
			},
			{
				name: "Delhi NCR",
				city: "Delhi",
				region: "North",
				head: "Karan Mehta",
				revenue: 8.4,
				students: 1876
			},
			{
				name: "Bengaluru",
				city: "Bengaluru",
				region: "South",
				head: "Divya Rao",
				revenue: 7.6,
				students: 1642
			},
			{
				name: "Hyderabad",
				city: "Hyderabad",
				region: "South",
				head: "Rahul Reddy",
				revenue: 6.1,
				students: 1310
			}
		],
		travelDrivers: [
			{
				name: "Rajesh Sharma",
				phone: "+91 98200 45678",
				vehicle_type: "32-Seater Luxury AC Bus",
				vehicle_number: "AS-01-BK-9921",
				experience: "8 years",
				rating: 4.9,
				status: "Available"
			},
			{
				name: "Bikram Das",
				phone: "+91 98540 22334",
				vehicle_type: "Force Traveller (17-Seater)",
				vehicle_number: "AS-01-TC-4402",
				experience: "5 years",
				rating: 4.8,
				status: "On Trip"
			},
			{
				name: "Suraj Singh",
				phone: "+91 94350 99881",
				vehicle_type: "Toyota Innova Crysta (7-Seater)",
				vehicle_number: "AS-01-EA-1124",
				experience: "6 years",
				rating: 4.9,
				status: "On Trip"
			},
			{
				name: "Manish Choudhury",
				phone: "+91 98641 55667",
				vehicle_type: "45-Seater Semi-Sleeper Coach",
				vehicle_number: "AS-01-MX-8833",
				experience: "10 years",
				rating: 4.7,
				status: "Available"
			},
			{
				name: "Pranab Kalita",
				phone: "+91 98311 77442",
				vehicle_type: "Swift Dzire Sedan (4-Seater)",
				vehicle_number: "AS-01-DZ-3390",
				experience: "4 years",
				rating: 4.8,
				status: "Available"
			}
		],
		travelAgencies: [
			{
				name: "Royal Wheels & Tours",
				contact_person: "Vikram Singhania",
				phone: "+91 98540 11223",
				email: "info@royalwheels.com",
				city: "Guwahati",
				commission_tier: "Primary Vendor (Wholesale)"
			},
			{
				name: "Himalayan Express Fleet Agency",
				contact_person: "Tenzin Norbu",
				phone: "+91 94350 77889",
				email: "booking@himalayanexpress.in",
				city: "Shillong / Guwahati",
				commission_tier: "Fleet Partner"
			},
			{
				name: "Green Valley Bus Services",
				contact_person: "Altaf Hussain",
				phone: "+91 98111 88990",
				email: "ops@greenvalleybus.com",
				city: "Silchar",
				commission_tier: "Bus Fleet Operator"
			},
			{
				name: "Direct Customer (In-house / Direct)",
				contact_person: "Admin Office",
				phone: "+91 98200 11111",
				email: "travel@uniquesta.com",
				city: "Guwahati HQ",
				commission_tier: "100% In-house Margin"
			}
		],
		travelBookings: [
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
				customer_price: 32e3,
				agency_cost: 24e3,
				admin_margin: 8e3,
				total_amount: "₹ 32,000",
				amount_value: 32e3,
				payment_status: "Partial",
				agency_payment_status: "Pending Completion",
				assigned_agency: "Royal Wheels & Tours",
				agency_contact: "+91 98540 11223",
				assigned_driver: "Bikram Das",
				driver_phone: "+91 98540 22334",
				vehicle_number: "AS-01-TC-4402",
				trip_status: "Assigned to Driver",
				notes: "Early morning 6:30 AM pickup from Paltan Bazar. AC required, 2 child passengers.",
				status: "Active"
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
				status: "Active"
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
				customer_price: 65e3,
				agency_cost: 5e4,
				admin_margin: 15e3,
				total_amount: "₹ 65,000",
				amount_value: 65e3,
				payment_status: "Paid",
				agency_payment_status: "₹20,000 Advance Released",
				assigned_agency: "Green Valley Bus Services",
				agency_contact: "+91 98111 88990",
				assigned_driver: "Manish Choudhury",
				driver_phone: "+91 98641 55667",
				vehicle_number: "AS-01-MX-8833",
				trip_status: "Booking Confirmed",
				notes: "Luggage space for 38 students. PA system & emergency first-aid kit required.",
				status: "Active"
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
				status: "Active"
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
				customer_price: 28e3,
				agency_cost: 21e3,
				admin_margin: 7e3,
				total_amount: "₹ 28,000",
				amount_value: 28e3,
				payment_status: "Paid",
				agency_payment_status: "Paid",
				assigned_agency: "Royal Wheels & Tours",
				agency_contact: "+91 98540 11223",
				assigned_driver: "Rajesh Sharma",
				driver_phone: "+91 98200 45678",
				vehicle_number: "AS-01-BK-9921",
				trip_status: "Booking Confirmed",
				notes: "Corporate executive retreat. Refreshments & bottled water inside bus.",
				status: "Active"
			}
		]
	};
}
function seedMemory() {
	const data = buildSeedData();
	const pushMany = (tbl, rows) => {
		const m = getMemTable(tbl);
		for (const r of rows) {
			const id = r.id ?? r.code ?? r.req_id ?? r.inv_id ?? nextMemId(tbl);
			const row = {
				...r,
				id
			};
			m.set(id, row);
			if (r.code) m.set(r.code, row);
			if (r.req_id) m.set(r.req_id, row);
			if (r.inv_id) m.set(r.inv_id, row);
			if (r.email && tbl === "users") m.set(r.email, row);
		}
	};
	pushMany("users", [{
		id: 1,
		name: "Mohammad Iqbal",
		email: "admin@uniquesta.com",
		password_hash: "$2b$10$RMi2Kk9fjzFc68wCSK6F6us0RnJB56Z.JV4lWDfDEQ2xm9qNr0DzO",
		role: "super_admin",
		branch: "Guwahati HQ"
	}]);
	pushMany("branches", data.branches.map((b, i) => ({
		id: i + 1,
		...b
	})));
	pushMany("students", data.students.map((s, i) => ({
		id: i + 1,
		...s
	})));
	pushMany("leads", data.leads.map((l, i) => ({
		id: i + 1,
		...l
	})));
	pushMany("applications", data.applications.map((a, i) => ({
		id: i + 1,
		...a
	})));
	pushMany("universities", data.universities.map((u, i) => ({
		id: i + 1,
		...u
	})));
	pushMany("colleges", data.colleges.map((c, i) => ({
		id: i + 1,
		...c,
		courses_offered: c.coursesOffered
	})));
	pushMany("courses", data.courses.map((c, i) => ({
		id: i + 1,
		...c
	})));
	pushMany("india_students", data.indiaStudents.map((s, i) => ({
		id: i + 1,
		...s
	})));
	pushMany("invoices", data.invoices.map((inv, i) => ({
		id: i + 1,
		...inv
	})));
	pushMany("employees", data.employees.map((e, i) => ({
		id: i + 1,
		...e
	})));
	data.approvals.forEach((ap, i) => {
		const aid = i + 1;
		pushMany("approvals", [{
			id: aid,
			...ap
		}]);
		ap.steps.forEach((st, idx) => {
			pushMany("approval_steps", [{
				id: idx + 1 + i * 10,
				approval_id: aid,
				...st
			}]);
		});
	});
	pushMany("referral_students", data.referralStudents.map((r, i) => ({
		id: i + 1,
		...r
	})));
	pushMany("commissions", data.commissions.map((c, i) => ({
		id: i + 1,
		...c
	})));
	pushMany("payment_requests", data.paymentRequests.map((p, i) => ({
		id: i + 1,
		...p
	})));
	pushMany("travel_drivers", data.travelDrivers.map((d, i) => ({
		id: i + 1,
		...d
	})));
	pushMany("travel_agencies", data.travelAgencies.map((a, i) => ({
		id: i + 1,
		...a
	})));
	pushMany("travel_bookings", data.travelBookings.map((b, i) => ({
		id: i + 1,
		...b
	})));
	pushMany("settings", [{
		id: 1,
		legal_name: "Uniquesta Overseas Pvt Ltd",
		support_email: "care@uniquesta.com",
		two_factor: true,
		whatsapp_notify: true
	}]);
	for (const k of Object.keys(memSeq)) {
		const tbl = memStore[k];
		if (tbl) memSeq[k] = tbl.size + 10;
	}
}
var JWT_SECRET = typeof processModule !== "undefined" && processModule.env?.JWT_SECRET || "uniquesta_dev_secret_change_in_prod_32chars";
var JWT_EXPIRES = "7d";
async function hashPassword(password) {
	return hash(password, 10);
}
async function verifyPassword(password, hash) {
	return compare(password, hash);
}
function signToken(payload) {
	return import_jsonwebtoken.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}
function verifyToken(token) {
	try {
		return import_jsonwebtoken.default.verify(token, JWT_SECRET);
	} catch {
		return null;
	}
}
function getTokenFromRequest(req) {
	const auth = req.headers.get("authorization");
	if (auth?.startsWith("Bearer ")) return auth.slice(7);
	const m = (req.headers.get("cookie") ?? "").match(/(?:^|;\s*)token=([^;]+)/);
	if (m) return decodeURIComponent(m[1]);
	return null;
}
function authMiddleware(req) {
	const token = getTokenFromRequest(req);
	if (!token) return null;
	return verifyToken(token);
}
function requireAuth(req) {
	const payload = authMiddleware(req);
	if (!payload) throw jsonError(401, "Unauthorized: missing or invalid token");
	return payload;
}
function jsonError(status, message, details) {
	const err = new Error(message);
	err.status = status;
	err.details = details;
	return err;
}
var loginSchema = objectType({
	email: stringType().email(),
	password: stringType().min(6)
});
var registerSchema = objectType({
	name: stringType().min(2).max(100),
	email: stringType().email(),
	password: stringType().min(6),
	role: stringType().optional(),
	branch: stringType().optional()
});
var studentSchema = objectType({
	name: stringType().min(2),
	email: stringType().email(),
	phone: stringType().min(7),
	dob: stringType().optional(),
	passport: stringType().optional(),
	country: stringType().min(2),
	course: stringType().min(2),
	university: stringType().min(2),
	intake: stringType().min(2),
	counselor: stringType().optional(),
	branch: stringType().min(2),
	lead_score: numberType().min(0).max(100).optional(),
	stage: stringType().optional(),
	stage_index: numberType().optional(),
	status: stringType().optional()
});
var leadSchema = objectType({
	name: stringType().min(2),
	email: stringType().email().optional().or(literalType("")),
	phone: stringType().optional(),
	source: stringType().min(2),
	score: numberType().min(0).max(100).optional(),
	city: stringType().min(2),
	status: stringType().optional(),
	assigned_to: stringType().optional(),
	branch: stringType().optional()
});
var applicationSchema = objectType({
	student: stringType().min(2),
	student_id: numberType().optional(),
	university: stringType().min(2),
	program: stringType().min(2),
	intake: stringType().min(2),
	stage: stringType().optional(),
	progress: numberType().min(0).max(100).optional(),
	status: stringType().optional()
});
var universitySchema = objectType({
	name: stringType().min(2),
	country: stringType().min(2),
	city: stringType().min(2),
	tier: stringType().optional(),
	courses: numberType().optional(),
	intakes: stringType().min(2),
	commission: stringType().min(1),
	rating: numberType().min(0).max(5).optional()
});
var collegeSchema = objectType({
	name: stringType().min(2),
	state: stringType().min(2),
	city: stringType().min(2),
	affiliatedUniversity: stringType().min(2),
	coursesOffered: arrayType(stringType()).optional(),
	annualIntake: numberType().optional(),
	deadline: stringType().optional(),
	tuitionFee: stringType().optional(),
	hostelFee: stringType().optional(),
	contactPerson: stringType().optional(),
	contactNumber: stringType().optional(),
	email: stringType().email().optional().or(literalType("")),
	website: stringType().optional(),
	status: stringType().optional(),
	notes: stringType().optional()
});
var courseSchema = objectType({
	name: stringType().min(2),
	category: stringType().min(2),
	duration: stringType().min(1),
	eligibility: stringType().min(5),
	tuitionFee: stringType().min(2),
	registrationFee: stringType().min(1),
	seatsAvailable: numberType().optional(),
	totalSeats: numberType().optional(),
	session: stringType().min(2),
	minPercentage: stringType().optional(),
	description: stringType().optional()
});
var indiaStudentSchema = objectType({
	name: stringType().min(2),
	phone: stringType().min(7),
	email: stringType().email(),
	dob: stringType().optional(),
	gender: stringType().optional(),
	category: stringType().optional(),
	fatherName: stringType().optional(),
	fatherPhone: stringType().optional(),
	address: stringType().optional(),
	counselor: stringType().optional(),
	branch: stringType().min(2),
	preferredState: stringType().optional(),
	preferredCollege: stringType().optional(),
	preferredCourse: stringType().optional(),
	session: stringType().min(2),
	stageIndex: numberType().optional(),
	registrationFeePaid: booleanType().optional(),
	totalFee: numberType().optional(),
	paidFee: numberType().optional(),
	scholarship: numberType().optional(),
	discount: numberType().optional(),
	remarks: stringType().optional(),
	appliedDate: stringType().optional()
});
var invoiceSchema = objectType({
	student: stringType().min(2),
	student_id: numberType().optional(),
	amount: stringType().min(1),
	amount_value: numberType().optional(),
	currency: stringType().optional(),
	type: stringType().min(2),
	date: stringType().optional(),
	status: stringType().optional()
});
var employeeSchema = objectType({
	name: stringType().min(2),
	email: stringType().email().optional().or(literalType("")),
	phone: stringType().optional(),
	role: stringType().min(2),
	designation: stringType().optional(),
	branch: stringType().min(2),
	reports_to: stringType().optional().nullable(),
	status: stringType().optional(),
	create_login: booleanType().optional(),
	password: stringType().optional()
});
var approvalSchema = objectType({
	title: stringType().min(5),
	amount: stringType().min(1),
	amount_value: numberType().optional(),
	category: stringType().min(2),
	submitted_by: stringType().optional(),
	period: stringType().optional(),
	branch: stringType().min(2),
	attachments: numberType().optional(),
	status: stringType().optional()
});
var approvalStepUpdateSchema = objectType({
	status: enumType([
		"approved",
		"rejected",
		"current",
		"pending",
		"upcoming",
		"released"
	]),
	comment: stringType().optional()
});
var referralSchema = objectType({
	name: stringType().min(2),
	email: stringType().email(),
	country: stringType().min(2),
	university: stringType().min(2),
	program: stringType().min(2),
	intake: stringType().min(2),
	status: stringType().optional(),
	stage: stringType().optional(),
	commission_est: stringType().optional()
});
var b2bPartnerSchema = objectType({
	name: stringType().min(2),
	company_name: stringType().min(2),
	email: stringType().email(),
	phone: stringType().min(5),
	city: stringType().min(2),
	branch: stringType().optional(),
	profit_share_type: enumType(["percentage", "flat"]).optional(),
	partner_share_pct: numberType().min(0).max(100).optional(),
	flat_rate_amount: numberType().min(0).optional(),
	tier: stringType().optional(),
	status: stringType().optional(),
	notes: stringType().optional()
});
function parseOrThrow(schema, data) {
	const res = schema.safeParse(data);
	if (!res.success) {
		const err = /* @__PURE__ */ new Error("Validation failed");
		err.status = 400;
		err.details = res.error.flatten();
		throw err;
	}
	return res.data;
}
function json(data, status = 200, extraHeaders = {}) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"content-type": "application/json",
			"access-control-allow-origin": "*",
			"access-control-allow-headers": "*",
			"access-control-allow-methods": "*",
			...extraHeaders
		}
	});
}
function errJson(status, message, details) {
	return json({
		success: false,
		error: message,
		details
	}, status);
}
async function parseBody(req) {
	try {
		return await req.json();
	} catch {
		return {};
	}
}
function qp(url, key, fallback = "") {
	return url.searchParams.get(key) ?? fallback;
}
function pagination(url) {
	const page = Math.max(1, parseInt(qp(url, "page", "1"), 10) || 1);
	const limit = Math.min(100, Math.max(1, parseInt(qp(url, "limit", "20"), 10) || 20));
	return {
		page,
		limit,
		offset: (page - 1) * limit
	};
}
function genCode(prefix) {
	return `${prefix}-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
}
var dbReady = false;
async function ensureDb() {
	if (!dbReady) {
		await initDb();
		dbReady = true;
	}
}
async function handleApi(req) {
	const url = new URL(req.url);
	if (!url.pathname.startsWith("/api")) return null;
	await ensureDb();
	const method = req.method.toUpperCase();
	const path = url.pathname;
	if (method === "OPTIONS") return new Response(null, {
		status: 204,
		headers: {
			"access-control-allow-origin": "*",
			"access-control-allow-headers": "Content-Type, Authorization",
			"access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS"
		}
	});
	try {
		if (path === "/api/health" && method === "GET") return json({
			success: true,
			status: "ok",
			db: isMemoryMode() ? "memory" : "mysql",
			ts: (/* @__PURE__ */ new Date()).toISOString()
		});
		if (path === "/api/auth/register" && method === "POST") {
			const data = parseOrThrow(registerSchema, await parseBody(req));
			const isMem = isMemoryMode();
			let existing = null;
			if (isMem) existing = getMemStore()["users"]?.get(data.email) ?? null;
			else existing = await queryOne("SELECT id FROM users WHERE email=?", [data.email]);
			if (existing) return errJson(409, "Email already registered");
			const hash = await hashPassword(data.password);
			let user;
			if (isMem) user = memCreate("users", {
				name: data.name,
				email: data.email,
				password_hash: hash,
				role: data.role || "admin",
				branch: data.branch || "Guwahati HQ"
			});
			else {
				const id = (await execute("INSERT INTO users (name,email,password_hash,role,branch) VALUES (?,?,?,?,?)", [
					data.name,
					data.email,
					hash,
					data.role || "admin",
					data.branch || "Guwahati HQ"
				])).insertId;
				user = await queryOne("SELECT id,name,email,role,branch,created_at FROM users WHERE id=?", [id]);
			}
			const token = signToken({
				id: user.id,
				email: user.email,
				role: user.role,
				name: user.name
			});
			return json({
				success: true,
				data: {
					user: {
						id: user.id,
						name: user.name,
						email: user.email,
						role: user.role,
						branch: user.branch
					},
					token
				}
			}, 201);
		}
		if (path === "/api/auth/login" && method === "POST") {
			const data = parseOrThrow(loginSchema, await parseBody(req));
			const isMem = isMemoryMode();
			let user = null;
			if (isMem) {
				user = getMemStore()["users"]?.get(data.email) ?? null;
				if (!user) user = memList("users").find((u) => u.email === data.email) ?? null;
			} else user = await queryOne("SELECT * FROM users WHERE email=?", [data.email]);
			if (!user) return errJson(401, "Invalid credentials");
			if (!await verifyPassword(data.password, user.password_hash)) return errJson(401, "Invalid credentials");
			const token = signToken({
				id: user.id,
				email: user.email,
				role: user.role,
				designation: user.designation,
				name: user.name,
				branch: user.branch,
				reports_to: user.reports_to
			});
			return json({
				success: true,
				data: {
					user: {
						id: user.id,
						name: user.name,
						email: user.email,
						role: user.role,
						designation: user.designation,
						branch: user.branch,
						reports_to: user.reports_to
					},
					token
				}
			});
		}
		if (path === "/api/auth/me" && method === "GET") {
			const payload = requireAuth(req);
			const isMem = isMemoryMode();
			let user = null;
			if (isMem) {
				user = memGet("users", payload.id) ?? (payload.email ? getMemStore()["users"]?.get(payload.email) : null) ?? null;
				if (!user) user = memList("users").find((u) => u.id === payload.id) ?? null;
			} else user = await queryOne("SELECT id,name,email,role,designation,branch,reports_to,phone,created_at FROM users WHERE id=?", [payload.id]);
			if (!user) return errJson(404, "User not found");
			return json({
				success: true,
				data: {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
					designation: user.designation,
					branch: user.branch,
					reports_to: user.reports_to,
					phone: user.phone
				}
			});
		}
		if (path === "/api/auth/logout" && method === "POST") return json({
			success: true,
			message: "Logged out"
		});
		if (path === "/api/auth/driver-login" && method === "POST") {
			const body = await parseBody(req);
			const phoneInput = (body.phone || body.email || "").toString().trim();
			const password = (body.password || body.pin || "").toString().trim();
			if (!phoneInput) return errJson(400, "Phone number or email required");
			const cleanInput = phoneInput.replace(/[^0-9]/g, "").slice(-10);
			const isMem = isMemoryMode();
			let driver = null;
			if (isMem) driver = (memList("travel_drivers") || []).find((d) => {
				const dPhone = (d.phone || "").replace(/[^0-9]/g, "").slice(-10);
				return cleanInput && dPhone === cleanInput || d.email === phoneInput || d.name?.toLowerCase() === phoneInput.toLowerCase();
			});
			else driver = (await query("SELECT * FROM travel_drivers WHERE REPLACE(REPLACE(REPLACE(phone, ' ', ''), '+91', ''), '-', '') LIKE ? OR phone LIKE ? OR name LIKE ? OR email = ?", [
				`%${cleanInput || phoneInput}%`,
				`%${cleanInput || phoneInput}%`,
				`%${phoneInput}%`,
				phoneInput
			]))[0] ?? null;
			if (!driver) return errJson(401, "Driver account not found. Please contact fleet admin.");
			const isDefault = password === "driver123" || password === "1234" || !driver.password_hash;
			const pinMatches = Boolean(driver.pin && driver.pin.toString().trim() === password);
			if (!isDefault && !pinMatches) {
				if (!await verifyPassword(password, driver.password_hash)) return errJson(401, "Invalid password or PIN for driver");
			}
			return json({
				success: true,
				data: {
					token: signToken({
						id: driver.id,
						role: "driver",
						name: driver.name,
						phone: driver.phone,
						vehicle_number: driver.vehicle_number
					}),
					driver: {
						id: driver.id,
						name: driver.name,
						phone: driver.phone,
						vehicle_type: driver.vehicle_type,
						vehicle_number: driver.vehicle_number,
						experience: driver.experience || "5 years",
						rating: driver.rating || 4.9,
						status: driver.status || "Available"
					}
				}
			});
		}
		if (path === "/api/driver/me" && method === "GET") {
			const payload = requireAuth(req);
			if (payload.role !== "driver" && payload.role !== "admin" && payload.role !== "super_admin") return errJson(403, "Access denied: Driver portal only");
			const isMem = isMemoryMode();
			let driver = null;
			if (isMem) driver = memGet("travel_drivers", payload.id) || (memList("travel_drivers") || []).find((d) => d.id === payload.id || d.name === payload.name);
			else driver = await queryOne("SELECT * FROM travel_drivers WHERE id = ? OR name = ?", [payload.id, payload.name]);
			return json({
				success: true,
				data: driver || payload
			});
		}
		if (path === "/api/driver/my-trips" && method === "GET") {
			const payload = requireAuth(req);
			const driverName = payload.name;
			const driverPhoneClean = (payload.phone || "").replace(/[^0-9]/g, "").slice(-10);
			const isMem = isMemoryMode();
			let trips = [];
			if (isMem) trips = (memList("travel_bookings") || []).filter((b) => {
				const bDriver = b.assigned_driver || "";
				const bPhone = (b.driver_phone || "").replace(/[^0-9]/g, "").slice(-10);
				return bDriver.toLowerCase().includes(driverName.toLowerCase()) || driverPhoneClean && bPhone === driverPhoneClean;
			});
			else trips = await query("SELECT * FROM travel_bookings WHERE assigned_driver LIKE ? OR driver_phone LIKE ? ORDER BY id DESC", [`%${driverName}%`, `%${driverPhoneClean || driverName}%`]);
			return json({
				success: true,
				data: trips
			});
		}
		if (path.startsWith("/api/driver/trips/") && path.endsWith("/status") && method === "PUT") {
			requireAuth(req);
			const tripId = path.split("/")[4];
			const status = (await parseBody(req)).status || "On Trip";
			if (isMemoryMode()) {
				const numId = Number(tripId);
				return json({
					success: true,
					data: memUpdate("travel_bookings", isNaN(numId) ? tripId : numId, { trip_status: status })
				});
			}
			await execute("UPDATE travel_bookings SET trip_status = ? WHERE id = ? OR booking_ref = ?", [
				status,
				tripId,
				tripId
			]);
			return json({
				success: true,
				data: await queryOne("SELECT * FROM travel_bookings WHERE id = ? OR booking_ref = ?", [tripId, tripId])
			});
		}
		if (path === "/api/auth/traveler-login" && method === "POST") {
			const body = await parseBody(req);
			const phoneOrRef = (body.phone || body.booking_ref || body.email || "").toString().trim();
			(body.password || body.booking_ref || body.code || "").toString().trim();
			if (!phoneOrRef) return errJson(400, "Mobile number or Booking Reference required");
			const cleanInput = phoneOrRef.replace(/[^0-9]/g, "").slice(-10);
			const isMem = isMemoryMode();
			let bookings = [];
			if (isMem) bookings = (memList("travel_bookings") || []).filter((b) => {
				const bPhone = (b.phone || "").replace(/[^0-9]/g, "").slice(-10);
				const bRef = (b.booking_ref || "").toUpperCase();
				const target = phoneOrRef.toUpperCase();
				return cleanInput && bPhone === cleanInput || bRef === target || b.email?.toLowerCase() === phoneOrRef.toLowerCase();
			});
			else bookings = await query("SELECT * FROM travel_bookings WHERE REPLACE(REPLACE(REPLACE(phone, ' ', ''), '+91', ''), '-', '') LIKE ? OR phone LIKE ? OR booking_ref = ? OR email = ? ORDER BY id DESC", [
				`%${cleanInput || phoneOrRef}%`,
				`%${cleanInput || phoneOrRef}%`,
				phoneOrRef.toUpperCase(),
				phoneOrRef
			]);
			if (!bookings || bookings.length === 0) return errJson(401, "No booking found with this phone number or reference. Please check your ticket details.");
			const primary = bookings[0];
			return json({
				success: true,
				data: {
					token: signToken({
						id: primary.id,
						role: "traveler",
						name: primary.passenger_name,
						phone: primary.phone,
						email: primary.email
					}),
					traveler: {
						name: primary.passenger_name,
						phone: primary.phone,
						email: primary.email
					},
					bookings
				}
			});
		}
		if (path === "/api/traveler/me" && method === "GET") {
			const payload = requireAuth(req);
			if (payload.role !== "traveler" && payload.role !== "admin" && payload.role !== "super_admin") return errJson(403, "Access denied: Traveler portal only");
			return json({
				success: true,
				data: payload
			});
		}
		if (path === "/api/traveler/my-trips" && method === "GET") {
			const payload = requireAuth(req);
			const phoneClean = (payload.phone || "").replace(/[^0-9]/g, "").slice(-10);
			const isMem = isMemoryMode();
			let trips = [];
			if (isMem) trips = (memList("travel_bookings") || []).filter((b) => {
				const bPhone = (b.phone || "").replace(/[^0-9]/g, "").slice(-10);
				return phoneClean && bPhone === phoneClean || b.passenger_name?.toLowerCase() === payload.name?.toLowerCase();
			});
			else trips = await query("SELECT * FROM travel_bookings WHERE phone LIKE ? OR passenger_name LIKE ? ORDER BY id DESC", [`%${phoneClean}%`, `%${payload.name}%`]);
			return json({
				success: true,
				data: trips
			});
		}
		[
			"/api/health",
			"/api/auth/login",
			"/api/auth/register",
			"/api/auth/driver-login",
			"/api/auth/traveler-login"
		].some((p) => path === p) || path.startsWith("/api/dashboard") || path.startsWith("/api/settings");
		if (path === "/api/branches") {
			if (method === "GET") {
				const isMem = isMemoryMode();
				let rows;
				if (isMem) rows = memList("branches");
				else rows = await query("SELECT * FROM branches ORDER BY id ASC");
				return json({
					success: true,
					data: rows
				});
			}
			if (method === "POST") {
				const userPayload = authMiddleware(req);
				if (userPayload && userPayload.role !== "super_admin") return errJson(403, "Access restricted: Only Super Admin can add new branches.");
				const body = await parseBody(req);
				if (!body.name || !body.city) return errJson(400, "name and city required");
				const isMem = isMemoryMode();
				let row;
				if (isMem) row = memCreate("branches", {
					name: body.name,
					city: body.city,
					region: body.region || "North",
					head: body.head || "",
					revenue: body.revenue || 0,
					students: body.students || 0
				});
				else row = await queryOne("SELECT * FROM branches WHERE id=?", [(await execute("INSERT INTO branches (name,city,region,head,revenue,students) VALUES (?,?,?,?,?,?)", [
					body.name,
					body.city,
					body.region || "North",
					body.head || "",
					body.revenue || 0,
					body.students || 0
				])).insertId]);
				return json({
					success: true,
					data: row
				}, 201);
			}
		}
		const mBranch = path.match(/^\/api\/branches\/(\d+)$/);
		if (mBranch) {
			const id = parseInt(mBranch[1], 10);
			const isMem = isMemoryMode();
			if (method === "GET") {
				const row = isMem ? memGet("branches", id) : await queryOne("SELECT * FROM branches WHERE id=?", [id]);
				if (!row) return errJson(404, "Branch not found");
				return json({
					success: true,
					data: row
				});
			}
			if (method === "PUT" || method === "PATCH") {
				const body = await parseBody(req);
				if (isMem) {
					const upd = memUpdate("branches", id, body);
					if (!upd) return errJson(404, "Branch not found");
					return json({
						success: true,
						data: upd
					});
				} else {
					const fields = [];
					const vals = [];
					for (const k of [
						"name",
						"city",
						"region",
						"head",
						"revenue",
						"students"
					]) if (body[k] !== void 0) {
						fields.push(`${k}=?`);
						vals.push(body[k]);
					}
					if (!fields.length) return errJson(400, "No fields to update");
					vals.push(id);
					await execute(`UPDATE branches SET ${fields.join(",")} WHERE id=?`, vals);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM branches WHERE id=?", [id])
					});
				}
			}
			if (method === "DELETE") {
				if (isMem) {
					if (!memDelete("branches", id)) return errJson(404, "Not found");
				} else if ((await execute("DELETE FROM branches WHERE id=?", [id])).affectedRows === 0) return errJson(404, "Not found");
				return json({
					success: true,
					message: "Deleted"
				});
			}
		}
		if (path === "/api/students") {
			if (method === "GET") {
				const { page, limit, offset } = pagination(url);
				const search = qp(url, "search", "").toLowerCase();
				const country = qp(url, "country", "");
				const branch = qp(url, "branch", "");
				const status = qp(url, "status", "");
				if (isMemoryMode()) {
					let rows = memList("students");
					if (search) rows = rows.filter((r) => r.name?.toLowerCase().includes(search) || r.email?.toLowerCase().includes(search) || r.code?.toLowerCase().includes(search));
					if (country) rows = rows.filter((r) => r.country === country);
					if (branch) rows = rows.filter((r) => r.branch === branch);
					if (status) rows = rows.filter((r) => r.status === status);
					const total = rows.length;
					rows = rows.slice(offset, offset + limit);
					return json({
						success: true,
						data: rows,
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit)
						}
					});
				} else {
					let where = " WHERE 1=1";
					const params = [];
					if (search) {
						where += " AND (name LIKE ? OR email LIKE ? OR code LIKE ?)";
						params.push(`%${search}%`, `%${search}%`, `%${search}%`);
					}
					if (country) {
						where += " AND country=?";
						params.push(country);
					}
					if (branch) {
						where += " AND branch=?";
						params.push(branch);
					}
					if (status) {
						where += " AND status=?";
						params.push(status);
					}
					const total = (await queryOne(`SELECT COUNT(*) as total FROM students${where}`, params)).total;
					return json({
						success: true,
						data: await query(`SELECT * FROM students${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [
							...params,
							limit,
							offset
						]),
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit)
						}
					});
				}
			}
			if (method === "POST") {
				const body = await parseBody(req);
				const data = parseOrThrow(studentSchema, body);
				const isMem = isMemoryMode();
				const code = body.code || genCode("UQ");
				let row;
				if (isMem) row = memCreate("students", {
					code,
					...data,
					lead_score: data.lead_score ?? 50,
					stage: data.stage || "Lead",
					stage_index: data.stage_index ?? 0,
					status: data.status || "Active"
				});
				else row = await queryOne("SELECT * FROM students WHERE id=?", [(await execute("INSERT INTO students (code,name,email,phone,dob,passport,country,course,university,intake,counselor,branch,lead_score,stage,stage_index,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
					code,
					data.name,
					data.email,
					data.phone,
					data.dob || null,
					data.passport || null,
					data.country,
					data.course,
					data.university,
					data.intake,
					data.counselor || null,
					data.branch,
					data.lead_score ?? 50,
					data.stage || "Lead",
					data.stage_index ?? 0,
					data.status || "Active"
				])).insertId]);
				return json({
					success: true,
					data: row
				}, 201);
			}
		}
		const mStudId = path.match(/^\/api\/students\/([^\/]+)$/);
		if (mStudId && !path.includes("/tasks") && !path.includes("/notes")) {
			const key = mStudId[1];
			const isMem = isMemoryMode();
			const find = async () => {
				if (isMem) return memGet("students", key) ?? memGet("students", parseInt(key, 10)) ?? memList("students").find((s) => s.code === key) ?? null;
				else if (/^\d+$/.test(key)) return await queryOne("SELECT * FROM students WHERE id=?", [key]);
				else return await queryOne("SELECT * FROM students WHERE code=?", [key]);
			};
			if (method === "GET") {
				const row = await find();
				if (!row) return errJson(404, "Student not found");
				return json({
					success: true,
					data: row
				});
			}
			if (method === "PUT" || method === "PATCH") {
				const body = await parseBody(req);
				if (isMem) {
					const existing = await find();
					if (!existing) return errJson(404, "Not found");
					return json({
						success: true,
						data: memUpdate("students", existing.id, body)
					});
				} else {
					const existing = await find();
					if (!existing) return errJson(404, "Not found");
					const fields = [];
					const vals = [];
					const map = {
						name: "name",
						email: "email",
						phone: "phone",
						dob: "dob",
						passport: "passport",
						country: "country",
						course: "course",
						university: "university",
						intake: "intake",
						counselor: "counselor",
						branch: "branch",
						lead_score: "lead_score",
						stage: "stage",
						stage_index: "stage_index",
						status: "status"
					};
					for (const k in map) if (body[k] !== void 0) {
						fields.push(`${map[k]}=?`);
						vals.push(body[k]);
					}
					if (!fields.length) return errJson(400, "No fields");
					vals.push(existing.id);
					await execute(`UPDATE students SET ${fields.join(",")} WHERE id=?`, vals);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM students WHERE id=?", [existing.id])
					});
				}
			}
			if (method === "DELETE") {
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMem) memDelete("students", existing.id);
				else await execute("DELETE FROM students WHERE id=?", [existing.id]);
				return json({
					success: true,
					message: "Deleted"
				});
			}
		}
		const mSub = path.match(/^\/api\/students\/([^\/]+)\/(tasks|documents|notes|followups|comms)(?:\/([^\/]+))?$/);
		if (mSub) {
			const key = mSub[1];
			const resource = mSub[2];
			const itemId = mSub[3];
			const isMem = isMemoryMode();
			const findStudent = async () => {
				if (isMem) return memGet("students", key) ?? memGet("students", parseInt(key, 10)) ?? memList("students").find((s) => s.code === key) ?? null;
				else if (/^\d+$/.test(key)) return await queryOne("SELECT * FROM students WHERE id=?", [key]);
				else return await queryOne("SELECT * FROM students WHERE code=?", [key]);
			};
			const stud = await findStudent();
			if (!stud) return errJson(404, "Student not found");
			const sid = stud.id;
			const tblName = `student_${resource}`;
			if (method === "GET") {
				if (isMem) return json({
					success: true,
					data: memList(tblName).filter((r) => Number(r.student_id) === Number(sid))
				});
				else return json({
					success: true,
					data: await query(`SELECT * FROM ${tblName} WHERE student_id=? ORDER BY id DESC`, [sid])
				});
			}
			if (method === "POST") {
				const body = await parseBody(req);
				if (isMem) return json({
					success: true,
					data: memCreate(tblName, {
						...body,
						student_id: sid
					})
				}, 201);
				else if (resource === "tasks") return json({
					success: true,
					data: await queryOne("SELECT * FROM student_tasks WHERE id=?", [(await execute("INSERT INTO student_tasks (student_id, title, due_date, owner, priority, status) VALUES (?, ?, ?, ?, ?, ?)", [
						sid,
						body.title || "New Task",
						body.due_date || "Today",
						body.owner || "Meera Shah",
						body.priority || "Medium",
						body.status || "Open"
					])).insertId])
				}, 201);
				else if (resource === "documents") return json({
					success: true,
					data: await queryOne("SELECT * FROM student_documents WHERE id=?", [(await execute("INSERT INTO student_documents (student_id, name, size, status) VALUES (?, ?, ?, ?)", [
						sid,
						body.name || "Document.pdf",
						body.size || "1.0 MB",
						body.status || "Verified"
					])).insertId])
				}, 201);
				else if (resource === "notes") return json({
					success: true,
					data: await queryOne("SELECT * FROM student_notes WHERE id=?", [(await execute("INSERT INTO student_notes (student_id, author, content) VALUES (?, ?, ?)", [
						sid,
						body.author || "Meera Shah",
						body.content || ""
					])).insertId])
				}, 201);
				else if (resource === "followups") return json({
					success: true,
					data: await queryOne("SELECT * FROM student_followups WHERE id=?", [(await execute("INSERT INTO student_followups (student_id, scheduled_at, channel, note, status) VALUES (?, ?, ?, ?, ?)", [
						sid,
						body.scheduled_at || "Tomorrow",
						body.channel || "Phone call",
						body.note || "",
						body.status || "Pending"
					])).insertId])
				}, 201);
				else if (resource === "comms") return json({
					success: true,
					data: await queryOne("SELECT * FROM student_comms WHERE id=?", [(await execute("INSERT INTO student_comms (student_id, channel, direction, subject) VALUES (?, ?, ?, ?)", [
						sid,
						body.channel || "Call",
						body.direction || "Outbound",
						body.subject || ""
					])).insertId])
				}, 201);
			}
			if (method === "PATCH" || method === "PUT") {
				if (!itemId) return errJson(400, "Missing item id");
				const body = await parseBody(req);
				if (isMem) return json({
					success: true,
					data: memUpdate(tblName, itemId, body)
				});
				else if (resource === "tasks") {
					if (body.status !== void 0) await execute("UPDATE student_tasks SET status=? WHERE id=? AND student_id=?", [
						body.status,
						itemId,
						sid
					]);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM student_tasks WHERE id=?", [itemId])
					});
				} else if (resource === "documents") {
					if (body.status !== void 0) await execute("UPDATE student_documents SET status=? WHERE id=? AND student_id=?", [
						body.status,
						itemId,
						sid
					]);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM student_documents WHERE id=?", [itemId])
					});
				} else if (resource === "followups") {
					if (body.status !== void 0) await execute("UPDATE student_followups SET status=? WHERE id=? AND student_id=?", [
						body.status,
						itemId,
						sid
					]);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM student_followups WHERE id=?", [itemId])
					});
				}
			}
			if (method === "DELETE") {
				if (!itemId) return errJson(400, "Missing item id");
				if (isMem) {
					memDelete(tblName, itemId);
					return json({
						success: true,
						message: "Deleted"
					});
				} else {
					await execute(`DELETE FROM ${tblName} WHERE id=? AND student_id=?`, [itemId, sid]);
					return json({
						success: true,
						message: "Deleted"
					});
				}
			}
		}
		if (path === "/api/leads") {
			if (method === "GET") {
				const { page, limit, offset } = pagination(url);
				const search = qp(url, "search", "").toLowerCase();
				const status = qp(url, "status", "");
				if (isMemoryMode()) {
					let rows = memList("leads");
					if (search) rows = rows.filter((r) => r.name.toLowerCase().includes(search) || r.city.toLowerCase().includes(search) || r.source.toLowerCase().includes(search));
					if (status) rows = rows.filter((r) => r.status === status);
					const total = rows.length;
					rows = rows.slice(offset, offset + limit);
					return json({
						success: true,
						data: rows,
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit)
						}
					});
				} else {
					let where = " WHERE 1=1";
					const params = [];
					if (search) {
						where += " AND (name LIKE ? OR city LIKE ? OR source LIKE ?)";
						params.push(`%${search}%`, `%${search}%`, `%${search}%`);
					}
					if (status) {
						where += " AND status=?";
						params.push(status);
					}
					const cnt = await queryOne(`SELECT COUNT(*) as total FROM leads${where}`, params);
					return json({
						success: true,
						data: await query(`SELECT * FROM leads${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [
							...params,
							limit,
							offset
						]),
						pagination: {
							page,
							limit,
							total: cnt.total,
							totalPages: Math.ceil(cnt.total / limit)
						}
					});
				}
			}
			if (method === "POST") {
				const data = parseOrThrow(leadSchema, await parseBody(req));
				const isMem = isMemoryMode();
				let row;
				if (isMem) row = memCreate("leads", {
					...data,
					score: data.score ?? 60,
					status: data.status || "New Enquiry"
				});
				else row = await queryOne("SELECT * FROM leads WHERE id=?", [(await execute("INSERT INTO leads (name,email,phone,source,score,city,status,assigned_to,branch) VALUES (?,?,?,?,?,?,?,?,?)", [
					data.name,
					data.email || null,
					data.phone || null,
					data.source,
					data.score ?? 60,
					data.city,
					data.status || "New Enquiry",
					data.assigned_to || null,
					data.branch || null
				])).insertId]);
				return json({
					success: true,
					data: row
				}, 201);
			}
		}
		const mLeadConvert = path.match(/^\/api\/leads\/(\d+)\/convert$/);
		if (mLeadConvert && method === "POST") {
			const leadId = parseInt(mLeadConvert[1], 10);
			const isMem = isMemoryMode();
			const body = await parseBody(req);
			const lead = isMem ? memGet("leads", leadId) : await queryOne("SELECT * FROM leads WHERE id=?", [leadId]);
			if (!lead) return errJson(404, "Lead not found");
			let existingStudent = null;
			if (lead.student_id) existingStudent = isMem ? memGet("students", lead.student_id) : await queryOne("SELECT * FROM students WHERE id=?", [lead.student_id]);
			if (!existingStudent && lead.email) existingStudent = isMem ? memList("students").find((s) => s.email === lead.email) : await queryOne("SELECT * FROM students WHERE email=?", [lead.email]);
			if (existingStudent) {
				if (!isMem) await execute("UPDATE leads SET status='Qualified', student_id=?, student_code=? WHERE id=?", [
					existingStudent.id,
					existingStudent.code,
					leadId
				]);
				return json({
					success: true,
					message: "Lead already converted to Student",
					student: existingStudent
				});
			}
			const code = genCode("UQ");
			const name = lead.name;
			const email = lead.email || `${lead.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`;
			const phone = lead.phone || null;
			const country = body.country || "United Kingdom";
			const course = body.course || "BSc / MSc Studies";
			const university = body.university || "To be finalized";
			const intake = body.intake || "Fall 2026";
			const counselor = lead.assigned_to || "Mohammad Iqbal";
			const branch = lead.branch || "Guwahati HQ";
			const lead_score = lead.score || 85;
			const stage = "Counselling";
			const stage_index = 1;
			const status = "Active";
			let createdStudent;
			if (isMem) {
				createdStudent = memCreate("students", {
					code,
					name,
					email,
					phone,
					dob: null,
					passport: null,
					country,
					course,
					university,
					intake,
					counselor,
					branch,
					lead_score,
					stage,
					stage_index,
					status
				});
				memUpdate("leads", leadId, {
					status: "Qualified",
					student_id: createdStudent.id,
					student_code: code
				});
			} else {
				const stuId = (await execute("INSERT INTO students (code, name, email, phone, dob, passport, country, course, university, intake, counselor, branch, lead_score, stage, stage_index, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
					code,
					name,
					email,
					phone,
					null,
					null,
					country,
					course,
					university,
					intake,
					counselor,
					branch,
					lead_score,
					stage,
					stage_index,
					status
				])).insertId;
				createdStudent = await queryOne("SELECT * FROM students WHERE id=?", [stuId]);
				await execute("UPDATE leads SET status='Qualified', student_id=?, student_code=? WHERE id=?", [
					stuId,
					code,
					leadId
				]);
			}
			return json({
				success: true,
				message: "Lead successfully converted to Student Admission!",
				student: createdStudent
			}, 201);
		}
		const mLead = path.match(/^\/api\/leads\/(\d+)$/);
		if (mLead) {
			const id = parseInt(mLead[1], 10);
			const isMem = isMemoryMode();
			if (method === "GET") {
				const row = isMem ? memGet("leads", id) : await queryOne("SELECT * FROM leads WHERE id=?", [id]);
				if (!row) return errJson(404, "Lead not found");
				return json({
					success: true,
					data: row
				});
			}
			if (method === "PUT" || method === "PATCH") {
				const body = await parseBody(req);
				if (isMem) {
					const upd = memUpdate("leads", id, body);
					if (!upd) return errJson(404, "Not found");
					return json({
						success: true,
						data: upd
					});
				} else {
					const fields = [];
					const vals = [];
					for (const k of [
						"name",
						"email",
						"phone",
						"source",
						"score",
						"city",
						"status",
						"assigned_to",
						"branch",
						"student_id",
						"student_code"
					]) if (body[k] !== void 0) {
						fields.push(`${k}=?`);
						vals.push(body[k]);
					}
					if (!fields.length) return errJson(400, "No fields");
					vals.push(id);
					await execute(`UPDATE leads SET ${fields.join(",")} WHERE id=?`, vals);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM leads WHERE id=?", [id])
					});
				}
			}
			if (method === "DELETE") {
				if (isMem) {
					if (!memDelete("leads", id)) return errJson(404, "Not found");
				} else if ((await execute("DELETE FROM leads WHERE id=?", [id])).affectedRows === 0) return errJson(404, "Not found");
				return json({
					success: true,
					message: "Deleted"
				});
			}
		}
		if (path === "/api/applications") {
			if (method === "GET") {
				const { page, limit, offset } = pagination(url);
				const search = qp(url, "search", "").toLowerCase();
				const status = qp(url, "status", "");
				if (isMemoryMode()) {
					let rows = memList("applications");
					if (search) rows = rows.filter((r) => r.student.toLowerCase().includes(search) || r.university.toLowerCase().includes(search) || r.code.toLowerCase().includes(search));
					if (status) rows = rows.filter((r) => r.status === status);
					const total = rows.length;
					rows = rows.slice(offset, offset + limit);
					return json({
						success: true,
						data: rows,
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit)
						}
					});
				} else {
					let where = " WHERE 1=1";
					const params = [];
					if (search) {
						where += " AND (student LIKE ? OR university LIKE ? OR code LIKE ?)";
						params.push(`%${search}%`, `%${search}%`, `%${search}%`);
					}
					if (status) {
						where += " AND status=?";
						params.push(status);
					}
					const cnt = await queryOne(`SELECT COUNT(*) as total FROM applications${where}`, params);
					return json({
						success: true,
						data: await query(`SELECT * FROM applications${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [
							...params,
							limit,
							offset
						]),
						pagination: {
							page,
							limit,
							total: cnt.total,
							totalPages: Math.ceil(cnt.total / limit)
						}
					});
				}
			}
			if (method === "POST") {
				const body = await parseBody(req);
				const data = parseOrThrow(applicationSchema, body);
				const code = body.code || genCode("APP");
				const isMem = isMemoryMode();
				let row;
				if (isMem) row = memCreate("applications", {
					code,
					...data,
					stage: data.stage || "Documents",
					progress: data.progress ?? 0,
					status: data.status || "In Progress"
				});
				else row = await queryOne("SELECT * FROM applications WHERE id=?", [(await execute("INSERT INTO applications (code,student,student_id,university,program,intake,stage,progress,status) VALUES (?,?,?,?,?,?,?,?,?)", [
					code,
					data.student,
					data.student_id || null,
					data.university,
					data.program,
					data.intake,
					data.stage || "Documents",
					data.progress ?? 0,
					data.status || "In Progress"
				])).insertId]);
				return json({
					success: true,
					data: row
				}, 201);
			}
		}
		const mApp = path.match(/^\/api\/applications\/([^\/]+)$/);
		if (mApp) {
			const key = mApp[1];
			const find = async () => {
				if (isMemoryMode()) return memGet("applications", key) ?? memList("applications").find((a) => a.code === key) ?? (/^\d+$/.test(key) ? memGet("applications", parseInt(key, 10)) : null);
				else if (/^\d+$/.test(key)) return await queryOne("SELECT * FROM applications WHERE id=?", [key]);
				else return await queryOne("SELECT * FROM applications WHERE code=?", [key]);
			};
			if (method === "GET") {
				const row = await find();
				if (!row) return errJson(404, "Application not found");
				return json({
					success: true,
					data: row
				});
			}
			if (method === "PUT" || method === "PATCH") {
				const body = await parseBody(req);
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) return json({
					success: true,
					data: memUpdate("applications", existing.id, body)
				});
				else {
					const fields = [];
					const vals = [];
					for (const k of [
						"student",
						"university",
						"program",
						"intake",
						"stage",
						"progress",
						"status"
					]) if (body[k] !== void 0) {
						fields.push(`${k}=?`);
						vals.push(body[k]);
					}
					if (!fields.length) return errJson(400, "No fields");
					vals.push(existing.id);
					await execute(`UPDATE applications SET ${fields.join(",")} WHERE id=?`, vals);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM applications WHERE id=?", [existing.id])
					});
				}
			}
			if (method === "DELETE") {
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) memDelete("applications", existing.id);
				else await execute("DELETE FROM applications WHERE id=?", [existing.id]);
				return json({
					success: true,
					message: "Deleted"
				});
			}
		}
		if (path === "/api/universities") {
			if (method === "GET") {
				const search = qp(url, "search", "").toLowerCase();
				const { page, limit, offset } = pagination(url);
				if (isMemoryMode()) {
					let rows = memList("universities");
					if (search) rows = rows.filter((r) => r.name.toLowerCase().includes(search) || r.country.toLowerCase().includes(search));
					const total = rows.length;
					rows = rows.slice(offset, offset + limit);
					return json({
						success: true,
						data: rows,
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit)
						}
					});
				} else {
					let where = "";
					const params = [];
					if (search) {
						where = " WHERE name LIKE ? OR country LIKE ?";
						params.push(`%${search}%`, `%${search}%`);
					}
					const cnt = await queryOne(`SELECT COUNT(*) as total FROM universities${where}`, params);
					return json({
						success: true,
						data: await query(`SELECT * FROM universities${where} ORDER BY rating DESC LIMIT ? OFFSET ?`, [
							...params,
							limit,
							offset
						]),
						pagination: {
							page,
							limit,
							total: cnt.total,
							totalPages: Math.ceil(cnt.total / limit)
						}
					});
				}
			}
			if (method === "POST") {
				const data = parseOrThrow(universitySchema, await parseBody(req));
				const isMem = isMemoryMode();
				let row;
				if (isMem) row = memCreate("universities", {
					...data,
					tier: data.tier || "Tier 1",
					courses: data.courses ?? 0,
					rating: data.rating ?? 4.5
				});
				else row = await queryOne("SELECT * FROM universities WHERE id=?", [(await execute("INSERT INTO universities (name,country,city,tier,courses,intakes,commission,rating) VALUES (?,?,?,?,?,?,?,?)", [
					data.name,
					data.country,
					data.city,
					data.tier || "Tier 1",
					data.courses ?? 0,
					data.intakes,
					data.commission,
					data.rating ?? 4.5
				])).insertId]);
				return json({
					success: true,
					data: row
				}, 201);
			}
		}
		const mUni = path.match(/^\/api\/universities\/(\d+)$/);
		if (mUni) {
			const id = parseInt(mUni[1], 10);
			const isMem = isMemoryMode();
			if (method === "GET") {
				const row = isMem ? memGet("universities", id) : await queryOne("SELECT * FROM universities WHERE id=?", [id]);
				if (!row) return errJson(404, "University not found");
				return json({
					success: true,
					data: row
				});
			}
			if (method === "PUT" || method === "PATCH") {
				const body = await parseBody(req);
				if (isMem) {
					const upd = memUpdate("universities", id, body);
					if (!upd) return errJson(404, "Not found");
					return json({
						success: true,
						data: upd
					});
				} else {
					const fields = [];
					const vals = [];
					for (const k of [
						"name",
						"country",
						"city",
						"tier",
						"courses",
						"intakes",
						"commission",
						"rating"
					]) if (body[k] !== void 0) {
						fields.push(`${k}=?`);
						vals.push(body[k]);
					}
					if (!fields.length) return errJson(400, "No fields");
					vals.push(id);
					await execute(`UPDATE universities SET ${fields.join(",")} WHERE id=?`, vals);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM universities WHERE id=?", [id])
					});
				}
			}
			if (method === "DELETE") {
				if (isMem) {
					if (!memDelete("universities", id)) return errJson(404, "Not found");
				} else if ((await execute("DELETE FROM universities WHERE id=?", [id])).affectedRows === 0) return errJson(404, "Not found");
				return json({
					success: true,
					message: "Deleted"
				});
			}
		}
		if (path === "/api/colleges") {
			if (method === "GET") {
				const search = qp(url, "search", "").toLowerCase();
				const state = qp(url, "state", "");
				const { page, limit, offset } = pagination(url);
				if (isMemoryMode()) {
					let rows = memList("colleges");
					if (search) rows = rows.filter((r) => r.name.toLowerCase().includes(search));
					if (state) rows = rows.filter((r) => r.state === state);
					const total = rows.length;
					rows = rows.slice(offset, offset + limit);
					return json({
						success: true,
						data: rows,
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit)
						}
					});
				} else {
					let where = " WHERE 1=1";
					const params = [];
					if (search) {
						where += " AND name LIKE ?";
						params.push(`%${search}%`);
					}
					if (state) {
						where += " AND state=?";
						params.push(state);
					}
					const cnt = await queryOne(`SELECT COUNT(*) as total FROM colleges${where}`, params);
					return json({
						success: true,
						data: (await query(`SELECT * FROM colleges${where} ORDER BY id ASC LIMIT ? OFFSET ?`, [
							...params,
							limit,
							offset
						])).map((r) => ({
							...r,
							courses_offered: typeof r.courses_offered === "string" ? JSON.parse(r.courses_offered) : r.courses_offered,
							coursesOffered: typeof r.courses_offered === "string" ? JSON.parse(r.courses_offered) : r.courses_offered
						})),
						pagination: {
							page,
							limit,
							total: cnt.total,
							totalPages: Math.ceil(cnt.total / limit)
						}
					});
				}
			}
			if (method === "POST") {
				const body = await parseBody(req);
				const data = parseOrThrow(collegeSchema, body);
				const code = body.code || genCode("COL");
				const isMem = isMemoryMode();
				let row;
				if (isMem) row = memCreate("colleges", {
					code,
					name: data.name,
					state: data.state,
					city: data.city,
					affiliatedUniversity: data.affiliatedUniversity,
					coursesOffered: data.coursesOffered || [],
					annualIntake: data.annualIntake ?? 0,
					deadline: data.deadline,
					tuitionFee: data.tuitionFee,
					hostelFee: data.hostelFee,
					contactPerson: data.contactPerson,
					contactNumber: data.contactNumber,
					email: data.email,
					website: data.website,
					status: data.status || "Active",
					notes: data.notes
				});
				else row = await queryOne("SELECT * FROM colleges WHERE id=?", [(await execute("INSERT INTO colleges (code,name,state,city,affiliated_university,courses_offered,annual_intake,deadline,tuition_fee,hostel_fee,contact_person,contact_number,email,website,status,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
					code,
					data.name,
					data.state,
					data.city,
					data.affiliatedUniversity,
					JSON.stringify(data.coursesOffered || []),
					data.annualIntake ?? 0,
					data.deadline || null,
					data.tuitionFee || null,
					data.hostelFee || null,
					data.contactPerson || null,
					data.contactNumber || null,
					data.email || null,
					data.website || null,
					data.status || "Active",
					data.notes || null
				])).insertId]);
				return json({
					success: true,
					data: row
				}, 201);
			}
		}
		const mCol = path.match(/^\/api\/colleges\/([^\/]+)$/);
		if (mCol) {
			const key = mCol[1];
			const find = async () => {
				if (isMemoryMode()) return memGet("colleges", key) ?? memList("colleges").find((c) => c.code === key) ?? (/^\d+$/.test(key) ? memGet("colleges", parseInt(key, 10)) : null);
				else if (/^\d+$/.test(key)) return await queryOne("SELECT * FROM colleges WHERE id=?", [key]);
				else return await queryOne("SELECT * FROM colleges WHERE code=?", [key]);
			};
			if (method === "GET") {
				const row = await find();
				if (!row) return errJson(404, "College not found");
				return json({
					success: true,
					data: row
				});
			}
			if (method === "PUT" || method === "PATCH") {
				const body = await parseBody(req);
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) return json({
					success: true,
					data: memUpdate("colleges", existing.id, body)
				});
				else {
					const fields = [];
					const vals = [];
					const map = {
						name: "name",
						state: "state",
						city: "city",
						affiliatedUniversity: "affiliated_university",
						coursesOffered: "courses_offered",
						annualIntake: "annual_intake",
						deadline: "deadline",
						tuitionFee: "tuition_fee",
						hostelFee: "hostel_fee",
						contactPerson: "contact_person",
						contactNumber: "contact_number",
						email: "email",
						website: "website",
						status: "status",
						notes: "notes"
					};
					for (const k in map) if (body[k] !== void 0) {
						fields.push(`${map[k]}=?`);
						let v = body[k];
						if (k === "coursesOffered") v = JSON.stringify(v);
						vals.push(v);
					}
					if (!fields.length) return errJson(400, "No fields");
					vals.push(existing.id);
					await execute(`UPDATE colleges SET ${fields.join(",")} WHERE id=?`, vals);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM colleges WHERE id=?", [existing.id])
					});
				}
			}
			if (method === "DELETE") {
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) memDelete("colleges", existing.id);
				else await execute("DELETE FROM colleges WHERE id=?", [existing.id]);
				return json({
					success: true,
					message: "Deleted"
				});
			}
		}
		if (path === "/api/courses") {
			if (method === "GET") {
				const { page, limit, offset } = pagination(url);
				const search = qp(url, "search", "").toLowerCase();
				const category = qp(url, "category", "");
				if (isMemoryMode()) {
					let rows = memList("courses");
					if (search) rows = rows.filter((r) => r.name.toLowerCase().includes(search));
					if (category) rows = rows.filter((r) => r.category === category);
					const total = rows.length;
					rows = rows.slice(offset, offset + limit);
					return json({
						success: true,
						data: rows,
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit)
						}
					});
				} else {
					let where = " WHERE 1=1";
					const params = [];
					if (search) {
						where += " AND name LIKE ?";
						params.push(`%${search}%`);
					}
					if (category) {
						where += " AND category=?";
						params.push(category);
					}
					const cnt = await queryOne(`SELECT COUNT(*) as total FROM courses${where}`, params);
					return json({
						success: true,
						data: await query(`SELECT * FROM courses${where} ORDER BY id ASC LIMIT ? OFFSET ?`, [
							...params,
							limit,
							offset
						]),
						pagination: {
							page,
							limit,
							total: cnt.total,
							totalPages: Math.ceil(cnt.total / limit)
						}
					});
				}
			}
			if (method === "POST") {
				const body = await parseBody(req);
				const data = parseOrThrow(courseSchema, body);
				const code = body.code || genCode("CRS");
				const isMem = isMemoryMode();
				let row;
				if (isMem) row = memCreate("courses", {
					code,
					...data,
					seatsAvailable: data.seatsAvailable ?? 0,
					totalSeats: data.totalSeats ?? 0
				});
				else row = await queryOne("SELECT * FROM courses WHERE id=?", [(await execute("INSERT INTO courses (code,name,category,duration,eligibility,tuition_fee,registration_fee,seats_available,total_seats,session,min_percentage,description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [
					code,
					data.name,
					data.category,
					data.duration,
					data.eligibility,
					data.tuitionFee,
					data.registrationFee,
					data.seatsAvailable ?? 0,
					data.totalSeats ?? 0,
					data.session,
					data.minPercentage || "",
					data.description || null
				])).insertId]);
				return json({
					success: true,
					data: row
				}, 201);
			}
		}
		const mCourse = path.match(/^\/api\/courses\/([^\/]+)$/);
		if (mCourse) {
			const key = mCourse[1];
			const find = async () => {
				if (isMemoryMode()) return memGet("courses", key) ?? memList("courses").find((c) => c.code === key) ?? (/^\d+$/.test(key) ? memGet("courses", parseInt(key, 10)) : null);
				else if (/^\d+$/.test(key)) return await queryOne("SELECT * FROM courses WHERE id=?", [key]);
				else return await queryOne("SELECT * FROM courses WHERE code=?", [key]);
			};
			if (method === "GET") {
				const row = await find();
				if (!row) return errJson(404, "Course not found");
				return json({
					success: true,
					data: row
				});
			}
			if (method === "PUT" || method === "PATCH") {
				const body = await parseBody(req);
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) return json({
					success: true,
					data: memUpdate("courses", existing.id, body)
				});
				else {
					const fields = [];
					const vals = [];
					const map = {
						name: "name",
						category: "category",
						duration: "duration",
						eligibility: "eligibility",
						tuitionFee: "tuition_fee",
						registrationFee: "registration_fee",
						seatsAvailable: "seats_available",
						totalSeats: "total_seats",
						session: "session",
						minPercentage: "min_percentage",
						description: "description"
					};
					for (const k in map) if (body[k] !== void 0) {
						fields.push(`${map[k]}=?`);
						vals.push(body[k]);
					}
					if (!fields.length) return errJson(400, "No fields");
					vals.push(existing.id);
					await execute(`UPDATE courses SET ${fields.join(",")} WHERE id=?`, vals);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM courses WHERE id=?", [existing.id])
					});
				}
			}
			if (method === "DELETE") {
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) memDelete("courses", existing.id);
				else await execute("DELETE FROM courses WHERE id=?", [existing.id]);
				return json({
					success: true,
					message: "Deleted"
				});
			}
		}
		if (path === "/api/india-students") {
			if (method === "GET") {
				const { page, limit, offset } = pagination(url);
				const search = qp(url, "search", "").toLowerCase();
				if (isMemoryMode()) {
					let rows = memList("india_students");
					if (search) rows = rows.filter((r) => r.name.toLowerCase().includes(search) || r.email.toLowerCase().includes(search) || r.code.toLowerCase().includes(search));
					const total = rows.length;
					rows = rows.slice(offset, offset + limit);
					return json({
						success: true,
						data: rows,
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit)
						}
					});
				} else {
					let where = "";
					const params = [];
					if (search) {
						where = " WHERE name LIKE ? OR email LIKE ? OR code LIKE ?";
						params.push(`%${search}%`, `%${search}%`, `%${search}%`);
					}
					const cnt = await queryOne(`SELECT COUNT(*) as total FROM india_students${where}`, params);
					return json({
						success: true,
						data: await query(`SELECT * FROM india_students${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [
							...params,
							limit,
							offset
						]),
						pagination: {
							page,
							limit,
							total: cnt.total,
							totalPages: Math.ceil(cnt.total / limit)
						}
					});
				}
			}
			if (method === "POST") {
				const body = await parseBody(req);
				const data = parseOrThrow(indiaStudentSchema, body);
				const code = body.code || genCode("IND");
				const isMem = isMemoryMode();
				let row;
				if (isMem) row = memCreate("india_students", {
					code,
					...data,
					fatherName: data.fatherName,
					fatherPhone: data.fatherPhone,
					preferredState: data.preferredState,
					preferredCollege: data.preferredCollege,
					preferredCourse: data.preferredCourse,
					stageIndex: data.stageIndex ?? 0,
					registrationFeePaid: !!data.registrationFeePaid,
					totalFee: data.totalFee ?? 0,
					paidFee: data.paidFee ?? 0,
					appliedDate: data.appliedDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
				});
				else row = await queryOne("SELECT * FROM india_students WHERE id=?", [(await execute("INSERT INTO india_students (code,name,phone,email,dob,gender,category,father_name,father_phone,address,counselor,branch,preferred_state,preferred_college,preferred_course,session,stage_index,registration_fee_paid,total_fee,paid_fee,scholarship,discount,remarks,applied_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
					code,
					data.name,
					data.phone,
					data.email,
					data.dob || null,
					data.gender || null,
					data.category || null,
					data.fatherName || null,
					data.fatherPhone || null,
					data.address || null,
					data.counselor || null,
					data.branch,
					data.preferredState || null,
					data.preferredCollege || null,
					data.preferredCourse || null,
					data.session,
					data.stageIndex ?? 0,
					data.registrationFeePaid ? 1 : 0,
					data.totalFee ?? 0,
					data.paidFee ?? 0,
					data.scholarship ?? 0,
					data.discount ?? 0,
					data.remarks || null,
					data.appliedDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
				])).insertId]);
				return json({
					success: true,
					data: row
				}, 201);
			}
		}
		const mIndiaSt = path.match(/^\/api\/india-students\/([^\/]+)$/);
		if (mIndiaSt) {
			const key = mIndiaSt[1];
			const find = async () => {
				if (isMemoryMode()) return memGet("india_students", key) ?? memList("india_students").find((c) => c.code === key) ?? (/^\d+$/.test(key) ? memGet("india_students", parseInt(key, 10)) : null);
				else if (/^\d+$/.test(key)) return await queryOne("SELECT * FROM india_students WHERE id=?", [key]);
				else return await queryOne("SELECT * FROM india_students WHERE code=?", [key]);
			};
			if (method === "GET") {
				const row = await find();
				if (!row) return errJson(404, "India student not found");
				return json({
					success: true,
					data: row
				});
			}
			if (method === "PUT" || method === "PATCH") {
				const body = await parseBody(req);
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) return json({
					success: true,
					data: memUpdate("india_students", existing.id, body)
				});
				else {
					const fields = [];
					const vals = [];
					const map = {
						name: "name",
						phone: "phone",
						email: "email",
						dob: "dob",
						gender: "gender",
						category: "category",
						fatherName: "father_name",
						fatherPhone: "father_phone",
						address: "address",
						counselor: "counselor",
						branch: "branch",
						preferredState: "preferred_state",
						preferredCollege: "preferred_college",
						preferredCourse: "preferred_course",
						session: "session",
						stageIndex: "stage_index",
						registrationFeePaid: "registration_fee_paid",
						totalFee: "total_fee",
						paidFee: "paid_fee",
						scholarship: "scholarship",
						discount: "discount",
						remarks: "remarks",
						appliedDate: "applied_date"
					};
					for (const k in map) if (body[k] !== void 0) {
						fields.push(`${map[k]}=?`);
						let v = body[k];
						if (k === "registrationFeePaid") v = v ? 1 : 0;
						vals.push(v);
					}
					if (!fields.length) return errJson(400, "No fields");
					vals.push(existing.id);
					await execute(`UPDATE india_students SET ${fields.join(",")} WHERE id=?`, vals);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM india_students WHERE id=?", [existing.id])
					});
				}
			}
			if (method === "DELETE") {
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) memDelete("india_students", existing.id);
				else await execute("DELETE FROM india_students WHERE id=?", [existing.id]);
				return json({
					success: true,
					message: "Deleted"
				});
			}
		}
		if (path === "/api/invoices") {
			if (method === "GET") {
				const { page, limit, offset } = pagination(url);
				const search = qp(url, "search", "").toLowerCase();
				const status = qp(url, "status", "");
				if (isMemoryMode()) {
					let rows = memList("invoices");
					if (search) rows = rows.filter((r) => r.student.toLowerCase().includes(search) || r.code.toLowerCase().includes(search));
					if (status) rows = rows.filter((r) => r.status === status);
					const total = rows.length;
					rows = rows.slice(offset, offset + limit);
					return json({
						success: true,
						data: rows,
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit)
						}
					});
				} else {
					let where = " WHERE 1=1";
					const params = [];
					if (search) {
						where += " AND (student LIKE ? OR code LIKE ?)";
						params.push(`%${search}%`, `%${search}%`);
					}
					if (status) {
						where += " AND status=?";
						params.push(status);
					}
					const cnt = await queryOne(`SELECT COUNT(*) as total FROM invoices${where}`, params);
					return json({
						success: true,
						data: await query(`SELECT * FROM invoices${where} ORDER BY date DESC LIMIT ? OFFSET ?`, [
							...params,
							limit,
							offset
						]),
						pagination: {
							page,
							limit,
							total: cnt.total,
							totalPages: Math.ceil(cnt.total / limit)
						}
					});
				}
			}
			if (method === "POST") {
				const body = await parseBody(req);
				const data = parseOrThrow(invoiceSchema, body);
				const code = body.code || genCode("INV");
				const amountVal = data.amount_value != null ? data.amount_value : parseInt(data.amount.replace(/\D/g, ""), 10) || 0;
				const isMem = isMemoryMode();
				let row;
				if (isMem) row = memCreate("invoices", {
					code,
					...data,
					amount_value: amountVal,
					currency: data.currency || "INR",
					status: data.status || "Pending",
					date: data.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
				});
				else row = await queryOne("SELECT * FROM invoices WHERE id=?", [(await execute("INSERT INTO invoices (code,student,student_id,amount,amount_value,currency,type,date,status) VALUES (?,?,?,?,?,?,?,?,?)", [
					code,
					data.student,
					data.student_id || null,
					data.amount,
					amountVal,
					data.currency || "INR",
					data.type,
					data.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
					data.status || "Pending"
				])).insertId]);
				return json({
					success: true,
					data: row
				}, 201);
			}
		}
		const mInv = path.match(/^\/api\/invoices\/([^\/]+)$/);
		if (mInv) {
			const key = mInv[1];
			const find = async () => {
				if (isMemoryMode()) return memGet("invoices", key) ?? memList("invoices").find((c) => c.code === key) ?? (/^\d+$/.test(key) ? memGet("invoices", parseInt(key, 10)) : null);
				else if (/^\d+$/.test(key)) return await queryOne("SELECT * FROM invoices WHERE id=?", [key]);
				else return await queryOne("SELECT * FROM invoices WHERE code=?", [key]);
			};
			if (method === "GET") {
				const row = await find();
				if (!row) return errJson(404, "Invoice not found");
				return json({
					success: true,
					data: row
				});
			}
			if (method === "PUT" || method === "PATCH") {
				const body = await parseBody(req);
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) return json({
					success: true,
					data: memUpdate("invoices", existing.id, body)
				});
				else {
					const fields = [];
					const vals = [];
					for (const k of [
						"student",
						"amount",
						"amount_value",
						"currency",
						"type",
						"date",
						"status"
					]) if (body[k] !== void 0) {
						fields.push(`${k}=?`);
						vals.push(body[k]);
					}
					if (!fields.length) return errJson(400, "No fields");
					vals.push(existing.id);
					await execute(`UPDATE invoices SET ${fields.join(",")} WHERE id=?`, vals);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM invoices WHERE id=?", [existing.id])
					});
				}
			}
			if (method === "DELETE") {
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) memDelete("invoices", existing.id);
				else await execute("DELETE FROM invoices WHERE id=?", [existing.id]);
				return json({
					success: true,
					message: "Deleted"
				});
			}
		}
		if (path === "/api/staff/hierarchy" && method === "GET") {
			const userPayload = authMiddleware(req);
			if (userPayload) {
				const r = (userPayload.role || "").toLowerCase();
				if (!(r === "super_admin" || r === "branch_admin" || r === "admin" || r.includes("admin") || r.includes("director") || r.includes("ceo"))) return errJson(403, "Access restricted: Staff members cannot access HR organogram.");
			}
			const isMem = isMemoryMode();
			const branchFilter = qp(url, "branch", "");
			const branches = isMem ? memList("branches") || [] : await query("SELECT * FROM branches ORDER BY id ASC");
			const employees = isMem ? memList("employees") || [] : await query("SELECT * FROM employees ORDER BY id ASC");
			return json({
				success: true,
				data: branches.filter((b) => !branchFilter || b.name === branchFilter).map((b) => {
					const branchEmps = employees.filter((e) => e.branch === b.name || e.branch && b.name && e.branch.includes(b.name));
					const admin = branchEmps.find((e) => e.role === "branch_admin" || (e.role || "").toLowerCase().includes("branch admin") || (e.designation || "").toLowerCase().includes("head") || e.name === b.head) || {
						name: b.head || "Branch Admin",
						role: "branch_admin",
						designation: "Branch Head / Branch Manager",
						email: `${b.name.toLowerCase().replace(/[^a-z]/g, "")}.admin@uniquesta.com`,
						phone: "+91 98200 00000",
						branch: b.name
					};
					const staff = branchEmps.filter((e) => e.id !== admin.id && e.role !== "super_admin" && e.role !== "branch_admin");
					return {
						branch: b.name,
						city: b.city || b.name,
						region: b.region || "HQ",
						admin,
						staff,
						stats: {
							totalStaff: staff.length,
							counselors: staff.filter((s) => (s.designation || s.role || "").toLowerCase().includes("counsel")).length,
							visaOfficers: staff.filter((s) => (s.designation || s.role || "").toLowerCase().includes("visa")).length,
							finance: staff.filter((s) => (s.designation || s.role || "").toLowerCase().includes("finance") || (s.designation || s.role || "").toLowerCase().includes("account")).length,
							travel: staff.filter((s) => (s.designation || s.role || "").toLowerCase().includes("travel") || (s.designation || s.role || "").toLowerCase().includes("fleet")).length,
							frontDesk: staff.filter((s) => (s.designation || s.role || "").toLowerCase().includes("front") || (s.designation || s.role || "").toLowerCase().includes("reception")).length
						}
					};
				})
			});
		}
		if (path === "/api/branches/admins" && method === "GET") {
			const isMem = isMemoryMode();
			const branches = isMem ? memList("branches") || [] : await query("SELECT * FROM branches ORDER BY id ASC");
			const employees = isMem ? memList("employees") || [] : await query("SELECT * FROM employees ORDER BY id ASC");
			return json({
				success: true,
				data: branches.map((b) => {
					const admin = employees.find((e) => (e.branch === b.name || e.branch?.includes(b.name)) && (e.role === "branch_admin" || (e.role || "").toLowerCase().includes("branch admin") || (e.designation || "").toLowerCase().includes("head") || e.name === b.head));
					return {
						branch: b.name,
						head: admin?.name || b.head || "Branch Admin",
						role: "branch_admin",
						designation: admin?.designation || "Branch Head / Branch Manager",
						email: admin?.email || `${b.name.toLowerCase().replace(/[^a-z]/g, "")}.admin@uniquesta.com`,
						phone: admin?.phone || "+91 98200 00000"
					};
				})
			});
		}
		if (path === "/api/employees") {
			if (method === "GET") {
				const userPayload = authMiddleware(req);
				if (userPayload) {
					const r = (userPayload.role || "").toLowerCase();
					if (!(r === "super_admin" || r === "branch_admin" || r === "admin" || r.includes("admin") || r.includes("director") || r.includes("ceo"))) return errJson(403, "Access restricted: Staff members cannot access HR staff directory.");
				}
				const { page, limit, offset } = pagination(url);
				const search = qp(url, "search", "").toLowerCase();
				const branch = qp(url, "branch", "");
				const role = qp(url, "role", "");
				const status = qp(url, "status", "");
				if (isMemoryMode()) {
					let rows = memList("employees");
					if (search) rows = rows.filter((r) => r.name?.toLowerCase().includes(search) || r.role?.toLowerCase().includes(search) || r.designation?.toLowerCase().includes(search) || r.email?.toLowerCase().includes(search));
					if (branch && branch !== "All Branches") rows = rows.filter((r) => r.branch === branch);
					if (role) rows = rows.filter((r) => r.role?.toLowerCase().includes(role.toLowerCase()) || r.designation?.toLowerCase().includes(role.toLowerCase()));
					if (status) rows = rows.filter((r) => r.status === status);
					const total = rows.length;
					rows = rows.slice(offset, offset + limit);
					return json({
						success: true,
						data: rows,
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit)
						}
					});
				} else {
					let where = " WHERE 1=1";
					const params = [];
					if (search) {
						where += " AND (name LIKE ? OR role LIKE ? OR designation LIKE ? OR email LIKE ?)";
						params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
					}
					if (branch && branch !== "All Branches") {
						where += " AND branch = ?";
						params.push(branch);
					}
					if (role) {
						where += " AND (role LIKE ? OR designation LIKE ?)";
						params.push(`%${role}%`, `%${role}%`);
					}
					if (status) {
						where += " AND status = ?";
						params.push(status);
					}
					const cnt = await queryOne(`SELECT COUNT(*) as total FROM employees${where}`, params);
					return json({
						success: true,
						data: await query(`SELECT * FROM employees${where} ORDER BY id ASC LIMIT ? OFFSET ?`, [
							...params,
							limit,
							offset
						]),
						pagination: {
							page,
							limit,
							total: cnt.total,
							totalPages: Math.ceil(cnt.total / limit)
						}
					});
				}
			}
			if (method === "POST") {
				const userPayload = authMiddleware(req);
				const data = parseOrThrow(employeeSchema, await parseBody(req));
				const isMem = isMemoryMode();
				if (userPayload) {
					if (userPayload.role === "branch_admin") {
						const requestedRole = (data.role || "").toLowerCase();
						const requestedDesig = (data.designation || "").toLowerCase();
						if (requestedRole === "super_admin" || requestedRole === "branch_admin" || requestedRole.includes("admin") || requestedDesig.includes("admin") || requestedDesig.includes("head")) return errJson(403, "Access restricted: Branch Admins cannot appoint Admins. Only Super Admin has this privilege.");
						if (userPayload.branch && data.branch !== userPayload.branch) return errJson(403, `Access restricted: Branch Admins can only add staff for their assigned branch (${userPayload.branch}).`);
					} else if (userPayload.role !== "super_admin") return errJson(403, "Access restricted: Only Administrators can add employees.");
				}
				let sysRole = "staff";
				const roleLower = (data.role || "").toLowerCase();
				if (roleLower === "super_admin" || roleLower.includes("super admin")) sysRole = "super_admin";
				else if (roleLower === "branch_admin" || roleLower.includes("branch admin") || roleLower.includes("head")) sysRole = "branch_admin";
				else sysRole = "staff";
				let designation = (data.designation || "").trim();
				if (!designation) {
					if (sysRole === "branch_admin") designation = "Branch Head / Branch Manager";
					else if (sysRole === "super_admin") designation = "Super Admin / Headquarters";
					else designation = data.role || "Staff Member";
				}
				let reportsTo = data.reports_to;
				if (!reportsTo && sysRole !== "super_admin") {
					if (isMem) {
						const b = memList("branches").find((br) => br.name === data.branch);
						reportsTo = b?.head ? `${b.head} (Branch Admin · ${data.branch})` : `Branch Admin · ${data.branch}`;
					} else {
						const branchRow = await queryOne("SELECT head FROM branches WHERE name = ?", [data.branch]);
						reportsTo = branchRow?.head ? `${branchRow.head} (Branch Admin · ${data.branch})` : `Branch Admin · ${data.branch}`;
					}
				}
				let userId = null;
				const shouldCreateLogin = data.create_login !== false && !!data.email;
				if (shouldCreateLogin) {
					const passwordHash = await hashPassword(data.password?.trim() || (sysRole === "branch_admin" ? "admin123" : "staff123"));
					if (isMem) {
						let existingUser = memList("users").find((u) => u.email === data.email);
						if (existingUser) {
							existingUser = memUpdate("users", existingUser.id, {
								name: data.name,
								role: sysRole,
								designation,
								branch: data.branch,
								reports_to: reportsTo,
								phone: data.phone || existingUser.phone,
								password_hash: passwordHash
							});
							userId = existingUser.id;
						} else userId = memCreate("users", {
							name: data.name,
							email: data.email,
							password_hash: passwordHash,
							role: sysRole,
							designation,
							branch: data.branch,
							reports_to: reportsTo,
							phone: data.phone || "",
							status: "Active"
						}).id;
					} else {
						const existingUser = await queryOne("SELECT id FROM users WHERE email = ?", [data.email]);
						if (existingUser) {
							await execute("UPDATE users SET name=?, password_hash=?, role=?, designation=?, branch=?, reports_to=?, phone=? WHERE id=?", [
								data.name,
								passwordHash,
								sysRole,
								designation,
								data.branch,
								reportsTo,
								data.phone || "",
								existingUser.id
							]);
							userId = existingUser.id;
						} else userId = (await execute("INSERT INTO users (name, email, password_hash, role, designation, branch, reports_to, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active')", [
							data.name,
							data.email,
							passwordHash,
							sysRole,
							designation,
							data.branch,
							reportsTo,
							data.phone || ""
						])).insertId;
					}
				}
				if (sysRole === "branch_admin") {
					if (isMem) {
						const br = (memList("branches") || []).find((b) => b.name === data.branch);
						if (br) memUpdate("branches", br.id, { head: data.name });
					} else await execute("UPDATE branches SET head=? WHERE name=?", [data.name, data.branch]);
				}
				let row;
				if (isMem) row = memCreate("employees", {
					name: data.name,
					email: data.email || null,
					phone: data.phone || null,
					role: sysRole,
					designation,
					branch: data.branch,
					reports_to: reportsTo,
					user_id: userId,
					status: data.status || "Active",
					joined_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
				});
				else row = await queryOne("SELECT * FROM employees WHERE id = ?", [(await execute("INSERT INTO employees (name, email, phone, role, designation, branch, reports_to, user_id, status, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())", [
					data.name,
					data.email || null,
					data.phone || null,
					sysRole,
					designation,
					data.branch,
					reportsTo,
					userId,
					data.status || "Active"
				])).insertId]);
				return json({
					success: true,
					data: row,
					message: shouldCreateLogin ? `${sysRole === "branch_admin" ? "Branch Admin appointed" : "Staff added under " + reportsTo}. Login credentials created for ${data.email}.` : `${sysRole === "branch_admin" ? "Branch Admin appointed" : "Staff added under " + reportsTo}.`
				}, 201);
			}
		}
		const mEmp = path.match(/^\/api\/employees\/(\d+)$/);
		if (mEmp) {
			const id = parseInt(mEmp[1], 10);
			const isMem = isMemoryMode();
			if (method === "GET") {
				const row = isMem ? memGet("employees", id) : await queryOne("SELECT * FROM employees WHERE id=?", [id]);
				if (!row) return errJson(404, "Employee not found");
				return json({
					success: true,
					data: row
				});
			}
			if (method === "PUT" || method === "PATCH") {
				const userPayload = authMiddleware(req);
				const body = await parseBody(req);
				if (userPayload && userPayload.role === "branch_admin") {
					if (body.role && (body.role === "super_admin" || body.role === "branch_admin")) return errJson(403, "Access restricted: Branch Admins cannot elevate users to Admin roles.");
				}
				if (isMem) {
					const upd = memUpdate("employees", id, body);
					if (!upd) return errJson(404, "Not found");
					return json({
						success: true,
						data: upd
					});
				} else {
					const fields = [];
					const vals = [];
					for (const k of [
						"name",
						"email",
						"phone",
						"role",
						"designation",
						"branch",
						"reports_to",
						"status"
					]) if (body[k] !== void 0) {
						fields.push(`${k}=?`);
						vals.push(body[k]);
					}
					if (!fields.length) return errJson(400, "No fields to update");
					vals.push(id);
					await execute(`UPDATE employees SET ${fields.join(",")} WHERE id=?`, vals);
					if (body.password && body.email) await execute("UPDATE users SET password_hash=? WHERE email=?", [await hashPassword(body.password), body.email]);
					if (body.email && (body.designation || body.role)) {
						const uFields = [];
						const uVals = [];
						if (body.designation) {
							uFields.push("designation=?");
							uVals.push(body.designation);
						}
						if (body.role) {
							uFields.push("role=?");
							uVals.push(body.role);
						}
						uVals.push(body.email);
						await execute(`UPDATE users SET ${uFields.join(",")} WHERE email=?`, uVals);
					}
					return json({
						success: true,
						data: await queryOne("SELECT * FROM employees WHERE id=?", [id])
					});
				}
			}
			if (method === "DELETE") {
				const userPayload = authMiddleware(req);
				if (userPayload && userPayload.role !== "super_admin" && userPayload.role !== "branch_admin") return errJson(403, "Access restricted: Only Administrators can delete staff members.");
				if (isMem) {
					const emp = memGet("employees", id);
					if (!emp) return errJson(404, "Not found");
					memDelete("employees", id);
					if (emp.user_id) memDelete("users", emp.user_id);
				} else {
					const emp = await queryOne("SELECT user_id, email, branch FROM employees WHERE id=?", [id]);
					if (!emp) return errJson(404, "Not found");
					if (userPayload && userPayload.role === "branch_admin" && userPayload.branch && emp.branch !== userPayload.branch) return errJson(403, "Branch Admins can only delete staff members from their own branch.");
					await execute("DELETE FROM employees WHERE id=?", [id]);
					if (emp.user_id) {
						const user = await queryOne("SELECT role FROM users WHERE id=?", [emp.user_id]);
						if (user && user.role !== "super_admin") await execute("DELETE FROM users WHERE id=?", [emp.user_id]);
					}
				}
				return json({
					success: true,
					message: "Staff member deleted successfully"
				});
			}
		}
		if (path === "/api/approvals") {
			if (method === "GET") {
				const { page, limit, offset } = pagination(url);
				if (isMemoryMode()) {
					let rows = memList("approvals");
					const total = rows.length;
					rows = rows.slice(offset, offset + limit);
					return json({
						success: true,
						data: rows.map((ap) => ({
							...ap,
							steps: memList("approval_steps").filter((s) => s.approval_id === ap.id).sort((a, b) => a.step_order - b.step_order)
						})),
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit)
						}
					});
				} else {
					const cnt = await queryOne("SELECT COUNT(*) as total FROM approvals");
					const rows = await query("SELECT * FROM approvals ORDER BY id DESC LIMIT ? OFFSET ?", [limit, offset]);
					for (const r of rows) r.steps = await query("SELECT * FROM approval_steps WHERE approval_id=? ORDER BY step_order ASC", [r.id]);
					return json({
						success: true,
						data: rows,
						pagination: {
							page,
							limit,
							total: cnt.total,
							totalPages: Math.ceil(cnt.total / limit)
						}
					});
				}
			}
			if (method === "POST") {
				const body = await parseBody(req);
				const data = parseOrThrow(approvalSchema, body);
				const code = body.code || genCode("REIMB");
				const amountVal = data.amount_value != null ? data.amount_value : parseInt(data.amount.replace(/\D/g, ""), 10) || 0;
				const isMem = isMemoryMode();
				let branchAdmin;
				let financeLead;
				let directorLead;
				let ceoLead;
				if (isMem) {
					branchAdmin = memList("employees").find((e) => (e.branch === data.branch || data.branch.includes(e.branch)) && (e.role?.includes("Branch Admin") || e.role?.includes("branch_admin")));
					financeLead = memList("employees").find((e) => e.role?.toLowerCase().includes("finance"));
					directorLead = memList("employees").find((e) => e.role?.toLowerCase().includes("director"));
					ceoLead = memList("employees").find((e) => e.role?.toLowerCase().includes("super admin") || e.role?.toLowerCase().includes("ceo"));
				} else {
					branchAdmin = await queryOne("SELECT * FROM employees WHERE (branch = ? OR ? LIKE CONCAT('%', branch, '%')) AND (role LIKE '%Branch Admin%' OR role LIKE '%branch_admin%') LIMIT 1", [data.branch, data.branch]);
					if (!branchAdmin) branchAdmin = await queryOne("SELECT * FROM users WHERE (branch = ? OR ? LIKE CONCAT('%', branch, '%')) AND role = 'branch_admin' LIMIT 1", [data.branch, data.branch]);
					financeLead = await queryOne("SELECT * FROM employees WHERE role LIKE '%finance%' LIMIT 1");
					directorLead = await queryOne("SELECT * FROM employees WHERE role LIKE '%director%' LIMIT 1");
					ceoLead = await queryOne("SELECT * FROM employees WHERE role LIKE '%super admin%' OR role LIKE '%ceo%' LIMIT 1");
				}
				const bAdminName = branchAdmin?.name || (data.branch.includes("Delhi") ? "Karan Mehta" : data.branch.includes("Bengaluru") ? "Divya Rao" : data.branch.includes("Hyderabad") ? "Rahul Reddy" : "Rahul Deshmukh");
				const bAdminEmail = branchAdmin?.email || (data.branch.includes("Delhi") ? "delhi.admin@uniquesta.com" : data.branch.includes("Bengaluru") ? "bangalore.admin@uniquesta.com" : data.branch.includes("Hyderabad") ? "hyderabad.admin@uniquesta.com" : "mumbai.admin@uniquesta.com");
				const bAdminRole = `Branch Manager · ${data.branch.split("·")[0].trim()}`;
				const bAdminInitials = bAdminName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
				const finName = financeLead?.name || "Anjali Kapoor";
				const finRole = "Finance · AP Lead";
				const finInitials = finName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
				const dirName = directorLead?.name || "Vivek Ramanathan";
				const dirRole = "Director · Operations";
				const dirInitials = dirName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
				const ceoName = ceoLead?.name || "Mohammad Iqbal";
				const ceoRole = "CEO · Executive Sign-off";
				const ceoInitials = ceoName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
				const submitter = data.submitted_by || "Meera Shah";
				const subInitials = submitter.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
				let row;
				if (isMem) {
					row = memCreate("approvals", {
						code,
						...data,
						amount_value: amountVal,
						submitted_by: submitter,
						submitted_date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN") + " · " + (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
							hour: "2-digit",
							minute: "2-digit"
						}),
						period: data.period || "",
						branch: data.branch,
						attachments: data.attachments ?? 1,
						status: `Pending ${bAdminName} Approval`,
						current_stage: 1
					});
					[
						{
							approval_id: row.id,
							name: submitter,
							role: "Employee Submitter",
							initials: subInitials,
							status: "approved",
							time: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
								hour: "2-digit",
								minute: "2-digit"
							}),
							comment: body.notes || "Submitted expense claim with receipts.",
							step_order: 0
						},
						{
							approval_id: row.id,
							name: bAdminName,
							role: bAdminRole,
							initials: bAdminInitials,
							status: "current",
							time: "Active Review",
							comment: "",
							step_order: 1
						},
						{
							approval_id: row.id,
							name: finName,
							role: finRole,
							initials: finInitials,
							status: "upcoming",
							time: "Awaiting Branch Head",
							comment: "",
							step_order: 2
						},
						{
							approval_id: row.id,
							name: dirName,
							role: dirRole,
							initials: dirInitials,
							status: "upcoming",
							time: "Awaiting Finance",
							comment: "",
							step_order: 3
						},
						{
							approval_id: row.id,
							name: ceoName,
							role: ceoRole,
							initials: ceoInitials,
							status: "upcoming",
							time: "Awaiting Director",
							comment: "",
							step_order: 4
						},
						{
							approval_id: row.id,
							name: "Payment Released",
							role: "Finance · Payouts",
							initials: "₹",
							status: "released",
							time: "Est. 48h after CEO",
							comment: "NEFT direct transfer upon CEO sign-off.",
							step_order: 5
						}
					].forEach((s) => memCreate("approval_steps", s));
					row.steps = memList("approval_steps").filter((s) => s.approval_id === row.id);
				} else {
					const newId = (await execute("INSERT INTO approvals (code,title,amount,amount_value,category,submitted_by,submitted_date,period,branch,attachments,status,current_stage) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [
						code,
						data.title,
						data.amount,
						amountVal,
						data.category,
						submitter,
						(/* @__PURE__ */ new Date()).toLocaleString("en-IN"),
						data.period || "",
						data.branch,
						data.attachments ?? 1,
						`Pending ${bAdminName} Approval`,
						1
					])).insertId;
					const steps = [
						[
							newId,
							submitter,
							"Employee Submitter",
							subInitials,
							"approved",
							(/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
								hour: "2-digit",
								minute: "2-digit"
							}),
							body.notes || "Submitted expense claim with attached bills.",
							0
						],
						[
							newId,
							bAdminName,
							bAdminRole,
							bAdminInitials,
							"current",
							"Active Review",
							"",
							1
						],
						[
							newId,
							finName,
							finRole,
							finInitials,
							"upcoming",
							"Awaiting Branch Head",
							"",
							2
						],
						[
							newId,
							dirName,
							dirRole,
							dirInitials,
							"upcoming",
							"Awaiting Finance",
							"",
							3
						],
						[
							newId,
							ceoName,
							ceoRole,
							ceoInitials,
							"upcoming",
							"Awaiting Director",
							"",
							4
						],
						[
							newId,
							"Payment Released",
							"Finance · Payouts",
							"₹",
							"released",
							"Est. 48h after CEO",
							"NEFT direct transfer upon CEO sign-off.",
							5
						]
					];
					for (const s of steps) await execute("INSERT INTO approval_steps (approval_id,name,role,initials,status,time,comment,step_order) VALUES (?,?,?,?,?,?,?,?)", s);
					await execute("INSERT INTO notifications (user_email, user_role, title, message, type, reference_id, sender_name) VALUES (?, ?, ?, ?, ?, ?, ?)", [
						bAdminEmail,
						"branch_admin",
						`New Expense Claim from ${submitter}`,
						`${submitter} submitted ${code} (${data.amount}) for ${data.title}. Awaiting your review.`,
						"approval",
						code,
						submitter
					]);
					row = await queryOne("SELECT * FROM approvals WHERE id=?", [newId]);
					row.steps = await query("SELECT * FROM approval_steps WHERE approval_id=? ORDER BY step_order ASC", [newId]);
				}
				return json({
					success: true,
					data: row
				}, 201);
			}
		}
		const mAprPass = path.match(/^\/api\/approvals\/([^\/]+)\/pass$/);
		if (mAprPass && method === "POST") {
			const codeOrId = mAprPass[1];
			const body = await parseBody(req);
			const action = body.action || "approve";
			const message = (body.message || "").trim();
			const approverName = body.approver_name || "Approver";
			const approverRole = body.approver_role || "Executive";
			const isMem = isMemoryMode();
			let ap;
			if (isMem) ap = memGet("approvals", codeOrId) ?? memList("approvals").find((a) => a.code === codeOrId) ?? memGet("approvals", parseInt(codeOrId, 10));
			else ap = /^\d+$/.test(codeOrId) ? await queryOne("SELECT * FROM approvals WHERE id=?", [codeOrId]) : await queryOne("SELECT * FROM approvals WHERE code=?", [codeOrId]);
			if (!ap) return errJson(404, "Approval not found");
			let steps;
			if (isMem) steps = memList("approval_steps").filter((s) => s.approval_id === ap.id).sort((a, b) => a.step_order - b.step_order);
			else steps = await query("SELECT * FROM approval_steps WHERE approval_id=? ORDER BY step_order ASC", [ap.id]);
			const activeIdx = steps.findIndex((s) => s.status === "current");
			const activeStep = activeIdx >= 0 ? steps[activeIdx] : steps[ap.current_stage || 1];
			if (!activeStep) return errJson(400, "No active approval stage found for this application.");
			const reqRole = (body.approver_role || "").toLowerCase();
			const reqEmail = (body.user_email || "").toLowerCase();
			const stRole = (activeStep.role || "").toLowerCase();
			const stName = (activeStep.name || "").toLowerCase();
			let isTurn = false;
			if (stRole.includes("ceo") || stName.includes("iqbal")) isTurn = reqRole.includes("ceo") || reqRole === "super_admin" || reqEmail.includes("ceo") || reqEmail === "admin@uniquesta.com";
			else if (stRole.includes("director") || stName.includes("vivek")) isTurn = reqRole.includes("director") || reqEmail.includes("director");
			else if (stRole.includes("branch manager") || stRole.includes("branch admin") || stName.includes("deshmukh") || stName.includes("mehta")) isTurn = reqRole.includes("branch") || reqEmail.includes("admin");
			else if (stRole.includes("finance") || stName.includes("anjali")) isTurn = reqRole.includes("finance") || reqEmail.includes("finance");
			if (!isTurn) return errJson(403, `It is not your turn to act on this application. Currently awaiting: ${activeStep.name} (${activeStep.role}).`);
			const nowTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
				hour: "2-digit",
				minute: "2-digit"
			}) + " · " + (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN");
			if (action === "approve") {
				const nextIdx = (activeIdx >= 0 ? activeIdx : ap.current_stage) + 1;
				const nextStep = steps[nextIdx];
				const finalMsg = message || `Approved and forwarded to ${nextStep ? nextStep.name : "payout"}.`;
				if (isMem) memUpdate("approval_steps", activeStep.id, {
					name: approverName || activeStep.name,
					role: approverRole || activeStep.role,
					status: "approved",
					comment: finalMsg,
					time: nowTime
				});
				else await execute("UPDATE approval_steps SET name=?, role=?, status='approved', comment=?, time=? WHERE id=?", [
					approverName || activeStep.name,
					approverRole || activeStep.role,
					finalMsg,
					nowTime,
					activeStep.id
				]);
				if (nextStep && nextStep.step_order < 5) {
					if (isMem) memUpdate("approval_steps", nextStep.id, {
						status: "current",
						time: "Active Review"
					});
					else await execute("UPDATE approval_steps SET status='current', time='Active Review' WHERE id=?", [nextStep.id]);
					let newStatus = `Pending ${nextStep.role} Approval`;
					let notifyEmail = "admin@uniquesta.com";
					let notifyRole = "super_admin";
					const nRole = nextStep.role.toLowerCase();
					if (nRole.includes("ceo")) {
						newStatus = "Pending CEO Approval";
						notifyEmail = "admin@uniquesta.com";
						notifyRole = "super_admin";
					} else if (nRole.includes("director")) {
						newStatus = "Pending Director Approval";
						notifyEmail = "director@uniquesta.com";
						notifyRole = "director";
					} else if (nRole.includes("finance")) {
						newStatus = "Pending Finance Approval";
						notifyEmail = "anjali.finance@uniquesta.com";
						notifyRole = "finance";
					}
					if (isMem) memUpdate("approvals", ap.id, {
						status: newStatus,
						current_stage: nextIdx
					});
					else {
						await execute("UPDATE approvals SET status=?, current_stage=? WHERE id=?", [
							newStatus,
							nextIdx,
							ap.id
						]);
						await execute("INSERT INTO notifications (user_email, user_role, title, message, type, reference_id, sender_name) VALUES (?, ?, ?, ?, 'approval', ?, ?)", [
							notifyEmail,
							notifyRole,
							`Expense Approval Passed: ${ap.code} (${ap.amount})`,
							`${approverName} (${approverRole}) forwarded ${ap.title} to you with message: "${finalMsg}"`,
							ap.code,
							approverName
						]);
					}
					return json({
						success: true,
						message: `Approved and passed to ${nextStep.name} (${nextStep.role})! Notification dispatched.`,
						nextStage: nextStep.name
					});
				} else {
					if (isMem) {
						memUpdate("approvals", ap.id, {
							status: "CEO Approved · Ready for Payout",
							current_stage: 5
						});
						if (nextStep) memUpdate("approval_steps", nextStep.id, {
							status: "released",
							time: "Queued for Payout"
						});
					} else {
						await execute("UPDATE approvals SET status='CEO Approved · Ready for Payout', current_stage=5 WHERE id=?", [ap.id]);
						if (nextStep) await execute("UPDATE approval_steps SET status='released', time='Queued for Payout' WHERE id=?", [nextStep.id]);
						await execute("INSERT INTO notifications (user_email, user_role, title, message, type, reference_id, sender_name) VALUES (?, 'finance', ?, ?, 'approval', ?, ?)", [
							"anjali.finance@uniquesta.com",
							`CEO Approved: Payout Ready for ${ap.code}`,
							`CEO Mohammad Iqbal has authorized release of ${ap.amount} for ${ap.title}. Proceed with NEFT payment.`,
							ap.code,
							approverName
						]);
					}
					return json({
						success: true,
						message: `CEO Final Sign-off complete! Payout release queued for ${ap.code}.`,
						nextStage: "Payment Released"
					});
				}
			} else if (action === "reject") {
				const rejectMsg = message || "Expense request rejected by reviewer.";
				if (isMem) {
					memUpdate("approval_steps", activeStep.id, {
						status: "rejected",
						comment: rejectMsg,
						time: nowTime
					});
					memUpdate("approvals", ap.id, { status: "Rejected" });
				} else {
					await execute("UPDATE approval_steps SET status='rejected', comment=?, time=? WHERE id=?", [
						rejectMsg,
						nowTime,
						activeStep.id
					]);
					await execute("UPDATE approvals SET status='Rejected' WHERE id=?", [ap.id]);
					await execute("INSERT INTO notifications (user_email, user_role, title, message, type, reference_id, sender_name) VALUES (?, 'employee', ?, ?, 'alert', ?, ?)", [
						ap.submitted_by ? `${ap.submitted_by.toLowerCase().replace(/[^a-z]/g, "")}@uniquesta.com` : "meera.counselor@uniquesta.com",
						`Expense Request Rejected: ${ap.code}`,
						`${approverName} rejected your reimbursement request (${ap.amount}): "${rejectMsg}"`,
						ap.code,
						approverName
					]);
				}
				return json({
					success: true,
					message: `Request ${ap.code} rejected.`
				});
			} else if (action === "send_back") {
				const sendBackMsg = message || "Sent back for receipt clarification.";
				const prevIdx = Math.max(0, (activeIdx >= 0 ? activeIdx : ap.current_stage) - 1);
				const prevStep = steps[prevIdx];
				if (isMem) {
					memUpdate("approval_steps", activeStep.id, {
						status: "pending",
						comment: sendBackMsg
					});
					if (prevStep) memUpdate("approval_steps", prevStep.id, {
						status: "current",
						time: "Action Required"
					});
					memUpdate("approvals", ap.id, {
						status: "Revision Requested",
						current_stage: prevIdx
					});
				} else {
					await execute("UPDATE approval_steps SET status='pending', comment=? WHERE id=?", [sendBackMsg, activeStep.id]);
					if (prevStep) await execute("UPDATE approval_steps SET status='current', time='Action Required' WHERE id=?", [prevStep.id]);
					await execute("UPDATE approvals SET status='Revision Requested', current_stage=? WHERE id=?", [prevIdx, ap.id]);
				}
				return json({
					success: true,
					message: `Request sent back with message: "${sendBackMsg}".`
				});
			}
		}
		const mApr = path.match(/^\/api\/approvals\/([^\/]+)$/);
		if (mApr && !path.includes("/steps") && !path.includes("/pass")) {
			const key = mApr[1];
			const find = async () => {
				if (isMemoryMode()) return memGet("approvals", key) ?? memList("approvals").find((a) => a.code === key) ?? (/^\d+$/.test(key) ? memGet("approvals", parseInt(key, 10)) : null);
				else if (/^\d+$/.test(key)) return await queryOne("SELECT * FROM approvals WHERE id=?", [key]);
				else return await queryOne("SELECT * FROM approvals WHERE code=?", [key]);
			};
			if (method === "GET") {
				const row = await find();
				if (!row) return errJson(404, "Approval not found");
				let steps;
				if (isMemoryMode()) steps = memList("approval_steps").filter((s) => s.approval_id === row.id).sort((a, b) => a.step_order - b.step_order);
				else steps = await query("SELECT * FROM approval_steps WHERE approval_id=? ORDER BY step_order ASC", [row.id]);
				return json({
					success: true,
					data: {
						...row,
						steps
					}
				});
			}
			if (method === "PUT" || method === "PATCH") {
				const body = await parseBody(req);
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) return json({
					success: true,
					data: memUpdate("approvals", existing.id, body)
				});
				else {
					const fields = [];
					const vals = [];
					for (const k of [
						"title",
						"amount",
						"category",
						"branch",
						"status",
						"current_stage"
					]) if (body[k] !== void 0) {
						fields.push(`${k}=?`);
						vals.push(body[k]);
					}
					if (!fields.length) return errJson(400, "No fields");
					vals.push(existing.id);
					await execute(`UPDATE approvals SET ${fields.join(",")} WHERE id=?`, vals);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM approvals WHERE id=?", [existing.id])
					});
				}
			}
			if (method === "DELETE") {
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) {
					memDelete("approvals", existing.id);
					memList("approval_steps").filter((s) => s.approval_id === existing.id).forEach((s) => memDelete("approval_steps", s.id));
				} else await execute("DELETE FROM approvals WHERE id=?", [existing.id]);
				return json({
					success: true,
					message: "Deleted"
				});
			}
		}
		const mAprStep = path.match(/^\/api\/approvals\/([^\/]+)\/steps\/(\d+)$/);
		if (mAprStep && (method === "PUT" || method === "PATCH")) {
			const apKey = mAprStep[1];
			const stepId = parseInt(mAprStep[2], 10);
			const data = parseOrThrow(approvalStepUpdateSchema, await parseBody(req));
			const isMem = isMemoryMode();
			let ap;
			if (isMem) ap = memGet("approvals", apKey) ?? memList("approvals").find((a) => a.code === apKey) ?? memGet("approvals", parseInt(apKey, 10));
			else ap = /^\d+$/.test(apKey) ? await queryOne("SELECT * FROM approvals WHERE id=?", [apKey]) : await queryOne("SELECT * FROM approvals WHERE code=?", [apKey]);
			if (!ap) return errJson(404, "Approval not found");
			let step;
			if (isMem) step = memGet("approval_steps", stepId);
			else step = await queryOne("SELECT * FROM approval_steps WHERE id=? AND approval_id=?", [stepId, ap.id]);
			if (!step) return errJson(404, "Step not found");
			if (isMem) return json({
				success: true,
				data: memUpdate("approval_steps", stepId, {
					status: data.status,
					comment: data.comment ?? step.comment
				})
			});
			else {
				await execute("UPDATE approval_steps SET status=?, comment=? WHERE id=?", [
					data.status,
					data.comment ?? step.comment,
					stepId
				]);
				return json({
					success: true,
					data: await queryOne("SELECT * FROM approval_steps WHERE id=?", [stepId])
				});
			}
		}
		if (path === "/api/notifications") {
			if (method === "GET") {
				const email = qp(url, "email", "").trim();
				if (isMemoryMode()) {
					let list = memList("notifications") || [];
					if (email) list = list.filter((n) => !n.user_email || n.user_email === email || email === "admin@uniquesta.com" && n.user_email === "ceo@uniquesta.com");
					const unreadCount = list.filter((n) => !n.read_status).length;
					return json({
						success: true,
						data: list,
						unreadCount
					});
				} else {
					let where = "";
					const params = [];
					if (email) {
						where = " WHERE user_email = ? OR (user_email = 'ceo@uniquesta.com' AND ? = 'admin@uniquesta.com') OR user_email = 'all'";
						params.push(email, email);
					}
					return json({
						success: true,
						data: await query(`SELECT * FROM notifications${where} ORDER BY id DESC LIMIT 50`, params),
						unreadCount: (await queryOne(`SELECT COUNT(*) as c FROM notifications${where ? where + " AND read_status = 0" : " WHERE read_status = 0"}`, params))?.c || 0
					});
				}
			}
		}
		const mNotifRead = path.match(/^\/api\/notifications\/(\d+)\/read$/);
		if (mNotifRead && method === "PUT") {
			const id = parseInt(mNotifRead[1], 10);
			if (isMemoryMode()) memUpdate("notifications", id, { read_status: true });
			else await execute("UPDATE notifications SET read_status = 1 WHERE id = ?", [id]);
			return json({
				success: true,
				message: "Notification marked read"
			});
		}
		if (path === "/api/notifications/mark-all-read" && method === "POST") {
			const email = (await parseBody(req)).email || "";
			if (isMemoryMode()) (memList("notifications") || []).forEach((n) => {
				if (!email || n.user_email === email) n.read_status = true;
			});
			else if (email) await execute("UPDATE notifications SET read_status = 1 WHERE user_email = ? OR (user_email = 'ceo@uniquesta.com' AND ? = 'admin@uniquesta.com')", [email, email]);
			else await execute("UPDATE notifications SET read_status = 1");
			return json({
				success: true,
				message: "All notifications marked read"
			});
		}
		if (path === "/api/referrals" || path === "/api/partners/referrals") {
			if (method === "GET") {
				const { page, limit, offset } = pagination(url);
				const search = qp(url, "search", "").toLowerCase();
				if (isMemoryMode()) {
					let rows = memList("referral_students");
					if (search) rows = rows.filter((r) => r.name.toLowerCase().includes(search) || r.email.toLowerCase().includes(search));
					const total = rows.length;
					rows = rows.slice(offset, offset + limit);
					return json({
						success: true,
						data: rows,
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit)
						}
					});
				} else {
					let where = "";
					const params = [];
					if (search) {
						where = " WHERE name LIKE ? OR email LIKE ?";
						params.push(`%${search}%`, `%${search}%`);
					}
					const cnt = await queryOne(`SELECT COUNT(*) as total FROM referral_students${where}`, params);
					return json({
						success: true,
						data: await query(`SELECT * FROM referral_students${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [
							...params,
							limit,
							offset
						]),
						pagination: {
							page,
							limit,
							total: cnt.total,
							totalPages: Math.ceil(cnt.total / limit)
						}
					});
				}
			}
			if (method === "POST") {
				const body = await parseBody(req);
				const data = parseOrThrow(referralSchema, body);
				const code = body.code || genCode("STU");
				const isMem = isMemoryMode();
				let row;
				if (isMem) row = memCreate("referral_students", {
					code,
					...data,
					status: data.status || "Application Submitted",
					stage: data.stage || "applications",
					referred_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
					commission_est: data.commission_est || "₹ 50,000"
				});
				else row = await queryOne("SELECT * FROM referral_students WHERE id=?", [(await execute("INSERT INTO referral_students (code,name,email,country,university,program,intake,status,stage,referred_date,commission_est) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [
					code,
					data.name,
					data.email,
					data.country,
					data.university,
					data.program,
					data.intake,
					data.status || "Application Submitted",
					data.stage || "applications",
					(/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
					data.commission_est || "₹ 50,000"
				])).insertId]);
				return json({
					success: true,
					data: row
				}, 201);
			}
		}
		const mRef = path.match(/^\/api\/(?:referrals|partners\/referrals)\/([^\/]+)$/);
		if (mRef) {
			const key = mRef[1];
			const find = async () => {
				if (isMemoryMode()) return memGet("referral_students", key) ?? memList("referral_students").find((c) => c.code === key) ?? (/^\d+$/.test(key) ? memGet("referral_students", parseInt(key, 10)) : null);
				else if (/^\d+$/.test(key)) return await queryOne("SELECT * FROM referral_students WHERE id=?", [key]);
				else return await queryOne("SELECT * FROM referral_students WHERE code=?", [key]);
			};
			if (method === "GET") {
				const row = await find();
				if (!row) return errJson(404, "Referral not found");
				return json({
					success: true,
					data: row
				});
			}
			if (method === "PUT" || method === "PATCH") {
				const body = await parseBody(req);
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) return json({
					success: true,
					data: memUpdate("referral_students", existing.id, body)
				});
				else {
					const fields = [];
					const vals = [];
					for (const k of [
						"name",
						"email",
						"country",
						"university",
						"program",
						"intake",
						"status",
						"stage",
						"commission_est"
					]) if (body[k] !== void 0) {
						fields.push(`${k}=?`);
						vals.push(body[k]);
					}
					if (!fields.length) return errJson(400, "No fields");
					vals.push(existing.id);
					await execute(`UPDATE referral_students SET ${fields.join(",")} WHERE id=?`, vals);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM referral_students WHERE id=?", [existing.id])
					});
				}
			}
			if (method === "DELETE") {
				const existing = await find();
				if (!existing) return errJson(404, "Not found");
				if (isMemoryMode()) memDelete("referral_students", existing.id);
				else await execute("DELETE FROM referral_students WHERE id=?", [existing.id]);
				return json({
					success: true,
					message: "Deleted"
				});
			}
		}
		if (path === "/api/b2b-partners" || path.startsWith("/api/b2b-partners/")) {
			const userPayload = authMiddleware(req);
			if (userPayload) {
				const role = (userPayload.role || "").toLowerCase();
				const email = (userPayload.email || "").toLowerCase();
				if (!(role === "super_admin" || role === "branch_admin" || role === "admin" || role === "director" || role === "executive" || role.includes("admin") || role.includes("director") || role.includes("ceo") || email === "admin@uniquesta.com" || email === "director@uniquesta.com")) return errJson(403, "Access restricted: Partner Profit Sharing is only available to Management & Administrators");
			}
		}
		if (path === "/api/b2b-partners") {
			if (method === "GET") {
				const { page, limit, offset } = pagination(url);
				const search = qp(url, "search", "").toLowerCase();
				const branch = qp(url, "branch", "");
				const tier = qp(url, "tier", "");
				const status = qp(url, "status", "");
				if (isMemoryMode()) {
					let rows = memList("b2b_partners") || [];
					if (search) rows = rows.filter((p) => p.name?.toLowerCase().includes(search) || p.company_name?.toLowerCase().includes(search) || p.city?.toLowerCase().includes(search));
					if (branch && branch !== "All Branches") rows = rows.filter((p) => p.branch === branch);
					if (tier && tier !== "All Tiers") rows = rows.filter((p) => p.tier?.toLowerCase().includes(tier.toLowerCase()));
					if (status) rows = rows.filter((p) => p.status === status);
					const total = rows.length;
					const stats = {
						totalPartners: (memList("b2b_partners") || []).length,
						totalRevenue: (memList("b2b_partners") || []).reduce((acc, p) => acc + (parseInt(p.total_revenue, 10) || 0), 0),
						partnerEarnings: (memList("b2b_partners") || []).reduce((acc, p) => acc + (parseInt(p.partner_earnings, 10) || 0), 0),
						adminEarnings: (memList("b2b_partners") || []).reduce((acc, p) => acc + (parseInt(p.admin_earnings, 10) || 0), 0),
						payoutBalance: (memList("b2b_partners") || []).reduce((acc, p) => acc + (parseInt(p.payout_balance, 10) || 0), 0)
					};
					rows = rows.slice(offset, offset + limit);
					return json({
						success: true,
						data: rows,
						stats,
						pagination: {
							page,
							limit,
							total,
							totalPages: Math.ceil(total / limit)
						}
					});
				} else {
					let where = " WHERE 1=1";
					const params = [];
					if (search) {
						where += " AND (company_name LIKE ? OR name LIKE ? OR city LIKE ? OR code LIKE ?)";
						params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
					}
					if (branch && branch !== "All Branches") {
						where += " AND branch = ?";
						params.push(branch);
					}
					if (tier && tier !== "All Tiers") {
						where += " AND tier LIKE ?";
						params.push(`%${tier}%`);
					}
					if (status) {
						where += " AND status = ?";
						params.push(status);
					}
					const cnt = await queryOne(`SELECT COUNT(*) as total FROM b2b_partners${where}`, params);
					const statRow = await queryOne(`SELECT 
            COUNT(*) as totalPartners,
            COALESCE(SUM(total_revenue), 0) as totalRevenue,
            COALESCE(SUM(partner_earnings), 0) as partnerEarnings,
            COALESCE(SUM(admin_earnings), 0) as adminEarnings,
            COALESCE(SUM(payout_balance), 0) as payoutBalance
            FROM b2b_partners`);
					return json({
						success: true,
						data: await query(`SELECT * FROM b2b_partners${where} ORDER BY id ASC LIMIT ? OFFSET ?`, [
							...params,
							limit,
							offset
						]),
						stats: statRow,
						pagination: {
							page,
							limit,
							total: cnt.total,
							totalPages: Math.ceil(cnt.total / limit)
						}
					});
				}
			}
			if (method === "POST") {
				const body = await parseBody(req);
				const data = parseOrThrow(b2bPartnerSchema, body);
				const code = body.code || genCode("PRT");
				const partnerShare = data.partner_share_pct !== void 0 ? data.partner_share_pct : 25;
				const adminShare = 100 - partnerShare;
				const isMem = isMemoryMode();
				const partnerData = {
					code,
					name: data.name,
					company_name: data.company_name,
					email: data.email,
					phone: data.phone,
					city: data.city,
					branch: data.branch || "Mumbai",
					profit_share_type: data.profit_share_type || "percentage",
					partner_share_pct: partnerShare,
					admin_share_pct: adminShare,
					flat_rate_amount: data.flat_rate_amount || 25e3,
					tier: data.tier || `${partnerShare}% Partner Share`,
					status: data.status || "Active",
					total_students: 0,
					total_revenue: 0,
					partner_earnings: 0,
					admin_earnings: 0,
					payout_balance: 0,
					notes: data.notes || ""
				};
				if (isMem) return json({
					success: true,
					data: memCreate("b2b_partners", partnerData)
				}, 201);
				else return json({
					success: true,
					data: await queryOne("SELECT * FROM b2b_partners WHERE id = ?", [(await execute(`INSERT INTO b2b_partners
             (code, name, company_name, email, phone, city, branch, profit_share_type, partner_share_pct, admin_share_pct, flat_rate_amount, tier, status, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
						code,
						data.name,
						data.company_name,
						data.email,
						data.phone,
						data.city,
						partnerData.branch,
						partnerData.profit_share_type,
						partnerShare,
						adminShare,
						partnerData.flat_rate_amount,
						partnerData.tier,
						partnerData.status,
						partnerData.notes
					])).insertId])
				}, 201);
			}
		}
		const mPartnerProfit = path.match(/^\/api\/b2b-partners\/(\d+)\/profit-share$/);
		if (mPartnerProfit && (method === "PUT" || method === "PATCH")) {
			const id = parseInt(mPartnerProfit[1], 10);
			const body = await parseBody(req);
			const isMem = isMemoryMode();
			const partnerShare = parseFloat(body.partner_share_pct ?? 25);
			const adminShare = 100 - partnerShare;
			const profitType = body.profit_share_type || "percentage";
			const flatRate = parseInt(body.flat_rate_amount ?? 25e3, 10);
			const tier = body.tier || `${partnerShare}% Profit Share`;
			if (isMem) {
				const existing = memGet("b2b_partners", id);
				if (!existing) return errJson(404, "Partner not found");
				const rev = parseInt(existing.total_revenue, 10) || 0;
				const newPartnerEarnings = Math.round(rev * (partnerShare / 100));
				return json({
					success: true,
					data: memUpdate("b2b_partners", id, {
						partner_share_pct: partnerShare,
						admin_share_pct: adminShare,
						profit_share_type: profitType,
						flat_rate_amount: flatRate,
						tier,
						partner_earnings: newPartnerEarnings,
						admin_earnings: rev - newPartnerEarnings
					}),
					message: `Profit share set to ${partnerShare}% Partner / ${adminShare}% UniQuesta`
				});
			} else {
				const existing = await queryOne("SELECT * FROM b2b_partners WHERE id = ?", [id]);
				if (!existing) return errJson(404, "Partner not found");
				const rev = parseInt(existing.total_revenue, 10) || 0;
				const newPartnerEarnings = Math.round(rev * (partnerShare / 100));
				await execute(`UPDATE b2b_partners SET 
           partner_share_pct = ?, admin_share_pct = ?, profit_share_type = ?, flat_rate_amount = ?, tier = ?,
           partner_earnings = ?, admin_earnings = ?
           WHERE id = ?`, [
					partnerShare,
					adminShare,
					profitType,
					flatRate,
					tier,
					newPartnerEarnings,
					rev - newPartnerEarnings,
					id
				]);
				return json({
					success: true,
					data: await queryOne("SELECT * FROM b2b_partners WHERE id = ?", [id]),
					message: `Profit share set to ${partnerShare}% Partner / ${adminShare}% UniQuesta`
				});
			}
		}
		const mPartnerSingle = path.match(/^\/api\/b2b-partners\/(\d+)$/);
		if (mPartnerSingle) {
			const id = parseInt(mPartnerSingle[1], 10);
			const isMem = isMemoryMode();
			if (method === "GET") {
				const row = isMem ? memGet("b2b_partners", id) : await queryOne("SELECT * FROM b2b_partners WHERE id = ?", [id]);
				if (!row) return errJson(404, "Partner not found");
				return json({
					success: true,
					data: row
				});
			}
			if (method === "PUT" || method === "PATCH") {
				const body = await parseBody(req);
				if (isMem) {
					const upd = memUpdate("b2b_partners", id, body);
					if (!upd) return errJson(404, "Partner not found");
					return json({
						success: true,
						data: upd
					});
				} else {
					const fields = [];
					const vals = [];
					for (const k of [
						"name",
						"company_name",
						"email",
						"phone",
						"city",
						"branch",
						"profit_share_type",
						"partner_share_pct",
						"admin_share_pct",
						"flat_rate_amount",
						"tier",
						"status",
						"notes"
					]) if (body[k] !== void 0) {
						fields.push(`${k} = ?`);
						vals.push(body[k]);
					}
					if (!fields.length) return errJson(400, "No fields to update");
					vals.push(id);
					await execute(`UPDATE b2b_partners SET ${fields.join(",")} WHERE id = ?`, vals);
					return json({
						success: true,
						data: await queryOne("SELECT * FROM b2b_partners WHERE id = ?", [id])
					});
				}
			}
			if (method === "DELETE") {
				if (isMem) {
					if (!memDelete("b2b_partners", id)) return errJson(404, "Partner not found");
				} else if ((await execute("DELETE FROM b2b_partners WHERE id = ?", [id])).affectedRows === 0) return errJson(404, "Partner not found");
				return json({
					success: true,
					message: "Partner deleted"
				});
			}
		}
		if (path === "/api/commissions") {
			if (method === "GET") return json({
				success: true,
				data: isMemoryMode() ? memList("commissions") : await query("SELECT * FROM commissions ORDER BY id DESC")
			});
			if (method === "POST") {
				const body = await parseBody(req);
				if (!body.student || !body.amount) return errJson(400, "student and amount required");
				const inv_id = body.inv_id || genCode("COMM");
				const isMem = isMemoryMode();
				let row;
				if (isMem) row = memCreate("commissions", {
					inv_id,
					student: body.student,
					university: body.university || "",
					intake: body.intake || "",
					course_fee: body.course_fee || "",
					rate: body.rate || "",
					amount: body.amount,
					status: body.status || "Eligible",
					paid_date: body.paid_date || null,
					utr: body.utr || null
				});
				else row = await queryOne("SELECT * FROM commissions WHERE id=?", [(await execute("INSERT INTO commissions (inv_id,student,university,intake,course_fee,rate,amount,status,paid_date,utr) VALUES (?,?,?,?,?,?,?,?,?,?)", [
					inv_id,
					body.student,
					body.university || "",
					body.intake || "",
					body.course_fee || "",
					body.rate || "",
					body.amount,
					body.status || "Eligible",
					body.paid_date || null,
					body.utr || null
				])).insertId]);
				return json({
					success: true,
					data: row
				}, 201);
			}
		}
		if (path === "/api/payment-requests") {
			if (method === "GET") return json({
				success: true,
				data: isMemoryMode() ? memList("payment_requests") : await query("SELECT * FROM payment_requests ORDER BY id DESC")
			});
			if (method === "POST") {
				const body = await parseBody(req);
				if (!body.amount) return errJson(400, "amount required");
				const req_id = body.req_id || genCode("PR");
				const isMem = isMemoryMode();
				let row;
				if (isMem) row = memCreate("payment_requests", {
					req_id,
					date: body.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
					amount: body.amount,
					bank: body.bank || "HDFC Bank (**** 4921)",
					status: body.status || "Processing",
					utr: body.utr || "Pending Finance Approval",
					notes: body.notes || ""
				});
				else row = await queryOne("SELECT * FROM payment_requests WHERE id=?", [(await execute("INSERT INTO payment_requests (req_id,date,amount,bank,status,utr,notes) VALUES (?,?,?,?,?,?,?)", [
					req_id,
					body.date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
					body.amount,
					body.bank || "HDFC Bank (**** 4921)",
					body.status || "Processing",
					body.utr || "Pending Finance Approval",
					body.notes || null
				])).insertId]);
				return json({
					success: true,
					data: row
				}, 201);
			}
		}
		if (path === "/api/settings") {
			if (method === "GET") {
				const isMem = isMemoryMode();
				let row;
				if (isMem) row = memGet("settings", 1) ?? {
					id: 1,
					legal_name: "Uniquesta Overseas Pvt Ltd",
					support_email: "care@uniquesta.com",
					two_factor: true,
					whatsapp_notify: true
				};
				else row = await queryOne("SELECT * FROM settings WHERE id=1");
				if (!row) row = {
					id: 1,
					legal_name: "Uniquesta Overseas Pvt Ltd",
					support_email: "care@uniquesta.com",
					two_factor: true,
					whatsapp_notify: true
				};
				return json({
					success: true,
					data: row
				});
			}
			if (method === "PUT" || method === "PATCH" || method === "POST") {
				const body = await parseBody(req);
				if (isMemoryMode()) {
					const existing = memGet("settings", 1) ?? {
						id: 1,
						legal_name: "Uniquesta Overseas Pvt Ltd",
						support_email: "care@uniquesta.com",
						two_factor: true,
						whatsapp_notify: true
					};
					const upd = {
						...existing,
						legal_name: body.legal_name ?? existing.legal_name,
						support_email: body.support_email ?? existing.support_email,
						two_factor: body.two_factor ?? existing.two_factor,
						whatsapp_notify: body.whatsapp_notify ?? existing.whatsapp_notify
					};
					memCreate("settings", upd);
					const tbl = getMemStore()["settings"];
					if (tbl) tbl.set(1, upd);
					return json({
						success: true,
						data: upd
					});
				} else {
					await execute("INSERT INTO settings (id,legal_name,support_email,two_factor,whatsapp_notify) VALUES (1,?,?,?,?) ON DUPLICATE KEY UPDATE legal_name=VALUES(legal_name), support_email=VALUES(support_email), two_factor=VALUES(two_factor), whatsapp_notify=VALUES(whatsapp_notify)", [
						body.legal_name || "Uniquesta Overseas Pvt Ltd",
						body.support_email || "care@uniquesta.com",
						body.two_factor ? 1 : 0,
						body.whatsapp_notify ? 1 : 0
					]);
					if (body.legal_name === void 0 || body.support_email === void 0) {
						await queryOne("SELECT * FROM settings WHERE id=1");
						const patch = {};
						if (body.legal_name !== void 0) patch.legal_name = body.legal_name;
						if (body.support_email !== void 0) patch.support_email = body.support_email;
						if (body.two_factor !== void 0) patch.two_factor = body.two_factor ? 1 : 0;
						if (body.whatsapp_notify !== void 0) patch.whatsapp_notify = body.whatsapp_notify ? 1 : 0;
						if (Object.keys(patch).length) await execute(`UPDATE settings SET ${Object.keys(patch).map((k) => `${k}=?`).join(",")} WHERE id=1`, Object.values(patch));
					}
					return json({
						success: true,
						data: await queryOne("SELECT * FROM settings WHERE id=1")
					});
				}
			}
		}
		if (path === "/api/dashboard/stats" && method === "GET") {
			const isMem = isMemoryMode();
			let stats = {};
			if (isMem) {
				const students = memList("students").length;
				const leads = memList("leads").length;
				const apps = memList("applications").length;
				const revenue = memList("invoices").filter((i) => i.status === "Paid").reduce((a, c) => a + (parseInt(String(c.amount_value), 10) || 0), 0);
				stats = {
					totalStudents: students,
					totalBranches: memList("branches").length || 14,
					activeApplications: apps,
					offerLetters: apps,
					revenue,
					pendingApprovals: memList("approvals").length,
					employeeCount: memList("employees").length,
					totalLeads: leads
				};
			} else {
				const s = await queryOne("SELECT COUNT(*) as c FROM students");
				const l = await queryOne("SELECT COUNT(*) as c FROM leads");
				const a = await queryOne("SELECT COUNT(*) as c FROM applications");
				const b = await queryOne("SELECT COUNT(*) as c FROM branches");
				const e = await queryOne("SELECT COUNT(*) as c FROM employees");
				const ap = await queryOne("SELECT COUNT(*) as c FROM approvals");
				const rev = await queryOne("SELECT COALESCE(SUM(amount_value),0) as total FROM invoices WHERE status='Paid'");
				stats = {
					totalStudents: s.c,
					totalBranches: b.c,
					activeApplications: a.c,
					offerLetters: a.c,
					revenue: rev.total,
					pendingApprovals: ap.c,
					employeeCount: e.c,
					totalLeads: l.c
				};
			}
			return json({
				success: true,
				data: stats
			});
		}
		if (path === "/api/reports" && method === "GET") return json({
			success: true,
			data: [
				{
					title: "Admissions Funnel",
					desc: "Lead → Enrolled conversion by branch",
					tag: "Sales"
				},
				{
					title: "Revenue by Destination",
					desc: "Country-wise revenue and margin",
					tag: "Finance"
				},
				{
					title: "Counsellor Productivity",
					desc: "Applications and offers per counsellor",
					tag: "HR"
				}
			]
		});
		if (path === "/api/travel/bookings") {
			if (method === "GET") {
				if (isMemoryMode()) return json({
					success: true,
					data: memList("travel_bookings") || []
				});
				return json({
					success: true,
					data: await query("SELECT * FROM travel_bookings ORDER BY id DESC")
				});
			}
			if (method === "POST") {
				const body = await parseBody(req);
				if (!body.passenger_name || !body.destination) return errJson(400, "passenger_name and destination required");
				const ref = body.booking_ref || `UQ-TRV-${Date.now().toString().slice(-4)}`;
				const customerPrice = parseInt(body.customer_price ?? body.amount_value ?? 0, 10);
				const agencyCost = parseInt(body.agency_cost ?? 0, 10);
				const adminMargin = body.admin_margin !== void 0 ? parseInt(body.admin_margin, 10) : customerPrice - agencyCost;
				const formattedTotal = body.total_amount || `₹ ${customerPrice.toLocaleString("en-IN")}`;
				const bookingData = {
					booking_ref: ref,
					passenger_name: body.passenger_name,
					email: body.email || "",
					phone: body.phone || "",
					travel_type: body.travel_type || "Bus & Fleet Trip",
					vehicle_type: body.vehicle_type || "32-Seater Luxury AC Bus",
					origin: body.origin || "Guwahati",
					destination: body.destination,
					departure_date: body.departure_date || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
					return_date: body.return_date || null,
					airline_carrier: body.airline_carrier || "",
					pnr: body.pnr || `PNR-${Math.floor(1e4 + Math.random() * 9e4)}`,
					passengers_count: parseInt(body.passengers_count || 1, 10),
					customer_price: customerPrice,
					agency_cost: agencyCost,
					admin_margin: adminMargin,
					total_amount: formattedTotal,
					amount_value: customerPrice,
					payment_status: body.payment_status || "Pending",
					agency_payment_status: body.agency_payment_status || "Pending",
					assigned_agency: body.assigned_agency || "Direct Customer (In-house / Direct)",
					agency_contact: body.agency_contact || "+91 98200 11111",
					assigned_driver: body.assigned_driver || "Unassigned",
					driver_phone: body.driver_phone || "",
					vehicle_number: body.vehicle_number || "",
					trip_status: body.trip_status || (body.assigned_driver && body.assigned_driver !== "Unassigned" ? "Assigned to Driver" : "Booking Confirmed"),
					notes: body.notes || "",
					status: body.status || "Active"
				};
				if (isMemoryMode()) return json({
					success: true,
					data: memCreate("travel_bookings", bookingData)
				}, 201);
				await execute(`INSERT INTO travel_bookings (
            booking_ref, passenger_name, email, phone, travel_type, vehicle_type,
            origin, destination, departure_date, return_date, airline_carrier, pnr,
            passengers_count, customer_price, agency_cost, admin_margin, total_amount,
            amount_value, payment_status, agency_payment_status, assigned_agency,
            agency_contact, assigned_driver, driver_phone, vehicle_number, trip_status,
            notes, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
					bookingData.booking_ref,
					bookingData.passenger_name,
					bookingData.email,
					bookingData.phone,
					bookingData.travel_type,
					bookingData.vehicle_type,
					bookingData.origin,
					bookingData.destination,
					bookingData.departure_date,
					bookingData.return_date,
					bookingData.airline_carrier,
					bookingData.pnr,
					bookingData.passengers_count,
					bookingData.customer_price,
					bookingData.agency_cost,
					bookingData.admin_margin,
					bookingData.total_amount,
					bookingData.amount_value,
					bookingData.payment_status,
					bookingData.agency_payment_status,
					bookingData.assigned_agency,
					bookingData.agency_contact,
					bookingData.assigned_driver,
					bookingData.driver_phone,
					bookingData.vehicle_number,
					bookingData.trip_status,
					bookingData.notes,
					bookingData.status
				]);
				return json({
					success: true,
					data: await queryOne("SELECT * FROM travel_bookings WHERE booking_ref = ?", [ref])
				}, 201);
			}
		}
		if (path.startsWith("/api/travel/bookings/") && (method === "PUT" || method === "PATCH")) {
			const idOrRef = path.split("/").pop();
			const body = await parseBody(req);
			const isMem = isMemoryMode();
			if (body.customer_price !== void 0 || body.agency_cost !== void 0) {
				const cust = parseInt(body.customer_price ?? 0, 10);
				const agen = parseInt(body.agency_cost ?? 0, 10);
				if (body.admin_margin === void 0 && cust && agen) body.admin_margin = cust - agen;
				if (cust && !body.total_amount) body.total_amount = `₹ ${cust.toLocaleString("en-IN")}`;
			}
			if (isMem) {
				const numId = Number(idOrRef);
				return json({
					success: true,
					data: memUpdate("travel_bookings", isNaN(numId) ? idOrRef : numId, body)
				});
			}
			const allowedCols = [
				"passenger_name",
				"email",
				"phone",
				"travel_type",
				"vehicle_type",
				"origin",
				"destination",
				"departure_date",
				"return_date",
				"passengers_count",
				"customer_price",
				"agency_cost",
				"admin_margin",
				"total_amount",
				"amount_value",
				"payment_status",
				"agency_payment_status",
				"assigned_agency",
				"agency_contact",
				"assigned_driver",
				"driver_phone",
				"vehicle_number",
				"trip_status",
				"notes",
				"status"
			];
			const updates = [];
			const vals = [];
			for (const k of allowedCols) if (body[k] !== void 0) {
				updates.push(`${k} = ?`);
				vals.push(body[k]);
			}
			if (updates.length > 0) {
				vals.push(idOrRef, idOrRef);
				await execute(`UPDATE travel_bookings SET ${updates.join(", ")} WHERE id = ? OR booking_ref = ?`, vals);
			}
			return json({
				success: true,
				data: await queryOne("SELECT * FROM travel_bookings WHERE id = ? OR booking_ref = ?", [idOrRef, idOrRef])
			});
		}
		if (path.startsWith("/api/travel/bookings/") && method === "DELETE") {
			const idOrRef = path.split("/").pop();
			if (isMemoryMode()) {
				const numId = Number(idOrRef);
				memDelete("travel_bookings", isNaN(numId) ? idOrRef : numId);
			} else await execute("DELETE FROM travel_bookings WHERE id = ? OR booking_ref = ?", [idOrRef, idOrRef]);
			return json({
				success: true,
				message: "Booking deleted"
			});
		}
		if (path === "/api/travel/drivers") {
			if (method === "GET") {
				if (isMemoryMode()) return json({
					success: true,
					data: memList("travel_drivers") || []
				});
				return json({
					success: true,
					data: await query("SELECT * FROM travel_drivers ORDER BY id ASC")
				});
			}
			if (method === "POST") {
				const body = await parseBody(req);
				const isMem = isMemoryMode();
				const pin = (body.pin || body.password || "1234").toString().trim();
				let password_hash = null;
				if (body.password) try {
					password_hash = await hashPassword(body.password);
				} catch {}
				if (isMem) return json({
					success: true,
					data: memCreate("travel_drivers", {
						...body,
						pin,
						password_hash
					})
				}, 201);
				try {
					await execute(`INSERT INTO travel_drivers (name, phone, vehicle_type, vehicle_number, experience, rating, status, pin, email, password_hash)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
						body.name,
						body.phone,
						body.vehicle_type,
						body.vehicle_number,
						body.experience || "5 years",
						body.rating || 4.8,
						body.status || "Available",
						pin,
						body.email || null,
						password_hash
					]);
				} catch {
					await execute(`INSERT INTO travel_drivers (name, phone, vehicle_type, vehicle_number, experience, rating, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`, [
						body.name,
						body.phone,
						body.vehicle_type,
						body.vehicle_number,
						body.experience || "5 years",
						body.rating || 4.8,
						body.status || "Available"
					]);
				}
				return json({
					success: true,
					data: await queryOne("SELECT * FROM travel_drivers WHERE vehicle_number = ? ORDER BY id DESC LIMIT 1", [body.vehicle_number])
				}, 201);
			}
		}
		if (path.startsWith("/api/travel/drivers/") && !path.includes("check")) {
			const driverId = path.split("/").pop();
			const isMem = isMemoryMode();
			if (method === "GET") {
				if (isMem) {
					const d = memGet("travel_drivers", driverId) || (memList("travel_drivers") || []).find((x) => String(x.id) === String(driverId));
					return d ? json({
						success: true,
						data: d
					}) : errJson(404, "Driver not found");
				}
				const row = await queryOne("SELECT * FROM travel_drivers WHERE id = ?", [driverId]);
				return row ? json({
					success: true,
					data: row
				}) : errJson(404, "Driver not found");
			}
			if (method === "PUT" || method === "PATCH") {
				const body = await parseBody(req);
				if (isMem) return json({
					success: true,
					data: memUpdate("travel_drivers", driverId, body)
				});
				const fields = [];
				const vals = [];
				for (const k of [
					"name",
					"phone",
					"vehicle_type",
					"vehicle_number",
					"experience",
					"rating",
					"status",
					"pin",
					"email"
				]) if (body[k] !== void 0) {
					fields.push(`${k} = ?`);
					vals.push(body[k]);
				}
				if (body.password) try {
					const hash = await hashPassword(body.password);
					fields.push("password_hash = ?");
					vals.push(hash);
				} catch {}
				if (fields.length > 0) {
					vals.push(driverId);
					await execute(`UPDATE travel_drivers SET ${fields.join(", ")} WHERE id = ?`, vals);
				}
				return json({
					success: true,
					data: await queryOne("SELECT * FROM travel_drivers WHERE id = ?", [driverId])
				});
			}
			if (method === "DELETE") {
				if (isMem) {
					memDelete("travel_drivers", driverId);
					return json({
						success: true,
						message: "Driver deleted successfully"
					});
				}
				await execute("DELETE FROM travel_drivers WHERE id = ?", [driverId]);
				return json({
					success: true,
					message: "Driver deleted successfully"
				});
			}
		}
		if (path === "/api/travel/agencies") {
			if (method === "GET") {
				if (isMemoryMode()) return json({
					success: true,
					data: memList("travel_agencies") || []
				});
				return json({
					success: true,
					data: await query("SELECT * FROM travel_agencies ORDER BY id ASC")
				});
			}
			if (method === "POST") {
				const body = await parseBody(req);
				if (isMemoryMode()) return json({
					success: true,
					data: memCreate("travel_agencies", body)
				}, 201);
				await execute(`INSERT INTO travel_agencies (name, contact_person, phone, email, city, commission_tier)
           VALUES (?, ?, ?, ?, ?, ?)`, [
					body.name,
					body.contact_person || "",
					body.phone,
					body.email || "",
					body.city || "Guwahati",
					body.commission_tier || "Standard Partner"
				]);
				return json({
					success: true,
					data: await queryOne("SELECT * FROM travel_agencies WHERE name = ?", [body.name])
				}, 201);
			}
		}
		if (path === "/api/travel/destinations") {
			if (method === "GET") {
				if (isMemoryMode()) return json({
					success: true,
					data: memList("travel_destinations") || []
				});
				return json({
					success: true,
					data: await query("SELECT * FROM travel_destinations ORDER BY id ASC")
				});
			}
			if (method === "POST") {
				const body = await parseBody(req);
				const code = body.code || `DEST-${Date.now().toString().slice(-3)}`;
				if (isMemoryMode()) return json({
					success: true,
					data: memCreate("travel_destinations", {
						...body,
						code
					})
				}, 201);
				await execute(`INSERT INTO travel_destinations (code, title, country, duration, category, price, rating, inclusions, best_season, badge)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
					code,
					body.title,
					body.country,
					body.duration,
					body.category || "Holiday Package",
					body.price,
					body.rating || 4.8,
					body.inclusions || "",
					body.best_season || "All Season",
					body.badge || "Featured"
				]);
				return json({
					success: true,
					data: await queryOne("SELECT * FROM travel_destinations WHERE code = ?", [code])
				}, 201);
			}
		}
		if (path === "/api/travel/services") {
			if (method === "GET") {
				if (isMemoryMode()) return json({
					success: true,
					data: memList("travel_services") || []
				});
				return json({
					success: true,
					data: await query("SELECT * FROM travel_services ORDER BY id DESC")
				});
			}
			if (method === "POST") {
				const body = await parseBody(req);
				const req_code = body.req_code || `SRV-${Date.now().toString().slice(-4)}`;
				if (isMemoryMode()) return json({
					success: true,
					data: memCreate("travel_services", {
						...body,
						req_code
					})
				}, 201);
				await execute(`INSERT INTO travel_services (req_code, student_name, phone, service_type, destination_country, amount_val, provider, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
					req_code,
					body.student_name,
					body.phone || "",
					body.service_type,
					body.destination_country,
					body.amount_val,
					body.provider || "Partner Network",
					body.status || "Active"
				]);
				return json({
					success: true,
					data: await queryOne("SELECT * FROM travel_services WHERE req_code = ?", [req_code])
				}, 201);
			}
		}
		return errJson(404, `API route not found: ${method} ${path}`);
	} catch (e) {
		const status = e.status || 500;
		console.error("[API]", e);
		return errJson(status, e.message || "Internal server error", e.details || void 0);
	}
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-ybFvMhwT.mjs").then((n) => n.t).then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
var server_default = { async fetch(request, env, ctx) {
	try {
		if (new URL(request.url).pathname.startsWith("/api/")) {
			const apiRes = await handleApi(request);
			if (apiRes) return apiRes;
		}
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, ssr_exports as n, renderErrorPage as t };
