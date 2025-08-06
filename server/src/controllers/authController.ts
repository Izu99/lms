import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set!');

// Registration controller
export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  const userExists = await User.findOne({ username });
  if (userExists) return res.status(400).json({ message: 'Username taken' });

  // Always set role to 'student'
  const user = new User({ username, password, role: 'student' });
  await user.save();
  res.status(201).json({ message: 'User registered' });
};

// Login controller
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, JWT_SECRET as string, { expiresIn: '1d' });
  res.json({ token, role: user.role, username: user.username });
};

// Add this to your authController.ts
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // From auth middleware
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



