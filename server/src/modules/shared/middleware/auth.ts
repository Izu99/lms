import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../../models/User';
import { UserRole } from '../types/common.types';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    username: string;
    firstName?: string;
    lastName?: string;
    studentType?: string;
    institute?: string; // Added for student
    year?: string;      // Added for student
    academicLevel?: string; // Added for AL/OL filtering
  };
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    let userQuery = User.findById(decoded.id).select('-password');

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
      institute: user.institute ? (user.institute as any)._id.toString() : undefined,
      year: user.year ? (user.year as any)._id.toString() : undefined,
      academicLevel: user.academicLevel,
    };

    next();

  } catch (err: any) {
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

// Role-based access control middleware

/**
 * Requires user to be a teacher (has access to all resources)
 */
export const requireTeacher = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

/**
 * Requires user to have paper management access (teacher OR paper_manager)
 */
export const requirePaperAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

/**
 * Requires user to have video management access (teacher OR video_manager)
 */
export const requireVideoAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

/**
 * Requires user to be a paper manager (only paper_manager role, not teacher)
 */
export const requirePaperManager = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

/**
 * Requires user to be a video manager (only video_manager role, not teacher)
 */
export const requireVideoManager = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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