import express from 'express';
import { upload } from '../config/multer';
import { authMiddleware } from '../middleware/auth';
import * as videoController from '../controllers/videoController';

const router = express.Router();

router.post('/', authMiddleware, upload.single('video'), videoController.uploadVideo);
router.get('/', authMiddleware, videoController.getAllVideos);
router.get('/:id', authMiddleware, videoController.getVideoById);
router.put('/:id', authMiddleware, upload.single('video'), videoController.updateVideo);
router.delete('/:id', authMiddleware, videoController.deleteVideo);

// NEW: Route to increment view count
router.post('/:id/view', authMiddleware, videoController.incrementViewCount);

export default router;
