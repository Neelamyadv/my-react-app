import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentData, PaymentType, PRICING } from '../lib/razorpay';
import { useAuth } from '../lib/auth';
import { localDB } from '../lib/database';
import toast from 'react-hot-toast';

export const usePayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentPaymentData, setCurrentPaymentData] = useState<PaymentData | null>(null);

  const initiateCoursePayment = (courseId: string, courseName: string) => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please log in to enroll in courses');
      return;
    }

    const paymentData: PaymentData = {
      type: PaymentType.COURSE,
      itemId: courseId,
      itemName: courseName,
      amount: PRICING.COURSE.price,
      userEmail: user.email,
      userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User',
      userPhone: user.phone
    };

    console.log('Initiating course payment:', paymentData);
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

    console.log('Initiating premium pass payment:', paymentData);
    setCurrentPaymentData(paymentData);
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setCurrentPaymentData(null);
  };

  const handlePaymentSuccess = async (paymentResponse: any) => {
    console.log('Payment successful:', paymentResponse);
    
    if (!user || !currentPaymentData) {
      toast.error('Payment processing error. Please contact support.');
      return;
    }

    try {
      // Create enrollment record in database
      if (currentPaymentData.type === PaymentType.COURSE && currentPaymentData.itemId) {
        const { enrollment, error } = await localDB.createEnrollment({
          user_id: user.id,
          course_id: currentPaymentData.itemId,
          course_name: currentPaymentData.itemName,
          payment_id: paymentResponse.razorpay_payment_id,
          enrollment_type: 'course',
          amount_paid: currentPaymentData.amount
        });

        if (error) {
          console.error('Failed to create enrollment:', error);
          toast.error('Payment successful but enrollment failed. Please contact support.');
          return;
        }

        console.log('Course enrollment created:', enrollment);
        
      } else if (currentPaymentData.type === PaymentType.PREMIUM_PASS) {
        // For premium pass, create a special enrollment record
        const { enrollment, error } = await localDB.createEnrollment({
          user_id: user.id,
          course_id: 'premium-pass',
          course_name: 'upLern Premium Pass',
          payment_id: paymentResponse.razorpay_payment_id,
          enrollment_type: 'premium_pass',
          amount_paid: currentPaymentData.amount
        });

        if (error) {
          console.error('Failed to create premium enrollment:', error);
          toast.error('Payment successful but premium activation failed. Please contact support.');
          return;
        }

        console.log('Premium pass enrollment created:', enrollment);
        
        // Show premium success message
        toast.success('🚀 Premium Pass activated! You now have access to all courses!');
        
        // Close the payment modal
        closePaymentModal();
        
        // Trigger enrollment update event IMMEDIATELY
        console.log('Dispatching enrollmentUpdated event for premium pass...');
        window.dispatchEvent(new CustomEvent('enrollmentUpdated', {
          detail: {
            type: currentPaymentData.type,
            courseId: currentPaymentData.itemId,
            courseName: currentPaymentData.itemName
          }
        }));
        
        // Force a small delay to ensure state updates, then redirect
        setTimeout(() => {
          console.log('Redirecting to courses page...');
          navigate('/courses');
        }, 1500);
        
        return; // Early return for premium pass to avoid duplicate processing
      }

      // Close the payment modal
      closePaymentModal();

      // Show success message for regular courses
      if (currentPaymentData.type === PaymentType.COURSE) {
        toast.success(`🎉 Successfully enrolled in ${currentPaymentData.itemName}!`);
      }

      // Trigger a custom event to notify components about the enrollment change
      console.log('Dispatching enrollmentUpdated event...');
      window.dispatchEvent(new CustomEvent('enrollmentUpdated', {
        detail: {
          type: currentPaymentData.type,
          courseId: currentPaymentData.itemId,
          courseName: currentPaymentData.itemName
        }
      }));

      // Force a page reload after a short delay to ensure UI updates
      setTimeout(() => {
        console.log('Reloading page to reflect enrollment changes...');
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Post-payment processing error:', error);
      toast.error('Payment successful but there was an issue processing your enrollment. Please contact support.');
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