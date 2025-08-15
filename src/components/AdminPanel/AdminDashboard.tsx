import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Zap, Activity } from 'lucide-react';
// import { localDB } from '../../lib/database'; // Unused import
import { User, Enrollment, ContactMessage } from '../../lib/supabase';

interface DashboardStats {
  totalUsers: number;
  totalEnrollments: number;
  totalRevenue: number;
  totalMessages: number;
  premiumUsers: number;
  courseCompletions: number;
}

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    totalMessages: 0,
    premiumUsers: 0,
    courseCompletions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Get all data from localStorage
      const users: User[] = JSON.parse(localStorage.getItem('zyntiq_users') || '[]');
      const enrollments: Enrollment[] = JSON.parse(localStorage.getItem('zyntiq_enrollments') || '[]');
      const messages: ContactMessage[] = JSON.parse(localStorage.getItem('zyntiq_contact_messages') || '[]');

      // Calculate stats
      const totalRevenue = enrollments.reduce((sum, enrollment) => sum + enrollment.amount_paid, 0);
      const premiumUsers = enrollments.filter(e => e.enrollment_type === 'premium_pass').length;
      const courseCompletions = enrollments.filter(e => e.status === 'completed').length;

      setStats({
        totalUsers: users.length,
        totalEnrollments: enrollments.length,
        totalRevenue,
        totalMessages: messages.length,
        premiumUsers,
        courseCompletions
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      page: 'users'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-purple-500',
      page: 'payments'
    },
    {
      title: 'Premium Users',
      value: stats.premiumUsers.toLocaleString(),
      icon: Zap,
      color: 'bg-pink-500',
      page: 'premium'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-md shadow-sm">
          <span className="text-sm text-gray-600 font-medium">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className="bg-[var(--admin-card)] rounded-lg shadow-sm p-4 md:p-5 hover:shadow transition-all duration-200 cursor-pointer border border-[var(--admin-border)] min-h-[100px] md:min-h-0"
              onClick={() => onNavigate(card.page)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-[var(--admin-text-secondary)] uppercase tracking-wider mb-1">{card.title}</p>
                  <p className="text-xl md:text-2xl font-semibold text-[var(--admin-text)]">{card.value}</p>
                </div>
                <div className={`${card.color} rounded-lg p-2.5 md:p-3 ml-4`}>
                  <IconComponent className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        {/* Recent Activity */}
        <div className="bg-[var(--admin-card)] rounded-lg shadow-sm p-4 md:p-5 border border-[var(--admin-border)]">
          <h3 className="text-md font-medium text-[var(--admin-text)] mb-4 flex items-center">
            <Activity className="h-4 w-4 text-indigo-500 mr-2" />
            Recent Activity
          </h3>
          <div className="text-center py-8">
            <div className="text-[var(--admin-text-secondary)] mb-3">
              <Activity className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <p className="text-sm text-[var(--admin-text-secondary)]">No recent activity</p>
            <p className="text-xs text-[var(--admin-text-secondary)] mt-1">Activity will appear here as users interact with the platform</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--admin-card)] rounded-lg shadow-sm p-4 md:p-5 border border-[var(--admin-border)]">
          <h3 className="text-md font-medium text-[var(--admin-text)] mb-4 flex items-center">
            <Zap className="h-4 w-4 text-indigo-500 mr-2" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('users')}
              className="p-4 bg-[var(--admin-border)] bg-opacity-30 hover:bg-opacity-50 rounded-md text-left transition-all duration-200 border border-[var(--admin-border)] hover:border-[var(--admin-border)] min-h-[80px] md:min-h-0"
            >
              <Users className="h-5 w-5 text-indigo-500 mb-2" />
              <span className="text-sm font-medium text-[var(--admin-text)]">Manage Users</span>
            </button>

            <button
              onClick={() => onNavigate('payments')}
              className="p-4 bg-[var(--admin-border)] bg-opacity-30 hover:bg-opacity-50 rounded-md text-left transition-all duration-200 border border-[var(--admin-border)] hover:border-[var(--admin-border)] min-h-[80px] md:min-h-0"
            >
              <CreditCard className="h-5 w-5 text-indigo-500 mb-2" />
              <span className="text-sm font-medium text-[var(--admin-text)]">View Payments</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
