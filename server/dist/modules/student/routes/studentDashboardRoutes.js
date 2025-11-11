"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentDashboardController_1 = require("../controllers/studentDashboardController");
const roleGuard_1 = require("../../shared/middleware/roleGuard");
const router = (0, express_1.Router)();
// All routes require student role
router.use(roleGuard_1.requireStudent);
// GET /api/student/dashboard
router.get('/', studentDashboardController_1.StudentDashboardController.getDashboard);
// GET /api/student/dashboard/stats
router.get('/stats', studentDashboardController_1.StudentDashboardController.getStats);
// GET /api/student/dashboard/activity
router.get('/activity', studentDashboardController_1.StudentDashboardController.getRecentActivity);
exports.default = router;
