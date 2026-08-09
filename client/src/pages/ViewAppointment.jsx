import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function ViewAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Logged-in doctor
  const doctor = JSON.parse(localStorage.getItem("user"));

  const [appointment, setAppointment] = useState(null);

  const [formData, setFormData] = useState({
    diagnosis: "",
    prescription: "",
    notes: "",
  });

  useEffect(() => {
    loadAppointment();
  }, []);

  const loadAppointment = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointment(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load appointment");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveMedicalRecord = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/medical-records",
        {
          patientName: appointment.patientName,
          doctor: doctor.fullName,
          diagnosis: formData.diagnosis,
          prescription: formData.prescription,
          notes: formData.notes,
          visitDate: new Date().toISOString().split("T")[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Medical record saved successfully!");

      navigate("/doctor-dashboard");
    } catch (err) {
      console.log(err);
      toast.error("Failed to save medical record");
    }
  };

  if (!appointment) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading appointment...</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="card shadow-lg border-0">

        <div className="card-header bg-success text-white">
          <h3 className="mb-0">🩺 Appointment Details</h3>
        </div>

        <div className="card-body">

          <div className="mb-4">

            <h5 className="text-primary">Patient Information</h5>

            <hr />

            <p><strong>Patient:</strong> {appointment.patientName}</p>

            <p><strong>Doctor:</strong> {appointment.doctor}</p>

            <p><strong>Date:</strong> {appointment.appointmentDate}</p>

            <p><strong>Time:</strong> {appointment.appointmentTime}</p>

            <p><strong>Reason:</strong> {appointment.reason}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`badge ${
                  appointment.status === "Approved"
                    ? "bg-success"
                    : appointment.status === "Rejected"
                    ? "bg-danger"
                    : "bg-warning text-dark"
                }`}
              >
                {appointment.status}
              </span>
            </p>

          </div>

          <hr />

          <h5 className="text-primary mb-3">
            Create Medical Record
          </h5>

          <form onSubmit={saveMedicalRecord}>

            <div className="mb-3">
              <label className="form-label">
                Diagnosis
              </label>

              <textarea
                className="form-control"
                rows="3"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Prescription
              </label>

              <textarea
                className="form-control"
                rows="3"
                name="prescription"
                value={formData.prescription}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Clinical Notes
              </label>

              <textarea
                className="form-control"
                rows="4"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
            >
              💾 Save Medical Record
            </button>

            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => navigate("/doctor-dashboard")}
            >
              ← Back
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ViewAppointment;