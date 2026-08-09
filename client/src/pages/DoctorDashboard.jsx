import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function DoctorDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // GET DOCTOR FROM LOCAL STORAGE
  // =====================================================

  const getStoredDoctor = () => {
    try {
      const storedDoctor = localStorage.getItem("doctor");

      console.log(
        "DOCTOR FROM LOCAL STORAGE:",
        storedDoctor
      );

      if (storedDoctor) {
        const parsedDoctor = JSON.parse(storedDoctor);

        console.log(
          "PARSED DOCTOR:",
          parsedDoctor
        );

        console.log(
          "SPECIALIZATION:",
          parsedDoctor?.specialization
        );

        return parsedDoctor;
      }

      // Fallback to user
      const storedUser = localStorage.getItem("user");

      console.log(
        "USER FROM LOCAL STORAGE:",
        storedUser
      );

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        console.log(
          "PARSED USER:",
          parsedUser
        );

        console.log(
          "USER SPECIALIZATION:",
          parsedUser?.specialization
        );

        return parsedUser;
      }

      return null;

    } catch (error) {

      console.error(
        "ERROR READING DOCTOR FROM LOCAL STORAGE:",
        error
      );

      return null;
    }
  };


  // =====================================================
  // STATE
  // =====================================================

  const [doctor, setDoctor] = useState(
    getStoredDoctor()
  );

  const [appointments, setAppointments] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // LOAD APPOINTMENTS
  // =====================================================

  const loadAppointments = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    console.log("================================");
    console.log("🔄 LOADING DOCTOR APPOINTMENTS");
    console.log("TOKEN EXISTS:", !!token);
    console.log("DOCTOR:", doctor);
    console.log("DOCTOR ID:", doctor?.id);
    console.log("DOCTOR NAME:", doctor?.fullName);
    console.log("SPECIALIZATION:", doctor?.specialization);
    console.log("================================");

    if (!token) {
      toast.error("You are not logged in.");
      navigate("/doctor-login");
      return;
    }

    if (!doctor?.id) {
      toast.error("Doctor information is missing.");
      return;
    }

    const res = await API.get(
      "/doctors/appointments",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("================================");
    console.log("✅ APPOINTMENTS RESPONSE:");
    console.log(res.data);
    console.log("================================");

    setAppointments(res.data);
  } catch (err) {
    console.log("================================");
    console.log("❌ APPOINTMENTS ERROR");
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);
    console.log("MESSAGE:", err.message);
    console.log("================================");

    toast.error(
      err.response?.data?.message ||
      "Failed to load appointments"
    );
  } finally {
    setLoading(false);
  }
};


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("doctor");
    localStorage.removeItem("patient");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    toast.success(
      "Logged out successfully"
    );

    navigate("/login");
  };


  // =====================================================
  // TODAY'S DATE
  // =====================================================

  const today = new Date();

  const todayString =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");


  // =====================================================
  // TODAY'S APPOINTMENTS
  // =====================================================

  const todaysAppointments =
    appointments.filter(
      (appointment) =>
        appointment.appointmentDate ===
        todayString
    );


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredAppointments =
    appointments.filter(
      (appointment) =>
        appointment.patientName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );


  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusBadge = (status) => {

    switch (status) {

      case "Approved":
        return "badge bg-success";

      case "Rejected":
        return "badge bg-danger";

      case "Pending":
        return "badge bg-warning text-dark";

      default:
        return "badge bg-secondary";
    }
  };


  // =====================================================
  // NO DOCTOR
  // =====================================================

  if (!doctor) {

    return (

      <div className="container py-5">

        <div className="alert alert-warning">

          <h5>
            Doctor information not found
          </h5>

          <p>
            Please login again to access
            your dashboard.
          </p>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/doctor-login")
            }
          >
            Go to Doctor Login
          </button>

        </div>

      </div>
    );
  }


  // =====================================================
  // SPECIALIZATION
  // =====================================================

  const specialization =
    doctor.specialization ||
    doctor.specializationName ||
    "Not provided";


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="container py-4">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2>
            👨‍⚕️ Doctor Dashboard
          </h2>

          <p className="text-muted mb-0">

            Welcome, Dr.{" "}

            {doctor.fullName}

          </p>

        </div>


        <button
          className="btn btn-danger"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </div>


      {/* =================================================
          DOCTOR INFORMATION
      ================================================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-header bg-primary text-white">

          <h5 className="mb-0">
            👨‍⚕️ Doctor Information
          </h5>

        </div>


        <div className="card-body">

          <div className="row">

            {/* FULL NAME */}

            <div className="col-md-4 mb-3">

              <strong>
                Full Name
              </strong>

              <p className="mb-0">

                Dr.{" "}

                {doctor.fullName}

              </p>

            </div>


            {/* SPECIALIZATION */}

            <div className="col-md-4 mb-3">

              <strong>
                Specialization
              </strong>

              <p className="mb-0">

                {specialization}

              </p>

            </div>


            {/* EMAIL */}

            <div className="col-md-4 mb-3">

              <strong>
                Email
              </strong>

              <p className="mb-0">

                {doctor.email ||
                  "Not provided"}

              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="row g-4 mb-4">


        {/* TOTAL */}

        <div className="col-md-3">

          <div className="card shadow border-0 text-center h-100">

            <div className="card-body">

              <h1 className="text-primary">

                {appointments.length}

              </h1>

              <h6>
                Total Appointments
              </h6>

            </div>

          </div>

        </div>


        {/* TODAY */}

        <div className="col-md-3">

          <div className="card shadow border-0 text-center h-100">

            <div className="card-body">

              <h1 className="text-info">

                {todaysAppointments.length}

              </h1>

              <h6>
                Today's Appointments
              </h6>

            </div>

          </div>

        </div>


        {/* PENDING */}

        <div className="col-md-3">

          <div className="card shadow border-0 text-center h-100">

            <div className="card-body">

              <h1 className="text-warning">

                {
                  appointments.filter(
                    (appointment) =>
                      appointment.status ===
                      "Pending"
                  ).length
                }

              </h1>

              <h6>
                Pending
              </h6>

            </div>

          </div>

        </div>


        {/* APPROVED */}

        <div className="col-md-3">

          <div className="card shadow border-0 text-center h-100">

            <div className="card-body">

              <h1 className="text-success">

                {
                  appointments.filter(
                    (appointment) =>
                      appointment.status ===
                      "Approved"
                  ).length
                }

              </h1>

              <h6>
                Approved
              </h6>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <div className="card shadow border-0 mb-4">

        <div className="card-body">

          <div className="d-flex flex-wrap gap-2">

            <button
              className="btn btn-primary"
              onClick={loadAppointments}
            >
              🔄 Refresh Appointments
            </button>


            <button
              className="btn btn-success"
              onClick={() =>
                navigate(
                  "/doctor/medical-records"
                )
              }
            >
              🩺 Medical Records
            </button>

          </div>

        </div>

      </div>


      {/* =================================================
          TODAY'S APPOINTMENTS
      ================================================= */}

      <div className="card shadow border-0 mb-4">

        <div className="card-header bg-info text-white">

          <h5 className="mb-0">
            📅 Today's Appointments
          </h5>

        </div>


        <div className="card-body">

          {todaysAppointments.length === 0 ? (

            <div className="alert alert-light mb-0">

              No appointments scheduled
              for today.

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>

                  <tr>

                    <th>
                      Patient
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

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {todaysAppointments.map(
                    (appointment) => (

                      <tr
                        key={
                          appointment.id
                        }
                      >

                        <td>
                          {
                            appointment.patientName
                          }
                        </td>

                        <td>
                          {
                            appointment.appointmentTime
                          }
                        </td>

                        <td>
                          {
                            appointment.reason ||
                            "Not provided"
                          }
                        </td>

                        <td>

                          <span
                            className={
                              getStatusBadge(
                                appointment.status
                              )
                            }
                          >

                            {
                              appointment.status
                            }

                          </span>

                        </td>

                        <td>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              navigate(
                                `/view-appointment/${appointment.id}`
                              )
                            }
                          >
                            View
                          </button>

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


      {/* =================================================
          ALL APPOINTMENTS
      ================================================= */}

      <div className="card shadow border-0">

        <div className="card-header bg-success text-white">

          <h5 className="mb-0">
            📋 My Appointments
          </h5>

        </div>


        <div className="card-body">

          {/* SEARCH */}

          <div className="d-flex justify-content-between mb-3">

            <input
              type="text"
              className="form-control"
              style={{
                maxWidth: "400px",
              }}
              placeholder="🔍 Search patient..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />


            <button
              className="btn btn-outline-primary"
              onClick={loadAppointments}
            >
              🔄 Refresh
            </button>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="text-center py-4">

              <div
                className="spinner-border text-primary"
                role="status"
              />

              <p className="mt-2">
                Loading appointments...
              </p>

            </div>

          )}


          {/* NO APPOINTMENTS */}

          {!loading &&
            filteredAppointments.length ===
              0 && (

              <div className="alert alert-info">

                No appointments found.

              </div>

            )}


          {/* APPOINTMENT TABLE */}

          {!loading &&
            filteredAppointments.length >
              0 && (

              <div className="table-responsive">

                <table className="table table-striped table-hover align-middle">

                  <thead>

                    <tr>

                      <th>
                        Patient
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

                      <th>
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredAppointments.map(
                      (appointment) => (

                        <tr
                          key={
                            appointment.id
                          }
                        >

                          <td>
                            {
                              appointment.patientName
                            }
                          </td>

                          <td>
                            {
                              appointment.appointmentDate
                            }
                          </td>

                          <td>
                            {
                              appointment.appointmentTime
                            }
                          </td>

                          <td>
                            {
                              appointment.reason ||
                              "Not provided"
                            }
                          </td>

                          <td>

                            <span
                              className={
                                getStatusBadge(
                                  appointment.status
                                )
                              }
                            >

                              {
                                appointment.status
                              }

                            </span>

                          </td>

                          <td>

                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                navigate(
                                  `/view-appointment/${appointment.id}`
                                )
                              }
                            >
                              👁️ View
                            </button>

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

    </div>
  );
}

export default DoctorDashboard;