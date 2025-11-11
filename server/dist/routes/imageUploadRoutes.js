"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageUpload_1 = require("../config/imageUpload");
const idCardUpload_1 = require("../config/idCardUpload");
const paperContentUpload_1 = require("../config/paperContentUpload");
const explanationUpload_1 = require("../config/explanationUpload");
const imageUploadController_1 = require("../controllers/imageUploadController");
const auth_1 = require("../modules/shared/middleware/auth");
const router = express_1.default.Router();
// Route for uploading paper option images
router.post('/upload/paper-options', auth_1.protect, imageUpload_1.uploadImage.single('image'), imageUploadController_1.uploadPaperOptionImage);
// Route for uploading id card images
router.post('/upload/id-card', auth_1.protect, idCardUpload_1.uploadIdCard.single('image'), imageUploadController_1.uploadIdCardImage);
// Route for uploading paper content images
router.post('/upload/paper-content', auth_1.protect, paperContentUpload_1.uploadPaperContent.single('image'), imageUploadController_1.uploadPaperContentImage);
// Route for uploading explanation images (විවරණ images)
router.post('/upload/explanation', auth_1.protect, explanationUpload_1.uploadExplanationImage.single('image'), imageUploadController_1.uploadExplanationImage);
exports.default = router;
