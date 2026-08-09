const express = require("express");
const router = express.Router();

const { loginPatient } = require("../controllers/patientController");

router.post("/", loginPatient);

module.exports = router;