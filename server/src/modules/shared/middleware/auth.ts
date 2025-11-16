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