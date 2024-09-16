import client from "@/utils/client";
import AnalyticsDashboardClient from "./components/AnalyticsDashboardClient";

export const metadata = {
  title: "Analytics Dashboard",
};

export default async function DashboardPage() {
  let data = null;

  try {
    const response = await client.get("/analytics/all");
    data = response.data;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Pass the data as props to the client-side component */}
      <AnalyticsDashboardClient
        totalUsers={data.totalUsers}
        totalResumes={data.totalResumes}
        totalCoverLetters={data.totalCoverLetters}
        usersDataWeekly={data.usersDataWeekly}
        resumesDataWeekly={data.resumesDataWeekly}
        coverLettersDataWeekly={data.coverLettersDataWeekly}
        weeklyUserGrowth={data.weeklyUserGrowth}
        weeklyResumeGrowth={data.weeklyResumeGrowth}
      />
    </div>
  );
}
