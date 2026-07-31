const db = require("../database/database");

// Create appointment
const createAppointment = (appointment, callback) => {
  const sql = `
    INSERT INTO appointments
    (patientName, doctor, appointmentDate, appointmentTime, reason)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      appointment.patientName,
      appointment.doctor,
      appointment.appointmentDate,
      appointment.appointmentTime,
      appointment.reason,
    ],
    function (err) {
      callback(err, this.lastID);
    }
  );
};

// Get appointments for one patient
const getAppointmentsByPatient = (patientName, callback) => {
  const sql = `
    SELECT *
    FROM appointments
    WHERE patientName = ?
    ORDER BY appointmentDate ASC
  `;

  db.all(sql, [patientName], callback);
};

// Get all appointments
const getAllAppointmentsModel = (callback) => {
  const sql = `
    SELECT *
    FROM appointments
    ORDER BY appointmentDate ASC, appointmentTime ASC
  `;

  db.all(sql, [], callback);
};

// Update appointment status
const updateAppointmentStatus = (id, status, callback) => {
  const sql = `
    UPDATE appointments
    SET status = ?
    WHERE id = ?
  `;

  db.run(sql, [status, id], callback);
};

module.exports = {
  createAppointment,
  getAppointmentsByPatient,
  getAllAppointmentsModel,
  updateAppointmentStatus,
};