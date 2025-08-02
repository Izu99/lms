
import express from 'express';
import { getProfile, updateProfile, getStudents, allowStudent, getStudentCount } from '../controllers/users';
import { auth, teacherAuth } from '../middleware/auth';

const router = express.Router();

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/students', teacherAuth, getStudents);
router.post('/allow', teacherAuth, allowStudent);
router.get('/students/count', teacherAuth, getStudentCount);

export default router;
