import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const { token, role, user } = response.data;

      // Make sure this is actually an admin account
      if (role !== "admin") {
        alert("This account does not have administrator access.");
        return;
      }

      // Save authentication information
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(user));

      // Keep compatibility with existing code
      localStorage.setItem("admin", "true");

      // Go to Admin Dashboard
      navigate("/admin", { replace: true });

    } catch (error) {
      console.error("Admin login error:", error);

      const message =
        error.response?.data?.message ||
        "Login failed. Please check your email and password.";

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card shadow border-0 p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <div style={{ fontSize: "3rem" }}>🏥</div>

          <h2 className="mb-1">
            Admin Login
          </h2>

          <p className="text-muted mb-0">
            ClinicCare Hospital Management System
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="mb-3">
            <label className="form-label">
              Admin Email
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="admin@cliniccare.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AdminLogin;