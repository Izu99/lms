import mongoose, { Document, Types } from 'mongoose';

export interface IMeetingDetails {
  title: string;
  description?: string;
  zoomLink: string;
  youtubeLink?: string;
}

export interface IZoomLink extends Document {
  meeting: IMeetingDetails; // Encapsulate meeting details
  uploadedBy: Types.ObjectId;
  institute: Types.ObjectId;
  year: Types.ObjectId;
}

const meetingDetailsSchema = new mongoose.Schema<IMeetingDetails>({
  title: { type: String, required: true },
  description: { type: String },
  zoomLink: { type: String, required: true },
  youtubeLink: { type: String },
});

const zoomLinkSchema = new mongoose.Schema<IZoomLink>({
  meeting: { type: meetingDetailsSchema, required: true }, // Use the sub-schema
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
  year: { type: mongoose.Schema.Types.ObjectId, ref: 'Year', required: true },
}, { timestamps: true });

export const ZoomLink = mongoose.model<IZoomLink>('ZoomLink', zoomLinkSchema);
