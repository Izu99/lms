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
        path_1.default.join(UPLOAD_DIR, 'files'),
        path_1.default.join(UPLOAD_DIR, 'images')
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
        if (file.fieldname === 'file') {
            subDir = 'files';
        }
        else if (file.fieldname === 'thumbnail') {
            subDir = 'images';
        }
        else {
            subDir = 'files';
        }
        const fullPath = path_1.default.join(UPLOAD_DIR, subDir);
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + crypto_1.default.randomBytes(6).toString('hex');
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
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
