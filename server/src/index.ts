import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGO_URI = process.env.MONGO_URI as string;

// Import routes
import authRoutes from './routes/authRoutes';
import instituteRoutes from './routes/instituteRoutes';
import imageUploadRoutes from './routes/imageUploadRoutes';
import paperRoutes from './routes/paperRoutes';
import videoRoutes from './routes/videoRoutes';
import yearRoutes from './routes/yearRoutes';
import youtubeRoutes from './routes/youtubeRoutes';

// Import new modular routes
import { protect } from './modules/shared/middleware/auth';
import studentRoutes from './modules/student/routes';
import teacherRoutes from './modules/teacher/routes';
import activityRoutes from './routes/activityRoutes'; // New import

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log('Request received:', req.method, req.url);
  next();
});

// ✅ CORS setup for both local and Azure frontend
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:3000',
  'https://lms-git-add-dark-theme-izu99s-projects.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    console.log("Origin:", origin);
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

console.log('Allowed origins:', allowedOrigins);

app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/images', imageUploadRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/years', yearRoutes);
app.use('/api/youtube', youtubeRoutes);

// Add new modular routes
app.use('/api/student', protect, studentRoutes);
app.use('/api/teacher', protect, teacherRoutes);
app.use('/api/activity', activityRoutes); // New route

app.get('/', (req, res) => {
  res.send('✅ ezyICT Backend is running on Azure');
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Global error handler:', err);
  res.status(500).send('Something broke!');
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
