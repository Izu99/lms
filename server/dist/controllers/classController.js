"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassById = exports.deleteClass = exports.updateClass = exports.createClass = exports.getAllClasses = void 0;
const Class_1 = require("../models/Class");
// Get all classes
const getAllClasses = async (req, res) => {
    try {
        const classes = await Class_1.Class.find({ isActive: true }).sort({ location: 1, name: 1 });
        res.json({ classes });
    }
    catch (error) {
        console.error("Get classes error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllClasses = getAllClasses;
// Create new class
const createClass = async (req, res) => {
    try {
        const { name, location } = req.body;
        if (!name || !location) {
            return res.status(400).json({ message: 'Name and location are required' });
        }
        // Check if class already exists
        const existingClass = await Class_1.Class.findOne({ name, location });
        if (existingClass) {
            return res.status(400).json({ message: 'Class with this name and location already exists' });
        }
        const newClass = new Class_1.Class({ name, location });
        await newClass.save();
        res.status(201).json({ message: 'Class created successfully', class: newClass });
    }
    catch (error) {
        console.error("Create class error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createClass = createClass;
// Update class
const updateClass = async (req, res) => {
    try {
        const { name, location, isActive } = req.body;
        const updatedClass = await Class_1.Class.findByIdAndUpdate(req.params.id, { name, location, isActive }, { new: true, runValidators: true });
        if (!updatedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.json({ message: 'Class updated successfully', class: updatedClass });
    }
    catch (error) {
        console.error("Update class error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateClass = updateClass;
// Delete class (soft delete)
const deleteClass = async (req, res) => {
    try {
        const deletedClass = await Class_1.Class.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!deletedClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.json({ message: 'Class deleted successfully' });
    }
    catch (error) {
        console.error("Delete class error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteClass = deleteClass;
// Get single class
const getClassById = async (req, res) => {
    try {
        const classItem = await Class_1.Class.findById(req.params.id);
        if (!classItem) {
            return res.status(404).json({ message: 'Class not found' });
        }
        res.json({ class: classItem });
    }
    catch (error) {
        console.error("Get class by ID error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getClassById = getClassById;
