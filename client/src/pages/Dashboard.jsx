import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const patient = JSON.parse(localStorage.getItem("patient"));

  const logout = () => {
    localStorage.removeItem("patient");
    navigate("/login");
  };

  return (
    <div className="container py-5">

      {/* Welcome Card */}
      <div className="card shadow-lg border-0 mb-4">
        <div className="card-body">
          <h2 className="text-primary">
            👋 Welcome, {patient?.fullName}
          </h2>

          <p className="text-muted mb-0">
            Welcome back to ClinicCare. Manage your appointments easily from your dashboard.
          </p>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="row g-4">

        <div className="col-md-4">
          <div className="card text-center shadow border-0 h-100">
            <div className="card-body">
              <h1>📅</h1>
              <h4>Book Appointment</h4>

              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate("/book")}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow border-0 h-100">
            <div className="card-body">
              <h1>📋</h1>
              <h4>My Appointments</h4>

              <button
                className="btn btn-success mt-3"
                onClick={() => navigate("/appointments")}
              >
                View Appointments
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow border-0 h-100">
            <div className="card-body">
              <h1>🚪</h1>
              <h4>Logout</h4>

              <button
                className="btn btn-danger mt-3"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Patient Information */}
      <div className="card shadow border-0 mt-5">
        <div className="card-header bg-primary text-white">
          Patient Information
        </div>

        <div className="card-body">

          <p>
            <strong>Full Name:</strong> {patient?.fullName}
          </p>

          <p>
            <strong>Email:</strong> {patient?.email}
          </p>

          <p>
            <strong>Phone:</strong> {patient?.phone}
          </p>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;