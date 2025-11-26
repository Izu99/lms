import express from 'express';
import { uploadVideo as videoUploadMiddleware } from '../config/videoUpload';
import { protect } from '../modules/shared/middleware/auth';
import * as videoController from '../controllers/videoController';

const router = express.Router();

router.post('/', protect, videoUploadMiddleware.fields([{ name: 'video', maxCount: 1 }, { name: 'previewImage', maxCount: 1 }]), videoController.uploadVideo);
router.get('/', protect, videoController.getAllVideos);
router.get('/:id', protect, videoController.getVideoById);
router.put('/:id', protect, videoUploadMiddleware.fields([{ name: 'video', maxCount: 1 }, { name: 'previewImage', maxCount: 1 }]), videoController.updateVideo);
router.delete('/:id', protect, videoController.deleteVideo);

// NEW: Route to increment view count
router.post('/:id/view', protect, videoController.incrementViewCount);

// Routes for video analytics
router.post('/:id/watch', protect, videoController.recordWatch);
router.get('/:id/analytics', protect, videoController.getVideoAnalytics);

export default router;
