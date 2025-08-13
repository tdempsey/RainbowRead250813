# Deploying Rainbow Map News to Bluehost Shared Hosting

## Overview

Since Bluehost shared hosting doesn't support Node.js applications, we'll deploy the frontend as static files and host the backend elsewhere.

## Step-by-Step Deployment

### Step 1: Prepare Backend Deployment

First, deploy your backend to a Node.js hosting service:

#### Option A: Replit Deployments (Recommended)
1. In Replit, click "Deploy" button
2. Choose "Static" for frontend or "Autoscale" for backend
3. Your backend will get a URL like: `https://your-app.replit.app`
4. Note this URL for frontend configuration

#### Option B: Railway (Alternative)
1. Sign up at railway.app
2. Connect your GitHub repository
3. Deploy the backend service
4. Get your deployment URL

### Step 2: Build Frontend for Production

Run the deployment script:
```bash
chmod +x deploy-bluehost.sh
./deploy-bluehost.sh
```

Or manually:
```bash
# Install dependencies
npm install

# Create production config
echo 'VITE_API_BASE_URL=https://your-backend-url.replit.app' > .env.production

# Build frontend
vite build --config vite.config.production.ts

# Files are now in 'dist' folder
```

### Step 3: Upload to Bluehost

1. **Log into Bluehost cPanel**
2. **Open File Manager**
3. **Navigate to public_html** (or subdirectory for subdomain)
4. **Upload all files from 'bluehost-deployment' folder**
5. **Extract if uploaded as ZIP**

### Step 4: Configure Domain/Subdomain

#### For Main Domain:
- Upload files to `public_html`
- Site accessible at `yourdomain.com`

#### For Subdomain:
1. Create subdomain in cPanel
2. Upload files to subdomain folder
3. Site accessible at `subdomain.yourdomain.com`

### Step 5: Update API Configuration

Update your backend URL in the production environment:

1. **Edit .env.production:**
```
VITE_API_BASE_URL=https://your-actual-backend-url.com
VITE_APP_NAME=Rainbow Map News
```

2. **Rebuild if needed:**
```bash
vite build --config vite.config.production.ts
```

## Important Files Created

- **vite.config.production.ts**: Production build configuration
- **deploy-bluehost.sh**: Automated deployment script
- **dist/.htaccess**: Apache configuration for client-side routing
- **DEPLOYMENT-INSTRUCTIONS.txt**: Step-by-step guide

## Backend Hosting Options Comparison

| Service | Cost | Node.js | Database | Pros |
|---------|------|---------|----------|------|
| Replit | $7/month | ✅ | Neon DB | Easy deployment, always-on |
| Railway | $5/month | ✅ | Neon DB | Git integration, automatic deploys |
| Vercel | Free/Pro | ✅ (Functions) | Neon DB | Serverless, great performance |
| Netlify | Free/Pro | ✅ (Functions) | Neon DB | CI/CD, form handling |

## Troubleshooting

### Common Issues:

1. **404 on page refresh:**
   - Ensure .htaccess is uploaded
   - Check Apache mod_rewrite is enabled

2. **API calls failing:**
   - Verify backend URL in .env.production
   - Check CORS settings on backend
   - Ensure backend is deployed and running

3. **CSS/JS not loading:**
   - Check file paths in built files
   - Verify all assets uploaded correctly

### Testing Deployment:

1. **Test static frontend locally:**
```bash
npm run preview
```

2. **Test production build:**
```bash
vite build --config vite.config.production.ts
cd dist && python -m http.server 8000
```

## Alternative: Full VPS Hosting

If you need full Node.js support:

1. **Upgrade to Bluehost VPS** ($19.99/month)
2. **Or use alternatives:**
   - DigitalOcean Droplet ($5/month)
   - Linode VPS ($5/month)
   - Vultr VPS ($3.50/month)

These support full-stack Node.js applications.

## Final Architecture

```
Frontend (Static Files) → Bluehost Shared Hosting
         ↓ API Calls
Backend (Node.js) → Replit/Railway/Vercel
         ↓ Database Queries  
Database (PostgreSQL) → Neon Database
```

This setup gives you:
- ✅ Affordable hosting
- ✅ Real LGBTQ+ news data
- ✅ Full admin functionality
- ✅ Responsive design
- ✅ Professional deployment

Your Rainbow Map News platform will be live and fully functional!