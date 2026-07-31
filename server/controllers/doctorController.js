const jwt = require("jsonwebtoken");

const {
  getAllDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  loginDoctor,
  getDoctorAppointments,
} = require("../models/doctorModel");

// ==============================
// Get all doctors
// ==============================
const getDoctors = (req, res) => {
  getAllDoctors((err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch doctors",
      });
    }

    res.json(rows);
  });
};

// ==============================
// Add doctor
// ==============================
const createDoctor = (req, res) => {
  addDoctor(req.body, (err, id) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to add doctor",
      });
    }

    res.status(201).json({
      message: "Doctor added successfully",
      id,
    });
  });
};

// ==============================
// Update doctor
// ==============================
const editDoctor = (req, res) => {
  updateDoctor(req.params.id, req.body, (err) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to update doctor",
      });
    }

    res.json({
      message: "Doctor updated successfully",
    });
  });
};

// ==============================
// Delete doctor
// ==============================
const removeDoctor = (req, res) => {
  deleteDoctor(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to delete doctor",
      });
    }

    res.json({
      message: "Doctor deleted successfully",
    });
  });
};

// ==============================
// Doctor Login
// ==============================
const doctorLogin = (req, res) => {
  const { email, password } = req.body;

  loginDoctor(email, password, (err, doctor) => {
    if (err) {
      return res.status(500).json({
        message: "Login failed",
      });
    }

    if (err) {
      return res.status(500).json({
        message: "Login failed",
      });
    }

    if (!doctor) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: doctor.id,
        role: "doctor",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Doctor login successful",
      token,
      doctor,
    });
  });
};

// ==============================
// Doctor Appointments
// ==============================
const doctorAppointments = (req, res) => {
  getDoctorAppointments(req.params.doctorName, (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to load appointments",
      });
    }

    res.json(rows);
  });
};

module.exports = {
  getDoctors,
  createDoctor,
  editDoctor,
  removeDoctor,
  doctorLogin,
  doctorAppointments,
};