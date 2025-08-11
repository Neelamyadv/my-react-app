// API client for communicating with the backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}
interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}
interface AuthResponse {
  user: User;
  token: string;
}
interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}
interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  created_at: number;
}
class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  // Authentication methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data!;
  }
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data!;
  }
  async getProfile(): Promise<User> {
    const response = await this.request<User>('/auth/profile');
    return response.data!;
  }
  async updateProfile(updates: { name?: string }): Promise<void> {
    await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
  async changePassword(passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
  }
  // Payment methods
  async createOrder(orderData: {
    amount: number;
    currency?: string;
    receipt?: string;
    notes?: any;
  }): Promise<PaymentOrder> {
    const response = await this.request<PaymentOrder>('/payments/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response.data!;
  }
  async verifyPayment(paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }): Promise<Payment> {
    const response = await this.request<Payment>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response.data!;
  }
  async getPaymentHistory(): Promise<Payment[]> {
    const response = await this.request<Payment[]>('/payments/history');
    return response.data!;
  }
  async getPaymentDetails(paymentId: string): Promise<Payment> {
    const response = await this.request<Payment>(`/payments/${paymentId}`);
    return response.data!;
  }
  // Contact methods
  async submitContactMessage(messageData: {
    name: string;
    email: string;
    message: string;
  }): Promise<{ messageId: number }> {
    const response = await this.request<{ messageId: number }>('/contact/submit', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
    return response.data!;
  }
  // Utility methods
  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
  isAuthenticated(): boolean {
    return !!this.token;
  }
  getToken(): string | null {
    return this.token;
  }
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);
// Export types for use in components
export type {
  ApiResponse,
  User,
  AuthResponse,
  PaymentOrder,
  Payment,
};