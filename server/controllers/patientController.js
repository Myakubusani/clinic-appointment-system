const {
  createPatient,
  findPatient,
  getAllPatients,
  deletePatientById,
} = require("../models/patientModel");

// Register Patient
const registerPatient = (req, res) => {
  createPatient(req.body, (err, id) => {
    if (err) {
      return res.status(500).json({
        message: "Registration failed",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Patient registered successfully!",
      patientId: id,
    });
  });
};

// Login Patient
const loginPatient = (req, res) => {
  const { email, password } = req.body;

  findPatient(email, password, (err, patient) => {
    if (err) {
      return res.status(500).json({
        message: "Login failed",
        error: err.message,
      });
    }

    if (!patient) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      patient,
    });
  });
};

// Get All Patients (Admin)
const getPatients = (req, res) => {
  getAllPatients((err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch patients",
      });
    }

    res.json(rows);
  });
};

// Delete Patient (Admin)
const deletePatient = (req, res) => {
  deletePatientById(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to delete patient",
      });
    }

    res.json({
      message: "Patient deleted successfully",
    });
  });
};

module.exports = {
  registerPatient,
  loginPatient,
  getPatients,
  deletePatient,
};