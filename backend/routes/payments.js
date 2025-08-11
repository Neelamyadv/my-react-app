const express = require('express');
const { body, validationResult } = require('express-validator');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { authenticateToken } = require('../middleware/auth');
const { logPayment, logPaymentError, logError, logUserActivity } = require('../config/logger');
const db = require('../config/database');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Validation middleware
const validateOrderCreation = [
  body('amount')
    .isInt({ min: 1 })
    .withMessage('Amount must be a positive integer'),
  body('currency')
    .optional()
    .isIn(['INR', 'USD'])
    .withMessage('Currency must be INR or USD'),
  body('receipt')
    .optional()
    .isString()
    .withMessage('Receipt must be a string'),
  body('notes')
    .optional()
    .isObject()
    .withMessage('Notes must be an object')
];

const validatePaymentVerification = [
  body('razorpay_payment_id')
    .notEmpty()
    .withMessage('Payment ID is required'),
  body('razorpay_order_id')
    .notEmpty()
    .withMessage('Order ID is required'),
  body('razorpay_signature')
    .notEmpty()
    .withMessage('Signature is required')
];

// Create order
router.post('/orders', authenticateToken, validateOrderCreation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Create order options
    const orderOptions = {
      amount: amount * 100, // Convert to paise
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}_${req.user.id}`,
      notes: {
        user_id: req.user.id.toString(),
        user_email: req.user.email,
        ...notes
      }
    };

    // Create order with Razorpay
    const order = await razorpay.orders.create(orderOptions);

    // Store order in database
    const result = await db.run(
      'INSERT INTO orders (razorpay_order_id, user_id, amount, currency, receipt, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [
        order.id,
        req.user.id,
        amount,
        currency,
        orderOptions.receipt,
        JSON.stringify(orderOptions.notes)
      ]
    );

    const orderId = result.lastID || result.rows[0].id;

    logPayment(order.id, 'order_created', {
      userId: req.user.id,
      amount,
      currency,
      orderId
    });

    logUserActivity(req.user.id, 'order_created', {
      orderId: order.id,
      amount,
      currency
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
          created_at: order.created_at
        }
      }
    });

  } catch (error) {
    logPaymentError('order_creation', error, {
      userId: req.user.id,
      amount: req.body.amount
    });

    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

// Verify payment signature
router.post('/verify', authenticateToken, validatePaymentVerification, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      logPaymentError(razorpay_payment_id, new Error('Invalid signature'), {
        userId: req.user.id,
        orderId: razorpay_order_id
      });

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Get order from database
    const orders = await db.query(
      'SELECT * FROM orders WHERE razorpay_order_id = ? AND user_id = ?',
      [razorpay_order_id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Check if payment already exists
    const existingPayments = await db.query(
      'SELECT id FROM payments WHERE razorpay_payment_id = ?',
      [razorpay_payment_id]
    );

    if (existingPayments.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Payment already processed'
      });
    }

    // Store payment in database
    const result = await db.run(
      'INSERT INTO payments (razorpay_payment_id, order_id, user_id, amount, currency, status, method, description, email, contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        razorpay_payment_id,
        order.id,
        req.user.id,
        payment.amount / 100, // Convert from paise
        payment.currency,
        payment.status,
        payment.method,
        payment.description,
        payment.email,
        payment.contact
      ]
    );

    const paymentId = result.lastID || result.rows[0].id;

    // Update order status
    await db.run(
      'UPDATE orders SET status = ? WHERE id = ?',
      [payment.status, order.id]
    );

    // If payment is successful, create enrollment
    if (payment.status === 'captured') {
      await db.run(
        'INSERT INTO enrollments (user_id, course_name, status) VALUES (?, ?, ?)',
        [req.user.id, 'Premium Course', 'active']
      );
    }

    logPayment(razorpay_payment_id, 'payment_verified', {
      userId: req.user.id,
      orderId: razorpay_order_id,
      status: payment.status,
      amount: payment.amount / 100
    });

    logUserActivity(req.user.id, 'payment_verified', {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: payment.status
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment: {
          id: razorpay_payment_id,
          order_id: razorpay_order_id,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          created_at: payment.created_at
        }
      }
    });

  } catch (error) {
    logPaymentError(req.body.razorpay_payment_id, error, {
      userId: req.user.id,
      orderId: req.body.razorpay_order_id
    });

    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
});

// Get user's payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const payments = await db.query(
      `SELECT p.*, o.razorpay_order_id, o.receipt 
       FROM payments p 
       JOIN orders o ON p.order_id = o.id 
       WHERE p.user_id = ? 
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        payments: payments.map(payment => ({
          id: payment.razorpay_payment_id,
          order_id: payment.razorpay_order_id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          created_at: payment.created_at
        }))
      }
    });

  } catch (error) {
    logError('Get payment history error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history'
    });
  }
});

