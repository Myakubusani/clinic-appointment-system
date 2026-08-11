const {
  createPatient,
  findPatient,
  getPatientById,
  getAllPatients,
  deletePatientById,
} = require("../models/patientModel");

const { generateToken } = require("../config/jwt");


// =====================================================
// REGISTER PATIENT
// =====================================================

const registerPatient = (req, res) => {

  const {
    fullName,
    email,
    phone,
    password,
  } = req.body;

  if (
    !fullName ||
    !email ||
    !phone ||
    !password
  ) {
    return res.status(400).json({
      message:
        "Full name, email, phone and password are required.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message:
        "Password must be at least 6 characters long.",
    });
  }

  createPatient(
    {
      fullName,
      email,
      phone,
      password,
    },
    (err, id) => {

      if (err) {

        console.error(
          "❌ Patient registration error:",
          err.message
        );

        if (
          err.message.includes("already exists")
        ) {
          return res.status(409).json({
            message: err.message,
          });
        }

        return res.status(500).json({
          message:
            "Registration failed. Please try again.",
        });
      }

      return res.status(201).json({
        message:
          "Patient registered successfully!",
        patientId: id,
      });
    }
  );
};


// =====================================================
// LOGIN PATIENT
// =====================================================

const loginPatient = (req, res) => {

  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message:
        "Email and password are required.",
    });
  }

  findPatient(
    email,
    password,
    (err, patient) => {

      if (err) {

        console.error(
          "❌ Patient login error:",
          err.message
        );

        return res.status(500).json({
          message:
            "Login failed. Please try again.",
        });
      }

      if (!patient) {
        return res.status(401).json({
          message:
            "Invalid email or password.",
        });
      }

      const token = generateToken(patient);

      return res.json({
        message:
          "Login successful",

        patient,

        token,

        role: patient.role,
      });
    }
  );
};


// =====================================================
// GET PATIENT BY ID
// =====================================================

const getPatient = (req, res) => {

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message:
        "Patient ID is required.",
    });
  }

  getPatientById(
    id,
    (err, patient) => {

      if (err) {

        console.error(
          "❌ Get patient error:",
          err.message
        );

        return res.status(500).json({
          message:
            "Failed to fetch patient information.",
        });
      }

      if (!patient) {
        return res.status(404).json({
          message:
            "Patient not found.",
        });
      }

      return res.json(patient);
    }
  );
};


// =====================================================
// GET ALL PATIENTS
// =====================================================

const getPatients = (req, res) => {

  getAllPatients(
    (err, rows) => {

      if (err) {

        console.error(
          "❌ Get patients error:",
          err.message
        );

        return res.status(500).json({
          message:
            "Failed to fetch patients.",
        });
      }

      return res.json(rows);
    }
  );
};


// =====================================================
// DELETE PATIENT
// =====================================================

const deletePatient = (req, res) => {

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message:
        "Patient ID is required.",
    });
  }

  deletePatientById(
    id,
    (err) => {

      if (err) {

        console.error(
          "❌ Delete patient error:",
          err.message
        );

        if (
          err.message === "Patient not found."
        ) {
          return res.status(404).json({
            message:
              "Patient not found.",
          });
        }

        return res.status(500).json({
          message:
            "Failed to delete patient.",
        });
      }

      return res.json({
        message:
          "Patient deleted successfully.",
      });
    }
  );
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerPatient,
  loginPatient,
  getPatient,
  getPatients,
  deletePatient,
};