✅ WHOLESALE APP SETUP CHECKLIST
================================

PHASE 1: INITIAL SETUP (30 minutes)
===================================

□ Install Node.js
  - Download from: https://nodejs.org/
  - Click "LTS" version
  - Run installer, accept defaults
  - Restart PowerShell

□ Create project folder
  - Open PowerShell
  - Run: mkdir my-wholesale-app
  - Run: cd my-wholesale-app

□ Copy all files to folder
  - Create folder: C:\Users\YourUsername\my-wholesale-app
  - Copy these files there:
    ✓ server.js
    ✓ pricing-database.json
    ✓ package.json
    ✓ .env.example
    ✓ wholesale-pricing-chart.js
    ✓ wholesale-pricing-chart.liquid
    ✓ README.md
    ✓ ADD_PRODUCTS_TEMPLATE.js

□ Install dependencies
  - In PowerShell (in your folder), run: npm install
  - Wait for it to finish (2-5 minutes)

□ Create .env file
  - Copy .env.example to .env
  - Edit .env with your values
  - Fill in: SHOPIFY_STORE, SHOPIFY_API_KEY, SHOPIFY_ACCESS_TOKEN
  - Save file

□ Get Shopify API credentials
  - Go to: https://your-store.myshopify.com/admin
  - Settings → Apps and integrations → Develop apps
  - Create new app called "Wholesale Engine"
  - Enable scopes: write_products, read_customers, write_customers, write_orders
  - Install app
  - Copy Admin API Access Token → Paste into .env

□ Start your server
  - In PowerShell: npm start
  - Should see: "✅ Wholesale Pricing API Server Running"
  - Keep this PowerShell window open!

PHASE 2: TEST YOUR API (15 minutes)
===================================

□ Open new PowerShell window (keep first one running)
  - Run: cd my-wholesale-app

□ Test health check
  - Run: curl http://localhost:3000/api/health
  - Should return: status: "healthy"

□ Test get products
  - Run: curl http://localhost:3000/api/products
  - Should list your products

□ Test pricing calculation
  - Run: curl -Method POST http://localhost:3000/api/pricing/calculate \
         -Headers @{"Content-Type"="application/json"} \
         -Body '{"productId":"mirion-jar-100ml-matte","quantity":100}'
  - Should return pricing breakdown

□ Test different quantities
  - qty 100, 300, 600, 1500
  - Verify prices decrease as quantity increases

PHASE 3: DEPLOY TO PRODUCTION (30 minutes)
===========================================

□ Choose hosting platform (one of these):
  - Render.com (free) ← Recommended
  - Railway.app (free credits)
  - Heroku.com (paid)

□ Sign up for hosting service
  - Create free account
  - Verify email

□ Deploy your app
  - Upload files to platform
  - Set environment variables from .env
  - Run initial deploy
  - Wait for build to complete (2-5 minutes)

□ Get your public URL
  - Platform will give you a URL like:
    https://wholesale-api-xxxxx.onrender.com
  - Save this URL for later!

□ Test your live API
  - Run: curl https://your-deployment-url/api/health
  - Should work same as local testing

PHASE 4: CONNECT TO SHOPIFY (20 minutes)
========================================

□ Prepare theme files
  - Have ready: wholesale-pricing-chart.js
  - Have ready: wholesale-pricing-chart.liquid

□ Upload JS file to Shopify theme
  - Admin → Sales channels → Online Store → Themes
  - Click "Edit code" on your active theme
  - Assets folder → "Add new asset"
  - Upload wholesale-pricing-chart.js
  - Name it: wholesale-pricing-chart.js

□ Upload Liquid snippet
  - Assets folder → "Add new asset"
  - Create new file: wholesale-pricing-chart.liquid
  - Paste content from your .liquid file
  - Save

□ Update API URL in Liquid file
  - Edit wholesale-pricing-chart.liquid
  - Find: data-api-url="{{ 'https://your-api-url.com' }}"
  - Replace with your actual deployment URL
  - Save

□ Add snippet to product template
  - Find: product.liquid (or product-template.liquid)
  - Find: the price display line
  - BEFORE it, add: {% include 'wholesale-pricing-chart' %}
  - Save

□ Test on your store
  - Go to any product page on your Shopify store
  - Scroll down
  - Look for "💰 Wholesale Pricing" section
  - Try changing quantity
  - Verify price updates

PHASE 5: EXPANSION (Ongoing)
=============================

□ Add more products to pricing-database.json
  - Use ADD_PRODUCTS_TEMPLATE.js as guide
  - Follow template structure
  - Add tiers for your cost structure

□ Test new products
  - API: curl http://localhost:3000/api/products
  - Should see your new product

□ Update deployment
  - Upload updated pricing-database.json to hosting
  - Most platforms auto-detect changes
  - Or manually redeploy

□ Monitor for errors
  - Check PowerShell logs regularly
  - Check browser console (F12) for client-side errors
  - Check hosting platform logs

TROUBLESHOOTING CHECKLIST
=========================

If something doesn't work:

□ Check PowerShell window
  - Is server still running? (looks for ✅ messages)
  - Any red error text?
  - If crashed, run: npm start

□ Check .env file
  - Correct SHOPIFY_STORE value?
  - SHOPIFY_ACCESS_TOKEN present?
  - PORT not blocked?

□ Check browser console (F12)
  - Any CORS errors?
  - Any 404 errors?
  - API URL correct in Liquid file?

□ Check Shopify theme files
  - .liquid file properly uploaded?
  - API URL correct?
  - JavaScript file loaded (check Networks tab)?

□ Check deployment
  - Server running on hosting platform?
  - Environment variables set correctly?
  - Check platform logs for errors

□ Restart everything
  - Stop server: Ctrl+C
  - Run: npm start
  - Wait 5 seconds
  - Test again

MAINTENANCE CHECKLIST
====================

Weekly:
  □ Monitor server logs for errors
  □ Check if any products need pricing updates

Monthly:
  □ Update pricing-database.json with new products
  □ Review customer registrations
  □ Check if any tiers need adjustment

Quarterly:
  □ Backup pricing-database.json
  □ Review discount strategy
  □ Test all products on storefront

FINAL VERIFICATION
==================

Before considering complete:
  ✅ Server runs locally (npm start)
  ✅ API responds to test requests
  ✅ Deployed to hosting platform
  ✅ Pricing chart shows on Shopify product page
  ✅ Pricing updates when quantity changes
  ✅ All products pricing tiers display correctly
  ✅ Savings amount shows correctly
  ✅ Multiple products work (not just first one)

SUPPORT RESOURCES
=================

If you get stuck:
  1. Check README.md - Troubleshooting section
  2. Check ADD_PRODUCTS_TEMPLATE.js - for product help
  3. Search error messages in Google
  4. Check Node.js docs: https://nodejs.org/docs/
  5. Check Express docs: https://expressjs.com/

YOU'RE ALL SET! 🎉
==================

Your wholesale pricing app is now:
✅ Running locally
✅ Deployed to production
✅ Connected to Shopify
✅ Displaying pricing charts
✅ Ready for more products

Next steps:
1. Test with customers
2. Add remaining products
3. Customize messaging
4. Promote wholesale program

Questions? Check the README first!
