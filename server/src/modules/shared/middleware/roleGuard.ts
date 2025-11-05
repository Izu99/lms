import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/common.types';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    username: string;
  };
}

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

export const requireStudent = requireRole(['student']);
export const requireTeacher = requireRole(['teacher']);
export const requireAdmin = requireRole(['admin']);
export const requireTeacherOrAdmin = requireRole(['teacher', 'admin']);
export const requireAnyRole = requireRole(['student', 'teacher', 'admin']);