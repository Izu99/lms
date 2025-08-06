"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/protectedRoute.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = express_1.default.Router();
router.get('/student-content', auth_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(['student', 'teacher', 'admin']), (req, res) => {
    res.json({ data: 'Accessible by student, teacher, admin' });
});
router.get('/teacher-content', auth_1.authMiddleware, (0, roleMiddleware_1.roleMiddleware)(['teacher', 'admin']), (req, res) => {
    res.json({ data: 'Accessible by teacher or admin only' });
});
exports.default = router;
