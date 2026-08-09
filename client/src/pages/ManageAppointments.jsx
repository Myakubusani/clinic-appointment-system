import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD APPOINTMENTS
  // =====================================================

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await API.get("/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(res.data);
    } catch (err) {
      console.log("Load appointments error:", err);

      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE APPOINTMENT STATUS
  // =====================================================

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/appointments/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (status === "Approved") {
        toast.success(
          "✅ Appointment approved successfully!"
        );
      } else if (status === "Rejected") {
        toast.success(
          "❌ Appointment rejected successfully!"
        );
      }

      // Reload appointments
      await fetchAppointments();

    } catch (err) {
      console.log(
        "Update appointment error:",
        err
      );

      toast.error(
        "Failed to update appointment."
      );
    }
  };

  // =====================================================
  // EXPORT PDF
  // =====================================================

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Clinic Appointment Report",
      14,
      20
    );

    autoTable(doc, {
      startY: 30,

      head: [
        [
          "Patient",
          "Doctor",
          "Date",
          "Time",
          "Reason",
          "Status",
        ],
      ],

      body: filteredAppointments.map(
        (appointment) => [
          appointment.patientName,
          appointment.doctor,
          appointment.appointmentDate,
          appointment.appointmentTime,
          appointment.reason,
          appointment.status,
        ]
      ),
    });

    doc.save(
      "appointments-report.pdf"
    );
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const searchedAppointments =
    appointments.filter((item) =>
      item.patientName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  // =====================================================
  // SORT APPOINTMENTS
  // PENDING FIRST
  // =====================================================

  const filteredAppointments = [
    ...searchedAppointments,
  ].sort((a, b) => {

    // Pending appointments first
    if (
      a.status === "Pending" &&
      b.status !== "Pending"
    ) {
      return -1;
    }

    if (
      a.status !== "Pending" &&
      b.status === "Pending"
    ) {
      return 1;
    }

    // Then sort by date
    const dateA = new Date(
      `${a.appointmentDate}T${
        a.appointmentTime || "00:00"
      }`
    );

    const dateB = new Date(
      `${b.appointmentDate}T${
        b.appointmentTime || "00:00"
      }`
    );

    return dateA - dateB;
  });

  // =====================================================
  // PENDING COUNT
  // =====================================================

  const pendingCount = appointments.filter(
    (appointment) =>
      appointment.status === "Pending"
  ).length;

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <AdminLayout>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="mb-1">
            📅 Manage Appointments
          </h2>

          <p className="text-muted mb-0">
            Review and manage patient appointments.
          </p>

        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchAppointments}
        >
          🔄 Refresh
        </button>

      </div>


      {/* =================================================
          PENDING APPROVAL ALERT
      ================================================= */}

      {pendingCount > 0 ? (

        <div className="alert alert-warning shadow-sm">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h5 className="mb-1">
                ⏳ Pending Approvals
              </h5>

              <p className="mb-0">

                There{" "}
                {pendingCount === 1
                  ? "is"
                  : "are"}{" "}

                <strong>
                  {pendingCount}
                </strong>{" "}

                appointment
                {pendingCount === 1
                  ? ""
                  : "s"}{" "}

                waiting for approval.

              </p>

            </div>

            <span className="badge bg-warning text-dark fs-6">
              {pendingCount} Pending
            </span>

          </div>

        </div>

      ) : (

        <div className="alert alert-success shadow-sm">

          <strong>
            ✅ No pending approvals.
          </strong>

          <span className="ms-2">
            All appointments have been reviewed.
          </span>

        </div>

      )}


      {/* =================================================
          SEARCH + EXPORT
      ================================================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <div className="row g-3 align-items-center">

            <div className="col-md-8">

              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search patient..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="col-md-4">

              <button
                className="btn btn-danger w-100"
                onClick={exportPDF}
                disabled={
                  filteredAppointments.length === 0
                }
              >
                📄 Export PDF
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          APPOINTMENT TABLE
      ================================================= */}

      <div className="card shadow border-0">

        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">

          <h5 className="mb-0">
            📋 Appointment List
          </h5>

          <span className="badge bg-light text-dark">
            {filteredAppointments.length}{" "}
            Appointment
            {filteredAppointments.length === 1
              ? ""
              : "s"}
          </span>

        </div>

        <div className="card-body">

          {loading ? (

            <div className="text-center py-5">

              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="mt-2">
                Loading appointments...
              </p>

            </div>

          ) : filteredAppointments.length ===
            0 ? (

            <div className="alert alert-info mb-0">

              📅 No appointments found.

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-striped table-hover table-bordered align-middle">

                <thead className="table-light">

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

                <tbody>

                  {filteredAppointments.map(
                    (item) => (

                      <tr
                        key={item.id}
                        className={
                          item.status ===
                          "Pending"
                            ? "table-warning"
                            : ""
                        }
                      >

                        <td>

                          <strong>
                            {item.patientName}
                          </strong>

                          {item.status ===
                            "Pending" && (

                            <div>

                              <small className="text-warning-emphasis">
                                ⏳ Waiting for approval
                              </small>

                            </div>

                          )}

                        </td>

                        <td>
                          {item.doctor}
                        </td>

                        <td>
                          {item.appointmentDate}
                        </td>

                        <td>
                          {item.appointmentTime}
                        </td>

                        <td>
                          {item.reason ||
                            "Not provided"}
                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`badge ${
                              item.status ===
                              "Approved"
                                ? "bg-success"
                                : item.status ===
                                  "Rejected"
                                ? "bg-danger"
                                : item.status ===
                                  "Cancelled"
                                ? "bg-secondary"
                                : "bg-warning text-dark"
                            }`}
                          >

                            {item.status}

                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          {item.status ===
                            "Pending" ? (

                            <div className="d-flex gap-2">

                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  updateStatus(
                                    item.id,
                                    "Approved"
                                  )
                                }
                              >
                                ✅ Approve
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  updateStatus(
                                    item.id,
                                    "Rejected"
                                  )
                                }
                              >
                                ❌ Reject
                              </button>

                            </div>

                          ) : (

                            <span className="text-muted">

                              No action needed

                            </span>

                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </AdminLayout>
  );
}

export default ManageAppointments;