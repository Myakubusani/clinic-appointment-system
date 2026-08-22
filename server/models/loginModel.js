const db = require("../database/database");
const bcrypt = require("bcryptjs");

// =====================================================
// LOGIN USER
// Checks Admin → Doctor → Patient
// =====================================================

const loginUser = async (
  email,
  password,
  callback
) => {
  try {
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail || !password) {
      return callback(null, null);
    }

    // =====================================================
    // CHECK ADMINS
    // =====================================================

    const userResult = await db.query(
      `
      SELECT *
      FROM users
      WHERE LOWER(email) = $1
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];

      const match = await bcrypt.compare(
        password,
        user.password
      );

      if (match) {
        delete user.password;
        return callback(null, user);
      }
    }

    // =====================================================
    // CHECK DOCTORS
    // =====================================================

    const doctorResult = await db.query(
      `
      SELECT *
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
        delete doctor.password;
        return callback(null, doctor);
      }
    }

    // =====================================================
    // CHECK PATIENTS
    // =====================================================

    const patientResult = await db.query(
      `
      SELECT *
      FROM patients
      WHERE LOWER(email) = $1
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (patientResult.rows.length > 0) {
      const patient = patientResult.rows[0];

      const match = await bcrypt.compare(
        password,
        patient.password
      );

      if (match) {
        delete patient.password;
        return callback(null, patient);
      }
    }

    // =====================================================
    // NO MATCH
    // =====================================================

    callback(null, null);

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