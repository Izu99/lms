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
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const instituteRoutes_1 = __importDefault(require("./routes/instituteRoutes"));
const imageUploadRoutes_1 = __importDefault(require("./routes/imageUploadRoutes"));
const paperRoutes_1 = __importDefault(require("./routes/paperRoutes"));
const videoRoutes_1 = __importDefault(require("./routes/videoRoutes"));
const yearRoutes_1 = __importDefault(require("./routes/yearRoutes"));
const youtubeRoutes_1 = __importDefault(require("./routes/youtubeRoutes"));
const zoomRoutes_1 = __importDefault(require("./routes/zoomRoutes"));
// Import new modular routes
const auth_1 = require("./modules/shared/middleware/auth");
const routes_1 = __importDefault(require("./modules/student/routes"));
const routes_2 = __importDefault(require("./modules/teacher/routes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes")); // New import
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
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
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        console.log("Origin:", origin);
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
console.log('Allowed origins:', allowedOrigins);
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
app.get('/', (req, res) => {
    res.send('✅ ezyICT Backend is running on Azure');
});
// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).send('Something broke!');
});
mongoose_1.default
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
