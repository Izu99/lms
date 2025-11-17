"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGO_URI = process.env.MONGO_URI;
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
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const instituteRoutes_1 = __importDefault(require("./routes/instituteRoutes"));
const imageUploadRoutes_1 = __importDefault(require("./routes/imageUploadRoutes"));
const paperRoutes_1 = __importDefault(require("./routes/paperRoutes"));
const videoRoutes_1 = __importDefault(require("./routes/videoRoutes"));
const yearRoutes_1 = __importDefault(require("./routes/yearRoutes"));
const youtubeRoutes_1 = __importDefault(require("./routes/youtubeRoutes"));
const zoomRoutes_1 = __importDefault(require("./routes/zoomRoutes"));
const coursePackageRoutes_1 = __importDefault(require("./routes/coursePackageRoutes")); // Import new course package routes
// Import new modular routes
const auth_1 = require("./modules/shared/middleware/auth");
const routes_1 = __importDefault(require("./modules/student/routes"));
const routes_2 = __importDefault(require("./modules/teacher/routes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
const app = (0, express_1.default)();
// ✅ SECURITY: Add security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});
// ✅ SECURITY: Limit request body size
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
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
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.warn(`❌ CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
console.log('✅ Allowed origins:', allowedOrigins);
app.use('/api/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
// Use routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/institutes', instituteRoutes_1.default);
app.use('/api/images', imageUploadRoutes_1.default);
app.use('/api/papers', paperRoutes_1.default);
app.use('/api/videos', videoRoutes_1.default);
app.use('/api/years', yearRoutes_1.default);
app.use('/api/youtube', youtubeRoutes_1.default);
app.use('/api/zoom', zoomRoutes_1.default);
// Add new modular routes
app.use('/api/student', auth_1.protect, routes_1.default);
app.use('/api/teacher', auth_1.protect, routes_2.default);
app.use('/api/activity', activityRoutes_1.default); // New route
app.use('/api/course-packages', coursePackageRoutes_1.default); // New course package routes
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
app.use((err, req, res, next) => {
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
        await mongoose_1.default.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB connected successfully');
    }
    catch (err) {
        console.error('❌ MongoDB connection error:', err);
        if (retries > 0) {
            console.log(`Retrying connection... (${retries} attempts left)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        }
        else {
            console.error('❌ Failed to connect to MongoDB after multiple attempts');
            process.exit(1);
        }
    }
};
// ✅ SECURITY: Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing server gracefully...');
    await mongoose_1.default.connection.close();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, closing server gracefully...');
    await mongoose_1.default.connection.close();
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
