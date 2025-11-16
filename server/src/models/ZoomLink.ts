import mongoose, { Document, Types } from 'mongoose';

export interface IZoomLink extends Document {
  title: string;
  description?: string;
  link: string;
  uploadedBy: Types.ObjectId;
  institute: Types.ObjectId;
  year: Types.ObjectId;
}

const zoomLinkSchema = new mongoose.Schema<IZoomLink>({
  title: { type: String, required: true },
  description: { type: String },
  link: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  year: { type: mongoose.Schema.Types.ObjectId, ref: 'Year', required: true },
}, { timestamps: true });

export const ZoomLink = mongoose.model<IZoomLink>('ZoomLink', zoomLinkSchema);
