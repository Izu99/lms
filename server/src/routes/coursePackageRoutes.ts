import express from 'express';
import { protect } from '../modules/shared/middleware/auth';
import {
  getCoursePackages,
  getCoursePackageById,
  createCoursePackage,
  updateCoursePackage,
  deleteCoursePackage,
} from '../controllers/coursePackageController';
import { uploadPackageImage } from '../config/packageImageUpload';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getCoursePackages)
  .post(uploadPackageImage.single('image'), createCoursePackage);

router.route('/:id')
  .get(getCoursePackageById)
  .put(uploadPackageImage.single('image'), updateCoursePackage)
  .delete(deleteCoursePackage);

export default router;
