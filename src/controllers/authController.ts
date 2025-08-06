import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { User, Role } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set in environment!');

interface JwtPayload {
  id: string;
  username: string;
  role: Role;
}

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;  // Ignore any role from the client

  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });

  const exists = await User.findOne({ username });
  if (exists)
    return res.status(400).json({ error: 'Username already taken' });

  // Role is always set to 'student', regardless of client input
  const user = new User({ username, password, role: 'student' });
  await user.save();

  res.status(201).json({
    message: 'User registered',
    user: { id: user._id, username: user.username, role: user.role }
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const payload: JwtPayload = {
    id: user._id.toString(),
    username: user.username,
    role: user.role
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  res.json({
    token,
    user: { id: user._id, username: user.username, role: user.role }
  });
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' });
  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    (req as any).userId = decoded.id;
    (req as any).userRole = decoded.role;
    (req as any).username = decoded.username;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
