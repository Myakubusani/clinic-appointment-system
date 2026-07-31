function Navbar() {
  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-4">
      <h4 className="mb-0">
        Hospital Management System
      </h4>

      <div>
        <span className="me-3">
          👤 Admin
        </span>

        <button className="btn btn-danger btn-sm">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;