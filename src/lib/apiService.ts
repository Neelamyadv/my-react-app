// ========================================
// 🌐 API SERVICE LAYER
// ========================================
// This service layer handles all API calls with placeholder endpoints
// When backend is ready, just replace the mock implementations with real API calls

import { API_CONFIG, API_ENDPOINTS, getApiConfig } from './apiConfig';
import { logError, logInfo } from './logger';

// ========================================
// 🔧 API CLIENT CONFIGURATION
// ========================================
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retries: number;

  constructor() {
    const config = getApiConfig();
    this.baseURL = config.BACKEND.BASE_URL;
    this.timeout = config.BACKEND.TIMEOUT;
    this.retries = config.BACKEND.MAX_RETRIES;
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    };

    const requestOptions = { ...defaultOptions, ...options };

    try {
      logInfo('API Request', { url, method: requestOptions.method || 'GET' });
      
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      logInfo('API Response', { url, status: response.status });
      
      return data;
    } catch (error) {
      logError('API Request Failed', { url, error, retryCount });
      
      // Retry logic
      if (retryCount < this.retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.request<T>(endpoint, options, retryCount + 1);
      }
      
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  // POST request
  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

// ========================================
// 🔐 AUTHENTICATION API SERVICE
// ========================================
export class AuthApiService {
  private client = new ApiClient();

  // Sign up new user
  async signup(userData: {
    email: string;
    password: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    phone: string;
  }) {
    // TODO: Replace with real API call when backend is ready
    // return this.client.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: 'user_' + Date.now(),
            ...userData,
            created_at: new Date().toISOString(),
          },
          message: 'User registered successfully',
        });
      }, 1000);
    });
  }

  // Sign in user
  async login(credentials: { email: string; password: string }) {
    // TODO: Replace with real API call when backend is ready
    // return this.client.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: 'user_123',
            email: credentials.email,
            first_name: 'Demo',
            last_name: 'User',
            phone: '1234567890',
          },
          token: 'mock_jwt_token_' + Date.now(),
          message: 'Login successful',
        });
      }, 1000);
    });
  }

  // Sign out user
  async logout() {
    // TODO: Replace with real API call when backend is ready
    // return this.client.post(API_ENDPOINTS.AUTH.LOGOUT);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Logout successful' });
      }, 500);
    });
  }

  // Forgot password
  async forgotPassword(email: string) {
    // TODO: Replace with real API call when backend is ready
    // return this.client.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Password reset email sent successfully',
        });
      }, 1000);
    });
  }

  // Reset password
  async resetPassword(token: string, newPassword: string) {
    // TODO: Replace with real API call when backend is ready
    // return this.client.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Password reset successfully',
        });
      }, 1000);
    });
  }

  // Google OAuth
  async googleAuth(code: string) {
    // TODO: Replace with real API call when backend is ready
    // return this.client.post(API_ENDPOINTS.AUTH.GOOGLE_AUTH, { code });
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: 'google_user_123',
            email: 'user@gmail.com',
            first_name: 'Google',
            last_name: 'User',
            phone: '1234567890',
          },
          token: 'mock_google_jwt_token_' + Date.now(),
          message: 'Google authentication successful',
        });
      }, 1000);
    });
  }
}

// ========================================
// 👥 USER API SERVICE
// ========================================
export class UserApiService {
  private client = new ApiClient();

