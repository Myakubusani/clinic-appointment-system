import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import { toast } from "react-toastify";

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/medical-records", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecords(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load medical records");
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this medical record?")) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/medical-records/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Medical record deleted successfully");

      fetchRecords();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete record");
    }
  };

  const filteredRecords = records.filter((record) =>
    record.patientName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <AdminLayout>

      <h2 className="mb-4">
        🩺 Medical Records
      </h2>

      <div className="mb-3">

        <input
          className="form-control"
          placeholder="🔍 Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="table-responsive">

        <table className="table table-striped table-hover">

          <thead className="table-primary">

            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Diagnosis</th>
              <th>Prescription</th>
              <th>Notes</th>
              <th>Visit Date</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredRecords.map((record) => (

              <tr key={record.id}>

                <td>{record.patientName}</td>

                <td>{record.doctor}</td>

                <td>{record.diagnosis}</td>

                <td>{record.prescription}</td>

                <td>{record.notes}</td>

                <td>{record.visitDate}</td>

                <td>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteRecord(record.id)}
                  >
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

export default MedicalRecords;