"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const classSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
// Ensure unique combination of name and location
classSchema.index({ name: 1, location: 1 }, { unique: true });
exports.Class = mongoose_1.default.model('Class', classSchema);
