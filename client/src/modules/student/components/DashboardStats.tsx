"use client";

import { Video, BookOpen, Clock, Award } from "lucide-react";
import { StudentDashboardStats } from "../types/dashboard.types";

interface DashboardStatsProps {
  stats: StudentDashboardStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="theme-card p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Video className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <p className="text-sm theme-text-secondary">Available Videos</p>
            <p className="text-2xl font-bold theme-text-primary">{stats.availableVideos}</p>
          </div>
        </div>
      </div>

      <div className="theme-card p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <BookOpen className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <div>
            <p className="text-sm theme-text-secondary">Available Papers</p>
            <p className="text-2xl font-bold theme-text-primary">{stats.availablePapers}</p>
          </div>
        </div>
      </div>

      <div className="theme-card p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <Clock className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <div>
            <p className="text-sm theme-text-secondary">Completed Papers</p>
            <p className="text-2xl font-bold theme-text-primary">{stats.completedPapers}</p>
          </div>
        </div>
      </div>

      <div className="theme-card p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
            <Award className="text-orange-600 dark:text-orange-400" size={24} />
          </div>
          <div>
            <p className="text-sm theme-text-secondary">Average Score</p>
            <p className="text-2xl font-bold theme-text-primary">{stats.averageScore.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}