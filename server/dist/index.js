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
const classRoutes_1 = __importDefault(require("./routes/classRoutes"));
const imageUploadRoutes_1 = __importDefault(require("./routes/imageUploadRoutes"));
const paperRoutes_1 = __importDefault(require("./routes/paperRoutes"));
const videoRoutes_1 = __importDefault(require("./routes/videoRoutes"));
const yearRoutes_1 = __importDefault(require("./routes/yearRoutes"));
const youtubeRoutes_1 = __importDefault(require("./routes/youtubeRoutes"));
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
    'https://lms-frontend-app.azurewebsites.net'
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
console.log('Allowed origins:', allowedOrigins);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
// Use routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/classes', classRoutes_1.default);
app.use('/api/images', imageUploadRoutes_1.default);
app.use('/api/papers', paperRoutes_1.default);
app.use('/api/videos', videoRoutes_1.default);
app.use('/api/years', yearRoutes_1.default);
app.use('/api/youtube', youtubeRoutes_1.default);
app.get('/', (req, res) => {
    res.send('✅ Backend is running on Azure');
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
