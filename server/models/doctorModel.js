const db = require("../database/database");
const bcrypt = require("bcryptjs");

// =====================================================
// GET ALL DOCTORS
// =====================================================

const getAllDoctors = (callback) => {
  const sql = `
    SELECT
      id,
      fullName,
      specialization,
      email,
      phone
    FROM doctors
    ORDER BY fullName ASC
  `;

  db.all(sql, [], callback);
};


// =====================================================
// ADD DOCTOR
// =====================================================

const addDoctor = (doctor, callback) => {

  if (
    !doctor.fullName ||
    !doctor.email ||
    !doctor.password
  ) {
    return callback(
      new Error(
        "Full name, email and password are required."
      )
    );
  }

  const email = doctor.email
    .trim()
    .toLowerCase();

  // Check whether email already exists
  db.get(
    "SELECT id FROM doctors WHERE email = ?",
    [email],
    (checkErr, existingDoctor) => {

      if (checkErr) {
        return callback(checkErr);
      }

      if (existingDoctor) {
        return callback(
          new Error(
            "A doctor with this email already exists."
          )
        );
      }

      // Hash password
      bcrypt.hash(
        doctor.password,
        12,
        (hashErr, hashedPassword) => {

          if (hashErr) {
            return callback(hashErr);
          }

          const sql = `
            INSERT INTO doctors
            (
              fullName,
              specialization,
              email,
              phone,
              password,
              role
            )
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          db.run(
            sql,
            [
              doctor.fullName.trim(),
              doctor.specialization || "",
              email,
              doctor.phone || "",
              hashedPassword,
              "doctor",
            ],
            function (err) {

              if (err) {
                return callback(err);
              }

              callback(null, this.lastID);
            }
          );
        }
      );
    }
  );
};


// =====================================================
// DELETE DOCTOR
// =====================================================

const deleteDoctor = (id, callback) => {

  if (!id) {
    return callback(
      new Error("Doctor ID is required.")
    );
  }

  db.run(
    "DELETE FROM doctors WHERE id = ?",
    [id],
    function (err) {

      if (err) {
        return callback(err);
      }

      if (this.changes === 0) {
        return callback(
          new Error("Doctor not found.")
        );
      }

      callback(null);
    }
  );
};


// =====================================================
// UPDATE DOCTOR
// =====================================================

const updateDoctor = (id, doctor, callback) => {

  if (!id) {
    return callback(
      new Error("Doctor ID is required.")
    );
  }

  if (
    !doctor.fullName ||
    !doctor.email
  ) {
    return callback(
      new Error(
        "Full name and email are required."
      )
    );
  }

  const email = doctor.email
    .trim()
    .toLowerCase();

  // Make sure another doctor isn't already
  // using this email
  db.get(
    `
      SELECT id
      FROM doctors
      WHERE email = ?
      AND id != ?
    `,
    [email, id],
    (checkErr, existingDoctor) => {

      if (checkErr) {
        return callback(checkErr);
      }

      if (existingDoctor) {
        return callback(
          new Error(
            "Another doctor is already using this email."
          )
        );
      }

      const sql = `
        UPDATE doctors
        SET
          fullName = ?,
          specialization = ?,
          email = ?,
          phone = ?
        WHERE id = ?
      `;

      db.run(
        sql,
        [
          doctor.fullName.trim(),
          doctor.specialization || "",
          email,
          doctor.phone || "",
          id,
        ],
        function (err) {

          if (err) {
            return callback(err);
          }

          if (this.changes === 0) {
            return callback(
              new Error("Doctor not found.")
            );
          }

          callback(null);
        }
      );
    }
  );
};


// =====================================================
// DOCTOR LOGIN
// =====================================================

const loginDoctor = (
  email,
  password,
  callback
) => {

  if (!email || !password) {
    return callback(null, null);
  }

  const cleanEmail = email
    .trim()
    .toLowerCase();

  db.get(
    `
      SELECT
        id,
        fullName,
        specialization,
        email,
        phone,
        password,
        role
      FROM doctors
      WHERE email = ?
    `,
    [cleanEmail],
    (err, doctor) => {

      if (err) {
        console.error(
          "❌ DOCTOR DATABASE ERROR:",
          err.message
        );

        return callback(err);
      }

      if (!doctor) {
        console.log(
          "❌ NO DOCTOR FOUND FOR:",
          cleanEmail
        );

        return callback(null, null);
      }

      console.log("================================");
      console.log("🔥 DOCTOR FOUND IN DATABASE");
      console.log("ID:", doctor.id);
      console.log("FULL NAME:", doctor.fullName);
      console.log("EMAIL:", doctor.email);
      console.log(
        "SPECIALIZATION:",
        doctor.specialization
      );
      console.log("PHONE:", doctor.phone);
      console.log("ROLE:", doctor.role);
      console.log("================================");

      bcrypt.compare(
        password,
        doctor.password,
        (compareErr, match) => {

          if (compareErr) {
            console.error(
              "❌ PASSWORD COMPARE ERROR:",
              compareErr.message
            );

            return callback(compareErr);
          }

          if (!match) {
            console.log(
              "❌ PASSWORD DOES NOT MATCH"
            );

            return callback(null, null);
          }

          // Remove password before returning
          delete doctor.password;

          console.log("================================");
          console.log("✅ DOCTOR LOGIN VERIFIED");
          console.log("DOCTOR OBJECT:", doctor);
          console.log(
            "SPECIALIZATION:",
            doctor.specialization
          );
          console.log("================================");

          callback(null, doctor);
        }
      );
    }
  );
};


// =====================================================
// DOCTOR APPOINTMENTS
// =====================================================

const getDoctorAppointments = (
  doctorId,
  callback
) => {

  if (!doctorId) {
    return callback(
      new Error("Doctor ID is required.")
    );
  }

  const sql = `
    SELECT
      id,
      patientName,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
      status
    FROM appointments
    WHERE doctor = (
      SELECT fullName
      FROM doctors
      WHERE id = ?
    )
    ORDER BY
      appointmentDate ASC,
      appointmentTime ASC
  `;

  console.log("🔥 GET DOCTOR APPOINTMENTS");
  console.log("DOCTOR ID:", doctorId);

  db.all(
    sql,
    [doctorId],
    (err, rows) => {

      if (err) {
        console.error(
          "❌ APPOINTMENTS DATABASE ERROR:",
          err
        );

        return callback(err);
      }

      console.log(
        "🔥 APPOINTMENTS FOUND:",
        rows
      );

      callback(null, rows);
    }
  );
};
// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAllDoctors,
  addDoctor,
  deleteDoctor,
  updateDoctor,
  loginDoctor,
  getDoctorAppointments,
};