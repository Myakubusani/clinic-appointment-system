const db = require("../database/database");


// =====================================================
// GET DASHBOARD STATISTICS
// =====================================================

const getDashboardStats = async (req, res) => {

  try {

    const result = await db.query(
      `
      SELECT
        (SELECT COUNT(*) FROM patients) AS patients,
        (SELECT COUNT(*) FROM doctors) AS doctors,
        (SELECT COUNT(*) FROM appointments) AS appointments,
        (SELECT COUNT(*)
         FROM appointments
         WHERE status = 'Approved') AS approved,
        (SELECT COUNT(*)
         FROM appointments
         WHERE status = 'Pending') AS pending,
        (SELECT COUNT(*)
         FROM appointments
         WHERE status = 'Rejected') AS rejected
      `
    );

    const row = result.rows[0];

    return res.json(row);

  } catch (err) {

    console.error(
      "❌ DASHBOARD STATISTICS ERROR:",
      err.message
    );

    return res.status(500).json({
      message:
        "Failed to fetch dashboard statistics",
      error:
        err.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getDashboardStats,
};