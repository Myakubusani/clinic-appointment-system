import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminLayout({ children }) {
  return (
    <div className="d-flex min-vh-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-grow-1 bg-light min-vh-100">

        <Navbar />

        <main className="container-fluid p-3 p-md-4">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;