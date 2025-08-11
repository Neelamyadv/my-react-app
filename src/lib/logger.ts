// Browser-compatible logger for the application
interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}
const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};
class BrowserLogger {
  private isProduction: boolean;
  private logLevel: string;
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.logLevel = process.env.VITE_LOG_LEVEL || 'info';
  }
  private shouldLog(level: string): boolean {
    if (this.isProduction && level === 'debug') {
      return false;
    }
    return true;
  }
  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
  }
  private log(level: string, message: string, meta?: any) {
    if (!this.shouldLog(level)) return;
    const formattedMessage = this.formatMessage(level, message, meta);
    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'debug':
        console.debug(formattedMessage);
        break;
      default:
    }
    // In production, you might want to send logs to a service
    if (this.isProduction && level === 'error') {
      this.sendToErrorService(message, meta);
    }
  }
  private sendToErrorService(message: string, meta?: any) {
    // This would typically send to an error tracking service like Sentry
    // For now, we'll just store in localStorage for debugging
    try {
      const errorLogs = JSON.parse(localStorage.getItem('zyntiq_error_logs') || '[]');
      errorLogs.push({
        timestamp: new Date().toISOString(),
        message,
        meta,
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      // Keep only last 100 errors
      if (errorLogs.length > 100) {
        errorLogs.splice(0, errorLogs.length - 100);
      }
      localStorage.setItem('zyntiq_error_logs', JSON.stringify(errorLogs));
    } catch (error) {
      // Silently fail if localStorage is not available
    }
  }
  error(message: string, meta?: any) {
    this.log(LOG_LEVELS.ERROR, message, meta);
  }
  warn(message: string, meta?: any) {
    this.log(LOG_LEVELS.WARN, message, meta);
  }
  info(message: string, meta?: any) {
    this.log(LOG_LEVELS.INFO, message, meta);
  }
  debug(message: string, meta?: any) {
    this.log(LOG_LEVELS.DEBUG, message, meta);
  }
  // Get error logs for debugging
  getErrorLogs(): any[] {
    try {
      return JSON.parse(localStorage.getItem('zyntiq_error_logs') || '[]');
    } catch {
      return [];
    }
  }
  // Clear error logs
  clearErrorLogs() {
    localStorage.removeItem('zyntiq_error_logs');
  }
}
const logger = new BrowserLogger();
// Export helper functions
export const logError = (message: string, meta?: any) => logger.error(message, meta);
export const logWarn = (message: string, meta?: any) => logger.warn(message, meta);
export const logInfo = (message: string, meta?: any) => logger.info(message, meta);
export const logDebug = (message: string, meta?: any) => logger.debug(message, meta);
export default logger;