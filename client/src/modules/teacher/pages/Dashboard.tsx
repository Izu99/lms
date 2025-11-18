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
import { LoadingComponent } from "@/components/common/LoadingComponent";
import { ErrorComponent } from "@/components/common/ErrorComponent";

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
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent message={error} onRetry={refetch} />;
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
              <p className="text-lg font-bold">{(data.stats.averageEngagement || 0).toFixed(0)}%</p>
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
        <div className="bg-[#1a2332] rounded-2xl shadow-xl border border-[#2d3748] p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Recent Videos</h3>
            </div>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all hover:scale-105 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Upload
            </button>
          </div>
          
          {data?.recentVideos && data.recentVideos.length > 0 ? (
            <div className="space-y-3">
              {data.recentVideos.slice(0, 3).map((video) => (
                <div 
                  key={video._id} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#243447] hover:bg-[#2d3f54] transition-all cursor-pointer group"
                  onClick={() => router.push(`/teacher/videos/${video._id}`)}
                >
                  <div className="relative w-12 h-12 bg-[#2d3f54] rounded-lg overflow-hidden flex-shrink-0">
                    <video 
                      src={video.videoUrl} 
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-0.5"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate group-hover:text-green-400 transition-colors">{video.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{video.class?.name}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {video.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <span className="text-gray-400 text-sm">No videos yet</span>
            </div>
          )}
        </div>

        {/* Recent Papers */}
        <div className="bg-[#1a2332] rounded-2xl shadow-xl border border-[#2d3748] p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Recent Papers</h3>
            </div>
            <button
              onClick={() => router.push('/teacher/papers/create')}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-all hover:scale-105 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Create
            </button>
          </div>
          
          {data?.recentPapers && data.recentPapers.length > 0 ? (
            <div className="space-y-3">
              {data.recentPapers.slice(0, 3).map((paper) => (
                <div 
                  key={paper._id} 
                  className="p-4 rounded-xl bg-[#243447] hover:bg-[#2d3f54] transition-all cursor-pointer group"
                  onClick={() => router.push(`/teacher/papers/${paper._id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white group-hover:text-orange-400 transition-colors">{paper.title}</h4>
                    <div className="flex items-center gap-1 text-orange-400 text-sm">
                      <FileText className="w-4 h-4" />
                      {paper.totalQuestions}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {paper.submissionCount} submissions
                    </span>
                    <span className={`flex items-center gap-1 ${
                      paper.completionRate >= 50 ? 'text-green-400' : 'text-orange-400'
                    }`}>
                      <TrendingUp className="w-3 h-3" />
                      {paper.completionRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No papers yet</p>
            </div>
          )}
        </div>

        {/* Top Students */}
        <div className="bg-[#1a2332] rounded-2xl shadow-xl border border-[#2d3748] p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Top Students</h3>
            </div>
          </div>
          
          {data?.students && data.students.length > 0 ? (
            <div className="space-y-3">
              {data.students.slice(0, 3).map((student, index) => (
                <div 
                  key={student._id} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#243447] hover:bg-[#2d3f54] transition-all cursor-pointer group"
                >
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                      'bg-gradient-to-br from-orange-400 to-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-xs">🏆</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate group-hover:text-pink-400 transition-colors">
                      {student.firstName && student.lastName 
                        ? `${student.firstName} ${student.lastName}` 
                        : student.username}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {student.completedPapers} papers
                      </span>
                    </div>
                  </div>
                  <div className={`text-sm font-medium flex items-center gap-1 ${
                    student.averageScore >= 80 ? 'text-green-400' : 
                    student.averageScore >= 50 ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    {student.averageScore.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No active students</p>
            </div>
          )}
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
