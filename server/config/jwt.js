const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "clinic_secret_key";


// =====================================================
// GENERATE JWT TOKEN
// =====================================================

const generateToken = (doctor) => {

  return jwt.sign(
    {
      id: doctor.id,
      fullName: doctor.fullName,
      email: doctor.email,
      role: doctor.role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


// =====================================================
// VERIFY JWT TOKEN
// =====================================================

const verifyToken = (token) => {

  return jwt.verify(
    token,
    JWT_SECRET
  );
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  generateToken,
  verifyToken,
};