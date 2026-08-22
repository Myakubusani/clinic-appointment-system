const db = require("../database/database");
const bcrypt = require("bcryptjs");

// =====================================================
// GET ALL DOCTORS
// =====================================================

const getAllDoctors = async (callback) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        "fullName",
        specialization,
        email,
        phone
      FROM doctors
      ORDER BY "fullName" ASC
    `);

    callback(null, result.rows);
  } catch (err) {
    callback(err);
  }
};


// =====================================================
// ADD DOCTOR
// =====================================================

const addDoctor = async (doctor, callback) => {
  try {
    if (
      !doctor.fullName ||
      !doctor.email ||
      !doctor.password
    ) {
      return callback(
        new Error(
          "Full name, email and password are required."
        )
      );
    }

    const fullName = doctor.fullName.trim();
    const email = doctor.email.trim().toLowerCase();

    // Check whether email already exists
    const existingDoctor = await db.query(
      "SELECT id FROM doctors WHERE email = $1",
      [email]
    );

    if (existingDoctor.rows.length > 0) {
      return callback(
        new Error(
          "A doctor with this email already exists."
        )
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      doctor.password,
      12
    );

    const result = await db.query(
      `
      INSERT INTO doctors
      (
        "fullName",
        specialization,
        email,
        phone,
        password,
        role
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      [
        fullName,
        doctor.specialization || "",
        email,
        doctor.phone || "",
        hashedPassword,
        "doctor",
      ]
    );

    callback(null, result.rows[0].id);

  } catch (err) {
    callback(err);
  }
};


// =====================================================
// DELETE DOCTOR
// =====================================================

const deleteDoctor = async (id, callback) => {
  try {
    if (!id) {
      return callback(
        new Error("Doctor ID is required.")
      );
    }

    const result = await db.query(
      "DELETE FROM doctors WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return callback(
        new Error("Doctor not found.")
      );
    }

    callback(null);

  } catch (err) {
    callback(err);
  }
};


// =====================================================
// UPDATE DOCTOR
// =====================================================

const updateDoctor = async (
  id,
  doctor,
  callback
) => {
  try {
    if (!id) {
      return callback(
        new Error("Doctor ID is required.")
      );
    }

    if (
      !doctor.fullName ||
      !doctor.email
    ) {
      return callback(
        new Error(
          "Full name and email are required."
        )
      );
    }

    const fullName = doctor.fullName.trim();
    const email = doctor.email.trim().toLowerCase();

    // Make sure another doctor isn't using this email
    const existingDoctor = await db.query(
      `
      SELECT id
      FROM doctors
      WHERE email = $1
      AND id != $2
      `,
      [email, id]
    );

    if (existingDoctor.rows.length > 0) {
      return callback(
        new Error(
          "Another doctor is already using this email."
        )
      );
    }

    const result = await db.query(
      `
      UPDATE doctors
      SET
        "fullName" = $1,
        specialization = $2,
        email = $3,
        phone = $4
      WHERE id = $5
      `,
      [
        fullName,
        doctor.specialization || "",
        email,
        doctor.phone || "",
        id,
      ]
    );

    if (result.rowCount === 0) {
      return callback(
        new Error("Doctor not found.")
      );
    }

    callback(null);

  } catch (err) {
    callback(err);
  }
};


// =====================================================
// DOCTOR LOGIN
// =====================================================

const loginDoctor = async (
  email,
  password,
  callback
) => {
  try {
    if (!email || !password) {
      return callback(null, null);
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const result = await db.query(
      `
      SELECT
        id,
        "fullName",
        specialization,
        email,
        phone,
        password,
        role
      FROM doctors
      WHERE email = $1
      `,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      console.log(
        "❌ NO DOCTOR FOUND FOR:",
        cleanEmail
      );

      return callback(null, null);
    }

    const doctor = result.rows[0];

    console.log("================================");
    console.log("🔥 DOCTOR FOUND IN DATABASE");
    console.log("ID:", doctor.id);
    console.log("FULL NAME:", doctor.fullName);
    console.log("EMAIL:", doctor.email);
    console.log(
      "SPECIALIZATION:",
      doctor.specialization
    );
    console.log("PHONE:", doctor.phone);
    console.log("ROLE:", doctor.role);
    console.log("================================");

    const match = await bcrypt.compare(
      password,
      doctor.password
    );

    if (!match) {
      console.log(
        "❌ PASSWORD DOES NOT MATCH"
      );

      return callback(null, null);
    }

    // Remove password before returning
    delete doctor.password;

    console.log("================================");
    console.log("✅ DOCTOR LOGIN VERIFIED");
    console.log("DOCTOR OBJECT:", doctor);
    console.log(
      "SPECIALIZATION:",
      doctor.specialization
    );
    console.log("================================");

    callback(null, doctor);

  } catch (err) {
    console.error(
      "❌ DOCTOR DATABASE ERROR:",
      err.message
    );

    callback(err);
  }
};


// =====================================================
// DOCTOR APPOINTMENTS
// =====================================================

const getDoctorAppointments = async (
  doctorId,
  callback
) => {
  try {
    if (!doctorId) {
      return callback(
        new Error("Doctor ID is required.")
      );
    }

    console.log(
      "🔥 GET DOCTOR APPOINTMENTS"
    );

    console.log(
      "DOCTOR ID:",
      doctorId
    );

    const result = await db.query(
      `
      SELECT
        a.id,
        a."patientName",
        a.doctor,
        a."appointmentDate",
        a."appointmentTime",
        a.reason,
        a.status
      FROM appointments a
      WHERE a.doctor = (
        SELECT "fullName"
        FROM doctors
        WHERE id = $1
      )
      ORDER BY
        a."appointmentDate" ASC,
        a."appointmentTime" ASC
      `,
      [doctorId]
    );

    console.log(
      "🔥 APPOINTMENTS FOUND:",
      result.rows
    );

    callback(null, result.rows);

  } catch (err) {
    console.error(
      "❌ APPOINTMENTS DATABASE ERROR:",
      err.message
    );

    callback(err);
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAllDoctors,
  addDoctor,
  deleteDoctor,
  updateDoctor,
  loginDoctor,
  getDoctorAppointments,
};