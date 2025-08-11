import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth.tsx';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, isGoogleAuthAvailable } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    
    if (!formData.password) {
      toast.error('Password is required');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await signIn(formData.email.trim(), formData.password);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isGoogleAuthAvailable) {
      toast.error('Google Sign-In is not available in this environment');
      return;
    }

    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Logged in successfully with Google!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log in with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen yellow-gradient-bg flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card-dark rounded-2xl p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Log into your account</h2>
          <div className="mt-4 p-3 sm:p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Demo Accounts:</p>
            <p className="text-xs text-blue-700 mt-1">Email: demo@zyntiq.in, Password: demo123</p>
            <p className="text-xs text-blue-700">Email: john@zyntiq.in, Password: john123</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <div>
            <input
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 sm:py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-base"
              required
              disabled={loading}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 sm:py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-base"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-3 sm:py-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 text-base"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {isGoogleAuthAvailable && (
          <div className="mt-4 sm:mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 sm:py-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-300 disabled:opacity-50 group bg-white/90 backdrop-blur-sm"
            >
              <div className="relative">
                <img 
                  src="https://www.google.com/favicon.ico" 
                  alt="Google" 
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
                />
                {googleLoading && (
                  <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <span className="font-medium text-gray-700 text-base">
                {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
              </span>
            </button>
          </div>
        )}

        {!isGoogleAuthAvailable && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              Google Sign-In is not available in this environment. Please use email/password authentication.
            </p>
          </div>
        )}

        <div className="mt-4 sm:mt-6 text-center text-sm">
          <span className="text-gray-600">You don't have an account? </span>
          <Link to="/signup" className="text-violet-600 hover:text-violet-700 font-medium">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;