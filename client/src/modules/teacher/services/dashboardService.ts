import { ApiClient } from '../../shared/utils/api';
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

    console.log("Dashboard Response:", dashboardResponse);
    console.log("Activity Response:", activityResponse);

    return {
      ...dashboardResponse,
      dailyActivity: activityResponse?.activity || [], // Safely access activityResponse.activity
    };
  }

  static async getStats(): Promise<TeacherDashboardStats> {
    return ApiClient.get<TeacherDashboardStats>('/teacher/dashboard/stats');
  }

  static async getAnalytics(days = 30): Promise<TeacherAnalytics> {
    return ApiClient.get<TeacherAnalytics>(`/teacher/dashboard/analytics?days=${days}`);
  }

  static async getStudents(limit = 10): Promise<StudentSummary[]> {
    return ApiClient.get<StudentSummary[]>(`/teacher/dashboard/students?limit=${limit}`);
  }
}