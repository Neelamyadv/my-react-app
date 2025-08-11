// Razorpay payment integration
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number; // Amount in paise (multiply by 100)
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export class RazorpayService {
  private keyId: string;
  private isLoaded: boolean = false;

  constructor() {
    // Use demo key for development - replace with your actual key
    this.keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo_key';
    this.loadRazorpayScript();
  }

  private async loadRazorpayScript(): Promise<void> {
    if (this.isLoaded || window.Razorpay) {
      this.isLoaded = true;
      return;
    }

    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector('script[src*="checkout.razorpay.com"]')) {
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay script'));
      };
      document.head.appendChild(script);
    });
  }

  async createPayment(options: PaymentOptions): Promise<{ success: boolean; data?: PaymentResponse; error?: string }> {
    try {
      await this.loadRazorpayScript();

      // For demo purposes, always use demo payment
      return this.createDemoPayment(options);

      // Uncomment below for production with real Razorpay key
      /*
      if (this.keyId === 'rzp_test_demo_key') {
        return this.createDemoPayment(options);
      }

      return new Promise((resolve) => {
        const razorpayOptions = {
          key: this.keyId,
          amount: options.amount,
          currency: options.currency,
          name: options.name,
          description: options.description,
          order_id: options.order_id,
          prefill: options.prefill,
          theme: options.theme || { color: '#8b5cf6' },
          handler: (response: PaymentResponse) => {
            resolve({ success: true, data: response });
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
      */
    } catch (error) {
      console.error('Payment initialization error:', error);
      return { success: false, error: 'Failed to initialize payment' };
    }
  }

  private createDemoPayment(options: PaymentOptions): Promise<{ success: boolean; data?: PaymentResponse; error?: string }> {
    return new Promise((resolve) => {
      // Create demo payment modal
      const modal = this.createDemoModal(options);
      document.body.appendChild(modal);

      // Handle demo payment success
      const successBtn = modal.querySelector('.demo-success');
      const cancelBtn = modal.querySelector('.demo-cancel');
      const closeBtn = modal.querySelector('.demo-close');

      const cleanup = () => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      };

      successBtn?.addEventListener('click', () => {
        cleanup();
        resolve({
          success: true,
          data: {
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            razorpay_order_id: `order_demo_${Date.now()}`,
            razorpay_signature: `sig_demo_${Date.now()}`
          }
        });
      });

      cancelBtn?.addEventListener('click', () => {
        cleanup();
        resolve({ success: false, error: 'Payment cancelled by user' });
      });

      closeBtn?.addEventListener('click', () => {
        cleanup();
        resolve({ success: false, error: 'Payment cancelled by user' });
      });

      // Close on overlay click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          cleanup();
          resolve({ success: false, error: 'Payment cancelled by user' });
        }
      });
    });
  }

  private createDemoModal(options: PaymentOptions): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]';
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative animate-in fade-in duration-300">
        <button class="demo-close absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">Demo Payment Gateway</h2>
          <p class="text-gray-600">Simulate your payment experience</p>
        </div>

        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6 border border-blue-200">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-700 font-medium">Course:</span>
            <span class="font-semibold text-gray-900">${options.name}</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-700 font-medium">Description:</span>
            <span class="text-sm text-gray-700">${options.description}</span>
          </div>
          <div class="flex justify-between items-center pt-2 border-t border-blue-200">
            <span class="text-gray-700 font-medium">Amount:</span>
            <span class="text-2xl font-bold text-violet-600">₹${(options.amount / 100).toFixed(0)}</span>
          </div>
        </div>

        <div class="space-y-3">
          <button class="demo-success w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Complete Payment Successfully
          </button>
          <button class="demo-cancel w-full border-2 border-red-300 text-red-600 py-3 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancel Payment
          </button>
        </div>

        <div class="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p class="text-sm font-medium text-yellow-800">Demo Mode Active</p>
              <p class="text-xs text-yellow-700 mt-1">This is a demonstration. No real payment will be processed.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  // Utility method to format amount for Razorpay (convert to paise)
  static formatAmount(amount: number): number {
    return Math.round(amount * 100);
  }

  // Utility method to format amount for display
  static formatDisplayAmount(amount: number): string {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}

export const razorpayService = new RazorpayService();

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