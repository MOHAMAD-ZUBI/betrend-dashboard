"use client"; // Enables client-side functionality for this component
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js
import {
  FaUser,
  FaFileAlt,
  FaEnvelope,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

interface GroupedData {
  _id: string;
  count: number;
}

interface AnalyticsDashboardProps {
  totalUsers: number;
  totalResumes: number;
  totalCoverLetters: number;
  usersDataWeekly: GroupedData[];
  resumesDataWeekly: GroupedData[];
  coverLettersDataWeekly: GroupedData[];
  weeklyUserGrowth: number;
  weeklyResumeGrowth: number;
}

const AnalyticsDashboardClient: React.FC<AnalyticsDashboardProps> = ({
  totalUsers,
  totalResumes,
  totalCoverLetters,
  usersDataWeekly,
  resumesDataWeekly,
  coverLettersDataWeekly,
  weeklyUserGrowth,
  weeklyResumeGrowth,
}) => {
  // Prepare chart data for user registrations
  const usersChartData = {
    labels: usersDataWeekly.map((week) => `Week ${week._id}`),
    datasets: [
      {
        label: "User Registrations",
        data: usersDataWeekly.map((week) => week.count),
        backgroundColor: "rgba(50, 150, 250, 0.2)",
        borderColor: "rgba(50, 150, 250, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // Prepare chart data for resumes and cover letters generated
  const activityChartData = {
    labels: resumesDataWeekly.map((week) => `Week ${week._id}`),
    datasets: [
      {
        label: "Resumes Generated",
        data: resumesDataWeekly.map((week) => week.count),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Cover Letters Generated",
        data: coverLettersDataWeekly.map((week) => week.count),
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
            <FaUser />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold">{totalUsers}</p>
            <p
              className={`text-sm ${
                weeklyUserGrowth > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {weeklyUserGrowth > 0 ? <FaArrowUp /> : <FaArrowDown />}{" "}
              {weeklyUserGrowth.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Total Resumes Generated */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white text-xl">
            <FaFileAlt />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Resumes Generated</h3>
            <p className="text-2xl font-bold">{totalResumes}</p>
            <p
              className={`text-sm ${
                weeklyResumeGrowth > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {weeklyResumeGrowth > 0 ? <FaArrowUp /> : <FaArrowDown />}{" "}
              {weeklyResumeGrowth.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Total Cover Letters Generated */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
            <FaEnvelope />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Total Cover Letters Generated
            </h3>
            <p className="text-2xl font-bold">{totalCoverLetters}</p>
          </div>
        </div>
      </div>

      {/* Grid for Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Registrations Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">User Registrations</h3>
          <div className="h-72">
            <Line
              data={usersChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Activity Chart (Resumes & Cover Letters) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            Resumes & Cover Letters Generated
          </h3>
          <div className="h-72">
            <Line
              data={activityChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardClient;
