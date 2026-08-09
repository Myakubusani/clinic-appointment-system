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
  // LOGIN
  // =====================================================

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);

      console.log("================================");
      console.log("LOGIN RESPONSE:", res.data);
      console.log("LOGIN ROLE:", res.data.role);
      console.log("================================");

      // =================================================
      // SAVE USER
      // =================================================

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // =================================================
      // SAVE TOKEN
      // =================================================

      localStorage.setItem(
        "token",
        res.data.token
      );

      // =================================================
      // SAVE ROLE
      // =================================================

      localStorage.setItem(
        "role",
        res.data.role
      );

      // =================================================
      // PATIENT DATA
      // =================================================

      if (res.data.role === "patient") {
        localStorage.setItem(
          "patient",
          JSON.stringify(res.data.user)
        );
      } else {
        // Remove old patient data if another role logs in
        localStorage.removeItem("patient");
      }

      // =================================================
      // REDIRECT ACCORDING TO ROLE
      // =================================================

      switch (res.data.role) {
        // -----------------------------------------------
        // ADMIN
        // -----------------------------------------------

        case "admin":
          toast.success("Login successful!");
          navigate("/admin");
          break;

        // -----------------------------------------------
        // DOCTOR
        // -----------------------------------------------

        case "doctor":
          toast.info(
            "Please use the Doctor Login page to access your doctor account."
          );

          navigate("/doctor-login");
          break;

        // -----------------------------------------------
        // PATIENT
        // -----------------------------------------------

        case "patient":
          toast.success("Login successful!");
          navigate("/dashboard");
          break;

        // -----------------------------------------------
        // UNKNOWN ROLE
        // -----------------------------------------------

        default:
          toast.error(
            "Unable to determine your account type."
          );

          navigate("/login");
          break;
      }
    } catch (error) {
      console.error("================================");
      console.error("LOGIN ERROR:", error);
      console.error(
        "STATUS:",
        error.response?.status
      );
      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );
      console.error("================================");

      toast.error(
        error?.response?.data?.message ||
          "Login failed. Please try again."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

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
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center mb-4">
          <h1>🏥</h1>

          <h3>Patient Login</h3>

          <p className="text-muted">
            Login to your ClinicCare patient account
          </p>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={login}>
          {/* EMAIL */}

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

          {/* PASSWORD */}

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

          {/* LOGIN */}

          <button
            className="btn btn-primary w-100"
            type="submit"
          >
            Login
          </button>
        </form>

        {/* =================================================
            REGISTER
        ================================================= */}

        <p className="text-center mt-3">
          Don't have a patient account?{" "}

          <Link to="/register">
            Register
          </Link>
        </p>

        {/* =================================================
            DOCTOR LOGIN
        ================================================= */}

        <p className="text-center mb-0">
          Are you a doctor?{" "}

          <Link to="/doctor-login">
            Doctor Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;