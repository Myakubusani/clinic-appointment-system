import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function DoctorDashboard() {
  const navigate = useNavigate();

  const doctor = JSON.parse(localStorage.getItem("doctor"));
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const res = await API.get(`/doctors/appointments/${doctor.name}`);
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load appointments");
    }
  };

  const logout = () => {
    localStorage.removeItem("doctor");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/doctor-login");
  };

  return (
    <div className="container py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2>👨‍⚕️ Doctor Dashboard</h2>
          <p className="text-muted">
            Welcome, Dr. {doctor?.name}
          </p>
        </div>

        <button
          className="btn btn-danger"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      <div className="card shadow">

        <div className="card-header bg-success text-white">
          Today's Appointments
        </div>

        <div className="card-body">

          {appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <div className="table-responsive">

              <table className="table table-striped">

                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {appointments.map((appointment) => (

                    <tr key={appointment.id}>
                      <td>{appointment.patientName}</td>
                      <td>{appointment.appointmentDate}</td>
                      <td>{appointment.appointmentTime}</td>
                      <td>{appointment.reason}</td>
                      <td>{appointment.status}</td>
                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default DoctorDashboard;