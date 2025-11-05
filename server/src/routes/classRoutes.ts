import express from 'express';
import { protect } from '../modules/shared/middleware/auth';
import * as instituteController from '../controllers/classController';

const router = express.Router();

router.get('/', instituteController.getAllInstitutes);
router.post('/', protect, instituteController.createInstitute);
router.get('/:id', protect, instituteController.getInstituteById);
router.put('/:id', protect, instituteController.updateInstitute);
router.delete('/:id', protect, instituteController.deleteInstitute);

export default router;
