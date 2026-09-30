import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function migrateApprovals() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'uniquesta_abroad'
  });

  console.log('[1/4] Creating notifications table...');
  await conn.query(`
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
    )
  `);

  console.log('[2/4] Ensuring Director and CEO users in users table...');
  const passAdmin = await bcrypt.hash('admin123', 10);
  
  // Upsert Director of Operations
  await conn.query(`
    INSERT INTO users (name, email, password_hash, role, branch, reports_to, phone, status)
    VALUES ('Vivek Ramanathan', 'director@uniquesta.com', ?, 'director', 'Guwahati HQ', 'Mohammad Iqbal (CEO)', '+91 98200 99881', 'Active')
    ON DUPLICATE KEY UPDATE name=VALUES(name), password_hash=VALUES(password_hash), role=VALUES(role), reports_to=VALUES(reports_to)
  `, [passAdmin]);

  // Upsert CEO email alias as well
  await conn.query(`
    INSERT INTO users (name, email, password_hash, role, branch, reports_to, phone, status)
    VALUES ('Mohammad Iqbal', 'ceo@uniquesta.com', ?, 'super_admin', 'Guwahati HQ', NULL, '+91 98200 00001', 'Active')
    ON DUPLICATE KEY UPDATE name=VALUES(name), password_hash=VALUES(password_hash), role=VALUES(role)
  `, [passAdmin]);

  // Sync to employees
  const [directorUser] = await conn.query('SELECT id FROM users WHERE email="director@uniquesta.com"');
  if (directorUser && directorUser[0]) {
    await conn.query(`
      INSERT INTO employees (name, email, phone, role, branch, reports_to, user_id, status, joined_date)
      VALUES ('Vivek Ramanathan', 'director@uniquesta.com', '+91 98200 99881', 'Director of Operations', 'Guwahati HQ', 'Mohammad Iqbal (CEO)', ?, 'Active', CURDATE())
      ON DUPLICATE KEY UPDATE role=VALUES(role), user_id=VALUES(user_id)
    `, [directorUser[0].id]);
  }

  console.log('[3/4] Resetting and Seeding Multi-Tier Approvals...');
  // Clear approvals and steps
  await conn.query('DELETE FROM approval_steps');
  await conn.query('DELETE FROM approvals');

  // Sample Request 1: Currently with Director Vivek Ramanathan (ready to pass to CEO)
  const [res1] = await conn.query(`
    INSERT INTO approvals 
      (code, title, amount, amount_value, category, submitted_by, submitted_date, period, branch, attachments, status, current_stage)
    VALUES
      ('REIMB-2026-0284', 'Client visit — Bengaluru university fair', '₹ 48,650', 48650, 'Travel & Meals', 'Meera Shah', '22 Jul 2026 · 10:14 AM', '18 Jul – 21 Jul 2026', 'Mumbai · Andheri West', 6, 'Pending Director Approval', 3)
  `);
  const apId1 = res1.insertId;

  const steps1 = [
    { approval_id: apId1, name: 'Meera Shah', role: 'Employee · Senior Counsellor', initials: 'MS', status: 'approved', time: '22 Jul · 10:14 AM', comment: 'Submitted with itemised airfare, hotel stay, and client meeting log.', step_order: 0 },
    { approval_id: apId1, name: 'Rahul Deshmukh', role: 'Branch Manager · Mumbai', initials: 'RD', status: 'approved', time: '22 Jul · 03:40 PM', comment: 'Verified against approved Q3 travel budget. Recommending for finance validation.', step_order: 1 },
    { approval_id: apId1, name: 'Anjali Kapoor', role: 'Finance · AP Lead', initials: 'AK', status: 'approved', time: '23 Jul · 11:20 AM', comment: 'All 6 tax invoices verified and compliant with policy. Forwarding to Director for operational sanction.', step_order: 2 },
    { approval_id: apId1, name: 'Vivek Ramanathan', role: 'Director · Operations', initials: 'VR', status: 'current', time: 'Active Review', comment: '', step_order: 3 },
    { approval_id: apId1, name: 'Mohammad Iqbal', role: 'CEO · Executive Sign-off', initials: 'MI', status: 'upcoming', time: 'Awaiting Director Pass', comment: '', step_order: 4 },
    { approval_id: apId1, name: 'Payment Released', role: 'Finance · Payouts', initials: '₹', status: 'released', time: 'Est. 25 Jul', comment: 'NEFT direct transfer upon CEO authorization.', step_order: 5 }
  ];

  for (const s of steps1) {
    await conn.query(`
      INSERT INTO approval_steps (approval_id, name, role, initials, status, time, comment, step_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [s.approval_id, s.name, s.role, s.initials, s.status, s.time, s.comment, s.step_order]);
  }

  // Sample Request 2: Already at CEO stage (pending CEO approval)
  const [res2] = await conn.query(`
    INSERT INTO approvals 
      (code, title, amount, amount_value, category, submitted_by, submitted_date, period, branch, attachments, status, current_stage)
    VALUES
      ('REIMB-2026-0305', 'Delhi Education Summit Exhibition Stall Advance', '₹ 95,000', 95000, 'Marketing & Events', 'Karan Mehta', '24 Jul 2026 · 02:30 PM', '10 Aug – 12 Aug 2026', 'Delhi NCR · Connaught Place', 4, 'Pending CEO Approval', 4)
  `);
  const apId2 = res2.insertId;

  const steps2 = [
    { approval_id: apId2, name: 'Karan Mehta', role: 'Branch Admin · Delhi NCR', initials: 'KM', status: 'approved', time: '24 Jul · 02:30 PM', comment: 'Exhibition stall booking for 12,000 high-school students footfall.', step_order: 0 },
    { approval_id: apId2, name: 'Karan Mehta', role: 'Branch Manager', initials: 'KM', status: 'approved', time: '24 Jul · 02:35 PM', comment: 'Endorsed for North India admission campaign.', step_order: 1 },
    { approval_id: apId2, name: 'Anjali Kapoor', role: 'Finance · AP Lead', initials: 'AK', status: 'approved', time: '24 Jul · 04:15 PM', comment: 'Vendor advance quotation verified (Pragati Maidan stall #42).', step_order: 2 },
    { approval_id: apId2, name: 'Vivek Ramanathan', role: 'Director · Operations', initials: 'VR', status: 'approved', time: '24 Jul · 05:40 PM', comment: 'High ROI event. Operations approved, passed to CEO for release.', step_order: 3 },
    { approval_id: apId2, name: 'Mohammad Iqbal', role: 'CEO · Executive Sign-off', initials: 'MI', status: 'current', time: 'Active Review', comment: '', step_order: 4 },
    { approval_id: apId2, name: 'Payment Released', role: 'Finance · Payouts', initials: '₹', status: 'released', time: 'Est. 26 Jul', comment: 'Vendor RTGS release within 24h.', step_order: 5 }
  ];

  for (const s of steps2) {
    await conn.query(`
      INSERT INTO approval_steps (approval_id, name, role, initials, status, time, comment, step_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [s.approval_id, s.name, s.role, s.initials, s.status, s.time, s.comment, s.step_order]);
  }

  // Sample Request 3: Fresh application submitted by staff (at Branch Manager stage)
  const [res3] = await conn.query(`
    INSERT INTO approvals 
      (code, title, amount, amount_value, category, submitted_by, submitted_date, period, branch, attachments, status, current_stage)
    VALUES
      ('REIMB-2026-0312', 'Local Student Pickup & Refreshment Fleet Advance', '₹ 18,500', 18500, 'Travel & Transport', 'Rohan Patil', '25 Jul 2026 · 09:45 AM', '25 Jul 2026', 'Mumbai · Andheri West', 3, 'Pending Branch Manager Approval', 1)
  `);
  const apId3 = res3.insertId;

  const steps3 = [
    { approval_id: apId3, name: 'Rohan Patil', role: 'Travel Coordinator', initials: 'RP', status: 'approved', time: '25 Jul · 09:45 AM', comment: 'Airport shuttle & fuel charges for group visa appointment batch.', step_order: 0 },
    { approval_id: apId3, name: 'Rahul Deshmukh', role: 'Branch Manager · Mumbai', initials: 'RD', status: 'current', time: 'Active Review', comment: '', step_order: 1 },
    { approval_id: apId3, name: 'Anjali Kapoor', role: 'Finance · AP Lead', initials: 'AK', status: 'upcoming', time: 'Awaiting Branch Head', comment: '', step_order: 2 },
    { approval_id: apId3, name: 'Vivek Ramanathan', role: 'Director · Operations', initials: 'VR', status: 'upcoming', time: 'Upcoming', comment: '', step_order: 3 },
    { approval_id: apId3, name: 'Mohammad Iqbal', role: 'CEO · Executive Sign-off', initials: 'MI', status: 'upcoming', time: 'Upcoming', comment: '', step_order: 4 },
    { approval_id: apId3, name: 'Payment Released', role: 'Finance · Payouts', initials: '₹', status: 'released', time: 'Est. 27 Jul', comment: 'NEFT transfer upon CEO approval.', step_order: 5 }
  ];

  for (const s of steps3) {
    await conn.query(`
      INSERT INTO approval_steps (approval_id, name, role, initials, status, time, comment, step_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [s.approval_id, s.name, s.role, s.initials, s.status, s.time, s.comment, s.step_order]);
  }

  console.log('[4/4] Seeding initial notifications for Director and CEO...');
  await conn.query(`DELETE FROM notifications`);
  await conn.query(`
    INSERT INTO notifications (user_email, user_role, title, message, type, reference_id, sender_name)
    VALUES
      ('director@uniquesta.com', 'director', 'Expense Approval Pending: REIMB-2026-0284', 'Anjali Kapoor (Finance) passed REIMB-2026-0284 (₹ 48,650) to you: "All 6 tax invoices verified and compliant with policy. Forwarding to Director for operational sanction."', 'approval', 'REIMB-2026-0284', 'Anjali Kapoor'),
      ('admin@uniquesta.com', 'super_admin', 'High-Value Expense Awaiting CEO Sign-off', 'Vivek Ramanathan (Director) passed REIMB-2026-0305 (₹ 95,000) for Delhi Exhibition Stall to CEO: "High ROI event. Operations approved, passed to CEO for release."', 'approval', 'REIMB-2026-0305', 'Vivek Ramanathan'),
      ('ceo@uniquesta.com', 'super_admin', 'High-Value Expense Awaiting CEO Sign-off', 'Vivek Ramanathan (Director) passed REIMB-2026-0305 (₹ 95,000) for Delhi Exhibition Stall to CEO: "High ROI event. Operations approved, passed to CEO for release."', 'approval', 'REIMB-2026-0305', 'Vivek Ramanathan')
  `);

  console.log('Approvals and notifications migration complete!');
  await conn.end();
}

migrateApprovals().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
