import express from 'express';
import { upload } from '../config/multer';
import { authMiddleware } from '../middleware/auth';
import * as videoController from '../controllers/videoController';

const router = express.Router();

router.get('/', authMiddleware, videoController.getAllVideos);
router.get('/:id', authMiddleware, videoController.getVideoById);
router.post('/upload', authMiddleware, upload.single('video'), videoController.uploadVideo);
router.put('/:id', authMiddleware, videoController.updateVideo);
router.delete('/:id', authMiddleware, videoController.deleteVideo);

export default router;
