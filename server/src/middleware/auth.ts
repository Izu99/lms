import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Unauthorized',
        error: 'Missing or invalid authorization header'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Unauthorized',
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
    // Find user in database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found',
        error: 'Token is valid but user no longer exists'
      });
    }

    // Attach user to request object
    (req as any).user = user;
    next();
    
  } catch (err: any) {
    console.error('❌ Auth Middleware Error:', err.message);
    
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        error: 'Please login again'
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        error: 'Token is malformed or invalid'
      });
    }
    
    if (err.name === 'NotBeforeError') {
      return res.status(401).json({ 
        message: 'Token not active',
        error: 'Token is not active yet'
      });
    }

    // Database or other errors
    if (err.name === 'CastError') {
      return res.status(401).json({ 
        message: 'Invalid user ID',
        error: 'Token contains invalid user reference'
      });
    }
    
    // Generic error fallback
    return res.status(500).json({ 
      message: 'Internal server error',
      error: 'Authentication service temporarily unavailable'
    });
  }
};
