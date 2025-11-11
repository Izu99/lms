# Azure Deployment Guide

## Prerequisites
- Azure account
- Azure CLI installed
- Node.js 20.x

## Deployment Steps

### 1. Build Locally (Optional - for testing)
```bash
npm install
npm run build
npm start
```

### 2. Azure App Service Configuration

#### In Azure Portal:
1. Go to your App Service
2. **Configuration** → **General settings**:
   - **Stack**: Node
   - **Major version**: 20 LTS
   - **Minor version**: 20.19
   - **Startup Command**: `npm start`

3. **Configuration** → **Application settings**:
   Add these environment variables:
   ```
   NODE_ENV=production
   PORT=8080
   NEXT_PUBLIC_API_URL=https://your-backend.azurewebsites.net/api
   NEXT_PUBLIC_API_BASE_URL=https://your-backend.azurewebsites.net
   ```

### 3. Deploy to Azure

#### Option A: Using Azure CLI
```bash
# Login to Azure
az login

# Deploy
az webapp up --name your-app-name --resource-group your-resource-group --runtime "NODE:20-lts"
```

#### Option B: Using Git Deployment
```bash
# Add Azure remote
git remote add azure https://your-app-name.scm.azurewebsites.net:443/your-app-name.git

# Push to Azure
git push azure main
```

#### Option C: Using VS Code Azure Extension
1. Install Azure App Service extension
2. Right-click on your app
3. Select "Deploy to Web App"

### 4. Verify Deployment

Check these URLs:
- Health check: `https://your-app.azurewebsites.net/health`
- Main app: `https://your-app.azurewebsites.net`

### 5. View Logs

```bash
# Stream logs
az webapp log tail --name your-app-name --resource-group your-resource-group

# Or in Azure Portal:
# App Service → Monitoring → Log stream
```

## Troubleshooting

### Port Issues
- Azure automatically sets PORT environment variable
- Our server.js reads from `process.env.PORT`
- Default fallback is 3000 for local development

### Build Failures
- Check Node.js version matches (20.x)
- Ensure all dependencies are in `dependencies` not `devDependencies`
- Check build logs in Azure Portal

### Application Not Starting
- Verify startup command is `npm start`
- Check application logs
- Ensure `server.js` exists in root

### 404 Errors
- Verify Next.js build completed successfully
- Check `.next` folder exists
- Ensure all routes are properly configured

## Performance Optimization

1. **Enable Application Insights** for monitoring
2. **Configure CDN** for static assets
3. **Enable compression** in Azure
4. **Set up auto-scaling** based on load

## Security

1. **Enable HTTPS only**
2. **Configure CORS** properly
3. **Set secure environment variables**
4. **Enable Azure AD authentication** if needed

## Monitoring

- Use Azure Application Insights
- Set up alerts for errors
- Monitor response times
- Track user sessions
