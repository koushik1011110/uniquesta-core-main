import mysql from 'mysql2/promise';

async function migratePartners() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'uniquesta_abroad'
  });

  console.log('[1/2] Creating b2b_partners table...');
  await conn.query(`
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
    )
  `);

  console.log('[2/2] Seeding B2B Partners with Profit Sharing Configurations...');
  const partners = [
    {
      code: 'PRT-1001',
      name: 'Sanjay Barua',
      company_name: 'Apex Global Education Consultants',
      email: 'sanjay@apexglobaledu.com',
      phone: '+91 98200 44332',
      city: 'Mumbai',
      branch: 'Mumbai',
      profit_share_type: 'percentage',
      partner_share_pct: 30.00,
      admin_share_pct: 70.00,
      flat_rate_amount: 30000,
      tier: 'Gold Partner (30%)',
      status: 'Active',
      total_students: 8,
      total_revenue: 560000,
      partner_earnings: 168000,
      admin_earnings: 392000,
      payout_balance: 45000,
      notes: 'Specializes in Canadian university admissions. Top referral partner.'
    },
    {
      code: 'PRT-1002',
      name: 'Priya Nair',
      company_name: 'EduVenture Overseas Consultancy',
      email: 'priya@eduventure.in',
      phone: '+91 98111 66778',
      city: 'Delhi NCR',
      branch: 'Delhi NCR',
      profit_share_type: 'percentage',
      partner_share_pct: 25.00,
      admin_share_pct: 75.00,
      flat_rate_amount: 25000,
      tier: 'Silver Partner (25%)',
      status: 'Active',
      total_students: 5,
      total_revenue: 350000,
      partner_earnings: 87500,
      admin_earnings: 262500,
      payout_balance: 22500,
      notes: 'UK & Ireland Master degree applicants.'
    },
    {
      code: 'PRT-1003',
      name: 'Tenzin Norbu',
      company_name: 'NorthEast Global Pathways Agency',
      email: 'tenzin@ne-pathways.com',
      phone: '+91 94350 88991',
      city: 'Guwahati',
      branch: 'Guwahati HQ',
      profit_share_type: 'percentage',
      partner_share_pct: 35.00,
      admin_share_pct: 65.00,
      flat_rate_amount: 35000,
      tier: 'Platinum Partner (35%)',
      status: 'Active',
      total_students: 11,
      total_revenue: 825000,
      partner_earnings: 288750,
      admin_earnings: 536250,
      payout_balance: 60000,
      notes: 'Key regional partner for North-East region MBBS & Engineering.'
    },
    {
      code: 'PRT-1004',
      name: 'Rajesh Verma',
      company_name: 'Zenith Career & Visa Consultants',
      email: 'verma@zenithcareer.org',
      phone: '+91 98450 11223',
      city: 'Bengaluru',
      branch: 'Bengaluru',
      profit_share_type: 'percentage',
      partner_share_pct: 20.00,
      admin_share_pct: 80.00,
      flat_rate_amount: 20000,
      tier: 'Associate Partner (20%)',
      status: 'Active',
      total_students: 3,
      total_revenue: 210000,
      partner_earnings: 42000,
      admin_earnings: 168000,
      payout_balance: 0,
      notes: 'New affiliate in South India tech corridor.'
    },
    {
      code: 'PRT-1005',
      name: 'Farhan Siddiqui',
      company_name: 'Global Bridge Admissions Network',
      email: 'farhan@globalbridge.co',
      phone: '+91 98490 33445',
      city: 'Hyderabad',
      branch: 'Hyderabad',
      profit_share_type: 'percentage',
      partner_share_pct: 25.00,
      admin_share_pct: 75.00,
      flat_rate_amount: 25000,
      tier: 'Silver Partner (25%)',
      status: 'Active',
      total_students: 4,
      total_revenue: 280000,
      partner_earnings: 70000,
      admin_earnings: 210000,
      payout_balance: 35000,
      notes: 'German & European university counselling.'
    }
  ];

  for (const p of partners) {
    await conn.query(`
      INSERT INTO b2b_partners
        (code, name, company_name, email, phone, city, branch, profit_share_type, partner_share_pct, admin_share_pct, flat_rate_amount, tier, status, total_students, total_revenue, partner_earnings, admin_earnings, payout_balance, notes)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name=VALUES(name),
        company_name=VALUES(company_name),
        phone=VALUES(phone),
        city=VALUES(city),
        branch=VALUES(branch),
        partner_share_pct=VALUES(partner_share_pct),
        admin_share_pct=VALUES(admin_share_pct),
        tier=VALUES(tier),
        total_students=VALUES(total_students),
        total_revenue=VALUES(total_revenue),
        partner_earnings=VALUES(partner_earnings),
        admin_earnings=VALUES(admin_earnings),
        payout_balance=VALUES(payout_balance)
    `, [
      p.code, p.name, p.company_name, p.email, p.phone, p.city, p.branch,
      p.profit_share_type, p.partner_share_pct, p.admin_share_pct, p.flat_rate_amount,
      p.tier, p.status, p.total_students, p.total_revenue, p.partner_earnings,
      p.admin_earnings, p.payout_balance, p.notes
    ]);
  }

  console.log('B2B Partners migration and seeding complete!');
  await conn.end();
}

migratePartners().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
