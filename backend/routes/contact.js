const express = require('express');
const { body, validationResult } = require('express-validator');
const { logError, logInfo } = require('../config/logger');
const db = require('../config/database');

const router = express.Router();

// Validation middleware
const validateContactMessage = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

// Submit contact message
router.post('/submit', validateContactMessage, async (req, res) => {
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

    const { name, email, message } = req.body;

    // Sanitize inputs
    const sanitizedName = name.trim().replace(/[<>]/g, '');
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedMessage = message.trim().replace(/[<>]/g, '');

    // Store message in database
    const result = await db.run(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [sanitizedName, sanitizedEmail, sanitizedMessage]
    );

    const messageId = result.lastID || result.rows[0].id;

    logInfo('Contact message submitted', {
      messageId,
      name: sanitizedName,
      email: sanitizedEmail,
      ip: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Message submitted successfully',
      data: {
        messageId
      }
    });

  } catch (error) {
    logError('Contact message submission error', { 
      error: error.message, 
      stack: error.stack,
      ip: req.ip 
    });

    res.status(500).json({
      success: false,
      message: 'Failed to submit message'
    });
  }
});

// Get all contact messages (admin only - you can add admin middleware later)
router.get('/messages', async (req, res) => {
  try {
    const messages = await db.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: {
        messages: messages.map(msg => ({
          id: msg.id,
          name: msg.name,
          email: msg.email,
          message: msg.message,
          status: msg.status,
          created_at: msg.created_at
        }))
      }
    });

  } catch (error) {
    logError('Get contact messages error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// Update message status (admin only)
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

    logInfo('Contact message status updated', {
      messageId: id,
      status,
      ip: req.ip
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

module.exports = router;