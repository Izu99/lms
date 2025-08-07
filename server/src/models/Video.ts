import mongoose, { Document, Types } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  videoUrl: string; 
  uploadedBy: Types.ObjectId;
}

const videoSchema = new mongoose.Schema<IVideo>({
  title: { type: String, required: true },
  description: String,
  videoUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Video = mongoose.model<IVideo>('Video', videoSchema);
