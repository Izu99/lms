"use client";

import { Video, BookOpen, Clock, Award } from "lucide-react";

interface StudentDashboardStats {
  availableVideos?: number;
  availablePapers?: number;
  completedPapers?: number;
  averageScore?: number;
}

interface DashboardStatsProps {
  stats: StudentDashboardStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      icon: Video,
      label: "Available Videos",
      value: stats.availableVideos ?? 0,
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      icon: BookOpen,
      label: "Available Papers",
      value: stats.availablePapers ?? 0,
      bgColor: "bg-green-50 dark:bg-green-950/30",
      iconColor: "text-green-600 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      icon: Clock,
      label: "Completed Papers",
      value: stats.completedPapers ?? 0,
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      icon: Award,
      label: "Average Score",
      value: `${(stats.averageScore ?? 0).toFixed(1)}%`,
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`relative overflow-hidden bg-white dark:bg-gray-900 border ${card.borderColor} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.bgColor} ${card.borderColor} border p-3 rounded-xl`}>
                <Icon className={card.iconColor} size={24} strokeWidth={2} />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.label}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {card.value}
              </p>
            </div>

            <div className={`absolute -bottom-2 -right-2 w-20 h-20 ${card.bgColor} rounded-full opacity-20`}></div>
          </div>
        );
      })}
    </div>
  );
}

// Example usage
export default function App() {
  const sampleStats: StudentDashboardStats = {
    availableVideos: 24,
    availablePapers: 12,
    completedPapers: 8,
    averageScore: 87.5,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Student Dashboard
        </h1>
        <DashboardStats stats={sampleStats} />
      </div>
    </div>
  );
}