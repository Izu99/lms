import { Request, Response } from 'express';
import { StudentDashboardService } from '../services/studentDashboardService';
import { ResponseHelper } from '../../shared/utils/responseHelper';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    username: string;
  };
}

export class StudentDashboardController {
  static async getDashboard(req: AuthenticatedRequest, res: Response) {
    try {
      const studentId = req.user!.id;

      const [stats, recentVideos, availablePapers, recentActivity] = await Promise.all([
        StudentDashboardService.getDashboardStats(studentId),
        StudentDashboardService.getRecentVideos(studentId),
        StudentDashboardService.getAvailablePapers(studentId),
        StudentDashboardService.getRecentActivity(studentId)
      ]);

      const dashboardData = {
        stats,
        recentVideos,
        availablePapers,
        recentActivity
      };

      return ResponseHelper.success(res, dashboardData, 'Dashboard data retrieved successfully');
    } catch (error) {
      console.error('Error fetching student dashboard:', error);
      return ResponseHelper.serverError(res, 'Failed to fetch dashboard data');
    }
  }

  static async getStats(req: AuthenticatedRequest, res: Response) {
    try {
      const studentId = req.user!.id;
      const stats = await StudentDashboardService.getDashboardStats(studentId);
      
      return ResponseHelper.success(res, stats, 'Statistics retrieved successfully');
    } catch (error) {
      console.error('Error fetching student stats:', error);
      return ResponseHelper.serverError(res, 'Failed to fetch statistics');
    }
  }

  static async getRecentActivity(req: AuthenticatedRequest, res: Response) {
    try {
      const studentId = req.user!.id;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const activity = await StudentDashboardService.getRecentActivity(studentId, limit);
      
      return ResponseHelper.success(res, activity, 'Recent activity retrieved successfully');
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return ResponseHelper.serverError(res, 'Failed to fetch recent activity');
    }
  }
}