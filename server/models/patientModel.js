const db = require("../database/database");
const bcrypt = require("bcryptjs");

// =====================================================
// REGISTER PATIENT
// =====================================================

const createPatient = async (patient, callback) => {
  try {
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
    const existingPatient = await db.query(
      "SELECT id FROM patients WHERE email = $1",
      [email]
    );

    if (existingPatient.rows.length > 0) {
      return callback(
        new Error(
          "A patient with this email already exists."
        )
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      patient.password,
      12
    );

    // Insert patient
    const result = await db.query(
      `
      INSERT INTO patients
      (
        "fullName",
        email,
        phone,
        password,
        role
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [
        fullName,
        email,
        phone,
        hashedPassword,
        "patient",
      ]
    );

    callback(null, result.rows[0].id);

  } catch (err) {
    callback(err);
  }
};


// =====================================================
// LOGIN PATIENT
// =====================================================

const findPatient = async (
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
        email,
        phone,
        password,
        role
      FROM patients
      WHERE email = $1
      `,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return callback(null, null);
    }

    const patient = result.rows[0];

    const match = await bcrypt.compare(
      password,
      patient.password
    );

    if (!match) {
      return callback(null, null);
    }

    // Never send password hash
    delete patient.password;

    callback(null, patient);

  } catch (err) {
    callback(err);
  }
};


// =====================================================
// GET PATIENT BY ID
// =====================================================

const getPatientById = async (
  id,
  callback
) => {
  try {
    if (!id) {
      return callback(
        new Error("Patient ID is required.")
      );
    }

    const result = await db.query(
      `
      SELECT
        id,
        "fullName",
        email,
        phone,
        role
      FROM patients
      WHERE id = $1
      `,
      [id]
    );

    const patient =
      result.rows.length > 0
        ? result.rows[0]
        : null;

    callback(null, patient);

  } catch (err) {
    callback(err);
  }
};


// =====================================================
// GET ALL PATIENTS
// =====================================================

const getAllPatients = async (callback) => {
  try {
    const result = await db.query(
      `
      SELECT
        id,
        "fullName",
        email,
        phone
      FROM patients
      ORDER BY "fullName" ASC
      `
    );

    callback(null, result.rows);

  } catch (err) {
    callback(err);
  }
};


// =====================================================
// DELETE PATIENT
// =====================================================

const deletePatientById = async (
  id,
  callback
) => {
  try {
    if (!id) {
      return callback(
        new Error("Patient ID is required.")
      );
    }

    const result = await db.query(
      "DELETE FROM patients WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return callback(
        new Error("Patient not found.")
      );
    }

    callback(null);

  } catch (err) {
    callback(err);
  }
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