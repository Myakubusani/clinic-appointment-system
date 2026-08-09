const db = require("../database/database");
const bcrypt = require("bcryptjs");

const loginUser = (email, password, callback) => {
  // Check Admins
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return callback(err);

    if (user) {
      return bcrypt.compare(password, user.password, (err, match) => {
        if (err) return callback(err);

        if (match) {
          return callback(null, user);
        }

        return callback(null, null);
      });
    }

    // Check Doctors
    db.get("SELECT * FROM doctors WHERE email = ?", [email], (err, doctor) => {
      if (err) return callback(err);

      if (doctor) {
        return bcrypt.compare(password, doctor.password, (err, match) => {
          if (err) return callback(err);

          if (match) {
            return callback(null, doctor);
          }

          return callback(null, null);
        });
      }

      // Check Patients
      db.get("SELECT * FROM patients WHERE email = ?", [email], (err, patient) => {
        if (err) return callback(err);

        if (!patient) {
          return callback(null, null);
        }

        bcrypt.compare(password, patient.password, (err, match) => {
          if (err) return callback(err);

          if (!match) {
            return callback(null, null);
          }

          callback(null, patient);
        });
      });
    });
  });
};

module.exports = {
  loginUser,
};