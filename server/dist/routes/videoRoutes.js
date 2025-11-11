"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../config/multer");
const auth_1 = require("../modules/shared/middleware/auth");
const videoController = __importStar(require("../controllers/videoController"));
const router = express_1.default.Router();
router.post('/', auth_1.protect, multer_1.upload.single('video'), videoController.uploadVideo);
router.get('/', auth_1.protect, videoController.getAllVideos);
router.get('/:id', auth_1.protect, videoController.getVideoById);
router.put('/:id', auth_1.protect, multer_1.upload.single('video'), videoController.updateVideo);
router.delete('/:id', auth_1.protect, videoController.deleteVideo);
// NEW: Route to increment view count
router.post('/:id/view', auth_1.protect, videoController.incrementViewCount);
// Routes for video analytics
router.post('/:id/watch', auth_1.protect, videoController.recordWatch);
router.get('/:id/analytics', auth_1.protect, videoController.getVideoAnalytics);
exports.default = router;
