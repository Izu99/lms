import mongoose, { Document, Types } from 'mongoose';

export interface ITute extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  teacherId: Types.ObjectId;
  fileUrl: string; // PDF or PowerPoint file
  fileType: 'pdf' | 'pptx' | 'ppt' | 'image'; // File type
  thumbnailUrl?: string;
  availability: 'all' | 'physical' | 'paid';
  price?: number;
  institute?: Types.ObjectId;
  year?: Types.ObjectId;
  academicLevel?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tuteSchema = new mongoose.Schema<ITute>({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'pptx', 'ppt', 'image'], required: true },
  thumbnailUrl: { type: String },
  availability: { type: String, enum: ['all', 'physical', 'paid'], default: 'all' },
  price: { type: Number, default: 0 },
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' },
  year: { type: mongoose.Schema.Types.ObjectId, ref: 'Year' },
  academicLevel: { type: String, enum: ['OL', 'AL'] }
}, { timestamps: true });

// Index for faster queries
tuteSchema.index({ teacherId: 1, createdAt: -1 });
tuteSchema.index({ institute: 1, year: 1, createdAt: -1 }); // Added for student filtering
tuteSchema.index({ availability: 1 });

export const Tute = mongoose.model<ITute>('Tute', tuteSchema);
