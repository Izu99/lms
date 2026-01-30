"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tute = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tuteSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    teacherId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'pptx', 'ppt', 'image'], required: true },
    thumbnailUrl: { type: String },
    availability: { type: String, enum: ['all', 'physical', 'paid'], default: 'all' },
    price: { type: Number, default: 0 },
    institute: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Institute' },
    year: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Year' },
    academicLevel: { type: String, enum: ['OL', 'AL'] }
}, { timestamps: true });
// Index for faster queries
tuteSchema.index({ teacherId: 1, createdAt: -1 });
tuteSchema.index({ availability: 1 });
exports.Tute = mongoose_1.default.model('Tute', tuteSchema);
