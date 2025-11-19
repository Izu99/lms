"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../config/multer");
const paperController_1 = require("../controllers/paperController");
const auth_1 = require("../modules/shared/middleware/auth");
const router = express_1.default.Router();
// Paper CRUD operations
router.post('/', auth_1.protect, paperController_1.createPaper);
router.get('/', auth_1.protect, paperController_1.getAllPapers);
router.post('/upload', auth_1.protect, multer_1.upload.single('file'), paperController_1.uploadPaperPdf);
// Paper attempts and results - MUST come before /:id routes
router.get('/results/my-results', auth_1.protect, paperController_1.getStudentResults);
router.get('/student/all', auth_1.protect, paperController_1.getAllPapersForStudent);
router.get('/my-results', auth_1.protect, paperController_1.getStudentResults); // Alternative route
router.post('/:id/submit', auth_1.protect, paperController_1.submitPaper);
router.get('/:id/results', auth_1.protect, paperController_1.getPaperResults);
router.get('/:paperId/attempt', auth_1.protect, paperController_1.getStudentAttemptForPaper);
router.get('/attempts/:attemptId/download', auth_1.protect, paperController_1.downloadStudentAttemptFile); // New route for downloading student answer files
router.put('/attempts/:attemptId/marks', auth_1.protect, paperController_1.updateStudentAttemptMarks); // New route for updating student marks
// These must come last
router.get('/:id', auth_1.protect, paperController_1.getPaperById);
router.put('/:id', auth_1.protect, paperController_1.updatePaper);
router.delete('/:id', auth_1.protect, paperController_1.deletePaper);
exports.default = router;
