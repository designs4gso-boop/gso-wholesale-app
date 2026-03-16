// ADD NEW PRODUCTS TO YOUR PRICING DATABASE
// ================================================

// INSTRUCTIONS:
// 1. Open pricing-database.json
// 2. Find the "products": [ section
// 3. Copy the template below
// 4. Replace the values with your actual product data
// 5. Add a comma after the last product if adding to the middle
// 6. Save the file
// 7. Restart your server (Ctrl+C then npm start)

// TEMPLATE - Copy this and modify:
{
  "id": "unique-product-id",
  "name": "Product Display Name",
  "category": "jars|sticker-bags|other-category",
  "size": "100ml|150ml|3.5 inch|etc",
  "finish": "Matte|Spot Gloss|Holographic|etc",
  "description": "Full product description with all details",
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
      "maxQty": 1000,
      "price": 8.50,
      "discount": 15
    },
    {
      "minQty": 1001,
      "maxQty": null,
      "price": 8.00,
      "discount": 20
    }
  ]
}

// FIELD EXPLANATIONS:
// ================================================

// id: 
//   - Unique identifier (no spaces, use hyphens)
//   - Example: "mirion-jar-100ml-matte"
//   - This is what you'll reference in API calls

// name:
//   - Display name shown on product pages and charts
//   - Example: "Mirion Jar 100ML - Matte Finish"

// category:
//   - Group related products together
//   - Examples: "jars", "sticker-bags", "labels", "bottles"
//   - Use lowercase with hyphens

// size:
//   - Physical size of the product
//   - Examples: "100ml", "150ml", "3.5 inch", "4x6"

// finish:
//   - Finish type/material
//   - Examples: "Matte", "Spot Gloss", "Holographic"

// description:
//   - Full product description
//   - Include any relevant details for customers

// costPerUnit:
//   - Your actual cost per unit (for profit margin tracking)
//   - This helps you ensure proper markup
//   - Example: 0.50 means $0.50 per unit

// regularPrice:
//   - The standard price for quantity 1-250
//   - This is the base price before bulk discounts
//   - Example: 5.10

// tiers:
//   - Array of quantity tiers and their prices
//   - IMPORTANT: Must be in ascending order by minQty
//   - Each tier represents a quantity range

// Tier Fields:
//   minQty: Minimum quantity for this tier (inclusive)
//   maxQty: Maximum quantity for this tier (inclusive)
//           Use null for unlimited (last tier should always be null)
//   price: Price per unit at this tier
//   discount: Percentage discount (calculated as: (1 - price/regularPrice) * 100)

// EXAMPLE: How to Calculate Discount
// ================================================
// Regular Price: $5.10
// Tier Price: $4.70
// Discount = ((5.10 - 4.70) / 5.10) * 100
// Discount = 7.84% (round to 7.8)

// REAL EXAMPLE - Adding a New Mirion Jar:
// ================================================
{
  "id": "mirion-jar-150ml-holographic",
  "name": "Mirion Jar 150ML - Holographic",
  "category": "jars",
  "size": "150ml",
  "finish": "Holographic",
  "description": "150ML Jar with Holographic finish, Side Label, Top Label, Application",
  "costPerUnit": 0.0083,
  "regularPrice": 5.86,
  "tiers": [
    {
      "minQty": 1,
      "maxQty": 250,
      "price": 5.86,
      "discount": 0
    },
    {
      "minQty": 251,
      "maxQty": 500,
      "price": 5.70,
      "discount": 2.7
    },
    {
      "minQty": 501,
      "maxQty": 1000,
      "price": 5.60,
      "discount": 4.4
    },
    {
      "minQty": 1001,
      "maxQty": null,
      "price": 5.08,
      "discount": 13.3
    }
  ]
}

// BULK TIER SETUP RECOMMENDATION:
// ================================================
// For most products, use these tier ranges:
// 1-250:      Regular price (0% discount)
// 251-500:    10% discount
// 501-1000:   15% discount
// 1001+:      20% discount

// But ALWAYS use your actual pricing from your cost sheets
// This ensures profitability while offering competitive discounts

// COMMON MISTAKES TO AVOID:
// ================================================
// ❌ Tiers not in order: [1-250, 501-1000, 251-500] 
// ✅ Tiers in order: [1-250, 251-500, 501-1000]

// ❌ Missing null on last tier: maxQty: 1000
// ✅ null on last tier: maxQty: null

// ❌ Spaces in IDs: "mirion jar 100ml matte"
// ✅ Hyphens in IDs: "mirion-jar-100ml-matte"

// ❌ Prices increasing: [10.00, 11.00, 12.00]
// ✅ Prices decreasing: [10.00, 9.00, 8.00]

// ❌ Missing commas between products
// ✅ Commas after every product except the last one

// TESTING YOUR NEW PRODUCT:
// ================================================
// After adding a product and restarting your server:

// 1. Test the API:
//    curl http://localhost:3000/api/products
//    (Should show your new product in the list)

// 2. Get pricing for the new product:
//    curl -X POST http://localhost:3000/api/pricing/calculate \
//      -H "Content-Type: application/json" \
//      -d '{"productId":"your-new-product-id","quantity":100}'

// 3. Test different quantities:
//    - qty 100 (should be tier 1)
//    - qty 300 (should be tier 2)
//    - qty 600 (should be tier 3)
//    - qty 1500 (should be tier 4)

// NEED HELP CALCULATING TIERS?
// ================================================
// Use this formula:
// Discount Percent = ((Regular Price - Tier Price) / Regular Price) * 100

// Example with your Mirion Jar Matte:
// Regular: $5.10
// Tier at 251 units: $4.70
// Discount = ((5.10 - 4.70) / 5.10) * 100 = 7.84%
// Round to: 7.8 or 8

// STRUCTURE CHECK:
// ================================================
// Before saving, make sure your JSON is valid:
// 1. All opening { have a closing }
// 2. All opening [ have a closing ]
// 3. All strings are in double quotes
// 4. Commas separate items (not after the last item in an array)
// 5. No trailing commas

// Use a JSON validator: https://jsonlint.com/
