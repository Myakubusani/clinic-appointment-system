const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "myakubusani@gmail.com",
    pass: "xunh ygmr ioar fdsq",
  },
});

const sendAppointmentEmail = async (
  to,
  patientName,
  doctor,
  appointmentDate,
  appointmentTime,
  status = "Booked"
) => {
  try {
    await transporter.sendMail({
      from: `"ClinicCare" <YOUR_GMAIL@gmail.com>`,
      to,
      subject: `Appointment ${status} - ClinicCare`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2 style="color:#0d6efd;">🏥 ClinicCare Appointment</h2>

          <p>Hello <strong>${patientName}</strong>,</p>

          <p>Your appointment has been <strong>${status}</strong>.</p>

          <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;">
            <tr>
              <td><strong>Doctor</strong></td>
              <td>${doctor}</td>
            </tr>
            <tr>
              <td><strong>Date</strong></td>
              <td>${appointmentDate}</td>
            </tr>
            <tr>
              <td><strong>Time</strong></td>
              <td>${appointmentTime}</td>
            </tr>
            <tr>
              <td><strong>Status</strong></td>
              <td>${status}</td>
            </tr>
          </table>

          <br>

          <p>Thank you for choosing <strong>ClinicCare</strong>.</p>

          <hr>

          <small>This is an automated email. Please do not reply.</small>
        </div>
      `,
    });

    console.log("Email sent successfully");
  } catch (err) {
    console.log("Email Error:", err);
  }
};

module.exports = {
  sendAppointmentEmail,
};