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
import { upload } from '../config/multer'; // Import the centralized multer instance

const router = express.Router();

router.post('/register', upload.fields([ // Use the centralized upload instance
  { name: 'idCardFront', maxCount: 1 },
  { name: 'idCardBack', maxCount: 1 }
]), register); // Client must send 'uploadType: 'id-card' in the form data
router.post('/login', login);
router.post('/check-username', checkUsername);
router.get('/me', protect, getCurrentUser);

// Profile endpoints
router.get('/users/:id', protect, getUserProfile);
router.put('/users/:id', protect, upload.fields([ // Use the centralized upload instance
  { name: 'idCardFront', maxCount: 1 },
  { name: 'idCardBack', maxCount: 1 }
]), updateUserProfile); // Client must send 'uploadType: 'id-card' in the form data

// Student management endpoints (Teachers only)
router.get('/students', protect, getAllStudents);
router.put('/students/:studentId/status', protect, updateStudentStatus);

export default router;
