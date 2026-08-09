const express = require("express");

const router = express.Router();

const {
  registerPatient,
} = require("../controllers/patientController");

// ========================================
// PATIENT REGISTRATION
// ========================================

router.post(
  "/register",
  registerPatient
);

// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;