require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Database
require("./database/database");

// Routes
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const loginRoutes = require("./routes/loginRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const {
  startReminderService,
} = require("./services/reminderService");

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// SECURITY
// =====================================================

// Don't reveal that the server is using Express
app.disable("x-powered-by");

// =====================================================
// CORS
// =====================================================

// During local development, allow your Vite frontend.
// Later, we will change this to your production frontend URL.

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://clinic-appointment-frontend-zei9.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {

      // Allow requests with no origin
      // (Postman, mobile apps, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

// =====================================================
// BODY PARSING
// =====================================================

// Limit JSON request size to reduce abuse
app.use(
  express.json({
    limit: "10kb",
  })
);

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/patients", patientRoutes);

app.use("/api/login", loginRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/doctors", doctorRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/medical-records", medicalRecordRoutes);

app.use("/api/auth", authRoutes);

app.get("/api/auth/test", (req, res) => {
  res.json({
    message: "AUTH ROUTE IS WORKING",
    status: "success"
  });
});

app.use("/api/notifications", notificationRoutes);

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "🏥 ClinicCare API is running",
    status: "online",
  });
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

  console.error("❌ Server Error:", err.message);

  // CORS error
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "Request blocked by CORS policy.",
    });
  }

  // JSON body too large
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      message: "Request body is too large.",
    });
  }

  // Invalid JSON
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      message: "Invalid JSON request.",
    });
  }

  return res.status(500).json({
    message: "Internal server error.",
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );

  console.log("🔐 Security middleware enabled.");

  startReminderService();
});