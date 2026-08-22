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
const checkAppointmentReminders = async () => {
  const tomorrow = getTomorrowDate();

  console.log("");
  console.log("========================================");
  console.log("🔔 CHECKING APPOINTMENT REMINDERS");
  console.log("Tomorrow:", tomorrow);
  console.log("========================================");

  try {

    // =================================================
    // GET APPROVED APPOINTMENTS FOR TOMORROW
    // =================================================

    const result = await db.query(
      `
      SELECT
        appointments.id,
        appointments."patientName",
        appointments.doctor,
        appointments."appointmentDate",
        appointments."appointmentTime",
        appointments.status,
        appointments."reminderSent",
        patients.email

      FROM appointments

      INNER JOIN patients
        ON appointments."patientName" = patients."fullName"

      WHERE appointments."appointmentDate" = $1
        AND appointments.status = 'Approved'
        AND (
          appointments."reminderSent" = 0
          OR appointments."reminderSent" IS NULL
        )
      `,
      [tomorrow]
    );

    const appointments = result.rows;

    // =================================================
    // NO REMINDERS
    // =================================================

    if (appointments.length === 0) {
      console.log(
        "ℹ️ No appointment reminders needed."
      );

      return;
    }

    console.log(
      `📋 Found ${appointments.length} appointment(s) requiring reminder.`
    );

    // =================================================
    // PROCESS EACH APPOINTMENT
    // =================================================

    for (const appointment of appointments) {

      console.log("");
      console.log(
        "Processing appointment:",
        appointment.id
      );

      // =================================================
      // CHECK PATIENT EMAIL
      // =================================================

      if (!appointment.email) {
        console.log(
          "⚠️ Patient has no email:",
          appointment.patientName
        );

        continue;
      }

      // =================================================
      // SEND REMINDER EMAIL
      // =================================================

      try {

        const sent =
          await sendAppointmentReminderEmail(
            appointment.email,
            appointment.patientName,
            appointment.doctor,
            appointment.appointmentDate,
            appointment.appointmentTime
          );

        // =================================================
        // MARK REMINDER AS SENT
        // =================================================

        if (sent) {

          await db.query(
            `
            UPDATE appointments
            SET "reminderSent" = 1
            WHERE id = $1
            `,
            [appointment.id]
          );

          console.log(
            `✅ Appointment ${appointment.id} marked as reminded.`
          );

        } else {

          console.log(
            `⚠️ Reminder email was not sent for appointment ${appointment.id}.`
          );

        }

      } catch (emailError) {

        console.log(
          `❌ Failed to send reminder for appointment ${appointment.id}:`,
          emailError.message
        );

      }
    }

  } catch (err) {

    console.log(
      "❌ Reminder database error:",
      err
    );

  }
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