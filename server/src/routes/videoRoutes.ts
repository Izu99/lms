import express from 'express';
import { uploadVideo as videoUploadMiddleware } from '../config/videoUpload';
import { protect, requireVideoAccess } from '../modules/shared/middleware/auth';
import * as videoController from '../controllers/videoController';

const router = express.Router();

// Video CRUD operations - require video access for creation and modification
router.post('/', protect, requireVideoAccess, videoUploadMiddleware.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), videoController.uploadVideo);
router.get('/', protect, videoController.getAllVideos);
router.get('/:id', protect, videoController.getVideoById);
router.put('/:id', protect, requireVideoAccess, videoUploadMiddleware.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), videoController.updateVideo);
router.delete('/:id', protect, requireVideoAccess, videoController.deleteVideo);

// NEW: Route to increment view count
router.post('/:id/view', protect, videoController.incrementViewCount);

// Routes for video analytics
router.post('/:id/watch', protect, videoController.recordWatch);
router.get('/:id/analytics', protect, videoController.getVideoAnalytics);

export default router;
