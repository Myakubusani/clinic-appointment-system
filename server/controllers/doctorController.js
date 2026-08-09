const {
  getAllDoctors,
  addDoctor,
  deleteDoctor,
  updateDoctor,
  loginDoctor,
  getDoctorAppointments,
} = require("../models/doctorModel");

const { generateToken } = require("../config/jwt");


// =====================================================
// GET ALL DOCTORS
// =====================================================

const getDoctors = (req, res) => {
  getAllDoctors((err, doctors) => {
    if (err) {
      console.error("GET DOCTORS ERROR:", err);

      return res.status(500).json({
        message: "Failed to fetch doctors.",
      });
    }

    return res.json(doctors);
  });
};


// =====================================================
// ADD DOCTOR
// ADMIN ONLY
// =====================================================

const createDoctor = (req, res) => {
  const {
    fullName,
    email,
    password,
    specialization,
    phone,
  } = req.body;

  if (
    !fullName ||
    !email ||
    !password ||
    !specialization ||
    !phone
  ) {
    return res.status(400).json({
      message:
        "Full name, email, password, specialization and phone are required.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message:
        "Doctor password must be at least 6 characters long.",
    });
  }

  addDoctor(
    {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      specialization: specialization.trim(),
      phone: phone.trim(),
    },
    (err, id) => {
      if (err) {
        console.error(
          "ADD DOCTOR ERROR:",
          err.message
        );

        if (
          err.message.includes("UNIQUE") ||
          err.message.includes("already exists")
        ) {
          return res.status(409).json({
            message:
              "A doctor with this email already exists.",
          });
        }

        return res.status(500).json({
          message: "Failed to add doctor.",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Doctor added successfully.",
        doctorId: id,
      });
    }
  );
};


// =====================================================
// UPDATE DOCTOR
// ADMIN ONLY
// =====================================================

const editDoctor = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Doctor ID is required.",
    });
  }

  const {
    fullName,
    email,
    specialization,
    phone,
  } = req.body;

  if (
    !fullName ||
    !email ||
    !specialization ||
    !phone
  ) {
    return res.status(400).json({
      message:
        "Full name, email, specialization and phone are required.",
    });
  }

  updateDoctor(
    id,
    {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      specialization: specialization.trim(),
      phone: phone.trim(),
    },
    (err) => {
      if (err) {
        console.error(
          "UPDATE DOCTOR ERROR:",
          err.message
        );

        return res.status(500).json({
          message: "Failed to update doctor.",
        });
      }

      return res.json({
        message: "Doctor updated successfully.",
      });
    }
  );
};


// =====================================================
// DELETE DOCTOR
// ADMIN ONLY
// =====================================================

const removeDoctor = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Doctor ID is required.",
    });
  }

  deleteDoctor(id, (err) => {
    if (err) {
      console.error(
        "DELETE DOCTOR ERROR:",
        err.message
      );

      return res.status(500).json({
        message: "Failed to delete doctor.",
      });
    }

    return res.json({
      message: "Doctor deleted successfully.",
    });
  });
};


// =====================================================
// DOCTOR LOGIN
// PUBLIC
// =====================================================

const doctorLogin = (req, res) => {
  console.log("🚨🚨🚨 NEW DOCTOR LOGIN CONTROLLER IS RUNNING 🚨🚨🚨");
  console.log("========================================");
  console.log("🔥 DOCTOR LOGIN CONTROLLER CALLED");
  console.log(
    "LOGIN EMAIL:",
    req.body?.email
  );
  console.log("========================================");

  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message:
        "Email and password are required.",
    });
  }

  loginDoctor(
    email.trim().toLowerCase(),
    password,
    (err, doctor) => {
      if (err) {
        console.error(
          "DOCTOR LOGIN ERROR:",
          err.message
        );

        return res.status(500).json({
          message:
            "Login failed. Please try again.",
        });
      }

      if (!doctor) {
        console.log(
          "❌ DOCTOR NOT FOUND OR WRONG PASSWORD"
        );

        return res.status(401).json({
          message:
            "Invalid email or password.",
        });
      }

      console.log(
        "🔥 DOCTOR FROM MODEL:"
      );
      console.log(doctor);

      console.log(
        "🔥 SPECIALIZATION:",
        doctor.specialization
      );

      // ==========================================
      // GENERATE JWT
      // ==========================================

      const token = generateToken({
        id: doctor.id,
        fullName: doctor.fullName,
        email: doctor.email,
        role: "doctor",
      });

      // ==========================================
      // SAFE DOCTOR DATA
      // ==========================================

      const safeDoctor = {
        id: doctor.id,
        fullName: doctor.fullName,
        email: doctor.email,
        phone: doctor.phone || "",
        specialization:
          doctor.specialization || "",
        role: "doctor",
      };

      console.log(
        "🔥 SAFE DOCTOR SENT TO FRONTEND:"
      );

      console.log(safeDoctor);

      console.log("🔥 FINAL LOGIN RESPONSE:");
console.log({
  doctor: safeDoctor,
  specialization: safeDoctor.specialization,
});

      // ==========================================
      // SEND RESPONSE
      // ==========================================

      return res.json({
        message: "Login successful.",
        doctor: safeDoctor,
        token,
        role: "doctor",
      });
    }
  );
};


// =====================================================
// DOCTOR APPOINTMENTS
// DOCTOR ONLY
// =====================================================

const doctorAppointments = (req, res) => {
  console.log("========================================");
  console.log(
    "🔥 DOCTOR APPOINTMENTS CONTROLLER"
  );
  console.log("REQ.USER:", req.user);
  console.log("========================================");

  // ==========================================
  // CHECK AUTHENTICATION
  // ==========================================

  if (!req.user) {
    return res.status(401).json({
      message:
        "Authentication required.",
    });
  }

  // ==========================================
  // CHECK ROLE
  // ==========================================

  if (req.user.role !== "doctor") {
    return res.status(403).json({
      message:
        "Only doctors can access doctor appointments.",
    });
  }

  // ==========================================
  // CHECK DOCTOR ID
  // ==========================================

  if (!req.user.id) {
    return res.status(401).json({
      message:
        "Invalid doctor authentication.",
    });
  }

  console.log(
    "🔥 DOCTOR ID FROM JWT:",
    req.user.id
  );

  // ==========================================
  // GET DOCTOR APPOINTMENTS
  // ==========================================

  getDoctorAppointments(
    req.user.id,
    (err, rows) => {
      if (err) {
        console.error(
          "❌ GET DOCTOR APPOINTMENTS ERROR:",
          err
        );

        return res.status(500).json({
          message:
            "Failed to fetch appointments.",
        });
      }

      console.log(
        "🔥 DOCTOR APPOINTMENTS:",
        rows
      );

      return res.json(rows);
    }
  );
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getDoctors,
  createDoctor,
  editDoctor,
  removeDoctor,
  doctorLogin,
  doctorAppointments,
};