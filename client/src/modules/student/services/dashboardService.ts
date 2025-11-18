import { api as ApiClient } from '@/lib/api-client';
import { StudentDashboardData, StudentDashboardStats, StudentActivity } from '../types/dashboard.types';

export class StudentDashboardService {
  static async getDashboard(): Promise<StudentDashboardData> {
    const response = await ApiClient.get<{ success: boolean; data: StudentDashboardData }>('/student/dashboard');
    return response.data.data;
  }

  static async getStats(): Promise<StudentDashboardStats> {
    const response = await ApiClient.get<{ success: boolean; data: StudentDashboardStats }>('/student/dashboard/stats');
    return response.data.data;
  }

  static async getRecentActivity(limit = 10): Promise<StudentActivity[]> {
    const response = await ApiClient.get<{ success: boolean; data: StudentActivity[] }>(`/student/dashboard/activity?limit=${limit}`);
    return response.data.data;
  }
}