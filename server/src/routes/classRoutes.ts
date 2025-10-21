import express from 'express';
import { protect } from '../middleware/auth';
import * as classController from '../controllers/classController';

const router = express.Router();

router.get('/', protect, classController.getAllClasses);
router.post('/', protect, classController.createClass);
router.get('/:id', protect, classController.getClassById);
router.put('/:id', protect, classController.updateClass);
router.delete('/:id', protect, classController.deleteClass);

export default router;
