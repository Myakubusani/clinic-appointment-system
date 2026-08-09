const db = require("../database/database");

const {
  sendAppointmentReminderEmail,
} = require("./emailService");


// =====================================================
// GET TOMORROW'S DATE
// =====================================================
const getTomorrowDate = () => {

  const tomorrow = new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  const year = tomorrow.getFullYear();

  const month = String(
    tomorrow.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    tomorrow.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


// =====================================================
// CHECK UPCOMING APPOINTMENTS
// =====================================================
const checkAppointmentReminders = () => {

  const tomorrow = getTomorrowDate();

  console.log("");
  console.log("========================================");
  console.log("🔔 CHECKING APPOINTMENT REMINDERS");
  console.log("Tomorrow:", tomorrow);
  console.log("========================================");


  const sql = `
    SELECT
      appointments.id,
      appointments.patientName,
      appointments.doctor,
      appointments.appointmentDate,
      appointments.appointmentTime,
      appointments.status,
      appointments.reminderSent,
      patients.email

    FROM appointments

    INNER JOIN patients
      ON appointments.patientName = patients.fullName

    WHERE appointments.appointmentDate = ?
      AND appointments.status = 'Approved'
      AND (
        appointments.reminderSent = 0
        OR appointments.reminderSent IS NULL
      )
  `;


  db.all(
    sql,
    [tomorrow],
    async (err, appointments) => {

      if (err) {

        console.log(
          "❌ Reminder database error:",
          err
        );

        return;
      }


      if (appointments.length === 0) {

        console.log(
          "ℹ️ No appointment reminders needed."
        );

        return;
      }


      console.log(
        `📋 Found ${appointments.length} appointment(s) requiring reminder.`
      );


      for (const appointment of appointments) {

        console.log("");
        console.log(
          "Processing appointment:",
          appointment.id
        );


        if (!appointment.email) {

          console.log(
            "⚠️ Patient has no email:",
            appointment.patientName
          );

          continue;
        }


        const sent =
          await sendAppointmentReminderEmail(

            appointment.email,

            appointment.patientName,

            appointment.doctor,

            appointment.appointmentDate,

            appointment.appointmentTime

          );


        if (sent) {

          db.run(
            `
              UPDATE appointments
              SET reminderSent = 1
              WHERE id = ?
            `,
            [appointment.id],
            (updateErr) => {

              if (updateErr) {

                console.log(
                  "❌ Failed to mark reminder as sent:",
                  updateErr
                );

              } else {

                console.log(
                  `✅ Appointment ${appointment.id} marked as reminded.`
                );

              }

            }
          );

        }

      }

    }
  );
};


// =====================================================
// START REMINDER SYSTEM
// =====================================================
const startReminderService = () => {

  console.log(
    "🔔 Appointment reminder service started."
  );


  // Check immediately when server starts
  checkAppointmentReminders();


  // Check every hour
  setInterval(
    checkAppointmentReminders,
    60 * 60 * 1000
  );

};


module.exports = {
  startReminderService,
  checkAppointmentReminders,
};