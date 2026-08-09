const db = require("../database/database");

const {
  createMedicalRecord,
  getAllMedicalRecords,
  getMedicalRecordsByPatient,
  deleteMedicalRecord,
} = require("../models/medicalRecordModel");

// ========================================
// DOCTOR: Add Medical Record
// ========================================
const addMedicalRecord = (req, res) => {
  const {
    patientName,
    doctor,
    diagnosis,
    prescription,
    notes,
    visitDate,
  } = req.body;

  // Basic validation
  if (
    !patientName ||
    !doctor ||
    !diagnosis ||
    !prescription ||
    !visitDate
  ) {
    return res.status(400).json({
      message: "Please provide all required medical record fields.",
    });
  }

  createMedicalRecord(
    {
      patientName,
      doctor,
      diagnosis,
      prescription,
      notes,
      visitDate,
    },
    (err, id) => {
      if (err) {
        console.log(
          "❌ Failed to create medical record:",
          err
        );

        return res.status(500).json({
          message: "Failed to add medical record",
          error: err.message,
        });
      }

      console.log(
        "✅ Medical record created. ID:",
        id
      );

      return res.status(201).json({
        message: "Medical record added successfully!",
        recordId: id,
      });
    }
  );
};

// ========================================
// ADMIN: Get All Medical Records
// ========================================
const getMedicalRecords = (req, res) => {
  getAllMedicalRecords((err, rows) => {
    if (err) {
      console.log(
        "❌ Failed to fetch medical records:",
        err
      );

      return res.status(500).json({
        message: "Failed to fetch medical records",
      });
    }

    return res.json(rows);
  });
};

// ========================================
// PATIENT: Get Own Medical Records
// ========================================
const getPatientMedicalRecords = (req, res) => {

  // IMPORTANT:
  // The patient ID comes from the verified JWT.
  const patientId = req.user.id;

  console.log(
    "🔐 Patient requesting medical records. ID:",
    patientId
  );

  // Find the patient's real information
  db.get(
    `
      SELECT id, fullName, email
      FROM patients
      WHERE id = ?
    `,
    [patientId],
    (patientErr, patient) => {

      if (patientErr) {
        console.log(
          "❌ Patient lookup error:",
          patientErr
        );

        return res.status(500).json({
          message: "Failed to identify patient",
        });
      }

      if (!patient) {
        return res.status(404).json({
          message: "Patient not found",
        });
      }

      console.log(
        "✅ Patient identified:",
        patient.fullName
      );

      // Now retrieve records using the verified
      // patient's name from the database.
      getMedicalRecordsByPatient(
        patient.fullName,
        (err, rows) => {

          if (err) {
            console.log(
              "❌ Failed to fetch patient records:",
              err
            );

            return res.status(500).json({
              message:
                "Failed to fetch patient medical records",
            });
          }

          return res.json(rows);
        }
      );
    }
  );
};

// ========================================
// ADMIN: Delete Medical Record
// ========================================
const removeMedicalRecord = (req, res) => {
  const { id } = req.params;

  deleteMedicalRecord(id, (err) => {

    if (err) {
      console.log(
        "❌ Failed to delete medical record:",
        err
      );

      return res.status(500).json({
        message: "Failed to delete medical record",
      });
    }

    return res.json({
      message:
        "Medical record deleted successfully!",
    });
  });
};

module.exports = {
  addMedicalRecord,
  getMedicalRecords,
  getPatientMedicalRecords,
  removeMedicalRecord,
};