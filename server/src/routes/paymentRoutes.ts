import express from 'express';
import { initiatePayment, handleNotify, getPaymentStatus, verifySandboxPayment, submitManualPayment } from '../controllers/paymentController';
import { protect } from '../modules/shared/middleware/auth';
import { upload } from '../config/multer';

const router = express.Router();

// Protected: User must be logged in to pay
router.post('/initiate', protect, initiatePayment);
router.post('/verify-sandbox', protect, verifySandboxPayment);

// Protected: Submit manual payment slip
router.post('/submit-manual', protect, (req, res, next) => {
    // Inject uploadType for multer
    (req as any).uploadType = 'payment-slip';
    next();
}, upload.single('slip'), submitManualPayment);

// Public: PayHere server calls this (Webhook)
router.post('/notify', handleNotify);

// Public/Protected: Check status (Frontend polling)
// Leaving it public for simplicity on return page, but referenced by orderId which is random
router.get('/status', getPaymentStatus);

export default router;
