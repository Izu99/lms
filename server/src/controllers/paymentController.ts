import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { User } from '../models/User';
import crypto from 'crypto';
import mongoose from 'mongoose';

const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID!;
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET!;
const PAYHERE_BASE_URL = process.env.PAYHERE_SANDBOX === 'true'
    ? 'https://sandbox.payhere.lk'
    : 'https://www.payhere.lk';
const APP_BASE_URL = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
// Make sure this matches your deployed backend URL in production
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

// Helper to generate md5 hash
const md5 = (str: string) => crypto.createHash('md5').update(str).digest('hex').toUpperCase();

export const initiatePayment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { itemId, itemModel, amount, title } = req.body;

        // 1. Validation
        if (!userId || !itemId || !itemModel || !amount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (!['Video', 'Paper', 'Tute', 'CoursePackage'].includes(itemModel)) {
            return res.status(400).json({ message: 'Invalid item model' });
        }

        // 2. User Details for PayHere (Pre-fill)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 3. Generate Unique Order ID
        // Format: LMS-{Timestamp}-{Random}
        const orderId = `LMS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const currency = 'LKR';
        const formattedAmount = Number(amount).toFixed(2); // PayHere expects 2 decimal places

        // 4. Create Pending Payment Record
        await Payment.create({
            userId,
            itemId,
            itemModel,
            amount: Number(amount),
            currency,
            orderId,
            status: 'PENDING',
            metadata: {
                itemTitle: title,
                initiatedIp: req.ip,
                userAgent: req.headers['user-agent']
            }
        });

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

    } catch (error) {
        console.error('Initiate payment error:', error);
        return res.status(500).json({ message: 'Server error initiating payment' });
    }
};

export const handleNotify = async (req: Request, res: Response) => {
    console.log('--- 🔔 PAYHERE NOTIFICATION START ---');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Raw Body:', JSON.stringify(req.body, null, 2));
    try {
        // 1. Extract Data
        const {
            merchant_id,
            order_id,
            payment_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig,
            custom_1,
            custom_2,
            method
        } = req.body;

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
        const payment = await Payment.findOne({ orderId: order_id });
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

        let newStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REVERSED' = 'PENDING';

        if (statusCodeInt === 2) {
            newStatus = 'PAID';
        } else if (statusCodeInt === 0) {
            newStatus = 'PENDING';
        } else if (statusCodeInt === -1 || statusCodeInt === -2) {
            newStatus = 'FAILED';
        } else if (statusCodeInt === -3) {
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

    } catch (error) {
        console.error('Error handling PayHere webhook:', error);
        return res.status(500).send('Server Error');
    }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.query;
        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        const payment = await Payment.findOne({ orderId: orderId as string });
        if (!payment) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.json({
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            itemModel: payment.itemModel,
            itemId: payment.itemId
        });
    } catch (error) {
        console.error('Get payment status error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const verifySandboxPayment = async (req: Request, res: Response) => {
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
        const payment = await Payment.findOne({ orderId });
        if (!payment) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // 3. Simple protection: Only allow the owner of the payment to verify it manually
        if (payment.userId.toString() !== (req as any).user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // 4. Update status to PAID
        payment.status = 'PAID';
        payment.metadata = {
            ...payment.metadata,
            manualVerification: {
                timestamp: new Date(),
                verifiedBy: (req as any).user.id,
                reason: 'Sandbox manual verification'
            }
        };

        await payment.save();
        console.log(`✅ [SANDBOX] Order ${orderId} manually verified as PAID.`);

        return res.json({ success: true, message: 'Payment verified manually (Sandbox Mode)' });
    } catch (error) {
        console.error('Verify sandbox payment error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
