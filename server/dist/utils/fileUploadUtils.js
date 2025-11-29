"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const UPLOADS_BASE_DIR = path_1.default.join(__dirname, '../../uploads');
const deleteFile = async (filePath) => {
    if (!filePath) {
        return;
    }
    // Correctly create a relative path by removing the '/uploads/' prefix
    const relativePath = filePath.startsWith('/uploads/')
        ? filePath.substring('/uploads/'.length)
        : filePath;
    const absolutePath = path_1.default.join(UPLOADS_BASE_DIR, relativePath);
    // Basic security check to ensure we are deleting within the intended directory
    if (!absolutePath.startsWith(UPLOADS_BASE_DIR)) {
        console.error(`Attempt to delete file outside of uploads directory: ${absolutePath}`);
        return;
    }
    try {
        // Check if file exists before attempting to delete
        if (fs_1.default.existsSync(absolutePath)) {
            await fs_1.default.promises.unlink(absolutePath);
            console.log(`Successfully deleted file: ${absolutePath}`);
        }
        else {
            console.warn(`File not found, skipping deletion: ${absolutePath}`);
        }
    }
    catch (error) {
        console.error(`Error deleting file ${absolutePath}:`, error);
    }
};
exports.deleteFile = deleteFile;
