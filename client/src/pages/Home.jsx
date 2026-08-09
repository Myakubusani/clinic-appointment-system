import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            🏥 ClinicCare
          </a>

          <div>
            <Link to="/login" className="btn btn-light me-2">
              Login
            </Link>

            <Link to="/register" className="btn btn-warning">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="text-center text-white d-flex align-items-center"
        style={{
          minHeight: "70vh",
          background:
            "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold">
            Welcome to ClinicCare
          </h1>

          <p className="lead mt-3">
            Book appointments with qualified doctors quickly,
            securely, and conveniently.
          </p>

          <div className="mt-4">
            <Link to="/book" className="btn btn-warning btn-lg me-3">
              📅 Book Appointment
            </Link>

            <Link to="/login" className="btn btn-outline-light btn-lg">
              Patient Login
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container py-5">
        <h2 className="text-center mb-5">Our Services</h2>

        <div className="row g-4">

          <div className="col-md-4">
            <div className="card shadow h-100 text-center">
              <div className="card-body">
                <h1>❤️</h1>
                <h4>Cardiology</h4>
                <p>
                  Comprehensive heart care from experienced specialists.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow h-100 text-center">
              <div className="card-body">
                <h1>🦷</h1>
                <h4>Dentistry</h4>
                <p>
                  Modern dental care for children and adults.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow h-100 text-center">
              <div className="card-body">
                <h1>👶</h1>
                <h4>Pediatrics</h4>
                <p>
                  Compassionate healthcare for infants and children.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">Why Choose ClinicCare?</h2>

          <div className="row text-center">

            <div className="col-md-3">
              <h1>👨‍⚕️</h1>
              <h5>Expert Doctors</h5>
            </div>

            <div className="col-md-3">
              <h1>⚡</h1>
              <h5>Fast Booking</h5>
            </div>

            <div className="col-md-3">
              <h1>🩺</h1>
              <h5>Medical Records</h5>
            </div>

            <div className="col-md-3">
              <h1>📞</h1>
              <h5>24/7 Support</h5>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-3">
        <p className="mb-0">
          © 2026 ClinicCare Hospital Management System. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;