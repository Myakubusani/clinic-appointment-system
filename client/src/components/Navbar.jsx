import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-3 px-md-4 py-3">

      <div className="container-fluid p-0">

        {/* ClinicCare title */}
        <div className="d-flex align-items-center">

          <span className="fs-4 me-2">
            🏥
          </span>

          <div>
            <h4 className="mb-0 d-none d-sm-block">
              ClinicCare
            </h4>

            <h6 className="mb-0 d-sm-none">
              ClinicCare
            </h6>

            <small className="text-muted d-none d-md-block">
              Hospital Management System
            </small>
          </div>

        </div>


        {/* Admin section */}
        <div className="d-flex align-items-center">

          <span className="me-2 me-md-3 fw-semibold">
            👤 <span className="d-none d-sm-inline">Admin</span>
          </span>

          <button
            className="btn btn-danger btn-sm"
            onClick={logout}
          >
            🚪 <span className="d-none d-sm-inline">Logout</span>
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;