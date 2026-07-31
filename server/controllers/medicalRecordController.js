const {
  createMedicalRecord,
  getAllMedicalRecords,
  getMedicalRecordsByPatient,
  deleteMedicalRecord,
} = require("../models/medicalRecordModel");

// Add a medical record
const addMedicalRecord = (req, res) => {
  createMedicalRecord(req.body, (err, id) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to add medical record",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Medical record added successfully!",
      recordId: id,
    });
  });
};

// Get all medical records
const getMedicalRecords = (req, res) => {
  getAllMedicalRecords((err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch medical records",
      });
    }

    res.json(rows);
  });
};

// Get records for one patient
const getPatientMedicalRecords = (req, res) => {
  const { patientName } = req.params;

  getMedicalRecordsByPatient(patientName, (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch patient records",
      });
    }

    res.json(rows);
  });
};

// Delete a medical record
const removeMedicalRecord = (req, res) => {
  deleteMedicalRecord(req.params.id, (err) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to delete medical record",
      });
    }

    res.json({
      message: "Medical record deleted successfully!",
    });
  });
};

module.exports = {
  addMedicalRecord,
  getMedicalRecords,
  getPatientMedicalRecords,
  removeMedicalRecord,
};