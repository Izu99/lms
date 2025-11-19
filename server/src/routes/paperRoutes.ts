import express from 'express';
import { upload } from '../config/multer';
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
  downloadStudentAttemptFile, // Add this for downloading student answers
  updateStudentAttemptMarks, // Add this for updating marks
} from '../controllers/paperController';
import { protect } from '../modules/shared/middleware/auth';

const router = express.Router();

// Paper CRUD operations
router.post('/', protect, createPaper);
router.get('/', protect, getAllPapers);
router.post('/upload', protect, upload.single('file'), uploadPaperPdf);

// Paper attempts and results - MUST come before /:id routes
router.get('/results/my-results', protect, getStudentResults);
router.get('/student/all', protect, getAllPapersForStudent);
router.get('/my-results', protect, getStudentResults); // Alternative route
router.post('/:id/submit', protect, submitPaper);
  router.get('/:id/results', protect, getPaperResults);
router.get('/:paperId/attempt', protect, getStudentAttemptForPaper);
router.get('/attempts/:attemptId/download', protect, downloadStudentAttemptFile); // New route for downloading student answer files
router.put('/attempts/:attemptId/marks', protect, updateStudentAttemptMarks); // New route for updating student marks

// These must come last
router.get('/:id', protect, getPaperById);
router.put('/:id', protect, updatePaper);
router.delete('/:id', protect, deletePaper);

export default router;
