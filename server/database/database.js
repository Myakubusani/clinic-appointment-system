const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const db = new sqlite3.Database("./database/clinic.db", (err) => {
  if (err) {
    console.error("❌ Database connection error:", err.message);
    return;
  }

  console.log("✅ Connected to SQLite database.");

  db.serialize(() => {

    // =====================================================
    // PATIENTS TABLE
    // =====================================================
    db.run(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'patient'
      )
    `);


    // =====================================================
    // DOCTORS TABLE
    // =====================================================
    db.run(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        specialization TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'doctor'
      )
    `);


    // =====================================================
    // USERS TABLE - ADMINS
    // =====================================================
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hospitalId TEXT UNIQUE NOT NULL,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `);


    // =====================================================
    // APPOINTMENTS TABLE
    // =====================================================
    db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientName TEXT NOT NULL,
        doctor TEXT NOT NULL,
        appointmentDate TEXT NOT NULL,
        appointmentTime TEXT NOT NULL,
        reason TEXT,
        status TEXT DEFAULT 'Pending',
        reminderSent INTEGER DEFAULT 0
      )
    `);


    // =====================================================
    // ADD REMINDER COLUMN TO EXISTING DATABASE
    // =====================================================
    //
    // This is important because your appointments table
    // already exists in SQLite.
    //
    // CREATE TABLE IF NOT EXISTS does NOT modify an
    // existing table, so we safely add the column here.
    //
    db.run(
      `
        ALTER TABLE appointments
        ADD COLUMN reminderSent INTEGER DEFAULT 0
      `,
      (err) => {

        if (err) {

          // This means the column already exists.
          if (
            err.message.includes(
              "duplicate column name"
            )
          ) {

            console.log(
              "✅ reminderSent column already exists."
            );

          } else {

            console.log(
              "⚠️ Reminder column check:",
              err.message
            );

          }

        } else {

          console.log(
            "✅ reminderSent column added successfully."
          );

        }

      }
    );


    // =====================================================
    // MEDICAL RECORDS TABLE
    // =====================================================
    db.run(`
      CREATE TABLE IF NOT EXISTS medical_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientName TEXT NOT NULL,
        doctor TEXT NOT NULL,
        diagnosis TEXT NOT NULL,
        prescription TEXT NOT NULL,
        notes TEXT,
        visitDate TEXT NOT NULL
      )
    `);


    // =====================================================
    // NOTIFICATIONS TABLE
    // =====================================================
    db.run(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        userRole TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'general',
        isRead INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);


    // =====================================================
    // CREATE DEFAULT ADMIN
    // =====================================================
    db.get(
      "SELECT * FROM users WHERE role = 'admin'",
      [],
      (err, row) => {

        if (err) {

          console.log(
            "❌ Admin lookup error:",
            err
          );

          return;
        }


        // ================================================
        // CREATE ADMIN IF NONE EXISTS
        // ================================================
        if (!row) {

          bcrypt.hash(
            "admin123",
            10,
            (err, hashedPassword) => {

              if (err) {

                console.log(
                  "❌ Password hashing error:",
                  err
                );

                return;
              }


              db.run(
                `
                  INSERT INTO users
                  (
                    hospitalId,
                    fullName,
                    email,
                    password,
                    role
                  )
                  VALUES (?, ?, ?, ?, ?)
                `,
                [
                  "ADMIN001",
                  "System Administrator",
                  "admin@cliniccare.com",
                  hashedPassword,
                  "admin",
                ],
                (err) => {

                  if (err) {

                    console.log(
                      "❌ Failed to create default admin:",
                      err
                    );

                  } else {

                    console.log(
                      "✅ Default admin account created."
                    );

                  }

                }
              );

            }
          );

        } else {

          console.log(
            "✅ Admin account already exists."
          );

        }

      }
    );


    console.log(
      "✅ Database tables created successfully."
    );

  });

});


// =====================================================
// EXPORT DATABASE
// =====================================================
module.exports = db;