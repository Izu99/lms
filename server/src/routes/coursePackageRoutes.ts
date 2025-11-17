import express from 'express';
import { protect } from '../modules/shared/middleware/auth';
import {
  getCoursePackages,
  getCoursePackageById,
  createCoursePackage,
  updateCoursePackage,
  deleteCoursePackage,
} from '../controllers/coursePackageController';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getCoursePackages)
  .post(createCoursePackage);

router.route('/:id')
  .get(getCoursePackageById)
  .put(updateCoursePackage)
  .delete(deleteCoursePackage);

export default router;
