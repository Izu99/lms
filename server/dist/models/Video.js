"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const videoSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: String,
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String }, // Thumbnail image
    uploadedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    institute: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Institute', required: true },
    year: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Year', required: true },
    academicLevel: { type: String, enum: ['OL', 'AL'] }, // Academic level
    views: { type: Number, default: 0 }, // NEW: Default to 0 views
    availability: { type: String, enum: ['all', 'physical', 'paid'], default: 'all' },
    price: { type: Number, default: 0 },
}, { timestamps: true });
// Indexes for performance
videoSchema.index({ institute: 1, year: 1, createdAt: -1 }); // Common filter: Institute + Year
videoSchema.index({ uploadedBy: 1, createdAt: -1 }); // Teacher dashboard: My Videos
videoSchema.index({ availability: 1 }); // Filter by free/paid
exports.Video = mongoose_1.default.model('Video', videoSchema);
