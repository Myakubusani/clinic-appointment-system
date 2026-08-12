import { NavLink } from "react-router-dom";

function Sidebar() {
  const navItems = [
    {
      to: "/admin",
      icon: "📊",
      label: "Dashboard",
    },
    {
      to: "/manage-patients",
      icon: "👥",
      label: "Patients",
    },
    {
      to: "/manage-doctors",
      icon: "👨‍⚕️",
      label: "Doctors",
    },
    {
      to: "/manage-appointments",
      icon: "📅",
      label: "Appointments",
    },
    {
      to: "/medical-records",
      icon: "🩺",
      label: "Medical Records",
    },
  ];

  const linkClass = ({ isActive }) =>
    `btn w-100 text-start mb-2 ${
      isActive
        ? "btn-light text-primary fw-bold"
        : "btn-primary text-white"
    }`;

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="btn btn-primary d-md-none position-fixed top-0 start-0 m-2"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#adminSidebar"
        aria-controls="adminSidebar"
        style={{ zIndex: 1050 }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        id="adminSidebar"
        className="offcanvas-md offcanvas-start bg-primary text-white"
        tabIndex="-1"
        style={{
          width: "250px",
          minWidth: "250px",
          minHeight: "100vh",
        }}
      >
        {/* Mobile header */}
        <div className="offcanvas-header d-md-none">
          <h5 className="offcanvas-title">
            🏥 ClinicCare
          </h5>

          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>

        {/* Sidebar content */}
        <div className="offcanvas-body d-flex flex-column p-3">

          {/* Desktop title */}
          <h3 className="text-center mb-4 d-none d-md-block">
            🏥 ClinicCare
          </h3>

          {/* Navigation */}
          <nav>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClass}
                onClick={(e) => {
                  // Close mobile offcanvas only
                  if (window.innerWidth < 768) {
                    const sidebar =
                      document.getElementById("adminSidebar");

                    const bsOffcanvas =
                      window.bootstrap?.Offcanvas.getInstance(sidebar);

                    bsOffcanvas?.hide();
                  }
                }}
              >
                {item.icon} {item.label}
              </NavLink>
            ))}
          </nav>

        </div>
      </div>
    </>
  );
}

export default Sidebar;