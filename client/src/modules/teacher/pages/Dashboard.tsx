"use client";

import { useState } from "react";
import { useTeacherDashboard } from "../hooks/useDashboard";
import { TeacherDashboardStats } from "../components/DashboardStats";
import { Plus, TrendingUp, Video, FileText, Users, Eye, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateVideoModal } from "@/components/modals";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  videos: {
    label: "Videos",
    color: "hsl(142, 76%, 36%)",
  },
  papers: {
    label: "Papers",
    color: "hsl(25, 95%, 53%)",
  },
  students: {
    label: "Students",
    color: "hsl(271, 91%, 65%)",
  },
} satisfies ChartConfig;

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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900 rounded-2xl shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome back, Teacher! 👨‍🏫
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Here&apos;s what&apos;s happening with your classes today
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

      {/* Activity Timeline Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Activity Timeline
          </h2>
          <select className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>

        {data.dailyActivity && data.dailyActivity.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <AreaChart
              accessibilityLayer
              data={data.dailyActivity}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <defs>
                <linearGradient id="fillVideos" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(142, 76%, 36%)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(142, 76%, 36%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillPapers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(25, 95%, 53%)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(25, 95%, 53%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(271, 91%, 65%)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(271, 91%, 65%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="students"
                type="natural"
                fill="url(#fillStudents)"
                fillOpacity={0.4}
                stroke="hsl(271, 91%, 65%)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="papers"
                type="natural"
                fill="url(#fillPapers)"
                fillOpacity={0.4}
                stroke="hsl(25, 95%, 53%)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="videos"
                type="natural"
                fill="url(#fillVideos)"
                fillOpacity={0.4}
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="relative h-80 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No activity data available</p>
            </div>
          </div>
        )}
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Videos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-600" />
            Recent Videos
          </h3>
          {data?.recentVideos && data.recentVideos.length > 0 ? (
            <div className="space-y-3">
              {data.recentVideos.slice(0, 3).map((video) => (
                <div 
                  key={video._id} 
                  className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => router.push(`/teacher/videos/${video._id}`)}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">{video.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {video.views} views
                    </span>
                    <span>{video.class?.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No videos yet</p>
          )}
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Upload Video
          </button>
        </div>

        {/* Recent Papers */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Recent Papers
          </h3>
          {data?.recentPapers && data.recentPapers.length > 0 ? (
            <div className="space-y-3">
              {data.recentPapers.slice(0, 3).map((paper) => (
                <div 
                  key={paper._id} 
                  className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => router.push(`/teacher/papers/${paper._id}`)}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">{paper.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{paper.totalQuestions} questions</span>
                    <span>{paper.submissionCount} submissions</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No papers yet</p>
          )}
          <button
            onClick={() => router.push('/teacher/papers/create')}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Paper
          </button>
        </div>

        {/* Active Students */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Active Students
          </h3>
          {data?.students && data.students.length > 0 ? (
            <div className="space-y-3">
              {data.students.slice(0, 3).map((student) => (
                <div 
                  key={student._id} 
                  className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {student.firstName && student.lastName 
                      ? `${student.firstName} ${student.lastName}` 
                      : student.username}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {student.averageScore.toFixed(0)}% avg
                    </span>
                    <span>{student.completedPapers} papers</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No active students</p>
          )}
          <button
            onClick={() => router.push('/teacher/students')}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            View All Students
          </button>
        </div>
      </div>

      {/* Video Upload Modal */}
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
