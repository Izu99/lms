"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadIdCard = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/id-cards/temp/'; // Temporary directory
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Use fieldname to distinguish between front and back
        const timestamp = Date.now();
        const extension = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${timestamp}${extension}`);
    }
});
// Accept two files: idCardFront and idCardBack
exports.uploadIdCard = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        // Only accept image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 2 // Maximum 2 files
    }
});
