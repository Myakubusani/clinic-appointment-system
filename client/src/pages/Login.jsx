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
      const res = await API.post("/login", formData);

      localStorage.setItem(
        "patient",
        JSON.stringify(res.data.patient)
      );
      localStorage.setItem(
        "token", res.data.token
      );

toast.success("Login successful!");

localStorage.setItem("role", res.data.role);

      navigate("/dashboard");
    } catch (err) {
      toast.error("Invalid email or password");
      console.log(err);
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
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <div className="text-center mb-4">
          <h1>🏥</h1>
          <h3>Patient Login</h3>
          <p className="text-muted">
            Welcome back to ClinicCare
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
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;