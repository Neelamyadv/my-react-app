// ========================================
// 🔑 API CONFIGURATION & PLACEHOLDERS
// ========================================
// This file contains all API keys and configuration placeholders
// When going live, simply replace the placeholder values with real API keys

export const API_CONFIG = {
  // ========================================
  // 🌐 BACKEND SERVER CONFIGURATION
  // ========================================
  BACKEND: {
    // Replace with your actual backend server URL
    BASE_URL: import.meta.env.VITE_BACKEND_URL || 'https://your-backend-server.com/api',
    
    // API version
    VERSION: 'v1',
    
    // Timeout settings
    TIMEOUT: 30000, // 30 seconds
    
    // Retry settings
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
  },

  // ========================================
  // 💳 PAYMENT GATEWAY (RAZORPAY)
  // ========================================
  RAZORPAY: {
    // Replace with your actual Razorpay API keys
    KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY_ID',
    KEY_SECRET: import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'YOUR_TEST_KEY_SECRET',
    
    // Production keys (replace when going live)
    PRODUCTION_KEY_ID: import.meta.env.VITE_RAZORPAY_PRODUCTION_KEY_ID || 'rzp_live_YOUR_LIVE_KEY_ID',
    PRODUCTION_KEY_SECRET: import.meta.env.VITE_RAZORPAY_PRODUCTION_KEY_SECRET || 'YOUR_LIVE_KEY_SECRET',
    
    // Webhook secret (replace with actual webhook secret)
    WEBHOOK_SECRET: import.meta.env.VITE_RAZORPAY_WEBHOOK_SECRET || 'YOUR_WEBHOOK_SECRET',
    
    // Currency and region settings
    CURRENCY: 'INR',
    COUNTRY: 'IN',
  },

  // ========================================
  // 🗄️ DATABASE (SUPABASE)
  // ========================================
  SUPABASE: {
    // Replace with your actual Supabase credentials
    URL: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
    SERVICE_ROLE_KEY: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key',
    
    // Database settings
    SCHEMA: 'public',
    TABLES: {
      USERS: 'users',
      COURSES: 'courses',
      ENROLLMENTS: 'enrollments',
      PAYMENTS: 'payments',
      CONTENT: 'content',
      CERTIFICATES: 'certificates',
      CONTACT_MESSAGES: 'contact_messages',
    },
  },

  // ========================================
  // 📧 EMAIL SERVICE (SENDGRID/RESEND)
  // ========================================
  EMAIL: {
    // SendGrid configuration
    SENDGRID_API_KEY: import.meta.env.VITE_SENDGRID_API_KEY || 'YOUR_SENDGRID_API_KEY',
    SENDGRID_FROM_EMAIL: import.meta.env.VITE_SENDGRID_FROM_EMAIL || 'noreply@zyntiq.in',
    SENDGRID_FROM_NAME: import.meta.env.VITE_SENDGRID_FROM_NAME || 'Zyntiq Team',
    
    // Resend configuration (alternative)
    RESEND_API_KEY: import.meta.env.VITE_RESEND_API_KEY || 'YOUR_RESEND_API_KEY',
    RESEND_FROM_EMAIL: import.meta.env.VITE_RESEND_FROM_EMAIL || 'noreply@zyntiq.in',
    
    // Email templates
    TEMPLATES: {
      WELCOME: 'd-welcome-template-id',
      COURSE_ENROLLMENT: 'd-enrollment-template-id',
      PAYMENT_CONFIRMATION: 'd-payment-template-id',
      PASSWORD_RESET: 'd-reset-template-id',
      CERTIFICATE: 'd-certificate-template-id',
    },
  },

  // ========================================
  // 📱 SMS SERVICE (TWILIO/MSG91)
  // ========================================
  SMS: {
    // Twilio configuration
    TWILIO_ACCOUNT_SID: import.meta.env.VITE_TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_ACCOUNT_SID',
    TWILIO_AUTH_TOKEN: import.meta.env.VITE_TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_AUTH_TOKEN',
    TWILIO_PHONE_NUMBER: import.meta.env.VITE_TWILIO_PHONE_NUMBER || '+1234567890',
    
    // MSG91 configuration (India)
    MSG91_API_KEY: import.meta.env.VITE_MSG91_API_KEY || 'YOUR_MSG91_API_KEY',
    MSG91_TEMPLATE_ID: import.meta.env.VITE_MSG91_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
    MSG91_SENDER_ID: import.meta.env.VITE_MSG91_SENDER_ID || 'ZYNTIQ',
  },

  // ========================================
  // 🔐 AUTHENTICATION (GOOGLE OAUTH)
  // ========================================
  GOOGLE: {
    // Replace with your actual Google OAuth credentials
    CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
    
    // OAuth settings
    REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/google/callback',
    SCOPES: ['email', 'profile'],
  },

  // ========================================
  // 📊 ANALYTICS (GOOGLE ANALYTICS)
  // ========================================
  ANALYTICS: {
    // Google Analytics
    GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-YOUR_GA_ID',
    GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID || 'UA-YOUR_UA_ID',
    
    // Facebook Pixel
    FACEBOOK_PIXEL_ID: import.meta.env.VITE_FACEBOOK_PIXEL_ID || 'YOUR_PIXEL_ID',
    
    // Hotjar
    HOTJAR_ID: import.meta.env.VITE_HOTJAR_ID || 'YOUR_HOTJAR_ID',
  },

  // ========================================
  // ☁️ CLOUD STORAGE (AWS S3/CLOUDFLARE)
  // ========================================
  STORAGE: {
    // AWS S3 configuration
    AWS_ACCESS_KEY_ID: import.meta.env.VITE_AWS_ACCESS_KEY_ID || 'YOUR_AWS_ACCESS_KEY',
    AWS_SECRET_ACCESS_KEY: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || 'YOUR_AWS_SECRET_KEY',
    AWS_REGION: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
    AWS_S3_BUCKET: import.meta.env.VITE_AWS_S3_BUCKET || 'your-zyntiq-bucket',
    
    // Cloudflare R2 (alternative)
    CLOUDFLARE_ACCOUNT_ID: import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || 'YOUR_ACCOUNT_ID',
    CLOUDFLARE_ACCESS_KEY_ID: import.meta.env.VITE_CLOUDFLARE_ACCESS_KEY_ID || 'YOUR_ACCESS_KEY',
    CLOUDFLARE_SECRET_ACCESS_KEY: import.meta.env.VITE_CLOUDFLARE_SECRET_ACCESS_KEY || 'YOUR_SECRET_KEY',
    CLOUDFLARE_BUCKET_NAME: import.meta.env.VITE_CLOUDFLARE_BUCKET_NAME || 'your-bucket-name',
    
    // CDN URLs
    CDN_URL: import.meta.env.VITE_CDN_URL || 'https://your-cdn.com',
    IMAGE_CDN_URL: import.meta.env.VITE_IMAGE_CDN_URL || 'https://images.your-cdn.com',
    VIDEO_CDN_URL: import.meta.env.VITE_VIDEO_CDN_URL || 'https://videos.your-cdn.com',
  },

  // ========================================
  // 🎥 VIDEO STREAMING (VIMEO/YOUTUBE)
  // ========================================
  VIDEO: {
    // Vimeo API
    VIMEO_CLIENT_ID: import.meta.env.VITE_VIMEO_CLIENT_ID || 'YOUR_VIMEO_CLIENT_ID',
    VIMEO_CLIENT_SECRET: import.meta.env.VITE_VIMEO_CLIENT_SECRET || 'YOUR_VIMEO_CLIENT_SECRET',
    VIMEO_ACCESS_TOKEN: import.meta.env.VITE_VIMEO_ACCESS_TOKEN || 'YOUR_VIMEO_ACCESS_TOKEN',
    
    // YouTube API
    YOUTUBE_API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY',
    YOUTUBE_CHANNEL_ID: import.meta.env.VITE_YOUTUBE_CHANNEL_ID || 'YOUR_CHANNEL_ID',
  },

  // ========================================
  // 💬 CHAT SUPPORT (INTERCOM/CRISP)
  // ========================================
  CHAT: {
    // Intercom
    INTERCOM_APP_ID: import.meta.env.VITE_INTERCOM_APP_ID || 'YOUR_INTERCOM_APP_ID',
    
    // Crisp
    CRISP_WEBSITE_ID: import.meta.env.VITE_CRISP_WEBSITE_ID || 'YOUR_CRISP_WEBSITE_ID',
    
    // WhatsApp Business API
    WHATSAPP_API_TOKEN: import.meta.env.VITE_WHATSAPP_API_TOKEN || 'YOUR_WHATSAPP_TOKEN',
    WHATSAPP_PHONE_NUMBER_ID: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || 'YOUR_PHONE_NUMBER_ID',
  },

  // ========================================
  // 🔍 SEO & MONITORING
  // ========================================
  MONITORING: {
    // Sentry for error tracking
    SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || 'YOUR_SENTRY_DSN',
    
    // LogRocket for session replay
    LOGROCKET_APP_ID: import.meta.env.VITE_LOGROCKET_APP_ID || 'YOUR_LOGROCKET_APP_ID',
    
    // Uptime monitoring
    UPTIME_ROBOT_API_KEY: import.meta.env.VITE_UPTIME_ROBOT_API_KEY || 'YOUR_UPTIME_ROBOT_KEY',
  },

  // ========================================
  // 🎨 DESIGN & BRANDING
  // ========================================
  BRANDING: {
    // Company information
    COMPANY_NAME: 'Zyntiq',
    COMPANY_EMAIL: 'contact@zyntiq.in',
    COMPANY_PHONE: '+91 9401966440',
    COMPANY_ADDRESS: 'Your Company Address',
    
    // Social media
    FACEBOOK_URL: 'https://facebook.com/zyntiq',
    INSTAGRAM_URL: 'https://instagram.com/zyntiq_official',
    LINKEDIN_URL: 'https://linkedin.com/company/zyntiq',
    TWITTER_URL: 'https://twitter.com/zyntiq',
    YOUTUBE_URL: 'https://youtube.com/@zyntiq',
  },

  // ========================================
  // 🔧 DEVELOPMENT & TESTING
  // ========================================
  DEVELOPMENT: {
    // Development mode
    IS_DEVELOPMENT: import.meta.env.DEV,
    IS_PRODUCTION: import.meta.env.PROD,
    
    // Feature flags
    ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    ENABLE_CHAT: import.meta.env.VITE_ENABLE_CHAT === 'true',
    ENABLE_SMS: import.meta.env.VITE_ENABLE_SMS === 'true',
    ENABLE_EMAIL: import.meta.env.VITE_ENABLE_EMAIL === 'true',
    
    // Debug mode
    DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
    LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  },
};

