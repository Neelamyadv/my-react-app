/**
 * Utility functions to clean up demo data and initialize production-ready state
 */

export const clearAllDemoData = () => {
  // Clear all Zyntiq-related data from localStorage
  const keysToRemove = [
    'zyntiq_users',
    'zyntiq_enrollments', 
    'zyntiq_contact_messages',
    'zyntiq_payments',
    'zyntiq_certificates',
    'zyntiq_progress',
    'zyntiq_analytics'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log('✅ All demo data cleared from localStorage');
};

export const initializeCleanState = () => {
  // Initialize empty arrays for all data stores
  const cleanData = {
    zyntiq_users: [],
    zyntiq_enrollments: [],
    zyntiq_contact_messages: [],
    zyntiq_payments: [],
    zyntiq_certificates: [],
    zyntiq_progress: [],
    zyntiq_analytics: []
  };

  Object.entries(cleanData).forEach(([key, value]) => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  console.log('✅ Clean state initialized');
};

export const resetToProductionState = () => {
  clearAllDemoData();
  initializeCleanState();
  
  // Clear any cached user session data
  localStorage.removeItem('supabase.auth.token');
  sessionStorage.clear();
  
  console.log('🚀 Application reset to production-ready state');
};
