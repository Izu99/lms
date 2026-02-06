"use client";

import { useStudentDashboard } from "../hooks/useDashboard";
import { DashboardStats } from "../components/DashboardStats";
import { useAuth } from "../../shared/hooks/useAuth";
import { useRouter } from "next/navigation";
import { StudentDashboardSkeleton } from "@/components/student/skeletons/StudentDashboardSkeleton";

export function StudentDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push("/login");
  };
  const { data, isLoading, error, refetch } = useStudentDashboard();

  console.log('Dashboard data:', data);



  if (error) {
    return (
      <div className="w-full">
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
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

  if (isLoading || !data) {
    return (
      <div className="w-full">
        <div className="w-full max-w-7xl mx-auto">
          <StudentDashboardSkeleton />
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
    <div className="w-full">
      <main className="w-full max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <div className="theme-bg-primary rounded-lg shadow-sm theme-border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg sm:text-xl font-bold">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold theme-text-primary truncate">
                    Welcome back, {getDisplayName()}! 👋
                  </h1>
                  <p className="theme-text-secondary text-sm sm:text-base">
                    Ready to continue your ICT A-Level journey with ezyICT?
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                  STUDENT
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats stats={data.stats} />

        {/* Upcoming Deadlines & Study Time */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Upcoming Deadlines */}
            <div className="theme-bg-primary rounded-lg shadow-sm theme-border p-4">
              <h3 className="text-sm font-semibold theme-text-primary mb-3 flex items-center gap-2">
                <span className="text-orange-500">⏰</span> Upcoming Deadlines
              </h3>
              <div className="space-y-2">
                {data.availablePapers && data.availablePapers.filter(p => !p.isCompleted).slice(0, 3).length > 0 ? (
                  data.availablePapers.filter(p => !p.isCompleted).slice(0, 3).map((paper) => {
                    const deadline = new Date(paper.deadline);
                    const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={paper._id} className="flex items-center justify-between p-2 rounded bg-orange-50 dark:bg-orange-900/20">
                        <span className="text-xs theme-text-primary truncate flex-1">{paper.title}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${daysLeft <= 1 ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' :
                            daysLeft <= 3 ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300' :
                              'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                          }`}>
                          {daysLeft <= 0 ? 'Today!' : `${daysLeft}d left`}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs theme-text-secondary text-center py-4">No upcoming deadlines</p>
                )}
              </div>
            </div>

            {/* Study Time */}
            <div className="theme-bg-primary rounded-lg shadow-sm theme-border p-4">
              <h3 className="text-sm font-semibold theme-text-primary mb-3 flex items-center gap-2">
                <span className="text-blue-500">📚</span> Study Time
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs theme-text-secondary mb-1">Total Watch Time</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.floor((data.stats.totalWatchTime || 0) / 60)}h {(data.stats.totalWatchTime || 0) % 60}m
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs theme-text-secondary mb-1">Videos Watched</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {data.stats.availableVideos || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Recent Videos */}
          <div className="theme-bg-primary rounded-lg shadow-sm theme-border p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold theme-text-primary">Recent Videos</h2>
              <button
                onClick={() => router.push('/student/videos')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {data.recentVideos && data.recentVideos.length > 0 ? data.recentVideos.slice(0, 5).map((video) => (
                <div
                  key={video._id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => router.push(`/student/videos/${video._id}`)}
                >
                  <div className="w-12 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">▶</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium theme-text-primary truncate text-sm">{video.title}</h3>
                    <p className="text-xs theme-text-secondary truncate">
                      {video.views} views
                    </p>
                  </div>
                </div>
              )) : (
                <p className="theme-text-secondary text-center py-8 text-sm">No recent videos available</p>
              )}
            </div>
          </div>

          {/* Available Papers */}
          <div className="theme-bg-primary rounded-lg shadow-sm theme-border p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold theme-text-primary">Available Papers</h2>
              <button
                onClick={() => router.push('/student/papers')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {data.availablePapers && data.availablePapers.length > 0 ? data.availablePapers.slice(0, 5).map((paper) => (
                <div
                  key={paper._id}
                  className="flex flex-col gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => router.push(`/student/papers/${paper._id}`)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium theme-text-primary text-sm line-clamp-2 flex-1">{paper.title}</h3>
                    {paper.isCompleted ? (
                      <span className="inline-block text-green-600 dark:text-green-400 text-xs font-medium bg-green-50 dark:bg-green-900/50 px-2 py-1 rounded flex-shrink-0">
                        ✓ {paper.percentage}%
                      </span>
                    ) : (
                      <span className="inline-block text-orange-600 dark:text-orange-400 text-xs font-medium bg-orange-50 dark:bg-orange-900/50 px-2 py-1 rounded flex-shrink-0">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs theme-text-secondary">
                    {paper.totalQuestions} questions • {paper.timeLimit} min
                  </p>
                </div>
              )) : (
                <p className="theme-text-secondary text-center py-8 text-sm">No papers available</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="theme-bg-primary rounded-lg shadow-sm theme-border p-4 sm:p-6">
            <h2 className="text-lg font-semibold theme-text-primary mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {data.recentActivity && data.recentActivity.length > 0 ? data.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'paper_completed' ? 'bg-green-100 dark:bg-green-900/50' :
                      activity.type === 'video_watched' ? 'bg-blue-100 dark:bg-blue-900/50' :
                        'bg-orange-100 dark:bg-orange-900/50'
                    }`}>
                    <span className="text-sm">
                      {activity.type === 'paper_completed' ? '✓' :
                        activity.type === 'video_watched' ? '▶' : '📝'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium theme-text-primary line-clamp-2">{activity.title}</p>
                    <p className="text-xs theme-text-secondary">
                      {new Date(activity.timestamp).toLocaleDateString()}
                      {activity.score && ` • Score: ${activity.score}%`}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="theme-text-secondary text-center py-8 text-sm">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <div className="theme-bg-primary rounded-lg shadow-sm theme-border p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold theme-text-primary mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <button
                onClick={() => router.push('/student/videos')}
                className="flex flex-col items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📹</span>
                </div>
                <span className="text-sm font-medium theme-text-primary">Watch Videos</span>
              </button>

              <button
                onClick={() => router.push('/student/papers')}
                className="flex flex-col items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📝</span>
                </div>
                <span className="text-sm font-medium theme-text-primary">Take Papers</span>
              </button>

              <button
                onClick={() => router.push('/student/course-packages')}
                className="flex flex-col items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📦</span>
                </div>
                <span className="text-sm font-medium theme-text-primary">Packages</span>
              </button>

              <button
                onClick={() => router.push('/student/meeting')}
                className="flex flex-col items-center gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🎥</span>
                </div>
                <span className="text-sm font-medium theme-text-primary">Zoom Classes</span>
              </button>
            </div>
          </div>
        </div>


      </main>
    </div>
  );
}