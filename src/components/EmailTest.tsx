import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { emailService } from '../lib/emailService';
import toast from 'react-hot-toast';

const EmailTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestEmail = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const result = await emailService.testEmailService();
      
      if (result.success) {
        setTestResult({ success: true, message: 'Test email sent successfully!' });
        toast.success('Test email sent successfully!');
      } else {
        setTestResult({ success: false, message: `Failed to send test email: ${result.error}` });
        toast.error('Failed to send test email');
      }
    } catch (error) {
      setTestResult({ success: false, message: `Error: ${error.message}` });
      toast.error('Error testing email service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Service Test</h2>
        <p className="text-gray-600">Test the Resend email service configuration</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleTestEmail}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Sending Test Email...' : 'Send Test Email'}
        </button>

        {testResult && (
          <div className={`p-4 rounded-lg border ${
            testResult.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">
                {testResult.success ? 'Success' : 'Error'}
              </span>
            </div>
            <p className="mt-2 text-sm">{testResult.message}</p>
          </div>
        )}

        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">What this test does:</h4>
          <ul className="space-y-1">
            <li>• Sends a test email to verify API configuration</li>
            <li>• Checks if Resend API key is valid</li>
            <li>• Confirms email service is working</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailTest;