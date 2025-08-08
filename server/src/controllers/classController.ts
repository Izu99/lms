import { Request, Response } from 'express';
import { Class } from '../models/Class';

// Get all classes
export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const classes = await Class.find({ isActive: true }).sort({ location: 1, name: 1 });
    res.json({ classes });
  } catch (error) {
    console.error("Get classes error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new class
export const createClass = async (req: Request, res: Response) => {
  try {
    const { name, location } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    // Check if class already exists
    const existingClass = await Class.findOne({ name, location });
    if (existingClass) {
      return res.status(400).json({ message: 'Class with this name and location already exists' });
    }

    const newClass = new Class({ name, location });
    await newClass.save();
    
    res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (error) {
    console.error("Create class error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update class
export const updateClass = async (req: Request, res: Response) => {
  try {
    const { name, location, isActive } = req.body;
    
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { name, location, isActive },
      { new: true, runValidators: true }
    );
    
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    res.json({ message: 'Class updated successfully', class: updatedClass });
  } catch (error) {
    console.error("Update class error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete class (soft delete)
export const deleteClass = async (req: Request, res: Response) => {
  try {
    const deletedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error("Delete class error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single class
export const getClassById = async (req: Request, res: Response) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ class: classItem });
  } catch (error) {
    console.error("Get class by ID error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};