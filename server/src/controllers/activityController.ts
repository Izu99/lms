import { Request, Response } from 'express';
import { Video } from '../models/Video';
import { Paper } from '../models/Paper';
import { User } from '../models/User';
import moment from 'moment';

export const getDailyActivity = async (req: Request, res: Response) => {
  try {
    const { period = 'week' } = req.query; // 'week' or 'month'

    let startDate: moment.Moment;
    let endDate: moment.Moment = moment().endOf('day');

    if (period === 'month') {
      startDate = moment().subtract(30, 'days').startOf('day');
    } else { // Default to week
      startDate = moment().subtract(6, 'days').startOf('day');
    }

    console.log(`Fetching activity for period: ${period}`);
    console.log(`Calculated Start Date: ${startDate.format()} (UTC: ${startDate.utc().format()})`);
    console.log(`Calculated End Date: ${endDate.format()} (UTC: ${endDate.utc().format()})`);

    const activityData: any[] = [];
    let currentDate = moment(startDate);

    while (currentDate.isSameOrBefore(endDate, 'day')) {
      const dayStart = currentDate.clone().startOf('day').toDate(); // Use clone to avoid modifying currentDate
      const dayEnd = currentDate.clone().endOf('day').toDate();     // Use clone to avoid modifying currentDate

      console.log(`  Querying for day: ${currentDate.format('YYYY-MM-DD')}`);
      console.log(`    Day Start: ${dayStart} (UTC: ${moment(dayStart).utc().format()})`);
      console.log(`    Day End: ${dayEnd} (UTC: ${moment(dayEnd).utc().format()})`);

      const videosCount = await Video.countDocuments({
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });
      const papersCount = await Paper.countDocuments({
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });
      const studentsCount = await User.countDocuments({
        role: 'student',
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });

      console.log(`    Counts - Videos: ${videosCount}, Papers: ${papersCount}, Students: ${studentsCount}`);

      activityData.push({
        date: currentDate.format('YYYY-MM-DD'),
        day: currentDate.format('ddd'), // e.g., Mon, Tue
        videos: videosCount,
        papers: papersCount,
        students: studentsCount,
      });

      currentDate.add(1, 'day');
    }

    res.json({ success: true, data: { activity: activityData } }); // Wrap activity in data
  } catch (error) {
    console.error('Error fetching daily activity:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
