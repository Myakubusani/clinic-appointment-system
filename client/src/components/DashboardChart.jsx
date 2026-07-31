import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function DashboardChart({ stats }) {
  const barData = {
    labels: ["Patients", "Doctors", "Appointments", "Medical Records"],
    datasets: [
      {
        label: "Clinic Statistics",
        data: [
          stats.patients,
          stats.doctors,
          stats.appointments,
          stats.medicalRecords,
        ],
        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545",
        ],
      },
    ],
  };

  const doughnutData = {
    labels: ["Patients", "Doctors", "Appointments", "Medical Records"],
    datasets: [
      {
        data: [
          stats.patients,
          stats.doctors,
          stats.appointments,
          stats.medicalRecords,
        ],
        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545",
        ],
      },
    ],
  };

  return (
    <div className="row mt-4">
      <div className="col-md-7">
        <div className="card shadow p-3">
          <h5>Clinic Statistics</h5>
          <Bar data={barData} />
        </div>
      </div>

      <div className="col-md-5">
        <div className="card shadow p-3">
          <h5>Distribution</h5>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}

export default DashboardChart;