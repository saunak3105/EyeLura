
const express = require('express');
const router = express.Router();
const googleSheetService = require('../services/googleSheetService');
const { formatProduct } = require('../utils/formatProduct');

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const products = await googleSheetService.getAllProducts();
    const formattedProducts = products.map(formatProduct);
    
    res.status(200).json({
      success: true,
      count: formattedProducts.length,
      data: formattedProducts
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// GET /api/products/:id - Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }

    const product = await googleSheetService.getProductById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `Product with ID '${id}' does not exist`
      });
    }

    res.status(200).json({
      success: true,
      data: formatProduct(product)
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await googleSheetService.getAllProducts();
    
    const filteredProducts = products
      .filter(product => product.category.toLowerCase() === category.toLowerCase())
      .map(formatProduct);
    
    res.status(200).json({
      success: true,
      count: filteredProducts.length,
      category: category,
      data: filteredProducts
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products by category',
      message: error.message
    });
  }
});

// GET /api/products/search?q=query - Search products
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const products = await googleSheetService.getAllProducts();
    const searchTerm = q.toLowerCase();
    
    const filteredProducts = products
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm)
      )
      .map(formatProduct);
    
    res.status(200).json({
      success: true,
      count: filteredProducts.length,
      query: q,
      data: filteredProducts
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search products',
      message: error.message
    });
  }
});

module.exports = router;
