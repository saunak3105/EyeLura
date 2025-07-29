
/**
 * Format product data for consistent API responses
 * @param {Object} product - Raw product data from Google Sheets
 * @returns {Object} - Formatted product object
 */
const formatProduct = (product) => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    imageUrl: product.imageUrl,
    stock: product.stock,
    sku: product.sku,
    description: product.description,
    inStock: product.stock > 0,
    priceFormatted: `₹${product.price.toLocaleString('en-IN')}`,
    stockStatus: getStockStatus(product.stock)
  };
};

/**
 * Get stock status based on quantity
 * @param {number} stock - Stock quantity
 * @returns {string} - Stock status
 */
const getStockStatus = (stock) => {
  if (stock === 0) return 'out_of_stock';
  if (stock <= 5) return 'low_stock';
  return 'in_stock';
};

/**
 * Validate product data
 * @param {Object} product - Product data to validate
 * @returns {Object} - Validation result
 */
const validateProduct = (product) => {
  const errors = [];
  
  if (!product.id) errors.push('Product ID is required');
  if (!product.name) errors.push('Product name is required');
  if (typeof product.price !== 'number' || product.price < 0) {
    errors.push('Valid price is required');
  }
  if (!product.category) errors.push('Product category is required');
  if (typeof product.stock !== 'number' || product.stock < 0) {
    errors.push('Valid stock quantity is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format multiple products
 * @param {Array} products - Array of products
 * @returns {Array} - Array of formatted products
 */
const formatProducts = (products) => {
  return products.map(formatProduct);
};

module.exports = {
  formatProduct,
  formatProducts,
  validateProduct,
  getStockStatus
};
