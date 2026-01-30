"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../modules/shared/middleware/auth");
const multer_1 = require("../config/multer"); // Import the centralized multer instance
const router = express_1.default.Router();
const setIdCardUpload = (req, res, next) => {
    req.uploadType = 'id-card';
    next();
};
router.post('/register', setIdCardUpload, multer_1.upload.fields([
    { name: 'idCardFront', maxCount: 1 },
    { name: 'idCardBack', maxCount: 1 }
]), authController_1.register); // uploadType is now set by middleware
router.post('/login', authController_1.login);
router.post('/check-username', authController_1.checkUsername);
router.get('/me', auth_1.protect, authController_1.getCurrentUser);
// Profile endpoints
router.get('/users/:id', auth_1.protect, authController_1.getUserProfile);
router.put('/users/:id', auth_1.protect, setIdCardUpload, multer_1.upload.fields([
    { name: 'idCardFront', maxCount: 1 },
    { name: 'idCardBack', maxCount: 1 }
]), authController_1.updateUserProfile); // uploadType is now set by middleware
// Student management endpoints (Teachers only)
router.get('/students', auth_1.protect, authController_1.getAllStudents);
router.put('/students/:studentId/status', auth_1.protect, authController_1.updateStudentStatus);
router.delete('/students/:studentId', auth_1.protect, authController_1.deleteStudent);
exports.default = router;
