const { sendAppointmentEmail } = require("../services/emailService");
const {
  createAppointment,
  getAppointmentsByPatient,
  getAllAppointmentsModel,
  updateAppointmentStatus,
} = require("../models/appointmentModel");

// Book Appointment
const bookAppointment = (req, res) => {
  createAppointment(req.body, (err, id) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to book appointment",
        error: err.message,
      });
    }

    sendAppointmentEmail(
  req.body.email,
  req.body.patientName,
  req.body.doctor,
  req.body.appointmentDate,
  req.body.appointmentTime,
  "Booked"
);

    res.status(201).json({
      message: "Appointment booked successfully!",
      appointmentId: id,
    });
  });
};

// Patient appointments
const getMyAppointments = (req, res) => {
  const { patientName } = req.params;

  getAppointmentsByPatient(patientName, (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch appointments",
      });
    }

    res.json(rows);
  });
};

// Admin appointments
const getAllAppointments = (req, res) => {
  getAllAppointmentsModel((err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch appointments",
      });
    }

    res.json(rows);
  });
};

// Approve / Reject appointment
const updateAppointment = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  updateAppointmentStatus(id, status, (err) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to update appointment",
      });
    }

    res.json({
      message: "Appointment updated successfully!",
    });
  });
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointment,
};