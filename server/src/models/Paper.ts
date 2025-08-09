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
}

export interface IPaper extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  teacherId: Types.ObjectId;
  questions: IQuestion[];
  deadline: Date;
  timeLimit: number; // in minutes
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{
    optionText: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: false }
  }],
  order: { type: Number, required: true }
});

const paperSchema = new mongoose.Schema<IPaper>({
  title: { type: String, required: true },
  description: { type: String },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [questionSchema],
  deadline: { type: Date, required: true },
  timeLimit: { type: Number, required: true }, // minutes
  totalQuestions: { type: Number, default: 0 }
}, { timestamps: true });

// Update totalQuestions before saving
paperSchema.pre('save', function(next) {
  this.totalQuestions = this.questions.length;
  next();
});

export const Paper = mongoose.model<IPaper>('Paper', paperSchema);
