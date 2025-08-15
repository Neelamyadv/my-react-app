// Admin Panel Password Configuration
// Change these passwords to secure your admin panels

export const ADMIN_PASSWORDS = {
  // Full Admin Panel Password (for complete admin access)
  ADMIN_PANEL: 'admin2024',
  
  // Access Panel Password (for HR team access)
  ACCESS_PANEL: 'hr2024',
  
  // Analytics Dashboard Password (for HR team analytics)
  ANALYTICS: 'hr2024'
} as const;

// Password requirements and security notes:
// - Use strong passwords with at least 8 characters
// - Include uppercase, lowercase, numbers, and symbols
// - Change passwords regularly
// - Don't share passwords in public repositories
// - Consider using environment variables for production

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SYMBOLS: false
};

// Function to validate password strength
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`);
  }
  
  if (PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (PASSWORD_REQUIREMENTS.REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (PASSWORD_REQUIREMENTS.REQUIRE_SYMBOLS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one symbol');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};