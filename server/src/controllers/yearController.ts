import { Request, Response } from 'express';
import { Year } from '../models/Year';

// Get all years
export const getAllYears = async (req: Request, res: Response) => {
  try {
    const years = await Year.find({ isActive: true }).sort({ year: 1 });
    res.json({ years });
  } catch (error) {
    console.error("Get years error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new year
export const createYear = async (req: Request, res: Response) => {
  try {
    const { year, name } = req.body;
    
    if (!year || !name) {
      return res.status(400).json({ message: 'Year and name are required' });
    }

    // Check if year already exists
    const existingYear = await Year.findOne({ year });
    if (existingYear) {
      return res.status(400).json({ message: 'Year already exists' });
    }

    const newYear = new Year({ year, name });
    await newYear.save();
    
    res.status(201).json({ message: 'Year created successfully', year: newYear });
  } catch (error: any) {
    console.error("Create year error:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update year
export const updateYear = async (req: Request, res: Response) => {
  try {
    const { year, name, isActive } = req.body;
    
    const updatedYear = await Year.findByIdAndUpdate(
      req.params.id,
      { year, name, isActive },
      { new: true, runValidators: true }
    );
    
    if (!updatedYear) {
      return res.status(404).json({ message: 'Year not found' });
    }
    
    res.json({ message: 'Year updated successfully', year: updatedYear });
  } catch (error) {
    console.error("Update year error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete year (soft delete)
export const deleteYear = async (req: Request, res: Response) => {
  try {
    const deletedYear = await Year.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!deletedYear) {
      return res.status(404).json({ message: 'Year not found' });
    }
    
    res.json({ message: 'Year deleted successfully' });
  } catch (error) {
    console.error("Delete year error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single year
export const getYearById = async (req: Request, res: Response) => {
  try {
    const year = await Year.findById(req.params.id);
    if (!year) {
      return res.status(404).json({ message: 'Year not found' });
    }
    res.json({ year });
  } catch (error) {
    console.error("Get year by ID error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
