import express from 'express';
import { authMiddleware } from '../middleware/auth';
import * as yearController from '../controllers/yearController';

const router = express.Router();

router.get('/', authMiddleware, yearController.getAllYears);
router.post('/', authMiddleware, yearController.createYear);
router.get('/:id', authMiddleware, yearController.getYearById);
router.put('/:id', authMiddleware, yearController.updateYear);
router.delete('/:id', authMiddleware, yearController.deleteYear);

export default router;
