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
import { protect } from '../middleware/auth';

const router = express.Router();

// Paper CRUD operations
router.post('/', protect, createPaper);
router.get('/', protect, getAllPapers);
router.get('/:id', protect, getPaperById);
router.put('/:id', protect, updatePaper);
router.delete('/:id', protect, deletePaper);

// Paper attempts and results
router.post('/:id/submit', protect, submitPaper);
router.get('/results/my-results', protect, getStudentResults);
router.get('/:id/results', protect, getPaperResults);
router.get('/student/all', protect, getAllPapersForStudent);
router.get('/:paperId/attempt', protect, getStudentAttemptForPaper);

export default router;
