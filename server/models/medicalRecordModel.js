const db = require("../database/database");

// ========================================
// Create Medical Record
// ========================================

const createMedicalRecord = async (
  record,
  callback
) => {
  try {
    const result = await db.query(
      `
      INSERT INTO medical_records
      (
        "patientName",
        doctor,
        diagnosis,
        prescription,
        notes,
        "visitDate"
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      [
        record.patientName,
        record.doctor,
        record.diagnosis,
        record.prescription,
        record.notes || "",
        record.visitDate,
      ]
    );

    callback(null, result.rows[0].id);

  } catch (err) {
    callback(err);
  }
};


// ========================================
// Get All Medical Records
// ========================================

const getAllMedicalRecords = async (
  callback
) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM medical_records
      ORDER BY "visitDate" DESC
      `
    );

    callback(null, result.rows);

  } catch (err) {
    callback(err);
  }
};


// ========================================
// Get Medical Records By Patient
// ========================================

const getMedicalRecordsByPatient = async (
  patientName,
  callback
) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM medical_records
      WHERE "patientName" = $1
      ORDER BY "visitDate" DESC
      `,
      [patientName]
    );

    callback(null, result.rows);

  } catch (err) {
    callback(err);
  }
};


// ========================================
// Delete Medical Record
// ========================================

const deleteMedicalRecord = async (
  id,
  callback
) => {
  try {
    const result = await db.query(
      `
      DELETE FROM medical_records
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return callback(
        new Error("Medical record not found.")
      );
    }

    callback(null);

  } catch (err) {
    callback(err);
  }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
  createMedicalRecord,
  getAllMedicalRecords,
  getMedicalRecordsByPatient,
  deleteMedicalRecord,
};