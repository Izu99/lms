import mongoose, { Schema, Document, Types } from 'mongoose';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REVERSED';
export type ItemModel = 'Video' | 'Paper' | 'Tute' | 'CoursePackage';

export interface IPayment extends Document {
    userId: Types.ObjectId;
    itemId: Types.ObjectId;
    itemModel: ItemModel;
    amount: number;
    currency: string;
    orderId: string;
    paymentId?: string;
    status: PaymentStatus;
    metadata?: Record<string, any>; // For audit logs and extra info
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    itemId: { type: Schema.Types.ObjectId, required: true, index: true },
    itemModel: {
        type: String,
        required: true,
        enum: ['Video', 'Paper', 'Tute', 'CoursePackage']
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'LKR' },
    orderId: { type: String, required: true, unique: true, index: true },
    paymentId: { type: String },
    status: {
        type: String,
        required: true,
        enum: ['PENDING', 'PAID', 'FAILED', 'REVERSED'],
        default: 'PENDING'
    },
    metadata: { type: Schema.Types.Mixed },
}, { timestamps: true });

// Composite index for fast access checking
PaymentSchema.index({ userId: 1, itemId: 1, status: 1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
