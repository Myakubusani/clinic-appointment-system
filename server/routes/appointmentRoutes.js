const express = require("express");

const router = express.Router();

// IMPORTANT:
// authMiddleware exports an object containing
// verifyToken and allowRoles.
// Therefore we must destructure them here.

const {
  verifyToken,
  allowRoles,
} = require("../middleware/authMiddleware");

const {
  bookAppointment,
  getAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointment,
} = require("../controllers/appointmentController");


// =====================================================
// BOOK APPOINTMENT
// PATIENT ONLY
// =====================================================

router.post(
  "/book",
  verifyToken,
  allowRoles("patient"),
  bookAppointment
);


// =====================================================
// GET ONE APPOINTMENT
// AUTHENTICATED USER
// =====================================================

router.get(
  "/:id",
  verifyToken,
  getAppointment
);


// =====================================================
// GET PATIENT APPOINTMENTS
// AUTHENTICATED USER
// =====================================================

router.get(
  "/patient/:patientName",
  verifyToken,
  getMyAppointments
);


// =====================================================
// GET ALL APPOINTMENTS
// ADMIN ONLY
// =====================================================

router.get(
  "/",
  verifyToken,
  allowRoles("admin"),
  getAllAppointments
);


// =====================================================
// UPDATE APPOINTMENT
// ADMIN ONLY
// =====================================================

router.put(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  updateAppointment
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;