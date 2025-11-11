# Production Deployment Checklist

## ✅ Files Fixed/Created

### Core Files
- [x] `server.js` - Production-ready Express server with health check
- [x] `package.json` - Correct start script and type: module
- [x] `next.config.ts` - Removed duplicate export, added Azure image domains
- [x] `.env.production` - Production environment variables template

### Deployment Files
- [x] `.deployment` - Azure deployment configuration
- [x] `deploy.sh` - Build script for Azure
- [x] `startup.sh` - Startup script for Azure
- [x] `web.config` - IIS configuration for Azure App Service

### Documentation
- [x] `AZURE_DEPLOYMENT.md` - Complete deployment guide
- [x] `DEPLOYMENT_CHECKLIST.md` - This file

## 🔧 Configuration Steps

### 1. Update Environment Variables
Edit `.env.production` with your actual backend URL:
```env
NEXT_PUBLIC_API_URL=https://your-backend.azurewebsites.net/api
NEXT_PUBLIC_API_BASE_URL=https://your-backend.azurewebsites.net
```

### 2. Azure App Service Settings
In Azure Portal → Configuration → Application settings:
```
NODE_ENV=production
PORT=8080
NEXT_PUBLIC_API_URL=https://your-backend.azurewebsites.net/api
NEXT_PUBLIC_API_BASE_URL=https://your-backend.azurewebsites.net
```

### 3. Azure App Service General Settings
- Stack: Node
- Major version: 20 LTS
- Startup Command: `npm start`

## 🚀 Deployment Commands

### Local Testing
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm start

# Should see: "Ready on http://0.0.0.0:3000"
```

### Deploy to Azure
```bash
# Option 1: Azure CLI
az webapp up --name your-app-name --resource-group your-rg --runtime "NODE:20-lts"

# Option 2: Git
git push azure main

# Option 3: GitHub Actions (recommended for CI/CD)
# See AZURE_DEPLOYMENT.md for GitHub Actions setup
```

## ✅ Verification Steps

1. **Health Check**
   ```bash
   curl https://your-app.azurewebsites.net/health
   # Should return: {"status":"healthy"}
   ```

2. **Main Application**
   - Visit: `https://your-app.azurewebsites.net`
   - Should load the homepage

3. **Check Logs**
   ```bash
   az webapp log tail --name your-app-name --resource-group your-rg
   ```

## 🐛 Common Issues & Solutions

### Issue: "Missing parameter name" error
**Solution**: Fixed in `server.js` - using `server.all('*', ...)` instead of wildcards

### Issue: Port binding error
**Solution**: Server now reads `process.env.PORT` and defaults to 3000

### Issue: Module type warning
**Solution**: Added `"type": "module"` to `package.json`

### Issue: Duplicate export in next.config.ts
**Solution**: Removed duplicate `export default nextConfig`

### Issue: Build fails on Azure
**Solution**: Check Node.js version is 20.x and all deps are installed

## 📊 Performance Checklist

- [ ] Enable Application Insights
- [ ] Configure CDN for static assets
- [ ] Enable response compression
- [ ] Set up auto-scaling rules
- [ ] Configure health check endpoint
- [ ] Set up monitoring alerts

## 🔒 Security Checklist

- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Use Azure Key Vault for secrets
- [ ] Enable Azure AD authentication
- [ ] Set up Web Application Firewall
- [ ] Configure rate limiting

## 📝 Post-Deployment

1. Monitor application logs for errors
2. Check Application Insights metrics
3. Test all major user flows
4. Verify API connections work
5. Test image uploads
6. Verify authentication works
7. Check dark mode toggle
8. Test responsive design

## 🎯 Success Criteria

- ✅ Application starts without errors
- ✅ Health endpoint returns 200
- ✅ All pages load correctly
- ✅ API calls work (after backend is deployed)
- ✅ No console errors
- ✅ Images load properly
- ✅ Dark mode works
- ✅ Responsive on mobile

## 📞 Support

If issues persist:
1. Check Azure Portal logs
2. Review Application Insights
3. Verify environment variables
4. Check Node.js version
5. Ensure all files are deployed
