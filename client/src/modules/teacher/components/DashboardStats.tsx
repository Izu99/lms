"use client";

import { Video, BookOpen, Users, Eye, TrendingUp, Award, FileText } from "lucide-react";
import type { TeacherDashboardStats } from "../types/dashboard.types";

interface DashboardStatsProps {
  stats: TeacherDashboardStats;
}

const statCards = [
  // Row 1: Content metrics
  {
    key: "totalVideos",
    label: "Total Videos",
    icon: Video,
    gradient: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    iconBg: "bg-green-100",
  },
  {
    key: "totalPapers",
    label: "Total Papers",
    icon: FileText,
    gradient: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    iconBg: "bg-orange-100",
  },
  {
    key: "totalTutes",
    label: "Total Tutes",
    icon: BookOpen,
    gradient: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    iconBg: "bg-purple-100",
  },
  // Row 2: Engagement metrics
  {
    key: "totalStudents",
    label: "Total Students",
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    key: "totalViews",
    label: "Total Views",
    icon: Eye,
    gradient: "from-cyan-500 to-cyan-600",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-600",
    iconBg: "bg-cyan-100",
  },
  {
    key: "totalSubmissions",
    label: "Paper Submissions",
    icon: TrendingUp,
    gradient: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    iconBg: "bg-pink-100",
  },
];

export function TeacherDashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        const value = stats[card.key as keyof TeacherDashboardStats];

        return (
          <div
            key={card.key}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 ${card.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <Icon className={card.textColor} size={28} />
                </div>
                <div className={`px-3 py-1 ${card.bgColor} ${card.textColor} rounded-full text-xs font-semibold`}>
                  Live
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}