"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../modules/shared/middleware/auth");
const coursePackageController_1 = require("../controllers/coursePackageController");
const router = express_1.default.Router();
// All routes are protected
router.use(auth_1.protect);
router.route('/')
    .get(coursePackageController_1.getCoursePackages)
    .post(coursePackageController_1.createCoursePackage);
router.route('/:id')
    .get(coursePackageController_1.getCoursePackageById)
    .put(coursePackageController_1.updateCoursePackage)
    .delete(coursePackageController_1.deleteCoursePackage);
exports.default = router;
