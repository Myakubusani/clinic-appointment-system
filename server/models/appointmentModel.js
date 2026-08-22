const db = require("../database/database");

// =====================================================
// CREATE APPOINTMENT
// =====================================================

const createAppointment = async (
  appointment,
  callback
) => {
  try {
    const result = await db.query(
      `
      INSERT INTO appointments
      (
        "patientName",
        doctor,
        "appointmentDate",
        "appointmentTime",
        reason
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [
        appointment.patientName,
        appointment.doctor,
        appointment.appointmentDate,
        appointment.appointmentTime,
        appointment.reason || null,
      ]
    );

    callback(null, result.rows[0].id);

  } catch (err) {
    callback(err);
  }
};


// =====================================================
// GET ONE APPOINTMENT BY ID
// =====================================================

const getAppointmentById = async (
  id,
  callback
) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM appointments
      WHERE id = $1
      `,
      [id]
    );

    const appointment =
      result.rows.length > 0
        ? result.rows[0]
        : null;

    callback(null, appointment);

  } catch (err) {
    callback(err);
  }
};


// =====================================================
// GET APPOINTMENTS FOR ONE PATIENT
// =====================================================

const getAppointmentsByPatient = async (
  patientName,
  callback
) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM appointments
      WHERE "patientName" = $1
      ORDER BY "appointmentDate" ASC,
               "appointmentTime" ASC
      `,
      [patientName]
    );

    callback(null, result.rows);

  } catch (err) {
    callback(err);
  }
};


// =====================================================
// GET ALL APPOINTMENTS
// =====================================================

const getAllAppointmentsModel = async (
  callback
) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM appointments
      ORDER BY "appointmentDate" ASC,
               "appointmentTime" ASC
      `
    );

    callback(null, result.rows);

  } catch (err) {
    callback(err);
  }
};


// =====================================================
// UPDATE APPOINTMENT STATUS
// =====================================================

const updateAppointmentStatus = async (
  id,
  status,
  callback
) => {
  try {
    const result = await db.query(
      `
      UPDATE appointments
      SET status = $1
      WHERE id = $2
      `,
      [status, id]
    );

    if (result.rowCount === 0) {
      return callback(
        new Error("Appointment not found.")
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
  createAppointment,
  getAppointmentById,
  getAppointmentsByPatient,
  getAllAppointmentsModel,
  updateAppointmentStatus,
};