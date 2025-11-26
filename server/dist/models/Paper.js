"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paper = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const optionSchema = new mongoose_1.default.Schema({
    optionText: { type: String, required: true },
    imageUrl: { type: String },
    isCorrect: { type: Boolean, required: true, default: false }
});
const questionSchema = new mongoose_1.default.Schema({
    questionText: { type: String, required: true },
    imageUrl: { type: String },
    options: [optionSchema],
    order: { type: Number, required: true },
    // Detailed explanation (විවරණ - wiwarana)
    explanation: {
        text: { type: String },
        imageUrl: { type: String }
    }
});
const paperSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String },
    teacherId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    institute: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Institute' },
    year: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Year' },
    academicLevel: { type: String, enum: ['OL', 'AL'] },
    questions: [questionSchema],
    deadline: { type: Date },
    timeLimit: { type: Number }, // minutes
    availability: { type: String, enum: ['all', 'physical', 'paid'], default: 'all' },
    price: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    paperType: { type: String, enum: ['MCQ', 'Structure-Essay'], default: 'MCQ' },
    fileUrl: { type: String },
    previewImageUrl: { type: String }
}, { timestamps: true });
// Update totalQuestions before saving
paperSchema.pre('save', function (next) {
    this.totalQuestions = this.questions.length;
    next();
});
exports.Paper = mongoose_1.default.model('Paper', paperSchema);
