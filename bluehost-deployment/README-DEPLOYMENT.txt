RAINBOW MAP NEWS - BLUEHOST DEPLOYMENT GUIDE
===========================================

✅ Your frontend is ready for deployment!

STEP 1: UPLOAD TO BLUEHOST
--------------------------
1. Log into your Bluehost cPanel
2. Open File Manager
3. Navigate to public_html (or subdomain folder)
4. Upload ALL files from this folder
5. Extract if uploaded as ZIP

STEP 2: DEPLOY BACKEND
---------------------
Your frontend needs a backend API. Choose one option:

🔥 EASIEST: Use Replit Deployments (RECOMMENDED)
- Click "Deploy" button in your Replit workspace
- Choose "Autoscale" deployment
- Get your backend URL (e.g., https://yourapp.replit.app)
- Cost: $7/month for always-on service

💡 ALTERNATIVE: Railway
- Sign up at railway.app
- Connect GitHub repo
- Deploy backend service
- Cost: $5/month

🆓 FREE OPTION: Vercel/Netlify Functions
- Convert Express routes to serverless functions
- Deploy to Vercel or Netlify
- Free tier available

STEP 3: UPDATE API URL
---------------------
After deploying your backend:
1. Note your backend URL
2. Update the frontend to use it
3. Rebuild if needed: vite build --config vite.config.production.ts --emptyOutDir

WHAT'S INCLUDED:
---------------
✅ Optimized static files
✅ Apache .htaccess configuration
✅ Client-side routing support
✅ Asset compression
✅ Cache headers

YOUR SITE WILL HAVE:
-------------------
✅ Real LGBTQ+ news aggregation
✅ RSS feeds from multiple sources
✅ Full admin panel
✅ Article management
✅ Responsive design
✅ Professional styling

NEED HELP?
----------
- Check BLUEHOST-DEPLOYMENT.md for detailed instructions
- Use deployment-guide-bluehost.md for troubleshooting
- Backend hosting comparison in documentation

Your Rainbow Map News platform is ready to go live! 🌈