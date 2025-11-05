import { Router } from 'express';
import { StudentDashboardController } from '../controllers/studentDashboardController';
import { requireStudent } from '../../shared/middleware/roleGuard';

const router = Router();

// All routes require student role
router.use(requireStudent);

// GET /api/student/dashboard
router.get('/', StudentDashboardController.getDashboard);

// GET /api/student/dashboard/stats
router.get('/stats', StudentDashboardController.getStats);

// GET /api/student/dashboard/activity
router.get('/activity', StudentDashboardController.getRecentActivity);

export default router;