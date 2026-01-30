"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAnyRole = exports.requireTeacherOrAdmin = exports.requireAdmin = exports.requireTeacher = exports.requireStudent = exports.requireRole = void 0;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireStudent = (0, exports.requireRole)(['student']);
exports.requireTeacher = (0, exports.requireRole)(['teacher']);
exports.requireAdmin = (0, exports.requireRole)(['admin']);
exports.requireTeacherOrAdmin = (0, exports.requireRole)(['teacher', 'admin']);
exports.requireAnyRole = (0, exports.requireRole)(['student', 'teacher', 'admin']);
