import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Shield, Users, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { ADMIN_PASSWORDS } from '../../config/adminPasswords';

interface AdminAuthGuardProps {
  onAccessGranted: () => void;
  panelType: 'admin' | 'access';
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ onAccessGranted, panelType }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Admin passwords from configuration
  const ADMIN_PASSWORD = ADMIN_PASSWORDS.ADMIN_PANEL;
  const ACCESS_PASSWORD = ADMIN_PASSWORDS.ACCESS_PANEL;

  useEffect(() => {
    // Check if user already has access
    const accessKey = panelType === 'admin' ? 'admin_access' : 'access_panel_access';
    const hasAccess = sessionStorage.getItem(accessKey) === 'true';
    
    if (hasAccess) {
      onAccessGranted();
    }
  }, [panelType, onAccessGranted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error('Please enter the password');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const correctPassword = panelType === 'admin' ? ADMIN_PASSWORD : ACCESS_PASSWORD;
      
      if (password === correctPassword) {
        // Store access in session storage
        const accessKey = panelType === 'admin' ? 'admin_access' : 'access_panel_access';
        sessionStorage.setItem(accessKey, 'true');
        
        toast.success(`Access granted! Welcome to ${panelType === 'admin' ? 'Admin Panel' : 'Access Panel'}`);
        onAccessGranted();
      } else {
        setAttempts(prev => prev + 1);
        setPassword('');
        
        if (attempts >= 2) {
          toast.error('Too many failed attempts. Please try again later.');
          // Block for 5 minutes after 3 failed attempts
          setTimeout(() => setAttempts(0), 5 * 60 * 1000);
        } else {
          toast.error(`Incorrect password. ${3 - attempts - 1} attempts remaining.`);
        }
      }
      setIsLoading(false);
    }, 500);
  };

  const getPanelInfo = () => {
    if (panelType === 'admin') {
      return {
        title: 'Admin Panel Access',
        description: 'Full administrative access to manage users, payments, and system settings',
        icon: <Settings className="w-8 h-8 text-red-600" />,
        color: 'red',
        features: [
          'User Management',
          'Payment Tracking',
          'Course Access Control',
          'eBook Access Control',
          'System Settings',
          'Analytics Dashboard'
        ]
      };
    } else {
      return {
        title: 'Access Panel',
        description: 'HR team access for granting course and eBook access to users',
        icon: <Users className="w-8 h-8 text-blue-600" />,
        color: 'blue',
        features: [
          'Grant Course Access',
          'Grant eBook Access',
          'Premium Pass Access',
          'User Management',
          'Email-based Access'
        ]
      };
    }
  };

  const panelInfo = getPanelInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 bg-${panelInfo.color}-100 rounded-full flex items-center justify-center mb-4`}>
              {panelInfo.icon}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {panelInfo.title}
            </h1>
            <p className="text-gray-600">
              {panelInfo.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Access Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter password"
                  disabled={isLoading || attempts >= 3}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {attempts > 0 && (
                <p className="mt-2 text-sm text-red-600">
                  Failed attempts: {attempts}/3
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || attempts >= 3}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-${panelInfo.color}-600 hover:bg-${panelInfo.color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${panelInfo.color}-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Access Panel'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 text-gray-600 mt-0.5">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Security Features</p>
                <ul className="text-xs text-gray-600 mt-1 space-y-1">
                  {panelInfo.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {attempts >= 3 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                ⚠️ Too many failed attempts. Please wait 5 minutes before trying again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuthGuard;