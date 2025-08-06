import express from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  const userExists = await User.findOne({ username });
  if (userExists) return res.status(400).json({ message: 'Username taken' });
  const user = new User({ username, password, role });
  await user.save();
  res.status(201).json({ message: 'User registered' });
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' });
  res.json({ token, role: user.role, username: user.username });
});

export default router;
