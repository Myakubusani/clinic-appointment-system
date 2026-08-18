import { NavLink } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleNavigation = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="btn btn-primary d-md-none position-fixed"
        onClick={() => setIsOpen(true)}
        style={{
          top: "10px",
          left: "10px",
          zIndex: 1100,
        }}
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="position-fixed d-md-none"
          onClick={() => setIsOpen(false)}
          style={{
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1040,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className="bg-primary text-white position-fixed top-0 start-0 h-100"
        style={{
          width: "250px",
          zIndex: 1050,
          transition: "transform 0.3s ease",
          transform: isOpen
            ? "translateX(0)"
            : "translateX(-100%)",
        }}
      >
        {/* Header */}
        <div className="p-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            🏥 ClinicCare
          </h5>

          <button
            type="button"
            className="btn btn-close btn-close-white d-md-none"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          />
        </div>

        {/* Navigation */}
        <nav className="p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavigation}
              className={({ isActive }) =>
                `btn w-100 text-start mb-2 ${
                  isActive
                    ? "btn-light text-primary fw-bold"
                    : "btn-primary text-white"
                }`
              }
            >
              <span className="me-2">
                {item.icon}
              </span>

              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Desktop sidebar space */}
      <div
        className="d-none d-md-block"
        style={{
          width: "250px",
          minWidth: "250px",
        }}
      />

      {/* Desktop sidebar */}
      <style>
        {`
          @media (min-width: 768px) {
            aside {
              transform: translateX(0) !important;
            }
          }
        `}
      </style>
    </>
  );
}

export default Sidebar;