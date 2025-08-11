import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, UserPlus, Mail, Phone, X, Plus, Minus } from 'lucide-react';
import { apiClient } from '../../lib/api';
import { logError, logInfo } from '../../lib/logger';
import toast from 'react-hot-toast';
interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}
interface Enrollment {
  id: number;
  course_name: string;
  status: string;
  enrolled_at: string;
  completed_at?: string;
  progress: number;
}
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userEnrollments, setUserEnrollments] = useState<Enrollment[]>([]);
  const [availableCourses] = useState([
    'Web Development',
    'Java Script Programming',
    'Angular Framework',
    'Chat GPT',
    'Digital Marketing',
    'Motion Design',
    'Excel Fundamental',
    'UI/UX Design',
    'Cyber Security'
  ]);
  const [availablePasses] = useState([
    'Premium Pass'
  ]);
  useEffect(() => {
    loadUsers();
  }, []);
  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);
  const loadUsers = async () => {
    try {
      setLoading(true);
      // Try to get users from backend API
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${apiClient.getToken()}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setUsers(result.data || []);
      } else {
        throw new Error('Failed to fetch users from API');
      }
    } catch (error) {
      logError('Error loading users', { error: error.message });
      toast.error('Failed to load users');
      // Fallback to demo data
      const demoUsers: User[] = [
        { id: 1, email: 'demo@example.com', name: 'Demo User', created_at: new Date().toISOString() },
        { id: 2, email: 'test@example.com', name: 'Test User', created_at: new Date().toISOString() }
      ];
      setUsers(demoUsers);
    } finally {
      setLoading(false);
    }
  };
  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }
    const filtered = users.filter(user =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    loadUserEnrollments(user.id);
    setShowEditModal(true);
  };
  const loadUserEnrollments = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/enrollments`, {
        headers: {
          'Authorization': `Bearer ${apiClient.getToken()}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setUserEnrollments(result.data || []);
      } else {
        throw new Error('Failed to fetch user enrollments');
      }
    } catch (error) {
      logError('Error loading user enrollments', { userId, error: error.message });
      setUserEnrollments([]);
    }
  };
  const addCourseToUser = (courseName: string) => {
    if (!selectedUser) return;
    // Check if user already has this course/pass
    const existingEnrollment = userEnrollments.find(enrollment => enrollment.course_name === courseName);
    if (existingEnrollment) {
      toast.error('User already has this course/pass');
      return;
    }
    try {
      const enrollmentData: Enrollment[] = JSON.parse(localStorage.getItem('zyntiq_enrollments') || '[]');
      // Determine enrollment type
      const enrollmentType = courseName === 'Premium Pass' ? 'premium_pass' : 'course';
      const newEnrollment: Enrollment = {
        id: `enrollment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: selectedUser.id,
        course_id: `course_${courseName.toLowerCase().replace(/\s+/g, '_')}`,
        course_name: courseName,
        enrollment_type: enrollmentType,
        amount_paid: 0,
        status: 'active',
        progress: 0,
        enrolled_at: new Date().toISOString(),
        payment_id: `manual_${Date.now()}`
      };
      const updatedEnrollments = [...enrollmentData, newEnrollment];
      localStorage.setItem('zyntiq_enrollments', JSON.stringify(updatedEnrollments));
      setUserEnrollments([...userEnrollments, newEnrollment]);
      toast.success(`Added ${courseName} to user`);
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Failed to add course');
    }
  };
  const removeCourseFromUser = (enrollmentId: string, courseName: string) => {
    if (!selectedUser) return;
    if (window.confirm(`Are you sure you want to remove ${courseName} from this user?`)) {
      try {
        const enrollmentData: Enrollment[] = JSON.parse(localStorage.getItem('zyntiq_enrollments') || '[]');
        const updatedEnrollments = enrollmentData.filter(enrollment => enrollment.id !== enrollmentId);
        localStorage.setItem('zyntiq_enrollments', JSON.stringify(updatedEnrollments));
        setUserEnrollments(userEnrollments.filter(enrollment => enrollment.id !== enrollmentId));
        toast.success(`Removed ${courseName} from user`);
      } catch (error) {
        console.error('Error removing course:', error);
        toast.error('Failed to remove course');
      }
    }
  };
  const getEnrolledCourses = () => {
    return userEnrollments.map(enrollment => enrollment.course_name);
  };
  const getAvailableCoursesForUser = () => {
    const enrolledCourses = getEnrolledCourses();
    return availableCourses.filter(course => !enrolledCourses.includes(course));
  };
  const getAvailablePassesForUser = () => {
    const enrolledCourses = getEnrolledCourses();
    return availablePasses.filter(pass => !enrolledCourses.includes(pass));
  };
  const EditUserModal = () => {
    if (!selectedUser) return null;
    const enrolledCourses = getEnrolledCourses();
    const availableCoursesForUser = getAvailableCoursesForUser();
    const availablePassesForUser = getAvailablePassesForUser();
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--admin-card)] rounded-lg p-4 md:p-6 w-full max-w-4xl shadow-xl border border-[var(--admin-border)] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-[var(--admin-text)]">
              Manage Courses for {selectedUser.first_name} {selectedUser.last_name}
            </h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)] transition-colors p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Courses */}
            <div>
              <h4 className="text-md font-medium text-[var(--admin-text)] mb-3">Current Enrollments</h4>
              {enrolledCourses.length === 0 ? (
                <p className="text-[var(--admin-text-secondary)] text-sm">No courses enrolled</p>
              ) : (
                <div className="space-y-2">
                  {userEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 bg-[var(--admin-border)] bg-opacity-30 rounded-lg">
                      <div>
                        <p className="text-[var(--admin-text)] font-medium">{enrollment.course_name}</p>
                        <p className="text-[var(--admin-text-secondary)] text-xs">
                          Type: {enrollment.enrollment_type} | Progress: {enrollment.progress}% | Status: {enrollment.status}
                        </p>
                      </div>
                      <button
                        onClick={() => removeCourseFromUser(enrollment.id, enrollment.course_name)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Remove Course"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Available Individual Courses */}
            <div>
              <h4 className="text-md font-medium text-[var(--admin-text)] mb-3">Individual Courses</h4>
              {availableCoursesForUser.length === 0 ? (
                <p className="text-[var(--admin-text-secondary)] text-sm">All individual courses enrolled</p>
              ) : (
                <div className="space-y-2">
                  {availableCoursesForUser.map((course) => (
                    <div key={course} className="flex items-center justify-between p-3 bg-[var(--admin-border)] bg-opacity-30 rounded-lg">
                      <p className="text-[var(--admin-text)]">{course}</p>
                      <button
                        onClick={() => addCourseToUser(course)}
                        className="text-green-400 hover:text-green-300 p-1"
                        title="Add Course"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Available Passes */}
            <div>
              <h4 className="text-md font-medium text-[var(--admin-text)] mb-3">Premium Pass</h4>
              {availablePassesForUser.length === 0 ? (
                <p className="text-[var(--admin-text-secondary)] text-sm">Premium Pass already enrolled</p>
              ) : (
                <div className="space-y-2">
                  {availablePassesForUser.map((pass) => (
                    <div key={pass} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{pass}</p>
                        <p className="text-purple-100 text-xs">Access to all courses</p>
                      </div>
                      <button
                        onClick={() => addCourseToUser(pass)}
                        className="text-white hover:text-purple-200 p-1"
                        title="Add Premium Pass"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
          <div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--admin-text)]">User Management</h1>
          <p className="text-[var(--admin-text-secondary)]">Manage and monitor user accounts</p>
        </div>
      </div>
      {/* Search and Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="relative mb-4 md:mb-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--admin-text-secondary)] h-4 w-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-[var(--admin-border)] rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full md:w-64 shadow-sm text-sm bg-[var(--admin-card)] text-[var(--admin-text)] placeholder-[var(--admin-text-secondary)]"
          />
        </div>
        <div className="text-sm text-[var(--admin-text-secondary)]">
          {filteredUsers.length} of {users.length} users
        </div>
      </div>
      {/* Users Table */}
      <div className="bg-[var(--admin-card)] shadow-sm overflow-hidden border border-[var(--admin-border)] sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--admin-border)]">
            <thead className="bg-[var(--admin-border)] bg-opacity-30">
              <tr>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--admin-card)] divide-y divide-[var(--admin-border)]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--admin-border)] hover:bg-opacity-30">
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-[var(--admin-text)]">
                        {user.first_name} {user.middle_name} {user.last_name}
                      </div>
                      <div className="text-sm text-[var(--admin-text-secondary)]">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[var(--admin-text)]">
                    {user.phone}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[var(--admin-text)]">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                                     <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                     <button
                       onClick={() => handleEditUser(user)}
                       className="text-green-400 hover:text-green-300 flex items-center p-1"
                       title="Manage Courses"
                     >
                       <Edit className="h-4 w-4" />
                     </button>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching your search.</p>
          </div>
        )}
      </div>
             {showEditModal && <EditUserModal />}
    </div>
  );
};
export default UserManagement;
