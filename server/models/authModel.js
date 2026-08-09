const db = require("../database/database");
const bcrypt = require("bcryptjs");

// =====================================================
// SMART LOGIN
// Checks Admin → Doctor → Patient
// =====================================================

const loginUser = (email, password, callback) => {

  // Normalize email
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  // Validate input
  if (!normalizedEmail || !password) {
    return callback(null, null);
  }

  // =====================================================
  // 1. CHECK ADMIN / STAFF
  // =====================================================

  db.get(
    `
      SELECT
        id,
        fullName,
        email,
        password,
        role
      FROM users
      WHERE LOWER(email) = ?
      LIMIT 1
    `,
    [normalizedEmail],
    (err, admin) => {

      if (err) {
        return callback(err);
      }

      if (admin) {

        return bcrypt.compare(
          password,
          admin.password,
          (err, match) => {

            if (err) {
              return callback(err);
            }

            if (match) {
              return callback(null, admin);
            }

            // Wrong admin password.
            // Continue checking the other account tables.
            checkDoctor();
          }
        );
      }

      checkDoctor();
    }
  );


  // =====================================================
  // 2. CHECK DOCTOR
  // =====================================================

  function checkDoctor() {

    db.get(
      `
        SELECT
          id,
          fullName,
          email,
          password,
          role
        FROM doctors
        WHERE LOWER(email) = ?
        LIMIT 1
      `,
      [normalizedEmail],
      (err, doctor) => {

        if (err) {
          return callback(err);
        }

        if (!doctor) {
          return checkPatient();
        }

        bcrypt.compare(
          password,
          doctor.password,
          (err, match) => {

            if (err) {
              return callback(err);
            }

            if (match) {
              return callback(null, doctor);
            }

            checkPatient();
          }
        );
      }
    );
  }


  // =====================================================
  // 3. CHECK PATIENT
  // =====================================================

  function checkPatient() {

    db.get(
      `
        SELECT
          id,
          fullName,
          email,
          password,
          role
        FROM patients
        WHERE LOWER(email) = ?
        LIMIT 1
      `,
      [normalizedEmail],
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
          (err, match) => {

            if (err) {
              return callback(err);
            }

            if (!match) {
              return callback(null, null);
            }

            callback(null, patient);
          }
        );
      }
    );
  }

};


module.exports = {
  loginUser,
};