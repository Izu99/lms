# 1. Zip the dist folder (adjust path as needed)
zip -r backend-dist.zip dist

# 2. Deploy the ZIP file to Azure Function App via CLI
az functionapp deployment source config-zip --resource-group lms-rg --name lms-server --src backend-dist.zip

# 3. Restart the Azure Function App to apply changes
az functionapp restart --name lms-server --resource-group lms-rg
