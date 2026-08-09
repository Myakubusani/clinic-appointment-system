import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function MyAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");

  const patient = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (patient) {
      loadAppointments();
    }
  }, []);

  // ==========================================
  // LOAD APPOINTMENTS
  // ==========================================
  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        `/appointments/patient/${encodeURIComponent(
          patient.fullName
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(res.data);
    } catch (err) {
      console.log("Appointments Error:", err);
      toast.error("Failed to load appointments");
    }
  };

  // ==========================================
  // EXPORT PDF
  // ==========================================
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("My Appointments", 14, 20);

    autoTable(doc, {
      startY: 30,

      head: [
        [
          "Doctor",
          "Date",
          "Time",
          "Reason",
          "Status",
        ],
      ],

      body: appointments.map((appointment) => [
        appointment.doctor,
        appointment.appointmentDate,
        appointment.appointmentTime,
        appointment.reason || "Not provided",
        appointment.status,
      ]),
    });

    doc.save("my-appointments.pdf");
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================
  const getBadge = (status) => {
    switch (status) {
      case "Approved":
        return "badge bg-success";

      case "Rejected":
        return "badge bg-danger";

      case "Pending":
        return "badge bg-warning text-dark";

      case "Cancelled":
        return "badge bg-secondary";

      default:
        return "badge bg-secondary";
    }
  };

  // ==========================================
  // FIND UPCOMING APPOINTMENT
  // ==========================================
  const getUpcomingAppointment = () => {
    const now = new Date();

    const upcoming = appointments
      .filter((appointment) => {
        // Ignore rejected/cancelled appointments
        if (
          appointment.status === "Rejected" ||
          appointment.status === "Cancelled"
        ) {
          return false;
        }

        if (!appointment.appointmentDate) {
          return false;
        }

        // Combine date and time
        const appointmentDateTime = new Date(
          `${appointment.appointmentDate}T${
            appointment.appointmentTime || "00:00"
          }`
        );

        return appointmentDateTime >= now;
      })
      .sort((a, b) => {
        const dateA = new Date(
          `${a.appointmentDate}T${a.appointmentTime || "00:00"}`
        );

        const dateB = new Date(
          `${b.appointmentDate}T${b.appointmentTime || "00:00"}`
        );

        return dateA - dateB;
      });

    return upcoming.length > 0 ? upcoming[0] : null;
  };

  const upcomingAppointment = getUpcomingAppointment();

  // ==========================================
  // FILTER APPOINTMENTS
  // ==========================================
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.doctor
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <div className="card shadow-lg border-0 mb-4">

        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            📋 My Appointments
          </h3>
        </div>

        <div className="card-body">

          <p className="text-muted mb-0">
            View and manage your upcoming and previous
            appointments.
          </p>

        </div>

      </div>


      {/* ==========================================
          UPCOMING APPOINTMENT
      ========================================== */}
      {upcomingAppointment && (
        <div className="card shadow-lg border-0 mb-4">

          <div className="card-header bg-success text-white">
            <h4 className="mb-0">
              📅 Upcoming Appointment
            </h4>
          </div>

          <div className="card-body">

            <div className="row">

              {/* Doctor */}
              <div className="col-md-6 mb-3">

                <div className="p-3 bg-light rounded">

                  <h6 className="text-muted">
                    👨‍⚕️ Doctor
                  </h6>

                  <h5 className="mb-0">
                    {upcomingAppointment.doctor}
                  </h5>

                </div>

              </div>


              {/* Date */}
              <div className="col-md-6 mb-3">

                <div className="p-3 bg-light rounded">

                  <h6 className="text-muted">
                    📅 Date
                  </h6>

                  <h5 className="mb-0">
                    {upcomingAppointment.appointmentDate}
                  </h5>

                </div>

              </div>


              {/* Time */}
              <div className="col-md-6 mb-3">

                <div className="p-3 bg-light rounded">

                  <h6 className="text-muted">
                    🕐 Time
                  </h6>

                  <h5 className="mb-0">
                    {upcomingAppointment.appointmentTime}
                  </h5>

                </div>

              </div>


              {/* Status */}
              <div className="col-md-6 mb-3">

                <div className="p-3 bg-light rounded">

                  <h6 className="text-muted">
                    📌 Status
                  </h6>

                  <span
                    className={getBadge(
                      upcomingAppointment.status
                    )}
                    style={{
                      fontSize: "1rem",
                    }}
                  >
                    {upcomingAppointment.status}
                  </span>

                </div>

              </div>

            </div>


            {/* Reason */}
            <div className="mt-2">

              <h6 className="text-muted">
                📝 Reason for Visit
              </h6>

              <p className="mb-0">
                {upcomingAppointment.reason ||
                  "No reason provided"}
              </p>

            </div>


            {/* Approved Message */}
            {upcomingAppointment.status === "Approved" && (
              <div className="alert alert-success mt-4 mb-0">

                <strong>
                  ✅ Your appointment has been approved.
                </strong>

                <br />

                Please arrive on time for your appointment.

              </div>
            )}


            {/* Pending Message */}
            {upcomingAppointment.status === "Pending" && (
              <div className="alert alert-warning mt-4 mb-0">

                <strong>
                  ⏳ Your appointment is awaiting approval.
                </strong>

                <br />

                You will be notified when the appointment
                status changes.

              </div>
            )}

          </div>

        </div>
      )}


      {/* ==========================================
          SEARCH + PDF
      ========================================== */}
      <div className="card shadow border-0">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-3 gap-3">

            <input
              type="text"
              className="form-control"
              style={{ maxWidth: "500px" }}
              placeholder="🔍 Search doctor..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <button
              className="btn btn-danger"
              onClick={exportPDF}
            >
              📄 Export PDF
            </button>

          </div>


          {/* ==========================================
              APPOINTMENT TABLE
          ========================================== */}
          {appointments.length === 0 ? (

            <div className="alert alert-info">

              <h5>
                📅 No Appointments Found
              </h5>

              <p className="mb-0">
                You haven't booked any appointments yet.
              </p>

            </div>

          ) : filteredAppointments.length === 0 ? (

            <div className="alert alert-warning">

              No appointments found for:
              <strong> {search}</strong>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-striped table-hover align-middle">

                <thead className="table-primary">

                  <tr>

                    <th>
                      Doctor
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Time
                    </th>

                    <th>
                      Reason
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredAppointments.map(
                    (appointment) => (

                      <tr key={appointment.id}>

                        <td>
                          {appointment.doctor}
                        </td>

                        <td>
                          {appointment.appointmentDate}
                        </td>

                        <td>
                          {appointment.appointmentTime}
                        </td>

                        <td>
                          {appointment.reason ||
                            "Not provided"}
                        </td>

                        <td>

                          <span
                            className={getBadge(
                              appointment.status
                            )}
                          >
                            {appointment.status}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}


          {/* ==========================================
              BACK TO DASHBOARD
          ========================================== */}
          <div className="mt-4">

            <button
              className="btn btn-secondary"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              ← Back to Dashboard
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default MyAppointments;