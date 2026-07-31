const express = require("express");
const cors = require("cors");

// Database
require("dotenv").config();
require("./database/database");

// Routes
const patientRoutes = require("./routes/patientRoutes");
const loginRoutes = require("./routes/loginRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/patients", patientRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/medical-records", medicalRecordRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("🏥 Clinic Appointment System API is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});