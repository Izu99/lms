import mongoose, { Document, Types } from 'mongoose';

export interface IYoutubeLink extends Document {
  title: string;
  description: string;
  youtubeUrl: string;
  uploadedBy: Types.ObjectId;
  class: Types.ObjectId;
  year: Types.ObjectId;
  views: number;
  thumbnailUrl?: string;
  duration?: string;
  category?: string;
}

const youtubeLinkSchema = new mongoose.Schema<IYoutubeLink>({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  youtubeUrl: { 
    type: String, 
    required: true 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  class: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class', 
    required: true 
  },
  year: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Year', 
    required: true 
  },
  views: { 
    type: Number, 
    default: 0 
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: String
  },
  category: {
    type: String
  }
}, { 
  timestamps: true 
});

// Keep indexes for performance
youtubeLinkSchema.index({ class: 1, year: 1 });
youtubeLinkSchema.index({ uploadedBy: 1 });

export const YoutubeLink = mongoose.model<IYoutubeLink>('YoutubeLink', youtubeLinkSchema);
