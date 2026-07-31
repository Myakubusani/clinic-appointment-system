import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import { toast } from "react-toastify";

function ManageMedicalRecords() {
  const [records, setRecords] = useState([]);
const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    patientName: "",
    doctor: "",
    diagnosis: "",
    prescription: "",
    notes: "",
    visitDate: "",
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await API.get("/medical-records");
      setRecords(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load medical records");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addRecord = async (e) => {
    e.preventDefault();

    try {
      await API.post("/medical-records", formData);

toast.success("Medical record added successfully!");
      setFormData({
        patientName: "",
        doctor: "",
        diagnosis: "",
        prescription: "",
        notes: "",
        visitDate: "",
      });

      fetchRecords();
    } catch (err) {
      console.log(err);
      toast.error("Failed to add medical record");
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this medical record?")) return;

    try {
      await API.delete(`/medical-records/${id}`);

      alert("Medical record deleted!");

      fetchRecords();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete record");
    }
  };

  return (
    <AdminLayout>
      <h2 className="mb-4">
  🩺 Medical Records
</h2>


      <form onSubmit={addRecord} className="card shadow p-4 mb-4">
        <input
        className="form-control"
          type="text"
          name="patientName"
          placeholder="Patient Name"
          value={formData.patientName}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          className="form-control"
          type="text"
          name="doctor"
          placeholder="Doctor"
          value={formData.doctor}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
            className="form-control"
          type="text"
          name="diagnosis"
          placeholder="Diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          className="form-control"
          type="text"
          name="prescription"
          placeholder="Prescription"
          value={formData.prescription}
          onChange={handleChange}
          required
        />

        <br /><br />

        <textarea
          className="form-control"
          name="notes"
          placeholder="Doctor's Notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <br /><br />

        <input
          className="form-control"
          type="date"
          name="visitDate"
          value={formData.visitDate}
          onChange={handleChange}
          required
        />

        <br /><br />

        <button
  type="submit"
  className="btn btn-success"
>
  💾 Save Medical Record
</button>
      </form>

      <hr />

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
            <th>Patient</th>
            <th>Doctor</th>
            <th>Diagnosis</th>
            <th>Prescription</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {records
    .filter(
      (record) =>
        record.patientName.toLowerCase().includes(search.toLowerCase()) ||
        record.doctor.toLowerCase().includes(search.toLowerCase())
    )
    .map((record) => (
      <tr key={record.id}>
        <td>{record.patientName}</td>
        <td>{record.doctor}</td>
        <td>{record.diagnosis}</td>
        <td>{record.prescription}</td>
        <td>{record.visitDate}</td>
        <td>
                <button
  className="btn btn-danger btn-sm"
  onClick={() => deleteRecord(record.id)}
>
  🗑 Delete
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

export default ManageMedicalRecords;