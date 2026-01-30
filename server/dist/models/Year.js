"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Year = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const yearSchema = new mongoose_1.default.Schema({
    year: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.Year = mongoose_1.default.model('Year', yearSchema);
