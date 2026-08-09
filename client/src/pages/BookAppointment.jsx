import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function BookAppointment() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);

  // Get logged-in patient
  const patient = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    patientName: patient?.fullName || "",
    email: patient?.email || "",
    doctor: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  // Separate time fields
  const [timeData, setTimeData] = useState({
    hour: "",
    minute: "",
    period: "AM",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  // =============================
  // Fetch Doctors
  // =============================
  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load doctors");
    }
  };

  // =============================
  // Handle Form Changes
  // =============================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =============================
  // Handle Time Changes
  // =============================
  const handleTimeChange = (e) => {
    setTimeData({
      ...timeData,
      [e.target.name]: e.target.value,
    });
  };

  // =============================
  // Submit Appointment
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure time has been selected
    if (!timeData.hour || !timeData.minute || !timeData.period) {
      toast.error("Please select appointment time");
      return;
    }

    // Combine time
    const formattedTime = `${timeData.hour}:${timeData.minute} ${timeData.period}`;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      const appointmentData = {
        ...formData,
        appointmentTime: formattedTime,
      };

      const res = await API.post(
        "/appointments/book",
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      // Reset form
      setFormData({
        patientName: patient?.fullName || "",
        email: patient?.email || "",
        doctor: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
      });

      setTimeData({
        hour: "",
        minute: "",
        period: "AM",
      });

      navigate("/appointments");

    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message ||
        "Failed to book appointment"
      );
    }
  };

  return (
    <div className="container py-5">

      <div
        className="card shadow-lg border-0 mx-auto"
        style={{ maxWidth: "700px" }}
      >

        {/* Header */}
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            📅 Book Appointment
          </h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            {/* Patient Name */}
            <div className="mb-3">

              <label className="form-label">
                Patient Name
              </label>

              <input
                className="form-control"
                value={formData.patientName}
                readOnly
              />

            </div>

            {/* Doctor */}
            <div className="mb-3">

              <label className="form-label">
                Select Doctor
              </label>

              <select
                className="form-select"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
              >

                <option value="">
                  Choose Doctor
                </option>

                {doctors.map((doctor) => (

                  <option
                    key={doctor.id}
                    value={doctor.fullName}
                  >
                    {doctor.fullName} (
                    {doctor.specialization}
                    )
                  </option>

                ))}

              </select>

            </div>

            {/* Date and Time */}
            <div className="row">

              {/* Date */}
              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Appointment Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* Time */}
              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Appointment Time
                </label>

                <div className="row g-2">

                  {/* Hour */}
                  <div className="col-4">

                    <select
                      className="form-select"
                      name="hour"
                      value={timeData.hour}
                      onChange={handleTimeChange}
                      required
                    >

                      <option value="">
                        Hour
                      </option>

                      {Array.from(
                        { length: 12 },
                        (_, i) => {
                          const hour = String(
                            i + 1
                          ).padStart(2, "0");

                          return (
                            <option
                              key={hour}
                              value={hour}
                            >
                              {hour}
                            </option>
                          );
                        }
                      )}

                    </select>

                  </div>

                  {/* Minute */}
                  <div className="col-4">

                    <select
                      className="form-select"
                      name="minute"
                      value={timeData.minute}
                      onChange={handleTimeChange}
                      required
                    >

                      <option value="">
                        Min
                      </option>

                      {Array.from(
                        { length: 60 },
                        (_, i) => {
                          const minute = String(
                            i
                          ).padStart(2, "0");

                          return (
                            <option
                              key={minute}
                              value={minute}
                            >
                              {minute}
                            </option>
                          );
                        }
                      )}

                    </select>

                  </div>

                  {/* AM / PM */}
                  <div className="col-4">

                    <select
                      className="form-select"
                      name="period"
                      value={timeData.period}
                      onChange={handleTimeChange}
                      required
                    >

                      <option value="AM">
                        AM
                      </option>

                      <option value="PM">
                        PM
                      </option>

                    </select>

                  </div>

                </div>

              </div>

            </div>

            {/* Selected Time Preview */}
            {timeData.hour &&
              timeData.minute && (
                <div className="alert alert-info">

                  🕐 Selected Time:{" "}

                  <strong>
                    {timeData.hour}:
                    {timeData.minute}{" "}
                    {timeData.period}
                  </strong>

                </div>
              )}

            {/* Reason */}
            <div className="mt-3">

              <label className="form-label">
                Reason for Appointment
              </label>

              <textarea
                rows="4"
                className="form-control"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe the reason for your appointment..."
              />

            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-between mt-4">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                ← Back
              </button>

              <button
                type="submit"
                className="btn btn-primary"
              >
                📅 Book Appointment
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default BookAppointment;