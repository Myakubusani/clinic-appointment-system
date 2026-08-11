const db = require("../database/database");
const bcrypt = require("bcryptjs");

// =====================================================
// REGISTER PATIENT
// =====================================================

const createPatient = (patient, callback) => {

  if (
    !patient.fullName ||
    !patient.email ||
    !patient.phone ||
    !patient.password
  ) {
    return callback(
      new Error(
        "Full name, email, phone and password are required."
      )
    );
  }

  const fullName = patient.fullName.trim();
  const email = patient.email.trim().toLowerCase();
  const phone = patient.phone.trim();

  // Check if email already exists
  db.get(
    "SELECT id FROM patients WHERE email = ?",
    [email],
    (checkErr, existingPatient) => {

      if (checkErr) {
        return callback(checkErr);
      }

      if (existingPatient) {
        return callback(
          new Error(
            "A patient with this email already exists."
          )
        );
      }

      // Hash password
      bcrypt.hash(
        patient.password,
        12,
        (hashErr, hashedPassword) => {

          if (hashErr) {
            return callback(hashErr);
          }

          const sql = `
            INSERT INTO patients
            (
              fullName,
              email,
              phone,
              password,
              role
            )
            VALUES (?, ?, ?, ?, ?)
          `;

          db.run(
            sql,
            [
              fullName,
              email,
              phone,
              hashedPassword,
              "patient",
            ],
            function (err) {

              if (err) {
                return callback(err);
              }

              callback(null, this.lastID);
            }
          );
        }
      );
    }
  );
};


// =====================================================
// LOGIN PATIENT
// =====================================================

const findPatient = (
  email,
  password,
  callback
) => {

  if (!email || !password) {
    return callback(null, null);
  }

  const cleanEmail = email
    .trim()
    .toLowerCase();

  db.get(
    `
      SELECT
        id,
        fullName,
        email,
        phone,
        password,
        role
      FROM patients
      WHERE email = ?
    `,
    [cleanEmail],
    (err, patient) => {

      if (err) {
        return callback(err);
      }

      if (!patient) {
        return callback(null, null);
      }

      bcrypt.compare(
        password,
        patient.password,
        (compareErr, match) => {

          if (compareErr) {
            return callback(compareErr);
          }

          if (!match) {
            return callback(null, null);
          }

          // Never send password hash
          delete patient.password;

          callback(null, patient);
        }
      );
    }
  );
};


// =====================================================
// GET PATIENT BY ID
// =====================================================

const getPatientById = (id, callback) => {

  if (!id) {
    return callback(
      new Error("Patient ID is required.")
    );
  }

  const sql = `
    SELECT
      id,
      fullName,
      email,
      phone,
      role
    FROM patients
    WHERE id = ?
  `;

  db.get(
    sql,
    [id],
    (err, patient) => {

      if (err) {
        return callback(err);
      }

      callback(null, patient);
    }
  );
};


// =====================================================
// GET ALL PATIENTS
// =====================================================

const getAllPatients = (callback) => {

  const sql = `
    SELECT
      id,
      fullName,
      email,
      phone
    FROM patients
    ORDER BY fullName ASC
  `;

  db.all(
    sql,
    [],
    callback
  );
};


// =====================================================
// DELETE PATIENT
// =====================================================

const deletePatientById = (
  id,
  callback
) => {

  if (!id) {
    return callback(
      new Error("Patient ID is required.")
    );
  }

  db.run(
    "DELETE FROM patients WHERE id = ?",
    [id],
    function (err) {

      if (err) {
        return callback(err);
      }

      if (this.changes === 0) {
        return callback(
          new Error("Patient not found.")
        );
      }

      callback(null);
    }
  );
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createPatient,
  findPatient,
  getPatientById,
  getAllPatients,
  deletePatientById,
};