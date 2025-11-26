import { api as ApiClient } from '@/lib/api-client';
import {
  TeacherDashboardData,
  TeacherDashboardStats,
  TeacherAnalytics,
  StudentSummary,
  DailyActivity,
  PerformanceDistributionData
} from '../types/dashboard.types';

export class TeacherDashboardService {
  static async getDashboard(): Promise<TeacherDashboardData> {
    const [dashboardResponse, activityResponse, statsResponse, performanceDistributionResponse] = await Promise.all([
      ApiClient.get<{ success: boolean; data: Omit<TeacherDashboardData, 'dailyActivity' | 'stats'> }>('/teacher/dashboard'),
      ApiClient.get<{ success: boolean; data: { activity: DailyActivity[] } }>('/activity/daily'),
      ApiClient.get<{ success: boolean; data: TeacherDashboardStats }>('/teacher/dashboard/stats'),
      ApiClient.get<{ success: boolean; data: PerformanceDistributionData[] }>('/teacher/dashboard/performance-distribution')
    ]);

    return {
      ...dashboardResponse.data.data,
      stats: statsResponse.data.data,
      dailyActivity: activityResponse.data?.data?.activity || [],
      performanceDistribution: performanceDistributionResponse.data.data || [],
    };
  }

  static async getStats(): Promise<TeacherDashboardStats> {
    const response = await ApiClient.get<{ success: boolean; data: TeacherDashboardStats }>('/teacher/dashboard/stats');
    return response.data.data;
  }

  static async getAnalytics(days = 30): Promise<TeacherAnalytics> {
    const response = await ApiClient.get<{ success: boolean; data: TeacherAnalytics }>(`/teacher/dashboard/analytics?days=${days}`);
    return response.data.data;
  }

  static async getPerformanceDistribution(): Promise<PerformanceDistributionData[]> {
    const response = await ApiClient.get<{ success: boolean; data: PerformanceDistributionData[] }>('/teacher/dashboard/performance-distribution');
    return response.data.data;
  }

  static async getStudents(limit = 10): Promise<StudentSummary[]> {
    const response = await ApiClient.get<{ success: boolean; data: StudentSummary[] }>(`/teacher/dashboard/students?limit=${limit}`);
    return response.data.data;
  }
}