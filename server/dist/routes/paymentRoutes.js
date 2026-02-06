"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../modules/shared/middleware/auth");
const multer_1 = require("../config/multer");
const router = express_1.default.Router();
// Protected: User must be logged in to pay
router.post('/initiate', auth_1.protect, paymentController_1.initiatePayment);
router.post('/verify-sandbox', auth_1.protect, paymentController_1.verifySandboxPayment);
// Protected: Submit manual payment slip
router.post('/submit-manual', auth_1.protect, (req, res, next) => {
    // Inject uploadType for multer
    req.uploadType = 'payment-slip';
    next();
}, multer_1.upload.single('slip'), paymentController_1.submitManualPayment);
// Public: PayHere server calls this (Webhook)
router.post('/notify', paymentController_1.handleNotify);
// Public/Protected: Check status (Frontend polling)
// Leaving it public for simplicity on return page, but referenced by orderId which is random
router.get('/status', paymentController_1.getPaymentStatus);
exports.default = router;
