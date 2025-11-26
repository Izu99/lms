"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomLink = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const meetingDetailsSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String },
    zoomLink: { type: String, required: true },
    youtubeLink: { type: String },
});
const zoomLinkSchema = new mongoose_1.default.Schema({
    meeting: { type: meetingDetailsSchema, required: true }, // Use the sub-schema
    uploadedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    institute: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Institute', required: true },
    year: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Year', required: true },
    academicLevel: { type: String, enum: ['OL', 'AL'] },
    availability: { type: String, enum: ['all', 'physical', 'paid'], default: 'all' },
}, { timestamps: true });
exports.ZoomLink = mongoose_1.default.model('ZoomLink', zoomLinkSchema);
