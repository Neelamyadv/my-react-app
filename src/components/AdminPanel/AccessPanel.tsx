import React, { useState, useEffect } from 'react';
import { Mail, BookOpen, GraduationCap, Users, Plus, CheckCircle, Eye, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminAuthGuard from '../Auth/AdminAuthGuard';

// Course data
const courses = [
  { id: 'web-development', title: 'Web Development', category: 'Programming' },
  { id: 'javascript', title: 'JavaScript Programming', category: 'Programming' },
  { id: 'angular', title: 'Angular Framework', category: 'Programming' },
  { id: 'chat-gpt', title: 'Chat GPT', category: 'AI' },
  { id: 'digital-marketing', title: 'Digital Marketing', category: 'Business' },
  { id: 'motion-design', title: 'Motion Design', category: 'Design' },
  { id: 'excel-fundamental', title: 'Excel Fundamental', category: 'Business' },
  { id: 'ui-ux-design', title: 'UI/UX Design', category: 'Design' },
  { id: 'cyber-security', title: 'Cyber Security', category: 'Security' }
];

// eBook data
const ebooks = [
  { id: 'web-development-ebook', title: 'Web Development Fundamentals', category: 'Programming' },
  { id: 'python-ebook', title: 'Python Programming Mastery', category: 'Programming' },
  { id: 'java-ebook', title: 'Java Development Complete', category: 'Programming' },
  { id: 'ui-ux-ebook', title: 'UI/UX Design Principles', category: 'Design' },
  { id: 'graphic-design-ebook', title: 'Graphic Design Mastery', category: 'Design' },
  { id: 'digital-marketing-ebook', title: 'Digital Marketing Strategy', category: 'Business' },
  { id: 'business-analytics-ebook', title: 'Business Analytics & Insights', category: 'Business' },
  { id: 'mobile-development-ebook', title: 'Mobile App Development', category: 'Programming' },
  { id: 'cybersecurity-ebook', title: 'Cybersecurity Fundamentals', category: 'Programming' }
];

const AccessPanel: React.FC = () => {
  // Course access states
  const [courseEmail, setCourseEmail] = useState('');
  const [courseUserName, setCourseUserName] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  // eBook access states
  const [ebookEmail, setEbookEmail] = useState('');
  const [ebookUserName, setEbookUserName] = useState('');
  const [selectedEbooks, setSelectedEbooks] = useState<string[]>([]);

  // Premium pass states
  const [premiumEmail, setPremiumEmail] = useState('');
  const [premiumUserName, setPremiumUserName] = useState('');

  // Access control
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  // Access control functions
  useEffect(() => {
    const accessPanelAccess = sessionStorage.getItem('access_panel_access') === 'true';
    setHasAccess(accessPanelAccess);
  }, []);

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('access_panel_access');
    setHasAccess(false);
    toast.success('Logged out successfully');
  };

  // Validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Course access functions
  const grantCourseAccess = () => {
    if (!courseEmail || !validateEmail(courseEmail)) {
      return toast.error('Please enter a valid email address');
    }

    if (!courseUserName.trim()) {
      return toast.error('Please enter the user name');
    }

    if (selectedCourses.length === 0) {
      return toast.error('Please select at least one course');
    }

    let coursesToGrant: string[] = selectedCourses;

    // Store access in localStorage (simulating backend storage)
    coursesToGrant.forEach(courseId => {
      localStorage.setItem(`course_access_${courseEmail.toLowerCase()}_${courseId}`, 'true');
    });

    const courseCount = coursesToGrant.length;
    const courseNames = coursesToGrant.map(id => courses.find(c => c.id === id)?.title).join(', ');
    
    toast.success(`✅ Course access granted successfully!\n\nUser: ${courseUserName}\nEmail: ${courseEmail}\nAccess granted to: ${courseCount} course${courseCount !== 1 ? 's' : ''}\n\nWhen this user logs in with email "${courseEmail}", they will automatically see these courses in their account.`);

    // Reset form
    setCourseEmail('');
    setCourseUserName('');
    setSelectedCourses([]);
  };

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(c => c !== courseId)
        : [...prev, courseId]
    );
  };

  const selectAllCourses = () => {
    setSelectedCourses(courses.map(course => course.id));
  };

  const clearAllCourses = () => {
    setSelectedCourses([]);
  };

  // eBook access functions
  const grantEbookAccess = () => {
    if (!ebookEmail || !validateEmail(ebookEmail)) {
      return toast.error('Please enter a valid email address');
    }

    if (!ebookUserName.trim()) {
      return toast.error('Please enter the user name');
    }

    if (selectedEbooks.length === 0) {
      return toast.error('Please select at least one eBook');
    }

    let ebooksToGrant: string[] = selectedEbooks;

    // Store access in localStorage (simulating backend storage)
    ebooksToGrant.forEach(ebookId => {
      localStorage.setItem(`ebook_access_${ebookEmail.toLowerCase()}_${ebookId}`, 'true');
    });

    const ebookCount = ebooksToGrant.length;
    const ebookNames = ebooksToGrant.map(id => ebooks.find(e => e.id === id)?.title).join(', ');
    
    toast.success(`✅ eBook access granted successfully!\n\nUser: ${ebookUserName}\nEmail: ${ebookEmail}\nAccess granted to: ${ebookCount} eBook${ebookCount !== 1 ? 's' : ''}\n\nWhen this user logs in with email "${ebookEmail}", they will automatically see these eBooks in their account.`);

    // Reset form
    setEbookEmail('');
    setEbookUserName('');
    setSelectedEbooks([]);
  };

  const handleEbookToggle = (ebookId: string) => {
    setSelectedEbooks(prev => 
      prev.includes(ebookId) 
        ? prev.filter(e => e !== ebookId)
        : [...prev, ebookId]
    );
  };

  const selectAllEbooks = () => {
    setSelectedEbooks(ebooks.map(ebook => ebook.id));
  };

  const clearAllEbooks = () => {
    setSelectedEbooks([]);
  };

  // Premium pass function
  const grantPremiumAccess = () => {
    if (!premiumEmail || !validateEmail(premiumEmail)) {
      return toast.error('Please enter a valid email address');
    }

    if (!premiumUserName.trim()) {
      return toast.error('Please enter the user name');
    }

    // Grant access to all courses
    courses.forEach(course => {
      localStorage.setItem(`course_access_${premiumEmail.toLowerCase()}_${course.id}`, 'true');
    });

    // Grant access to all eBooks
    ebooks.forEach(ebook => {
      localStorage.setItem(`ebook_access_${premiumEmail.toLowerCase()}_${ebook.id}`, 'true');
    });

    toast.success(`✅ Premium Pass access granted successfully!\n\nUser: ${premiumUserName}\nEmail: ${premiumEmail}\nAccess granted to: ALL ${courses.length} courses and ALL ${ebooks.length} eBooks\n\nWhen this user logs in with email "${premiumEmail}", they will have complete access to all content.`);

    // Reset form
    setPremiumEmail('');
    setPremiumUserName('');
  };

  if (!hasAccess) {
    return <AdminAuthGuard onAccessGranted={handleAccessGranted} panelType="access" />;
  }

  return (
    <div className="min-h-screen bg-[var(--admin-bg)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          <h1 className="text-3xl font-bold text-[var(--admin-text)] mb-2">HR & Manager Access Panel</h1>
          <p className="text-[var(--admin-text-secondary)] mb-4">Grant course and eBook access to users by email - Standalone panel for HR team and managers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Premium Pass Card */}
          <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-purple-600" />
              <h2 className="text-lg font-medium text-[var(--admin-text)]">Premium Pass</h2>
            </div>
            <p className="text-sm text-[var(--admin-text-secondary)] mb-6">Complete access to all courses and eBooks</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--admin-text-secondary)] mb-2">User Name</label>
                <input
                  type="text"
                  placeholder="Enter user's full name"
                  className="w-full px-3 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded text-[var(--admin-text)] focus:border-purple-500 focus:outline-none"
                  value={premiumUserName}
                  onChange={(e) => setPremiumUserName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--admin-text-secondary)] mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="customer@email.com"
                    className="w-full pl-10 pr-3 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded text-[var(--admin-text)] focus:border-purple-500 focus:outline-none"
                    value={premiumEmail}
                    onChange={(e) => setPremiumEmail(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={grantPremiumAccess}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Grant Premium Access
              </button>
            </div>
          </div>

          {/* Course Access Card */}
          <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-medium text-[var(--admin-text)]">Course Access</h2>
            </div>
            <p className="text-sm text-[var(--admin-text-secondary)] mb-4">Select one or multiple courses to grant access</p>
            
            {/* Course Selection */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-[var(--admin-text-secondary)]">Select Courses</label>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllCourses}
                    className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAllCourses}
                    className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded p-3">
                {courses.map((course) => (
                  <label key={course.id} className="flex items-center space-x-2 cursor-pointer hover:bg-[var(--admin-card)] p-1 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.id)}
                      onChange={() => handleCourseToggle(course.id)}
                      className="w-4 h-4 text-blue-600 border-gray-400 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-[var(--admin-text)]">{course.title}</span>
                  </label>
                ))}
              </div>
              
              {selectedCourses.length > 0 && (
                <div className="mt-2 p-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded">
                  <p className="text-xs text-[var(--admin-text-secondary)]">
                    {selectedCourses.length} selected: {selectedCourses.map(id => courses.find(c => c.id === id)?.title).join(', ')}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--admin-text-secondary)] mb-2">User Name</label>
                <input
                  type="text"
                  placeholder="Enter user's full name"
                  className="w-full px-3 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded text-[var(--admin-text)] focus:border-blue-500 focus:outline-none"
                  value={courseUserName}
                  onChange={(e) => setCourseUserName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--admin-text-secondary)] mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="customer@email.com"
                    className="w-full pl-10 pr-3 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded text-[var(--admin-text)] focus:border-blue-500 focus:outline-none"
                    value={courseEmail}
                    onChange={(e) => setCourseEmail(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={grantCourseAccess}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Grant Course Access
              </button>
            </div>
          </div>

          {/* eBook Access Card */}
          <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-medium text-[var(--admin-text)]">eBook Access</h2>
            </div>
            <p className="text-sm text-[var(--admin-text-secondary)] mb-4">Select one or multiple eBooks to grant access</p>
            
            {/* eBook Selection */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-[var(--admin-text-secondary)]">Select eBooks</label>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllEbooks}
                    className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAllEbooks}
                    className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded p-3">
                {ebooks.map((ebook) => (
                  <label key={ebook.id} className="flex items-center space-x-2 cursor-pointer hover:bg-[var(--admin-card)] p-1 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedEbooks.includes(ebook.id)}
                      onChange={() => handleEbookToggle(ebook.id)}
                      className="w-4 h-4 text-green-600 border-gray-400 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-[var(--admin-text)]">{ebook.title}</span>
                  </label>
                ))}
              </div>
              
              {selectedEbooks.length > 0 && (
                <div className="mt-2 p-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded">
                  <p className="text-xs text-[var(--admin-text-secondary)]">
                    {selectedEbooks.length} selected: {selectedEbooks.map(id => ebooks.find(e => e.id === id)?.title).join(', ')}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--admin-text-secondary)] mb-2">User Name</label>
                <input
                  type="text"
                  placeholder="Enter user's full name"
                  className="w-full px-3 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded text-[var(--admin-text)] focus:border-green-500 focus:outline-none"
                  value={ebookUserName}
                  onChange={(e) => setEbookUserName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--admin-text-secondary)] mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="customer@email.com"
                    className="w-full pl-10 pr-3 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded text-[var(--admin-text)] focus:border-green-500 focus:outline-none"
                    value={ebookEmail}
                    onChange={(e) => setEbookEmail(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={grantEbookAccess}
                className="w-full bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Grant eBook Access
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg p-6">
          <h3 className="text-lg font-medium text-[var(--admin-text)] mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            How to Use This HR & Manager Access Panel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[var(--admin-text-secondary)]">
            <div>
              <h4 className="font-medium text-[var(--admin-text)] mb-2">For HR/Managers:</h4>
              <ul className="space-y-1">
                <li>• Enter user's full name and email address</li>
                <li>• Select one or multiple courses/eBooks using checkboxes</li>
                <li>• Use "Select All" to choose everything in that category</li>
                <li>• Click the grant button to provide access</li>
                <li>• Users will see their content when they login</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[var(--admin-text)] mb-2">Access Types:</h4>
              <ul className="space-y-1">
                <li>• <strong>Premium Pass:</strong> Complete access to all courses and eBooks</li>
                <li>• <strong>Course Access:</strong> Select specific courses to grant access</li>
                <li>• <strong>eBook Access:</strong> Select specific eBooks to grant access</li>
                <li>• <strong>Flexible Selection:</strong> Choose any combination of items</li>
                <li>• <strong>Quick Actions:</strong> Use "Select All" or "Clear All" buttons</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessPanel;
