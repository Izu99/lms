import { Router } from 'express';
import teacherDashboardRoutes from './teacherDashboardRoutes';
// Import other teacher routes as they are created
// import teacherVideoRoutes from './teacherVideoRoutes';
// import teacherPaperRoutes from './teacherPaperRoutes';
// import teacherStudentRoutes from './teacherStudentRoutes';

const router = Router();

// Mount teacher routes
router.use('/dashboard', teacherDashboardRoutes);
// router.use('/videos', teacherVideoRoutes);
// router.use('/papers', teacherPaperRoutes);
// router.use('/students', teacherStudentRoutes);

export default router;