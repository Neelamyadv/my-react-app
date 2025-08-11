import React, { useState } from 'react';
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

  const grantPremiumAccess = () => {
    if (!premiumEmail) return toast.error('Please enter an email address');
    // Implementation logic to grant Premium Pass access
    toast.success(`Granted Premium Pass access to ${premiumEmail}`);
    setPremiumEmail(''); // Clear field after granting access
  };

  const grantIndividualAccess = () => {
    if (!individualEmail) return toast.error('Please enter an email address');
    if (selectedCourses.length === 0) return toast.error('Please select at least one course');
    // Implementation logic to grant Individual Pass access to selected courses
    const courseList = selectedCourses.join(', ');
    toast.success(`Granted access to ${courseList} for ${individualEmail}`);
    setIndividualEmail(''); // Clear field after granting access
    setSelectedCourses([]); // Clear selected courses
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
              />
            </div>
            <button
              onClick={grantPremiumAccess}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Grant Premium Access
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
                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={clearAllCourses}
                  className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
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
              />
            </div>
            <button
              onClick={grantIndividualAccess}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              Grant Individual Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessPanel;
