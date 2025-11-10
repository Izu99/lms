import express from 'express';
import * as videoStatsController from '../controllers/videoStatsController';
import { StudentDashboardController } from '../controllers/studentDashboardController';

const router = express.Router();

router.get('/video-stats', videoStatsController.getVideoStats);
router.get('/dashboard', StudentDashboardController.getDashboard);
router.get('/dashboard/stats', StudentDashboardController.getStats);
router.get('/dashboard/activity', StudentDashboardController.getRecentActivity);

export default router;