  // Get user profile
  async getProfile() {
    // TODO: Replace with real API call when backend is ready
    // return this.client.get(API_ENDPOINTS.USERS.PROFILE);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'user_123',
          email: 'demo@zyntiq.in',
          first_name: 'Demo',
          last_name: 'User',
          phone: '1234567890',
          created_at: '2024-01-01T00:00:00Z',
        });
      }, 500);
    });
  }

  // Update user profile
  async updateProfile(profileData: any) {
    // TODO: Replace with real API call when backend is ready
    // return this.client.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: { ...profileData, updated_at: new Date().toISOString() },
          message: 'Profile updated successfully',
        });
      }, 1000);
    });
  }

  // Get user enrollments
  async getEnrollments() {
    // TODO: Replace with real API call when backend is ready
    // return this.client.get(API_ENDPOINTS.USERS.ENROLLMENTS);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'enrollment_1',
            course_id: 'web-development',
            course_name: 'Web Development',
            enrolled_at: '2024-01-15T00:00:00Z',
            progress: 75,
            status: 'active',
          },
          {
            id: 'enrollment_2',
            course_id: 'javascript',
            course_name: 'JavaScript Programming',
            enrolled_at: '2024-01-20T00:00:00Z',
            progress: 30,
            status: 'active',
          },
        ]);
      }, 500);
    });
  }

  // Get user certificates
  async getCertificates() {
    // TODO: Replace with real API call when backend is ready
    // return this.client.get(API_ENDPOINTS.USERS.CERTIFICATES);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'cert_1',
            course_name: 'Web Development',
            issued_at: '2024-02-01T00:00:00Z',
            certificate_url: '/certificates/web-dev-cert.pdf',
          },
        ]);
      }, 500);
    });
  }
}

// ========================================
// 📚 COURSE API SERVICE
// ========================================
export class CourseApiService {
  private client = new ApiClient();

  // Get all courses
  async getCourses() {
    // TODO: Replace with real API call when backend is ready
    // return this.client.get(API_ENDPOINTS.COURSES.LIST);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'web-development',
            title: 'Web Development',
            description: 'Learn web development from scratch',
            price: 599,
            originalPrice: 2450,
            image: '/WebD.png',
            lectures: '100+ Lectures',
            hours: '4+ Hours',
            level: 'beginner',
            category: 'Programming',
          },
          {
            id: 'javascript',
            title: 'JavaScript Programming',
            description: 'Master JavaScript programming',
            price: 599,
            originalPrice: 2450,
            image: '/JS.png',
            lectures: '20+ Lectures',
            hours: '4+ Hours',
            level: 'intermediate',
            category: 'Programming',
          },
        ]);
      }, 500);
    });
  }

  // Get course details
  async getCourseDetails(courseId: string) {
    // TODO: Replace with real API call when backend is ready
    // return this.client.get(API_ENDPOINTS.COURSES.DETAIL.replace(':id', courseId));
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: courseId,
          title: 'Web Development',
          description: 'Learn web development from scratch',
          price: 599,
          originalPrice: 2450,
          image: '/WebD.png',
          lectures: '100+ Lectures',
          hours: '4+ Hours',
          level: 'beginner',
          category: 'Programming',
          content: [
            {
              id: 'lesson_1',
              title: 'Introduction to HTML',
              type: 'video',
              duration: 1800,
              url: 'https://example.com/video1.mp4',
            },
            {
              id: 'lesson_2',
              title: 'CSS Fundamentals',
              type: 'video',
              duration: 2400,
              url: 'https://example.com/video2.mp4',
            },
          ],
        });
      }, 500);
    });
  }

  // Enroll in course
  async enrollInCourse(courseId: string) {
    // TODO: Replace with real API call when backend is ready
    // return this.client.post(API_ENDPOINTS.COURSES.ENROLL.replace(':id', courseId));
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          enrollment: {
            id: 'enrollment_' + Date.now(),
            course_id: courseId,
            enrolled_at: new Date().toISOString(),
            progress: 0,
            status: 'active',
          },
          message: 'Successfully enrolled in course',
        });
      }, 1000);
    });
  }

  // Update course progress
  async updateProgress(courseId: string, progress: number) {
    // TODO: Replace with real API call when backend is ready
    // return this.client.put(API_ENDPOINTS.COURSES.PROGRESS.replace(':id', courseId), { progress });
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          progress,
          message: 'Progress updated successfully',
        });
      }, 500);
    });
  }
}

// ========================================
// 💳 PAYMENT API SERVICE
// ========================================
export class PaymentApiService {
  private client = new ApiClient();

