import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is not set!');

// Registration controller
export const register = async (req: Request, res: Response) => {
  const { username, password, firstName, lastName, address, institute, year, phoneNumber, whatsappNumber, telegram } = req.body;
  const idCardImage = req.file ? `/uploads/id-cards/${req.file.filename}` : undefined;


  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username: { $regex: new RegExp("^" + username + "$", "i") } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create user with role 'student' by default, without email, firstName, lastName (optional fields)
    const user = new User({
      username,
      password,
      firstName,
      lastName,
      address,
      institute,
      year,
      phoneNumber,
      whatsappNumber,
      telegram,
      idCardImage,
      role: 'student',
    });

    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
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

// Get current user
// Get current user - CORRECTED VERSION
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // FIX: Change from req.userId to req.user._id
    const userId = (req as any).user._id;  // ✅ Changed this line
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return more complete user info
    res.json({ 
      user: {
        username: user.username, 
        role: user.role,
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get user profile by ID
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestingUserId = (req as any).user._id;
    
    // Users can only view their own profile
    if (id !== requestingUserId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile (minimal fields only)
// Update user profile - NO current password needed
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requestingUserId = (req as any).user._id;
    
    // Users can only update their own profile
    if (id !== requestingUserId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { 
      username, 
      email, 
      firstName, 
      lastName,
      newPassword    // Only need newPassword - no current password required
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if username is being changed and if it's already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken' });
      }
    }

    // Handle password change - simplified (no current password needed)
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }
      user.password = newPassword; // Will be hashed by pre-save hook
    }

    // Update basic fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(id).select('-password');
    res.json({ message: 'Profile updated successfully', user: updatedUser });
    
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students (Teachers/Admin only)
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const requestingUser = (req as any).user;
    
    // Only teachers and admins can view all students
    if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only teachers can view student list.' });
    }

    const students = await User.find(
      { role: 'student' },
      '-password' // Exclude password field
    ).sort({ createdAt: -1 }); // Sort by newest first

    res.json({ 
      students,
      total: students.length,
      message: 'Students retrieved successfully'
    });

  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update student status (Teachers/Admin only)
export const updateStudentStatus = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { status, notes } = req.body;
    const requestingUser = (req as any).user;

    // Only teachers and admins can update student status
    if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only teachers can update student status.' });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'pending', 'paid', 'unpaid'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.role !== 'student') {
      return res.status(400).json({ message: 'User is not a student' });
    }

    // Update status and notes
    if (status) student.status = status;
    if (notes !== undefined) student.notes = notes;

    await student.save();

    // Return updated student without password
    const updatedStudent = await User.findById(studentId).select('-password');
    
    res.json({ 
      message: 'Student status updated successfully',
      student: updatedStudent
    });

  } catch (error) {
    console.error('Update student status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

