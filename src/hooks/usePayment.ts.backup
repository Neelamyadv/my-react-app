import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { razorpayService, PRICING } from '../lib/razorpay';
import { apiClient } from '../lib/api';
import { logInfo, logError } from '../lib/logger';
import toast from 'react-hot-toast';

interface PaymentState {
  isLoading: boolean;
  error: string | null;
}

export const usePayment = () => {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isLoading: false,
    error: null,
  });
  const navigate = useNavigate();

  const initiatePayment = async (type: 'course' | 'premium') => {
    setPaymentState({ isLoading: true, error: null });

    try {
      // Check if user is authenticated
      if (!apiClient.isAuthenticated()) {
        setPaymentState({ isLoading: false, error: 'Please login to continue' });
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      const pricing = type === 'course' ? PRICING.COURSE : PRICING.PREMIUM_PASS;
      
      logInfo('Payment initiated', { 
        type, 
        amount: pricing.amount,
        userId: apiClient.getUser()?.id 
      });

      const result = await razorpayService.createPayment({
        amount: pricing.amount,
        currency: 'INR',
        name: 'Zyntiq Learning',
        description: pricing.description,
        prefill: {
          name: apiClient.getUser()?.name,
          email: apiClient.getUser()?.email,
        },
        theme: {
          color: '#8b5cf6',
        },
      });

      if (result.success && result.data) {
        logInfo('Payment successful', { 
          paymentId: result.data.razorpay_payment_id,
          type,
          amount: pricing.amount 
        });

        // Handle successful payment
        if (type === 'course') {
          // Enroll in course
          toast.success('Payment successful! You are now enrolled in the course.');
          navigate('/dashboard');
        } else {
          // Activate premium pass
          toast.success('Payment successful! Your premium pass is now active.');
          navigate('/dashboard');
        }

        // Dispatch custom event for enrollment update
        window.dispatchEvent(new CustomEvent('enrollmentUpdated', {
          detail: { type, status: 'active' }
        }));

      } else {
        const errorMessage = result.error || 'Payment failed';
        setPaymentState({ isLoading: false, error: errorMessage });
        logError('Payment failed', { 
          error: errorMessage, 
          type, 
          amount: pricing.amount 
        });
        toast.error(errorMessage);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setPaymentState({ isLoading: false, error: errorMessage });
      logError('Payment error', { 
        error: errorMessage, 
        type 
      });
      toast.error(errorMessage);
    }
  };

  const initiateCoursePayment = () => initiatePayment('course');
  const initiatePremiumPayment = () => initiatePayment('premium');

  return {
    ...paymentState,
    initiateCoursePayment,
    initiatePremiumPayment,
  };
};