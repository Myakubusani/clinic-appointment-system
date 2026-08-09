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
  // DOCTOR LOGIN
  // =====================================================

  const loginDoctor = async (e) => {

    e.preventDefault();

    try {

      console.log(
        "================================"
      );

      console.log(
        "DOCTOR LOGIN STARTED"
      );

      // -------------------------------------------------
      // SEND LOGIN REQUEST
      // -------------------------------------------------

      const res = await API.post(
        "/doctors/login",
        formData
      );


      console.log(
        "FULL SERVER RESPONSE:",
        res.data
      );


      // -------------------------------------------------
      // GET DOCTOR FROM SERVER
      // -------------------------------------------------

      const serverDoctor =
        res.data?.doctor;


      console.log(
        "DOCTOR RECEIVED FROM SERVER:",
        serverDoctor
      );


      console.log(
        "SPECIALIZATION RECEIVED:",
        serverDoctor?.specialization
      );


      // -------------------------------------------------
      // SAFETY CHECK
      // -------------------------------------------------

      if (!serverDoctor) {

        toast.error(
          "Doctor information was not returned by the server."
        );

        console.error(
          "No doctor object found in login response."
        );

        return;
      }


      // -------------------------------------------------
      // CREATE DOCTOR OBJECT
      // -------------------------------------------------

      const doctorData = {

        id: serverDoctor.id,

        fullName:
          serverDoctor.fullName || "",

        email:
          serverDoctor.email || "",

        phone:
          serverDoctor.phone || "",

        specialization:
          serverDoctor.specialization || "",

        role:
          serverDoctor.role || "doctor",

      };


      console.log(
        "DOCTOR DATA TO SAVE:",
        doctorData
      );


      console.log(
        "SPECIALIZATION TO SAVE:",
        doctorData.specialization
      );


      // -------------------------------------------------
      // SAVE DOCTOR
      // -------------------------------------------------

      localStorage.setItem(
        "doctor",
        JSON.stringify(doctorData)
      );


      localStorage.setItem(
        "user",
        JSON.stringify(doctorData)
      );


      // -------------------------------------------------
      // SAVE JWT
      // -------------------------------------------------

      localStorage.setItem(
        "token",
        res.data.token
      );


      // -------------------------------------------------
      // SAVE ROLE
      // -------------------------------------------------

      localStorage.setItem(
        "role",
        "doctor"
      );


      // -------------------------------------------------
      // VERIFY WHAT WAS SAVED
      // -------------------------------------------------

      console.log(
        "================================"
      );

      console.log(
        "DOCTOR SAVED TO LOCAL STORAGE:"
      );

      console.log(
        localStorage.getItem("doctor")
      );


      console.log(
        "USER SAVED TO LOCAL STORAGE:"
      );

      console.log(
        localStorage.getItem("user")
      );


      console.log(
        "TOKEN EXISTS:",
        !!localStorage.getItem("token")
      );


      console.log(
        "ROLE:",
        localStorage.getItem("role")
      );

      console.log(
        "================================"
      );


      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      toast.success(
        "Doctor login successful!"
      );


      navigate(
        "/doctor-dashboard"
      );

    } catch (error) {

      console.error(
        "================================"
      );

      console.error(
        "DOCTOR LOGIN ERROR:"
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "SERVER DATA:",
        error.response?.data
      );

      console.error(
        "ERROR:",
        error
      );

      console.error(
        "================================"
      );


      toast.error(
        error.response?.data?.message ||
        "Invalid email or password."
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
          "linear-gradient(135deg,#198754,#0f5132)",
      }}
    >

      <div
        className="card shadow-lg p-4"
        style={{
          width: "420px",
          borderRadius: "15px",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center mb-4">

          <h1>
            👨‍⚕️
          </h1>

          <h3>
            Doctor Login
          </h3>

          <p className="text-muted">
            Welcome back, Doctor
          </p>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={loginDoctor}>

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
            className="btn btn-success w-100"
            type="submit"
          >
            Login
          </button>

        </form>


        {/* =================================================
            BACK TO HOME
        ================================================= */}

        <p className="text-center mt-3">

          <Link to="/">
            Back to Home
          </Link>

        </p>

      </div>

    </div>

  );
}

export default DoctorLogin;