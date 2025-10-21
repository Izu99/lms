"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paper = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    questionText: { type: String, required: true },
    imageUrl: { type: String },
    options: [{
            optionText: { type: String, required: true },
            isCorrect: { type: Boolean, required: true, default: false },
            imageUrl: { type: String } // Added imageUrl field
        }],
    order: { type: Number, required: true }
});
const paperSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String },
    teacherId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    questions: [questionSchema],
    deadline: { type: Date, required: true },
    timeLimit: { type: Number, required: true }, // minutes
    totalQuestions: { type: Number, default: 0 }
}, { timestamps: true });
// Update totalQuestions before saving
paperSchema.pre('save', function (next) {
    this.totalQuestions = this.questions.length;
    next();
});
exports.Paper = mongoose_1.default.model('Paper', paperSchema);
