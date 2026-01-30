"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPdf = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
// Define the base directory for all uploads
const UPLOAD_BASE_DIR = 'uploads';
const storage = multer_1.default.diskStorage({
    /**
     * Dynamically determines the destination directory based on the 'uploadType'
     * field in the request body. This centralizes file upload logic.
     *
     * Expected 'uploadType' values:
     * - 'paper': For the main paper file (e.g., a PDF for a Structure and Essay paper).
     * - 'question': For images associated with a question.
     * - 'option': For images associated with an answer option (MCQ).
     * - 'explanation': For images associated with an explanation.
     * - 'id-card': For ID card images.
     */
    destination: (req, file, cb) => {
        console.log('📁 [MULTER] Processing file upload:');
        console.log('  - fieldname:', file.fieldname);
        console.log('  - mimetype:', file.mimetype);
        console.log('  - originalname:', file.originalname);
        // Get uploadType from req.uploadType (set by route middleware)
        const uploadType = req.uploadType || 'misc';
        console.log('  - uploadType from req:', uploadType);
        let subDir = '';
        switch (uploadType) {
            case 'mcq-question':
                subDir = 'papers/mcq/questions';
                break;
            case 'mcq-option':
                subDir = 'papers/mcq/options';
                break;
            case 'mcq-explanation':
                subDir = 'papers/mcq/explanations';
                break;
            case 'mcq-content':
                subDir = 'papers/mcq/content';
                break;
            case 'structure-question-paper':
            case 'structure-essay-question': // Alias for consistency
                subDir = 'papers/structure-essay/questions';
                break;
            case 'structure-student-answer':
            case 'student-answer': // Alias for consistency
                subDir = 'papers/structure-essay/answers';
                break;
            case 'structure-teacher-review':
            case 'teacher-review': // Alias for consistency
                subDir = 'papers/structure-essay/reviews';
                break;
            case 'paper-thumbnail':
                // Check paperType from form body to determine subfolder
                const paperType = req.body?.paperType;
                if (paperType === 'MCQ') {
                    subDir = 'papers/mcq/thumbnails';
                }
                else if (paperType === 'Structure-Essay') {
                    subDir = 'papers/structure-essay/thumbnails';
                }
                else {
                    subDir = 'papers/thumbnails'; // fallback
                }
                break;
            case 'id-card':
                subDir = 'id-cards';
                break;
            default:
                // Fallback: check fieldname
                if (file.fieldname === 'thumbnail') {
                    // Check paperType to route to correct thumbnail folder
                    const paperType = req.body?.paperType;
                    if (paperType === 'MCQ') {
                        subDir = 'papers/mcq/thumbnails';
                    }
                    else if (paperType === 'Structure-Essay') {
                        subDir = 'papers/structure-essay/thumbnails';
                    }
                    else {
                        subDir = 'papers/thumbnails'; // fallback
                    }
                }
                else if (file.fieldname === 'file' && file.mimetype === 'application/pdf') {
                    // Default for question papers if no uploadType specified
                    subDir = 'papers/structure-essay/question-papers';
                }
                else {
                    subDir = 'misc';
                }
                break;
        }
        // Construct the full directory path
        const dir = path_1.default.join(UPLOAD_BASE_DIR, subDir);
        console.log('  - Calculated subDir:', subDir);
        console.log('  - Full directory path:', dir);
        // Create the directory if it doesn't exist
        if (!fs_1.default.existsSync(dir)) {
            console.log('  - Creating directory:', dir);
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        else {
            console.log('  - Directory already exists');
        }
        // Pass the destination directory to multer
        console.log('✅ [MULTER] File will be saved to:', dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Generate a unique, secure filename using timestamp + random hash
        const uniqueSuffix = Date.now() + '-' + crypto_1.default.randomBytes(6).toString('hex');
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        const ext = path_1.default.extname(sanitizedName);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});
// File filter for security - allow images and PDFs
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf' // Allow PDFs for Structure-Essay papers
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP images and PDF files are allowed.'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
    }
});
// Separate upload instance for PDFs (papers, documents)
const pdfFileFilter = (req, file, cb) => {
    const allowedMimes = ['application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only PDF files are allowed.'));
    }
};
exports.uploadPdf = (0, multer_1.default)({
    storage,
    fileFilter: pdfFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size for PDFs
    }
});
