const db = require("../database/database");

const {
  sendAppointmentEmail,
} = require("../services/emailService");

const {
  createAppointment,
  getAppointmentsByPatient,
  getAllAppointmentsModel,
  updateAppointmentStatus,
  getAppointmentById,
} = require("../models/appointmentModel");

const {
  createNotification,
} = require("../models/notificationModel");


// =====================================================
// BOOK APPOINTMENT
// =====================================================

const bookAppointment = (req, res) => {
  createAppointment(req.body, (err, id) => {
    if (err) {
      console.log(
        "❌ Failed to create appointment:",
        err
      );

      return res.status(500).json({
        message: "Failed to book appointment",
        error: err.message,
      });
    }

    console.log(
      "✅ Appointment booked. ID:",
      id
    );

    // =================================================
    // SEND APPOINTMENT EMAIL
    // =================================================

    sendAppointmentEmail(
      req.body.email,
      req.body.patientName,
      req.body.doctor,
      req.body.appointmentDate,
      req.body.appointmentTime,
      "Booked"
    );

    // =================================================
    // NOTIFY DOCTOR
    // =================================================

    db.query(
      `
      SELECT id
      FROM doctors
      WHERE "fullName" = $1
      `,
      [req.body.doctor],
      (doctorErr, doctorResult) => {

        if (doctorErr) {
          console.log(
            "❌ Doctor notification lookup error:",
            doctorErr
          );

          return;
        }

        if (
          !doctorResult.rows ||
          doctorResult.rows.length === 0
        ) {
          console.log(
            "⚠️ Doctor not found for notification:",
            req.body.doctor
          );

          return;
        }

        const doctor = doctorResult.rows[0];

        console.log(
          "✅ Doctor found:",
          doctor
        );

        createNotification(
          {
            userId: doctor.id,
            userRole: "doctor",
            title: "📅 New Appointment",
            message:
              `${req.body.patientName} booked an appointment with you on ` +
              `${req.body.appointmentDate} at ${req.body.appointmentTime}.`,
            type: "appointment",
          },
          (notificationErr, notificationId) => {

            if (notificationErr) {
              console.log(
                "❌ Failed to create doctor notification:",
                notificationErr
              );

            } else {
              console.log(
                "✅ Doctor notification created. ID:",
                notificationId
              );
            }
          }
        );
      }
    );


    // =================================================
    // NOTIFY PATIENT
    // =================================================

    if (
      req.user &&
      req.user.role === "patient"
    ) {

      console.log(
        "🔔 Creating booking notification for patient"
      );

      createNotification(
        {
          userId: req.user.id,
          userRole: "patient",
          title: "📅 Appointment Booked",
          message:
            `Your appointment with ${req.body.doctor} has been booked for ` +
            `${req.body.appointmentDate} at ${req.body.appointmentTime}.`,
          type: "appointment",
        },
        (notificationErr, notificationId) => {

          if (notificationErr) {
            console.log(
              "❌ Failed to create patient booking notification:",
              notificationErr
            );

          } else {
            console.log(
              "✅ Patient booking notification created. ID:",
              notificationId
            );
          }
        }
      );
    }


    return res.status(201).json({
      message:
        "Appointment booked successfully!",
      appointmentId: id,
    });
  });
};


// =====================================================
// GET ONE APPOINTMENT
// =====================================================

const getAppointment = (
  req,
  res
) => {

  const { id } = req.params;

  console.log(
    "================================="
  );

  console.log(
    "📋 GET APPOINTMENT"
  );

  console.log(
    "Appointment ID:",
    id
  );

  console.log(
    "================================="
  );

  getAppointmentById(
    id,
    (err, appointment) => {

      if (err) {

        console.log(
          "❌ Get appointment error:",
          err
        );

        return res.status(500).json({
          message:
            "Failed to fetch appointment",
          error: err.message,
        });
      }

      console.log(
        "Appointment:",
        appointment
      );

      if (!appointment) {

        return res.status(404).json({
          message:
            "Appointment not found",
        });
      }

      return res.json(
        appointment
      );
    }
  );
};


// =====================================================
// GET PATIENT APPOINTMENTS
// =====================================================

const getMyAppointments = (
  req,
  res
) => {

  const { patientName } =
    req.params;

  getAppointmentsByPatient(
    patientName,
    (err, rows) => {

      if (err) {

        console.log(
          "❌ Failed to fetch patient appointments:",
          err
        );

        return res.status(500).json({
          message:
            "Failed to fetch appointments",
        });
      }

      return res.json(rows);
    }
  );
};


// =====================================================
// GET ALL APPOINTMENTS
// =====================================================

const getAllAppointments = (
  req,
  res
) => {

  getAllAppointmentsModel(
    (err, rows) => {

      if (err) {

        console.log(
          "❌ Failed to fetch all appointments:",
          err
        );

        return res.status(500).json({
          message:
            "Failed to fetch appointments",
        });
      }

      return res.json(rows);
    }
  );
};


