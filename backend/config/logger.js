const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'zyntiq-backend' },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If we're not in production, log to console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Create a stream object for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// Helper functions for different log levels
const logError = (message, meta = {}) => {
  logger.error(message, meta);
};

const logWarn = (message, meta = {}) => {
  logger.warn(message, meta);
};

const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

const logDebug = (message, meta = {}) => {
  logger.debug(message, meta);
};

// Payment-specific logging
const logPayment = (paymentId, action, details = {}) => {
  logger.info('Payment Event', {
    paymentId,
    action,
    ...details,
    timestamp: new Date().toISOString()
  });
};

const logPaymentError = (paymentId, error, details = {}) => {
  logger.error('Payment Error', {
    paymentId,
    error: error.message,
    stack: error.stack,
    ...details,
    timestamp: new Date().toISOString()
  });
};

// User activity logging
const logUserActivity = (userId, action, details = {}) => {
  logger.info('User Activity', {
    userId,
    action,
    ...details,
    timestamp: new Date().toISOString()
  });
};

// Security event logging
const logSecurityEvent = (event, details = {}) => {
  logger.warn('Security Event', {
    event,
    ...details,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  logger,
  logError,
  logWarn,
  logInfo,
  logDebug,
  logPayment,
  logPaymentError,
  logUserActivity,
  logSecurityEvent
};