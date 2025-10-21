"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imageUpload_1 = require("../config/imageUpload");
const imageUploadController_1 = require("../controllers/imageUploadController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Route for uploading paper option images
router.post('/upload/paper-options', auth_1.protect, imageUpload_1.uploadImage.single('image'), imageUploadController_1.uploadPaperOptionImage);
exports.default = router;
