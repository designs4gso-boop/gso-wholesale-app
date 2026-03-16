const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load pricing database
let pricingData = {};
try {
  pricingData = JSON.parse(fs.readFileSync(path.join(__dirname, 'pricing-database.json'), 'utf8'));
  console.log('✅ Pricing database loaded');
} catch (err) {
  console.error('❌ Error loading pricing database:', err.message);
}

// ============================================================================
// PRICING ENGINE
// ============================================================================

function getPriceForQuantity(productId, quantity) {
  const product = pricingData.products.find(p => p.id === productId);
  
  if (!product) {
    return {
      error: `Product ${productId} not found`,
      status: 404
    };
  }

  // Find the applicable tier based on quantity
  const tier = product.tiers.find(t => 
    quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty)
  );

  if (!tier) {
    return {
      error: `No pricing tier found for quantity ${quantity}`,
      status: 400
    };
  }

  const totalPrice = tier.price * quantity;
  const regularTotalPrice = product.regularPrice * quantity;
  const savings = regularTotalPrice - totalPrice;

  return {
    productId,
    productName: product.name,
    quantity,
    pricePerUnit: tier.price,
    regularPricePerUnit: product.regularPrice,
    discountPercent: tier.discount,
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    regularTotalPrice: parseFloat(regularTotalPrice.toFixed(2)),
    savings: parseFloat(savings.toFixed(2)),
    tier: {
      min: tier.minQty,
      max: tier.maxQty,
      label: `${tier.minQty}${tier.maxQty ? '-' + tier.maxQty : '+'}`
    }
  };
}

// ============================================================================
// PUBLIC ENDPOINTS (No Authentication)
// ============================================================================

// Get all products
app.get('/api/products', (req, res) => {
  const products = pricingData.products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    regularPrice: p.regularPrice
  }));
  
  res.json({
    success: true,
    count: products.length,
    products
  });
});

// Get single product details
app.get('/api/products/:productId', (req, res) => {
  const { productId } = req.params;
  const product = pricingData.products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  res.json({
    success: true,
    product: {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      regularPrice: product.regularPrice,
      tiers: product.tiers
    }
  });
});

// Calculate price for a quantity (main pricing endpoint)
app.post('/api/pricing/calculate', (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({
      success: false,
      error: 'Missing productId or quantity'
    });
  }

  const pricing = getPriceForQuantity(productId, parseInt(quantity));

  if (pricing.error) {
    return res.status(pricing.status).json({
      success: false,
      error: pricing.error
    });
  }

  res.json({
    success: true,
    pricing
  });
});

// Get pricing tiers for a product
app.get('/api/products/:productId/pricing', (req, res) => {
  const { productId } = req.params;
  const product = pricingData.products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }

  // Generate pricing examples for each tier
  const pricingExamples = product.tiers.map(tier => {
    const exampleQty = tier.minQty; // Use minimum qty in tier
    const total = tier.price * exampleQty;
    const regularTotal = product.regularPrice * exampleQty;
    const savings = regularTotal - total;

    return {
      tier: `${tier.minQty}${tier.maxQty ? '-' + tier.maxQty : '+'}`,
      minQty: tier.minQty,
      maxQty: tier.maxQty,
      pricePerUnit: tier.price,
      discount: tier.discount,
      exampleQty,
      exampleTotal: parseFloat(total.toFixed(2)),
      regularExampleTotal: parseFloat(regularTotal.toFixed(2)),
      exampleSavings: parseFloat(savings.toFixed(2))
    };
  });

  res.json({
    success: true,
    productId,
    productName: product.name,
    regularPrice: product.regularPrice,
    pricingTiers: pricingExamples
  });
});

// Search/filter products
app.get('/api/products/search', (req, res) => {
  const { category, search } = req.query;
  
  let filtered = pricingData.products;

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }

  res.json({
    success: true,
    count: filtered.length,
    products: filtered.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      regularPrice: p.regularPrice
    }))
  });
});

// ============================================================================
// BULK CART ENDPOINTS
// ============================================================================

// Calculate bulk cart with multiple items
app.post('/api/cart/calculate', (req, res) => {
  const { items } = req.body; // items = [{productId, quantity}, ...]

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      error: 'Items must be an array of {productId, quantity}'
    });
  }

  const cartItems = items.map(item => {
    const pricing = getPriceForQuantity(item.productId, parseInt(item.quantity));
    return pricing;
  });

  // Check for errors
  const errors = cartItems.filter(item => item.error);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors
    });
  }

  // Calculate totals
  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartRegularTotal = cartItems.reduce((sum, item) => sum + item.regularTotalPrice, 0);
  const cartSavings = cartTotal.reduce((sum, item) => sum + item.savings, 0);

  res.json({
    success: true,
    items: cartItems,
    cartTotal: parseFloat(cartTotal.toFixed(2)),
    cartRegularTotal: parseFloat(cartRegularTotal.toFixed(2)),
    cartSavings: parseFloat(cartSavings.toFixed(2)),
    savingsPercent: parseFloat(((cartSavings / cartRegularTotal) * 100).toFixed(2))
  });
});

// ============================================================================
// CUSTOMER ENDPOINTS (Wholesale Registration)
// ============================================================================

// Register new wholesale customer (placeholder)
app.post('/api/customers/register-wholesale', (req, res) => {
  const { email, company, phone } = req.body;

  if (!email || !company) {
    return res.status(400).json({
      success: false,
      error: 'Email and company name required'
    });
  }

  // This is a placeholder - in production, you'd save to a database
  // For now, we're storing in memory (will reset on server restart)
  const newCustomer = {
    id: Date.now().toString(),
    email,
    company,
    phone,
    status: 'pending',
    createdAt: new Date().toISOString(),
    tier: 'retail' // Default tier until approved
  };

  res.json({
    success: true,
    message: 'Wholesale application submitted',
    customer: newCustomer,
    nextSteps: 'An admin will review your application shortly'
  });
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    productsLoaded: pricingData.products ? pricingData.products.length : 0,
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// ============================================================================
// START SERVER
// ============================================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Wholesale Pricing API Server Running`);
  console.log(`${'='.repeat(60)}`);
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /api/products`);
  console.log(`  GET  /api/products/:productId`);
  console.log(`  GET  /api/products/:productId/pricing`);
  console.log(`  POST /api/pricing/calculate`);
  console.log(`  POST /api/cart/calculate`);
  console.log(`  POST /api/customers/register-wholesale`);
  console.log(`  GET  /api/health`);
  console.log(`${'='.repeat(60)}\n`);
});

module.exports = app;
