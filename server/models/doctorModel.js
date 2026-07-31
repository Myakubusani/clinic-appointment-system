const db = require("../database/database");

// =============================
// Get all doctors
// =============================
const getAllDoctors = (callback) => {
  db.all("SELECT * FROM doctors ORDER BY name ASC", callback);
};

// =============================
// Add a doctor
// =============================
const addDoctor = (doctor, callback) => {
  const sql = `
    INSERT INTO doctors
    (name, specialization, email, password)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      doctor.name,
      doctor.specialization,
      doctor.email,
      doctor.password,
    ],
    function (err) {
      callback(err, this.lastID);
    }
  );
};

// =============================
// Delete doctor
// =============================
const deleteDoctor = (id, callback) => {
  db.run(
    "DELETE FROM doctors WHERE id = ?",
    [id],
    callback
  );
};

// =============================
// Update doctor
// =============================
const updateDoctor = (id, doctor, callback) => {
  const sql = `
    UPDATE doctors
    SET
      name = ?,
      specialization = ?,
      email = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      doctor.name,
      doctor.specialization,
      doctor.email,
      id,
    ],
    callback
  );
};

// =============================
// Doctor Login
// =============================
const loginDoctor = (email, password, callback) => {
  const sql = `
    SELECT *
    FROM doctors
    WHERE email = ?
      AND password = ?
  `;

  db.get(sql, [email, password], callback);
};

// =============================
// Doctor Appointments
// =============================
const getDoctorAppointments = (doctorName, callback) => {
  const sql = `
    SELECT *
    FROM appointments
    WHERE doctor = ?
    ORDER BY appointmentDate ASC,
             appointmentTime ASC
  `;

  db.all(sql, [doctorName], callback);
};

module.exports = {
  getAllDoctors,
  addDoctor,
  deleteDoctor,
  updateDoctor,
  loginDoctor,
  getDoctorAppointments,
};