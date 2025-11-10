import mongoose, { Document } from 'mongoose';

export interface IInstitute extends Document {
  name: string;        // e.g., "ezyICT", "TechVision"
  location: string;    // e.g., "Tangalle", "Matara", "Colombo"
  isActive: boolean;
}

const instituteSchema = new mongoose.Schema<IInstitute>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Ensure unique combination of name and location
instituteSchema.index({ name: 1, location: 1 }, { unique: true });

export const Institute = mongoose.model<IInstitute>('Institute', instituteSchema);
