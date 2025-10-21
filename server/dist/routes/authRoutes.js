"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.get('/me', auth_1.protect, authController_1.getCurrentUser);
// Profile endpoints
router.get('/users/:id', auth_1.protect, authController_1.getUserProfile);
router.put('/users/:id', auth_1.protect, authController_1.updateUserProfile);
// Student management endpoints (Teachers only)
router.get('/students', auth_1.protect, authController_1.getAllStudents);
router.put('/students/:studentId/status', auth_1.protect, authController_1.updateStudentStatus);
exports.default = router;
