"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyActivity = void 0;
const Video_1 = require("../models/Video");
const Paper_1 = require("../models/Paper");
const User_1 = require("../models/User");
const moment_1 = __importDefault(require("moment"));
const getDailyActivity = async (req, res) => {
    try {
        const { period = 'week' } = req.query; // 'week' or 'month'
        let startDate;
        let endDate = (0, moment_1.default)().endOf('day');
        if (period === 'month') {
            startDate = (0, moment_1.default)().subtract(30, 'days').startOf('day');
        }
        else { // Default to week
            startDate = (0, moment_1.default)().subtract(6, 'days').startOf('day');
        }
        console.log(`Fetching activity for period: ${period}`);
        console.log(`Calculated Start Date: ${startDate.format()} (UTC: ${startDate.utc().format()})`);
        console.log(`Calculated End Date: ${endDate.format()} (UTC: ${endDate.utc().format()})`);
        const activityData = [];
        let currentDate = (0, moment_1.default)(startDate);
        while (currentDate.isSameOrBefore(endDate, 'day')) {
            const dayStart = currentDate.clone().startOf('day').toDate(); // Use clone to avoid modifying currentDate
            const dayEnd = currentDate.clone().endOf('day').toDate(); // Use clone to avoid modifying currentDate
            console.log(`  Querying for day: ${currentDate.format('YYYY-MM-DD')}`);
            console.log(`    Day Start: ${dayStart} (UTC: ${(0, moment_1.default)(dayStart).utc().format()})`);
            console.log(`    Day End: ${dayEnd} (UTC: ${(0, moment_1.default)(dayEnd).utc().format()})`);
            const videosCount = await Video_1.Video.countDocuments({
                createdAt: { $gte: dayStart, $lte: dayEnd },
            });
            const papersCount = await Paper_1.Paper.countDocuments({
                createdAt: { $gte: dayStart, $lte: dayEnd },
            });
            const studentsCount = await User_1.User.countDocuments({
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
    }
    catch (error) {
        console.error('Error fetching daily activity:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getDailyActivity = getDailyActivity;
