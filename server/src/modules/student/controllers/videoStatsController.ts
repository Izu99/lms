import { Request, Response } from 'express';
import { Video } from '../../../models/Video';
import { VideoWatch } from '../../../models/VideoWatch';

export const getVideoStats = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const studentId = user.id;

    const videoFilter: any = {};
    if (user.role === 'student' && user.academicLevel) {
      videoFilter.academicLevel = user.academicLevel;
    }

    const totalVideos = await Video.countDocuments(videoFilter);
    const watchedVideos = await VideoWatch.find({ student: studentId });

    const totalWatchedCount = new Set(watchedVideos.map(w => w.video.toString())).size;
    const totalWatchTime = watchedVideos.reduce((acc, w) => acc + w.watchDuration, 0);

    res.json({
      totalVideos,
      totalWatchedCount,
      totalWatchTime,
    });
  } catch (error) {
    console.error("Get video stats error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
