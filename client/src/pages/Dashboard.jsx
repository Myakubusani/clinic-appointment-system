import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function Dashboard() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointment, setLoadingAppointment] = useState(true);

  // ==========================================
  // LOAD PATIENT
  // ==========================================
  useEffect(() => {
  const loadPatient = async () => {

    const storedPatient =
      localStorage.getItem("patient");

    if (!storedPatient) {
      setLoadingAppointment(false);
      return;
    }

    try {

      const parsedPatient =
        JSON.parse(storedPatient);

      // First show stored information
      setPatient(parsedPatient);

      // Get latest information from database
      if (parsedPatient.id) {

        const response = await API.get(
          `/patients/${parsedPatient.id}`
        );

        console.log(
          "✅ Latest patient information:",
          response.data
        );

        setPatient(response.data);

        // Update localStorage too
        localStorage.setItem(
          "patient",
          JSON.stringify(response.data)
        );
      }

    } catch (err) {
  console.error("================================");
  console.error("❌ APPOINTMENT ERROR");
  console.error("MESSAGE:", err.message);
  console.error("CODE:", err.code);
  console.error("NAME:", err.name);
  console.error("STATUS:", err.response?.status);
  console.error("DATA:", err.response?.data);
  console.error("URL:", err.config?.url);
  console.error("BASE URL:", err.config?.baseURL);
  console.error("FULL CONFIG:", err.config);
  console.error("================================");

  toast.error("Failed to load appointments");
  setAppointments([]);
}

  // ==========================================
  // LOAD PATIENT APPOINTMENTS
  // ==========================================
  useEffect(() => {
    if (patient?.fullName) {
      loadAppointments();
    }
  }, [patient]);

  const loadAppointments = async () => {
  try {
    setLoadingAppointment(true);

    const patientName = encodeURIComponent(patient.fullName);

    const url = `/appointments/patient/${patientName}`;

    console.log("================================");
    console.log("PATIENT:", patient);
    console.log("REQUEST URL:", url);
    console.log("================================");

    const res = await API.get(url);

    console.log("APPOINTMENT RESPONSE:", res.data);

    setAppointments(res.data || []);
  } catch (err) {
    console.error("================================");
    console.error("APPOINTMENT ERROR");
    console.error("STATUS:", err.response?.status);
    console.error("DATA:", err.response?.data);
    console.error("URL:", err.config?.url);
    console.error("================================");

    toast.error("Failed to load appointments");
    setAppointments([]);
  } finally {
    setLoadingAppointment(false);
  }
};

  // ==========================================
  // CONVERT APPOINTMENT DATE + TIME
  // ==========================================
  const getAppointmentDateTime = (appointment) => {
    if (!appointment?.appointmentDate) {
      return null;
    }

    let time = appointment.appointmentTime || "12:00 AM";

    time = String(time).trim().toUpperCase();

    // ------------------------------------------
    // Handle AM / PM times
    // Example:
    // 07:55 AM
    // 08:00 AM
    // 09:11 PM
    // ------------------------------------------
    const timeMatch = time.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
    );

    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const period = timeMatch[3];

      if (period === "PM" && hours !== 12) {
        hours += 12;
      }

      if (period === "AM" && hours === 12) {
        hours = 0;
      }

      const formattedHours = String(hours).padStart(2, "0");
      const formattedMinutes = String(minutes).padStart(2, "0");

      time = `${formattedHours}:${formattedMinutes}`;
    }

    // ------------------------------------------
    // Handle 24-hour time
    // Example:
    // 08:30
    // 14:30
    // ------------------------------------------
    const dateTime = new Date(
      `${appointment.appointmentDate}T${time}`
    );

    if (isNaN(dateTime.getTime())) {
      console.error(
        "Invalid appointment date/time:",
        appointment
      );

      return null;
    }

    return dateTime;
  };

  // ==========================================
  // FIND NEXT APPOINTMENT
  // ==========================================
  const getNextAppointment = () => {
    const now = new Date();

    console.log("Current time:", now);
    console.log("All appointments:", appointments);

    const validAppointments = appointments
      .filter((appointment) => {
        // Ignore rejected appointments
        if (appointment.status === "Rejected") {
          return false;
        }

        // Ignore cancelled appointments
        if (appointment.status === "Cancelled") {
          return false;
        }

        const appointmentDateTime =
          getAppointmentDateTime(appointment);

        if (!appointmentDateTime) {
          return false;
        }

        console.log(
          "Checking appointment:",
          appointment.id,
          appointmentDateTime
        );

        return appointmentDateTime >= now;
      })
      .sort((a, b) => {
        const dateA = getAppointmentDateTime(a);
        const dateB = getAppointmentDateTime(b);

        if (!dateA || !dateB) {
          return 0;
        }

        return dateA - dateB;
      });

    console.log(
      "Upcoming appointments:",
      validAppointments
    );

    // ==========================================
    // PREFER APPROVED APPOINTMENT
    // ==========================================
    const approvedAppointment =
      validAppointments.find(
        (appointment) =>
          appointment.status === "Approved"
      );

    if (approvedAppointment) {
      return approvedAppointment;
    }

    // ==========================================
    // IF NO APPROVED APPOINTMENT,
    // SHOW NEAREST PENDING APPOINTMENT
    // ==========================================
    const pendingAppointment =
      validAppointments.find(
        (appointment) =>
          appointment.status === "Pending"
      );

    if (pendingAppointment) {
      return pendingAppointment;
    }

    return null;
  };

  const nextAppointment = getNextAppointment();

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = () => {
    localStorage.removeItem("patient");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  // ==========================================
  // FORMAT DATE FOR DISPLAY
  // ==========================================
  const formatAppointmentDate = (date) => {
    if (!date) {
      return "Not provided";
    }

    try {
      const formattedDate = new Date(
        `${date}T00:00:00`
      );

      return formattedDate.toLocaleDateString(
        "en-US",
        {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    } catch (error) {
      return date;
    }
  };

  // ==========================================
  // RETURN
  // ==========================================
  return (
    <div className="container py-5">

      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2>
            👤 Patient Dashboard
          </h2>

          <p className="text-muted mb-0">
            Welcome, {patient?.fullName || "Patient"}
          </p>
        </div>

        <button
          className="btn btn-danger"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </div>

      {/* ==========================================
          PATIENT INFORMATION
      ========================================== */}
      {patient && (
        <div className="card shadow-sm border-0 mb-4">

          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              👤 Patient Information
            </h5>
          </div>

          <div className="card-body">

            <div className="row">

              <div className="col-md-4 mb-3">
                <strong>Full Name</strong>

                <p className="mb-0">
                  {patient.fullName}
                </p>
              </div>

              <div className="col-md-4 mb-3">
                <strong>Email</strong>

                <p className="mb-0">
                  {patient.email || "Not provided"}
                </p>
              </div>

              <div className="col-md-4 mb-3">
                <strong>Phone</strong>

                <p className="mb-0">
                  {patient.phone || "Not provided"}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          LOADING APPOINTMENT
      ========================================== */}
      {loadingAppointment && (
        <div className="card shadow-sm border-0 mb-4">

          <div className="card-body text-center py-4">

            <div
              className="spinner-border text-primary"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p className="mt-2 mb-0">
              Loading your appointments...
            </p>

          </div>

        </div>
      )}

      {/* ==========================================
          NEXT APPOINTMENT
      ========================================== */}
      {!loadingAppointment && nextAppointment && (

        <div className="card shadow-lg border-0 mb-4">

          <div
            className={`card-header ${
              nextAppointment.status === "Approved"
                ? "bg-success text-white"
                : "bg-warning text-dark"
            }`}
          >

            <h5 className="mb-0">

              {nextAppointment.status === "Approved"
                ? "📅 Your Next Appointment"
                : "⏳ Appointment Awaiting Approval"}

            </h5>

          </div>

          <div className="card-body">

            <div className="row">

              {/* Doctor */}
              <div className="col-md-3 mb-3">

                <div className="p-3 bg-light rounded h-100">

                  <small className="text-muted">
                    👨‍⚕️ Doctor
                  </small>

                  <h6 className="mt-2 mb-0">
                    {nextAppointment.doctor ||
                      "Not provided"}
                  </h6>

                </div>

              </div>

              {/* Date */}
              <div className="col-md-3 mb-3">

                <div className="p-3 bg-light rounded h-100">

                  <small className="text-muted">
                    📅 Date
                  </small>

                  <h6 className="mt-2 mb-0">
                    {formatAppointmentDate(
                      nextAppointment.appointmentDate
                    )}
                  </h6>

                </div>

              </div>

              {/* Time */}
              <div className="col-md-3 mb-3">

                <div className="p-3 bg-light rounded h-100">

                  <small className="text-muted">
                    🕐 Time
                  </small>

                  <h6 className="mt-2 mb-0">
                    {nextAppointment.appointmentTime ||
                      "Not provided"}
                  </h6>

                </div>

              </div>

              {/* Status */}
              <div className="col-md-3 mb-3">

                <div className="p-3 bg-light rounded h-100">

                  <small className="text-muted">
                    📌 Status
                  </small>

                  <div className="mt-2">

                    <span
                      className={`badge ${
                        nextAppointment.status ===
                        "Approved"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {nextAppointment.status}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* Reason */}
            <div className="mt-2">

              <strong>
                📝 Reason:
              </strong>{" "}

              {nextAppointment.reason ||
                "No reason provided"}

            </div>

            {/* Approved Message */}
            {nextAppointment.status ===
              "Approved" && (

              <div className="alert alert-success mt-3 mb-0">

                <strong>
                  ✅ Your appointment has been approved.
                </strong>

                <br />

                Please arrive on time for your appointment.

              </div>
            )}

            {/* Pending Message */}
            {nextAppointment.status ===
              "Pending" && (

              <div className="alert alert-warning mt-3 mb-0">

                <strong>
                  ⏳ Your appointment is awaiting
                  approval.
                </strong>

                <br />

                You will see the appointment here once
                it has been booked.

              </div>
            )}

            {/* View Appointments */}
            <button
              className="btn btn-primary mt-3"
              onClick={() =>
                navigate("/my-appointments")
              }
            >
              📋 View All Appointments
            </button>

          </div>

        </div>
      )}

        

      {/* ==========================================
          NO UPCOMING APPOINTMENT
      ========================================== */}
      {!loadingAppointment &&
        !nextAppointment && (

        <div className="alert alert-info shadow-sm mb-4">

          <h5>
            📅 No Upcoming Appointments
          </h5>

          <p className="mb-2">
            You don't have any upcoming appointments.
          </p>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/book-appointment")
            }
          >
            📅 Book an Appointment
          </button>

        </div>
      )}

      {/* ==========================================
          DASHBOARD ACTIONS
      ========================================== */}
      <div className="row g-4">

        {/* ==========================================
            BOOK APPOINTMENT
        ========================================== */}
        <div className="col-md-4">

          <div className="card text-center shadow border-0 h-100">

            <div className="card-body">

              <h1>📅</h1>

              <h4>
                Book Appointment
              </h4>

              <p className="text-muted">
                Schedule an appointment with a doctor.
              </p>

              <button
                className="btn btn-primary mt-3"
                onClick={() =>
                  navigate("/book-appointment")
                }
              >
                Book Appointment
              </button>

            </div>

          </div>

        </div>

        {/* ==========================================
            MY APPOINTMENTS
        ========================================== */}
        <div className="col-md-4">

          <div className="card text-center shadow border-0 h-100">

            <div className="card-body">

              <h1>📋</h1>

              <h4>
                My Appointments
              </h4>

              <p className="text-muted">
                View your upcoming and previous
                appointments.
              </p>

              <button
                className="btn btn-success mt-3"
                onClick={() =>
                  navigate("/my-appointments")
                }
              >
                View Appointments
              </button>

            </div>

          </div>

        </div>

        {/* ==========================================
            MEDICAL RECORDS
        ========================================== */}
        <div className="col-md-4">

          <div className="card text-center shadow border-0 h-100">

            <div className="card-body">

              <h1>🩺</h1>

              <h4>
                Medical Records
              </h4>

              <p className="text-muted">
                View your medical history, diagnosis
                and prescriptions.
              </p>

              <button
                className="btn btn-info mt-3"
                onClick={() =>
                  navigate("/my-medical-records")
                }
              >
                View Records
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;