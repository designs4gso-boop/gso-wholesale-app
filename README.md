# 🛍️ Shopify Wholesale Pricing App - Complete Setup Guide

## Overview

This is a custom-built wholesale pricing system that:
- ✅ Displays dynamic pricing based on quantity ordered
- ✅ Shows beautiful pricing tier charts on product pages
- ✅ Calculates discounts in real-time as customers change quantities
- ✅ Supports bulk cart calculations
- ✅ Easily expandable for new products

---

## 📦 What's Included

```
my-wholesale-app/
├── server.js                      # Main Express API server
├── pricing-database.json          # All your product pricing data
├── package.json                   # Project dependencies
├── .env.example                   # Configuration template
├── wholesale-pricing-chart.js     # Frontend JavaScript for pricing chart
├── wholesale-pricing-chart.liquid # Shopify theme snippet
└── README.md                      # This file
```

---

## 🚀 QUICK START (5 Steps)

### Step 1: Create Your Project Folder

**On Windows PowerShell:**

```powershell
# Create the project folder
mkdir my-wholesale-app
cd my-wholesale-app
```

### Step 2: Copy Files Into Folder

1. Create a new folder: `C:\Users\YourUsername\my-wholesale-app`
2. Copy these files into that folder:
   - `server.js`
   - `pricing-database.json`
   - `package.json`
   - `.env.example`
   - `wholesale-pricing-chart.js`
   - `wholesale-pricing-chart.liquid`

### Step 3: Install Dependencies

**In PowerShell (inside your project folder):**

```powershell
# Install all required packages
npm install
```

This will create a `node_modules` folder (can be large, that's normal).

### Step 4: Set Up Your Environment

1. In your project folder, copy `.env.example` to a new file called `.env`
2. Edit `.env` and fill in:

```
PORT=3000
NODE_ENV=development
SHOPIFY_STORE=your-store.myshopify.com
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_ACCESS_TOKEN=your_access_token_here
```

**Getting your Shopify credentials:**
- Go to: https://your-store.myshopify.com/admin
- Click: Settings → Apps and integrations → Develop apps
- Click: "Create an app" → Name it "Wholesale Engine"
- Enable API scopes:
  - `write_products`
  - `read_customers`
  - `write_customers`
  - `write_orders`
- Click: "Install app"
- Copy: Admin API Access Token → Paste into `.env` file

### Step 5: Run Your Server

**In PowerShell:**

```powershell
npm start
```

You should see:
```
============================================================
✅ Wholesale Pricing API Server Running
============================================================
🚀 Server: http://localhost:3000

Endpoints:
  GET  /api/products
  GET  /api/products/:productId
  GET  /api/products/:productId/pricing
  POST /api/pricing/calculate
  POST /api/cart/calculate
  POST /api/customers/register-wholesale
  GET  /api/health
============================================================
```

**✅ Your server is now running!**

---

## 🧪 Test Your API

Open a new PowerShell window (keep the first one running the server) and test:

### Test 1: Get All Products
```powershell
curl http://localhost:3000/api/products
```

Expected response: List of all your products

### Test 2: Get Pricing for a Product
```powershell
curl -Method POST http://localhost:3000/api/pricing/calculate `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"productId":"mirion-jar-100ml-matte","quantity":100}'
```

Expected response:
```json
{
  "success": true,
  "pricing": {
    "productId": "mirion-jar-100ml-matte",
    "quantity": 100,
    "pricePerUnit": 4.55,
    "totalPrice": 455.00,
    "regularTotalPrice": 510.00,
    "savings": 55.00,
    "discountPercent": 10.8
  }
}
```

### Test 3: Health Check
```powershell
curl http://localhost:3000/api/health
```

---

## 🌐 Deploy Your API (Host It Online)

Your API currently runs locally. To use it with Shopify, you need to deploy it online.

### Option 1: Deploy to Render (Free - Recommended)

1. Go to: https://render.com
2. Sign up (free account)
3. Click: "New +" → "Web Service"
4. Connect your GitHub account (or upload files)
5. Fill in:
   - **Name:** `wholesale-api`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add your `.env` variables
6. Click: "Create Web Service"
7. Wait 2-3 minutes for deployment
8. You'll get a URL like: `https://wholesale-api-xxxxx.onrender.com`

### Option 2: Deploy to Railway (Free Credits)

1. Go to: https://railway.app
2. Sign up
3. New Project → Deploy from GitHub
4. Select your repo
5. Fill in environment variables
6. Deploy
7. Get your URL

### Option 3: Deploy to Heroku (Paid)

1. Go to: https://www.heroku.com
2. Create account
3. Follow Heroku deployment docs for Node.js

---

## 🎨 Add Pricing Chart to Your Shopify Store

### Step 1: Upload Files to Shopify Theme

