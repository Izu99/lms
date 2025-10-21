"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const paperOptionsDir = 'uploads/paper-options';
// Create the directory if it doesn't exist
if (!fs_1.default.existsSync(paperOptionsDir)) {
    fs_1.default.mkdirSync(paperOptionsDir, { recursive: true });
}
const imageStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, paperOptionsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
exports.uploadImage = (0, multer_1.default)({
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp') {
            cb(null, true);
        }
        else {
            cb(new Error('Only JPEG, PNG, JPG, and WEBP image files are allowed!'), false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});
