"use client";

import { Video, BookOpen, Clock, Award } from "lucide-react";
import { StudentDashboardStats } from "../types/dashboard.types";

interface DashboardStatsProps {
  stats: StudentDashboardStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Video className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Available Videos</p>
            <p className="text-2xl font-bold text-gray-900">{stats.availableVideos}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <BookOpen className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Available Papers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.availablePapers}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Clock className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed Papers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completedPapers}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Award className="text-orange-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="text-2xl font-bold text-gray-900">{stats.averageScore.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}