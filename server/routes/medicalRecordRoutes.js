const express = require("express");
const router = express.Router();

const {
  addMedicalRecord,
  getMedicalRecords,
  getPatientMedicalRecords,
  removeMedicalRecord,
} = require("../controllers/medicalRecordController");

// Add a medical record
router.post("/", addMedicalRecord);

// Get all medical records
router.get("/", getMedicalRecords);

// Get one patient's medical records
router.get("/:patientName", getPatientMedicalRecords);

// Delete a medical record
router.delete("/:id", removeMedicalRecord);

module.exports = router;