const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

// =====================================================
// POSTGRESQL CONNECTION
// =====================================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// =====================================================
// TEST DATABASE CONNECTION
// =====================================================

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database.");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL error:", err.message);
});

// =====================================================
// DATABASE INITIALIZATION
// =====================================================

pool.ready = initializeDatabase();

async function initializeDatabase() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // =================================================
    // PATIENTS TABLE
    // =================================================

    await client.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        "fullName" TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'patient'
      )
    `);

    console.log("✅ Patients table ready.");

    // =================================================
    // DOCTORS TABLE
    // =================================================

    await client.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        "fullName" TEXT NOT NULL,
        specialization TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'doctor'
      )
    `);

    console.log("✅ Doctors table ready.");

    // =================================================
    // USERS TABLE - ADMINS
    // =================================================

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        "hospitalId" TEXT UNIQUE NOT NULL,
        "fullName" TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `);

    console.log("✅ Users table ready.");

    // =================================================
    // APPOINTMENTS TABLE
    // =================================================

    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        "patientName" TEXT NOT NULL,
        doctor TEXT NOT NULL,
        "appointmentDate" TEXT NOT NULL,
        "appointmentTime" TEXT NOT NULL,
        reason TEXT,
        status TEXT DEFAULT 'Pending',
        "reminderSent" INTEGER DEFAULT 0
      )
    `);

    console.log("✅ Appointments table ready.");

    // =================================================
    // MEDICAL RECORDS TABLE
    // =================================================

    await client.query(`
      CREATE TABLE IF NOT EXISTS medical_records (
        id SERIAL PRIMARY KEY,
        "patientName" TEXT NOT NULL,
        doctor TEXT NOT NULL,
        diagnosis TEXT NOT NULL,
        prescription TEXT NOT NULL,
        notes TEXT,
        "visitDate" TEXT NOT NULL
      )
    `);

    console.log("✅ Medical records table ready.");

    // =================================================
    // NOTIFICATIONS TABLE
    // =================================================

    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        "userRole" TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'general',
        "isRead" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Notifications table ready.");

    // =================================================
    // ENSURE reminderSent COLUMN EXISTS
    // =================================================

    await client.query(`
      ALTER TABLE appointments
      ADD COLUMN IF NOT EXISTS "reminderSent" INTEGER DEFAULT 0
    `);

    console.log("✅ reminderSent column checked.");

    // =================================================
    // CREATE DEFAULT ADMIN
    // =================================================

    const adminResult = await client.query(
      `SELECT * FROM users WHERE role = 'admin' LIMIT 1`
    );

    if (adminResult.rows.length > 0) {
      console.log("✅ Admin account already exists.");
    } else {
      const hashedPassword = await bcrypt.hash(
        "admin123",
        10
      );

      await client.query(
        `
        INSERT INTO users
        (
          "hospitalId",
          "fullName",
          email,
          password,
          role
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          "ADMIN001",
          "System Administrator",
          "admin@cliniccare.com",
          hashedPassword,
          "admin",
        ]
      );

      console.log("✅ Default admin account created.");
    }

    await client.query("COMMIT");

    console.log("");
    console.log("========================================");
    console.log("✅ PostgreSQL database ready.");
    console.log("✅ Database initialization completed.");
    console.log("========================================");

  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "❌ Database initialization failed:",
      error.message
    );

    throw error;

  } finally {
    client.release();
  }
}

// =====================================================
// EXPORT DATABASE
// =====================================================

module.exports = pool;