  // Create payment order
  async createOrder(paymentData: {
    amount: number;
    currency: string;
    description: string;
    customerEmail: string;
    customerName: string;
  }) {
    // TODO: Replace with real API call when backend is ready
    // return this.client.post(API_ENDPOINTS.PAYMENTS.CREATE_ORDER, paymentData);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          order: {
            id: 'order_' + Date.now(),
            amount: paymentData.amount,
            currency: paymentData.currency,
            description: paymentData.description,
            status: 'created',
            created_at: new Date().toISOString(),
          },
          payment_options: {
            key: API_CONFIG.RAZORPAY.KEY_ID,
            amount: paymentData.amount * 100, // Razorpay expects amount in paise
            currency: paymentData.currency,
            name: 'Zyntiq',
            description: paymentData.description,
            prefill: {
              name: paymentData.customerName,
              email: paymentData.customerEmail,
            },
            theme: {
              color: '#8b5cf6',
            },
          },
        });
      }, 1000);
    });
  }

  // Verify payment
  async verifyPayment(paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) {
    // TODO: Replace with real API call when backend is ready
    // return this.client.post(API_ENDPOINTS.PAYMENTS.VERIFY, paymentData);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          payment: {
            id: paymentData.razorpay_payment_id,
            order_id: paymentData.razorpay_order_id,
            status: 'captured',
            amount: 59900,
            currency: 'INR',
            captured_at: new Date().toISOString(),
          },
          message: 'Payment verified successfully',
        });
      }, 1000);
    });
  }

  // Get payment history
  async getPaymentHistory() {
    // TODO: Replace with real API call when backend is ready
    // return this.client.get(API_ENDPOINTS.PAYMENTS.HISTORY);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'payment_1',
            amount: 599,
            currency: 'INR',
            status: 'completed',
            created_at: '2024-01-15T00:00:00Z',
            description: 'Web Development Course',
          },
          {
            id: 'payment_2',
            amount: 999,
            currency: 'INR',
            status: 'completed',
            created_at: '2024-01-20T00:00:00Z',
            description: 'Premium Pass',
          },
        ]);
      }, 500);
    });
  }
}

// ========================================
// 👨‍💼 ADMIN API SERVICE
// ========================================
export class AdminApiService {
  private client = new ApiClient();

  // Get admin dashboard stats
  async getDashboardStats() {
    // TODO: Replace with real API call when backend is ready
    // return this.client.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalUsers: 1250,
          totalEnrollments: 3400,
          totalRevenue: 1250000,
          totalMessages: 89,
          premiumUsers: 450,
          courseCompletions: 1200,
        });
      }, 500);
    });
  }

  // Get all users
  async getUsers() {
    // TODO: Replace with real API call when backend is ready
    // return this.client.get(API_ENDPOINTS.ADMIN.USERS);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'user_1',
            email: 'user1@example.com',
            first_name: 'John',
            last_name: 'Doe',
            phone: '1234567890',
            created_at: '2024-01-01T00:00:00Z',
            status: 'active',
          },
          {
            id: 'user_2',
            email: 'user2@example.com',
            first_name: 'Jane',
            last_name: 'Smith',
            phone: '0987654321',
            created_at: '2024-01-02T00:00:00Z',
            status: 'active',
          },
        ]);
      }, 500);
    });
  }

  // Get all enrollments
  async getEnrollments() {
    // TODO: Replace with real API call when backend is ready
    // return this.client.get(API_ENDPOINTS.ADMIN.ENROLLMENTS);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'enrollment_1',
            user_id: 'user_1',
            course_id: 'web-development',
            course_name: 'Web Development',
            enrolled_at: '2024-01-15T00:00:00Z',
            progress: 75,
            status: 'active',
            amount_paid: 599,
          },
        ]);
      }, 500);
    });
  }
}

// ========================================
// 📧 CONTACT API SERVICE
// ========================================
export class ContactApiService {
  private client = new ApiClient();

  // Send contact message
  async sendMessage(messageData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) {
    // TODO: Replace with real API call when backend is ready
    // return this.client.post(API_ENDPOINTS.SUPPORT.CONTACT, messageData);
    
    // Mock implementation for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Message sent successfully',
          id: 'msg_' + Date.now(),
        });
      }, 1000);
    });
  }
}

// ========================================
// 🎯 MAIN API SERVICE EXPORT
// ========================================
export const apiService = {
  auth: new AuthApiService(),
  user: new UserApiService(),
  course: new CourseApiService(),
  payment: new PaymentApiService(),
  admin: new AdminApiService(),
  contact: new ContactApiService(),
};

export default apiService;