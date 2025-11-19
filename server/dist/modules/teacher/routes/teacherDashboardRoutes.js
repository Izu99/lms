"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherDashboardController_1 = require("../controllers/teacherDashboardController");
const roleGuard_1 = require("../../shared/middleware/roleGuard");
const router = (0, express_1.Router)();
// All routes require teacher role
router.use(roleGuard_1.requireTeacher);
// GET /api/teacher/dashboard
router.get('/', teacherDashboardController_1.TeacherDashboardController.getDashboard);
// GET /api/teacher/dashboard/stats
router.get('/stats', teacherDashboardController_1.TeacherDashboardController.getStats);
// GET /api/teacher/dashboard/analytics
router.get('/analytics', teacherDashboardController_1.TeacherDashboardController.getAnalytics);
// GET /api/teacher/dashboard/performance-distribution
router.get('/performance-distribution', teacherDashboardController_1.TeacherDashboardController.getPerformanceDistribution);
// GET /api/teacher/dashboard/students
router.get('/students', teacherDashboardController_1.TeacherDashboardController.getStudents);
exports.default = router;
