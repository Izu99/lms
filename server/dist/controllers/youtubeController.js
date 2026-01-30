"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementViewCount = exports.deleteYoutubeLink = exports.updateYoutubeLink = exports.getYoutubeLinkById = exports.createYoutubeLink = exports.getAllYoutubeLinks = void 0;
const Youtube_1 = require("../models/Youtube");
// Helper function to extract YouTube video ID
function extractYoutubeVideoId(youtubeUrl) {
    if (!youtubeUrl)
        return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
        /(?:youtu\.be\/)([^&\n?#]+)/,
        /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
        const match = youtubeUrl.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}
// Helper function to extract video ID from thumbnail URL
function extractThumbnailVideoId(thumbnailUrl) {
    if (!thumbnailUrl)
        return null;
    const match = thumbnailUrl.match(/img\.youtube\.com\/vi\/([^\/]+)\//);
    return match ? match[1] : null;
}
// Helper function to check if thumbnail matches YouTube URL
function isThumbnailMatchingYoutubeUrl(youtubeUrl, thumbnailUrl) {
    const youtubeId = extractYoutubeVideoId(youtubeUrl);
    const thumbnailId = extractThumbnailVideoId(thumbnailUrl);
    return !!(youtubeId && thumbnailId && youtubeId === thumbnailId);
}
// Generate YouTube thumbnail URL
function generateYoutubeThumbnail(youtubeUrl) {
    const videoId = extractYoutubeVideoId(youtubeUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
}
// Get all links
const getAllYoutubeLinks = async (_req, res) => {
    try {
        const links = await Youtube_1.YoutubeLink.find()
            .populate('uploadedBy', 'username role')
            .populate('class', 'name location')
            .populate('year', 'year name')
            .sort({ createdAt: -1 });
        res.json(links);
    }
    catch (err) {
        console.error('Error fetching YouTube links:', err);
        res.status(500).json({ error: 'Failed to fetch links' });
    }
};
exports.getAllYoutubeLinks = getAllYoutubeLinks;
// Create link
const createYoutubeLink = async (req, res) => {
    try {
        console.log('Request body received:', req.body);
        const { title, description, youtubeUrl, classId, yearId, thumbnailUrl, duration, category } = req.body;
        let finalThumbnailUrl = thumbnailUrl;
        // If no custom thumbnail provided, auto-generate from YouTube URL
        if (!thumbnailUrl || thumbnailUrl.trim() === '') {
            finalThumbnailUrl = generateYoutubeThumbnail(youtubeUrl);
            console.log('No thumbnail provided - auto-generating:', finalThumbnailUrl);
        }
        else {
            console.log('Custom thumbnail provided:', thumbnailUrl);
        }
        const linkData = {
            title,
            description,
            youtubeUrl,
            uploadedBy: req.user?.id,
            class: classId,
            year: yearId,
            thumbnailUrl: finalThumbnailUrl,
            duration,
            category,
            views: 0
        };
        console.log('Creating YouTube link with data:', linkData);
        const link = new Youtube_1.YoutubeLink(linkData);
        await link.save();
        // Populate before sending response
        await link.populate('uploadedBy class year');
        res.status(201).json(link);
    }
    catch (err) {
        console.error('Error creating YouTube link:', err);
        res.status(400).json({ error: 'Failed to create link', details: err.message });
    }
};
exports.createYoutubeLink = createYoutubeLink;
// Get by ID
const getYoutubeLinkById = async (req, res) => {
    try {
        const link = await Youtube_1.YoutubeLink.findById(req.params.id).populate('uploadedBy class year');
        if (!link)
            return res.status(404).json({ error: 'Link not found' });
        res.json(link);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch link' });
    }
};
exports.getYoutubeLinkById = getYoutubeLinkById;
// Update with smart thumbnail logic
const updateYoutubeLink = async (req, res) => {
    try {
        const { title, description, youtubeUrl, classId, yearId, thumbnailUrl, duration, category } = req.body;
        let finalThumbnailUrl = thumbnailUrl;
        // Smart thumbnail logic:
        // 1. If no custom thumbnail provided, auto-generate
        // 2. If custom thumbnail provided but doesn't match YouTube URL, auto-generate
        // 3. If custom thumbnail provided and matches YouTube URL, keep it
        // 4. If custom thumbnail provided and is NOT a YouTube thumbnail, keep it (user's custom image)
        if (!thumbnailUrl || thumbnailUrl.trim() === '') {
            // No thumbnail provided - auto-generate
            finalThumbnailUrl = generateYoutubeThumbnail(youtubeUrl);
            console.log('No thumbnail provided - auto-generating:', finalThumbnailUrl);
        }
        else if (thumbnailUrl.includes('img.youtube.com/vi/')) {
            // It's a YouTube thumbnail - check if it matches the video
            if (!isThumbnailMatchingYoutubeUrl(youtubeUrl, thumbnailUrl)) {
                // YouTube IDs don't match - regenerate
                finalThumbnailUrl = generateYoutubeThumbnail(youtubeUrl);
                console.log('YouTube thumbnail ID mismatch - regenerating:', finalThumbnailUrl);
            }
            else {
                // YouTube IDs match - keep existing
                finalThumbnailUrl = thumbnailUrl;
                console.log('YouTube thumbnail ID matches - keeping existing');
            }
        }
        else {
            // It's a custom image (not YouTube) - always keep it
            finalThumbnailUrl = thumbnailUrl;
            console.log('Custom image provided - keeping it');
        }
        const updateData = {
            title,
            description,
            youtubeUrl,
            class: classId,
            year: yearId,
            thumbnailUrl: finalThumbnailUrl,
            duration,
            category
        };
        console.log('Update data:', {
            youtubeUrl,
            providedThumbnail: thumbnailUrl,
            finalThumbnail: finalThumbnailUrl,
            youtubeId: extractYoutubeVideoId(youtubeUrl),
            thumbnailId: extractThumbnailVideoId(thumbnailUrl)
        });
        const link = await Youtube_1.YoutubeLink.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('uploadedBy class year');
        if (!link)
            return res.status(404).json({ error: 'Link not found' });
        res.json(link);
    }
    catch (err) {
        console.error('Error updating YouTube link:', err);
        res.status(400).json({ error: 'Failed to update link', details: err.message });
    }
};
exports.updateYoutubeLink = updateYoutubeLink;
// Delete
const deleteYoutubeLink = async (req, res) => {
    try {
        const link = await Youtube_1.YoutubeLink.findByIdAndDelete(req.params.id);
        if (!link)
            return res.status(404).json({ error: 'Link not found' });
        res.json({ message: 'Link deleted' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete link' });
    }
};
exports.deleteYoutubeLink = deleteYoutubeLink;
// Increment View Count
const incrementViewCount = async (req, res) => {
    try {
        const link = await Youtube_1.YoutubeLink.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
        if (!link)
            return res.status(404).json({ error: 'Link not found' });
        res.json({ message: 'View counted', views: link.views });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to increment views' });
    }
};
exports.incrementViewCount = incrementViewCount;
