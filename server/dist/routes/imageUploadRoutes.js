"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../config/multer"); // Import the centralized multer instance
const imageUploadController_1 = require("../controllers/imageUploadController");
const auth_1 = require("../modules/shared/middleware/auth");
const router = express_1.default.Router();
// The 'protect' middleware is applied at the router level in index.ts/index.secure.ts,
// so it's not needed for each individual route here.
// Route for uploading paper option images (MCQ answers)
router.post('/upload/paper-options', (req, res, next) => {
    req.uploadType = 'mcq-option'; // Maps to uploads/papers/mcq/options
    next();
}, multer_1.upload.single('image'), imageUploadController_1.uploadPaperOptionImage);
// Route for uploading question images
router.post('/upload/question', (req, res, next) => {
    req.uploadType = 'mcq-question'; // Maps to uploads/papers/mcq/questions
    next();
}, multer_1.upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided.' });
    }
    // Use req.file.path for consistent path handling
    const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    res.status(200).json({ imageUrl, message: 'Question image uploaded successfully.' });
});
// Route for uploading explanation images
router.post('/upload/explanation', (req, res, next) => {
    req.uploadType = 'mcq-explanation'; // Maps to uploads/papers/mcq/explanations
    next();
}, multer_1.upload.single('image'), imageUploadController_1.uploadExplanationImage);
// Route for uploading id card images
router.post('/upload/id-card', (req, res, next) => {
    req.uploadType = 'id-card'; // Maps to uploads/id-cards
    next();
}, multer_1.upload.single('image'), imageUploadController_1.uploadIdCardImage);
// Route for uploading paper content images
router.post('/upload/paper-content', (req, res, next) => {
    req.uploadType = 'paper'; // Maps to uploads/paper
    next();
}, multer_1.upload.single('image'), imageUploadController_1.uploadPaperContentImage);
// Route for deleting an image
router.post('/delete', auth_1.protect, imageUploadController_1.deleteImage);
exports.default = router;
