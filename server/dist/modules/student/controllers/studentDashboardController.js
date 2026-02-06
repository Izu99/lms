"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentDashboardController = void 0;
const studentDashboardService_1 = require("../services/studentDashboardService");
const responseHelper_1 = require("../../shared/utils/responseHelper");
class StudentDashboardController {
    static async getDashboard(req, res) {
        try {
            const studentId = req.user.id;
            const academicLevel = req.user.academicLevel;
            const [stats, recentVideos, availablePapers, recentActivity] = await Promise.all([
                studentDashboardService_1.StudentDashboardService.getDashboardStats(studentId, academicLevel),
                studentDashboardService_1.StudentDashboardService.getRecentVideos(studentId, academicLevel),
                studentDashboardService_1.StudentDashboardService.getAvailablePapers(studentId, academicLevel),
                studentDashboardService_1.StudentDashboardService.getRecentActivity(studentId)
            ]);
            const dashboardData = {
                stats,
                recentVideos,
                availablePapers,
                recentActivity
            };
            return responseHelper_1.ResponseHelper.success(res, dashboardData, 'Dashboard data retrieved successfully');
        }
        catch (error) {
            console.error('Error fetching student dashboard:', error);
            return responseHelper_1.ResponseHelper.serverError(res, 'Failed to fetch dashboard data');
        }
    }
    static async getStats(req, res) {
        try {
            const studentId = req.user.id;
            const academicLevel = req.user.academicLevel;
            const stats = await studentDashboardService_1.StudentDashboardService.getDashboardStats(studentId, academicLevel);
            return responseHelper_1.ResponseHelper.success(res, stats, 'Statistics retrieved successfully');
        }
        catch (error) {
            console.error('Error fetching student stats:', error);
            return responseHelper_1.ResponseHelper.serverError(res, 'Failed to fetch statistics');
        }
    }
    static async getRecentActivity(req, res) {
        try {
            const studentId = req.user.id;
            const limit = parseInt(req.query.limit) || 10;
            const activity = await studentDashboardService_1.StudentDashboardService.getRecentActivity(studentId, limit);
            return responseHelper_1.ResponseHelper.success(res, activity, 'Recent activity retrieved successfully');
        }
        catch (error) {
            console.error('Error fetching recent activity:', error);
            return responseHelper_1.ResponseHelper.serverError(res, 'Failed to fetch recent activity');
        }
    }
}
exports.StudentDashboardController = StudentDashboardController;
