import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function DoctorMedicalRecords() {
  const navigate = useNavigate();

  const doctor = JSON.parse(localStorage.getItem("user"));

  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    patientName: "",
    diagnosis: "",
    prescription: "",
    notes: "",
    visitDate: new Date().toISOString().split("T")[0],
  });

  // =====================================================
  // LOAD DATA
  // =====================================================
  useEffect(() => {
    loadPatients();
    loadMedicalRecords();
  }, []);

  // =====================================================
  // LOAD PATIENTS
  // =====================================================
  const loadPatients = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatients(res.data);
    } catch (err) {
      console.log("Failed to load patients:", err);
      toast.error("Failed to load patients");
    }
  };

  // =====================================================
  // LOAD MEDICAL RECORDS
  // =====================================================
  const loadMedicalRecords = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    console.log("=================================");
    console.log("🩺 LOADING MEDICAL RECORDS");
    console.log("Token exists:", !!token);
    console.log("Token:", token);
    console.log("=================================");

    const res = await API.get("/medical-records", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Medical records response:");
    console.log(res.data);

    setRecords(res.data);

  } catch (err) {

    console.log("=================================");
    console.log("❌ MEDICAL RECORD ERROR");
    console.log("Status:", err.response?.status);
    console.log("Response:", err.response?.data);
    console.log("Message:", err.message);
    console.log("Full error:", err);
    console.log("=================================");

    toast.error(
      err.response?.data?.message ||
      "Failed to load medical records"
    );

  } finally {
    setLoading(false);
  }
};

  // =====================================================
  // HANDLE INPUT
  // =====================================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // ADD MEDICAL RECORD
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientName) {
      toast.error("Please select a patient");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/medical-records",
        {
          patientName: formData.patientName,
          doctor: doctor?.fullName || "Doctor",
          diagnosis: formData.diagnosis,
          prescription: formData.prescription,
          notes: formData.notes,
          visitDate: formData.visitDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Medical record added successfully!");

      // Reset form
      setFormData({
        patientName: "",
        diagnosis: "",
        prescription: "",
        notes: "",
        visitDate: new Date().toISOString().split("T")[0],
      });

      // Reload records
      loadMedicalRecords();
    } catch (err) {
      console.log("Add medical record error:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed to add medical record"
      );
    }
  };

  // =====================================================
  // DELETE RECORD
  // =====================================================
  const deleteRecord = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medical record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/medical-records/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Medical record deleted successfully!");

      loadMedicalRecords();
    } catch (err) {
      console.log("Delete record error:", err);

      toast.error("Failed to delete medical record");
    }
  };

  // =====================================================
  // FILTER RECORDS
  // =====================================================
  const filteredRecords = records.filter((record) =>
    record.patientName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // =====================================================
  // RETURN
  // =====================================================
  return (
    <div className="container py-4">

      {/* =================================================
          HEADER
      ================================================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2>🩺 Medical Records</h2>

          <p className="text-muted mb-0">
            Manage your patients' medical records
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/doctor-dashboard")}
        >
          ← Dashboard
        </button>

      </div>

      {/* =================================================
          ADD MEDICAL RECORD
      ================================================= */}
      <div className="card shadow border-0 mb-4">

        <div className="card-header bg-success text-white">
          <h5 className="mb-0">
            ➕ Add Medical Record
          </h5>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            {/* Patient */}
            <div className="mb-3">

              <label className="form-label">
                Patient
              </label>

              <select
                className="form-select"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Patient
                </option>

                {patients.map((patient) => (
                  <option
                    key={patient.id}
                    value={patient.fullName}
                  >
                    {patient.fullName}
                  </option>
                ))}

              </select>

            </div>

            {/* Diagnosis */}
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
                placeholder="Enter diagnosis..."
                required
              />

            </div>

            {/* Prescription */}
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
                placeholder="Enter prescription..."
                required
              />

            </div>

            {/* Clinical Notes */}
            <div className="mb-3">

              <label className="form-label">
                Clinical Notes
              </label>

              <textarea
                className="form-control"
                rows="3"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter additional clinical notes..."
              />

            </div>

            {/* Visit Date */}
            <div className="mb-3">

              <label className="form-label">
                Visit Date
              </label>

              <input
                type="date"
                className="form-control"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleChange}
                required
              />

            </div>

            <button
              type="submit"
              className="btn btn-success"
            >
              💾 Save Medical Record
            </button>

          </form>

        </div>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}
      <div className="card shadow border-0 mb-4">

        <div className="card-body">

          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search records by patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* =================================================
          MEDICAL RECORDS
      ================================================= */}
      <div className="card shadow border-0">

        <div className="card-header bg-primary text-white">

          <h5 className="mb-0">
            📋 Medical Records
          </h5>

        </div>

        <div className="card-body">

          {loading ? (

            <div className="text-center py-4">

              <div
                className="spinner-border text-primary"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="mt-2">
                Loading medical records...
              </p>

            </div>

          ) : filteredRecords.length === 0 ? (

            <div className="alert alert-info mb-0">
              No medical records found.
            </div>

          ) : (

            <div className="row g-4">

              {filteredRecords.map((record) => (

                <div
                  className="col-md-6"
                  key={record.id}
                >

                  <div className="card shadow-sm border-0 h-100">

                    <div className="card-header bg-light">

                      <div className="d-flex justify-content-between align-items-center">

                        <strong>
                          👤 {record.patientName}
                        </strong>

                        <span className="badge bg-primary">
                          {record.visitDate}
                        </span>

                      </div>

                    </div>

                    <div className="card-body">

                      <p>
                        <strong>Doctor:</strong>{" "}
                        {record.doctor || "Not provided"}
                      </p>

                      <hr />

                      <h6 className="text-primary">
                        Diagnosis
                      </h6>

                      <p>
                        {record.diagnosis || "Not provided"}
                      </p>

                      <h6 className="text-success">
                        Prescription
                      </h6>

                      <p>
                        {record.prescription || "Not provided"}
                      </p>

                      <h6 className="text-secondary">
                        Clinical Notes
                      </h6>

                      <p>
                        {record.notes ||
                          "No clinical notes provided"}
                      </p>

                    </div>

                    

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default DoctorMedicalRecords;