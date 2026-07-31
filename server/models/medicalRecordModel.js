const db = require("../database/database");

// Add a medical record
const createMedicalRecord = (record, callback) => {
  const sql = `
    INSERT INTO medical_records
    (patientName, doctor, diagnosis, prescription, notes, visitDate)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      record.patientName,
      record.doctor,
      record.diagnosis,
      record.prescription,
      record.notes,
      record.visitDate,
    ],
    function (err) {
      callback(err, this.lastID);
    }
  );
};

// Get all medical records
const getAllMedicalRecords = (callback) => {
  const sql = `
    SELECT *
    FROM medical_records
    ORDER BY visitDate DESC
  `;

  db.all(sql, [], callback);
};

// Get one patient's medical records
const getMedicalRecordsByPatient = (patientName, callback) => {
  const sql = `
    SELECT *
    FROM medical_records
    WHERE patientName = ?
    ORDER BY visitDate DESC
  `;

  db.all(sql, [patientName], callback);
};

// Delete a medical record
const deleteMedicalRecord = (id, callback) => {
  db.run(
    "DELETE FROM medical_records WHERE id = ?",
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