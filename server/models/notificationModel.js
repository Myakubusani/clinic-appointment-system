const db = require("../database/database");

// =============================
// Create Notification
// =============================
const createNotification = (
  notification,
  callback
) => {
  const sql = `
    INSERT INTO notifications
    (userId, userRole, title, message, type)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      notification.userId,
      notification.userRole,
      notification.title,
      notification.message,
      notification.type || "general",
    ],
    function (err) {
      callback(err, this.lastID);
    }
  );
};

// =============================
// Get Notifications for User
// =============================
const getNotificationsByUser = (
  userId,
  userRole,
  callback
) => {
  const sql = `
    SELECT *
    FROM notifications
    WHERE userId = ?
    AND userRole = ?
    ORDER BY createdAt DESC
  `;

  db.all(
    sql,
    [userId, userRole],
    callback
  );
};

// =============================
// Get Unread Notifications
// =============================
const getUnreadNotifications = (
  userId,
  userRole,
  callback
) => {
  const sql = `
    SELECT *
    FROM notifications
    WHERE userId = ?
    AND userRole = ?
    AND isRead = 0
    ORDER BY createdAt DESC
  `;

  db.all(
    sql,
    [userId, userRole],
    callback
  );
};

// =============================
// Mark Notification as Read
// =============================
const markNotificationAsRead = (
  id,
  userId,
  userRole,
  callback
) => {
  const sql = `
    UPDATE notifications
    SET isRead = 1
    WHERE id = ?
    AND userId = ?
    AND userRole = ?
  `;

  db.run(
    sql,
    [id, userId, userRole],
    callback
  );
};

// =============================
// Mark All Notifications as Read
// =============================
const markAllNotificationsAsRead = (
  userId,
  userRole,
  callback
) => {
  const sql = `
    UPDATE notifications
    SET isRead = 1
    WHERE userId = ?
    AND userRole = ?
  `;

  db.run(
    sql,
    [userId, userRole],
    callback
  );
};

// =============================
// Delete Notification
// =============================
const deleteNotification = (
  id,
  userId,
  userRole,
  callback
) => {
  const sql = `
    DELETE FROM notifications
    WHERE id = ?
    AND userId = ?
    AND userRole = ?
  `;

  db.run(
    sql,
    [id, userId, userRole],
    callback
  );
};

module.exports = {
  createNotification,
  getNotificationsByUser,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};