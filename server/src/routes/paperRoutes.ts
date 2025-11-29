import express from 'express';
import { uploadPdf } from '../config/multer';
import { uploadPaper } from '../config/paperUpload';
import {
  createPaper,
  getAllPapers,
  getPaperById,
  submitPaper,
  getStudentResults,
  getAllPapersForStudent,
  getPaperResults,
  updatePaper, // Add these
  deletePaper, // Add these
  getStudentAttemptForPaper,
  uploadPaperPdf,
  getAttemptById, // Add this
  downloadStudentAttemptFile, // Add this for downloading student answers
  updateStudentAttemptMarks, // Add this for updating marks
  uploadTeacherReviewFile, // Add this for uploading teacher review files
} from '../controllers/paperController';
import { protect, requirePaperAccess } from '../modules/shared/middleware/auth';

// Middleware to set uploadType BEFORE multer processes files
const setUploadTypeStudentAnswer = (req: any, res: any, next: any) => {
  req.uploadType = 'structure-student-answer';
  console.log('🔧 [MIDDLEWARE] Set uploadType:', req.uploadType);
  next();
};

const setUploadTypeTeacherReview = (req: any, res: any, next: any) => {
  req.uploadType = 'structure-teacher-review';
  console.log('🔧 [MIDDLEWARE] Set uploadType:', req.uploadType);
  next();
};

const router = express.Router();

// Paper CRUD operations - require paper access for creation
router.post('/', protect, requirePaperAccess, uploadPaper.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), createPaper);
router.get('/', protect, getAllPapers);
router.post('/upload', protect, setUploadTypeStudentAnswer, uploadPdf.single('file'), uploadPaperPdf);

// Paper attempts and results - MUST come before /:id routes
router.get('/results/my-results', protect, getStudentResults);
router.get('/student/all', protect, getAllPapersForStudent);
router.get('/my-results', protect, getStudentResults); // Alternative route
router.post('/:id/submit', protect, submitPaper);
router.get('/:id/results', protect, requirePaperAccess, getPaperResults);
router.get('/:paperId/attempt', protect, getStudentAttemptForPaper);

// New routes for attempts by ID
router.get('/attempts/:attemptId', protect, getAttemptById); // New route
router.get('/attempts/:attemptId/download', protect, downloadStudentAttemptFile); // New route for downloading student answer files
router.post('/attempts/:attemptId/upload-review', protect, requirePaperAccess, setUploadTypeTeacherReview, uploadPdf.single('file'), uploadTeacherReviewFile); // Require paper access for review uploads
router.put('/attempts/:attemptId/marks', protect, requirePaperAccess, updateStudentAttemptMarks); // Require paper access for marking

// These must come last - require paper access for modification
router.get('/:id', protect, getPaperById);
router.put('/:id', protect, requirePaperAccess, uploadPaper.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), updatePaper);
router.delete('/:id', protect, requirePaperAccess, deletePaper);

export default router;
