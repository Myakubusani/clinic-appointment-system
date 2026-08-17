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

  const linkClass = ({ isActive }) =>
    `btn w-100 text-start mb-2 ${
      isActive
        ? "btn-light text-primary fw-bold"
        : "btn-primary text-white"
    }`;

  const handleNavigation = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="btn btn-primary d-md-none position-fixed top-0 start-0 m-2"
        onClick={() => setIsOpen(true)}
        style={{ zIndex: 1050 }}
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          onClick={() => setIsOpen(false)}
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1040,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className="bg-primary text-white position-fixed top-0 start-0 h-100"
        style={{
          width: "250px",
          minWidth: "250px",
          zIndex: 1050,

          transform:
            isOpen || window.innerWidth >= 768
              ? "translateX(0)"
              : "translateX(-100%)",

          transition: "transform 0.3s ease",
        }}
      >
        {/* Sidebar header */}
        <div className="p-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            🏥 ClinicCare
          </h5>

          {/* Mobile close button */}
          <button
            type="button"
            className="btn btn-close btn-close-white d-md-none"
            onClick={() => setIsOpen(false)}
          />
        </div>

        {/* Navigation */}
        <nav className="p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClass}
              onClick={handleNavigation}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Desktop spacing */}
      <div
        className="d-none d-md-block"
        style={{
          width: "250px",
          minWidth: "250px",
        }}
      />
    </>
  );
}

export default Sidebar;