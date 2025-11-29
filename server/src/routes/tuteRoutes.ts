import express from 'express';
import { protect } from '../modules/shared/middleware/auth';
import { uploadTute } from '../config/tuteUpload';
import {
  createTute,
  getTeacherTutes,
  getTuteById,
  updateTute,
  deleteTute,
  getStudentTutes
} from '../controllers/tuteController';

const router = express.Router();

// Teacher routes
router.post('/', protect, uploadTute.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), createTute);
router.get('/teacher', protect, getTeacherTutes);
router.get('/:id', protect, getTuteById);
router.put('/:id', protect, uploadTute.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), updateTute);
router.delete('/:id', protect, deleteTute);

// Student routes
router.get('/student/all', protect, getStudentTutes);

export default router;
