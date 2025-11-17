# 🚀 Production Deployment Guide

## Pre-Deployment Checklist

### ✅ Security
- [ ] Change MongoDB credentials
- [ ] Generate strong JWT secret (min 64 characters)
- [ ] Set up environment variables in deployment platform
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS for production domains only
- [ ] Review and test all API endpoints
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

### ✅ Performance
- [ ] Run production build locally and test
- [ ] Optimize images and assets
- [ ] Enable compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Test load times

### ✅ Code Quality
- [ ] Fix all TypeScript errors
- [ ] Run linting
- [ ] Remove console.logs from production code
- [ ] Remove unused dependencies
- [ ] Update package versions

---

## 🔐 Environment Variables Setup

### Server (Backend)

#### Required Variables:
```bash
# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your-super-secret-jwt-key-minimum-64-characters-long

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
CLIENT_ORIGIN=https://yourdomain.com
PRODUCTION_CLIENT_URL=https://yourdomain.com
```

### Client (Frontend)

#### Required Variables:
```bash
# API URL
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Azure (Backend)

#### Frontend (Vercel):
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_BASE_URL`
4. Deploy

#### Backend (Azure App Service):
1. Create Azure App Service (Node.js)
2. Set environment variables in Configuration > Application Settings
3. Deploy using:
   ```bash
   cd server
   npm run build
   az webapp up --name your-app-name --resource-group your-rg
   ```

### Option 2: Vercel (Full Stack)

1. Update `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "server/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "client/$1"
    }
  ]
}
```

2. Set environment variables in Vercel dashboard
3. Deploy

### Option 3: Azure (Full Stack)

1. Create Azure App Service
2. Set up deployment from GitHub
3. Configure environment variables
4. Deploy

---

## 🔧 Post-Deployment Steps

### 1. Test All Features
- [ ] User registration
- [ ] User login
- [ ] File uploads
- [ ] Video playback
- [ ] Paper submissions
- [ ] All CRUD operations

### 2. Monitor Performance
- [ ] Set up application monitoring (Azure Application Insights / Vercel Analytics)
- [ ] Monitor error rates
- [ ] Check response times
- [ ] Monitor database performance

### 3. Security Audit
- [ ] Run security scan (npm audit)
- [ ] Test authentication flows
- [ ] Verify CORS configuration
- [ ] Test rate limiting
- [ ] Check for exposed secrets

### 4. Backup Strategy
- [ ] Set up MongoDB automated backups
- [ ] Document recovery procedures
- [ ] Test backup restoration

---

## 🐛 Troubleshooting

### Common Issues:

#### 1. CORS Errors
- Verify `CLIENT_ORIGIN` is set correctly
- Check allowed origins in server configuration
- Ensure credentials are enabled

#### 2. Authentication Failures
- Verify JWT_SECRET is set
- Check token expiration settings
- Verify HTTPS is enabled

#### 3. Database Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Verify network connectivity

#### 4. File Upload Issues
- Check file size limits
- Verify upload directory permissions
- Check storage configuration

---

## 📊 Monitoring & Logging

### Recommended Tools:
- **Application Monitoring**: Azure Application Insights / Vercel Analytics
- **Error Tracking**: Sentry
- **Logging**: Winston / Pino
- **Uptime Monitoring**: UptimeRobot / Pingdom

### Key Metrics to Monitor:
- Response times
- Error rates
- Database query performance
- Memory usage
- CPU usage
- Active users
- API request rates

---

## 🔄 Continuous Deployment

### GitHub Actions Example:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd client && npm ci
        cd ../server && npm ci
    
    - name: Run tests
      run: |
        cd client && npm test
        cd ../server && npm test
    
    - name: Build
      run: |
        cd client && npm run build
        cd ../server && npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📝 Maintenance

### Regular Tasks:
- [ ] Update dependencies monthly
- [ ] Review security advisories
- [ ] Monitor error logs
- [ ] Check database performance
- [ ] Review and rotate secrets
- [ ] Backup verification
- [ ] Performance optimization

---

## 🆘 Support

For issues or questions:
1. Check logs in deployment platform
2. Review error tracking dashboard
3. Check database connection
4. Verify environment variables
5. Contact development team

---

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
