import express from 'express';
import { upload } from '../config/multer'; // Import the centralized multer instance
import { uploadPaperOptionImage, uploadIdCardImage, uploadPaperContentImage, uploadExplanationImage, deleteImage } from '../controllers/imageUploadController';
import { protect } from '../modules/shared/middleware/auth';

const router = express.Router();

// The 'protect' middleware is applied at the router level in index.ts/index.secure.ts,
// so it's not needed for each individual route here.

// Route for uploading paper option images (MCQ answers)
router.post('/upload/paper-options', (req, res, next) => {
  (req as any).uploadType = 'mcq-option'; // Maps to uploads/papers/mcq/options
  next();
}, upload.single('image'), uploadPaperOptionImage);

// Route for uploading question images
router.post('/upload/question', (req, res, next) => {
  (req as any).uploadType = 'mcq-question'; // Maps to uploads/papers/mcq/questions
  next();
}, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }
  // Use req.file.path for consistent path handling
  const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
  res.status(200).json({ imageUrl, message: 'Question image uploaded successfully.' });
});

// Route for uploading explanation images
router.post('/upload/explanation', (req, res, next) => {
  (req as any).uploadType = 'mcq-explanation'; // Maps to uploads/papers/mcq/explanations
  next();
}, upload.single('image'), uploadExplanationImage);

// Route for uploading id card images
router.post('/upload/id-card', (req, res, next) => {
  (req as any).uploadType = 'id-card'; // Maps to uploads/id-cards
  next();
}, upload.single('image'), uploadIdCardImage);

// Route for uploading paper content images
router.post('/upload/paper-content', (req, res, next) => {
  (req as any).uploadType = 'paper'; // Maps to uploads/paper
  next();
}, upload.single('image'), uploadPaperContentImage);

// Route for deleting an image
router.post('/delete', protect, deleteImage);

export default router;
