"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadPaperContentImage = exports.uploadIdCardImage = exports.uploadExplanationImage = exports.uploadPaperOptionImage = void 0;
const uploadPaperOptionImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided.' });
    }
    // req.file.path contains the full path, e.g., "uploads/paper/answers/123.jpg"
    // Normalize path separators to forward slashes for URL compatibility
    const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    res.status(200).json({ imageUrl, message: 'Option image uploaded successfully.' });
};
exports.uploadPaperOptionImage = uploadPaperOptionImage;
const uploadExplanationImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No explanation image file provided.' });
    }
    // req.file.path contains the full path, e.g., "uploads/paper/explanations/123.jpg"
    // Normalize path separators to forward slashes for URL compatibility
    const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    res.status(200).json({
        imageUrl,
        message: 'Explanation image uploaded successfully.',
        filename: req.file.filename
    });
};
exports.uploadExplanationImage = uploadExplanationImage;
const uploadIdCardImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided.' });
    }
    // req.file.path contains the full path, e.g., "uploads/id-cards/123.jpg"
    // Normalize path separators to forward slashes for URL compatibility
    const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    res.status(200).json({ imageUrl, message: 'Image uploaded successfully.' });
};
exports.uploadIdCardImage = uploadIdCardImage;
const uploadPaperContentImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file provided.' });
    }
    // req.file.path contains the full path, e.g., "uploads/paper/questions/123.jpg"
    // Normalize path separators to forward slashes for URL compatibility
    const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    res.status(200).json({ imageUrl, message: 'Image uploaded successfully.' });
};
exports.uploadPaperContentImage = uploadPaperContentImage;
const deleteImage = async (req, res) => {
    try {
        const { fileUrl } = req.body;
        if (!fileUrl) {
            return res.status(400).json({ message: 'File URL is required.' });
        }
        // Remove leading slash and construct file path
        const filePath = fileUrl.startsWith('/') ? fileUrl.substring(1) : fileUrl;
        // Security check: ensure the path is within uploads directory
        if (!filePath.startsWith('uploads/')) {
            return res.status(400).json({ message: 'Invalid file path.' });
        }
        const fs = require('fs').promises;
        const path = require('path');
        const fullPath = path.join(process.cwd(), filePath);
        // Check if file exists
        try {
            await fs.access(fullPath);
        }
        catch {
            return res.status(404).json({ message: 'File not found.' });
        }
        // Delete the file
        await fs.unlink(fullPath);
        res.status(200).json({ message: 'Image deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Failed to delete image.' });
    }
};
exports.deleteImage = deleteImage;
