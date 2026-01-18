import express from 'express';
import { initiatePayment, handleNotify, getPaymentStatus, verifySandboxPayment } from '../controllers/paymentController';
import { protect } from '../modules/shared/middleware/auth';

const router = express.Router();

// Protected: User must be logged in to pay
router.post('/initiate', protect, initiatePayment);
router.post('/verify-sandbox', protect, verifySandboxPayment);

// Public: PayHere server calls this (Webhook)
router.post('/notify', handleNotify);

// Public/Protected: Check status (Frontend polling)
// Leaving it public for simplicity on return page, but referenced by orderId which is random
router.get('/status', getPaymentStatus);

export default router;
