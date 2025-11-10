"use client";

import { useState } from "react";
import { useTeacherDashboard } from "../hooks/useDashboard";
import { TeacherDashboardStats } from "../components/DashboardStats";
import { Plus, TrendingUp, Video, FileText, Users, Eye, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateVideoModal } from "@/components/modals";

export function TeacherDashboard() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useTeacherDashboard();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) {
    return <p className="text-gray-500">No data available</p>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header with Animation */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900 rounded-2xl shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 animate-fade-in">
              Welcome back, Teacher! 👨‍🏫
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Here's what's happening with your classes today
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
            <TrendingUp className="w-6 h-6 animate-bounce" />
            <div className="text-left">
              <p className="text-xs text-blue-100">Engagement</p>
              <p className="text-lg font-bold">{data.stats.averageEngagement.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <TeacherDashboardStats stats={data.stats} />

      {/* Charts Section - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Student Performance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Student Performance Overview
            </h2>
            <select className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          
          {/* Bar Chart */}
          <div className="space-y-4">
            {[
              { label: "Excellent (90-100%)", value: 25, color: "from-green-400 to-green-600", percentage: 25 },
              { label: "Good (75-89%)", value: 35, color: "from-blue-400 to-blue-600", percentage: 35 },
              { label: "Average (60-74%)", value: 30, color: "from-yellow-400 to-yellow-600", percentage: 30 },
              { label: "Below Average (<60%)", value: 10, color: "from-red-400 to-red-600", percentage: 10 },
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{item.percentage}%</span>
                </div>
                <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-3 group-hover:shadow-lg`}
                    style={{ 
                      width: `${item.percentage}%`,
                      animation: `expandWidth 1s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <span className="text-white text-xs font-bold">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.stats.activeStudents}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active Students</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.stats.averageEngagement.toFixed(0)}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Avg Engagement</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.recentPapers.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active Papers</p>
            </div>
          </div>
        </div>

        {/* Pie Chart - Content Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Content Distribution
          </h2>

          {/* Pie Chart Visual */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Videos - Green */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="20"
                strokeDasharray={`${(data.stats.totalVideos / (data.stats.totalVideos + data.stats.totalPapers)) * 251.2} 251.2`}
                className="transition-all duration-1000"
              />
              {/* Papers - Orange */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient2)"
                strokeWidth="20"
                strokeDasharray={`${(data.stats.totalPapers / (data.stats.totalVideos + data.stats.totalPapers)) * 251.2} 251.2`}
                strokeDashoffset={`-${(data.stats.totalVideos / (data.stats.totalVideos + data.stats.totalPapers)) * 251.2}`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.stats.totalVideos + data.stats.totalPapers}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Videos</span>
              </div>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">{data.stats.totalVideos}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Papers</span>
              </div>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{data.stats.totalPapers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Activity Timeline
          </h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
              Week
            </button>
            <button className="px-3 py-1.5 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Month
            </button>
          </div>
        </div>

        {/* Line Chart Visualization */}
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between gap-2 px-4">
            {[
              { day: "Mon", videos: 12, papers: 8, students: 45 },
              { day: "Tue", videos: 19, papers: 12, students: 52 },
              { day: "Wed", videos: 15, papers: 10, students: 48 },
              { day: "Thu", videos: 22, papers: 15, students: 58 },
              { day: "Fri", videos: 18, papers: 11, students: 50 },
              { day: "Sat", videos: 25, papers: 18, students: 65 },
              { day: "Sun", videos: 20, papers: 14, students: 55 },
            ].map((item, index) => {
              const maxValue = 70;
              const videosHeight = (item.videos / maxValue) * 100;
              const papersHeight = (item.papers / maxValue) * 100;
              const studentsHeight = (item.students / maxValue) * 100;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                  {/* Bars */}
                  <div className="w-full flex items-end justify-center gap-1 h-48">
                    {/* Videos Bar */}
                    <div className="relative flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-1000 hover:shadow-lg cursor-pointer"
                        style={{
                          height: `${videosHeight}%`,
                          animation: `expandHeight 1s ease-out ${index * 0.1}s both`,
                        }}
                        title={`${item.videos} videos`}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {item.videos}
                        </div>
                      </div>
                    </div>
                    {/* Papers Bar */}
                    <div className="relative flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-1000 hover:shadow-lg cursor-pointer"
                        style={{
                          height: `${papersHeight}%`,
                          animation: `expandHeight 1s ease-out ${index * 0.1 + 0.2}s both`,
                        }}
                        title={`${item.papers} papers`}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {item.papers}
                        </div>
                      </div>
                    </div>
                    {/* Students Bar */}
                    <div className="relative flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-1000 hover:shadow-lg cursor-pointer"
                        style={{
                          height: `${studentsHeight}%`,
                          animation: `expandHeight 1s ease-out ${index * 0.1 + 0.4}s both`,
                        }}
                        title={`${item.students} students`}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {item.students}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Day Label */}
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Videos Uploaded</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Papers Created</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Student Activity</span>
          </div>
        </div>
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Videos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <Video className="w-5 h-5 text-white" />
              </div>
              Recent Videos
            </h2>
            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-md rounded-lg text-sm font-medium transition-all hover:scale-105"
            >
              <Plus size={16} />
              Upload
            </button>
          </div>
          <div className="space-y-3">
            {data.recentVideos.length > 0 ? data.recentVideos.slice(0, 3).map((video, index) => (
              <div 
                key={video._id} 
                className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-green-50 dark:hover:from-green-900/20 hover:to-transparent transition-all cursor-pointer border border-transparent hover:border-green-200 dark:hover:border-green-700"
                style={{
                  animation: `slideInRight 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="relative w-16 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow overflow-hidden">
                  <span className="text-white text-lg relative z-10">▶</span>
                  <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{video.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-2">
                    <span>{video.institute?.name || 'No Institute'}</span>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.views || 0}
                    </span>
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <Video className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 dark:text-gray-500 text-sm">No recent videos</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Papers */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 animate-fade-in-up delay-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              Recent Papers
            </h2>
            <button 
              onClick={() => router.push('/teacher/papers/create')}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-md rounded-lg text-sm font-medium transition-all hover:scale-105"
            >
              <Plus size={16} />
              Create
            </button>
          </div>
          <div className="space-y-3">
            {data.recentPapers.slice(0, 3).map((paper, index) => (
              <div 
                key={paper._id} 
                className="group p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 dark:hover:from-orange-900/20 hover:to-transparent transition-all cursor-pointer border border-transparent hover:border-orange-200 dark:hover:border-orange-700"
                style={{
                  animation: `slideInRight 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate flex-1 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors">{paper.title}</h3>
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-semibold ml-2">
                    <FileText className="w-3 h-3" />
                    {paper.totalQuestions || 0}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {paper.submissionCount} submissions
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    {paper.averageScore.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Students */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 animate-fade-in-up delay-200">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
            Top Students
          </h2>
          <div className="space-y-3">
            {data.students.slice(0, 3).map((student, index) => (
              <div 
                key={student._id} 
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 dark:hover:from-pink-900/20 hover:to-transparent transition-all cursor-pointer border border-transparent hover:border-pink-200 dark:hover:border-pink-700"
                style={{
                  animation: `slideInRight 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-shadow">
                      {index + 1}
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-yellow-700" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-pink-700 dark:group-hover:text-pink-400 transition-colors">
                      {student.firstName && student.lastName 
                        ? `${student.firstName} ${student.lastName}`
                        : student.username
                      }
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {student.completedPapers} papers
                    </p>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold">
                      {student.averageScore.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center pt-8">
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          Powered by <span className="font-semibold text-blue-600 dark:text-blue-400">ezyICT</span> - Smart Learning Made Easy
        </p>
      </div>

      {/* Modals */}
      <CreateVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onSuccess={() => {
          refetch();
          setIsVideoModalOpen(false);
        }}
      />

    </div>
  );
}