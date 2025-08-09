import express from 'express';
import {
  createPaper,
  getAllPapers,
  getPaperById,
  submitPaper,
  getStudentResults,
  getPaperResults,
  updatePaper, // Add these
  deletePaper, // Add these
} from '../controllers/paperController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Paper CRUD operations
router.post('/', authMiddleware, createPaper);
router.get('/', authMiddleware, getAllPapers);
router.get('/:id', authMiddleware, getPaperById);
router.put('/:id', authMiddleware, updatePaper);
router.delete('/:id', authMiddleware, deletePaper);

// Paper attempts and results
router.post('/:id/submit', authMiddleware, submitPaper);
router.get('/results/my-results', authMiddleware, getStudentResults);
router.get('/:id/results', authMiddleware, getPaperResults);

export default router;
