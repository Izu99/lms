import { Request, Response } from 'express';
import { ZoomLink } from '../models/ZoomLink';

// Get all zoom links
export const getZoomLinks = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    let query: any = {};

    // Removed student-specific filtering as per user request.
    // All authenticated users will now see all Zoom links.

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
    const { meeting, institute: instituteId, year: yearId } = req.body; // Expect meeting object
    const { title, zoomLink } = meeting; // Extract from meeting

    if (!title || !zoomLink || !instituteId || !yearId) {
      return res.status(400).json({ message: 'Title, Zoom link, institute, and year are required' });
    }

    const userId = (req as any).user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication failed - no user ID' });
    }

    const newZoomLink = new ZoomLink({
      meeting: { // Pass meeting object directly
        title: meeting.title,
        description: meeting.description,
        zoomLink: meeting.zoomLink,
        youtubeLink: meeting.youtubeLink,
      },
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

// Update zoom link
export const updateZoomLink = async (req: Request, res: Response) => {
  try {
    const { meeting, institute, year } = req.body; // Expect meeting object
    const { id } = req.params;

    const zoomLink = await ZoomLink.findById(id);

    if (!zoomLink) {
      return res.status(404).json({ message: 'Zoom link not found' });
    }

    // Ensure the uploader is the same as the authenticated user, or an admin
    const userId = (req as any).user.id;
    if (zoomLink.uploadedBy.toString() !== userId && (req as any).user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this Zoom link' });
    }

    // Explicitly update properties if provided in the request body
    if (meeting) { // Check if meeting object is provided
      // Initialize zoomLink.meeting if it doesn't exist (for older documents)
      if (!zoomLink.meeting) {
        zoomLink.meeting = { title: '', zoomLink: '' }; // Initialize with required fields
      }

      if (meeting.title !== undefined) {
        zoomLink.meeting.title = meeting.title;
      }
      if (meeting.description !== undefined) {
        zoomLink.meeting.description = meeting.description;
      }
      if (meeting.zoomLink !== undefined) {
        zoomLink.meeting.zoomLink = meeting.zoomLink;
      }
      if (meeting.youtubeLink !== undefined) {
        zoomLink.meeting.youtubeLink = meeting.youtubeLink;
      }
    }

    if (institute !== undefined) {
      zoomLink.institute = institute;
    }
    if (year !== undefined) {
      zoomLink.year = year;
    }

    await zoomLink.save();
    await zoomLink.populate('uploadedBy', 'username role');
    await zoomLink.populate('institute', 'name location');
    await zoomLink.populate('year', 'year name');

    res.json({ message: 'Zoom link updated successfully', zoomLink });
  } catch (error) {
    console.error("Update zoom link error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
