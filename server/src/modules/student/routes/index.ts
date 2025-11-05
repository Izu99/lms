import { Router } from 'express';
import studentDashboardRoutes from './studentDashboardRoutes';
// Import other student routes as they are created
// import studentVideoRoutes from './studentVideoRoutes';
// import studentPaperRoutes from './studentPaperRoutes';

const router = Router();

// Mount student routes
router.use('/dashboard', studentDashboardRoutes);
// router.use('/videos', studentVideoRoutes);
// router.use('/papers', studentPaperRoutes);

export default router;