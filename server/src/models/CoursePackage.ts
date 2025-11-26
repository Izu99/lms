import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICoursePackage extends Document {
  title: string;
  description?: string;
  price: number;
  backgroundImage?: string;
  videos: Types.ObjectId[];
  papers: Types.ObjectId[];
  tutes: Types.ObjectId[];
  availability: "all" | "physical" | "paid";
  institute?: Types.ObjectId; // Optional, if not free for all
  year?: Types.ObjectId;      // Optional, if not free for all
  academicLevel?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CoursePackageSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    backgroundImage: { type: String, trim: true },
    videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    papers: [{ type: Schema.Types.ObjectId, ref: 'Paper' }],
    tutes: [{ type: Schema.Types.ObjectId, ref: 'Tute' }],
    availability: { type: String, enum: ['all', 'physical', 'paid'], default: 'all' },
    institute: { type: Schema.Types.ObjectId, ref: 'Institute' },
    year: { type: Schema.Types.ObjectId, ref: 'Year' },
    academicLevel: { type: String, enum: ['OL', 'AL'] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const CoursePackage = mongoose.model<ICoursePackage>('CoursePackage', CoursePackageSchema);
