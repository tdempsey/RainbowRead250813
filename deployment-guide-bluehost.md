# Deploying Rainbow Map News to Bluehost Shared Hosting

## Option 1: Static Frontend Deployment (Recommended)

### Step 1: Build Static Frontend
```bash
npm run build
```
This creates a `dist` folder with static files.

### Step 2: Upload to Bluehost
1. Log into Bluehost cPanel
2. Open File Manager
3. Navigate to `public_html` directory
4. Upload all files from the `dist` folder
5. Extract if needed

### Step 3: Configure Environment Variables
Create a `.env.production` file:
```
VITE_API_BASE_URL=https://your-backend-service.com
VITE_DATABASE_URL=your-neon-database-url
```

### Step 4: Backend Hosting Alternatives
Since Bluehost shared hosting doesn't support Node.js, host your backend elsewhere:

#### A. Replit Deployments (Easiest)
- Deploy backend on Replit
- Update frontend to call Replit backend API
- Cost: $7/month for always-on

#### B. Vercel/Netlify Functions
- Convert Express routes to serverless functions
- Deploy frontend to Bluehost, functions to Vercel/Netlify
- Cost: Free tier available

#### C. Railway/Render
- Deploy full backend to Railway or Render
- Update frontend API calls
- Cost: $5-20/month

## Option 2: VPS Hosting (Alternative)

If you need full control, consider upgrading to:
- Bluehost VPS ($19.99/month)
- DigitalOcean Droplet ($5/month)
- Linode ($5/month)

These support Node.js and full-stack applications.

## Option 3: Hybrid Approach

1. **Static frontend on Bluehost shared hosting**
2. **Backend API on Replit/Vercel/Railway**
3. **Database on Neon (already configured)**

This gives you:
- Cheap hosting for frontend
- Reliable backend service
- Managed database

## Recommended Steps

1. **Build and deploy frontend to Bluehost**
2. **Deploy backend to Replit Deployments**
3. **Update frontend API URLs**
4. **Test the deployed application**

Would you like me to help you implement any of these options?