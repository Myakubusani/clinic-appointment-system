const express = require("express");
const router = express.Router();

const {
  verifyToken,
  allowRoles,
} = require("../middleware/authMiddleware");
const {
  addMedicalRecord,
  getMedicalRecords,
  getPatientMedicalRecords,
  removeMedicalRecord,
} = require("../controllers/medicalRecordController");

// ========================================
// DOCTOR: Create medical record
// ========================================
router.post(
  "/",
  verifyToken,
  allowRoles("doctor"),
  addMedicalRecord
);

// ========================================
// ADMIN + DOCTOR: Get medical records
// ========================================
router.get(
  "/",
  verifyToken,
  allowRoles("admin", "doctor"),
  getMedicalRecords
);

// ========================================
// PATIENT: Get own medical records
// ========================================
router.get(
  "/my-records",
  verifyToken,
  allowRoles("patient"),
  getPatientMedicalRecords
);

// ========================================
// ADMIN: Delete medical record
// ========================================
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  removeMedicalRecord
);

module.exports = router;