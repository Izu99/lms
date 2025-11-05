"use client";

import { Video, BookOpen, Users, Eye, TrendingUp, Award } from "lucide-react";
import { TeacherDashboardStats } from "../types/dashboard.types";

interface DashboardStatsProps {
  stats: TeacherDashboardStats;
}

export function TeacherDashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Video className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">My Videos</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalVideos}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Eye className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Views</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Students</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-orange-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Engagement</p>
            <p className="text-2xl font-bold text-gray-900">{stats.averageEngagement.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}