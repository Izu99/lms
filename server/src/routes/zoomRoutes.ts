import express from 'express';
import { protect } from '../modules/shared/middleware/auth';
import * as zoomController from '../controllers/zoomController';

const router = express.Router();

router.get('/', protect, zoomController.getZoomLinks);
router.post('/', protect, zoomController.createZoomLink);
router.delete('/:id', protect, zoomController.deleteZoomLink);

export default router;
