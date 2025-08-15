import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentData, PaymentType, PRICING } from '../lib/razorpay';
import { useAuth } from '../lib/auth';
import { localDB } from '../lib/database';
import toast from 'react-hot-toast';
import { logError, logInfo } from '../lib/logger';

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  [key: string]: unknown;
}

interface PaymentRequest {
  courseId: string;
  courseName: string;
  price: number;
  originalPrice: number;
  type: PaymentType;
}

export const usePayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentPaymentData, setCurrentPaymentData] = useState<PaymentData | null>(null);

  const initiateCoursePayment = (paymentRequest: PaymentRequest) => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please log in to make purchases');
      return;
    }

    const paymentData: PaymentData = {
      type: paymentRequest.type,
      itemId: paymentRequest.courseId,
      itemName: paymentRequest.courseName,
      amount: paymentRequest.price,
      userEmail: user.email,
      userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
      userPhone: user.phone
    };

    logInfo('Initiating payment', { 
      type: paymentRequest.type, 
      itemId: paymentRequest.courseId, 
      itemName: paymentRequest.courseName,
      amount: paymentRequest.price 
    });
    setCurrentPaymentData(paymentData);
    setIsPaymentModalOpen(true);
  };

  const initiatePremiumPassPayment = () => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please log in to purchase Premium Pass');
      return;
    }

    const paymentData: PaymentData = {
      type: PaymentType.PREMIUM_PASS,
      itemName: 'upLern Premium Pass',
      amount: PRICING.PREMIUM_PASS.price,
      userEmail: user.email,
      userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
      userPhone: user.phone
    };

    logInfo('Initiating premium pass payment');
    setCurrentPaymentData(paymentData);
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setCurrentPaymentData(null);
  };

  const handlePaymentSuccess = async (paymentResponse: RazorpayPaymentResponse) => {
    logInfo('Payment successful', { paymentId: paymentResponse.razorpay_payment_id });
    
    if (!user || !currentPaymentData) {
      toast.error('Payment processing error. Please contact support.');
      return;
    }

    try {
      // Handle different payment types
      if (currentPaymentData.type === PaymentType.COURSE) {
        // Regular course enrollment
        const { enrollment, error } = await localDB.createEnrollment({
          user_id: user.id,
          course_id: currentPaymentData.itemId,
          course_name: currentPaymentData.itemName,
          payment_id: paymentResponse.razorpay_payment_id,
          enrollment_type: 'course',
          amount_paid: currentPaymentData.amount
        });

        if (error) {
          logError('Failed to create enrollment', error);
          toast.error('Payment successful but enrollment failed. Please contact support.');
          return;
        }

        logInfo('Course enrollment created', { enrollmentId: enrollment?.id });
        toast.success(`🎉 Successfully enrolled in ${currentPaymentData.itemName}!`);
        
      } else if (currentPaymentData.type === PaymentType.PREMIUM_PASS) {
        // Premium pass enrollment
        const { enrollment, error } = await localDB.createEnrollment({
          user_id: user.id,
          course_id: 'premium-pass',
          course_name: 'upLern Premium Pass',
          payment_id: paymentResponse.razorpay_payment_id,
          enrollment_type: 'premium_pass',
          amount_paid: currentPaymentData.amount
        });

        if (error) {
          logError('Failed to create premium enrollment', error);
          toast.error('Payment successful but premium activation failed. Please contact support.');
          return;
        }

        logInfo('Premium pass enrollment created', { enrollmentId: enrollment?.id });
        toast.success('🚀 Premium Pass activated! You now have access to all courses!');
        
        // Close the payment modal
        closePaymentModal();
        
        // Trigger enrollment update event
        window.dispatchEvent(new CustomEvent('enrollmentUpdated', {
          detail: {
            type: currentPaymentData.type,
            courseId: currentPaymentData.itemId,
            courseName: currentPaymentData.itemName
          }
        }));
        
        // Redirect to courses page
        setTimeout(() => {
          navigate('/courses');
        }, 1500);
        
        return;
        
      } else if (currentPaymentData.type === PaymentType.EBOOK) {
        // eBook purchase
        const { enrollment, error } = await localDB.createEnrollment({
          user_id: user.id,
          course_id: currentPaymentData.itemId,
          course_name: currentPaymentData.itemName,
          payment_id: paymentResponse.razorpay_payment_id,
          enrollment_type: 'ebook',
          amount_paid: currentPaymentData.amount
        });

        if (error) {
          logError('Failed to create eBook enrollment', error);
          toast.error('Payment successful but eBook access failed. Please contact support.');
          return;
        }

        logInfo('eBook enrollment created', { enrollmentId: enrollment?.id });
        toast.success(`📚 Successfully purchased ${currentPaymentData.itemName}!`);
        
      } else if (currentPaymentData.type === PaymentType.EBOOK_BUNDLE) {
        // eBook bundle purchase
        const { enrollment, error } = await localDB.createEnrollment({
          user_id: user.id,
          course_id: currentPaymentData.itemId,
          course_name: currentPaymentData.itemName,
          payment_id: paymentResponse.razorpay_payment_id,
          enrollment_type: 'ebook_bundle',
          amount_paid: currentPaymentData.amount
        });

        if (error) {
          logError('Failed to create eBook bundle enrollment', error);
          toast.error('Payment successful but eBook bundle access failed. Please contact support.');
          return;
        }

        logInfo('eBook bundle enrollment created', { enrollmentId: enrollment?.id });
        toast.success(`📚 Successfully purchased ${currentPaymentData.itemName}!`);
        
      } else if (currentPaymentData.type === PaymentType.LIVE_TRAINING) {
        // Live training enrollment
        const { enrollment, error } = await localDB.createEnrollment({
          user_id: user.id,
          course_id: currentPaymentData.itemId,
          course_name: currentPaymentData.itemName,
          payment_id: paymentResponse.razorpay_payment_id,
          enrollment_type: 'live_training',
          amount_paid: currentPaymentData.amount
        });

        if (error) {
          logError('Failed to create live training enrollment', error);
          toast.error('Payment successful but live training enrollment failed. Please contact support.');
          return;
        }

        logInfo('Live training enrollment created', { enrollmentId: enrollment?.id });
        toast.success(`🎓 Successfully enrolled in ${currentPaymentData.itemName}!`);
        
      } else if (currentPaymentData.type === PaymentType.VAC) {
        // Value-added certificate enrollment
        const { enrollment, error } = await localDB.createEnrollment({
          user_id: user.id,
          course_id: currentPaymentData.itemId,
          course_name: currentPaymentData.itemName,
          payment_id: paymentResponse.razorpay_payment_id,
          enrollment_type: 'vac',
          amount_paid: currentPaymentData.amount
        });

        if (error) {
          logError('Failed to create VAC enrollment', error);
          toast.error('Payment successful but certificate enrollment failed. Please contact support.');
          return;
        }

        logInfo('VAC enrollment created', { enrollmentId: enrollment?.id });
        toast.success(`🏆 Successfully enrolled in ${currentPaymentData.itemName}!`);
      }

      // Close the payment modal
      closePaymentModal();

      // Trigger enrollment update event
      window.dispatchEvent(new CustomEvent('enrollmentUpdated', {
        detail: {
          type: currentPaymentData.type,
          courseId: currentPaymentData.itemId,
          courseName: currentPaymentData.itemName
        }
      }));

      // Reload page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      logError('Post-payment processing error', error);
      toast.error('Payment successful but there was an issue processing your purchase. Please contact support.');
    }
  };

  return {
    isPaymentModalOpen,
    currentPaymentData,
    initiateCoursePayment,
    initiatePremiumPassPayment,
    closePaymentModal,
    handlePaymentSuccess
  };
};