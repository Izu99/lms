"use client";

import { useStudentDashboard } from "../hooks/useDashboard";
import { DashboardStats } from "../components/DashboardStats";
import { useAuth } from "../../shared/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export function StudentDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push("/login");
  };
  const { data, isLoading, error, refetch } = useStudentDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || "Student";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg sm:text-xl font-bold">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                    Welcome back, {getDisplayName()}! 👋
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Ready to continue your ICT A-Level journey with ezyICT?
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  STUDENT
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats stats={data.stats} />

        {/* Recent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Recent Videos */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Videos</h2>
            <div className="space-y-3">
              {data.recentVideos.length > 0 ? data.recentVideos.map((video) => (
                <div key={video._id} className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-9 sm:w-16 sm:h-12 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">▶</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{video.title}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {video.class.name} • {video.views} views
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-8">No recent videos available</p>
              )}
            </div>
          </div>

          {/* Available Papers */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Papers</h2>
            <div className="space-y-3">
              {data.availablePapers.length > 0 ? data.availablePapers.map((paper) => (
                <div key={paper._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{paper.title}</h3>
                    <p className="text-sm text-gray-500">
                      {paper.totalQuestions} questions • {paper.timeLimit} minutes
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {paper.isCompleted ? (
                      <span className="inline-block text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded">
                        Completed ({paper.percentage}%)
                      </span>
                    ) : (
                      <span className="inline-block text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded">
                        Available
                      </span>
                    )}
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-8">No papers available</p>
              )}
            </div>
          </div>
        </div>

        {/* Subtle Footer Branding */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Powered by <span className="font-semibold text-blue-500">ezyICT</span> - Smart Learning Made Easy
          </p>
        </div>
      </main>
    </div>
  );
}