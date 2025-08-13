#!/bin/bash

echo "🚀 Building Rainbow Map News for Bluehost deployment..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Create production environment file
echo "🔧 Creating production environment..."
cat > .env.production << EOL
VITE_API_BASE_URL=https://your-backend-url.replit.app
VITE_APP_NAME=Rainbow Map News
VITE_APP_VERSION=1.0.0
EOL

# Step 3: Build the application
echo "🏗️  Building frontend..."
vite build --config vite.config.production.ts

# Step 4: Create deployment package
echo "📁 Creating deployment package..."
mkdir -p bluehost-deployment
cp -r dist/* bluehost-deployment/

# Step 5: Create .htaccess for proper routing
cat > bluehost-deployment/.htaccess << EOL
# Enable rewrite engine
RewriteEngine On

# Handle client-side routing
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>
EOL

# Step 6: Create deployment instructions
cat > bluehost-deployment/DEPLOYMENT-INSTRUCTIONS.txt << EOL
BLUEHOST DEPLOYMENT INSTRUCTIONS
================================

1. Log into your Bluehost cPanel
2. Open File Manager
3. Navigate to public_html directory (or subdirectory for subdomain)
4. Upload all files from this folder
5. Extract if uploaded as ZIP

IMPORTANT: Backend Configuration
===============================
Your frontend is now ready, but you need to deploy the backend separately:

Option 1: Use Replit Deployments (Recommended)
- Deploy your backend on Replit
- Update VITE_API_BASE_URL in your environment
- Cost: ~\$7/month

Option 2: Use Vercel/Netlify Functions
- Convert Express routes to serverless functions
- Deploy backend to Vercel or Netlify
- Free tier available

Option 3: Upgrade to VPS
- Bluehost VPS (\$19.99/month)
- Supports full Node.js applications

Your static frontend will work once you configure the backend URL!
EOL

echo "✅ Deployment package created in 'bluehost-deployment' folder"
echo "📋 Check DEPLOYMENT-INSTRUCTIONS.txt for next steps"
echo ""
echo "🎯 Next Steps:"
echo "1. Deploy your backend (see options in instructions)"
echo "2. Update API URL in environment variables"
echo "3. Upload 'bluehost-deployment' contents to Bluehost"
echo "4. Test your deployed application"