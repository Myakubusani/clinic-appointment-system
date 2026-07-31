const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    req.user = decoded;

    next();
  } catch (err) {
    console.log("JWT Error:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

module.exports = verifyToken;