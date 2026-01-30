"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../modules/shared/middleware/auth");
const tuteUpload_1 = require("../config/tuteUpload");
const tuteController_1 = require("../controllers/tuteController");
const router = express_1.default.Router();
// Teacher routes
router.post('/', auth_1.protect, tuteUpload_1.uploadTute.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), tuteController_1.createTute);
router.get('/teacher', auth_1.protect, tuteController_1.getTeacherTutes);
router.get('/:id', auth_1.protect, tuteController_1.getTuteById);
router.put('/:id', auth_1.protect, tuteUpload_1.uploadTute.fields([{ name: 'file', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), tuteController_1.updateTute);
router.delete('/:id', auth_1.protect, tuteController_1.deleteTute);
// Student routes
router.get('/student/all', auth_1.protect, tuteController_1.getStudentTutes);
exports.default = router;
