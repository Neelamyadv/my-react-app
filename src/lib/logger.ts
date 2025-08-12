// Browser-compatible logger for frontend
class BrowserLogger {
  private logLevel: string;
  private logToStorage: boolean;

  constructor() {
    this.logLevel = 'info';
    this.logToStorage = false;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }

  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private log(level: string, message: string, meta?: any): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, meta);
    
    // Log to console
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
        console.log(formattedMessage);
    }

    // Optionally store errors in localStorage
    if (this.logToStorage && level === 'error') {
      try {
        const errors = JSON.parse(localStorage.getItem('zyntiq_errors') || '[]');
        errors.push({
          timestamp: new Date().toISOString(),
          level,
          message,
          meta
        });
        // Keep only last 50 errors
        if (errors.length > 50) {
          errors.splice(0, errors.length - 50);
        }
        localStorage.setItem('zyntiq_errors', JSON.stringify(errors));
      } catch (e) {
        // Silently fail if localStorage is not available
      }
    }
  }

  error(message: string, meta?: any): void {
    this.log('error', message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log('warn', message, meta);
  }

  info(message: string, meta?: any): void {
    this.log('info', message, meta);
  }

  debug(message: string, meta?: any): void {
    this.log('debug', message, meta);
  }

  setLogLevel(level: string): void {
    this.logLevel = level;
  }

  setLogToStorage(enabled: boolean): void {
    this.logToStorage = enabled;
  }

  getErrors(): any[] {
    try {
      return JSON.parse(localStorage.getItem('zyntiq_errors') || '[]');
    } catch {
      return [];
    }
  }

  clearErrors(): void {
    try {
      localStorage.removeItem('zyntiq_errors');
    } catch {
      // Silently fail if localStorage is not available
    }
  }
}

// Create logger instance
const logger = new BrowserLogger();

// Export logger functions
export const logError = (message: string, meta?: any) => logger.error(message, meta);
export const logWarn = (message: string, meta?: any) => logger.warn(message, meta);
export const logInfo = (message: string, meta?: any): void => logger.info(message, meta);
export const logDebug = (message: string, meta?: any): void => logger.debug(message, meta);

// Export logger instance for advanced usage
export default logger;