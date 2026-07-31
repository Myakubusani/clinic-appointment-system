import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div
      className="bg-primary text-white p-3"
      style={{
        width: "250px",
        minHeight: "100vh",
      }}
    >
      <h3 className="text-center mb-4">
        🏥 Clinic HMS
      </h3>

      <NavLink
        to="/admin"
        className="btn btn-primary w-100 text-start mb-2"
      >
        📊 Dashboard
      </NavLink>

      <NavLink
        to="/manage-patients"
        className="btn btn-primary w-100 text-start mb-2"
      >
        👥 Patients
      </NavLink>

      <NavLink
        to="/manage-doctors"
        className="btn btn-primary w-100 text-start mb-2"
      >
        👨‍⚕️ Doctors
      </NavLink>

      <NavLink
        to="/manage-appointments"
        className="btn btn-primary w-100 text-start mb-2"
      >
        📅 Appointments
      </NavLink>

      <NavLink
        to="/medical-records"
        className="btn btn-primary w-100 text-start mb-2"
      >
        🩺 Medical Records
      </NavLink>
    </div>
  );
}

export default Sidebar;