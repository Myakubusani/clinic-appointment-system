const express = require("express");
const router = express.Router();

const {
  registerPatient,
  loginPatient,
  getPatients,
  deletePatient,
} = require("../controllers/patientController");

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.get("/", getPatients);

router.delete("/:id", deletePatient);

module.exports = router;