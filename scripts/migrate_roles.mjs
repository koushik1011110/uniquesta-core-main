import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function runMigration() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'uniquesta_abroad'
  });

  console.log('[1/4] Checking and adding columns...');
  // Check users columns
  const [userCols] = await conn.query('DESCRIBE users');
  const userFields = userCols.map(c => c.Field);
  if (!userFields.includes('reports_to')) {
    await conn.query('ALTER TABLE users ADD COLUMN reports_to VARCHAR(255) NULL AFTER branch');
    console.log('Added reports_to to users');
  }
  if (!userFields.includes('phone')) {
    await conn.query('ALTER TABLE users ADD COLUMN phone VARCHAR(50) NULL AFTER reports_to');
    console.log('Added phone to users');
  }
  if (!userFields.includes('status')) {
    await conn.query('ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT "Active" AFTER phone');
    console.log('Added status to users');
  }

  // Check employees columns
  const [empCols] = await conn.query('DESCRIBE employees');
  const empFields = empCols.map(c => c.Field);
  if (!empFields.includes('reports_to')) {
    await conn.query('ALTER TABLE employees ADD COLUMN reports_to VARCHAR(255) NULL AFTER branch');
    console.log('Added reports_to to employees');
  }
  if (!empFields.includes('user_id')) {
    await conn.query('ALTER TABLE employees ADD COLUMN user_id INT NULL AFTER reports_to');
    console.log('Added user_id to employees');
  }

  console.log('[2/4] Preparing Seed Accounts...');
  const adminPass = await bcrypt.hash('admin123', 10);
  const staffPass = await bcrypt.hash('staff123', 10);

  const usersToSeed = [
    // Super Admin
    { name: 'Mohammad Iqbal', email: 'admin@uniquesta.com', pass: adminPass, role: 'super_admin', branch: 'Guwahati HQ', reports_to: null, phone: '+91 98200 00001' },
    
    // Branch Admins (Har branch mai ek admin)
    { name: 'Rahul Deshmukh', email: 'mumbai.admin@uniquesta.com', pass: adminPass, role: 'branch_admin', branch: 'Mumbai', reports_to: 'Mohammad Iqbal (Super Admin)', phone: '+91 98200 11000' },
    { name: 'Karan Mehta', email: 'delhi.admin@uniquesta.com', pass: adminPass, role: 'branch_admin', branch: 'Delhi NCR', reports_to: 'Mohammad Iqbal (Super Admin)', phone: '+91 98111 22000' },
    { name: 'Divya Rao', email: 'bangalore.admin@uniquesta.com', pass: adminPass, role: 'branch_admin', branch: 'Bengaluru', reports_to: 'Mohammad Iqbal (Super Admin)', phone: '+91 98450 33000' },
    { name: 'Rahul Reddy', email: 'hyderabad.admin@uniquesta.com', pass: adminPass, role: 'branch_admin', branch: 'Hyderabad', reports_to: 'Mohammad Iqbal (Super Admin)', phone: '+91 98490 44000' },

    // Staff under Mumbai Branch Admin (Rahul Deshmukh)
    { name: 'Meera Shah', email: 'meera.counselor@uniquesta.com', pass: staffPass, role: 'counselor', branch: 'Mumbai', reports_to: 'Rahul Deshmukh (Branch Admin · Mumbai)', phone: '+91 98200 11111' },
    { name: 'Anjali Kapoor', email: 'anjali.finance@uniquesta.com', pass: staffPass, role: 'finance', branch: 'Mumbai', reports_to: 'Rahul Deshmukh (Branch Admin · Mumbai)', phone: '+91 98200 44556' },
    { name: 'Rohan Patil', email: 'rohan.travel@uniquesta.com', pass: staffPass, role: 'travel_coordinator', branch: 'Mumbai', reports_to: 'Rahul Deshmukh (Branch Admin · Mumbai)', phone: '+91 98200 77889' },
    { name: 'Sneha Joshi', email: 'sneha.frontdesk@uniquesta.com', pass: staffPass, role: 'front_desk', branch: 'Mumbai', reports_to: 'Rahul Deshmukh (Branch Admin · Mumbai)', phone: '+91 98200 99001' },

    // Staff under Delhi NCR Branch Admin (Karan Mehta)
    { name: 'Harpreet Kaur', email: 'harpreet.visa@uniquesta.com', pass: staffPass, role: 'visa_officer', branch: 'Delhi NCR', reports_to: 'Karan Mehta (Branch Admin · Delhi NCR)', phone: '+91 98111 44444' },
    { name: 'Aman Verma', email: 'aman.counselor@uniquesta.com', pass: staffPass, role: 'counselor', branch: 'Delhi NCR', reports_to: 'Karan Mehta (Branch Admin · Delhi NCR)', phone: '+91 98111 55667' },
    { name: 'Pooja Sharma', email: 'pooja.frontdesk@uniquesta.com', pass: staffPass, role: 'front_desk', branch: 'Delhi NCR', reports_to: 'Karan Mehta (Branch Admin · Delhi NCR)', phone: '+91 98111 88990' },

    // Staff under Bengaluru Branch Admin (Divya Rao)
    { name: 'Suresh Nair', email: 'suresh.counselor@uniquesta.com', pass: staffPass, role: 'counselor', branch: 'Bengaluru', reports_to: 'Divya Rao (Branch Admin · Bengaluru)', phone: '+91 98450 33445' },
    { name: 'Kavita Menon', email: 'kavita.visa@uniquesta.com', pass: staffPass, role: 'visa_officer', branch: 'Bengaluru', reports_to: 'Divya Rao (Branch Admin · Bengaluru)', phone: '+91 98450 66778' }
  ];

  console.log('[3/4] Upserting Users into MySQL...');
  for (const u of usersToSeed) {
    await conn.query(
      `INSERT INTO users (name, email, password_hash, role, branch, reports_to, phone, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')
       ON DUPLICATE KEY UPDATE name=VALUES(name), password_hash=VALUES(password_hash), role=VALUES(role), branch=VALUES(branch), reports_to=VALUES(reports_to), phone=VALUES(phone)`,
      [u.name, u.email, u.pass, u.role, u.branch, u.reports_to, u.phone]
    );
  }

  console.log('[4/4] Syncing Employees Table...');
  await conn.query('DELETE FROM employees');
  const [allUsers] = await conn.query('SELECT * FROM users');
  for (const u of allUsers) {
    let displayRole = u.role;
    if (u.role === 'super_admin') displayRole = 'Super Admin (Headquarters)';
    else if (u.role === 'branch_admin') displayRole = 'Branch Admin';
    else if (u.role === 'counselor') displayRole = 'Admissions Counsellor';
    else if (u.role === 'visa_officer') displayRole = 'Visa & Documentation Officer';
    else if (u.role === 'finance') displayRole = 'Finance Manager';
    else if (u.role === 'travel_coordinator') displayRole = 'Travel Coordinator';
    else if (u.role === 'front_desk') displayRole = 'Front Desk Executive';

    await conn.query(
      `INSERT INTO employees (name, email, phone, role, branch, reports_to, user_id, status, joined_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Active', CURDATE())`,
      [u.name, u.email, u.phone || '+91 98200 00000', displayRole, u.branch, u.reports_to, u.id]
    );
  }

  // Update branches heads
  await conn.query('UPDATE branches SET head="Rahul Deshmukh" WHERE name="Mumbai"');
  await conn.query('UPDATE branches SET head="Karan Mehta" WHERE name="Delhi NCR"');
  await conn.query('UPDATE branches SET head="Divya Rao" WHERE name="Bengaluru"');
  await conn.query('UPDATE branches SET head="Rahul Reddy" WHERE name="Hyderabad"');
  await conn.query('UPDATE branches SET head="Mohammad Iqbal" WHERE name="Guwahati HQ"');

  console.log('Migration completed successfully!');
  await conn.end();
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
