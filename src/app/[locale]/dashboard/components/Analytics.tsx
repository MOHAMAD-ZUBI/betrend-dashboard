"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GroupedData {
  _id: any;
  count: number;
}

interface AnalyticsChartProps {
  groupBy: "day" | "week";
  resumesData: GroupedData[];
  coverLettersData: GroupedData[];
  usersData: GroupedData[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  groupBy,
  resumesData,
  coverLettersData,
  usersData,
}) => {
  const labels = resumesData.map((item) =>
    groupBy === "week"
      ? `Week ${item._id.week} of ${item._id.year}`
      : `Day ${item._id.day}/${item._id.month}/${item._id.year}`
  );

  const barData = {
    labels,
    datasets: [
      {
        label: "Resumes Generated",
        data: resumesData.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Cover Letters Generated",
        data: coverLettersData.map((item) => item.count),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Users Registered",
        data: usersData.map((item) => item.count),
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {groupBy === "week" ? "Weekly" : "Daily"} Analytics
      </h2>
      <Bar data={barData} />
    </div>
  );
};

export default AnalyticsChart;
