"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activityController_1 = require("../controllers/activityController");
const auth_1 = require("../modules/shared/middleware/auth");
const authorize_1 = require("../modules/shared/middleware/authorize");
const router = express_1.default.Router();
router.get('/daily', auth_1.protect, (0, authorize_1.authorize)(['teacher', 'admin']), activityController_1.getDailyActivity);
exports.default = router;
