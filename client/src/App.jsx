import { BrowserRouter, Routes, Route } from "react-router-dom";
import DoctorMedicalRecords from "./pages/DoctorMedicalRecords";

// ========================================
// PUBLIC PAGES
// ========================================
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

// ========================================
// PATIENT PAGES
// ========================================
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import MyMedicalRecords from "./pages/MyMedicalRecords";

// ========================================
// DOCTOR PAGES
// ========================================
import DoctorDashboard from "./pages/DoctorDashboard";
import ViewAppointment from "./pages/ViewAppointment";

// ========================================
// ADMIN PAGES
// ========================================
import AdminDashboard from "./pages/AdminDashboard";
import ManagePatients from "./pages/ManagePatients";
import ManageDoctors from "./pages/ManageDoctors";
import ManageAppointments from "./pages/ManageAppointments";
import MedicalRecords from "./pages/MedicalRecords";

// ========================================
// LOGIN PAGES
// ========================================
import AdminLogin from "./pages/AdminLogin";
import DoctorLogin from "./pages/DoctorLogin";

// ========================================
// PROTECTED ROUTE
// ========================================
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/doctor-login"
          element={<DoctorLogin />}
        />


        {/* =====================================================
            PATIENT ROUTES
        ===================================================== */}

        {/* Patient Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Book Appointment */}
        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        {/* My Appointments */}
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        {/* My Medical Records */}
        <Route
          path="/my-medical-records"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <MyMedicalRecords />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            DOCTOR ROUTES
        ===================================================== */}

        {/* Doctor Dashboard */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Doctor View Appointment */}
        <Route
          path="/view-appointment/:id"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <ViewAppointment />
            </ProtectedRoute>
          }
        />

        {/* Doctor Medical Records */}
<Route
  path="/doctor/medical-records"
  element={
    <ProtectedRoute allowedRoles={["doctor"]}>
      <DoctorMedicalRecords />
    </ProtectedRoute>
  }
/>


        {/* =====================================================
            ADMIN ROUTES
        ===================================================== */}

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Manage Patients */}
        <Route
          path="/manage-patients"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManagePatients />
            </ProtectedRoute>
          }
        />

        {/* Manage Doctors */}
        <Route
          path="/manage-doctors"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageDoctors />
            </ProtectedRoute>
          }
        />

        {/* Manage Appointments */}
        <Route
          path="/manage-appointments"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageAppointments />
            </ProtectedRoute>
          }
        />

        {/* Admin Medical Records */}
        <Route
          path="/medical-records"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MedicalRecords />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;