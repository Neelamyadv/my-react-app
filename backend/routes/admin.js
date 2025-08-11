const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { logError, logInfo, logUserActivity } = require('../config/logger');
const db = require('../config/database');

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await db.query(
      'SELECT id, email, name, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      }))
    });

  } catch (error) {
    logError('Get users error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get all payments
router.get('/payments', async (req, res) => {
  try {
    const payments = await db.query(
      `SELECT p.*, u.email, u.name as user_name 
       FROM payments p 
       JOIN users u ON p.user_id = u.id 
       ORDER BY p.created_at DESC`
    );

    res.json({
      success: true,
      data: payments.map(payment => ({
        id: payment.razorpay_payment_id,
        user_id: payment.user_id,
        user_email: payment.email,
        user_name: payment.user_name,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        created_at: payment.created_at,
        payment_type: payment.status === 'captured' ? 'success' : 'pending'
      }))
    });

  } catch (error) {
    logError('Get payments error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments'
    });
  }
});

// Get all contact messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await db.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: messages.map(message => ({
        id: message.id,
        name: message.name,
        email: message.email,
        message: message.message,
        status: message.status,
        created_at: message.created_at
      }))
    });

  } catch (error) {
    logError('Get messages error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// Grant access to user
router.post('/grant-access', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('accessType')
    .isIn(['premium_pass', 'course'])
    .withMessage('Access type must be premium_pass or course'),
  body('courses')
    .isArray()
    .withMessage('Courses must be an array')
], async (req, res) => {
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

    const { email, accessType, courses } = req.body;

    // Find user by email
    const users = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email address'
      });
    }

    const userId = users[0].id;

    // Check if user already has this access
    const existingEnrollments = await db.query(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_name = ?',
      [userId, accessType === 'premium_pass' ? 'Premium Pass' : courses[0]]
    );

    if (existingEnrollments.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User already has this access'
      });
    }

    // Grant access based on type
    if (accessType === 'premium_pass') {
      // Grant premium pass access
      await db.run(
        'INSERT INTO enrollments (user_id, course_name, status) VALUES (?, ?, ?)',
        [userId, 'Premium Pass', 'active']
      );

      logUserActivity(userId, 'admin_granted_premium_access', { 
        grantedBy: req.user.id,
        email: email 
      });

      res.json({
        success: true,
        message: 'Premium Pass access granted successfully',
        data: {
          userId,
          email,
          accessType: 'premium_pass',
          courses: ['all']
        }
      });

    } else {
      // Grant individual course access
      const enrollmentPromises = courses.map(courseName => 
        db.run(
          'INSERT INTO enrollments (user_id, course_name, status) VALUES (?, ?, ?)',
          [userId, courseName, 'active']
        )
      );

      await Promise.all(enrollmentPromises);

      logUserActivity(userId, 'admin_granted_course_access', { 
        grantedBy: req.user.id,
        email: email,
        courses: courses 
      });

      res.json({
        success: true,
        message: 'Course access granted successfully',
        data: {
          userId,
          email,
          accessType: 'course',
          courses: courses
        }
      });
    }

  } catch (error) {
    logError('Grant access error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Failed to grant access'
    });
  }
});

// Update message status
router.put('/messages/:id/status', [
  body('status')
    .isIn(['unread', 'read', 'replied', 'archived'])
    .withMessage('Invalid status')
], async (req, res) => {
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

    const { id } = req.params;
    const { status } = req.body;

    // Update message status
    await db.run(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      [status, id]
    );

    logInfo('Message status updated', {
      messageId: id,
      status,
      updatedBy: req.user.id
    });

    res.json({
      success: true,
      message: 'Message status updated successfully'
    });

  } catch (error) {
    logError('Update message status error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Failed to update message status'
    });
  }
});

// Get user enrollments
router.get('/users/:userId/enrollments', async (req, res) => {
  try {
    const { userId } = req.params;

    const enrollments = await db.query(
      'SELECT * FROM enrollments WHERE user_id = ? ORDER BY enrolled_at DESC',
      [userId]
    );

    res.json({
      success: true,
      data: enrollments.map(enrollment => ({
        id: enrollment.id,
        course_name: enrollment.course_name,
        status: enrollment.status,
        enrolled_at: enrollment.enrolled_at,
        completed_at: enrollment.completed_at,
        progress: enrollment.progress
      }))
    });

  } catch (error) {
    logError('Get user enrollments error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user enrollments'
    });
  }
});

// Update user enrollment
router.put('/enrollments/:enrollmentId', [
  body('status')
    .optional()
    .isIn(['active', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100')
], async (req, res) => {
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

    const { enrollmentId } = req.params;
    const { status, progress } = req.body;

    // Build update query
    const updates = [];
    const values = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }

    if (progress !== undefined) {
      updates.push('progress = ?');
      values.push(progress);
    }

    if (status === 'completed') {
      updates.push('completed_at = CURRENT_TIMESTAMP');
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid updates provided'
      });
    }

    values.push(enrollmentId);

    // Update enrollment
    await db.run(
      `UPDATE enrollments SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    logInfo('Enrollment updated', {
      enrollmentId,
      updates: { status, progress },
      updatedBy: req.user.id
    });

    res.json({
      success: true,
      message: 'Enrollment updated successfully'
    });

  } catch (error) {
    logError('Update enrollment error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Failed to update enrollment'
    });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get counts from database
    const [userCount, paymentCount, messageCount] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM users'),
      db.query('SELECT COUNT(*) as count FROM payments WHERE status = "captured"'),
      db.query('SELECT COUNT(*) as count FROM contact_messages')
    ]);

    // Get revenue
    const revenueResult = await db.query(
      'SELECT SUM(amount) as total FROM payments WHERE status = "captured"'
    );

    // Get premium users
    const premiumUsersResult = await db.query(
      'SELECT COUNT(*) as count FROM enrollments WHERE course_name = "Premium Pass"'
    );

    const stats = {
      totalUsers: userCount[0]?.count || 0,
      totalPayments: paymentCount[0]?.count || 0,
      totalRevenue: revenueResult[0]?.total || 0,
      totalMessages: messageCount[0]?.count || 0,
      premiumUsers: premiumUsersResult[0]?.count || 0
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    logError('Get stats error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;