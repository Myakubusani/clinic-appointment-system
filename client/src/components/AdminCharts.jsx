import { useEffect, useState } from "react";
import API from "../services/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function AdminCharts() {
  const [statsData, setStatsData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    loadChart();
  }, []);

  const loadChart = async () => {
    try {
      const res = await API.get("/dashboard");

      setStatsData([
        {
          name: "Patients",
          value: res.data.patients,
        },
        {
          name: "Doctors",
          value: res.data.doctors,
        },
        {
          name: "Appointments",
          value: res.data.appointments,
        },
      ]);

      setStatusData([
        {
          name: "Approved",
          value: res.data.approved,
        },
        {
          name: "Pending",
          value: res.data.pending,
        },
        {
          name: "Rejected",
          value: res.data.rejected,
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  const COLORS = [
    "#198754",
    "#ffc107",
    "#dc3545",
  ];

  return (
    <div className="mt-4">

      {/* Bar Chart */}

      <div className="card shadow p-4 mb-4">
        <h4 className="mb-4">
          📊 Clinic Statistics
        </h4>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={statsData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="value"
              fill="#0d6efd"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}

      <div className="card shadow p-4">

        <h4 className="mb-4">
          🥧 Appointment Status
        </h4>

        <ResponsiveContainer width="100%" height={350}>

          <PieChart>

            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              nameKey="name"
              label
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default AdminCharts;