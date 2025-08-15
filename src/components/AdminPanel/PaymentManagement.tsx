import React, { useState, useEffect, useCallback } from 'react';
import { Search, Download, CreditCard, BookOpen, GraduationCap, Users, Video, Award } from 'lucide-react';
import { Enrollment, User } from '../../lib/supabase';
import { PaymentType } from '../../lib/razorpay';
import toast from 'react-hot-toast';

// Define a Payment interface based on the enrollment data
interface Payment {
  id: string;
  payment_id: string;
  user_id: string;
  amount: number;
  payment_date: string;
  payment_type: PaymentType;
  course_name?: string;
  status: 'success' | 'pending' | 'failed';
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
        payment_type: enrollment.enrollment_type as PaymentType,
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

  const getTypeBadge = (type: PaymentType) => {
    const typeStyles = {
      [PaymentType.COURSE]: 'bg-purple-100 text-purple-800',
      [PaymentType.PREMIUM_PASS]: 'bg-yellow-100 text-yellow-800',
      [PaymentType.LIVE_TRAINING]: 'bg-blue-100 text-blue-800',
      [PaymentType.VAC]: 'bg-green-100 text-green-800',
      [PaymentType.EBOOK]: 'bg-orange-100 text-orange-800',
      [PaymentType.EBOOK_BUNDLE]: 'bg-red-100 text-red-800'
    };

    const typeLabels = {
      [PaymentType.COURSE]: 'Course',
      [PaymentType.PREMIUM_PASS]: 'Premium Pass',
      [PaymentType.LIVE_TRAINING]: 'Live Training',
      [PaymentType.VAC]: 'VAC Certificate',
      [PaymentType.EBOOK]: 'eBook',
      [PaymentType.EBOOK_BUNDLE]: 'eBook Bundle'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeStyles[type] || 'bg-gray-100 text-gray-800'}`}>
        {typeLabels[type] || type}
      </span>
    );
  };

  const getTypeIcon = (type: PaymentType) => {
    switch (type) {
      case PaymentType.COURSE:
        return <GraduationCap className="w-4 h-4" />;
      case PaymentType.PREMIUM_PASS:
        return <Users className="w-4 h-4" />;
      case PaymentType.LIVE_TRAINING:
        return <Video className="w-4 h-4" />;
      case PaymentType.VAC:
        return <Award className="w-4 h-4" />;
      case PaymentType.EBOOK:
        return <BookOpen className="w-4 h-4" />;
      case PaymentType.EBOOK_BUNDLE:
        return <BookOpen className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
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
      'Type': getTypeBadge(payment.payment_type).props.children,
      'Course/Item': payment.course_name || 'Premium Pass',
      'Date': formatDate(payment.payment_date),
      'Status': payment.status
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

  // Calculate summary statistics
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPayments = payments.length;
  const paymentTypeCounts = payments.reduce((acc, payment) => {
    acc[payment.payment_type] = (acc[payment.payment_type] || 0) + 1;
    return acc;
  }, {} as Record<PaymentType, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-[var(--admin-bg)] min-h-screen">
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--admin-text-secondary)]">Total Revenue</p>
              <p className="text-2xl font-bold text-[var(--admin-text)]">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--admin-text-secondary)]">Total Payments</p>
              <p className="text-2xl font-bold text-[var(--admin-text)]">{totalPayments}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--admin-text-secondary)]">Course Sales</p>
              <p className="text-2xl font-bold text-[var(--admin-text)]">{paymentTypeCounts[PaymentType.COURSE] || 0}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--admin-text-secondary)]">eBook Sales</p>
              <p className="text-2xl font-bold text-[var(--admin-text)]">{(paymentTypeCounts[PaymentType.EBOOK] || 0) + (paymentTypeCounts[PaymentType.EBOOK_BUNDLE] || 0)}</p>
            </div>
            <BookOpen className="w-8 h-8 text-orange-600" />
          </div>
        </div>
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
            <option value={PaymentType.COURSE}>Courses</option>
            <option value={PaymentType.PREMIUM_PASS}>Premium Pass</option>
            <option value={PaymentType.LIVE_TRAINING}>Live Training</option>
            <option value={PaymentType.VAC}>VAC Certificates</option>
            <option value={PaymentType.EBOOK}>eBooks</option>
            <option value={PaymentType.EBOOK_BUNDLE}>eBook Bundles</option>
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
                    {payment.course_name || getTypeBadge(payment.payment_type).props.children}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(payment.payment_type)}
                      {getTypeBadge(payment.payment_type)}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--admin-text)]">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-[var(--admin-text)]">
                    {formatDate(payment.payment_date)}
                  </td>
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      payment.status === 'success' 
                        ? 'bg-green-900 bg-opacity-30 text-green-400'
                        : payment.status === 'pending'
                        ? 'bg-yellow-900 bg-opacity-30 text-yellow-400'
                        : 'bg-red-900 bg-opacity-30 text-red-400'
                    }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
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