const db = require("../database/database");

const loginPatient = (email, password, callback) => {
  const sql = `
    SELECT id, fullName, email, phone
    FROM patients
    WHERE email = ? AND password = ?
  `;

  db.get(sql, [email, password], (err, row) => {
    callback(err, row);
  });
};

module.exports = { loginPatient };