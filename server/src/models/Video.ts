import mongoose, { Document, Types } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;  // Thumbnail image
  uploadedBy: Types.ObjectId;
  institute: Types.ObjectId;  // Reference to Institute
  year: Types.ObjectId;   // Reference to Year
  academicLevel?: string;  // Academic level: 'OL' or 'AL'
  views: number;          // NEW: Simple view counter
  availability: 'all' | 'physical' | 'paid';
  price?: number;
}

const videoSchema = new mongoose.Schema<IVideo>({
  title: { type: String, required: true },
  description: String,
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },  // Thumbnail image
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  year: { type: mongoose.Schema.Types.ObjectId, ref: 'Year', required: true },
  academicLevel: { type: String, enum: ['OL', 'AL'] },  // Academic level
  views: { type: Number, default: 0 },  // NEW: Default to 0 views
  availability: { type: String, enum: ['all', 'physical', 'paid'], default: 'all' },
  price: { type: Number, default: 0 },
}, { timestamps: true });

// Indexes for performance
videoSchema.index({ institute: 1, year: 1, createdAt: -1 }); // Common filter: Institute + Year
videoSchema.index({ uploadedBy: 1, createdAt: -1 });         // Teacher dashboard: My Videos
videoSchema.index({ availability: 1 });                      // Filter by free/paid

export const Video = mongoose.model<IVideo>('Video', videoSchema);
