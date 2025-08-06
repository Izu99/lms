"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = void 0;
const roleMiddleware = (allowed) => {
    return (req, res, next) => {
        const role = req.userRole;
        if (!allowed.includes(role)) {
            return res.status(403).json({ error: 'Forbidden: insufficient role' });
        }
        next();
    };
};
exports.roleMiddleware = roleMiddleware;
