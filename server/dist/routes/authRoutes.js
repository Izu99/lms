"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
// Register route
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Required fields missing' });
    }
    const userExists = await User_1.User.findOne({ username });
    if (userExists)
        return res.status(400).json({ message: 'Username taken' });
    const user = new User_1.User({ username, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered' });
});
// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User_1.User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = { id: user._id };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role, username: user.username });
});
exports.default = router;
