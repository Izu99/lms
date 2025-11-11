"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherDashboardRoutes_1 = __importDefault(require("./teacherDashboardRoutes"));
// Import other teacher routes as they are created
// import teacherVideoRoutes from './teacherVideoRoutes';
// import teacherPaperRoutes from './teacherPaperRoutes';
// import teacherStudentRoutes from './teacherStudentRoutes';
const router = (0, express_1.Router)();
// Mount teacher routes
router.use('/dashboard', teacherDashboardRoutes_1.default);
// router.use('/videos', teacherVideoRoutes);
// router.use('/papers', teacherPaperRoutes);
// router.use('/students', teacherStudentRoutes);
exports.default = router;
