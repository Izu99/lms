"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../config/multer");
const paperUpload_1 = require("../config/paperUpload");
const paperController_1 = require("../controllers/paperController");
const auth_1 = require("../modules/shared/middleware/auth");
// Middleware to set uploadType BEFORE multer processes files
const setUploadTypeStudentAnswer = (req, res, next) => {
    req.uploadType = 'structure-student-answer';
    console.log('🔧 [MIDDLEWARE] Set uploadType:', req.uploadType);
    next();
};
const setUploadTypeTeacherReview = (req, res, next) => {
    req.uploadType = 'structure-teacher-review';
    console.log('🔧 [MIDDLEWARE] Set uploadType:', req.uploadType);
    next();
};
const router = express_1.default.Router();
// Paper CRUD operations - require paper access for creation
router.post('/', auth_1.protect, auth_1.requirePaperAccess, paperUpload_1.uploadPaper.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), paperController_1.createPaper);
router.get('/', auth_1.protect, paperController_1.getAllPapers);
router.post('/upload', auth_1.protect, setUploadTypeStudentAnswer, multer_1.uploadPdf.single('file'), paperController_1.uploadPaperPdf);
// Paper attempts and results - MUST come before /:id routes
router.get('/results/my-results', auth_1.protect, paperController_1.getStudentResults);
router.get('/student/all', auth_1.protect, paperController_1.getAllPapersForStudent);
router.get('/my-results', auth_1.protect, paperController_1.getStudentResults); // Alternative route
router.post('/:id/submit', auth_1.protect, paperController_1.submitPaper);
router.get('/:id/results', auth_1.protect, auth_1.requirePaperAccess, paperController_1.getPaperResults);
router.get('/:paperId/attempt', auth_1.protect, paperController_1.getStudentAttemptForPaper);
// New routes for attempts by ID
router.get('/attempts/:attemptId', auth_1.protect, paperController_1.getAttemptById); // New route
router.get('/attempts/:attemptId/download', auth_1.protect, paperController_1.downloadStudentAttemptFile); // New route for downloading student answer files
router.post('/attempts/:attemptId/upload-review', auth_1.protect, auth_1.requirePaperAccess, setUploadTypeTeacherReview, multer_1.uploadPdf.single('file'), paperController_1.uploadTeacherReviewFile); // Require paper access for review uploads
router.put('/attempts/:attemptId/marks', auth_1.protect, auth_1.requirePaperAccess, paperController_1.updateStudentAttemptMarks); // Require paper access for marking
// These must come last - require paper access for modification
router.get('/:id', auth_1.protect, paperController_1.getPaperById);
router.put('/:id', auth_1.protect, auth_1.requirePaperAccess, paperUpload_1.uploadPaper.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), paperController_1.updatePaper);
router.delete('/:id', auth_1.protect, auth_1.requirePaperAccess, paperController_1.deletePaper);
exports.default = router;
