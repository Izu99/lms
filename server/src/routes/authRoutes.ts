import express from 'express';
import { 
  register, 
  login, 
  getCurrentUser, 
  getUserProfile, 
  updateUserProfile,
  getAllStudents,
  updateStudentStatus
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);

// Profile endpoints
router.get('/users/:id', protect, getUserProfile);
router.put('/users/:id', protect, updateUserProfile);

// Student management endpoints (Teachers only)
router.get('/students', protect, getAllStudents);
router.put('/students/:studentId/status', protect, updateStudentStatus);

export default router;
