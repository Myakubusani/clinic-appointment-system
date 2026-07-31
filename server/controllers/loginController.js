const { loginPatient } = require("../models/loginModel");

const login = (req, res) => {
  const { email, password } = req.body;

  loginPatient(email, password, (err, patient) => {
    if (err) {
      return res.status(500).json({
        message: "Login failed",
        error: err.message,
      });
    }

    if (!patient) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const { generateToken } = require("../config/jwt");

const token = generateToken(patient);

res.json({
  message: "Login successful",
  patient,
  token,
  role: patient.role,
});
  });
};

module.exports = { login };