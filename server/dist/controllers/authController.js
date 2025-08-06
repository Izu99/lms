"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET)
    throw new Error('JWT_SECRET is not set in environment!');
const register = async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: 'Username and password are required' });
    if (role && !['student', 'teacher', 'admin'].includes(role))
        return res.status(400).json({ error: 'Invalid role value' });
    const exists = await User_1.User.findOne({ username });
    if (exists)
        return res.status(400).json({ error: 'Username already taken' });
    const user = new User_1.User({ username, password, role: role ?? 'student' });
    await user.save();
    res.status(201).json({
        message: 'User registered',
        user: { id: user._id, username: user.username, role: user.role }
    });
};
exports.register = register;
const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User_1.User.findOne({ username });
    if (!user)
        return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await user.comparePassword(password);
    if (!valid)
        return res.status(401).json({ error: 'Invalid credentials' });
    const payload = {
        id: user._id.toString(),
        username: user.username,
        role: user.role
    };
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    res.json({
        token,
        user: { id: user._id, username: user.username, role: user.role }
    });
};
exports.login = login;
const authMiddleware = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer '))
        return res.status(401).json({ error: 'No token provided' });
    try {
        const token = auth.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.username = decoded.username;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
