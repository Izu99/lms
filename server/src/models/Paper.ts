import mongoose, { Document, Types } from 'mongoose';

export interface IQuestion {
  _id?: Types.ObjectId;
  questionText: string;
  options: {
    _id?: Types.ObjectId;
    optionText: string;
    isCorrect: boolean;
  }[];
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
  questions: IQuestion[];
  deadline?: Date;
  timeLimit?: number; // in minutes
  availability: 'all' | 'physical';
  price?: number;
  totalQuestions: number;
  paperType: 'MCQ' | 'Structure';
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  imageUrl: { type: String },
  options: [{
    optionText: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: false },
    imageUrl: { type: String }
  }],
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
  questions: [questionSchema],
  deadline: { type: Date },
  timeLimit: { type: Number }, // minutes
  availability: { type: String, enum: ['all', 'physical'], default: 'all' },
  price: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  paperType: { type: String, enum: ['MCQ', 'Structure'], default: 'MCQ' },
  fileUrl: { type: String }
}, { timestamps: true });

// Update totalQuestions before saving
paperSchema.pre('save', function(next) {
  this.totalQuestions = this.questions.length;
  next();
});

export const Paper = mongoose.model<IPaper>('Paper', paperSchema);
