import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import DashboardChart from "../components/DashboardChart";
import AdminCharts from "../components/AdminCharts";
import AppointmentCalendar from "../components/AppointmentCalendar";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD DASHBOARD STATISTICS
  // =====================================================

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await API.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (err) {
      console.log("Dashboard statistics error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-4">

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">

          <div>
            <h2 className="mb-1">
              🏥 Admin Dashboard
            </h2>

            <p className="text-muted mb-0">
              Manage ClinicCare and monitor appointments.
            </p>
          </div>

          <button
            className="btn btn-outline-primary w-100 w-md-auto"
            onClick={fetchStats}
            disabled={loading}
          >
            🔄 {loading ? "Refreshing..." : "Refresh"}
          </button>

        </div>

      </div>


      {/* =====================================================
          PENDING APPROVAL ALERT
      ===================================================== */}

      {!loading && stats.pending > 0 && (

        <div
          className="alert alert-warning shadow-sm"
          role="alert"
        >

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">

            <div>

              <h5 className="alert-heading mb-1">
                ⏳ Pending Appointment Approvals
              </h5>

              <p className="mb-0">
                You have{" "}
                <strong>
                  {stats.pending}
                </strong>{" "}
                appointment
                {stats.pending === 1 ? "" : "s"} waiting
                for approval.
              </p>

            </div>

            <button
              className="btn btn-warning w-100 w-md-auto"
              onClick={() =>
                navigate("/manage-appointments")
              }
            >
              📅 Review Now
            </button>

          </div>

        </div>

      )}


      {!loading && stats.pending === 0 && (

        <div className="alert alert-success shadow-sm">

          <strong>
            ✅ No pending appointment approvals.
          </strong>

          <span className="d-block d-md-inline ms-md-2 mt-1 mt-md-0">
            All appointments have been reviewed.
          </span>

        </div>

      )}


      {/* =====================================================
          STATISTICS CARDS
      ===================================================== */}

      <div className="row g-3 g-md-4">

        {/* Patients */}

        <div className="col-6 col-lg-3">

          <div className="card shadow border-0 h-100">

            <div className="card-body text-center p-3 p-md-4">

              <div className="fs-1">
                👥
              </div>

              <h6 className="mt-2 mb-1">
                Patients
              </h6>

              <h2 className="mb-0">
                {loading ? "..." : stats.patients}
              </h2>

            </div>

          </div>

        </div>


        {/* Doctors */}

        <div className="col-6 col-lg-3">

          <div className="card shadow border-0 h-100">

            <div className="card-body text-center p-3 p-md-4">

              <div className="fs-1">
                👨‍⚕️
              </div>

              <h6 className="mt-2 mb-1">
                Doctors
              </h6>

              <h2 className="mb-0">
                {loading ? "..." : stats.doctors}
              </h2>

            </div>

          </div>

        </div>


        {/* Appointments */}

        <div className="col-6 col-lg-3">

          <div className="card shadow border-0 h-100">

            <div className="card-body text-center p-3 p-md-4">

              <div className="fs-1">
                📅
              </div>

              <h6 className="mt-2 mb-1">
                Appointments
              </h6>

              <h2 className="mb-0">
                {loading ? "..." : stats.appointments}
              </h2>

            </div>

          </div>

        </div>


        {/* Pending Approvals */}

        <div className="col-6 col-lg-3">

          <div
            className={`card shadow border-0 h-100 ${
              stats.pending > 0
                ? "border border-warning"
                : ""
            }`}
          >

            <div className="card-body text-center p-3 p-md-4">

              <div className="fs-1">
                {stats.pending > 0 ? "⏳" : "✅"}
              </div>

              <h6 className="mt-2 mb-1">
                Pending Approvals
              </h6>

              <h2
                className={
                  stats.pending > 0
                    ? "text-warning"
                    : "text-success"
                }
              >
                {loading ? "..." : stats.pending}
              </h2>

              <button
                className={`btn btn-sm w-100 mt-2 ${
                  stats.pending > 0
                    ? "btn-warning"
                    : "btn-outline-success"
                }`}
                onClick={() =>
                  navigate("/manage-appointments")
                }
              >
                {stats.pending > 0
                  ? "Review"
                  : "View"}
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          APPOINTMENT STATUS + QUICK ACTIONS
      ===================================================== */}

      <div className="row g-3 g-md-4 mt-2">

        {/* Appointment Status */}

        <div className="col-lg-6">

          <div className="card shadow border-0 h-100">

            <div className="card-header bg-primary text-white">

              <h5 className="mb-0">
                📊 Appointment Status
              </h5>

            </div>

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <span className="text-success">
                  ✅ Approved
                </span>

                <strong className="text-success">
                  {stats.approved}
                </strong>

              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">

                <span className="text-warning">
                  ⏳ Pending
                </span>

                <strong className="text-warning">
                  {stats.pending}
                </strong>

              </div>

              <div className="d-flex justify-content-between align-items-center">

                <span className="text-danger">
                  ❌ Rejected
                </span>

                <strong className="text-danger">
                  {stats.rejected}
                </strong>

              </div>


              {/* Pending Review Button */}

              {stats.pending > 0 && (

                <button
                  className="btn btn-warning w-100 mt-4"
                  onClick={() =>
                    navigate("/manage-appointments")
                  }
                >
                  ⏳ Review {stats.pending} Pending
                  Appointment
                  {stats.pending === 1 ? "" : "s"}
                </button>

              )}

            </div>

          </div>

        </div>


        {/* Quick Actions */}

        <div className="col-lg-6">

          <div className="card shadow border-0 h-100">

            <div className="card-header bg-success text-white">

              <h5 className="mb-0">
                ⚡ Quick Actions
              </h5>

            </div>

            <div className="card-body d-grid gap-2">

              <button
                className="btn btn-primary py-2"
                onClick={() =>
                  navigate("/manage-patients")
                }
              >
                👥 Manage Patients
              </button>

              <button
                className="btn btn-primary py-2"
                onClick={() =>
                  navigate("/manage-doctors")
                }
              >
                👨‍⚕️ Manage Doctors
              </button>

              <button
                className="btn btn-primary py-2"
                onClick={() =>
                  navigate("/manage-appointments")
                }
              >
                📅 Manage Appointments
              </button>

              <button
                className="btn btn-primary py-2"
                onClick={() =>
                  navigate("/medical-records")
                }
              >
                🩺 Medical Records
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          DASHBOARD CHART
      ===================================================== */}

      <div className="mt-4">
        <DashboardChart stats={stats} />
      </div>


      {/* =====================================================
          ADMIN CHARTS
      ===================================================== */}

      <div className="mt-4">
        <AdminCharts />
      </div>


      {/* =====================================================
          APPOINTMENT CALENDAR
      ===================================================== */}

      <div className="mt-4">
        <AppointmentCalendar />
      </div>

    </AdminLayout>
  );
}

export default AdminDashboard;