// Get payment details
router.get('/:paymentId', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payments = await db.query(
      `SELECT p.*, o.razorpay_order_id, o.receipt 
       FROM payments p 
       JOIN orders o ON p.order_id = o.id 
       WHERE p.razorpay_payment_id = ? AND p.user_id = ?`,
      [paymentId, req.user.id]
    );

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const payment = payments[0];

    res.json({
      success: true,
      data: {
        payment: {
          id: payment.razorpay_payment_id,
          order_id: payment.razorpay_order_id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          description: payment.description,
          email: payment.email,
          contact: payment.contact,
          created_at: payment.created_at
        }
      }
    });

  } catch (error) {
    logError('Get payment details error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details'
    });
  }
});

// Webhook handler (no authentication required for webhooks)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    if (!signature) {
      logError('Webhook signature missing', { headers: req.headers });
      return res.status(400).json({ error: 'Signature missing' });
    }

    // Verify webhook signature
    const text = req.body;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== expectedSignature) {
      logError('Invalid webhook signature', { 
        received: signature, 
        expected: expectedSignature 
      });
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(req.body);

    logPayment(event.payload.payment.entity.id, 'webhook_received', {
      event: event.event,
      paymentId: event.payload.payment.entity.id
    });

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity);
        break;
      default:
        logError('Unhandled webhook event', { event: event.event });
    }

    res.json({ received: true });

  } catch (error) {
    logError('Webhook processing error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Webhook event handlers
async function handlePaymentCaptured(payment) {
  try {
    // Update payment status in database
    await db.run(
      'UPDATE payments SET status = ? WHERE razorpay_payment_id = ?',
      [payment.status, payment.id]
    );

    // Get order details
    const orders = await db.query(
      'SELECT user_id FROM orders WHERE razorpay_order_id = ?',
      [payment.order_id]
    );

    if (orders.length > 0) {
      const userId = orders[0].user_id;

      // Create or update enrollment
      const enrollments = await db.query(
        'SELECT id FROM enrollments WHERE user_id = ? AND course_name = ?',
        [userId, 'Premium Course']
      );

      if (enrollments.length === 0) {
        await db.run(
          'INSERT INTO enrollments (user_id, course_name, status) VALUES (?, ?, ?)',
          [userId, 'Premium Course', 'active']
        );
      }

      logUserActivity(userId, 'payment_captured', {
        paymentId: payment.id,
        amount: payment.amount / 100
      });
    }

    logPayment(payment.id, 'payment_captured', {
      amount: payment.amount / 100,
      method: payment.method
    });

  } catch (error) {
    logPaymentError(payment.id, error, { event: 'payment_captured' });
  }
}

async function handlePaymentFailed(payment) {
  try {
    // Update payment status in database
    await db.run(
      'UPDATE payments SET status = ? WHERE razorpay_payment_id = ?',
      [payment.status, payment.id]
    );

    logPayment(payment.id, 'payment_failed', {
      error_code: payment.error_code,
      error_description: payment.error_description
    });

  } catch (error) {
    logPaymentError(payment.id, error, { event: 'payment_failed' });
  }
}

async function handleOrderPaid(order) {
  try {
    // Update order status in database
    await db.run(
      'UPDATE orders SET status = ? WHERE razorpay_order_id = ?',
      [order.status, order.id]
    );

    logPayment('order_paid', 'order_paid', {
      orderId: order.id,
      amount: order.amount / 100
    });

  } catch (error) {
    logPaymentError('order_paid', error, { orderId: order.id });
  }
}

module.exports = router;