import React, { useState, useEffect, useCallback } from 'react';
import { Search, Download, CreditCard } from 'lucide-react';
import { Enrollment, User } from '../../lib/supabase';
import toast from 'react-hot-toast';

// Define a Payment interface based on the enrollment data
interface Payment {
  id: string;
  payment_id: string;
  user_id: string;
  amount: number;
  payment_date: string;
  payment_type: 'course' | 'premium_pass';
  course_name?: string;
  status: 'success';
}

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, typeFilter, filterPayments]);

  const loadData = async () => {
    try {
      setLoading(true);
      const enrollmentData: Enrollment[] = JSON.parse(localStorage.getItem('zyntiq_enrollments') || '[]');
      const userData: User[] = JSON.parse(localStorage.getItem('zyntiq_users') || '[]');
      
      // Convert enrollments to payments (since payments are derived from enrollments in this demo)
      const paymentData: Payment[] = enrollmentData.map(enrollment => ({
        id: enrollment.id,
        payment_id: enrollment.payment_id,
        user_id: enrollment.user_id,
        amount: enrollment.amount_paid,
        payment_date: enrollment.enrolled_at,
        payment_type: enrollment.enrollment_type,
        course_name: enrollment.course_name,
        status: 'success' // All payments are successful in this demo
      }));
      
      setPayments(paymentData);
      setUsers(userData);
    } catch (error) {
      console.error('Error loading payment data:', error);
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = useCallback(() => {
    let filtered = payments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment => {
        const user = users.find(u => u.id === payment.user_id);
        const userName = user ? `${user.first_name} ${user.last_name}` : '';
        
        return payment.payment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
               userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (payment.course_name && payment.course_name.toLowerCase().includes(searchTerm.toLowerCase()));
      });
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(payment => payment.payment_type === typeFilter);
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, typeFilter, users]);

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
  };

  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'unknown@email.com';
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const exportData = () => {
    const csvData = filteredPayments.map(payment => ({
      'Payment ID': payment.payment_id,
      'User Name': getUserName(payment.user_id),
      'Email': getUserEmail(payment.user_id),
      'Amount': payment.amount,
      'Type': payment.payment_type === 'premium_pass' ? 'Premium Pass' : 'Course',
      'Course/Item': payment.course_name || 'Premium Pass',
      'Date': formatDate(payment.payment_date),
      'Status': 'Success'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Payment data exported successfully');
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--admin-text)]">Payment Management</h1>
          <p className="text-[var(--admin-text-secondary)]">Track and manage all payment transactions</p>
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[var(--admin-text-secondary)]" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2 border border-[var(--admin-border)] rounded-md leading-5 bg-[var(--admin-card)] placeholder-[var(--admin-text-secondary)] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-sm text-[var(--admin-text)]"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="block w-full md:w-auto pl-3 pr-10 py-2 text-sm border-[var(--admin-border)] bg-[var(--admin-card)] text-[var(--admin-text)] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="course">Course</option>
            <option value="premium_pass">Premium Pass</option>
          </select>
        </div>
        
        <div className="text-sm text-[var(--admin-text-secondary)]">
          {filteredPayments.length} of {payments.length} payments
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[var(--admin-card)] shadow-sm overflow-hidden border border-[var(--admin-border)] sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--admin-border)]">
            <thead className="bg-[var(--admin-border)] bg-opacity-30">
              <tr>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  Payment ID
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--admin-card)] divide-y divide-[var(--admin-border)]">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-[var(--admin-border)] hover:bg-opacity-30">
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[var(--admin-text)]">
                    {payment.payment_id}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-[var(--admin-text)]">
                        {getUserName(payment.user_id)}
                      </div>
                      <div className="text-sm text-[var(--admin-text-secondary)]">
                        {getUserEmail(payment.user_id)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[var(--admin-text)]">
                    {payment.course_name || 'Premium Pass'}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(payment.payment_type)}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--admin-text)]">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[var(--admin-text)]">
                    {formatDate(payment.payment_date)}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900 bg-opacity-30 text-green-400">
                      Success
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center justify-center">
              <CreditCard className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">No payments found matching your criteria.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;