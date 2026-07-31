const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointment,
} = require("../controllers/appointmentController");

router.post("/book", verifyToken, bookAppointment);

// Get ALL appointments (Admin)
router.get("/", verifyToken, getAllAppointments);

// Get appointments for ONE patient
router.get("/:patientName", verifyToken, getMyAppointments);

router.put("/:id", verifyToken, updateAppointment);

module.exports = router;