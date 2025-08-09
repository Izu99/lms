import mongoose, { Document, Types } from 'mongoose';

export interface IStudentAnswer {
  questionId: Types.ObjectId;
  selectedOptionId: Types.ObjectId;
  isCorrect: boolean;
}

export interface IStudentAttempt extends Document {
  _id: Types.ObjectId;
  paperId: Types.ObjectId;
  studentId: Types.ObjectId;
  answers: IStudentAnswer[];
  score: number;
  totalQuestions: number;
  percentage: number;
  status: 'started' | 'submitted';
  startedAt: Date;
  submittedAt?: Date;
  timeSpent: number; // in minutes
}

const studentAnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedOptionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  isCorrect: { type: Boolean, default: false }
});

const studentAttemptSchema = new mongoose.Schema<IStudentAttempt>({
  paperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paper', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [studentAnswerSchema],
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, default: 0 },
  status: { type: String, enum: ['started', 'submitted'], default: 'started' },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  timeSpent: { type: Number, default: 0 } // in minutes
}, { timestamps: true });

// Ensure one attempt per student per paper
studentAttemptSchema.index({ paperId: 1, studentId: 1 }, { unique: true });

export const StudentAttempt = mongoose.model<IStudentAttempt>('StudentAttempt', studentAttemptSchema);
