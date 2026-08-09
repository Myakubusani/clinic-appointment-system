import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function Login() {
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

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);

      console.log("Login Response:", res.data);

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // Save token
      localStorage.setItem("token", res.data.token);

      // Save role
      localStorage.setItem("role", res.data.role);

      // If the logged-in user is a patient,
      // also save the patient information separately.
      if (res.data.role === "patient") {
        localStorage.setItem(
          "patient",
          JSON.stringify(res.data.user)
        );
      } else {
        // Remove old patient data when another role logs in
        localStorage.removeItem("patient");
      }

      toast.success("Login successful!");

      // Redirect according to role
      switch (res.data.role) {
        case "admin":
          navigate("/admin");
          break;

        case "doctor":
          navigate("/doctor-dashboard");
          break;

        case "patient":
          navigate("/dashboard");
          break;

        default:
          navigate("/login");
          break;
      }

    } catch (err) {
      console.log("Login Error:", err);

      toast.error(
        err.response?.data?.message ||
        "Invalid email or password"
      );
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0d6efd, #0a58ca)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "400px",
          borderRadius: "15px",
        }}
      >

        <div className="text-center mb-4">

          <h1>🏥</h1>

          <h3>ClinicCare Login</h3>

          <p className="text-muted">
            Login as Patient, Doctor or Administrator
          </p>

        </div>

        <form onSubmit={login}>

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
            className="btn btn-primary w-100"
            type="submit"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-3">

          Don't have a patient account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;