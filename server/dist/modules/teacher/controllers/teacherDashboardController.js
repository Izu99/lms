"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherDashboardController = void 0;
const teacherDashboardService_1 = require("../services/teacherDashboardService");
const responseHelper_1 = require("../../shared/utils/responseHelper");
class TeacherDashboardController {
    static async getDashboard(req, res) {
        try {
            const teacherId = req.user.id;
            const [stats, recentVideos, recentPapers, students] = await Promise.all([
                teacherDashboardService_1.TeacherDashboardService.getDashboardStats(teacherId),
                teacherDashboardService_1.TeacherDashboardService.getRecentVideos(teacherId),
                teacherDashboardService_1.TeacherDashboardService.getRecentPapers(teacherId),
                teacherDashboardService_1.TeacherDashboardService.getStudentsSummary(teacherId)
            ]);
            const dashboardData = {
                stats,
                recentVideos,
                recentPapers,
                students
            };
            return responseHelper_1.ResponseHelper.success(res, dashboardData, 'Dashboard data retrieved successfully');
        }
        catch (error) {
            console.error('Error fetching teacher dashboard:', error);
            return responseHelper_1.ResponseHelper.serverError(res, 'Failed to fetch dashboard data');
        }
    }
    static async getStats(req, res) {
        try {
            const teacherId = req.user.id;
            const stats = await teacherDashboardService_1.TeacherDashboardService.getDashboardStats(teacherId);
            return responseHelper_1.ResponseHelper.success(res, stats, 'Statistics retrieved successfully');
        }
        catch (error) {
            console.error('Error fetching teacher stats:', error);
            return responseHelper_1.ResponseHelper.serverError(res, 'Failed to fetch statistics');
        }
    }
    static async getAnalytics(req, res) {
        try {
            const teacherId = req.user.id;
            const days = parseInt(req.query.days) || 30;
            const analytics = await teacherDashboardService_1.TeacherDashboardService.getAnalytics(teacherId, days);
            return responseHelper_1.ResponseHelper.success(res, analytics, 'Analytics retrieved successfully');
        }
        catch (error) {
            console.error('Error fetching teacher analytics:', error);
            return responseHelper_1.ResponseHelper.serverError(res, 'Failed to fetch analytics');
        }
    }
    static async getStudents(req, res) {
        try {
            const teacherId = req.user.id;
            const limit = parseInt(req.query.limit) || 10;
            const students = await teacherDashboardService_1.TeacherDashboardService.getStudentsSummary(teacherId, limit);
            return responseHelper_1.ResponseHelper.success(res, students, 'Students retrieved successfully');
        }
        catch (error) {
            console.error('Error fetching students:', error);
            return responseHelper_1.ResponseHelper.serverError(res, 'Failed to fetch students');
        }
    }
}
exports.TeacherDashboardController = TeacherDashboardController;
