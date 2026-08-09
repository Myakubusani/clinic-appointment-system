const { loginUser } = require("../models/loginModel");
const { generateToken } = require("../config/jwt");

const login = (req, res) => {
  const { email, password } = req.body;

  loginUser(email, password, (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "Login failed",
        error: err.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      user,
      token,
      role: user.role,
    });
  });
};

module.exports = {
  login,
};