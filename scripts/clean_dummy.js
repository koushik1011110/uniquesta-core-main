import mysql from 'mysql2/promise';

async function clean() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'uniquesta_abroad',
  });

  // 1. Delete dummy users (keep only admin@uniquesta.com)
  const [delUsers] = await conn.query("DELETE FROM users WHERE email != 'admin@uniquesta.com'");
  console.log('Deleted dummy users:', delUsers.affectedRows);

  // 2. Delete dummy students and dependent records
  const [delStudents] = await conn.query('DELETE FROM students');
  console.log('Deleted students:', delStudents.affectedRows);

  await conn.query('DELETE FROM student_tasks');
  await conn.query('DELETE FROM student_documents');
  await conn.query('DELETE FROM student_notes');
  await conn.query('DELETE FROM student_followups');
  await conn.query('DELETE FROM student_comms');

  // 3. Delete dummy india students
  const [delIndStudents] = await conn.query('DELETE FROM india_students');
  console.log('Deleted india_students:', delIndStudents.affectedRows);

  // 4. Delete dummy referral students
  const [delRef] = await conn.query('DELETE FROM referral_students');
  console.log('Deleted referral_students:', delRef.affectedRows);

  // 5. Delete applications or invoices referencing Priya Nair
  const [delApps] = await conn.query("DELETE FROM applications WHERE student = 'Priya Nair'");
  console.log('Deleted Priya Nair applications:', delApps.affectedRows);

  const [delInv] = await conn.query("DELETE FROM invoices WHERE student = 'Priya Nair'");
  console.log('Deleted Priya Nair invoices:', delInv.affectedRows);

  // Verify
  const [remainingUsers] = await conn.query('SELECT id, name, email, role FROM users');
  console.log('Remaining Users:', remainingUsers);

  const [remainingStudents] = await conn.query('SELECT COUNT(*) as c FROM students');
  console.log('Remaining Students:', remainingStudents[0].c);

  const [remainingIndStudents] = await conn.query('SELECT COUNT(*) as c FROM india_students');
  console.log('Remaining India Students:', remainingIndStudents[0].c);

  await conn.end();
}

clean().catch(console.error);
