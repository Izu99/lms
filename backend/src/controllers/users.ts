
import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';

interface AuthRequest extends Request {
  user?: { id: string };
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { username, password, newPassword } = req.body;

  try {
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username) {
      user.username = username;
    }

    if (password && newPassword) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid current password" });

      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getStudents = async (req: Request, res: Response) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};


export const getStudentCount = async (req: Request, res: Response) => {
    try {
        const count = await User.countDocuments({ role: 'student' });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const allowStudent = async (req: Request, res: Response) => {
    const { studentId, videoId } = req.body;
    try {
        await User.findByIdAndUpdate(studentId, { $addToSet: { allowedVideos: videoId } });
        res.status(200).json({ message: "Student allowed successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
