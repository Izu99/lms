import mongoose, { Document } from 'mongoose';

export interface IYear extends Document {
  year: number;        // e.g., 12, 13 (for A-Level years)
  name: string;        // e.g., "Year 12", "Year 13"
  isActive: boolean;
}

const yearSchema = new mongoose.Schema<IYear>({
  year: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Year = mongoose.model<IYear>('Year', yearSchema);
