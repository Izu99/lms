"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYearById = exports.deleteYear = exports.updateYear = exports.createYear = exports.getAllYears = void 0;
const Year_1 = require("../models/Year");
// Get all years
const getAllYears = async (req, res) => {
    try {
        const years = await Year_1.Year.find({ isActive: true }).sort({ year: 1 });
        res.json({ years });
    }
    catch (error) {
        console.error("Get years error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllYears = getAllYears;
// Create new year
const createYear = async (req, res) => {
    try {
        const { year, name } = req.body;
        if (!year || !name) {
            return res.status(400).json({ message: 'Year and name are required' });
        }
        // Check if year already exists
        const existingYear = await Year_1.Year.findOne({ year });
        if (existingYear) {
            return res.status(400).json({ message: 'Year already exists' });
        }
        const newYear = new Year_1.Year({ year, name });
        await newYear.save();
        res.status(201).json({ message: 'Year created successfully', year: newYear });
    }
    catch (error) {
        console.error("Create year error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createYear = createYear;
// Update year
const updateYear = async (req, res) => {
    try {
        const { year, name, isActive } = req.body;
        const updatedYear = await Year_1.Year.findByIdAndUpdate(req.params.id, { year, name, isActive }, { new: true, runValidators: true });
        if (!updatedYear) {
            return res.status(404).json({ message: 'Year not found' });
        }
        res.json({ message: 'Year updated successfully', year: updatedYear });
    }
    catch (error) {
        console.error("Update year error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateYear = updateYear;
// Delete year (soft delete)
const deleteYear = async (req, res) => {
    try {
        const deletedYear = await Year_1.Year.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!deletedYear) {
            return res.status(404).json({ message: 'Year not found' });
        }
        res.json({ message: 'Year deleted successfully' });
    }
    catch (error) {
        console.error("Delete year error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteYear = deleteYear;
// Get single year
const getYearById = async (req, res) => {
    try {
        const year = await Year_1.Year.findById(req.params.id);
        if (!year) {
            return res.status(404).json({ message: 'Year not found' });
        }
        res.json({ year });
    }
    catch (error) {
        console.error("Get year by ID error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getYearById = getYearById;
