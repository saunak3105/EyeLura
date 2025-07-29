
const express = require('express');
const router = express.Router();
const googleSheetService = require('../services/googleSheetService');

// Generate order ID
const generateOrderId = () => {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
};

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, customerInfo } = req.body;

    // Validate request body
    if (!productId || !quantity || !customerInfo) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'productId, quantity, and customerInfo are required'
      });
    }

    // Validate customer info
    const { email, name, phone } = customerInfo;
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        error: 'Missing customer information',
        message: 'Customer email and name are required'
      });
    }

    // Validate quantity
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quantity',
        message: 'Quantity must be a positive integer'
      });
    }

    // Get product details
    const product = await googleSheetService.getProductById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `Product with ID '${productId}' does not exist`
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient stock',
        message: `Only ${product.stock} items available, but ${quantity} requested`,
        availableStock: product.stock
      });
    }

    // Calculate total price
    const totalPrice = product.price * quantity;

    // Generate order ID
    const orderId = generateOrderId();

    // Update stock in Google Sheets
    const newStock = product.stock - quantity;
    await googleSheetService.updateProductStock(productId, newStock);

    // Log order in Google Sheets
    const orderData = {
      orderId,
      productId,
      productName: product.name,
      quantity,
      totalPrice,
      customerEmail: email,
      customerName: name,
      customerPhone: phone || '',
      status: 'confirmed'
    };

    await googleSheetService.logOrder(orderData);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          sku: product.sku
        },
        quantity,
        totalPrice,
        customer: {
          name,
          email,
          phone
        },
        status: 'confirmed',
        remainingStock: newStock
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: error.message
    });
  }
});

// GET /api/orders/validate - Validate order before processing
router.post('/validate', async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Product ID and quantity are required'
      });
    }

    const product = await googleSheetService.getProductById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const isAvailable = product.stock >= quantity;
    const totalPrice = product.price * quantity;

    res.status(200).json({
      success: true,
      data: {
        productId,
        productName: product.name,
        requestedQuantity: quantity,
        availableStock: product.stock,
        isAvailable,
        unitPrice: product.price,
        totalPrice: isAvailable ? totalPrice : null,
        message: isAvailable 
          ? 'Product is available for purchase'
          : `Only ${product.stock} items available`
      }
    });

  } catch (error) {
    console.error('Error validating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate order',
      message: error.message
    });
  }
});

module.exports = router;
