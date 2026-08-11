const express = require("express");

const router = express.Router();

const {
  registerPatient,
  getPatients,
  deletePatient,
} = require("../controllers/patientController");

const {
  verifyToken,
  allowRoles,
} = require("../middleware/authMiddleware");

// =====================================================
// PATIENT REGISTRATION
// PUBLIC
// =====================================================

router.post(
  "/register",
  registerPatient
);


// =====================================================
// GET ALL PATIENTS
// ADMIN ONLY
// =====================================================

router.get(
  "/",
  verifyToken,
  allowRoles("admin"),
  getPatients
);


// =====================================================
// DELETE PATIENT
// ADMIN ONLY
// =====================================================

router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  deletePatient
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;