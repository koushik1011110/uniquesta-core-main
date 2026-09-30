import mysql from "mysql2/promise";

async function sync() {
  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "uniquesta_abroad",
  });

  const alterCols = [
    "ADD COLUMN IF NOT EXISTS customer_price INT DEFAULT 0",
    "ADD COLUMN IF NOT EXISTS agency_cost INT DEFAULT 0",
    "ADD COLUMN IF NOT EXISTS admin_margin INT DEFAULT 0",
    "ADD COLUMN IF NOT EXISTS vehicle_type VARCHAR(100) DEFAULT '32-Seater Luxury AC Bus'",
    "ADD COLUMN IF NOT EXISTS assigned_agency VARCHAR(255) DEFAULT 'Royal Wheels & Tours'",
    "ADD COLUMN IF NOT EXISTS agency_contact VARCHAR(100) DEFAULT '+91 98540 11223'",
    "ADD COLUMN IF NOT EXISTS assigned_driver VARCHAR(255) DEFAULT 'Rajesh Sharma'",
    "ADD COLUMN IF NOT EXISTS driver_phone VARCHAR(50) DEFAULT '+91 98200 45678'",
    "ADD COLUMN IF NOT EXISTS vehicle_number VARCHAR(50) DEFAULT 'AS-01-BK-9921'",
    "ADD COLUMN IF NOT EXISTS trip_status VARCHAR(50) DEFAULT 'Assigned to Driver'",
    "ADD COLUMN IF NOT EXISTS agency_payment_status VARCHAR(50) DEFAULT 'Pending'",
  ];

  for (const col of alterCols) {
    try {
      await conn.query("ALTER TABLE travel_bookings " + col);
    } catch (e) {
      console.log("Alter err:", e.message);
    }
  }

  const driverAlter = [
    "ADD COLUMN IF NOT EXISTS email VARCHAR(255) NULL",
    "ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NULL",
    "ADD COLUMN IF NOT EXISTS pin VARCHAR(20) DEFAULT '1234'"
  ];
  for (const col of driverAlter) {
    try {
      await conn.query("ALTER TABLE travel_drivers " + col);
    } catch (e) {
      console.log("Driver alter err:", e.message);
    }
  }

  // Seed drivers if empty
  const [dRows] = await conn.query("SELECT COUNT(*) as c FROM travel_drivers");
  if (dRows[0].c === 0) {
    const drivers = [
      ["Rajesh Sharma", "+91 98200 45678", "32-Seater Luxury AC Bus", "AS-01-BK-9921", "8 years", 4.9, "Available"],
      ["Bikram Das", "+91 98540 22334", "Force Traveller (17-Seater)", "AS-01-TC-4402", "5 years", 4.8, "On Trip"],
      ["Suraj Singh", "+91 94350 99881", "Toyota Innova Crysta (7-Seater)", "AS-01-EA-1124", "6 years", 4.9, "On Trip"],
      ["Manish Choudhury", "+91 98641 55667", "45-Seater Semi-Sleeper Coach", "AS-01-MX-8833", "10 years", 4.7, "Available"],
      ["Pranab Kalita", "+91 98311 77442", "Swift Dzire Sedan (4-Seater)", "AS-01-DZ-3390", "4 years", 4.8, "Available"],
    ];
    for (const d of drivers) {
      await conn.query(
        "INSERT INTO travel_drivers (name, phone, vehicle_type, vehicle_number, experience, rating, status) VALUES (?,?,?,?,?,?,?)",
        d
      );
    }
    console.log("Seeded drivers!");
  }

  // Seed agencies if empty
  const [aRows] = await conn.query("SELECT COUNT(*) as c FROM travel_agencies");
  if (aRows[0].c === 0) {
    const agencies = [
      ["Royal Wheels & Tours", "Vikram Singhania", "+91 98540 11223", "info@royalwheels.com", "Guwahati", "Primary Vendor (Wholesale)"],
      ["Himalayan Express Fleet Agency", "Tenzin Norbu", "+91 94350 77889", "booking@himalayanexpress.in", "Shillong / Guwahati", "Fleet Partner"],
      ["Green Valley Bus Services", "Altaf Hussain", "+91 98111 88990", "ops@greenvalleybus.com", "Silchar", "Bus Fleet Operator"],
      ["Direct Customer (In-house / Direct)", "Admin Office", "+91 98200 11111", "travel@uniquesta.com", "Guwahati HQ", "100% In-house Margin"],
    ];
    for (const a of agencies) {
      await conn.query(
        "INSERT INTO travel_agencies (name, contact_person, phone, email, city, commission_tier) VALUES (?,?,?,?,?,?)",
        a
      );
    }
    console.log("Seeded agencies!");
  }

  // Update existing bookings with middleman margins and vehicle/driver relationships
  await conn.query("DELETE FROM travel_bookings");
  const sampleBookings = [
    [
      "UQ-TRV-1001",
      "Aman Barman (Group of 14)",
      "aman.barman@gmail.com",
      "+91 98640 12345",
      "Group Outstation Tour",
      "Force Traveller (17-Seater)",
      "Guwahati Paltan Bazar",
      "Kaziranga & Shillong Tour (3 Days)",
      "2026-10-02",
      "2026-10-05",
      14,
      32000,
      24000,
      8000,
      "₹ 32,000",
      32000,
      "Partial",
      "Pending Completion",
      "Royal Wheels & Tours",
      "+91 98540 11223",
      "Bikram Das",
      "+91 98540 22334",
      "AS-01-TC-4402",
      "Assigned to Driver",
      "Early morning 6:30 AM pickup from Paltan Bazar. AC required, 2 child passengers.",
    ],
    [
      "UQ-TRV-1002",
      "Pooja Sharma & Family",
      "pooja.sharma@yahoo.com",
      "+91 98201 99882",
      "Intercity Cab",
      "Toyota Innova Crysta (7-Seater)",
      "Guwahati Airport (GAU)",
      "Hotel Vivanta, Khanapara, Guwahati",
      "2026-09-28",
      null,
      5,
      4500,
      3200,
      1300,
      "₹ 4,500",
      4500,
      "Paid",
      "Paid",
      "Direct Customer (In-house / Direct)",
      "+91 98200 11111",
      "Suraj Singh",
      "+91 94350 99881",
      "AS-01-EA-1124",
      "On Trip",
      "Flight 6E-442 arriving at 2:15 PM. Driver holding name placard at Gate 2.",
    ],
    [
      "UQ-TRV-1003",
      "St. Xavier College Student Group",
      "tours@stxaviers.edu",
      "+91 94351 22331",
      "Educational Bus Excursion",
      "45-Seater Semi-Sleeper Coach",
      "Guwahati Campus",
      "Cherrapunjee (Sohra) Caves & Waterfalls",
      "2026-10-10",
      "2026-10-12",
      38,
      65000,
      50000,
      15000,
      "₹ 65,000",
      65000,
      "Paid",
      "₹20,000 Advance Released",
      "Green Valley Bus Services",
      "+91 98111 88990",
      "Manish Choudhury",
      "+91 98641 55667",
      "AS-01-MX-8833",
      "Booking Confirmed",
      "Luggage space for 38 students. PA system & emergency first-aid kit required.",
    ],
    [
      "UQ-TRV-1004",
      "Rituraj Bordoloi",
      "rituraj.b@gmail.com",
      "+91 98711 33445",
      "Airport Drop",
      "Swift Dzire Sedan (4-Seater)",
      "Six Mile, Guwahati",
      "Guwahati Airport (GAU)",
      "2026-09-27",
      null,
      2,
      1800,
      1200,
      600,
      "₹ 1,800",
      1800,
      "Cash on Drop",
      "Pending",
      "Himalayan Express Fleet Agency",
      "+91 94350 77889",
      "Pranab Kalita",
      "+91 98311 77442",
      "AS-01-DZ-3390",
      "Assigned to Driver",
      "Early morning pickup at 4:30 AM sharp. Customer will pay ₹1,800 cash to driver.",
    ],
    [
      "UQ-TRV-1005",
      "Debashree Goswami (Corporate Team)",
      "debashree@techtalk.in",
      "+91 98642 88990",
      "Corporate Bus Booking",
      "32-Seater Luxury AC Bus",
      "Guwahati Tech Park",
      "Umiam Lake Resort, Barapani",
      "2026-09-29",
      null,
      28,
      28000,
      21000,
      7000,
      "₹ 28,000",
      28000,
      "Paid",
      "Paid",
      "Royal Wheels & Tours",
      "+91 98540 11223",
      "Rajesh Sharma",
      "+91 98200 45678",
      "AS-01-BK-9921",
      "Booking Confirmed",
      "Corporate executive retreat. Refreshments & bottled water inside bus.",
    ],
  ];

  for (const b of sampleBookings) {
    await conn.query(
      `
      INSERT INTO travel_bookings (
        booking_ref, passenger_name, email, phone,
        travel_type, vehicle_type, origin, destination,
        departure_date, return_date, passengers_count, customer_price, agency_cost, admin_margin,
        total_amount, amount_value, payment_status,
        agency_payment_status, assigned_agency, agency_contact, assigned_driver, driver_phone,
        vehicle_number, trip_status, notes
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `,
      b
    );
  }
  console.log("SUCCESS: Seeded sample bookings with middleman margins!");

  await conn.end();
}

sync().catch(console.error);