// =====================================================
// UPDATE APPOINTMENT STATUS
// =====================================================

const updateAppointment = (
  req,
  res
) => {

  const {
    id,
  } = req.params;

  const {
    status,
  } = req.body;

  console.log("");

  console.log(
    "========================================"
  );

  console.log(
    "🔔 UPDATE APPOINTMENT RUNNING"
  );

  console.log(
    "Appointment ID:",
    id
  );

  console.log(
    "New Status:",
    status
  );

  console.log(
    "========================================"
  );


  // =================================================
  // GET APPOINTMENT FIRST
  // =================================================

  getAppointmentById(
    id,
    (findErr, appointment) => {

      if (findErr) {

        console.log(
          "❌ Failed to find appointment:",
          findErr
        );

        return res.status(500).json({
          message:
            "Failed to find appointment",
          error:
            findErr.message,
        });
      }

      if (!appointment) {

        console.log(
          "❌ Appointment not found:",
          id
        );

        return res.status(404).json({
          message:
            "Appointment not found",
        });
      }

      console.log(
        "✅ Appointment found:"
      );

      console.log(
        appointment
      );


      // =================================================
      // UPDATE APPOINTMENT STATUS
      // =================================================

      updateAppointmentStatus(
        id,
        status,
        (updateErr) => {

          if (updateErr) {

            console.log(
              "❌ Failed to update appointment:",
              updateErr
            );

            return res.status(500).json({
              message:
                "Failed to update appointment",
              error:
                updateErr.message,
            });
          }

          console.log(
            "✅ Appointment status updated successfully"
          );


          // =================================================
          // FIND PATIENT
          // =================================================

          db.query(
            `
            SELECT
              id,
              "fullName",
              email
            FROM patients
            WHERE "fullName" = $1
            `,
            [appointment.patientName],
            (patientErr, patientResult) => {

              if (patientErr) {

                console.log(
                  "❌ Patient notification lookup error:",
                  patientErr
                );

                return res.json({
                  message:
                    "Appointment updated successfully, but patient notification lookup failed.",
                });
              }


              if (
                !patientResult.rows ||
                patientResult.rows.length === 0
              ) {

                console.log(
                  "❌ PATIENT NOT FOUND FOR NOTIFICATION"
                );

                console.log(
                  "Patient name searched:",
                  appointment.patientName
                );

                return res.json({
                  message:
                    "Appointment updated successfully, but patient was not found for notification.",
                });
              }


              const patient =
                patientResult.rows[0];


              console.log(
                "✅ PATIENT FOUND:"
              );

              console.log(
                patient
              );


              // =================================================
              // CREATE NOTIFICATION CONTENT
              // =================================================

              let title =
                "📅 Appointment Updated";

              let message =
                `Your appointment with ${appointment.doctor} on ` +
                `${appointment.appointmentDate} at ` +
                `${appointment.appointmentTime} is now ${status}.`;


              if (
                status === "Approved"
              ) {

                title =
                  "✅ Appointment Approved";

                message =
                  `Your appointment with ${appointment.doctor} has been approved for ` +
                  `${appointment.appointmentDate} at ` +
                  `${appointment.appointmentTime}.`;
              }


              if (
                status === "Rejected"
              ) {

                title =
                  "❌ Appointment Rejected";

                message =
                  `Your appointment with ${appointment.doctor} on ` +
                  `${appointment.appointmentDate} at ` +
                  `${appointment.appointmentTime} has been rejected.`;
              }


              console.log("");

              console.log(
                "🔔 CREATING PATIENT NOTIFICATION"
              );

              console.log({
                userId:
                  patient.id,

                userRole:
                  "patient",

                title,

                message,

                type:
                  "appointment",
              });


              // =================================================
              // CREATE NOTIFICATION
              // =================================================

              createNotification(
                {
                  userId:
                    patient.id,

                  userRole:
                    "patient",

                  title,

                  message,

                  type:
                    "appointment",
                },
                (
                  notificationErr,
                  notificationId
                ) => {

                  if (
                    notificationErr
                  ) {

                    console.log(
                      "❌ NOTIFICATION DATABASE ERROR:"
                    );

                    console.log(
                      notificationErr
                    );

                    return;
                  }

                  console.log(
                    "✅ PATIENT NOTIFICATION CREATED SUCCESSFULLY"
                  );

                  console.log(
                    "Notification ID:",
                    notificationId
                  );
                }
              );


              // =================================================
              // SEND EMAIL ABOUT STATUS
              // =================================================

              if (
                patient.email
              ) {

                sendAppointmentEmail(
                  patient.email,
                  appointment.patientName,
                  appointment.doctor,
                  appointment.appointmentDate,
                  appointment.appointmentTime,
                  status
                );
              }


              console.log("");

              console.log(
                "✅ Appointment approval/rejection process completed"
              );

              console.log(
                "========================================"
              );


              return res.json({
                message:
                  "Appointment updated successfully!",
              });
            }
          );
        }
      );
    }
  );
};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  bookAppointment,
  getAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointment,
};