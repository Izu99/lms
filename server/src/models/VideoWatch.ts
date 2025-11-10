import mongoose, { Document, Types } from 'mongoose';

export interface IVideoWatch extends Document {
  student: Types.ObjectId;
  video: Types.ObjectId;
  watchDuration: number; // in seconds
  completed: boolean;
}

const videoWatchSchema = new mongoose.Schema<IVideoWatch>({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  watchDuration: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export const VideoWatch = mongoose.model<IVideoWatch>('VideoWatch', videoWatchSchema);
