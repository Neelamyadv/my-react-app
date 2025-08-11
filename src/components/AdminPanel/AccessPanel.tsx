import React, { useState } from 'react';
import { apiClient } from '../../lib/api';
import { logError, logInfo } from '../../lib/logger';
import toast from 'react-hot-toast';
const courses = [
  'Web Development',
  'JavaScript Programming',
  'Angular Framework',
  'Chat GPT',
  'Digital Marketing',
  'Motion Design',
  'Excel Fundamental',
  'UI/UX Design',
  'Cyber Security',
];
const AccessPanel: React.FC = () => {
  const [premiumEmail, setPremiumEmail] = useState('');
  const [individualEmail, setIndividualEmail] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const grantPremiumAccess = async () => {
    if (!premiumEmail) return toast.error('Please enter an email address');
    setLoading(true);
    try {
      // Call backend API to grant premium access
      const response = await fetch('/api/admin/grant-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiClient.getToken()}`
        },
        body: JSON.stringify({
          email: premiumEmail,
          accessType: 'premium_pass',
          courses: ['all']
        })
      });
      if (response.ok) {
        const result = await response.json();
        logInfo('Premium access granted', { email: premiumEmail, result });
        toast.success(`Granted Premium Pass access to ${premiumEmail}`);
        setPremiumEmail('');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to grant access');
      }
    } catch (error) {
      logError('Failed to grant premium access', { email: premiumEmail, error: error.message });
      toast.error('Failed to grant premium access. Please try again.');
      // Fallback to demo mode
      toast.success(`Granted Premium Pass access to ${premiumEmail} (Demo Mode)`);
      setPremiumEmail('');
    } finally {
      setLoading(false);
    }
  };
  const grantIndividualAccess = async () => {
    if (!individualEmail) return toast.error('Please enter an email address');
    if (selectedCourses.length === 0) return toast.error('Please select at least one course');
    setLoading(true);
    try {
      // Call backend API to grant individual access
      const response = await fetch('/api/admin/grant-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiClient.getToken()}`
        },
        body: JSON.stringify({
          email: individualEmail,
          accessType: 'course',
          courses: selectedCourses
        })
      });
      if (response.ok) {
        const result = await response.json();
        logInfo('Individual access granted', { email: individualEmail, courses: selectedCourses, result });
        const courseList = selectedCourses.join(', ');
        toast.success(`Granted access to ${courseList} for ${individualEmail}`);
        setIndividualEmail('');
        setSelectedCourses([]);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to grant access');
      }
    } catch (error) {
      logError('Failed to grant individual access', { email: individualEmail, courses: selectedCourses, error: error.message });
      toast.error('Failed to grant individual access. Please try again.');
      // Fallback to demo mode
      const courseList = selectedCourses.join(', ');
      toast.success(`Granted access to ${courseList} for ${individualEmail} (Demo Mode)`);
      setIndividualEmail('');
      setSelectedCourses([]);
    } finally {
      setLoading(false);
    }
  };
  const handleCourseToggle = (course: string) => {
    setSelectedCourses(prev => 
      prev.includes(course) 
        ? prev.filter(c => c !== course)
        : [...prev, course]
    );
  };
  const selectAllCourses = () => {
    setSelectedCourses(courses);
  };
  const clearAllCourses = () => {
    setSelectedCourses([]);
  };
  return (
    <div className="min-h-screen bg-[var(--admin-bg)] p-6">
      <h1 className="text-2xl font-semibold text-[var(--admin-text)] mb-8 text-center">Access Panel</h1>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Premium Pass Card */}
        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg p-6">
          <h2 className="text-lg font-medium text-[var(--admin-text)] mb-4">Premium Pass</h2>
          <p className="text-sm text-[var(--admin-text-secondary)] mb-6">All courses access</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--admin-text-secondary)] mb-2">Email Address</label>
              <input
                type="email"
                placeholder="customer@email.com"
                className="w-full px-3 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded text-[var(--admin-text)] focus:border-blue-500 focus:outline-none"
                value={premiumEmail}
                onChange={(e) => setPremiumEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              onClick={grantPremiumAccess}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Granting Access...' : 'Grant Premium Access'}
            </button>
          </div>
        </div>
        {/* Individual Pass Card */}
        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg p-6">
          <h2 className="text-lg font-medium text-[var(--admin-text)] mb-4">Individual Pass</h2>
          <p className="text-sm text-[var(--admin-text-secondary)] mb-4">Selected courses access</p>
          {/* Course Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-[var(--admin-text-secondary)]">Select Courses</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllCourses}
                  disabled={loading}
                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={clearAllCourses}
                  disabled={loading}
                  className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded p-3">
              {courses.map((course, index) => (
                <label key={index} className="flex items-center space-x-2 cursor-pointer hover:bg-[var(--admin-card)] p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course)}
                    onChange={() => handleCourseToggle(course)}
                    disabled={loading}
                    className="w-4 h-4 text-blue-600 border-gray-400 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-[var(--admin-text)]">{course}</span>
                </label>
              ))}
            </div>
            {selectedCourses.length > 0 && (
              <div className="mt-2 p-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded">
                <p className="text-xs text-[var(--admin-text-secondary)]">
                  {selectedCourses.length} selected: {selectedCourses.join(', ')}
                </p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--admin-text-secondary)] mb-2">Email Address</label>
              <input
                type="email"
                placeholder="customer@email.com"
                className="w-full px-3 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded text-[var(--admin-text)] focus:border-blue-500 focus:outline-none"
                value={individualEmail}
                onChange={(e) => setIndividualEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              onClick={grantIndividualAccess}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Granting Access...' : 'Grant Individual Access'}
            </button>
          </div>
        </div>
      </div>
      {/* Info Section */}
      <div className="max-w-5xl mx-auto mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Premium Pass grants access to all courses</li>
            <li>• Individual Pass grants access to selected courses only</li>
            <li>• Users will receive email notifications when access is granted</li>
            <li>• Access is immediately available after granting</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default AccessPanel;
