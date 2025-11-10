"use client";

import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { BarChart3, TrendingUp, Users, Video, FileText } from "lucide-react";

export default function TeacherAnalyticsPage() {
  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track performance and engagement metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, label: "Total Students", value: "0", color: "from-pink-400 to-pink-600" },
            { icon: Video, label: "Total Videos", value: "0", color: "from-green-400 to-green-600" },
            { icon: FileText, label: "Total Papers", value: "0", color: "from-orange-400 to-orange-600" },
            { icon: TrendingUp, label: "Avg Performance", value: "0%", color: "from-blue-400 to-blue-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 h-80 flex items-center justify-center">
            <p className="text-gray-400 dark:text-gray-500">Student Performance Chart</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 h-80 flex items-center justify-center">
            <p className="text-gray-400 dark:text-gray-500">Engagement Metrics Chart</p>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
