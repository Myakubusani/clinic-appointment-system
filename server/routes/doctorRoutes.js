const express = require("express");
const router = express.Router();

const {
  getDoctors,
  createDoctor,
  editDoctor,
  removeDoctor,
  doctorLogin,
  doctorAppointments,
} = require("../controllers/doctorController");

// ==============================
// Doctor Login
// ==============================
router.post("/login", doctorLogin);

// ==============================
// Doctor Dashboard
// Get appointments for a doctor
// ==============================
router.get("/appointments/:doctorName", doctorAppointments);

// ==============================
// Admin Doctor Management
// ==============================
router.get("/", getDoctors);

router.post("/", createDoctor);

router.put("/:id", editDoctor);

router.delete("/:id", removeDoctor);

module.exports = router;