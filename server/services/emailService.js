require("dotenv").config();

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// =====================================================
// GENERAL APPOINTMENT EMAIL
// =====================================================

const sendAppointmentEmail = async (
  to,
  patientName,
  doctor,
  appointmentDate,
  appointmentTime,
  status = "Booked"
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `ClinicCare <onboarding@resend.dev>`,
      to: [to],

      subject: `Appointment ${status} - ClinicCare`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 600px;
          margin: auto;
        ">

          <h2 style="color:#0d6efd;">
            🏥 ClinicCare Appointment
          </h2>

          <p>
            Hello <strong>${patientName}</strong>,
          </p>

          <p>
            Your appointment has been
            <strong>${status}</strong>.
          </p>

          <table
            cellpadding="8"
            cellspacing="0"
            border="1"
            style="
              border-collapse:collapse;
              width:100%;
            "
          >
            <tr>
              <td><strong>👨‍⚕️ Doctor</strong></td>
              <td>${doctor}</td>
            </tr>

            <tr>
              <td><strong>📅 Date</strong></td>
              <td>${appointmentDate}</td>
            </tr>

            <tr>
              <td><strong>🕐 Time</strong></td>
              <td>${appointmentTime}</td>
            </tr>

            <tr>
              <td><strong>📌 Status</strong></td>
              <td>${status}</td>
            </tr>
          </table>

          <br>

          <p>
            Thank you for choosing
            <strong>ClinicCare</strong>.
          </p>

          <hr>

          <small>
            This is an automated email.
            Please do not reply.
          </small>

        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend appointment email error:", error);
      return false;
    }

    console.log(
      "✅ Appointment email sent successfully:",
      data?.id
    );

    return true;

  } catch (err) {
    console.error("❌ Appointment Email Error:", err);
    return false;
  }
};


// =====================================================
// APPOINTMENT REMINDER EMAIL
// =====================================================

const sendAppointmentReminderEmail = async (
  to,
  patientName,
  doctor,
  appointmentDate,
  appointmentTime
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `ClinicCare <onboarding@resend.dev>`,
      to: [to],

      subject: "🔔 Appointment Reminder - ClinicCare",

      html: `
        <div style="
          font-family:Arial,sans-serif;
          padding:20px;
          max-width:600px;
          margin:auto;
        ">

          <h2 style="color:#0d6efd;">
            🏥 ClinicCare
          </h2>

          <h3 style="color:#198754;">
            🔔 Appointment Reminder
          </h3>

          <p>
            Hello <strong>${patientName}</strong>,
          </p>

          <p>
            This is a friendly reminder that you have an
            <strong>approved appointment tomorrow</strong>.
          </p>

          <table
            cellpadding="10"
            cellspacing="0"
            border="1"
            style="
              border-collapse:collapse;
              width:100%;
            "
          >

            <tr>
              <td><strong>👨‍⚕️ Doctor</strong></td>
              <td>${doctor}</td>
            </tr>

            <tr>
              <td><strong>📅 Date</strong></td>
              <td>${appointmentDate}</td>
            </tr>

            <tr>
              <td><strong>🕐 Time</strong></td>
              <td>${appointmentTime}</td>
            </tr>

            <tr>
              <td><strong>📌 Status</strong></td>
              <td>
                <strong style="color:#198754;">
                  Approved
                </strong>
              </td>
            </tr>

          </table>

          <div style="
            background:#fff3cd;
            padding:15px;
            margin-top:20px;
            border-radius:5px;
          ">

            <strong>
              ⏰ Please remember to arrive on time.
            </strong>

          </div>

          <br>

          <p>
            Thank you for choosing
            <strong>ClinicCare</strong>.
          </p>

          <hr>

          <small>
            This is an automated reminder from ClinicCare.
            Please do not reply.
          </small>

        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend reminder email error:", error);
      return false;
    }

    console.log(
      `✅ Reminder email sent successfully: ${data?.id}`
    );

    return true;

  } catch (err) {
    console.error("❌ Reminder Email Error:", err);
    return false;
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  sendAppointmentEmail,
  sendAppointmentReminderEmail,
};