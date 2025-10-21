"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPaperOptionImage = void 0;
const uploadPaperOptionImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided.' });
    }
    // Assuming the file is saved in 'uploads/paper-options/'
    const imageUrl = `/uploads/paper-options/${req.file.filename}`;
    res.status(200).json({ imageUrl, message: 'Image uploaded successfully.' });
};
exports.uploadPaperOptionImage = uploadPaperOptionImage;
