"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentAttempt = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const studentAnswerSchema = new mongoose_1.default.Schema({
    questionId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    selectedOptionId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    isCorrect: { type: Boolean, default: false }
});
const studentAttemptSchema = new mongoose_1.default.Schema({
    paperId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Paper', required: true },
    studentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [studentAnswerSchema],
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, default: 0 },
    status: { type: String, enum: ['started', 'submitted'], default: 'started' },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    timeSpent: { type: Number, default: 0 }, // in minutes
    answerFileUrl: { type: String },
    teacherReviewFileUrl: { type: String }
}, { timestamps: true });
// Ensure one attempt per student per paper
studentAttemptSchema.index({ paperId: 1, studentId: 1 }, { unique: true });
exports.StudentAttempt = mongoose_1.default.model('StudentAttempt', studentAttemptSchema);
