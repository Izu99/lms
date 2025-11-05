import express from 'express';
import { uploadImage } from '../config/imageUpload';
import { uploadIdCard } from '../config/idCardUpload';
import { uploadPaperContent } from '../config/paperContentUpload';
import { uploadExplanationImage as uploadExplanationImageConfig } from '../config/explanationUpload';
import { uploadPaperOptionImage, uploadIdCardImage, uploadPaperContentImage, uploadExplanationImage } from '../controllers/imageUploadController';
import { protect } from '../modules/shared/middleware/auth';

const router = express.Router();

// Route for uploading paper option images
router.post('/upload/paper-options', protect, uploadImage.single('image'), uploadPaperOptionImage);

// Route for uploading id card images
router.post('/upload/id-card', protect, uploadIdCard.single('image'), uploadIdCardImage);

// Route for uploading paper content images
router.post('/upload/paper-content', protect, uploadPaperContent.single('image'), uploadPaperContentImage);

// Route for uploading explanation images (විවරණ images)
router.post('/upload/explanation', protect, uploadExplanationImageConfig.single('image'), uploadExplanationImage);

export default router;
