"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireVideoManager = exports.requirePaperManager = exports.requireVideoAccess = exports.requirePaperAccess = exports.requireTeacher = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../../../models/User");
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                error: 'Missing or invalid authorization header'
            });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                error: 'No token provided'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        let userQuery = User_1.User.findById(decoded.id).select('-password');
        // Always populate institute and year, they will be null if not present or not a student
        userQuery = userQuery.populate('institute', '_id name').populate('year', '_id name');
        const user = await userQuery;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
                error: 'Token is valid but user no longer exists'
            });
        }
        req.user = {
            id: user._id.toString(),
            role: user.role,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            studentType: user.studentType,
            institute: user.institute ? user.institute._id.toString() : undefined,
            year: user.year ? user.year._id.toString() : undefined,
        };
        next();
    }
    catch (err) {
        console.error('❌ Auth Middleware Error:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                error: 'Please login again'
            });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
                error: 'Token is malformed or invalid'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: 'Authentication service temporarily unavailable'
        });
    }
};
exports.protect = protect;
// Role-based access control middleware
/**
 * Requires user to be a teacher (has access to all resources)
 */
const requireTeacher = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
            error: 'Authentication required'
        });
    }
    if (req.user.role !== 'teacher') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden',
            error: 'Teacher access required'
        });
    }
    next();
};
exports.requireTeacher = requireTeacher;
/**
 * Requires user to have paper management access (teacher OR paper_manager)
 */
const requirePaperAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
            error: 'Authentication required'
        });
    }
    if (req.user.role !== 'teacher' && req.user.role !== 'paper_manager') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden',
            error: 'Paper management access required'
        });
    }
    next();
};
exports.requirePaperAccess = requirePaperAccess;
/**
 * Requires user to have video management access (teacher OR video_manager)
 */
const requireVideoAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
            error: 'Authentication required'
        });
    }
    if (req.user.role !== 'teacher' && req.user.role !== 'video_manager') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden',
            error: 'Video management access required'
        });
    }
    next();
};
exports.requireVideoAccess = requireVideoAccess;
/**
 * Requires user to be a paper manager (only paper_manager role, not teacher)
 */
const requirePaperManager = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
            error: 'Authentication required'
        });
    }
    if (req.user.role !== 'paper_manager') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden',
            error: 'Paper manager access required'
        });
    }
    next();
};
exports.requirePaperManager = requirePaperManager;
/**
 * Requires user to be a video manager (only video_manager role, not teacher)
 */
const requireVideoManager = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
            error: 'Authentication required'
        });
    }
    if (req.user.role !== 'video_manager') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden',
            error: 'Video manager access required'
        });
    }
    next();
};
exports.requireVideoManager = requireVideoManager;
