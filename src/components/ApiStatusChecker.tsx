import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Settings, Key, Database, CreditCard, Mail, MessageCircle } from 'lucide-react';
import { API_CONFIG } from '../lib/apiConfig';

interface ApiStatus {
  name: string;
  status: 'configured' | 'missing' | 'placeholder';
  description: string;
  icon: React.ReactNode;
  configKey: string;
  value: string;
}

const ApiStatusChecker: React.FC = () => {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkApiStatuses = () => {
      const statuses: ApiStatus[] = [
        {
          name: 'Backend Server',
          status: API_CONFIG.BACKEND.BASE_URL.includes('your-backend') ? 'placeholder' : 'configured',
          description: 'Your backend server URL',
          icon: <Settings className="w-5 h-5" />,
          configKey: 'BACKEND_URL',
          value: API_CONFIG.BACKEND.BASE_URL
        },
        {
          name: 'Payment Gateway (Razorpay)',
          status: API_CONFIG.RAZORPAY.KEY_ID.includes('YOUR_') ? 'placeholder' : 'configured',
          description: 'Payment processing service',
          icon: <CreditCard className="w-5 h-5" />,
          configKey: 'RAZORPAY_KEY_ID',
          value: API_CONFIG.RAZORPAY.KEY_ID
        },
        {
          name: 'Database (Supabase)',
          status: API_CONFIG.SUPABASE.URL.includes('your-project') ? 'placeholder' : 'configured',
          description: 'Database and authentication',
          icon: <Database className="w-5 h-5" />,
          configKey: 'SUPABASE_URL',
          value: API_CONFIG.SUPABASE.URL
        },
        {
          name: 'Email Service (SendGrid)',
          status: API_CONFIG.EMAIL.SENDGRID_API_KEY.includes('YOUR_') ? 'placeholder' : 'configured',
          description: 'Email notifications and marketing',
          icon: <Mail className="w-5 h-5" />,
          configKey: 'SENDGRID_API_KEY',
          value: API_CONFIG.EMAIL.SENDGRID_API_KEY
        },
        {
          name: 'SMS Service (MSG91)',
          status: API_CONFIG.SMS.MSG91_API_KEY.includes('YOUR_') ? 'placeholder' : 'configured',
          description: 'SMS notifications and OTP',
          icon: <MessageCircle className="w-5 h-5" />,
          configKey: 'MSG91_API_KEY',
          value: API_CONFIG.SMS.MSG91_API_KEY
        },
        {
          name: 'Google OAuth',
          status: API_CONFIG.GOOGLE.CLIENT_ID.includes('YOUR_') ? 'placeholder' : 'configured',
          description: 'Social login integration',
          icon: <Key className="w-5 h-5" />,
          configKey: 'GOOGLE_CLIENT_ID',
          value: API_CONFIG.GOOGLE.CLIENT_ID
        },
        {
          name: 'Analytics (Google Analytics)',
          status: API_CONFIG.ANALYTICS.GA_MEASUREMENT_ID.includes('YOUR_') ? 'placeholder' : 'configured',
          description: 'User tracking and analytics',
          icon: <Settings className="w-5 h-5" />,
          configKey: 'GA_MEASUREMENT_ID',
          value: API_CONFIG.ANALYTICS.GA_MEASUREMENT_ID
        },
        {
          name: 'Cloud Storage (AWS S3)',
          status: API_CONFIG.STORAGE.AWS_ACCESS_KEY_ID.includes('YOUR_') ? 'placeholder' : 'configured',
          description: 'File storage for videos and images',
          icon: <Database className="w-5 h-5" />,
          configKey: 'AWS_ACCESS_KEY_ID',
          value: API_CONFIG.STORAGE.AWS_ACCESS_KEY_ID
        }
      ];

      setApiStatuses(statuses);
    };

    checkApiStatuses();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'configured':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'placeholder':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'missing':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'configured':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'placeholder':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'missing':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const configuredCount = apiStatuses.filter(s => s.status === 'configured').length;
  const totalCount = apiStatuses.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">API Configuration Status</h3>
          <p className="text-sm text-gray-600">
            {configuredCount} of {totalCount} services configured
          </p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Configuration Progress</span>
          <span>{Math.round((configuredCount / totalCount) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(configuredCount / totalCount) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Status List */}
      <div className="space-y-3">
        {apiStatuses.map((status, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(status.status)}`}
          >
            <div className="flex items-center space-x-3">
              {status.icon}
              <div>
                <p className="font-medium">{status.name}</p>
                <p className="text-sm opacity-75">{status.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(status.status)}
              <span className="text-sm font-medium capitalize">
                {status.status === 'configured' ? 'Ready' : 
                 status.status === 'placeholder' ? 'Not Set' : 'Missing'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Configuration */}
      {showDetails && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Configuration Details</h4>
          <div className="space-y-2 text-sm">
            {apiStatuses.map((status, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">{status.configKey}:</span>
                <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                  {status.value.length > 30 ? `${status.value.substring(0, 30)}...` : status.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => window.open('/API_SETUP_GUIDE.md', '_blank')}
          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          View Setup Guide
        </button>
        <button
          onClick={() => window.open('.env.example', '_blank')}
          className="flex-1 border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
        >
          Environment Template
        </button>
      </div>

      {/* Status Summary */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Status:</strong> {configuredCount === totalCount 
            ? '🎉 All APIs configured! Your project is ready for production.' 
            : configuredCount > 0 
            ? `⚠️ ${totalCount - configuredCount} services still need configuration.` 
            : '❌ No APIs configured. Please set up your environment variables.'}
        </p>
      </div>
    </div>
  );
};

export default ApiStatusChecker;