"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeLink = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const youtubeLinkSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    youtubeUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    class: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    year: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Year',
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    thumbnailUrl: {
        type: String
    },
    duration: {
        type: String
    },
    category: {
        type: String
    }
}, {
    timestamps: true
});
// Keep indexes for performance
youtubeLinkSchema.index({ class: 1, year: 1 });
youtubeLinkSchema.index({ uploadedBy: 1 });
exports.YoutubeLink = mongoose_1.default.model('YoutubeLink', youtubeLinkSchema);
