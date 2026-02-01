"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.validateFileUpload = exports.securityHeaders = exports.sanitizeInput = exports.apiLimiter = exports.authLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Rate limiting for authentication endpoints
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Increased from 5 to 20 for better UX
    message: 'Too many login attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
// Rate limiting for general API endpoints
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased from 100 to 500 for modern SPA dashboards
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});
// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
    // Recursively remove any potential MongoDB operators (keys starting with $)
    const sanitize = (obj) => {
        if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                if (key.startsWith('$')) {
                    delete obj[key];
                }
                else if (typeof obj[key] === 'object') {
                    sanitize(obj[key]);
                }
            });
        }
    };
    // Mutate objects in place to avoid "getter only" errors in Express 5
    if (req.body)
        sanitize(req.body);
    if (req.query)
        sanitize(req.query);
    if (req.params)
        sanitize(req.params);
    next();
};
exports.sanitizeInput = sanitizeInput;
// Security headers middleware
const securityHeaders = (req, res, next) => {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Referrer policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Content Security Policy
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
    next();
};
exports.securityHeaders = securityHeaders;
// File upload validation
const validateFileUpload = (req, res, next) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'application/pdf'
    ];
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    if (req.file) {
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid file type. Only images, videos, and PDFs are allowed.'
            });
        }
        if (req.file.size > maxFileSize) {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 50MB.'
            });
        }
    }
    if (req.files) {
        const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
        for (const file of files) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file type. Only images, videos, and PDFs are allowed.'
                });
            }
            if (file.size > maxFileSize) {
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size is 50MB.'
                });
            }
        }
    }
    next();
};
exports.validateFileUpload = validateFileUpload;
// Error handler that doesn't expose system details
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    // Don't expose error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            ...(isDevelopment && { details: err.message })
        });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Duplicate entry'
        });
    }
    // Generic error response
    res.status(err.status || 500).json({
        success: false,
        message: isDevelopment ? err.message : 'An error occurred',
        ...(isDevelopment && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
