import React, { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { Enrollment, User } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface EnrollmentManagementProps {
  onBack: () => void;
}

const EnrollmentManagement: React.FC<EnrollmentManagementProps> = ({ onBack }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEnrollments();
  }, [enrollments, searchTerm, statusFilter, typeFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const enrollmentData: Enrollment[] = JSON.parse(localStorage.getItem('zyntiq_enrollments') || '[]');
      const userData: User[] = JSON.parse(localStorage.getItem('zyntiq_users') || '[]');
      
      setEnrollments(enrollmentData);
      setUsers(userData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load enrollment data');
    } finally {
      setLoading(false);
    }
  };

  const filterEnrollments = () => {
    let filtered = enrollments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(enrollment => {
        const user = users.find(u => u.id === enrollment.user_id);
        const userName = user ? `${user.first_name} ${user.last_name}` : '';
        
        return enrollment.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               enrollment.payment_id.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.enrollment_type === typeFilter);
    }

    setFilteredEnrollments(filtered);
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
  };

  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'unknown@email.com';
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      suspended: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeStyles = {
      course: 'bg-purple-100 text-purple-800',
      premium_pass: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeStyles[type as keyof typeof typeStyles] || 'bg-gray-100 text-gray-800'}`}>
        {type === 'premium_pass' ? 'Premium Pass' : 'Course'}
      </span>
    );
  };

  const exportData = () => {
    const csvData = filteredEnrollments.map(enrollment => ({
      'User Name': getUserName(enrollment.user_id),
      'Email': getUserEmail(enrollment.user_id),
      'Course': enrollment.course_name,
      'Type': enrollment.enrollment_type,
      'Amount': enrollment.amount_paid,
      'Status': enrollment.status,
      'Progress': `${enrollment.progress}%`,
      'Enrolled Date': new Date(enrollment.enrolled_at).toLocaleDateString(),
      'Payment ID': enrollment.payment_id
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enrollments.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Enrollment data exported successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">Enrollment Management</h1>
          <p className="text-gray-600">Monitor and manage course enrollments</p>
        </div>
        <button
          onClick={exportData}
          className="flex items-center px-4 py-3 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full md:w-auto justify-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search enrollments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="course">Course</option>
            <option value="premium_pass">Premium Pass</option>
          </select>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-6">
        {filteredEnrollments.length} of {enrollments.length} enrollments
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEnrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getUserName(enrollment.user_id)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getUserEmail(enrollment.user_id)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{enrollment.course_name}</div>
                    <div className="text-sm text-gray-500">{enrollment.payment_id}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(enrollment.enrollment_type)}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{enrollment.amount_paid.toLocaleString()}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{enrollment.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(enrollment.status)}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEnrollments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No enrollments found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentManagement;
