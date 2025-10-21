"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentStatus = exports.getAllStudents = exports.updateUserProfile = exports.getUserProfile = exports.getCurrentUser = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET)
    throw new Error('JWT_SECRET is not set!');
// Registration controller
const register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        // Check if username already exists
        const existingUser = await User_1.User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }
        // Create user with role 'student' by default, without email, firstName, lastName (optional fields)
        const user = new User_1.User({
            username,
            password,
            role: 'student',
        });
        await user.save();
        return res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
// Login controller
const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User_1.User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = { id: user._id };
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role, username: user.username });
};
exports.login = login;
// Get current user
// Get current user - CORRECTED VERSION
const getCurrentUser = async (req, res) => {
    try {
        // FIX: Change from req.userId to req.user._id
        const userId = req.user._id; // ✅ Changed this line
        const user = await User_1.User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Return more complete user info
        res.json({
            username: user.username,
            role: user.role,
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        });
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCurrentUser = getCurrentUser;
// Get user profile by ID
const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const requestingUserId = req.user._id;
        // Users can only view their own profile
        if (id !== requestingUserId.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const user = await User_1.User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserProfile = getUserProfile;
// Update user profile (minimal fields only)
// Update user profile - NO current password needed
const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const requestingUserId = req.user._id;
        // Users can only update their own profile
        if (id !== requestingUserId.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { username, email, firstName, lastName, newPassword // Only need newPassword - no current password required
         } = req.body;
        const user = await User_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if username is being changed and if it's already taken
        if (username && username !== user.username) {
            const existingUser = await User_1.User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }
        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User_1.User.findOne({ email });
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
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        await user.save();
        // Return updated user without password
        const updatedUser = await User_1.User.findById(id).select('-password');
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateUserProfile = updateUserProfile;
// Get all students (Teachers/Admin only)
const getAllStudents = async (req, res) => {
    try {
        const requestingUser = req.user;
        // Only teachers and admins can view all students
        if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only teachers can view student list.' });
        }
        const students = await User_1.User.find({ role: 'student' }, '-password' // Exclude password field
        ).sort({ createdAt: -1 }); // Sort by newest first
        res.json({
            students,
            total: students.length,
            message: 'Students retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get all students error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllStudents = getAllStudents;
// Update student status (Teachers/Admin only)
const updateStudentStatus = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { status, notes } = req.body;
        const requestingUser = req.user;
        // Only teachers and admins can update student status
        if (requestingUser.role !== 'teacher' && requestingUser.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only teachers can update student status.' });
        }
        // Validate status
        const validStatuses = ['active', 'inactive', 'pending', 'paid', 'unpaid'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        const student = await User_1.User.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        if (student.role !== 'student') {
            return res.status(400).json({ message: 'User is not a student' });
        }
        // Update status and notes
        if (status)
            student.status = status;
        if (notes !== undefined)
            student.notes = notes;
        await student.save();
        // Return updated student without password
        const updatedStudent = await User_1.User.findById(studentId).select('-password');
        res.json({
            message: 'Student status updated successfully',
            student: updatedStudent
        });
    }
    catch (error) {
        console.error('Update student status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateStudentStatus = updateStudentStatus;
