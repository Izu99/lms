import express from 'express';
import { 
  register, 
  login, 
  checkUsername,
  getCurrentUser, 
  getUserProfile, 
  updateUserProfile,
  getAllStudents,
  updateStudentStatus,
  deleteStudent
} from '../controllers/authController';
import { protect } from '../modules/shared/middleware/auth';
import { upload } from '../config/multer'; // Import the centralized multer instance

const router = express.Router();

const setIdCardUpload = (req: any, res: any, next: any) => {
  req.uploadType = 'id-card';
  next();
};

router.post('/register', setIdCardUpload, upload.fields([ // Use the centralized upload instance
  { name: 'idCardFront', maxCount: 1 },
  { name: 'idCardBack', maxCount: 1 }
]), register); // uploadType is now set by middleware
router.post('/login', login);
router.post('/check-username', checkUsername);
router.get('/me', protect, getCurrentUser);

// Profile endpoints
router.get('/users/:id', protect, getUserProfile);
router.put('/users/:id', protect, setIdCardUpload, upload.fields([ // Use the centralized upload instance
  { name: 'idCardFront', maxCount: 1 },
  { name: 'idCardBack', maxCount: 1 }
]), updateUserProfile); // uploadType is now set by middleware

// Student management endpoints (Teachers only)
router.get('/students', protect, getAllStudents);
router.put('/students/:studentId/status', protect, updateStudentStatus);
router.delete('/students/:studentId', protect, deleteStudent);

export default router;