// ========================================
// 🔒 SECURITY CONFIGURATION
// ========================================
export const SECURITY_CONFIG = {
  // JWT settings
  JWT_SECRET: import.meta.env.VITE_JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: '7d',
  JWT_REFRESH_EXPIRES_IN: '30d',
  
  // Password settings
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SYMBOLS: true,
  
  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  
  // CORS settings
  CORS_ORIGIN: import.meta.env.VITE_CORS_ORIGIN || 'http://localhost:3001',
  CORS_CREDENTIALS: true,
};

// ========================================
// 📋 API ENDPOINTS CONFIGURATION
// ========================================
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    GOOGLE_AUTH: '/auth/google',
  },
  
  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    ENROLLMENTS: '/users/enrollments',
    CERTIFICATES: '/users/certificates',
    PROGRESS: '/users/progress',
  },
  
  // Courses
  COURSES: {
    LIST: '/courses',
    DETAIL: '/courses/:id',
    CONTENT: '/courses/:id/content',
    ENROLL: '/courses/:id/enroll',
    PROGRESS: '/courses/:id/progress',
    COMPLETE: '/courses/:id/complete',
  },
  
  // Payments
  PAYMENTS: {
    CREATE_ORDER: '/payments/create-order',
    VERIFY: '/payments/verify',
    WEBHOOK: '/payments/webhook',
    HISTORY: '/payments/history',
    REFUND: '/payments/refund',
  },
  
  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    COURSES: '/admin/courses',
    ENROLLMENTS: '/admin/enrollments',
    PAYMENTS: '/admin/payments',
    ANALYTICS: '/admin/analytics',
  },
  
  // Content
  CONTENT: {
    UPLOAD: '/content/upload',
    STREAM: '/content/stream/:id',
    DOWNLOAD: '/content/download/:id',
    THUMBNAIL: '/content/thumbnail/:id',
  },
  
  // Support
  SUPPORT: {
    CONTACT: '/support/contact',
    TICKETS: '/support/tickets',
    FAQ: '/support/faq',
    LIVE_CHAT: '/support/chat',
  },
};

// ========================================
// 🎯 ENVIRONMENT-SPECIFIC CONFIGURATION
// ========================================
export const getApiConfig = () => {
  const isProduction = import.meta.env.PROD;
  
  return {
    ...API_CONFIG,
    RAZORPAY: {
      ...API_CONFIG.RAZORPAY,
      KEY_ID: isProduction 
        ? API_CONFIG.RAZORPAY.PRODUCTION_KEY_ID 
        : API_CONFIG.RAZORPAY.KEY_ID,
      KEY_SECRET: isProduction 
        ? API_CONFIG.RAZORPAY.PRODUCTION_KEY_SECRET 
        : API_CONFIG.RAZORPAY.KEY_SECRET,
    },
    BACKEND: {
      ...API_CONFIG.BACKEND,
      BASE_URL: isProduction 
        ? 'https://api.zyntiq.in/api' 
        : API_CONFIG.BACKEND.BASE_URL,
    },
  };
};

export default API_CONFIG;