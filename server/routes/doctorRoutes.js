const express = require("express");

const router = express.Router();

const {
  verifyToken,
  allowRoles,
} = require("../middleware/authMiddleware");

const {
  getDoctors,
  createDoctor,
  editDoctor,
  removeDoctor,
  doctorLogin,
  doctorAppointments,
} = require("../controllers/doctorController");

// =====================================================
// DOCTOR LOGIN
// PUBLIC
// =====================================================

router.post(
  "/login",
  doctorLogin
);


// =====================================================
// GET ALL DOCTORS
// PUBLIC
// Patients use this when booking appointments
// =====================================================

router.get(
  "/",
  getDoctors
);


// =====================================================
// ADD DOCTOR
// ADMIN ONLY
// =====================================================

router.post(
  "/",
  verifyToken,
  allowRoles("admin"),
  createDoctor
);


// =====================================================
// UPDATE DOCTOR
// ADMIN ONLY
// =====================================================

router.put(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  editDoctor
);


// =====================================================
// DELETE DOCTOR
// ADMIN ONLY
// =====================================================

router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  removeDoctor
);


// =====================================================
// DOCTOR APPOINTMENTS
// DOCTOR ONLY
//
// IMPORTANT:
// We no longer use /:name.
//
// The doctor's identity comes from the JWT.
// =====================================================

router.get(
  "/appointments",
  verifyToken,
  allowRoles("doctor"),
  doctorAppointments
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;