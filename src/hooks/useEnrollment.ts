import { useState, useEffect, useCallback } from 'react';
import { localDB } from '../lib/database';
import { useAuth } from '../lib/auth';

interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  course_name: string;
  payment_id: string;
  enrollment_type: 'course' | 'premium_pass';
  amount_paid: number;
  enrolled_at: string;
  status: 'active' | 'completed';
  progress: number;
}

export const useEnrollment = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPremiumPass, setHasPremiumPass] = useState(false);

  const loadUserEnrollments = useCallback(async () => {
    if (!user) {
      setEnrollments([]);
      setHasPremiumPass(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading enrollments for user:', user.id);
      
      const { enrollments: userEnrollments, error } = await localDB.getUserEnrollments(user.id);
      if (error) {
        console.error('Failed to load enrollments:', error);
        return;
      }
      
      console.log('Loaded enrollments:', userEnrollments);
      setEnrollments(userEnrollments);

      // Check for premium pass
      const premiumEnrollment = userEnrollments.find(e => e.enrollment_type === 'premium_pass');
      const hasPremium = !!premiumEnrollment;
      setHasPremiumPass(hasPremium);
      console.log('Premium status updated:', hasPremium, premiumEnrollment);
      
    } catch (error) {
      console.error('Error loading enrollments:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserEnrollments();
  }, [loadUserEnrollments]);

  // Listen for enrollment updates
  useEffect(() => {
    const handleEnrollmentUpdate = () => {
      console.log('Enrollment update event received, refreshing enrollments...');
      loadUserEnrollments();
    };

    // Listen for custom enrollment update events
    window.addEventListener('enrollmentUpdated', handleEnrollmentUpdate);
    
    // Also listen for storage changes (in case of multiple tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === 'uplern_enrollments') {
        console.log('Storage change detected for enrollments');
        loadUserEnrollments();
      }
    });

    return () => {
      window.removeEventListener('enrollmentUpdated', handleEnrollmentUpdate);
      window.removeEventListener('storage', handleEnrollmentUpdate);
    };
  }, [loadUserEnrollments]);

  const isEnrolledInCourse = async (courseId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { enrolled } = await localDB.isUserEnrolledInCourse(user.id, courseId);
      return enrolled;
    } catch (error) {
      console.error('Error checking course enrollment:', error);
      return false;
    }
  };

  const getCourseEnrollment = (courseId: string): Enrollment | undefined => {
    // Check if user has premium pass (gives access to all courses)
    if (hasPremiumPass) {
      const premiumEnrollment = enrollments.find(e => e.enrollment_type === 'premium_pass');
      if (premiumEnrollment) {
        return premiumEnrollment;
      }
    }
    
    // Check for specific course enrollment
    const enrollment = enrollments.find(e => e.course_id === courseId);
    console.log(`Getting enrollment for course ${courseId}:`, enrollment);
    return enrollment;
  };

  const isEnrolledInCourseSync = (courseId: string): boolean => {
    // Check if user has premium pass
    if (hasPremiumPass) {
      return true;
    }
    
    // Check for specific course enrollment
    const enrollment = enrollments.find(e => e.course_id === courseId);
    return !!enrollment;
  };

  const updateProgress = async (enrollmentId: string, progress: number) => {
    try {
      const { error } = await localDB.updateEnrollmentProgress(enrollmentId, progress);
      if (error) {
        console.error('Failed to update progress:', error);
        return;
      }
      
      // Update local state
      setEnrollments(prev => 
        prev.map(e => 
          e.id === enrollmentId 
            ? { ...e, progress, status: progress === 100 ? 'completed' : 'active' }
            : e
        )
      );
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Force refresh enrollments (useful after payment)
  const refreshEnrollments = useCallback(() => {
    console.log('Force refreshing enrollments...');
    return loadUserEnrollments();
  }, [loadUserEnrollments]);

  return {
    enrollments,
    loading,
    hasPremiumPass,
    isEnrolledInCourse,
    isEnrolledInCourseSync,
    getCourseEnrollment,
    updateProgress,
    refreshEnrollments
  };
};