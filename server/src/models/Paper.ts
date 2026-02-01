import mongoose, { Document, Types } from 'mongoose';

export interface IOption {
  _id?: Types.ObjectId;
  optionText: string;
  imageUrl?: string;
  isCorrect: boolean;
}

export interface IQuestion {
  _id?: Types.ObjectId;
  questionText: string;
  options: IOption[];
  order: number;
  imageUrl?: string;
  // Detailed explanation (විවරණ - wiwarana)
  explanation?: {
    text?: string;
    imageUrl?: string;
  };
}

export interface IPaper extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  teacherId: Types.ObjectId;
  institute?: Types.ObjectId;
  year?: Types.ObjectId;
  academicLevel?: string;
  questions: IQuestion[];
  deadline?: Date;
  timeLimit?: number; // in minutes
  availability: 'all' | 'physical' | 'paid';
  price?: number;
  totalQuestions: number;
  paperType: 'MCQ' | 'Structure-Essay';
  fileUrl?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const optionSchema = new mongoose.Schema<IOption>({
  optionText: { type: String },
  imageUrl: { type: String },
  isCorrect: { type: Boolean, required: true, default: false }
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String },
  imageUrl: { type: String },
  options: [optionSchema],
  order: { type: Number, required: true },
  // Detailed explanation (විවරණ - wiwarana)
  explanation: {
    text: { type: String },
    imageUrl: { type: String }
  }
});

const paperSchema = new mongoose.Schema<IPaper>({
  title: { type: String, required: true },
  description: { type: String },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' },
  year: { type: mongoose.Schema.Types.ObjectId, ref: 'Year' },
  academicLevel: { type: String, enum: ['OL', 'AL'] },
  questions: [questionSchema],
  deadline: { type: Date },
  timeLimit: { type: Number }, // minutes
  availability: { type: String, enum: ['all', 'physical', 'paid'], default: 'all' },
  price: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  paperType: { type: String, enum: ['MCQ', 'Structure-Essay'], default: 'MCQ' },
  fileUrl: { type: String },
  thumbnailUrl: { type: String }
}, { timestamps: true });

// Update totalQuestions before saving
paperSchema.pre('save', function (next) {
  this.totalQuestions = this.questions.length;
  next();
});

// Indexes for performance
paperSchema.index({ institute: 1, year: 1, deadline: 1 });  // Student filter: Papers for my class due soon
paperSchema.index({ teacherId: 1, createdAt: -1 });         // Teacher filter: My papers
paperSchema.index({ paperType: 1, availability: 1 });       // Filter by type (MCQ/Essay) and access

export const Paper = mongoose.model<IPaper>('Paper', paperSchema);
