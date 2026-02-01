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
const helmet_1 = __importDefault(require("helmet"));
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';
// Validate required environment variables
if (!MONGO_URI) {
    logger_1.default.error('❌ MONGO_URI is not defined in environment variables');
    process.exit(1);
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    logger_1.default.error('❌ JWT_SECRET must be at least 32 characters long');
    process.exit(1);
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
const coursePackageRoutes_1 = __importDefault(require("./routes/coursePackageRoutes"));
const tuteRoutes_1 = __importDefault(require("./routes/tuteRoutes"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
// Import new modular routes
const auth_1 = require("./modules/shared/middleware/auth");
const routes_1 = __importDefault(require("./modules/student/routes"));
const routes_2 = __importDefault(require("./modules/teacher/routes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
// Import security middleware
const security_1 = require("./middleware/security");
const app = (0, express_1.default)();
// ✅ SECURITY: Trust proxy (required for rate limiting on Azure/Vercel)
app.set('trust proxy', 1);
// ✅ SECURITY: Modern CORS setup (100% Environment Driven)
const getOrigins = () => {
    const rawOrigins = [
        process.env.CLIENT_ORIGIN,
        process.env.PRODUCTION_CLIENT_URL,
        process.env.VERCEL_CLIENT_URL,
        'https://lms-server.scm.azurewebsites.net', // Azure management console
    ];
    // Support for a comma-separated list in ALLOWED_ORIGINS env var
    if (process.env.ALLOWED_ORIGINS) {
        rawOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
    }
    // Add local development origins
    if (NODE_ENV === 'development') {
        rawOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000');
    }
    // Clean origins: remove whitespace and trailing slashes
    const cleanedOrigins = rawOrigins
        .filter(Boolean)
        .map(origin => origin.trim().replace(/\/$/, ''));
    return [...new Set(cleanedOrigins)];
};
const allowedOrigins = getOrigins();
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            logger_1.default.warn(`❌ CORS blocked origin: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 204
}));
// ✅ Security: Helmet for security headers
app.use((0, helmet_1.default)({
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
// ✅ Security: Custom security headers
app.use(security_1.securityHeaders);
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// ✅ Security: Input sanitization
app.use(security_1.sanitizeInput);
// Request logging (only in development)
if (NODE_ENV === 'development') {
    app.use((req, res, next) => {
        logger_1.default.http(`Request received: ${req.method} ${req.url}`);
        next();
    });
}
logger_1.default.info(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
// Static files
app.use('/api/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
// ✅ Rate limiting for auth routes
app.use('/api/auth/login', security_1.authLimiter);
app.use('/api/auth/register', security_1.authLimiter);
// ✅ General API rate limiting
app.use('/api/', security_1.apiLimiter);
// Use routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/institutes', auth_1.protect, instituteRoutes_1.default);
app.use('/api/images', auth_1.protect, imageUploadRoutes_1.default);
app.use('/api/papers', auth_1.protect, paperRoutes_1.default);
app.use('/api/videos', auth_1.protect, videoRoutes_1.default);
app.use('/api/tutes', auth_1.protect, tuteRoutes_1.default);
app.use('/api/years', auth_1.protect, yearRoutes_1.default);
app.use('/api/youtube', auth_1.protect, youtubeRoutes_1.default);
app.use('/api/zoom', auth_1.protect, zoomRoutes_1.default);
// Add new modular routes
app.use('/api/student', auth_1.protect, routes_1.default);
app.use('/api/teacher', auth_1.protect, routes_2.default);
app.use('/api/activity', auth_1.protect, activityRoutes_1.default);
app.use('/api/course-packages', auth_1.protect, coursePackageRoutes_1.default);
app.use('/api/employees', auth_1.protect, employeeRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
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
app.use(security_1.errorHandler);
// MongoDB connection with retry logic
const connectDB = async (retries = 5) => {
    try {
        await mongoose_1.default.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        logger_1.default.info('✅ MongoDB connected successfully');
    }
    catch (err) {
        logger_1.default.error(`❌ MongoDB connection error: ${err}`);
        if (retries > 0) {
            logger_1.default.info(`Retrying connection... (${retries} attempts left)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        }
        else {
            logger_1.default.error('❌ Failed to connect to MongoDB after multiple attempts');
            process.exit(1);
        }
    }
};
// Graceful shutdown
process.on('SIGTERM', async () => {
    logger_1.default.info('SIGTERM received, closing server gracefully...');
    await mongoose_1.default.connection.close();
    process.exit(0);
});
process.on('SIGINT', async () => {
    logger_1.default.info('SIGINT received, closing server gracefully...');
    await mongoose_1.default.connection.close();
    process.exit(0);
});
// Start server
connectDB().then(() => {
    app.listen(PORT, () => {
        logger_1.default.info(`✅ Server running on port ${PORT}`);
        logger_1.default.info(`✅ Environment: ${NODE_ENV}`);
    });
});
