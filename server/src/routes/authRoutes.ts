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
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser);

// Profile endpoints
router.get('/users/:id', authMiddleware, getUserProfile);
router.put('/users/:id', authMiddleware, updateUserProfile);

// Student management endpoints (Teachers only)
router.get('/students', authMiddleware, getAllStudents);
router.put('/students/:studentId/status', authMiddleware, updateStudentStatus);

export default router;
