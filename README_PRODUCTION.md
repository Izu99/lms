# 🎓 ezyICT LMS - Production Ready

A modern, secure Learning Management System built with Next.js, Express, and MongoDB.

## 🌟 Features

- ✅ **Student Portal**: Video lessons, papers, zoom links, progress tracking
- ✅ **Teacher Portal**: Content management, student management, analytics
- ✅ **Authentication**: Secure JWT-based auth with role-based access
- ✅ **File Management**: Video uploads, paper uploads, ID card verification
- ✅ **Dark Theme**: Beautiful dark/light mode with smooth transitions
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Real-time Updates**: Live progress tracking and notifications
- ✅ **Security**: Rate limiting, input validation, CORS, security headers

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Lucide Icons
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
lms/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities and configs
│   │   └── modules/       # Feature modules
│   ├── public/            # Static assets
│   └── next.config.ts     # Next.js configuration
│
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── modules/       # Feature modules
│   ├── uploads/           # Uploaded files
│   └── .env               # Environment variables
│
└── docs/                  # Documentation
    ├── PRODUCTION_READY_SUMMARY.md
    ├── DEPLOYMENT_GUIDE.md
    ├── SECURITY_CHECKLIST.md
    └── QUICK_START_PRODUCTION.md
```

## 🚀 Quick Start

### Development

```bash
# 1. Clone repository
git clone <your-repo-url>
cd lms

# 2. Install dependencies
cd server && npm install
cd ../client && npm install

# 3. Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env.local
# Edit .env files with your values

# 4. Start development servers
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev

# 5. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Production

See [QUICK_START_PRODUCTION.md](QUICK_START_PRODUCTION.md) for 5-minute deployment guide.

## 📚 Documentation

- **[QUICK_START_PRODUCTION.md](QUICK_START_PRODUCTION.md)** - 5-minute deployment guide
- **[PRODUCTION_READY_SUMMARY.md](PRODUCTION_READY_SUMMARY.md)** - Complete overview of fixes
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Detailed deployment instructions
- **[SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)** - Security verification checklist
- **[PRODUCTION_SECURITY_FIXES.md](PRODUCTION_SECURITY_FIXES.md)** - Security audit report

## 🔒 Security Features

- ✅ JWT authentication with secure token storage
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ CORS protection with whitelist
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Input validation and sanitization
- ✅ File upload validation (type, size)
- ✅ Rate limiting ready
- ✅ MongoDB injection prevention
- ✅ XSS protection
- ✅ HTTPS enforcement

## ⚡ Performance Optimizations

- ✅ Database indexes for fast queries
- ✅ Connection pooling
- ✅ Image optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Compression enabled
- ✅ CDN-ready static assets
- ✅ Efficient caching strategies

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Azure (Backend)
- **Frontend**: Deploy to Vercel (automatic from GitHub)
- **Backend**: Deploy to Azure App Service
- **Best for**: Separate scaling, enterprise requirements

### Option 2: Full Stack on Vercel
- **Both**: Deploy everything to Vercel
- **Best for**: Quick deployment, cost-effective

### Option 3: Azure (Full Stack)
- **Both**: Deploy to Azure App Service
- **Best for**: Enterprise, Azure ecosystem

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔧 Environment Variables

### Backend (server/.env)
```bash
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/lms_production
JWT_SECRET=<64_character_secret>
NODE_ENV=production
CLIENT_ORIGIN=https://your-frontend.com
```

### Frontend (client/.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
```

## 🧪 Testing

```bash
# Run tests
cd client && npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 📊 Monitoring

### Recommended Tools
- **Application Monitoring**: Azure Application Insights / Vercel Analytics
- **Error Tracking**: Sentry
- **Uptime Monitoring**: UptimeRobot
- **Performance**: Lighthouse, WebPageTest

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Verify `CLIENT_ORIGIN` matches your frontend URL exactly
- Check browser console for specific error
- Ensure credentials are enabled

**Authentication Failures**
- Verify JWT_SECRET is set and matches
- Check token expiration (default: 1 day)
- Ensure HTTPS is enabled in production

**Database Connection Issues**
- Verify MONGO_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for more troubleshooting tips.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos` - Upload video (teacher only)
- `POST /api/videos/:id/view` - Increment view count

### Papers
- `GET /api/papers` - Get all papers
- `GET /api/papers/:id` - Get paper by ID
- `POST /api/papers` - Create paper (teacher only)
- `POST /api/papers/:id/submit` - Submit paper (student)

### Students (Teacher only)
- `GET /api/teacher/students` - Get all students
- `GET /api/teacher/students/:id` - Get student details
- `PATCH /api/teacher/students/:id` - Update student status

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Team

- **Developer**: [Your Name]
- **Client**: [Client Name]
- **Support**: [Support Email]

## 🆘 Support

For issues or questions:
1. Check documentation in `/docs` folder
2. Review error logs in deployment platform
3. Contact development team

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- MongoDB team for the database
- Vercel for hosting platform
- All open-source contributors

---

## 🚀 Ready to Deploy?

1. Read [QUICK_START_PRODUCTION.md](QUICK_START_PRODUCTION.md)
2. Complete [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)
3. Run deployment script: `./deploy.sh` or `.\deploy.ps1`
4. Go live! 🎊

---

**Built with ❤️ for education**

**Version**: 1.0.0  
**Last Updated**: November 2024  
**Status**: Production Ready ✅
