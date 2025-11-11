"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentStatus = exports.getAllStudents = exports.updateUserProfile = exports.getUserProfile = exports.getCurrentUser = exports.login = exports.checkUsername = exports.register = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET)
    throw new Error('JWT_SECRET is not set!');
// Helper function to delete uploaded files from temp directory
const deleteUploadedFile = (filename) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '..', '..', 'uploads', 'id-cards', 'temp', filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️ Deleted temp file: ${filename}`);
        }
    }
    catch (error) {
        console.error('Error deleting temp file:', error);
    }
};
// Helper function to delete all uploaded files for a user
const deleteAllUploadedFiles = (files) => {
    files.forEach(file => deleteUploadedFile(file.filename));
};
// Helper function to get user's ID card folder path
// Usage: getUserIdCardFolder(userId) → '/uploads/id-cards/507f1f77bcf86cd799439011/'
const getUserIdCardFolder = (userId) => {
    return `/uploads/id-cards/${userId}/`;
};
// Registration controller
const register = async (req, res) => {
    const { username, password, firstName, lastName, address, phoneNumber, whatsappNumber, telegram, email } = req.body;
    let idCardFrontImage;
    let idCardBackImage;
    let uploadedFiles = [];
    // Handle multiple file uploads
    const files = req.files;
    const frontFile = files?.idCardFront?.[0];
    const backFile = files?.idCardBack?.[0];
    if (frontFile)
        uploadedFiles.push(frontFile);
    if (backFile)
        uploadedFiles.push(backFile);
    // Log the received registration data (excluding password)
    console.log('Registration attempt:', {
        username,
        email,
        firstName,
        lastName,
        address,
        phoneNumber,
        whatsappNumber,
        telegram,
        hasIdCardFront: !!frontFile,
        hasIdCardBack: !!backFile
    });
    // Validate required fields
    if (!username || !password) {
        console.log('Registration failed: Missing username or password');
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (!email) {
        console.log('Registration failed: Missing email');
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!phoneNumber) {
        console.log('Registration failed: Missing phone number');
        return res.status(400).json({ message: 'Phone number is required' });
    }
    if (!firstName || !lastName) {
        console.log('Registration failed: Missing first name or last name');
        return res.status(400).json({ message: 'First name and last name are required' });
    }
    try {
        const existingUser = await User_1.User.findOne({
            $or: [
                { username: { $regex: new RegExp("^" + username + "$", "i") } },
                { email: { $regex: new RegExp("^" + email + "$", "i") } },
                { phoneNumber: phoneNumber }
            ]
        });
        if (existingUser) {
            // Delete uploaded files if user already exists
            deleteAllUploadedFiles(uploadedFiles);
            let message = 'Username already taken';
            if (existingUser.email === email) {
                message = 'Email already registered';
            }
            else if (existingUser.phoneNumber === phoneNumber) {
                message = 'Phone number already registered';
            }
            return res.status(400).json({ message });
        }
        // Create user first (without image paths)
        const user = new User_1.User({
            username,
            password,
            email,
            firstName,
            lastName,
            address,
            phoneNumber,
            whatsappNumber,
            telegram,
            role: 'student',
        });
        await user.save();
        // 🎯 IMPORTANT: Organize images in user-specific folders
        // Structure: uploads/id-cards/{userId}/front.jpg and back.jpg
        // Benefits:
        // - User ID never changes (unlike username)
        // - Clean organization by user
        // - Easy to find both images by user ID
        // - Better security and maintenance
        if (uploadedFiles.length > 0) {
            const fs = require('fs');
            const path = require('path');
            // Create user-specific directory
            const userDir = path.join(__dirname, '..', '..', 'uploads', 'id-cards', user._id.toString());
            if (!fs.existsSync(userDir)) {
                fs.mkdirSync(userDir, { recurmakesive: true });
            }
            try {
                // Move and rename front image
                if (frontFile) {
                    const oldFrontPath = path.join(__dirname, '..', '..', 'uploads', 'id-cards', 'temp', frontFile.filename);
                    const frontExtension = path.extname(frontFile.originalname);
                    const newFrontPath = path.join(userDir, `front${frontExtension}`);
                    if (fs.existsSync(oldFrontPath)) {
                        fs.renameSync(oldFrontPath, newFrontPath);
                        idCardFrontImage = `/uploads/id-cards/${user._id}/front${frontExtension}`;
                        console.log(`✅ ID card front image saved: ${user._id}/front${frontExtension}`);
                    }
                }
                // Move and rename back image
                if (backFile) {
                    const oldBackPath = path.join(__dirname, '..', '..', 'uploads', 'id-cards', 'temp', backFile.filename);
                    const backExtension = path.extname(backFile.originalname);
                    const newBackPath = path.join(userDir, `back${backExtension}`);
                    if (fs.existsSync(oldBackPath)) {
                        fs.renameSync(oldBackPath, newBackPath);
                        idCardBackImage = `/uploads/id-cards/${user._id}/back${backExtension}`;
                        console.log(`✅ ID card back image saved: ${user._id}/back${backExtension}`);
                    }
                }
                // Update user with image paths
                user.idCardFrontImage = idCardFrontImage;
                user.idCardBackImage = idCardBackImage;
                await user.save();
            }
            catch (renameError) {
                console.error('❌ Error organizing ID card images:', renameError);
                // Clean up temp files
                deleteAllUploadedFiles(uploadedFiles);
            }
        }
        return res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        console.error('Registration error:', error);
        // Delete uploaded files if user creation fails
        if (uploadedFiles.length > 0) {
            deleteAllUploadedFiles(uploadedFiles);
        }
        // Check for MongoDB validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            console.error('Validation errors:', validationErrors);
            return res.status(400).json({
                message: 'Validation failed',
                errors: validationErrors
            });
        }
        // Check for MongoDB duplicate key error
        if (error.code === 11000) {
            console.error('Duplicate key error:', error.keyValue);
            return res.status(400).json({
                message: 'Duplicate value error',
                field: Object.keys(error.keyValue)[0]
            });
        }
        // Other server errors
        console.error('Unexpected error during registration:', {
            errorName: error.name,
            errorMessage: error.message,
            errorStack: error.stack
        });
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
// Check username availability
const checkUsername = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }
        const existingUser = await User_1.User.findOne({
            username: { $regex: new RegExp("^" + username + "$", "i") }
        });
        res.json({
            available: !existingUser,
            message: existingUser ? 'Username is already taken' : 'Username is available'
        });
    }
    catch (error) {
        console.error('Check username error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.checkUsername = checkUsername;
// Login controller
const login = async (req, res) => {
    const { identifier, password } = req.body; // Use 'identifier' to represent username, email, or phone number
    const user = await User_1.User.findOne({
        $or: [
            { username: { $regex: new RegExp("^" + identifier + "$", "i") } },
            { email: { $regex: new RegExp("^" + identifier + "$", "i") } },
            { phoneNumber: identifier }
        ]
    });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = { id: user._id, role: user.role };
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    // Return consistent user data for frontend
    res.json({
        token,
        role: user.role,
        username: user.username,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        user: {
            id: user._id,
            username: user.username,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        }
    });
};
exports.login = login;
// Get current user
// Get current user - CORRECTED VERSION
const getCurrentUser = async (req, res) => {
    try {
        // FIX: Using the new auth middleware format
        const userId = req.user.id; // ✅ Changed to use .id instead of ._id
        const user = await User_1.User.findById(userId).select('-password');
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
        const requestingUserId = req.user.id;
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
    let uploadedFiles = [];
    try {
        const { id } = req.params;
        const requestingUserId = req.user.id;
        // Users can only update their own profile
        if (id !== requestingUserId.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { username, email, phoneNumber, firstName, lastName, address, institute, year, whatsappNumber, telegram, newPassword // Only need newPassword - no current password required
         } = req.body;
        let idCardFrontImage;
        let idCardBackImage;
        // Handle multiple file uploads
        const files = req.files;
        const frontFile = files?.idCardFront?.[0];
        const backFile = files?.idCardBack?.[0];
        if (frontFile)
            uploadedFiles.push(frontFile);
        if (backFile)
            uploadedFiles.push(backFile);
        const user = await User_1.User.findById(id);
        if (!user) {
            // Delete uploaded files if user not found
            if (uploadedFiles.length > 0)
                deleteAllUploadedFiles(uploadedFiles);
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if username is being changed and if it's already taken
        if (username && username !== user.username) {
            const existingUser = await User_1.User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== id) {
                if (uploadedFiles.length > 0)
                    deleteAllUploadedFiles(uploadedFiles);
                return res.status(400).json({ message: 'Username already taken' });
            }
        }
        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User_1.User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== id) {
                if (uploadedFiles.length > 0)
                    deleteAllUploadedFiles(uploadedFiles);
                return res.status(400).json({ message: 'Email already taken' });
            }
        }
        // Check if phoneNumber is being changed and if it's already taken
        if (phoneNumber && phoneNumber !== user.phoneNumber) {
            const existingUser = await User_1.User.findOne({ phoneNumber });
            if (existingUser && existingUser._id.toString() !== id) {
                if (uploadedFiles.length > 0)
                    deleteAllUploadedFiles(uploadedFiles);
                return res.status(400).json({ message: 'Phone number already taken' });
            }
        }
        // Handle password change - simplified (no current password needed)
        if (newPassword) {
            if (newPassword.length < 6) {
                if (uploadedFiles.length > 0)
                    deleteAllUploadedFiles(uploadedFiles);
                return res.status(400).json({ message: 'New password must be at least 6 characters' });
            }
            user.password = newPassword; // Will be hashed by pre-save hook
        }
        // Update basic fields
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        if (phoneNumber)
            user.phoneNumber = phoneNumber;
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        if (address)
            user.address = address;
        if (institute)
            user.institute = new mongoose_1.default.Types.ObjectId(institute);
        if (year)
            user.year = new mongoose_1.default.Types.ObjectId(year);
        if (whatsappNumber)
            user.whatsappNumber = whatsappNumber;
        if (telegram)
            user.telegram = telegram;
        // Handle ID card image updates
        if (uploadedFiles.length > 0) {
            const fs = require('fs');
            const path = require('path');
            const userDir = path.join(__dirname, '..', '..', 'uploads', 'id-cards', user._id.toString());
            if (!fs.existsSync(userDir)) {
                fs.mkdirSync(userDir, { recursive: true });
            }
            try {
                // Move and rename front image
                if (frontFile) {
                    const oldFrontPath = path.join(__dirname, '..', '..', 'uploads', 'id-cards', 'temp', frontFile.filename);
                    const frontExtension = path.extname(frontFile.originalname);
                    const newFrontPath = path.join(userDir, `front${frontExtension}`);
                    // Delete old front image if it exists
                    if (user.idCardFrontImage) {
                        const oldImageFullPath = path.join(__dirname, '..', '..', user.idCardFrontImage);
                        if (fs.existsSync(oldImageFullPath)) {
                            fs.unlinkSync(oldImageFullPath);
                            console.log(`🗑️ Deleted old ID card front image for user ${user._id}`);
                        }
                    }
                    if (fs.existsSync(oldFrontPath)) {
                        fs.renameSync(oldFrontPath, newFrontPath);
                        idCardFrontImage = `/uploads/id-cards/${user._id}/front${frontExtension}`;
                        user.idCardFrontImage = idCardFrontImage;
                        console.log(`✅ ID card front image updated: ${user._id}/front${frontExtension}`);
                    }
                }
                // Move and rename back image
                if (backFile) {
                    const oldBackPath = path.join(__dirname, '..', '..', 'uploads', 'id-cards', 'temp', backFile.filename);
                    const backExtension = path.extname(backFile.originalname);
                    const newBackPath = path.join(userDir, `back${backExtension}`);
                    // Delete old back image if it exists
                    if (user.idCardBackImage) {
                        const oldImageFullPath = path.join(__dirname, '..', '..', user.idCardBackImage);
                        if (fs.existsSync(oldImageFullPath)) {
                            fs.unlinkSync(oldImageFullPath);
                            console.log(`🗑️ Deleted old ID card back image for user ${user._id}`);
                        }
                    }
                    if (fs.existsSync(oldBackPath)) {
                        fs.renameSync(oldBackPath, newBackPath);
                        idCardBackImage = `/uploads/id-cards/${user._id}/back${backExtension}`;
                        user.idCardBackImage = idCardBackImage;
                        console.log(`✅ ID card back image updated: ${user._id}/back${backExtension}`);
                    }
                }
            }
            catch (renameError) {
                console.error('❌ Error organizing ID card images during profile update:', renameError);
                // Clean up temp files
                deleteAllUploadedFiles(uploadedFiles);
                // Do not return error here, allow other fields to save
            }
        }
        await user.save();
        // Return updated user without password
        const updatedUser = await User_1.User.findById(id).select('-password');
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error('Update user profile error:', error);
        // Delete uploaded files if user update fails
        if (uploadedFiles.length > 0) {
            deleteAllUploadedFiles(uploadedFiles);
        }
        // Check for MongoDB validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            console.error('Validation errors:', validationErrors);
            return res.status(400).json({
                message: 'Validation failed',
                errors: validationErrors
            });
        }
        // Check for MongoDB duplicate key error
        if (error.code === 11000) {
            console.error('Duplicate key error:', error.keyValue);
            return res.status(400).json({
                message: 'Duplicate value error',
                field: Object.keys(error.keyValue)[0]
            });
        }
        // Other server errors
        console.error('Unexpected error during profile update:', {
            errorName: error.name,
            errorMessage: error.message,
            errorStack: error.stack
        });
        return res.status(500).json({ message: 'Server error' });
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
