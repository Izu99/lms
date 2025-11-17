"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteZoomLink = exports.createZoomLink = exports.getZoomLinks = void 0;
const ZoomLink_1 = require("../models/ZoomLink");
// Get all zoom links
const getZoomLinks = async (req, res) => {
    try {
        const user = req.user;
        let query = {};
        if (user.role === 'student') {
            query = {
                institute: user.institute,
                year: user.year,
            };
        }
        const zoomLinks = await ZoomLink_1.ZoomLink.find(query)
            .populate('uploadedBy', 'username role')
            .populate('institute', 'name location')
            .populate('year', 'year name')
            .sort({ createdAt: -1 });
        res.json({ zoomLinks });
    }
    catch (error) {
        console.error("Get all zoom links error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getZoomLinks = getZoomLinks;
// Create new zoom link
const createZoomLink = async (req, res) => {
    try {
        const { title, description, link, institute: instituteId, year: yearId } = req.body;
        if (!title || !link || !instituteId || !yearId) {
            return res.status(400).json({ message: 'Title, link, institute, and year are required' });
        }
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication failed - no user ID' });
        }
        const newZoomLink = new ZoomLink_1.ZoomLink({
            title,
            description,
            link,
            uploadedBy: userId,
            institute: instituteId,
            year: yearId,
        });
        await newZoomLink.save();
        await newZoomLink.populate('uploadedBy', 'username role');
        await newZoomLink.populate('institute', 'name location');
        await newZoomLink.populate('year', 'year name');
        res.status(201).json({ message: 'Zoom link created successfully', zoomLink: newZoomLink });
    }
    catch (error) {
        console.error("Create zoom link error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createZoomLink = createZoomLink;
// Delete zoom link
const deleteZoomLink = async (req, res) => {
    try {
        const zoomLink = await ZoomLink_1.ZoomLink.findById(req.params.id);
        if (!zoomLink) {
            return res.status(404).json({ message: 'Zoom link not found' });
        }
        await zoomLink.deleteOne();
        res.json({ message: 'Zoom link deleted successfully' });
    }
    catch (error) {
        console.error("Delete zoom link error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteZoomLink = deleteZoomLink;
