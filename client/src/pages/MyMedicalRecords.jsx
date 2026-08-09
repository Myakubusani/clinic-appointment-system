import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function MyMedicalRecords() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // ========================================
  // Fetch patient's medical records
  // ========================================
  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again.");

        navigate("/login");
        return;
      }

      const res = await API.get(
        "/medical-records/my-records",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "My Medical Records:",
        res.data
      );

      setRecords(res.data);

    } catch (err) {
      console.log(
        "Medical Records Error:",
        err
      );

      if (err.response?.status === 401) {
        toast.error(
          "Your session has expired. Please login again."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/login");

        return;
      }

      if (err.response?.status === 403) {
        toast.error(
          "You are not allowed to view these records."
        );

        return;
      }

      toast.error(
        err.response?.data?.message ||
        "Failed to load medical records"
      );

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Patient information
  // ========================================
  if (!user) {
    return (
      <div className="container py-5">

        <div className="alert alert-warning shadow-sm">

          <h5>
            👤 Patient information not found
          </h5>

          <p className="mb-3">
            Please login again to view your
            medical records.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="container py-5">

      {/* ========================================
          HEADER
      ======================================== */}
      <div className="card shadow-lg border-0 mb-4">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h2 className="text-primary mb-2">
                🩺 My Medical Records
              </h2>

              <p className="text-muted mb-0">
                Your medical history, diagnosis,
                prescriptions and doctor's notes.
              </p>

            </div>

            <div>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                ← Dashboard
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================
          PATIENT INFORMATION
      ======================================== */}
      <div className="card shadow-sm border-0 mb-4">

        <div className="card-header bg-primary text-white">

          <h5 className="mb-0">
            👤 Patient Information
          </h5>

        </div>

        <div className="card-body">

          <div className="row">

            <div className="col-md-4 mb-3">

              <strong>
                Full Name
              </strong>

              <p className="mb-0">
                {user.fullName || "Not provided"}
              </p>

            </div>

            <div className="col-md-4 mb-3">

              <strong>
                Email
              </strong>

              <p className="mb-0">
                {user.email || "Not provided"}
              </p>

            </div>

            <div className="col-md-4 mb-3">

              <strong>
                Phone
              </strong>

              <p className="mb-0">
                {user.phone || "Not provided"}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================
          LOADING
      ======================================== */}
      {loading && (
        <div className="text-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mt-3 text-muted">
            Loading your medical records...
          </p>

        </div>
      )}

      {/* ========================================
          NO RECORDS
      ======================================== */}
      {!loading && records.length === 0 && (

        <div className="alert alert-info shadow-sm">

          <h5>
            📋 No Medical Records Found
          </h5>

          <p className="mb-0">
            You don't have any medical records
            yet. Your doctor will add them after
            your medical consultation.
          </p>

        </div>

      )}

      {/* ========================================
          MEDICAL RECORDS
      ======================================== */}
      {!loading && records.length > 0 && (

        <div>

          <div className="d-flex justify-content-between align-items-center mb-3">

            <h4>
              📋 Medical History
            </h4>

            <span className="badge bg-primary fs-6">
              {records.length}{" "}
              {records.length === 1
                ? "Record"
                : "Records"}
            </span>

          </div>

          <div className="row g-4">

            {records.map((record) => (

              <div
                className="col-md-6"
                key={record.id}
              >

                <div className="card shadow border-0 h-100">

                  {/* Record Header */}
                  <div className="card-header bg-success text-white">

                    <div className="d-flex justify-content-between align-items-center">

                      <h5 className="mb-0">
                        🩺 Medical Record
                      </h5>

                      <span className="badge bg-light text-dark">
                        #{record.id}
                      </span>

                    </div>

                  </div>

                  {/* Record Body */}
                  <div className="card-body">

                    {/* Doctor */}
                    <div className="mb-3">

                      <h6 className="text-primary">
                        👨‍⚕️ Doctor
                      </h6>

                      <p className="mb-0">
                        {record.doctor ||
                          "Not provided"}
                      </p>

                    </div>

                    {/* Visit Date */}
                    <div className="mb-3">

                      <h6 className="text-primary">
                        📅 Visit Date
                      </h6>

                      <p className="mb-0">
                        {record.visitDate ||
                          "Not provided"}
                      </p>

                    </div>

                    <hr />

                    {/* Diagnosis */}
                    <div className="mb-3">

                      <h6 className="text-primary">
                        🩺 Diagnosis
                      </h6>

                      <div className="bg-light p-3 rounded">

                        <p className="mb-0">
                          {record.diagnosis ||
                            "Not provided"}
                        </p>

                      </div>

                    </div>

                    {/* Prescription */}
                    <div className="mb-3">

                      <h6 className="text-primary">
                        💊 Prescription
                      </h6>

                      <div className="bg-light p-3 rounded">

                        <p className="mb-0">
                          {record.prescription ||
                            "Not provided"}
                        </p>

                      </div>

                    </div>

                    {/* Notes */}
                    <div className="mb-3">

                      <h6 className="text-primary">
                        📝 Clinical Notes
                      </h6>

                      <div className="bg-light p-3 rounded">

                        <p className="mb-0">
                          {record.notes ||
                            "No clinical notes provided"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Footer */}
                  <div className="card-footer bg-white border-0">

                    <small className="text-muted">
                      🔒 This medical record is
                      private and can only be
                      viewed by authorized users.
                    </small>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

      {/* ========================================
          BACK BUTTON
      ======================================== */}
      <div className="mt-4">

        <button
          className="btn btn-secondary"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default MyMedicalRecords;