import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Patient Pages
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import ManagePatients from "./pages/ManagePatients";
import ManageDoctors from "./pages/ManageDoctors";
import ManageAppointments from "./pages/ManageAppointments";
import MedicalRecords from "./pages/MedicalRecords";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from "./pages/AdminLogin";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Patient Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="patient">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book"
          element={
            <ProtectedRoute role="patient">
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute role="patient">
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-patients"
          element={
            <ProtectedRoute role="admin">
              <ManagePatients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-doctors"
          element={
            <ProtectedRoute role="admin">
              <ManageDoctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-appointments"
          element={
            <ProtectedRoute role="admin">
              <ManageAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medical-records"
          element={
            <ProtectedRoute role="admin">
              <MedicalRecords />
            </ProtectedRoute>
          }
        />

        <Route path="/admin-login" element={<AdminLogin />} />

<Route path="/doctor-login" element={<DoctorLogin />} />

<Route
  path="/doctor-dashboard"
  element={
    <ProtectedRoute role="doctor">
      <DoctorDashboard />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;