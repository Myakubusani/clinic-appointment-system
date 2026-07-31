const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/clinic.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to SQLite database.");

    db.serialize(() => {

      // Patients table
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

      db.run(`
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patientName TEXT NOT NULL,
  doctor TEXT NOT NULL,
  appointmentDate TEXT NOT NULL,
  appointmentTime TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'Pending'
)
`);

      // Doctors table
      db.run(`
        CREATE TABLE IF NOT EXISTS doctors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          specialization TEXT NOT NULL,
          email TEXT UNIQUE,
          password TEXT
        )
      `);


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


      console.log("Database tables created successfully.");
    });
  }
});

module.exports = db;