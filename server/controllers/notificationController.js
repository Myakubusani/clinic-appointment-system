const {
  createNotification,
  getNotificationsByUser,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../models/notificationModel");

// =============================
// Get Current User Notifications
// =============================
const getMyNotifications = (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  getNotificationsByUser(
    userId,
    userRole,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to fetch notifications",
          error: err.message,
        });
      }

      res.json(rows);
    }
  );
};

// =============================
// Get Unread Notifications
// =============================
const getUnreadMyNotifications = (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  getUnreadNotifications(
    userId,
    userRole,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to fetch unread notifications",
          error: err.message,
        });
      }

      res.json(rows);
    }
  );
};

// =============================
// Create Notification
// =============================
const addNotification = (req, res) => {
  const {
    userId,
    userRole,
    title,
    message,
    type,
  } = req.body;

  if (
    !userId ||
    !userRole ||
    !title ||
    !message
  ) {
    return res.status(400).json({
      message: "userId, userRole, title and message are required",
    });
  }

  createNotification(
    {
      userId,
      userRole,
      title,
      message,
      type,
    },
    (err, id) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to create notification",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Notification created successfully!",
        notificationId: id,
      });
    }
  );
};

// =============================
// Mark One Notification Read
// =============================
const readNotification = (req, res) => {
  const { id } = req.params;

  const userId = req.user.id;
  const userRole = req.user.role;

  markNotificationAsRead(
    id,
    userId,
    userRole,
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to mark notification as read",
          error: err.message,
        });
      }

      res.json({
        message: "Notification marked as read",
      });
    }
  );
};

// =============================
// Mark All Notifications Read
// =============================
const readAllNotifications = (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  markAllNotificationsAsRead(
    userId,
    userRole,
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to mark notifications as read",
          error: err.message,
        });
      }

      res.json({
        message: "All notifications marked as read",
      });
    }
  );
};

// =============================
// Delete Notification
// =============================
const removeNotification = (req, res) => {
  const { id } = req.params;

  const userId = req.user.id;
  const userRole = req.user.role;

  deleteNotification(
    id,
    userId,
    userRole,
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to delete notification",
          error: err.message,
        });
      }

      res.json({
        message: "Notification deleted successfully",
      });
    }
  );
};

module.exports = {
  getMyNotifications,
  getUnreadMyNotifications,
  addNotification,
  readNotification,
  readAllNotifications,
  removeNotification,
};