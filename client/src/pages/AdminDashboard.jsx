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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/dashboard");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <h2 className="mb-4">Dashboard</h2>

      <div className="row g-4">

        <div className="col-lg-3 col-md-6">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h1>👥</h1>
              <h5>Patients</h5>
              <h2>{stats.patients}</h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h1>👨‍⚕️</h1>
              <h5>Doctors</h5>
              <h2>{stats.doctors}</h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h1>📅</h1>
              <h5>Appointments</h5>
              <h2>{stats.appointments}</h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card shadow border-0">
            <div className="card-body text-center">
              <h1>🩺</h1>
              <h5>Medical Records</h5>
              <h2>--</h2>
            </div>
          </div>
        </div>

      </div>

      <div className="row mt-4">

        <div className="col-lg-6">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white">
              Appointment Status
            </div>

            <div className="card-body">
              <p className="text-success fs-5">
                ✅ Approved: {stats.approved}
              </p>

              <p className="text-warning fs-5">
                ⏳ Pending: {stats.pending}
              </p>

              <p className="text-danger fs-5">
                ❌ Rejected: {stats.rejected}
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow border-0">
            <div className="card-header bg-success text-white">
              Quick Actions
            </div>

            <div className="card-body d-grid gap-2">

              <button
                className="btn btn-primary"
                onClick={() => navigate("/manage-patients")}
              >
                👥 Manage Patients
              </button>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/manage-doctors")}
              >
                👨‍⚕️ Manage Doctors
              </button>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/manage-appointments")}
              >
                📅 Manage Appointments
              </button>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/medical-records")}
              >
                🩺 Medical Records
              </button>

            </div>
          </div>
        </div>

      </div>
      <DashboardChart stats={stats} />
      <AdminCharts />
      <AppointmentCalendar />
    </AdminLayout>
  );
}
    

export default AdminDashboard;