import { Request, Response } from 'express';
import { TeacherDashboardService } from '../services/teacherDashboardService';
import { ResponseHelper } from '../../shared/utils/responseHelper';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    username: string;
  };
}

export class TeacherDashboardController {
  static async getDashboard(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.user!.id;

      const [stats, recentVideos, recentPapers, students] = await Promise.all([
        TeacherDashboardService.getDashboardStats(teacherId),
        TeacherDashboardService.getRecentVideos(teacherId),
        TeacherDashboardService.getRecentPapers(teacherId),
        TeacherDashboardService.getStudentsSummary(teacherId)
      ]);

      const dashboardData = {
        stats,
        recentVideos,
        recentPapers,
        students
      };

      return ResponseHelper.success(res, dashboardData, 'Dashboard data retrieved successfully');
    } catch (error) {
      console.error('Error fetching teacher dashboard:', error);
      return ResponseHelper.serverError(res, 'Failed to fetch dashboard data');
    }
  }

  static async getStats(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.user!.id;
      const stats = await TeacherDashboardService.getDashboardStats(teacherId);
      
      return ResponseHelper.success(res, stats, 'Statistics retrieved successfully');
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
      return ResponseHelper.serverError(res, 'Failed to fetch statistics');
    }
  }

  static async getAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.user!.id;
      const days = parseInt(req.query.days as string) || 30;
      
      const analytics = await TeacherDashboardService.getAnalytics(teacherId, days);
      
      return ResponseHelper.success(res, analytics, 'Analytics retrieved successfully');
    } catch (error) {
      console.error('Error fetching teacher analytics:', error);
      return ResponseHelper.serverError(res, 'Failed to fetch analytics');
    }
  }

  static async getPerformanceDistribution(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.user!.id;
      const distribution = await TeacherDashboardService.getPerformanceDistribution(teacherId);
      return ResponseHelper.success(res, distribution, 'Performance distribution retrieved successfully');
    } catch (error) {
      console.error('Error fetching performance distribution:', error);
      return ResponseHelper.serverError(res, 'Failed to fetch performance distribution');
    }
  }

  static async getStudents(req: AuthenticatedRequest, res: Response) {
    try {
      const teacherId = req.user!.id;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const students = await TeacherDashboardService.getStudentsSummary(teacherId, limit);
      
      return ResponseHelper.success(res, students, 'Students retrieved successfully');
    } catch (error) {
      console.error('Error fetching students:', error);
      return ResponseHelper.serverError(res, 'Failed to fetch students');
    }
  }
}