import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Video, 
  Award, 
  ArrowLeft, 
  ArrowRight,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Target,
  LogOut
} from 'lucide-react';
import { PaymentType } from '../../lib/razorpay';
import toast from 'react-hot-toast';
import AnalyticsAccessControl from './AnalyticsAccessControl';

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

interface DailyStats {
  date: string;
  totalRevenue: number;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  paymentTypeBreakdown: Record<PaymentType, number>;
  revenueByType: Record<PaymentType, number>;
}

const PaymentAnalyticsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has access
    const accessGranted = sessionStorage.getItem('analytics_access') === 'true';
    setHasAccess(accessGranted);
    
    // Always ensure we start with current date
    const currentDate = new Date().toISOString().split('T')[0];
    setSelectedDate(currentDate);
    
    if (accessGranted) {
      loadPaymentData();
    }
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      const enrollmentData = JSON.parse(localStorage.getItem('zyntiq_enrollments') || '[]');
      
      const paymentData: Payment[] = enrollmentData.map((enrollment: any) => ({
        id: enrollment.id,
        payment_id: enrollment.payment_id,
        user_id: enrollment.user_id,
        amount: enrollment.amount_paid,
        payment_date: enrollment.enrolled_at,
        payment_type: enrollment.enrollment_type as PaymentType,
        course_name: enrollment.course_name,
        status: 'success'
      }));
      
      setPayments(paymentData);
    } catch (error) {
      console.error('Error loading payment data:', error);
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentsForDate = useCallback((date: string) => {
    return payments.filter(payment => {
      const paymentDate = new Date(payment.payment_date).toISOString().split('T')[0];
      return paymentDate === date;
    });
  }, [payments]);

  const getPaymentsForDateRange = useCallback((startDate: string, endDate: string) => {
    return payments.filter(payment => {
      const paymentDate = new Date(payment.payment_date).toISOString().split('T')[0];
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }, [payments]);

  const calculateDailyStats = useCallback((date: string): DailyStats => {
    const dayPayments = getPaymentsForDate(date);
    
    const totalRevenue = dayPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPayments = dayPayments.length;
    const successfulPayments = dayPayments.filter(p => p.status === 'success').length;
    const failedPayments = dayPayments.filter(p => p.status === 'failed').length;
    
    const paymentTypeBreakdown = dayPayments.reduce((acc, payment) => {
      acc[payment.payment_type] = (acc[payment.payment_type] || 0) + 1;
      return acc;
    }, {} as Record<PaymentType, number>);
    
    const revenueByType = dayPayments.reduce((acc, payment) => {
      acc[payment.payment_type] = (acc[payment.payment_type] || 0) + payment.amount;
      return acc;
    }, {} as Record<PaymentType, number>);

    return {
      date,
      totalRevenue,
      totalPayments,
      successfulPayments,
      failedPayments,
      paymentTypeBreakdown,
      revenueByType
    };
  }, [getPaymentsForDate]);

  const calculateRangeStats = useCallback((startDate: string, endDate: string) => {
    const rangePayments = getPaymentsForDateRange(startDate, endDate);
    
    const totalRevenue = rangePayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPayments = rangePayments.length;
    const successfulPayments = rangePayments.filter(p => p.status === 'success').length;
    const failedPayments = rangePayments.filter(p => p.status === 'failed').length;
    
    const paymentTypeBreakdown = rangePayments.reduce((acc, payment) => {
      acc[payment.payment_type] = (acc[payment.payment_type] || 0) + 1;
      return acc;
    }, {} as Record<PaymentType, number>);
    
    const revenueByType = rangePayments.reduce((acc, payment) => {
      acc[payment.payment_type] = (acc[payment.payment_type] || 0) + payment.amount;
      return acc;
    }, {} as Record<PaymentType, number>);

    return {
      totalRevenue,
      totalPayments,
      successfulPayments,
      failedPayments,
      paymentTypeBreakdown,
      revenueByType
    };
  }, [getPaymentsForDateRange]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const getPaymentTypeIcon = (type: PaymentType) => {
    switch (type) {
      case PaymentType.COURSE: return <GraduationCap className="w-4 h-4" />;
      case PaymentType.PREMIUM_PASS: return <Users className="w-4 h-4" />;
      case PaymentType.LIVE_TRAINING: return <Video className="w-4 h-4" />;
      case PaymentType.VAC: return <Award className="w-4 h-4" />;
      case PaymentType.EBOOK: return <BookOpen className="w-4 h-4" />;
      case PaymentType.EBOOK_BUNDLE: return <BookOpen className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getPaymentTypeLabel = (type: PaymentType) => {
    switch (type) {
      case PaymentType.COURSE: return 'Courses';
      case PaymentType.PREMIUM_PASS: return 'Premium Pass';
      case PaymentType.LIVE_TRAINING: return 'Live Training';
      case PaymentType.VAC: return 'VAC Certificates';
      case PaymentType.EBOOK: return 'eBooks';
      case PaymentType.EBOOK_BUNDLE: return 'eBook Bundles';
      default: return type;
    }
  };

  const getPaymentTypeColor = (type: PaymentType) => {
    switch (type) {
      case PaymentType.COURSE: return 'text-purple-600 bg-purple-100';
      case PaymentType.PREMIUM_PASS: return 'text-yellow-600 bg-yellow-100';
      case PaymentType.LIVE_TRAINING: return 'text-blue-600 bg-blue-100';
      case PaymentType.VAC: return 'text-green-600 bg-green-100';
      case PaymentType.EBOOK: return 'text-orange-600 bg-orange-100';
      case PaymentType.EBOOK_BUNDLE: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exportDailyReport = () => {
    const stats = calculateDailyStats(selectedDate);
    const dayPayments = getPaymentsForDate(selectedDate);
    
    const csvData = [
      ['Date', 'Total Revenue', 'Total Payments', 'Successful Payments', 'Failed Payments'],
      [selectedDate, stats.totalRevenue, stats.totalPayments, stats.successfulPayments, stats.failedPayments],
      [],
      ['Payment Type', 'Count', 'Revenue'],
      ...Object.entries(stats.paymentTypeBreakdown).map(([type, count]) => [
        getPaymentTypeLabel(type as PaymentType),
        count,
        stats.revenueByType[type as PaymentType] || 0
      ]),
      [],
      ['Payment ID', 'User ID', 'Amount', 'Type', 'Status', 'Date'],
      ...dayPayments.map(payment => [
        payment.payment_id,
        payment.user_id,
        payment.amount,
        getPaymentTypeLabel(payment.payment_type),
        payment.status,
        new Date(payment.payment_date).toLocaleString()
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-report-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success(`Daily report for ${selectedDate} exported successfully`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleAccessGranted = () => {
    setHasAccess(true);
    loadPaymentData();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('analytics_access');
    setHasAccess(false);
    toast.success('Logged out successfully');
  };

  if (!hasAccess) {
    return <AnalyticsAccessControl onAccessGranted={handleAccessGranted} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentStats = calculateDailyStats(selectedDate);
  const dayPayments = getPaymentsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-[#1d3e53] via-[#254b62] to-[#476d7c] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                📊 Payment Analytics Dashboard
              </h1>
              <p className="text-gray-300">Daily conversion tracking and revenue analytics for HR team</p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button
                onClick={exportDailyReport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 bg-white/90 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                />
              </div>
              
              <button
                onClick={() => navigateDate('next')}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="text-lg font-semibold text-white">
              {formatDate(selectedDate)}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-green-400">₹{currentStats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300 mb-1">Total Payments</p>
                <p className="text-2xl font-bold text-blue-400">{currentStats.totalPayments}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Type Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-400" />
              Payment Type Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(currentStats.paymentTypeBreakdown).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getPaymentTypeColor(type as PaymentType)}`}>
                      {getPaymentTypeIcon(type as PaymentType)}
                    </div>
                    <span className="font-medium text-white">
                      {getPaymentTypeLabel(type as PaymentType)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">{count}</div>
                    <div className="text-sm text-gray-300">
                      ₹{currentStats.revenueByType[type as PaymentType]?.toLocaleString() || 0}
                    </div>
                  </div>
                </div>
              ))}
              {Object.keys(currentStats.paymentTypeBreakdown).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No payments recorded for this date</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Revenue by Type
            </h3>
            <div className="space-y-3">
              {Object.entries(currentStats.revenueByType)
                .sort(([,a], [,b]) => b - a)
                .map(([type, revenue]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getPaymentTypeColor(type as PaymentType)}`}>
                      {getPaymentTypeIcon(type as PaymentType)}
                    </div>
                    <span className="font-medium text-white">
                      {getPaymentTypeLabel(type as PaymentType)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-400">₹{revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-300">
                      {currentStats.totalRevenue > 0 
                        ? Math.round((revenue / currentStats.totalRevenue) * 100)
                        : 0}% of total
                    </div>
                  </div>
                </div>
              ))}
              {Object.keys(currentStats.revenueByType).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <TrendingDown className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No revenue recorded for this date</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Payments Table */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Recent Payments ({dayPayments.length})
          </h3>
          
          {dayPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/20">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {dayPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {payment.payment_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${getPaymentTypeColor(payment.payment_type)}`}>
                            {getPaymentTypeIcon(payment.payment_type)}
                          </div>
                          <span className="text-sm text-white">
                            {getPaymentTypeLabel(payment.payment_type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                        ₹{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(payment.payment_date).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          payment.status === 'success' 
                            ? 'bg-green-500/20 text-green-400'
                            : payment.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No payments recorded for {formatDate(selectedDate)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalyticsPage;