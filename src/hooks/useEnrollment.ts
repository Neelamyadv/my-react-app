import { useState, useEffect, useCallback } from 'react';
import { localDB } from '../lib/database';
import { useAuth } from '../lib/auth';
import { logError, logDebug } from '../lib/logger';

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
      logDebug('Loading enrollments for user', { userId: user.id });
      
      const { enrollments: userEnrollments, error } = await localDB.getUserEnrollments(user.id);
      if (error) {
        logError('Failed to load enrollments', error);
        return;
      }
      
      logDebug('Loaded enrollments', { count: userEnrollments.length });
      setEnrollments(userEnrollments);

      // Check for premium pass
      const premiumEnrollment = userEnrollments.find(e => e.enrollment_type === 'premium_pass');
      const hasPremium = !!premiumEnrollment;
      setHasPremiumPass(hasPremium);
      logDebug('Premium status updated', { hasPremium });
      
    } catch (error) {
      logError('Error loading enrollments', error);
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
      logDebug('Enrollment update event received, refreshing enrollments');
      loadUserEnrollments();
    };

    // Listen for custom enrollment update events
    window.addEventListener('enrollmentUpdated', handleEnrollmentUpdate);
    
    // Also listen for storage changes (in case of multiple tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === 'uplern_enrollments') {
        logDebug('Storage change detected for enrollments');
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
      logError('Error checking course enrollment', error);
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
    
    // Check for manual course access (this would be from the backend in real app)
    // For now, we'll simulate this with localStorage
    if (user) {
      const manualAccess = localStorage.getItem(`course_access_${user.email}_${courseId}`);
      if (manualAccess === 'true') {
        return {
          id: `manual-${courseId}`,
          user_id: user.id,
          course_id: courseId,
          course_name: 'Manual Access',
          payment_id: 'manual-grant',
          enrollment_type: 'course',
          amount_paid: 0,
          enrolled_at: new Date().toISOString(),
          status: 'active',
          progress: 0
        };
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
    
    // Check for manual course access (this would be from the backend in real app)
    // For now, we'll simulate this with localStorage
    if (user) {
      const manualAccess = localStorage.getItem(`course_access_${user.email}_${courseId}`);
      if (manualAccess === 'true') {
        return true;
      }
    }
    
    // Check for specific course enrollment
    const enrollment = enrollments.find(e => e.course_id === courseId);
    return !!enrollment;
  };

  const updateProgress = async (enrollmentId: string, progress: number) => {
    try {
      const { error } = await localDB.updateEnrollmentProgress(enrollmentId, progress);
      if (error) {
        logError('Failed to update progress', error);
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
      logError('Error updating progress', error);
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