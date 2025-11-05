import express from 'express';
import { protect } from '../modules/shared/middleware/auth';
import * as yearController from '../controllers/yearController';

const router = express.Router();

router.post('/', protect, yearController.createYear);
router.get('/', yearController.getAllYears);
router.get('/:id', protect, yearController.getYearById);
router.put('/:id', protect, yearController.updateYear);
router.delete('/:id', protect, yearController.deleteYear);

export default router;
