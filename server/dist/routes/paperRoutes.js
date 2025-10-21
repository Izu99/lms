"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paperController_1 = require("../controllers/paperController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Paper CRUD operations
router.post('/', auth_1.protect, paperController_1.createPaper);
router.get('/', auth_1.protect, paperController_1.getAllPapers);
router.get('/:id', auth_1.protect, paperController_1.getPaperById);
router.put('/:id', auth_1.protect, paperController_1.updatePaper);
router.delete('/:id', auth_1.protect, paperController_1.deletePaper);
// Paper attempts and results
router.post('/:id/submit', auth_1.protect, paperController_1.submitPaper);
router.get('/results/my-results', auth_1.protect, paperController_1.getStudentResults);
router.get('/:id/results', auth_1.protect, paperController_1.getPaperResults);
exports.default = router;
