"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoWatch = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const videoWatchSchema = new mongoose_1.default.Schema({
    student: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    video: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Video', required: true },
    watchDuration: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
}, { timestamps: true });
exports.VideoWatch = mongoose_1.default.model('VideoWatch', videoWatchSchema);
