const express = require("express");

const router = express.Router();

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
// GET PATIENT APPOINTMENTS
// AUTHENTICATED USER
// IMPORTANT: THIS MUST COME BEFORE /:id
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
// GET ONE APPOINTMENT
// AUTHENTICATED USER
// IMPORTANT: KEEP THIS AFTER SPECIFIC ROUTES
// =====================================================

router.get(
  "/:id",
  verifyToken,
  getAppointment
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

module.exports = router;