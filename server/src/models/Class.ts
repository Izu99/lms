import mongoose, { Document } from 'mongoose';

export interface IClass extends Document {
  name: string;        // e.g., "A1", "A2", "Science A"
  location: string;    // e.g., "Tangalle", "Matara", "Colombo"
  isActive: boolean;
}

const classSchema = new mongoose.Schema<IClass>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Ensure unique combination of name and location
classSchema.index({ name: 1, location: 1 }, { unique: true });

export const Class = mongoose.model<IClass>('Class', classSchema);
