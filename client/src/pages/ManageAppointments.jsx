import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load appointments");
    }
  };

  const updateStatus = async (id, status) => {
  try {
    await API.put(`/appointments/${id}`, { status });

toast.success("Appointment updated successfully!");

    fetchAppointments();
  } catch (err) {
    toast.error("Failed to update appointment.");
    console.log(err);
  }
};

const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Clinic Appointment Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [[
      "Patient",
      "Doctor",
      "Date",
      "Time",
      "Status"
    ]],
    body: appointments.map((appointment) => [
      appointment.patientName,
      appointment.doctor,
      appointment.appointmentDate,
      appointment.appointmentTime,
      appointment.status,
    ]),
  });

  doc.save("appointments-report.pdf");
};

  return (
    <AdminLayout>
      <h2 className="mb-4">
  📅 Manage Appointments
</h2>

<div className="mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="🔍 Search patient by name or email..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

      <div className="table-responsive">
  <table className="table table-striped table-hover table-bordered align-middle">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <div className="mb-3">
  <button
    className="btn btn-danger"
    onClick={exportPDF}
  >
    📄 Export Appointments PDF
  </button>
</div>

        <tbody>
          {appointments.map((item) => (
            <tr key={item.id}>
              <td>{item.patientName}</td>
              <td>{item.doctor}</td>
              <td>{item.appointmentDate}</td>
              <td>{item.appointmentTime}</td>
              <td>{item.reason}</td>

<td>
  <span
    className={`badge ${
      item.status === "Approved"
        ? "bg-success"
        : item.status === "Rejected"
        ? "bg-danger"
        : "bg-warning text-dark"
    }`}
  >
    {item.status}
  </span>
</td>

<td>
  <button
  className="btn btn-success btn-sm me-2"
  onClick={() => updateStatus(item.id, "Approved")}
>
  ✅ Approve
</button>

  {" "}

  <button
  className="btn btn-danger btn-sm"
  onClick={() => updateStatus(item.id, "Rejected")}
>
  ❌ Reject
</button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </AdminLayout>
  );
}

export default ManageAppointments;