const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "clinic_secret_key";


// =====================================================
// GENERATE JWT TOKEN
// =====================================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
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