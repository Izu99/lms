import { Request, Response } from 'express';
import { Video } from '../../../models/Video';
import { VideoWatch } from '../../../models/VideoWatch';

export const getVideoStats = async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user.id;

    const totalVideos = await Video.countDocuments();
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
