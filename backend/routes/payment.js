
const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  createOrder,
  verifyPayment,
  getPaymentDetails
} = require('../controllers/paymentController');

const router = express.Router();

// POST /api/payment/create-order - Create Razorpay order
router.post('/create-order', verifyToken, createOrder);

// POST /api/payment/verify - Verify payment signature
router.post('/verify', verifyToken, verifyPayment);

// GET /api/payment/:paymentId - Get payment details
router.get('/:paymentId', verifyToken, getPaymentDetails);

module.exports = router;
