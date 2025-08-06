"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Video_1 = require("../models/Video");
const router = express_1.default.Router();
router.put('/:id', auth_1.authMiddleware, async (req, res) => {
    const { title, description } = req.body;
    try {
        const updatedVideo = await Video_1.Video.findByIdAndUpdate(req.params.id, { title, description }, // Fields to update
        { new: true, runValidators: true } // Return updated doc, run schema validation
        );
        if (!updatedVideo) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.json({ message: 'Video updated', video: updatedVideo });
    }
    catch (err) {
        res.status(400).json({ message: 'Update failed', error: err });
    }
});
exports.default = router;
