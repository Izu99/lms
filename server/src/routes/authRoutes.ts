import express from 'express';
import { 
  register, 
  login, 
  checkUsername,
  getCurrentUser, 
  getUserProfile, 
  updateUserProfile,
  getAllStudents,
  updateStudentStatus
} from '../controllers/authController';
import { protect } from '../modules/shared/middleware/auth';
import { uploadIdCard } from '../config/idCardUpload';

const router = express.Router();

router.post('/register', uploadIdCard.fields([
  { name: 'idCardFront', maxCount: 1 },
  { name: 'idCardBack', maxCount: 1 }
]), register);
router.post('/login', login);
router.post('/check-username', checkUsername);
router.get('/me', protect, getCurrentUser);

// Profile endpoints
router.get('/users/:id', protect, getUserProfile);
router.put('/users/:id', protect, uploadIdCard.fields([
  { name: 'idCardFront', maxCount: 1 },
  { name: 'idCardBack', maxCount: 1 }
]), updateUserProfile);

// Student management endpoints (Teachers only)
router.get('/students', protect, getAllStudents);
router.put('/students/:studentId/status', protect, updateStudentStatus);

export default router;
