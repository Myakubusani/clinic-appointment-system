const db = require("../database/database");

// Register patient
const createPatient = (patient, callback) => {
  const sql = `
    INSERT INTO patients (fullName, email, phone, password)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    sql,
    [patient.fullName, patient.email, patient.phone, patient.password],
    function (err) {
      callback(err, this.lastID);
    }
  );
};

// Login patient
const findPatient = (email, password, callback) => {
  const sql = `
    SELECT id, fullName, email, phone
    FROM patients
    WHERE email = ? AND password = ?
  `;

  db.get(sql, [email, password], callback);
};

// Get all patients
const getAllPatients = (callback) => {
  const sql = `
    SELECT id, fullName, email, phone
    FROM patients
    ORDER BY fullName ASC
  `;

  db.all(sql, [], callback);
};

// Delete patient
const deletePatientById = (id, callback) => {
  db.run(
    "DELETE FROM patients WHERE id = ?",
    [id],
    callback
  );
};


module.exports = {
  createPatient,
  findPatient,
  getAllPatients,
  deletePatientById,
};