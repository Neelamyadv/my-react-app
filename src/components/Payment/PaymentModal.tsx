import React, { useState } from 'react';
import { X, CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { razorpayService, PRICING, PaymentData } from '../../lib/razorpay';
import { useAuth } from '../../lib/auth';
import toast from 'react-hot-toast';
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: PaymentData;
  onSuccess?: (paymentResponse: any) => void;
}
const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  paymentData,
  onSuccess
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handlePayment = async () => {
    setLoading(true);
    try {
      // Validate user data
      if (!user) {
        toast.error('Please log in to continue with payment');
        setLoading(false);
        return;
      }
      // Ensure user has a phone number; otherwise, use an empty string.
      const userPhone = user.phone || '';
      const paymentOptions = {
        amount: paymentData.amount,
        currency: 'INR',
        name: paymentData.itemName,
        description: `Purchase of ${paymentData.itemName} from Zyntiq`,
        prefill: {
          name: paymentData.userName || `${user.first_name} ${user.last_name}`.trim() || 'User',
          email: paymentData.userEmail || user.email || '',
          contact: userPhone
        },
        theme: {
          color: '#8b5cf6'
        }
      };
      // We'll use a mock razorpayService for this example
      const result = await razorpayService.createPayment(paymentOptions);
      if (result.success && result.data) {
        toast.success('🎉 Payment successful! Welcome to Zyntiq!');
        onSuccess?.(result.data);
        onClose();
      } else {
        const errorMessage = result.error || 'Payment failed. Please try again.';
        toast.error(errorMessage);
        console.error('Payment failed:', result.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const getDiscountPercentage = () => {
    if (paymentData.type === 'course') {
      return PRICING.COURSE.discount;
    } else if (paymentData.type === 'premium_pass') {
      return PRICING.PREMIUM_PASS.discount;
    }
    return 0;
  };
  const getOriginalPrice = () => {
    if (paymentData.type === 'course') {
      return PRICING.COURSE.originalPrice;
    } else if (paymentData.type === 'premium_pass') {
      return PRICING.PREMIUM_PASS.originalPrice;
    }
    return paymentData.amount;
  };
  const getSavings = () => {
    return getOriginalPrice() - paymentData.amount;
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-6 text-white relative">
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Complete Payment</h2>
              <p className="text-white/90 text-sm">Secure payment with Razorpay</p>
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="p-6">
          {/* Demo Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Demo Payment Mode</p>
                <p className="text-xs text-blue-700 mt-1">
                  This is a demonstration. Click "Pay" to see the demo payment gateway.
                </p>
              </div>
            </div>
          </div>
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{paymentData.itemName}</p>
                  <p className="text-sm text-gray-600">
                    {paymentData.type === 'course' ? 'Individual Course Access' : 'Premium Pass - All Courses Access'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-violet-600">₹{paymentData.amount}</p>
                  {getOriginalPrice() > paymentData.amount && (
                    <p className="text-sm text-gray-400 line-through">₹{getOriginalPrice()}</p>
                  )}
                </div>
              </div>
              {getDiscountPercentage() > 0 && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-green-600 font-medium">
                    Discount ({getDiscountPercentage()}% OFF)
                  </span>
                  <span className="text-green-600 font-medium">-₹{getSavings()}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                <span className="font-bold text-gray-900">Total Amount</span>
                <span className="font-bold text-xl text-violet-600">₹{paymentData.amount}</span>
              </div>
            </div>
          </div>
          {/* Features */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">What you'll get:</h4>
            <div className="space-y-2">
              {paymentData.type === 'course' ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Lifetime access to course content</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Access to course materials & resources</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Access to 13+ In-Depth Courses</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Lifetime Access to all content</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Free access to all future courses</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Exclusive eBooks & resources</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Priority support & community access</span>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Security Badge */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Secured by Razorpay • 256-bit SSL encryption</span>
          </div>
          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ₹{paymentData.amount}
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 text-center mt-4">
            By proceeding, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};
export default PaymentModal;
