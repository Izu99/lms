import express from 'express';
import { authMiddleware } from '../middleware/auth';
import * as classController from '../controllers/classController';

const router = express.Router();

router.get('/', authMiddleware, classController.getAllClasses);
router.post('/', authMiddleware, classController.createClass);
router.get('/:id', authMiddleware, classController.getClassById);
router.put('/:id', authMiddleware, classController.updateClass);
router.delete('/:id', authMiddleware, classController.deleteClass);

export default router;
