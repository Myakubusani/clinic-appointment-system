const db = require("../database/database");

const getDashboardStats = (req, res) => {
  db.get(
    `
    SELECT
      (SELECT COUNT(*) FROM patients) AS patients,
      (SELECT COUNT(*) FROM doctors) AS doctors,
      (SELECT COUNT(*) FROM appointments) AS appointments,
      (SELECT COUNT(*) FROM appointments WHERE status='Approved') AS approved,
      (SELECT COUNT(*) FROM appointments WHERE status='Pending') AS pending,
      (SELECT COUNT(*) FROM appointments WHERE status='Rejected') AS rejected
    `,
    [],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to fetch dashboard statistics",
        });
      }

      res.json(row);
    }
  );
};

module.exports = {
  getDashboardStats,
};