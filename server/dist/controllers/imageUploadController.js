"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadExplanationImage = exports.uploadPaperContentImage = exports.uploadIdCardImage = exports.uploadPaperOptionImage = void 0;
const uploadPaperOptionImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided.' });
    }
    // Assuming the file is saved in 'uploads/paper-options/'
    const imageUrl = `/paper-options/${req.file.filename}`;
    res.status(200).json({ imageUrl, message: 'Image uploaded successfully.' });
};
exports.uploadPaperOptionImage = uploadPaperOptionImage;
const uploadIdCardImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided.' });
    }
    const imageUrl = `/uploads/id-cards/${req.file.filename}`;
    res.status(200).json({ imageUrl, message: 'Image uploaded successfully.' });
};
exports.uploadIdCardImage = uploadIdCardImage;
const uploadPaperContentImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided.' });
    }
    const imageUrl = `/uploads/paper-content/${req.file.filename}`;
    res.status(200).json({ imageUrl, message: 'Image uploaded successfully.' });
};
exports.uploadPaperContentImage = uploadPaperContentImage;
const uploadExplanationImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No explanation image file provided.' });
    }
    const imageUrl = `/explanations/${req.file.filename}`;
    res.status(200).json({
        imageUrl,
        message: 'Explanation image uploaded successfully.',
        filename: req.file.filename
    });
};
exports.uploadExplanationImage = uploadExplanationImage;
