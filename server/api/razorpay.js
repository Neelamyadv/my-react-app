// Backend API endpoints for Razorpay integration
// This should be implemented on your server (Node.js/Express example)

const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Create order endpoint
app.post('/api/razorpay/orders', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    // Validate input
    if (!amount || !currency || !receipt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: amount, currency, receipt'
      });
    }

    // Create order
    const order = await razorpay.orders.create({
      amount: amount,
      currency: currency,
      receipt: receipt,
      notes: notes || {},
      payment_capture: 1 // Auto capture payment
    });

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

// Verify payment signature endpoint
app.post('/api/razorpay/verify', async (req, res) => {
  try {
    const { payment_id, order_id, signature } = req.body;

    // Validate input
    if (!payment_id || !order_id || !signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: payment_id, order_id, signature'
      });
    }

    // Verify signature
    const text = `${order_id}|${payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
      .update(text)
      .digest('hex');

    const isVerified = generated_signature === signature;

    res.json({
      success: true,
      verified: isVerified
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment'
    });
  }
});

// Webhook endpoint for payment status updates
app.post('/api/razorpay/webhook', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature
    const text = JSON.stringify(req.body);
    const generated_signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(text)
      .digest('hex');

    if (generated_signature !== signature) {
      return res.status(400).json({
        success: false,
        error: 'Invalid webhook signature'
      });
    }

    const event = req.body;

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        // Payment successful
        await handlePaymentSuccess(event.payload.payment.entity);
        break;
      
      case 'payment.failed':
        // Payment failed
        await handlePaymentFailure(event.payload.payment.entity);
        break;
      
      case 'order.paid':
        // Order completed
        await handleOrderPaid(event.payload.order.entity);
        break;
      
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      error: 'Webhook processing failed'
    });
  }
});

// Handle successful payment
async function handlePaymentSuccess(payment) {
  try {
    console.log('Payment successful:', payment.id);
    
    // Update your database
    // await updatePaymentStatus(payment.order_id, 'success', payment.id);
    
    // Send confirmation email
    // await sendPaymentConfirmationEmail(payment);
    
    // Update user enrollment
    // await updateUserEnrollment(payment.order_id);
    
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

// Handle failed payment
async function handlePaymentFailure(payment) {
  try {
    console.log('Payment failed:', payment.id);
    
    // Update your database
    // await updatePaymentStatus(payment.order_id, 'failed', payment.id);
    
    // Send failure notification
    // await sendPaymentFailureEmail(payment);
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

// Handle order completion
async function handleOrderPaid(order) {
  try {
    console.log('Order paid:', order.id);
    
    // Update order status
    // await updateOrderStatus(order.id, 'paid');
    
    // Process enrollment
    // await processEnrollment(order.id);
    
  } catch (error) {
    console.error('Error handling order paid:', error);
  }
}

module.exports = app;