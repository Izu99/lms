# #!/bin/bash

# # Step 1: Clean and build the backend
# echo "🛠️ Building backend..."
# npm install
# npm run build

# # Step 2: Prepare deployment package
# echo "📦 Zipping dist folder with package.json and package-lock.json..."
# zip -r backend-dist.zip dist package.json package-lock.json

# # Step 3: Deploy to Azure Function App
# echo "🚀 Deploying to Azure..."
# az functionapp deployment source config-zip \
#   --resource-group lms-rg \
#   --name lms-server \
#   --src backend-dist.zip

# # Step 4: Restart the Function App
# echo "🔁 Restarting Azure Function App..."
# az functionapp restart \
#   --name lms-server \
#   --resource-group lms-rg

# # Step 5: Confirm success
# echo "✅ Deployment complete. Visit: https://lms-server.azurewebsites.net"
