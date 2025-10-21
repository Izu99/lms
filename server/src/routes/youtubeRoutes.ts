import express from 'express';
import { protect } from '../middleware/auth';
import * as youtubeController from '../controllers/youtubeController';

const router = express.Router();

router.post('/', protect, youtubeController.createYoutubeLink);
router.get('/', protect, youtubeController.getAllYoutubeLinks);
router.get('/:id', protect, youtubeController.getYoutubeLinkById);
router.put('/:id', protect, youtubeController.updateYoutubeLink);
router.delete('/:id', protect, youtubeController.deleteYoutubeLink);

export default router;
