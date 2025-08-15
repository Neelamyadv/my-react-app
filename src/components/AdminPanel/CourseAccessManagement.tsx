import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, UserCheck, UserX, BookOpen, Download, Eye, Lock, Unlock, Plus, Users, BookOpenCheck, Mail, GraduationCap } from 'lucide-react';
import { useAuth } from '../../lib/auth';

interface CourseAccess {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  accessType: 'purchased' | 'manual' | 'premium';
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

interface CourseData {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
}

// Course data (matching your existing courses)
const courseData: CourseData[] = [
  { id: 'web-development', title: 'Web Development', category: 'Programming', price: 599, image: '/WebD.png' },
  { id: 'javascript', title: 'Java Script Programming', category: 'Programming', price: 599, image: '/JS.png' },
  { id: 'angular', title: 'Angular Framework', category: 'Programming', price: 599, image: '/Angular.png' },
  { id: 'chat-gpt', title: 'Chat GPT', category: 'AI', price: 599, image: '/AI.png' },
  { id: 'digital-marketing', title: 'Digital Marketing', category: 'Business', price: 599, image: '/DigitalM.png' },
  { id: 'motion-design', title: 'Motion Design', category: 'Design', price: 599, image: '/MotionD.png' },
  { id: 'excel-fundamental', title: 'Excel Fundamental', category: 'Business', price: 599, image: '/Excel.png' },
  { id: 'ui-ux-design', title: 'UI/UX Design', category: 'Design', price: 599, image: '/UIUX.png' },
  { id: 'cyber-security', title: 'Cyber Security', category: 'Security', price: 599, image: '/Cyber.png' }
];

// Mock access data
const mockAccessData: CourseAccess[] = [
  {
    id: '1',
    userId: 'user1',
    userEmail: 'john@example.com',
    userName: 'John Doe',
    courseId: 'web-development',
    courseTitle: 'Web Development',
    accessType: 'purchased',
    grantedBy: 'system',
    grantedAt: '2024-01-15T10:30:00Z',
    isActive: true
  },
  {
    id: '2',
    userId: 'user2',
    userEmail: 'jane@example.com',
    userName: 'Jane Smith',
    courseId: 'python',
    courseTitle: 'Python Programming',
    accessType: 'manual',
    grantedBy: 'admin',
    grantedAt: '2024-01-20T14:15:00Z',
    expiresAt: '2024-12-31T23:59:59Z',
    isActive: true
  },
  {
    id: '3',
    userId: 'user3',
    userEmail: 'bob@example.com',
    userName: 'Bob Johnson',
    courseId: 'ui-ux-design',
    courseTitle: 'UI/UX Design',
    accessType: 'premium',
    grantedBy: 'system',
    grantedAt: '2024-01-10T09:00:00Z',
    isActive: true
  }
];

const CourseAccessManagement = () => {
  const { user } = useAuth();
  const [accessData, setAccessData] = useState<CourseAccess[]>(mockAccessData);
  const [filteredData, setFilteredData] = useState<CourseAccess[]>(mockAccessData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'purchased' | 'manual' | 'premium'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantType, setGrantType] = useState<'single' | 'multiple' | 'all'>('single');
  const [selectedAccess, setSelectedAccess] = useState<CourseAccess | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter data based on search and filters
  const filterData = useCallback(() => {
    let filtered = accessData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(access =>
        access.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        access.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        access.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Access type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(access => access.accessType === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(access => 
        filterStatus === 'active' ? access.isActive : !access.isActive
      );
    }

    setFilteredData(filtered);
  }, [accessData, searchTerm, filterType, filterStatus]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGrantAccess = async () => {
    // Validate email
    if (!userEmail || !validateEmail(userEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate name
    if (!userName.trim()) {
      alert('Please enter the user name');
      return;
    }

    let coursesToGrant: string[] = [];

    if (grantType === 'single') {
      if (selectedCourses.length === 0) {
        alert('Please select at least one course');
        return;
      }
      coursesToGrant = selectedCourses;
    } else if (grantType === 'multiple') {
      if (selectedCourses.length === 0) {
        alert('Please select at least one course');
        return;
      }
      coursesToGrant = selectedCourses;
    } else if (grantType === 'all') {
      coursesToGrant = courseData.map(course => course.id);
    }

    setIsLoading(true);

    try {
      // Generate a unique user ID based on email
      const userId = `user_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

      const newAccesses: CourseAccess[] = coursesToGrant.map(courseId => {
        const course = courseData.find(c => c.id === courseId);
        return {
          id: Date.now().toString() + Math.random(),
          userId: userId,
          userEmail: userEmail.toLowerCase(),
          userName: userName.trim(),
          courseId: courseId,
          courseTitle: course?.title || 'Unknown Course',
          accessType: 'manual',
          grantedBy: user?.email || 'admin',
          grantedAt: new Date().toISOString(),
          isActive: true
        };
      });

      setAccessData(prev => [...prev, ...newAccesses]);
      
      // Store access in localStorage for the user (simulating backend storage)
      coursesToGrant.forEach(courseId => {
        localStorage.setItem(`course_access_${userEmail.toLowerCase()}_${courseId}`, 'true');
      });
      
      // Show success message
      const courseCount = coursesToGrant.length;
      const courseNames = coursesToGrant.map(id => courseData.find(c => c.id === id)?.title).join(', ');
      
      alert(`✅ Course access granted successfully!\n\nUser: ${userName}\nEmail: ${userEmail}\nAccess granted to: ${courseCount} course${courseCount !== 1 ? 's' : ''}\n\nWhen this user logs in with email "${userEmail}", they will automatically see these courses in their account.`);
      
      // Reset form
      setShowGrantModal(false);
      setUserEmail('');
      setUserName('');
      setSelectedCourses([]);
      setGrantType('single');
    } catch (error) {
      alert('Error granting access. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAccess = (accessId: string) => {
    setAccessData(prev => prev.map(access => 
      access.id === accessId ? { ...access, isActive: false } : access
    ));
  };

  const handleBulkRevoke = (userId: string) => {
    setAccessData(prev => prev.map(access => 
      access.userId === userId ? { ...access, isActive: false } : access
    ));
    
    // Also remove from localStorage
    const userAccesses = accessData.filter(access => access.userId === userId);
    userAccesses.forEach(access => {
      localStorage.removeItem(`course_access_${access.userEmail}_${access.courseId}`);
    });
  };

  const handleBulkActivate = (userId: string) => {
    setAccessData(prev => prev.map(access => 
      access.userId === userId ? { ...access, isActive: true } : access
    ));
    
    // Also add back to localStorage
    const userAccesses = accessData.filter(access => access.userId === userId);
    userAccesses.forEach(access => {
      localStorage.setItem(`course_access_${access.userEmail}_${access.courseId}`, 'true');
    });
  };

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const selectAllCourses = () => {
    setSelectedCourses(courseData.map(course => course.id));
  };

  const clearCourseSelection = () => {
    setSelectedCourses([]);
  };

  const getAccessTypeColor = (type: string) => {
    switch (type) {
      case 'purchased': return 'bg-green-100 text-green-800';
      case 'manual': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessTypeIcon = (type: string) => {
    switch (type) {
      case 'purchased': return <Download className="w-4 h-4" />;
      case 'manual': return <UserCheck className="w-4 h-4" />;
      case 'premium': return <BookOpen className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  // Group access by user
  const groupedAccess = filteredData.reduce((acc, access) => {
    if (!acc[access.userId]) {
      acc[access.userId] = [];
    }
    acc[access.userId].push(access);
    return acc;
  }, {} as Record<string, CourseAccess[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Access Management</h2>
          <p className="text-gray-600">Grant access to users by email - they'll see courses when they login</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setGrantType('single');
              setShowGrantModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Grant Single Access
          </button>
          <button
            onClick={() => {
              setGrantType('multiple');
              setShowGrantModal(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <BookOpenCheck className="w-4 h-4" />
            Grant Multiple Access
          </button>
          <button
            onClick={() => {
              setGrantType('all');
              setShowGrantModal(true);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Grant All Access
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Access</p>
              <p className="text-2xl font-bold text-gray-900">{accessData.length}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Access</p>
              <p className="text-2xl font-bold text-green-600">{accessData.filter(a => a.isActive).length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Manual Grants</p>
              <p className="text-2xl font-bold text-blue-600">{accessData.filter(a => a.accessType === 'manual').length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Users</p>
              <p className="text-2xl font-bold text-purple-600">{Object.keys(groupedAccess).length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by user name, email, or course title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="purchased">Purchased</option>
              <option value="manual">Manual</option>
              <option value="premium">Premium</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Access Table - Grouped by User */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Access Types
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(groupedAccess).map(([userId, userAccesses]) => {
                const firstAccess = userAccesses[0];
                const activeCount = userAccesses.filter(a => a.isActive).length;
                const totalCount = userAccesses.length;
                
                return (
                  <tr key={userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{firstAccess.userName}</div>
                        <div className="text-sm text-gray-500">{firstAccess.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {userAccesses.length} Course{userAccesses.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500">
                        {userAccesses.slice(0, 3).map(access => access.courseTitle).join(', ')}
                        {userAccesses.length > 3 && ` +${userAccesses.length - 3} more`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {Array.from(new Set(userAccesses.map(a => a.accessType))).map(type => (
                          <span key={type} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessTypeColor(type)}`}>
                            {getAccessTypeIcon(type)}
                            <span className="ml-1 capitalize">{type}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activeCount === totalCount ? 'bg-green-100 text-green-800' : 
                        activeCount === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {activeCount === totalCount ? (
                          <>
                            <Unlock className="w-3 h-3 mr-1" />
                            All Active
                          </>
                        ) : activeCount === 0 ? (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            All Inactive
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            {activeCount}/{totalCount} Active
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {activeCount > 0 && (
                          <button
                            onClick={() => handleBulkRevoke(userId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Revoke All
                          </button>
                        )}
                        {activeCount < totalCount && (
                          <button
                            onClick={() => handleBulkActivate(userId)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Activate All
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Access Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Grant Course Access - {grantType === 'single' ? 'Single Course' : grantType === 'multiple' ? 'Multiple Courses' : 'All Courses'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter user's email address"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  User will see courses when they login with this email
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter user's full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {(grantType === 'single' || grantType === 'multiple') && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {grantType === 'single' ? 'Select Course' : 'Select Courses'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllCourses}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        Select All
                      </button>
                      <button
                        onClick={clearCourseSelection}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {courseData.map((course) => (
                      <label key={course.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.id)}
                          onChange={() => toggleCourseSelection(course.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm">{course.title}</span>
                      </label>
                    ))}
                  </div>
                  {grantType === 'multiple' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected: {selectedCourses.length} Course{selectedCourses.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}

              {grantType === 'all' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    This will grant access to all {courseData.length} courses for the user.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    User will see all courses when they login with the provided email.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowGrantModal(false);
                  setUserEmail('');
                  setUserName('');
                  setSelectedCourses([]);
                  setGrantType('single');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleGrantAccess}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Granting...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Grant Access
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseAccessManagement;