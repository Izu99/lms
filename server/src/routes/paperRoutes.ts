import express from 'express';
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
} from '../controllers/paperController';
import { protect } from '../modules/shared/middleware/auth';

const router = express.Router();

// Paper CRUD operations
router.post('/', protect, createPaper);
router.get('/', protect, getAllPapers);

// Paper attempts and results - MUST come before /:id routes
router.get('/results/my-results', protect, getStudentResults);
router.get('/student/all', protect, getAllPapersForStudent);
router.get('/my-results', protect, getStudentResults); // Alternative route
router.post('/:id/submit', protect, submitPaper);
router.get('/:id/results', protect, getPaperResults);
router.get('/:paperId/attempt', protect, getStudentAttemptForPaper);

// These must come last
router.get('/:id', protect, getPaperById);
router.put('/:id', protect, updatePaper);
router.delete('/:id', protect, deletePaper);

export default router;
