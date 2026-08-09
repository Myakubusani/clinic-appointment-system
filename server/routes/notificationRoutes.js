const express = require("express");
const router = express.Router();

const {
  verifyToken,
  allowRoles,
} = require("../middleware/authMiddleware");

const {
  getMyNotifications,
  getUnreadMyNotifications,
  addNotification,
  readNotification,
  readAllNotifications,
  removeNotification,
} = require("../controllers/notificationController");

// =============================
// Get all notifications
// =============================
router.get(
  "/",
  verifyToken,
  getMyNotifications
);

// =============================
// Get unread notifications
// =============================
router.get(
  "/unread",
  verifyToken,
  getUnreadMyNotifications
);

// =============================
// Create notification
// =============================
router.post(
  "/",
  verifyToken,
  addNotification
);

// =============================
// Mark one notification as read
// =============================
router.put(
  "/:id/read",
  verifyToken,
  readNotification
);

// =============================
// Mark all notifications as read
// =============================
router.put(
  "/read-all",
  verifyToken,
  readAllNotifications
);

// =============================
// Delete notification
// =============================
router.delete(
  "/:id",
  verifyToken,
  removeNotification
);

module.exports = router;