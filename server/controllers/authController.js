const { loginUser } = require("../models/authModel");
const { generateToken } = require("../config/jwt");

// =====================================================
// ADMIN / STAFF LOGIN
// =====================================================

const login = (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  loginUser(email.trim(), password, (err, user) => {

    if (err) {
      console.log("AUTH LOGIN ERROR:", err);

      return res.status(500).json({
        message: "Login failed.",
      });
    }

    // Invalid credentials
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Make sure the account has a role
    if (!user.role) {
      console.log(
        "⚠️ Login rejected: user has no role."
      );

      return res.status(403).json({
        message: "Account role is not configured.",
      });
    }

    try {

      // Generate secure JWT
      const token = generateToken(user);

      // Only return safe user information
      const safeUser = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      };

      return res.json({
        message: "Login successful",
        user: safeUser,
        token,
        role: user.role,
      });

    } catch (tokenError) {

      console.log(
        "JWT generation error:",
        tokenError
      );

      return res.status(500).json({
        message: "Authentication service error.",
      });
    }
  });
};


module.exports = {
  login,
};