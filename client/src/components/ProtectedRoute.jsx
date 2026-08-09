import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // No token = not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If no roles were specified, allow any logged-in user
  if (allowedRoles.length === 0) {
    return children;
  }

  // User has the wrong role
  if (!allowedRoles.includes(role)) {
    switch (role) {
      case "admin":
        return <Navigate to="/admin" replace />;

      case "doctor":
        return <Navigate to="/doctor-dashboard" replace />;

      case "patient":
        return <Navigate to="/dashboard" replace />;

      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;