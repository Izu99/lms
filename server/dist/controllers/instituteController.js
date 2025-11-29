"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstituteById = exports.deleteInstitute = exports.updateInstitute = exports.createInstitute = exports.getAllInstitutes = void 0;
const Institute_1 = require("../models/Institute");
// Get all institutes
const getAllInstitutes = async (req, res) => {
    try {
        const institutes = await Institute_1.Institute.find({ isActive: true }).sort({ location: 1, name: 1 });
        res.json({ institutes });
    }
    catch (error) {
        console.error("Get institutes error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllInstitutes = getAllInstitutes;
// Create new institute
const createInstitute = async (req, res) => {
    try {
        const { name, location } = req.body;
        if (!name || !location) {
            return res.status(400).json({ message: 'Name and location are required' });
        }
        // Check if institute already exists
        const existingInstitute = await Institute_1.Institute.findOne({ name, location });
        if (existingInstitute) {
            return res.status(400).json({ message: 'Institute with this name and location already exists' });
        }
        const newInstitute = new Institute_1.Institute({ name, location });
        await newInstitute.save();
        res.status(201).json({ message: 'Institute created successfully', institute: newInstitute });
    }
    catch (error) {
        console.error("Create institute error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createInstitute = createInstitute;
// Update institute
const updateInstitute = async (req, res) => {
    try {
        const { name, location, isActive } = req.body;
        const updatedInstitute = await Institute_1.Institute.findByIdAndUpdate(req.params.id, { name, location, isActive }, { new: true, runValidators: true });
        if (!updatedInstitute) {
            return res.status(404).json({ message: 'Institute not found' });
        }
        res.json({ message: 'Institute updated successfully', institute: updatedInstitute });
    }
    catch (error) {
        console.error("Update institute error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateInstitute = updateInstitute;
// Delete institute (soft delete)
const deleteInstitute = async (req, res) => {
    try {
        const deletedInstitute = await Institute_1.Institute.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!deletedInstitute) {
            return res.status(404).json({ message: 'Institute not found' });
        }
        res.json({ message: 'Institute deleted successfully' });
    }
    catch (error) {
        console.error("Delete institute error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteInstitute = deleteInstitute;
// Get single institute
const getInstituteById = async (req, res) => {
    try {
        const instituteItem = await Institute_1.Institute.findById(req.params.id);
        if (!instituteItem) {
            return res.status(404).json({ message: 'Institute not found' });
        }
        res.json({ institute: instituteItem });
    }
    catch (error) {
        console.error("Get institute by ID error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getInstituteById = getInstituteById;
