import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import { toast } from "react-toastify";

function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.log(err);
      toast.error(
      err.response?.data?.message ||
      "Failed to load patients"
      );
    }
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient?")) return;

    try {
      await API.delete(`/patients/${id}`);

    toast.success("Patient deleted successfully!");      
    fetchPatients();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete patient");
    }
  };

  return (
  <AdminLayout>
      <h2 className="mb-4">
  👥 Manage Patients
</h2>

<div className="mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="🔍 Search patient by name or email..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>

      <div className="table-responsive">
  <table className="table table-striped table-hover table-bordered align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {patients
  .filter(
    (patient) =>
      patient.fullName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      patient.email
        .toLowerCase()
        .includes(search.toLowerCase())
  )
  .map((patient) => (
            <tr key={patient.id}>
              <td>{patient.fullName}</td>
              <td>{patient.email}</td>
              <td>{patient.phone}</td>
              <td>
                <button onClick={() => deletePatient(patient.id)} className="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
    </AdminLayout>
  );
}

export default ManagePatients;