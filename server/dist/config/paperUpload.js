"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPaper = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const UPLOAD_DIR = 'uploads/papers';
// Ensure upload directories exist
const ensureDirectories = () => {
    const dirs = [
        // MCQ Folders
        path_1.default.join(UPLOAD_DIR, 'mcq/thumbnails'),
        path_1.default.join(UPLOAD_DIR, 'mcq/questions'),
        path_1.default.join(UPLOAD_DIR, 'mcq/options'),
        path_1.default.join(UPLOAD_DIR, 'mcq/explanations'),
        path_1.default.join(UPLOAD_DIR, 'mcq/content'), // For general content images if needed
        // Structure-Essay Folders
        path_1.default.join(UPLOAD_DIR, 'structure-essay/thumbnails'),
        path_1.default.join(UPLOAD_DIR, 'structure-essay/questions'),
        path_1.default.join(UPLOAD_DIR, 'structure-essay/answers'),
        path_1.default.join(UPLOAD_DIR, 'structure-essay/reviews')
    ];
    dirs.forEach(dir => {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
    });
};
ensureDirectories();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let subDir = '';
        const uploadType = req.body.uploadType;
        const paperType = req.body.paperType; // 'MCQ' or 'Structure-Essay'
        if (file.fieldname === 'thumbnail') {
            if (paperType === 'Structure-Essay') {
                subDir = 'structure-essay/thumbnails';
            }
            else {
                // Default to MCQ if not specified or explicitly MCQ
                subDir = 'mcq/thumbnails';
            }
        }
        else if (uploadType === 'structure-essay-question') {
            subDir = 'structure-essay/questions';
        }
        else if (uploadType === 'student-answer') {
            subDir = 'structure-essay/answers';
        }
        else if (uploadType === 'teacher-review') {
            subDir = 'structure-essay/reviews';
        }
        else {
            // Fallback logic
            if (file.mimetype === 'application/pdf') {
                // If it's a PDF and we don't know the type, assume it's a structure essay question paper
                // or we could error out. But for now, let's put it in structure-essay/questions
                // as MCQ papers don't usually have PDFs.
                subDir = 'structure-essay/questions';
            }
            else {
                // Images fallback to MCQ thumbnails or content?
                // Let's default to mcq/thumbnails to be safe
                subDir = 'mcq/thumbnails';
            }
        }
        const fullPath = path_1.default.join(UPLOAD_DIR, subDir);
        // Ensure directory exists just in case
        if (!fs_1.default.existsSync(fullPath)) {
            fs_1.default.mkdirSync(fullPath, { recursive: true });
        }
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        // Sanitize original name: remove spaces and special chars
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
        const uniqueSuffix = Date.now() + '-' + crypto_1.default.randomBytes(4).toString('hex');
        const uploadType = req.body.uploadType || 'file';
        cb(null, `${uploadType}-${uniqueSuffix}-${sanitizedOriginalName}`);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'file') {
        // PDF files for papers
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only PDF allowed for papers'));
        }
    }
    else if (file.fieldname === 'thumbnail') {
        // Image files
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid image file type'));
        }
    }
    else {
        cb(null, true);
    }
};
exports.uploadPaper = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB for papers
    }
});
