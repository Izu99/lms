import { Request, Response } from 'express';
import { Institute } from '../models/Institute';

// Get all institutes
export const getAllInstitutes = async (req: Request, res: Response) => {
  try {
    const institutes = await Institute.find({ isActive: true }).sort({ location: 1, name: 1 });
    res.json({ institutes });
  } catch (error) {
    console.error("Get institutes error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new institute
export const createInstitute = async (req: Request, res: Response) => {
  try {
    const { name, location } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    // Check if institute already exists
    const existingInstitute = await Institute.findOne({ name, location });
    if (existingInstitute) {
      return res.status(400).json({ message: 'Institute with this name and location already exists' });
    }

    const newInstitute = new Institute({ name, location });
    await newInstitute.save();
    
    res.status(201).json({ message: 'Institute created successfully', institute: newInstitute });
  } catch (error) {
    console.error("Create institute error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update institute
export const updateInstitute = async (req: Request, res: Response) => {
  try {
    const { name, location, isActive } = req.body;
    
    const updatedInstitute = await Institute.findByIdAndUpdate(
      req.params.id,
      { name, location, isActive },
      { new: true, runValidators: true }
    );
    
    if (!updatedInstitute) {
      return res.status(404).json({ message: 'Institute not found' });
    }
    
    res.json({ message: 'Institute updated successfully', institute: updatedInstitute });
  } catch (error) {
    console.error("Update institute error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete institute (soft delete)
export const deleteInstitute = async (req: Request, res: Response) => {
  try {
    const deletedInstitute = await Institute.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!deletedInstitute) {
      return res.status(404).json({ message: 'Institute not found' });
    }
    
    res.json({ message: 'Institute deleted successfully' });
  } catch (error) {
    console.error("Delete institute error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single institute
export const getInstituteById = async (req: Request, res: Response) => {
  try {
    const instituteItem = await Institute.findById(req.params.id);
    if (!instituteItem) {
      return res.status(404).json({ message: 'Institute not found' });
    }
    res.json({ institute: instituteItem });
  } catch (error) {
    console.error("Get institute by ID error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};