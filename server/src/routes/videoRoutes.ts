import express from 'express';
import { upload } from '../config/multer';
import { protect } from '../modules/shared/middleware/auth';
import * as videoController from '../controllers/videoController';

const router = express.Router();

router.post('/', protect, upload.single('video'), videoController.uploadVideo);
router.get('/', protect, videoController.getAllVideos);
router.get('/:id', protect, videoController.getVideoById);
router.put('/:id', protect, upload.single('video'), videoController.updateVideo);
router.delete('/:id', protect, videoController.deleteVideo);

// NEW: Route to increment view count
router.post('/:id/view', protect, videoController.incrementViewCount);

export default router;
