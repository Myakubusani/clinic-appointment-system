const db = require("../database/database");

// ========================================
// Create Medical Record
// ========================================
const createMedicalRecord = (
  record,
  callback
) => {

  const sql = `
    INSERT INTO medical_records
    (
      patientName,
      doctor,
      diagnosis,
      prescription,
      notes,
      visitDate
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      record.patientName,
      record.doctor,
      record.diagnosis,
      record.prescription,
      record.notes || "",
      record.visitDate,
    ],
    function (err) {

      if (err) {
        return callback(err);
      }

      callback(null, this.lastID);
    }
  );
};

// ========================================
// Get All Medical Records
// ========================================
const getAllMedicalRecords = (
  callback
) => {

  const sql = `
    SELECT *
    FROM medical_records
    ORDER BY visitDate DESC
  `;

  db.all(
    sql,
    [],
    callback
  );
};

// ========================================
// Get Medical Records By Patient
// ========================================
const getMedicalRecordsByPatient = (
  patientName,
  callback
) => {

  const sql = `
    SELECT *
    FROM medical_records
    WHERE patientName = ?
    ORDER BY visitDate DESC
  `;

  db.all(
    sql,
    [patientName],
    callback
  );
};

// ========================================
// Delete Medical Record
// ========================================
const deleteMedicalRecord = (
  id,
  callback
) => {

  db.run(
    `
      DELETE FROM medical_records
      WHERE id = ?
    `,
    [id],
    callback
  );
};

module.exports = {
  createMedicalRecord,
  getAllMedicalRecords,
  getMedicalRecordsByPatient,
  deleteMedicalRecord,
};