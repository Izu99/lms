"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
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
