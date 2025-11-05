import mongoose, { Document, Types } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  videoUrl: string; 
  uploadedBy: Types.ObjectId;
  institute: Types.ObjectId;  // Reference to Institute
  year: Types.ObjectId;   // Reference to Year
  views: number;          // NEW: Simple view counter
}

const videoSchema = new mongoose.Schema<IVideo>({
  title: { type: String, required: true },
  description: String,
  videoUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  year: { type: mongoose.Schema.Types.ObjectId, ref: 'Year', required: true },
  views: { type: Number, default: 0 },  // NEW: Default to 0 views
}, { timestamps: true });

export const Video = mongoose.model<IVideo>('Video', videoSchema);
