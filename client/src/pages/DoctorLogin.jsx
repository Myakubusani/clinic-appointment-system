import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function DoctorLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loginDoctor = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/doctors/login", formData);

      localStorage.setItem("doctor", JSON.stringify(res.data.doctor));
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "doctor");

      toast.success("Doctor login successful!");

      navigate("/doctor-dashboard");
    } catch (err) {
      console.log(err);
      toast.error("Invalid email or password");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#198754,#0f5132)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "420px", borderRadius: "15px" }}
      >
        <div className="text-center mb-4">
          <h1>👨‍⚕️</h1>
          <h3>Doctor Login</h3>
          <p className="text-muted">
            Welcome back, Doctor
          </p>
        </div>

        <form onSubmit={loginDoctor}>

          <div className="mb-3">
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="btn btn-success w-100"
            type="submit"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-3">
          <Link to="/">Back to Home</Link>
        </p>

      </div>
    </div>
  );
}

export default DoctorLogin;