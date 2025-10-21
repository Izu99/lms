import express from 'express';
import { uploadImage } from '../config/imageUpload';
import { uploadPaperOptionImage } from '../controllers/imageUploadController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Route for uploading paper option images
router.post('/upload/paper-options', protect, uploadImage.single('image'), uploadPaperOptionImage);

export default router;
