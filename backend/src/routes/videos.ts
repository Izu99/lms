
import express from 'express';
import { uploadVideo, getVideos, getVideo, getVideoCount, deleteVideo, streamVideo } from '../controllers/videos';
import { auth, teacherAuth } from '../middleware/auth';
import upload from '../config/multer';

const router = express.Router();

router.post('/', teacherAuth, upload.single('video'), uploadVideo);
router.get('/', auth, getVideos);
router.get('/:id', auth, getVideo);
router.get('/count', teacherAuth, getVideoCount);
router.delete('/:id', teacherAuth, deleteVideo);
router.get('/stream/:filename', streamVideo);

export default router;
