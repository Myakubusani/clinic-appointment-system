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

  const patient = JSON.parse(localStorage.getItem("patient"));

  useEffect(() => {
    if (patient) {
      loadAppointments();
    }
  }, []);

  const loadAppointments = async () => {
    try {
      const res = await API.get(`/appointments/${patient.fullName}`);
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load appointments");
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("My Appointments", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Doctor", "Date", "Time", "Reason", "Status"]],
      body: appointments.map((appointment) => [
        appointment.doctor,
        appointment.appointmentDate,
        appointment.appointmentTime,
        appointment.reason,
        appointment.status,
      ]),
    });

    doc.save("my-appointments.pdf");
  };

  const getBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "badge bg-success";
      case "pending":
        return "badge bg-warning text-dark";
      case "rejected":
        return "badge bg-danger";
      case "completed":
        return "badge bg-primary";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <div className="container py-5">

      <div className="card shadow-lg border-0">

        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">📋 My Appointments</h3>
        </div>

        <div className="card-body">

          <div className="d-flex justify-content-between mb-3">

            <input
              className="form-control w-50"
              placeholder="🔍 Search doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              className="btn btn-danger"
              onClick={exportPDF}
            >
              📄 Export PDF
            </button>

          </div>

          {appointments.length === 0 ? (
            <div className="alert alert-info">
              No appointments found.
            </div>
          ) : (
            <div className="table-responsive">

              <table className="table table-hover table-striped">

                <thead className="table-primary">
                  <tr>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {appointments
                    .filter((appointment) =>
                      appointment.doctor
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )
                    .map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.doctor}</td>
                        <td>{appointment.appointmentDate}</td>
                        <td>{appointment.appointmentTime}</td>
                        <td>{appointment.reason}</td>
                        <td>
                          <span className={getBadge(appointment.status)}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                </tbody>

              </table>

            </div>
          )}

          <div className="mt-4">

            <button
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard")}
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