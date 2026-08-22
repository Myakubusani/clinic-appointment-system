const db = require("../database/database");
const bcrypt = require("bcryptjs");

// =====================================================
// SMART LOGIN
// Checks Admin → Doctor → Patient
// =====================================================

const loginUser = async (
  email,
  password,
  callback
) => {
  try {
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

    const adminResult = await db.query(
      `
      SELECT
        id,
        "fullName",
        email,
        password,
        role
      FROM users
      WHERE LOWER(email) = $1
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];

      const match = await bcrypt.compare(
        password,
        admin.password
      );

      if (match) {
        // Never send password hash
        delete admin.password;

        return callback(null, admin);
      }

      // Wrong admin password.
      // Continue checking doctor and patient.
    }

    // =====================================================
    // 2. CHECK DOCTOR
    // =====================================================

    const doctorResult = await db.query(
      `
      SELECT
        id,
        "fullName",
        email,
        phone,
        password,
        role
      FROM doctors
      WHERE LOWER(email) = $1
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (doctorResult.rows.length > 0) {
      const doctor = doctorResult.rows[0];

      const match = await bcrypt.compare(
        password,
        doctor.password
      );

      if (match) {
        // Never send password hash
        delete doctor.password;

        return callback(null, doctor);
      }

      // Wrong doctor password.
      // Continue checking patient.
    }

    // =====================================================
    // 3. CHECK PATIENT
    // =====================================================

    const patientResult = await db.query(
      `
      SELECT
        id,
        "fullName",
        email,
        phone,
        password,
        role
      FROM patients
      WHERE LOWER(email) = $1
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (patientResult.rows.length === 0) {
      return callback(null, null);
    }

    const patient = patientResult.rows[0];

    const match = await bcrypt.compare(
      password,
      patient.password
    );

    if (!match) {
      return callback(null, null);
    }

    // Never send password hash to frontend
    delete patient.password;

    callback(null, patient);

  } catch (err) {
    console.error(
      "❌ LOGIN DATABASE ERROR:",
      err.message
    );

    callback(err);
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  loginUser,
};