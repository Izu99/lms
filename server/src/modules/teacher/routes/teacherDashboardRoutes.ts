import { Router } from 'express';
import { TeacherDashboardController } from '../controllers/teacherDashboardController';
import { requireTeacher } from '../../shared/middleware/roleGuard';

const router = Router();

// All routes require teacher role
router.use(requireTeacher);

// GET /api/teacher/dashboard
router.get('/', TeacherDashboardController.getDashboard);

// GET /api/teacher/dashboard/stats
router.get('/stats', TeacherDashboardController.getStats);

// GET /api/teacher/dashboard/analytics
router.get('/analytics', TeacherDashboardController.getAnalytics);

// GET /api/teacher/dashboard/performance-distribution
router.get('/performance-distribution', TeacherDashboardController.getPerformanceDistribution);

// GET /api/teacher/dashboard/students
router.get('/students', TeacherDashboardController.getStudents);

export default router;