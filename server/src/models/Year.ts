import mongoose, { Document } from 'mongoose';

export interface IYear extends Document {
  year: string;        // e.g., "2024-2025"
  name: string;        // e.g., "A/L Batch of 2025"
  isActive: boolean;
}

const yearSchema = new mongoose.Schema<IYear>({
  year: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Year = mongoose.model<IYear>('Year', yearSchema);
