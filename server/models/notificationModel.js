const db = require("../database/database");

// =============================
// Create Notification
// =============================

const createNotification = async (
  notification,
  callback
) => {
  try {
    const result = await db.query(
      `
      INSERT INTO notifications
      (
        "userId",
        "userRole",
        title,
        message,
        type
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [
        notification.userId,
        notification.userRole,
        notification.title,
        notification.message,
        notification.type || "general",
      ]
    );

    callback(null, result.rows[0].id);

  } catch (err) {
    callback(err);
  }
};


// =============================
// Get Notifications for User
// =============================

const getNotificationsByUser = async (
  userId,
  userRole,
  callback
) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM notifications
      WHERE "userId" = $1
      AND "userRole" = $2
      ORDER BY "createdAt" DESC
      `,
      [userId, userRole]
    );

    callback(null, result.rows);

  } catch (err) {
    callback(err);
  }
};


// =============================
// Get Unread Notifications
// =============================

const getUnreadNotifications = async (
  userId,
  userRole,
  callback
) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM notifications
      WHERE "userId" = $1
      AND "userRole" = $2
      AND "isRead" = 0
      ORDER BY "createdAt" DESC
      `,
      [userId, userRole]
    );

    callback(null, result.rows);

  } catch (err) {
    callback(err);
  }
};


// =============================
// Mark Notification as Read
// =============================

const markNotificationAsRead = async (
  id,
  userId,
  userRole,
  callback
) => {
  try {
    const result = await db.query(
      `
      UPDATE notifications
      SET "isRead" = 1
      WHERE id = $1
      AND "userId" = $2
      AND "userRole" = $3
      `,
      [id, userId, userRole]
    );

    if (result.rowCount === 0) {
      return callback(
        new Error("Notification not found.")
      );
    }

    callback(null);

  } catch (err) {
    callback(err);
  }
};


// =============================
// Mark All Notifications as Read
// =============================

const markAllNotificationsAsRead = async (
  userId,
  userRole,
  callback
) => {
  try {
    await db.query(
      `
      UPDATE notifications
      SET "isRead" = 1
      WHERE "userId" = $1
      AND "userRole" = $2
      `,
      [userId, userRole]
    );

    callback(null);

  } catch (err) {
    callback(err);
  }
};


// =============================
// Delete Notification
// =============================

const deleteNotification = async (
  id,
  userId,
  userRole,
  callback
) => {
  try {
    const result = await db.query(
      `
      DELETE FROM notifications
      WHERE id = $1
      AND "userId" = $2
      AND "userRole" = $3
      `,
      [id, userId, userRole]
    );

    if (result.rowCount === 0) {
      return callback(
        new Error("Notification not found.")
      );
    }

    callback(null);

  } catch (err) {
    callback(err);
  }
};


// =============================
// EXPORT
// =============================

module.exports = {
  createNotification,
  getNotificationsByUser,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};