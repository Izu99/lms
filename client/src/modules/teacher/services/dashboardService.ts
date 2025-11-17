import { api as ApiClient } from '@/lib/api-client';
import { 
  TeacherDashboardData, 
  TeacherDashboardStats, 
  TeacherAnalytics,
  StudentSummary,
  DailyActivity // New import
} from '../types/dashboard.types';

export class TeacherDashboardService {
  static async getDashboard(): Promise<TeacherDashboardData> {
    const [dashboardResponse, activityResponse] = await Promise.all([
      ApiClient.get<Omit<TeacherDashboardData, 'dailyActivity'>>('/teacher/dashboard'),
      ApiClient.get<{ success: boolean; activity: DailyActivity[] }>('/activity/daily')
    ]);

    return {
      ...dashboardResponse.data,
      dailyActivity: activityResponse.data?.activity || [], // Safely access activityResponse.activity
    };
  }

  static async getStats(): Promise<TeacherDashboardStats> {
    const response = await ApiClient.get<TeacherDashboardStats>('/teacher/dashboard/stats');
    return response.data;
  }

  static async getAnalytics(days = 30): Promise<TeacherAnalytics> {
    const response = await ApiClient.get<TeacherAnalytics>(`/teacher/dashboard/analytics?days=${days}`);
    return response.data;
  }

  static async getStudents(limit = 10): Promise<StudentSummary[]> {
    const response = await ApiClient.get<StudentSummary[]>(`/teacher/dashboard/students?limit=${limit}`);
    return response.data;
  }
}