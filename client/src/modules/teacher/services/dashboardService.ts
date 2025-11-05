import { ApiClient } from '../../shared/utils/api';
import { 
  TeacherDashboardData, 
  TeacherDashboardStats, 
  TeacherAnalytics,
  StudentSummary 
} from '../types/dashboard.types';

export class TeacherDashboardService {
  static async getDashboard(): Promise<TeacherDashboardData> {
    return ApiClient.get<TeacherDashboardData>('/teacher/dashboard');
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