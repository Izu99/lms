import { ApiClient } from '../../shared/utils/api';
import { StudentDashboardData, StudentDashboardStats, StudentActivity } from '../types/dashboard.types';

export class StudentDashboardService {
  static async getDashboard(): Promise<StudentDashboardData> {
    return ApiClient.get<StudentDashboardData>('/student/dashboard');
  }

  static async getStats(): Promise<StudentDashboardStats> {
    return ApiClient.get<StudentDashboardStats>('/student/dashboard/stats');
  }

  static async getRecentActivity(limit = 10): Promise<StudentActivity[]> {
    return ApiClient.get<StudentActivity[]>(`/student/dashboard/activity?limit=${limit}`);
  }
}