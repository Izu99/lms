import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGO_URI = process.env.MONGO_URI as string;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate required environment variables
if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in environment variables');
  process.exit(1);
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET must be at least 32 characters long');
  process.exit(1);
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

// Import new modular routes
import { protect } from './modules/shared/middleware/auth';
import studentRoutes from './modules/student/routes';
import teacherRoutes from './modules/teacher/routes';
import activityRoutes from './routes/activityRoutes';

// Import security middleware
import { 
  authLimiter, 
  apiLimiter, 
  sanitizeInput, 
  securityHeaders,
  errorHandler 
} from './middleware/security';

const app = express();

// ✅ Security: Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ✅ Security: MongoDB query sanitization
app.use(mongoSanitize());

// ✅ Security: Custom security headers
app.use(securityHeaders);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ✅ Security: Input sanitization
app.use(sanitizeInput);

// Request logging (only in development)
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);
    next();
  });
}

// ✅ CORS setup - Secure configuration
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  process.env.PRODUCTION_CLIENT_URL,
  process.env.VERCEL_CLIENT_URL,
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

// Static files
app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ✅ Rate limiting for auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ✅ General API rate limiting
app.use('/api/', apiLimiter);

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/institutes', protect, instituteRoutes);
app.use('/api/images', protect, imageUploadRoutes);
app.use('/api/papers', protect, paperRoutes);
app.use('/api/videos', protect, videoRoutes);
app.use('/api/years', protect, yearRoutes);
app.use('/api/youtube', protect, youtubeRoutes);
app.use('/api/zoom', protect, zoomRoutes);

// Add new modular routes
app.use('/api/student', protect, studentRoutes);
app.use('/api/teacher', protect, teacherRoutes);
app.use('/api/activity', protect, activityRoutes);

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

// ✅ Global error handler (must be last)
app.use(errorHandler);

// MongoDB connection with retry logic
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

// Graceful shutdown
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
