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


// =====================================================
// GET UNREAD NOTIFICATIONS
// AUTHENTICATED USER
// =====================================================

router.get(
  "/unread",
  verifyToken,
  getUnreadMyNotifications
);


// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// AUTHENTICATED USER
// =====================================================

router.put(
  "/read-all",
  verifyToken,
  readAllNotifications
);


// =====================================================
// GET ALL MY NOTIFICATIONS
// AUTHENTICATED USER
// =====================================================

router.get(
  "/",
  verifyToken,
  getMyNotifications
);


// =====================================================
// CREATE NOTIFICATION
// ADMIN ONLY
// =====================================================

router.post(
  "/",
  verifyToken,
  allowRoles("admin"),
  addNotification
);


// =====================================================
// MARK ONE NOTIFICATION AS READ
// AUTHENTICATED USER
// =====================================================

router.put(
  "/:id/read",
  verifyToken,
  readNotification
);


// =====================================================
// DELETE NOTIFICATION
// AUTHENTICATED USER
// =====================================================

router.delete(
  "/:id",
  verifyToken,
  removeNotification
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;