1. Go to: https://your-store.myshopify.com/admin
2. Click: "Sales channels" → "Online Store" → "Themes"
3. Find your active theme → Click "Edit code"
4. On the left, scroll to "Assets" folder
5. Click "Add a new asset"
6. Upload `wholesale-pricing-chart.js`
7. Click "Add a new asset" again
8. Upload `wholesale-pricing-chart.liquid` (but rename it to go in Snippets folder)

### Step 2: Add Snippet to Product Page

1. In the theme editor, find `product.liquid` file
2. Find the line with the price display (usually something like `{{ product.price }}`)
3. BEFORE that line, add:
   ```liquid
   {% include 'wholesale-pricing-chart' %}
   ```
4. Save

### Step 3: Update the API URL

In `wholesale-pricing-chart.liquid`, find this line:
```liquid
data-api-url="{{ 'https://your-api-url.com' }}"
```

Replace `https://your-api-url.com` with your actual deployed API URL (from Render/Railway/etc).

### Step 4: Test on Your Store

1. Go to any product page on your store
2. You should see the pricing chart appear
3. Change the quantity → See the price update in real-time

---

## ➕ Add More Products

### To Add a New Product:

1. Open `pricing-database.json`
2. Find the `"products": [` array
3. Add a new product following this template:

```json
{
  "id": "unique-product-id",
  "name": "Product Name",
  "category": "category-name",
  "size": "size",
  "finish": "finish",
  "description": "Product Description",
  "costPerUnit": 0.50,
  "regularPrice": 10.00,
  "tiers": [
    {
      "minQty": 1,
      "maxQty": 250,
      "price": 10.00,
      "discount": 0
    },
    {
      "minQty": 251,
      "maxQty": 500,
      "price": 9.00,
      "discount": 10
    },
    {
      "minQty": 501,
      "maxQty": null,
      "price": 8.00,
      "discount": 20
    }
  ]
}
```

**Important:**
- `id` must be unique (no spaces, use hyphens)
- `maxQty: null` means unlimited (this tier continues forever)
- `discount` is the percentage off
- Last tier should have `maxQty: null`

4. Save the file
5. Restart your server (`Ctrl+C` then `npm start`)
6. Your new product is instantly available!

---

## 🔧 API Reference

### Get All Products
```
GET /api/products
```
Returns all available products

### Get Product Details
```
GET /api/products/{productId}
```
Returns pricing tiers for a specific product

### Calculate Price for Quantity
```
POST /api/pricing/calculate
Content-Type: application/json

{
  "productId": "mirion-jar-100ml-matte",
  "quantity": 150
}
```

### Get Pricing Tiers
```
GET /api/products/{productId}/pricing
```
Returns all pricing tiers with examples

### Calculate Bulk Cart
```
POST /api/cart/calculate
Content-Type: application/json

{
  "items": [
    {"productId": "product-1", "quantity": 100},
    {"productId": "product-2", "quantity": 50}
  ]
}
```

### Register Wholesale Customer (Placeholder)
```
POST /api/customers/register-wholesale
Content-Type: application/json

{
  "email": "customer@company.com",
  "company": "Company Name",
  "phone": "555-0123"
}
```

---

## 🚨 Troubleshooting

### "npm: The term 'npm' is not recognized"
- You need to install Node.js
- Download from: https://nodejs.org/
- Run the installer
- Restart PowerShell
- Try again

### "Port 3000 is already in use"
- Another app is using port 3000
- Change PORT in your `.env` file to 3001, 3002, etc.
- Restart the server

### "Cannot find module 'express'"
- Run: `npm install` again
- Make sure you're in your project folder

### Pricing chart not showing on Shopify
- Check that the API URL is correct in `wholesale-pricing-chart.liquid`
- Check browser console (F12) for errors
- Make sure your server is running (`npm start`)

### "CORS Error" in browser console
- The CORS is already enabled in the code
- Make sure API URL doesn't have a trailing slash

---

## 📱 Next Steps (Optional Enhancements)

1. **Add Customer Database** - Store wholesale customer info in a real database
2. **Create Admin Dashboard** - Approve customers, update pricing
3. **Email Notifications** - Alert customers when they apply for wholesale
4. **Custom Tiers** - Different customers see different pricing
5. **Bulk Order Workflow** - Special checkout process for wholesale customers

---

## 💡 Tips & Best Practices

✅ **Always** keep your Shopify API token in the `.env` file (never commit to GitHub)
✅ **Test locally** before deploying changes
✅ **Back up** your `pricing-database.json` file
✅ **Use descriptive IDs** for products (not just numbers)
✅ **Keep tiers in order** (minQty should increase down the list)
✅ **Deploy to production** after testing thoroughly

---

## 🆘 Need Help?

- Check the browser console (F12) for error messages
- Check PowerShell window for server logs
- Make sure all files are in the right folder
- Restart the server: `Ctrl+C` then `npm start`

---

## 📄 License

MIT - Use and modify as needed

---

**Built with ❤️ for your Shopify store**
