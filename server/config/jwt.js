const jwt = require("jsonwebtoken");

const generateToken = (patient) => {
  return jwt.sign(
    {
      id: patient.id,
      fullName: patient.fullName,
      email: patient.email,
      role: patient.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = {
  generateToken,
};