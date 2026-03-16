// Wholesale Pricing Chart - Shopify Theme Integration
// This file handles real-time pricing calculations and displays pricing tiers

(function() {
  'use strict';

  const PRICING_API = 'https://your-api-url.com'; // Update this with your actual API URL

  class WholesalePricingChart {
    constructor(productId, options = {}) {
      this.productId = productId;
      this.apiUrl = options.apiUrl || PRICING_API;
      this.container = options.container || '#wholesale-pricing-chart';
      this.quantityInput = options.quantityInput || 'input[name="quantity"]';
      this.pricingData = null;
      this.currentQuantity = 1;
      
      this.init();
    }

    async init() {
      try {
        // Fetch pricing tiers for this product
        await this.fetchPricingTiers();
        
        // Render the pricing chart
        this.render();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial price calculation
        this.updatePrice();
      } catch (error) {
        console.error('Error initializing pricing chart:', error);
      }
    }

    async fetchPricingTiers() {
      try {
        const response = await fetch(`${this.apiUrl}/api/products/${this.productId}/pricing`);
        const data = await response.json();
        
        if (data.success) {
          this.pricingData = data;
        } else {
          throw new Error(data.error || 'Failed to fetch pricing');
        }
      } catch (error) {
        console.error('Error fetching pricing tiers:', error);
        throw error;
      }
    }

    async calculatePrice(quantity) {
      try {
        const response = await fetch(`${this.apiUrl}/api/pricing/calculate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: this.productId,
            quantity: quantity
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          return data.pricing;
        } else {
          throw new Error(data.error || 'Failed to calculate price');
        }
      } catch (error) {
        console.error('Error calculating price:', error);
        return null;
      }
    }

    async updatePrice() {
      const quantity = parseInt(document.querySelector(this.quantityInput)?.value || this.currentQuantity);
      this.currentQuantity = quantity;
      
      const pricing = await this.calculatePrice(quantity);
      
      if (pricing) {
        // Update the display
        const priceDisplay = document.querySelector('[data-wholesale-current-price]');
        const savingsDisplay = document.querySelector('[data-wholesale-savings]');
        const regularPriceDisplay = document.querySelector('[data-wholesale-regular-price]');
        
        if (priceDisplay) {
          priceDisplay.textContent = `$${pricing.totalPrice.toFixed(2)}`;
        }
        
        if (regularPriceDisplay) {
          regularPriceDisplay.textContent = `$${pricing.regularTotalPrice.toFixed(2)}`;
          regularPriceDisplay.style.textDecoration = 'line-through';
          regularPriceDisplay.style.color = '#999';
        }
        
        if (savingsDisplay) {
          const savingsPercent = ((pricing.savings / pricing.regularTotalPrice) * 100).toFixed(1);
          savingsDisplay.textContent = `Save $${pricing.savings.toFixed(2)} (${savingsPercent}%)`;
          savingsDisplay.style.color = '#28a745';
          savingsDisplay.style.fontWeight = 'bold';
        }
        
        // Highlight the active tier
        this.highlightActiveTier(quantity);
      }
    }

    highlightActiveTier(quantity) {
      const tiers = document.querySelectorAll('[data-tier]');
      
      tiers.forEach(tier => {
        const minQty = parseInt(tier.getAttribute('data-tier-min'));
        const maxQty = parseInt(tier.getAttribute('data-tier-max')) || Infinity;
        
        if (quantity >= minQty && quantity <= maxQty) {
          tier.classList.add('active');
          tier.style.backgroundColor = '#f0f8ff';
          tier.style.borderLeft = '4px solid #007bff';
        } else {
          tier.classList.remove('active');
          tier.style.backgroundColor = 'transparent';
          tier.style.borderLeft = 'none';
        }
      });
    }

    render() {
      if (!this.pricingData) {
        console.error('No pricing data available');
        return;
      }

      const container = document.querySelector(this.container);
      if (!container) {
        console.error(`Container ${this.container} not found`);
        return;
      }

      const tiers = this.pricingData.pricingTiers;
      const regularPrice = this.pricingData.regularPrice;

      let html = `
        <div class="wholesale-pricing-section">
          <h3 style="margin-bottom: 15px; font-size: 18px; font-weight: bold;">💰 Wholesale Pricing</h3>
          
          <div class="current-pricing" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
          ">
            <p style="margin: 0; font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px;">Your Price</p>
            <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold;" data-wholesale-current-price>$${regularPrice}</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;" data-wholesale-regular-price>$${regularPrice}</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; font-weight: bold;" data-wholesale-savings>—</p>
          </div>

          <div class="pricing-tiers" style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 12px; font-size: 14px; font-weight: bold; color: #333;">Bulk Order Tiers</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background-color: #f5f5f5; border-bottom: 2px solid #ddd;">
                  <th style="padding: 10px; text-align: left;">Quantity</th>
                  <th style="padding: 10px; text-align: center;">Unit Price</th>
                  <th style="padding: 10px; text-align: center;">Discount</th>
                  <th style="padding: 10px; text-align: right;">Total (ex.)</th>
                </tr>
              </thead>
              <tbody>
      `;

      tiers.forEach((tier, index) => {
        const discountBadge = tier.discount > 0 ? 
          `<span style="background: #28a745; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;">-${tier.discount}%</span>` 
          : 'Retail';
        
        html += `
          <tr 
            data-tier="${tier.tier}" 
            data-tier-min="${tier.minQty}" 
            data-tier-max="${tier.maxQty || 999999}"
            style="border-bottom: 1px solid #eee; transition: all 0.3s ease;"
          >
            <td style="padding: 12px; font-weight: 500;">${tier.minQty}${tier.maxQty ? '-' + tier.maxQty : '+' } units</td>
            <td style="padding: 12px; text-align: center; font-weight: bold;">$${tier.pricePerUnit.toFixed(2)}</td>
            <td style="padding: 12px; text-align: center;">${discountBadge}</td>
            <td style="padding: 12px; text-align: right; font-weight: bold;">$${tier.exampleTotal.toFixed(2)}</td>
          </tr>
        `;
      });

      html += `
              </tbody>
            </table>
            <p style="margin-top: 10px; font-size: 11px; color: #999; font-style: italic;">
              * Examples show pricing for minimum quantity in each tier
            </p>
          </div>

          <div class="pricing-info" style="
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            border-radius: 4px;
            font-size: 12px;
            color: #856404;
          ">
            <strong>💡 Tip:</strong> The more you order, the better the price! Adjust the quantity above to see your exact price.
          </div>
        </div>
      `;

      container.innerHTML = html;
    }

    setupEventListeners() {
      const quantityInput = document.querySelector(this.quantityInput);
      
      if (quantityInput) {
        quantityInput.addEventListener('change', () => this.updatePrice());
        quantityInput.addEventListener('input', () => this.updatePrice());
      }

      // Also listen for quantity changes on the "+" and "-" buttons if they exist
      const incrementBtn = document.querySelector('[data-quantity-increment]');
      const decrementBtn = document.querySelector('[data-quantity-decrement]');

      if (incrementBtn) {
        incrementBtn.addEventListener('click', () => {
          setTimeout(() => this.updatePrice(), 100);
        });
      }

      if (decrementBtn) {
        decrementBtn.addEventListener('click', () => {
          setTimeout(() => this.updatePrice(), 100);
        });
      }
    }
  }

  // Export for use in Shopify theme
  window.WholesalePricingChart = WholesalePricingChart;

  // Auto-initialize if data attributes are present
  document.addEventListener('DOMContentLoaded', function() {
    const chartElement = document.querySelector('[data-wholesale-product-id]');
    
    if (chartElement) {
      const productId = chartElement.getAttribute('data-wholesale-product-id');
      const apiUrl = chartElement.getAttribute('data-api-url') || PRICING_API;
      
      new WholesalePricingChart(productId, {
        apiUrl: apiUrl,
        container: '#wholesale-pricing-chart',
        quantityInput: 'input[name="quantity"]'
      });
    }
  });
})();
