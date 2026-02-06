"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitManualPayment = exports.verifySandboxPayment = exports.getPaymentStatus = exports.handleNotify = exports.initiatePayment = void 0;
const Payment_1 = require("../models/Payment");
const User_1 = require("../models/User");
const Video_1 = require("../models/Video");
const Paper_1 = require("../models/Paper");
const Tute_1 = require("../models/Tute");
const CoursePackage_1 = require("../models/CoursePackage");
const crypto_1 = __importDefault(require("crypto"));
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID;
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET;
const PAYHERE_BASE_URL = process.env.PAYHERE_SANDBOX === 'true'
    ? 'https://sandbox.payhere.lk'
    : 'https://www.payhere.lk';
const APP_BASE_URL = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
// Make sure this matches your deployed backend URL in production
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
// Helper to generate md5 hash
const md5 = (str) => crypto_1.default.createHash('md5').update(str).digest('hex').toUpperCase();
const initiatePayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, itemModel } = req.body;
        let { amount, title } = req.body;
        // 1. Validation
        if (!userId || !itemId || !itemModel) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Fetch actual price and title from DB if not provided or for security
        let item = null;
        switch (itemModel) {
            case 'Video':
                item = await Video_1.Video.findById(itemId);
                break;
            case 'Paper':
                item = await Paper_1.Paper.findById(itemId);
                break;
            case 'Tute':
                item = await Tute_1.Tute.findById(itemId);
                break;
            case 'CoursePackage':
                item = await CoursePackage_1.CoursePackage.findById(itemId);
                break;
            default:
                return res.status(400).json({ message: 'Invalid item model' });
        }
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        // Override amount and title from DB to ensure accuracy
        amount = item.price;
        title = item.title;
        const metadata = {
            itemTitle: title,
            initiatedIp: req.ip,
            userAgent: req.headers['user-agent']
        };
        // Add paperType for correct redirection
        if (itemModel === 'Paper') {
            metadata.paperType = item.paperType;
        }
        const amountNum = Number(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            console.error(`Invalid amount for item ${itemId}: ${amount}`);
            return res.status(400).json({ message: 'This item is free or has no price set' });
        }
        // 2. User Details for PayHere (Pre-fill)
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // 3. Generate Unique Order ID
        // Format: LMS-{Timestamp}-{Random}
        const orderId = `LMS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const currency = 'LKR';
        const formattedAmount = amountNum.toFixed(2); // PayHere expects 2 decimal places
        console.log(`Starting payment initiation. Item: ${title}, Amount: ${amountNum}, OrderID: ${orderId}`);
        // 4. Create Pending Payment Record
        const payment = await Payment_1.Payment.create({
            userId,
            itemId,
            itemModel,
            amount: amountNum,
            currency,
            orderId,
            status: 'PENDING',
            metadata
        });
        console.log(`Payment record created: ${payment._id}, Amount: ${payment.amount}`);
        // 5. Hash Generation (Optional for simple checkout, but good practice if using Hash-based auth)
        // For standard Checkout API, the hash is generated CLIENT-SIDE or using the hidden fields.
        // However, to follow the "Secure" requirement, we will generate the hash here if using 
        // the "Automated" method, but for the standard Form POST, the hash is:
        // hash = strtoupper(md5(merchant_id + order_id + amount + currency + strtoupper(md5(merchant_secret)))) 
        const merchantSecretHash = md5(PAYHERE_MERCHANT_SECRET);
        const hashStr = PAYHERE_MERCHANT_ID + orderId + formattedAmount + currency + merchantSecretHash;
        const hash = md5(hashStr);
        // 6. Return Payload to Frontend
        const payload = {
            merchant_id: PAYHERE_MERCHANT_ID,
            return_url: `${APP_BASE_URL}/payment/status`, // Frontend status page
            cancel_url: `${APP_BASE_URL}/payment/status?cancel=true`, // Frontend status page with cancel flag
            notify_url: `${API_BASE_URL}/api/payments/notify`, // Backend webhook
            order_id: orderId,
            items: title || `${itemModel} Purchase`,
            currency: currency,
            amount: formattedAmount,
            first_name: user.firstName || 'Student',
            last_name: user.lastName || '',
            email: user.email,
            phone: user.phoneNumber,
            address: user.address || 'N/A',
            city: 'Colombo', // Default or fetch from user if available
            country: 'Sri Lanka',
            hash: hash, // Pre-calculated secure hash
            sandbox: process.env.PAYHERE_SANDBOX === 'true' ? '1' : '0'
        };
        console.log(`🚀 Initiating PayHere payment for order ${orderId}. Notify URL: ${payload.notify_url}`);
        return res.json({
            success: true,
            payhereUrl: `${PAYHERE_BASE_URL}/pay/checkout`,
            payload
        });
    }
    catch (error) {
        console.error('Initiate payment error:', error);
        return res.status(500).json({ message: 'Server error initiating payment' });
    }
};
exports.initiatePayment = initiatePayment;
const handleNotify = async (req, res) => {
    console.log('--- 🔔 PAYHERE NOTIFICATION START ---');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Raw Body:', JSON.stringify(req.body, null, 2));
    try {
        // 1. Extract Data
        const { merchant_id, order_id, payment_id, payhere_amount, payhere_currency, status_code, md5sig, custom_1, custom_2, method } = req.body;
        console.log(`🔔 PayHere Webhook received for Order: ${order_id}, Status: ${status_code}`);
        // basic validation
        if (!merchant_id || !order_id || !md5sig || !status_code) {
            console.warn('⚠️ PayHere Webhook: Missing required fields');
            return res.status(400).send('Invalid Request');
        }
        // 2. Validate Merchant ID
        if (merchant_id !== PAYHERE_MERCHANT_ID) {
            console.error('❌ PayHere Webhook: Merchant ID Mismatch');
            return res.status(400).send('Invalid Merchant');
        }
        // 3. Verify Signature (MD5)
        // md5sig = strtoupper(md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + strtoupper(md5(merchant_secret))))
        const merchantSecretHash = md5(PAYHERE_MERCHANT_SECRET);
        const localHashStr = merchant_id + order_id + payhere_amount + payhere_currency + status_code + merchantSecretHash;
        const localHash = md5(localHashStr);
        if (localHash !== md5sig) {
            console.error(`❌ PayHere Webhook: Signature verification failed.`);
            console.error(`Received md5sig: ${md5sig}`);
            console.error(`Calculated localHash: ${localHash}`);
            console.error(`Local hash string used: ${localHashStr}`);
            return res.status(400).send('Invalid Signature');
        }
        // 4. Locate Payment Record
        const payment = await Payment_1.Payment.findOne({ orderId: order_id });
        if (!payment) {
            console.error(`❌ PayHere Webhook: Order not found: ${order_id}`);
            return res.status(404).send('Order not found'); // PayHere will retry if we send non-200
        }
        // 5. Data Integrity Check (Amount & Currency)
        // Note: payhere_amount is string "100.00", payment.amount is number 100
        if (Number(payhere_amount) !== Number(payment.amount)) {
            console.error(`❌ PayHere Webhook: Amount mismatch. PayHere: ${payhere_amount}, DB: ${payment.amount}`);
            // Log this anomaly but don't process status change to avoid fraud
            payment.status = 'FAILED';
            payment.metadata = { ...payment.metadata, failureReason: 'Amount mismatch', webhookPayload: req.body };
            await payment.save();
            return res.status(200).send('Acknowledged with error');
        }
        // 6. Update Status
        // Status Codes: 
        // 2 = Success
        // 0 = Pending
        // -1 = Canceled
        // -2 = Failed
        // -3 = Charged Back
        const statusCodeInt = parseInt(status_code, 10);
        let newStatus = 'PENDING';
        if (statusCodeInt === 2) {
            newStatus = 'PAID';
        }
        else if (statusCodeInt === 0) {
            newStatus = 'PENDING';
        }
        else if (statusCodeInt === -1 || statusCodeInt === -2) {
            newStatus = 'FAILED';
        }
        else if (statusCodeInt === -3) {
            newStatus = 'REVERSED';
        }
        // Idempotency: If already paid, don't revert to pending
        if (payment.status === 'PAID' && newStatus !== 'REVERSED') {
            console.log(`ℹ️ Order ${order_id} is already PAID. Skipping update.`);
            return res.status(200).send('OK');
        }
        payment.status = newStatus;
        payment.paymentId = payment_id;
        // Append webhook log to metadata for audit
        payment.metadata = {
            ...payment.metadata,
            lastWebhook: {
                timestamp: new Date(),
                payload: req.body
            }
        };
        await payment.save();
        console.log(`✅ Order ${order_id} updated to ${newStatus}`);
        return res.status(200).send('OK');
    }
    catch (error) {
        console.error('Error handling PayHere webhook:', error);
        return res.status(500).send('Server Error');
    }
};
exports.handleNotify = handleNotify;
const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.query;
        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }
        const payment = await Payment_1.Payment.findOne({ orderId: orderId });
        if (!payment) {
            console.warn(`Payment status check failed: Order ${orderId} not found`);
            return res.status(404).json({ message: 'Order not found' });
        }
        console.log(`Payment status check for ${orderId}: Status=${payment.status}, Amount=${payment.amount}`);
        return res.json({
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            itemModel: payment.itemModel,
            itemId: payment.itemId,
            itemTitle: payment.metadata?.itemTitle,
            paperType: payment.metadata?.paperType
        });
    }
    catch (error) {
        console.error('Get payment status error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getPaymentStatus = getPaymentStatus;
const verifySandboxPayment = async (req, res) => {
    try {
        // 1. Check if sandbox is enabled
        if (process.env.PAYHERE_SANDBOX !== 'true') {
            return res.status(403).json({ message: 'Manual verification only available in sandbox mode' });
        }
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }
        // 2. Find payment
        const payment = await Payment_1.Payment.findOne({ orderId });
        if (!payment) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // 3. Simple protection: Only allow the owner of the payment to verify it manually
        if (payment.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        // 4. Update status to PAID
        payment.status = 'PAID';
        payment.metadata = {
            ...payment.metadata,
            manualVerification: {
                timestamp: new Date(),
                verifiedBy: req.user.id,
                reason: 'Sandbox manual verification'
            }
        };
        await payment.save();
        console.log(`✅ [SANDBOX] Order ${orderId} manually verified as PAID.`);
        return res.json({ success: true, message: 'Payment verified manually (Sandbox Mode)' });
    }
    catch (error) {
        console.error('Verify sandbox payment error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.verifySandboxPayment = verifySandboxPayment;
const submitManualPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, itemModel, username } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Payment slip image is required' });
        }
        if (!userId || !itemId || !itemModel || !username) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // 1. Validate Item and Price
        let item = null;
        switch (itemModel) {
            case 'Video':
                item = await Video_1.Video.findById(itemId);
                break;
            case 'Paper':
                item = await Paper_1.Paper.findById(itemId);
                break;
            case 'Tute':
                item = await Tute_1.Tute.findById(itemId);
                break;
            case 'CoursePackage':
                item = await CoursePackage_1.CoursePackage.findById(itemId);
                break;
            default: return res.status(400).json({ message: 'Invalid item model' });
        }
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        const amount = item.price;
        const title = item.title;
        // 2. Create Payment Record with PENDING status
        const orderId = `SLIP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        // Construct path for the slip image
        // Storing relative path from uploads root
        const slipPath = `/uploads/slip/${req.file.filename}`;
        const metadata = {
            itemTitle: title,
            manualPayment: {
                username,
                slipPath,
                uploadedAt: new Date()
            }
        };
        if (itemModel === 'Paper') {
            metadata.paperType = item.paperType;
        }
        const payment = await Payment_1.Payment.create({
            userId,
            itemId,
            itemModel,
            amount,
            currency: 'LKR',
            orderId,
            status: 'PENDING',
            paymentMethod: 'MANUAL_SLIP',
            metadata
        });
        return res.status(201).json({
            success: true,
            message: 'Manual payment submitted successfully',
            orderId,
            paymentId: payment._id
        });
    }
    catch (error) {
        console.error('Submit manual payment error:', error);
        return res.status(500).json({ message: 'Server error processing manual payment' });
    }
};
exports.submitManualPayment = submitManualPayment;
