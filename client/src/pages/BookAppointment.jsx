import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function BookAppointment() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);

 const patient = JSON.parse(localStorage.getItem("patient"));

const [formData, setFormData] = useState({
  patientName: patient?.fullName || "",
  email: patient?.email || "",
  doctor: "",
  appointmentDate: "",
  appointmentTime: "",
  reason: "",
});

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/appointments/book", formData);

      toast.success(res.data.message);

      setFormData({
  patientName: patient?.fullName || "",
  email: patient?.email || "",
  doctor: "",
  appointmentDate: "",
  appointmentTime: "",
  reason: "",
});

    } catch (err) {
      console.log(err);
      toast.error("Failed to book appointment");
    }
  };

  return (
    <div className="container py-5">

      <div className="card shadow-lg border-0 mx-auto" style={{ maxWidth: "700px" }}>

        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">📅 Book Appointment</h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Patient Name</label>
              <input
                className="form-control"
                type="text"
                name="patientName"
                value={formData.patientName}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Select Doctor</label>
              <select
                className="form-select"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
              >
                <option value="">Choose Doctor</option>

                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name} ({doctor.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">Appointment Date</label>

                <input
                  className="form-control"
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Appointment Time</label>

                <input
                  className="form-control"
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="mb-3">
              <label className="form-label">
                Reason for Appointment
              </label>

              <textarea
                className="form-control"
                rows="4"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe your symptoms or reason..."
              />
            </div>

            <div className="d-flex justify-content-between">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/dashboard")}
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