import { Request, Response } from 'express';
import { ZoomLink } from '../models/ZoomLink';

// Get all zoom links
export const getZoomLinks = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    let query: any = {};

    if (user.role === 'student') {
      query = {
        institute: user.institute,
        year: user.year,
      };
    }

    const zoomLinks = await ZoomLink.find(query)
      .populate('uploadedBy', 'username role')
      .populate('institute', 'name location')
      .populate('year', 'year name')
      .sort({ createdAt: -1 });
    res.json({ zoomLinks });
  } catch (error) {
    console.error("Get all zoom links error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new zoom link
export const createZoomLink = async (req: Request, res: Response) => {
  try {
    const { title, description, link, institute: instituteId, year: yearId } = req.body;
    
    if (!title || !link || !instituteId || !yearId) {
      return res.status(400).json({ message: 'Title, link, institute, and year are required' });
    }

    const userId = (req as any).user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication failed - no user ID' });
    }

    const newZoomLink = new ZoomLink({
      title,
      description,
      link,
      uploadedBy: userId,
      institute: instituteId,
      year: yearId,
    });

    await newZoomLink.save();
    await newZoomLink.populate('uploadedBy', 'username role');
    await newZoomLink.populate('institute', 'name location');
    await newZoomLink.populate('year', 'year name');
    
    res.status(201).json({ message: 'Zoom link created successfully', zoomLink: newZoomLink });
  } catch (error) {
    console.error("Create zoom link error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete zoom link
export const deleteZoomLink = async (req: Request, res: Response) => {
  try {
    const zoomLink = await ZoomLink.findById(req.params.id);
    if (!zoomLink) {
      return res.status(404).json({ message: 'Zoom link not found' });
    }

    await zoomLink.deleteOne();
    res.json({ message: 'Zoom link deleted successfully' });
  } catch (error) {
    console.error("Delete zoom link error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
