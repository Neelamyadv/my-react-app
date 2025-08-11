// Razorpay payment integration
import { apiClient } from './api';
import { logInfo, logError } from './logger';
interface PaymentOptions {
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
}
interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}
interface OrderCreateRequest {
  amount: number;
  currency: string;
  receipt: string;
  notes: {
    description: string;
    name: string;
  };
}
interface OrderCreateResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}
class RazorpayService {
  private keyId: string;
  private secretKey: string;
  private isProduction: boolean;
  constructor() {
    this.keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    this.secretKey = import.meta.env.VITE_RAZORPAY_SECRET_KEY || '';
    this.isProduction = this.isProductionMode();
  }
  private isProductionMode(): boolean {
    return import.meta.env.NODE_ENV === 'production' && 
           this.keyId.startsWith('rzp_live_') &&
           this.secretKey.length > 0;
  }
  private async loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.head.appendChild(script);
    });
  }
  async createOrder(orderData: OrderCreateRequest): Promise<{ success: boolean; data?: OrderCreateResponse; error?: string }> {
    try {
      if (this.isProduction) {
        // Use backend API for production
        const order = await apiClient.createOrder({
          amount: orderData.amount,
          currency: orderData.currency,
          receipt: orderData.receipt,
          notes: orderData.notes
        });
        return { success: true, data: order };
      } else {
        // Mock order for development
        const mockOrder: OrderCreateResponse = {
          id: `order_${Date.now()}`,
          amount: orderData.amount * 100,
          currency: orderData.currency,
          receipt: orderData.receipt,
          status: 'created',
          created_at: Date.now()
        };
        return { success: true, data: mockOrder };
      }
    } catch (error) {
      logError('Order creation failed', { error: error.message, orderData });
      return { success: false, error: 'Failed to create order' };
    }
  }
  async verifyPaymentSignature(
    paymentId: string,
    orderId: string,
    signature: string
  ): Promise<boolean> {
    try {
      if (this.isProduction) {
        // Use backend API for production
        await apiClient.verifyPayment({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature
        });
        return true;
      } else {
        // Mock verification for development
        return true;
      }
    } catch (error) {
      logError('Payment verification failed', { 
        error: error.message, 
        paymentId, 
        orderId 
      });
      return false;
    }
  }
  async createPayment(options: PaymentOptions): Promise<{ success: boolean; data?: PaymentResponse; error?: string }> {
    try {
      await this.loadRazorpayScript();
      // Create order first
      const orderData: OrderCreateRequest = {
        amount: options.amount,
        currency: options.currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          description: options.description,
          name: options.name
        }
      };
      const orderResult = await this.createOrder(orderData);
      if (!orderResult.success || !orderResult.data) {
        return { success: false, error: 'Failed to create order' };
      }
      // Use demo payment for development
      if (!this.isProduction) {
        return this.createDemoPayment(options, orderResult.data.id);
      }
      // Production payment flow
      return new Promise((resolve) => {
        const razorpayOptions = {
          key: this.keyId,
          amount: options.amount * 100, // Convert to paise
          currency: options.currency,
          name: options.name,
          description: options.description,
          order_id: orderResult.data!.id,
          prefill: options.prefill,
          theme: options.theme || { color: '#8b5cf6' },
          handler: async (response: PaymentResponse) => {
            // Verify payment signature
            const isVerified = await this.verifyPaymentSignature(
              response.razorpay_payment_id,
              response.razorpay_order_id!,
              response.razorpay_signature!
            );
            if (isVerified) {
              resolve({ success: true, data: response });
            } else {
              resolve({ success: false, error: 'Payment verification failed' });
            }
          },
          modal: {
            ondismiss: () => {
              resolve({ success: false, error: 'Payment cancelled by user' });
            }
          }
        };
        const rzp = new window.Razorpay(razorpayOptions);
        rzp.open();
      });
    } catch (error) {
      logError('Payment initialization error', { error: error.message, options });
      return { success: false, error: 'Failed to initialize payment' };
    }
  }
  private createDemoPayment(options: PaymentOptions, orderId: string): Promise<{ success: boolean; data?: PaymentResponse; error?: string }> {
    return new Promise((resolve) => {
      // Create demo modal
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div class="text-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Demo Payment</h3>
            <p class="text-sm text-gray-600">This is a demo payment for testing purposes</p>
          </div>
          <div class="space-y-4 mb-6">
            <div class="flex justify-between">
              <span class="text-gray-600">Amount:</span>
              <span class="font-semibold text-gray-900">₹${options.amount}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Order ID:</span>
              <span class="font-semibold text-gray-900">${escapeHTML(orderId)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Description:</span>
              <span class="font-semibold text-gray-900">${escapeHTML(options.description)}</span>
            </div>
          </div>
          <div class="flex space-x-3">
            <button id="demo-success" class="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors">
              Simulate Success
            </button>
            <button id="demo-fail" class="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors">
              Simulate Failure
            </button>
          </div>
          <button id="demo-cancel" class="w-full mt-3 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors">
            Cancel
          </button>
        </div>
      `;
      document.body.appendChild(modal);
      // Handle demo payment events
      modal.querySelector('#demo-success')?.addEventListener('click', () => {
        const demoResponse: PaymentResponse = {
          razorpay_payment_id: `pay_${Date.now()}`,
          razorpay_order_id: orderId,
          razorpay_signature: 'demo_signature'
        };
        logInfo('Demo payment successful', { 
          paymentId: demoResponse.razorpay_payment_id,
          orderId: orderId,
          amount: options.amount 
        });
        document.body.removeChild(modal);
        resolve({ success: true, data: demoResponse });
      });
      modal.querySelector('#demo-fail')?.addEventListener('click', () => {
        logInfo('Demo payment failed', { orderId: orderId });
        document.body.removeChild(modal);
        resolve({ success: false, error: 'Payment failed' });
      });
      modal.querySelector('#demo-cancel')?.addEventListener('click', () => {
        logInfo('Demo payment cancelled', { orderId: orderId });
        document.body.removeChild(modal);
        resolve({ success: false, error: 'Payment cancelled by user' });
      });
    });
  }
}
// Helper function to escape HTML
function escapeHTML(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
// Create and export service instance
export const razorpayService = new RazorpayService();
// Export types
export type {
  PaymentOptions,
  PaymentResponse,
  OrderCreateRequest,
  OrderCreateResponse
};
// Course and Premium Pass pricing
export const PRICING = {
  COURSE: {
    price: 599,
    originalPrice: 2450,
    discount: 75
  },
  PREMIUM_PASS: {
    price: 999,
    originalPrice: 4999,
    discount: 80
  }
} as const;
// Payment types
export enum PaymentType {
  COURSE = 'course',
  PREMIUM_PASS = 'premium_pass'
}
export interface PaymentData {
  type: PaymentType;
  itemId?: string;
  itemName: string;
  amount: number;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
}