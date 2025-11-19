import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGO_URI = process.env.MONGO_URI as string;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ✅ SECURITY: Validate required environment variables
if (!MONGO_URI) {
  console.error('❌ FATAL: MONGO_URI is not defined in environment variables');
  process.exit(1);
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'CHANGE_THIS_IN_PRODUCTION_USE_64_CHAR_SECRET') {
  console.error('❌ FATAL: JWT_SECRET must be changed in production');
  if (NODE_ENV === 'production') {
    process.exit(1);
  }
}

// Import routes
import authRoutes from './routes/authRoutes';
import instituteRoutes from './routes/instituteRoutes';
import imageUploadRoutes from './routes/imageUploadRoutes';
import paperRoutes from './routes/paperRoutes';
import videoRoutes from './routes/videoRoutes';
import yearRoutes from './routes/yearRoutes';
import youtubeRoutes from './routes/youtubeRoutes';
import zoomRoutes from './routes/zoomRoutes';
import coursePackageRoutes from './routes/coursePackageRoutes'; // Import new course package routes

// Import new modular routes
import { protect } from './modules/shared/middleware/auth';
import studentRoutes from './modules/student/routes';
import teacherRoutes from './modules/teacher/routes';
import activityRoutes from './routes/activityRoutes';

const app = express();

// ✅ SECURITY: Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ✅ SECURITY: Limit request body size
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ✅ SECURITY: Request logging (only in development)
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);
    next();
  });
}

// ✅ SECURITY: Improved CORS setup
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  process.env.PRODUCTION_CLIENT_URL,
  process.env.VERCEL_CLIENT_URL,
  'https://www.ezyict.lk', // Added to resolve CORS blocked origin issue
  ...(NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

console.log('✅ Allowed origins:', allowedOrigins);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/images', imageUploadRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/years', yearRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/zoom', zoomRoutes);

// Add new modular routes
app.use('/api/student', protect, studentRoutes);
app.use('/api/teacher', protect, teacherRoutes);
app.use('/api/activity', activityRoutes); // New route
app.use('/api/course-packages', coursePackageRoutes); // New course package routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV 
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: '✅ ezyICT LMS API is running',
    version: '1.0.0',
    environment: NODE_ENV
  });
});

// ✅ SECURITY: Improved error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Global error handler:', err);
  
  // Don't expose error details in production
  const isDevelopment = NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    message: isDevelopment ? err.message : 'An error occurred',
    ...(isDevelopment && { stack: err.stack })
  });
});

// ✅ PERFORMANCE: MongoDB connection with retry logic
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('❌ Failed to connect to MongoDB after multiple attempts');
      process.exit(1);
    }
  }
};

// ✅ SECURITY: Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Environment: ${NODE_ENV}`);
    console.log(`✅ CORS enabled for: ${allowedOrigins.join(', ')}`);
  });
});
