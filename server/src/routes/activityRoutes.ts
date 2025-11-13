import express from 'express';
import { getDailyActivity } from '../controllers/activityController';
import { protect } from '../modules/shared/middleware/auth';
import { authorize } from '../modules/shared/middleware/authorize';

const router = express.Router();

router.get('/daily', protect, authorize(['teacher', 'admin']), getDailyActivity);

export default router;
