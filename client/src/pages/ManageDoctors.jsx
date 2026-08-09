import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
import { toast } from "react-toastify";

function ManageDoctors() {
  const [search, setSearch] = useState("");

  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    specialization: "",
    email: "",
    phone: "",
    password: "",
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
      toast.error("Failed to load doctors");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addDoctor = async (e) => {
    e.preventDefault();

    try {
      await API.post("/doctors", formData);

      toast.success("Doctor added successfully!");

      setFormData({
        fullName: "",
        specialization: "",
        email: "",
        phone: "",
        password: "",
      });

      fetchDoctors();
    } catch (err) {
      console.log(err);
      toast.error("Failed to add doctor");
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;

    try {
      await API.delete(`/doctors/${id}`);

      toast.success("Doctor deleted successfully!");

      fetchDoctors();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete doctor");
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.fullName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      doctor.specialization
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h2 className="mb-4">🩺 Manage Doctors</h2>

      <form onSubmit={addDoctor} className="card p-4 shadow mb-4">

        <input
          className="form-control"
          type="text"
          name="fullName"
          placeholder="Doctor Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <br />

        <input
          className="form-control"
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
        />

        <br />

        <input
          className="form-control"
          type="email"
          name="email"
          placeholder="Doctor Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <br />

        <input
          className="form-control"
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <br />

        <input
          className="form-control"
          type="password"
          name="password"
          placeholder="Temporary Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <br />

        <button className="btn btn-primary" type="submit">
          Add Doctor
        </button>

      </form>

      <hr />

      <div className="mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="🔍 Search doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">

          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id}>

                <td>{doctor.fullName}</td>

                <td>{doctor.specialization}</td>

                <td>{doctor.email}</td>

                <td>{doctor.phone}</td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteDoctor(doctor.id)}
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

export default ManageDoctors;