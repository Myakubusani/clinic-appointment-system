const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const path = require("path");

// =====================================================
// DATABASE PATH
// =====================================================

const dbPath = path.join(__dirname, "clinic.db");

// =====================================================
// CREATE DATABASE
// =====================================================

const db = new sqlite3.Database(
  dbPath,
  (err) => {
    if (err) {
      console.error(
        "❌ Database connection error:",
        err.message
      );
    } else {
      console.log(
        "✅ Connected to SQLite database."
      );
    }
  }
);

// =====================================================
// DATABASE INITIALIZATION
// =====================================================
//
// server.js waits for this before starting:
// db.ready.then(...)
//

db.ready = new Promise((resolve, reject) => {

  db.serialize(() => {

    // =================================================
    // PATIENTS TABLE
    // =================================================

    db.run(
      `
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'patient'
      )
      `,
      (err) => {
        if (err) {
          console.error(
            "❌ Patients table error:",
            err.message
          );

          reject(err);
          return;
        }

        console.log(
          "✅ Patients table ready."
        );
      }
    );


    // =================================================
    // DOCTORS TABLE
    // =================================================

    db.run(
      `
      CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        specialization TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'doctor'
      )
      `,
      (err) => {
        if (err) {
          console.error(
            "❌ Doctors table error:",
            err.message
          );

          reject(err);
          return;
        }

        console.log(
          "✅ Doctors table ready."
        );
      }
    );


    // =================================================
    // USERS TABLE - ADMINS
    // =================================================

    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hospitalId TEXT UNIQUE NOT NULL,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      )
      `,
      (err) => {
        if (err) {
          console.error(
            "❌ Users table error:",
            err.message
          );

          reject(err);
          return;
        }

        console.log(
          "✅ Users table ready."
        );
      }
    );


    // =================================================
    // APPOINTMENTS TABLE
    // =================================================

    db.run(
      `
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
      `,
      (err) => {
        if (err) {
          console.error(
            "❌ Appointments table error:",
            err.message
          );

          reject(err);
          return;
        }

        console.log(
          "✅ Appointments table ready."
        );
      }
    );

    // =================================================
// ENSURE reminderSent COLUMN EXISTS
// =================================================

db.all(
  `PRAGMA table_info(appointments)`,
  [],
  (err, columns) => {

    if (err) {
      console.error(
        "❌ Could not check appointments columns:",
        err.message
      );
      return;
    }

    const hasReminderSent = columns.some(
      (column) => column.name === "reminderSent"
    );

    if (hasReminderSent) {

      console.log(
        "✅ reminderSent column already exists."
      );

      return;
    }

    db.run(
      `
      ALTER TABLE appointments
      ADD COLUMN reminderSent INTEGER DEFAULT 0
      `,
      (alterErr) => {

        if (alterErr) {

          console.error(
            "❌ Failed to add reminderSent column:",
            alterErr.message
          );

          return;
        }

        console.log(
          "✅ reminderSent column added successfully."
        );

      }
    );

  }
);


    // =================================================
    // MEDICAL RECORDS TABLE
    // =================================================

    db.run(
      `
      CREATE TABLE IF NOT EXISTS medical_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientName TEXT NOT NULL,
        doctor TEXT NOT NULL,
        diagnosis TEXT NOT NULL,
        prescription TEXT NOT NULL,
        notes TEXT,
        visitDate TEXT NOT NULL
      )
      `,
      (err) => {
        if (err) {
          console.error(
            "❌ Medical records table error:",
            err.message
          );

          reject(err);
          return;
        }

        console.log(
          "✅ Medical records table ready."
        );
      }
    );


    // =================================================
    // NOTIFICATIONS TABLE
    // =================================================

    db.run(
      `
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
      `,
      (err) => {
        if (err) {
          console.error(
            "❌ Notifications table error:",
            err.message
          );

          reject(err);
          return;
        }

        console.log(
          "✅ Notifications table ready."
        );
      }
    );


    // =================================================
    // CREATE DEFAULT ADMIN
    // =================================================

    db.get(
      "SELECT * FROM users WHERE role = 'admin' LIMIT 1",
      [],
      (err, row) => {

        if (err) {
          console.error(
            "❌ Admin lookup error:",
            err.message
          );

          reject(err);
          return;
        }


        // =============================================
        // ADMIN ALREADY EXISTS
        // =============================================

        if (row) {

          console.log(
            "✅ Admin account already exists."
          );

          finishInitialization();

          return;
        }


        // =============================================
        // CREATE DEFAULT ADMIN
        // =============================================

        bcrypt.hash(
          "admin123",
          10,
          (hashErr, hashedPassword) => {

            if (hashErr) {

              console.error(
                "❌ Password hashing error:",
                hashErr.message
              );

              reject(hashErr);
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
              (insertErr) => {

                if (insertErr) {

                  console.error(
                    "❌ Failed to create default admin:",
                    insertErr.message
                  );

                  reject(insertErr);
                  return;
                }

                console.log(
                  "✅ Default admin account created."
                );

                finishInitialization();

              }
            );

          }
        );

      }
    );


    // =================================================
    // FINISH DATABASE INITIALIZATION
    // =================================================

    let initializationFinished = false;

    function finishInitialization() {

      if (initializationFinished) {
        return;
      }

      initializationFinished = true;

      console.log("");
      console.log(
        "========================================"
      );

      console.log(
        "✅ Database tables created successfully."
      );

      console.log(
        "✅ Database initialization completed."
      );

      console.log(
        "========================================"
      );

      resolve();

    }

  });

});


// =====================================================
// EXPORT DATABASE
// =====================================================

module.exports = db;