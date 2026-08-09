const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "clinic_secret_key";


// =====================================================
// VERIFY JWT TOKEN
// =====================================================

const verifyToken = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    console.log("================================");
    console.log("🔐 AUTH MIDDLEWARE");
    console.log("AUTH HEADER:", authHeader);
    console.log("================================");

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication token is required.",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication token is missing.",
      });
    }

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    console.log("================================");
    console.log("✅ JWT VERIFIED");
    console.log("DECODED USER:", decoded);
    console.log("USER ID:", decoded.id);
    console.log("USER ROLE:", decoded.role);
    console.log("================================");

    req.user = decoded;

    next();

  } catch (error) {

    console.error(
      "❌ JWT VERIFICATION ERROR:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};


// =====================================================
// ROLE CHECK
// =====================================================

const allowRoles = (...allowedRoles) => {

  return (req, res, next) => {

    console.log("================================");
    console.log("🛡️ ROLE CHECK");
    console.log("USER:", req.user);
    console.log("USER ROLE:", req.user?.role);
    console.log("ALLOWED ROLES:", allowedRoles);
    console.log("================================");

    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to access this resource.",
      });
    }

    next();
  };
};


module.exports = {
  verifyToken,
  allowRoles,
};