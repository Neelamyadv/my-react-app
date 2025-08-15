import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, BarChart3, Settings, LogOut, CreditCard, Menu, X, BookOpen, GraduationCap } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import ContactMessages from './ContactMessages';
import PaymentManagement from './PaymentManagement';
import EbookAccessManagement from './EbookAccessManagement';
import CourseAccessManagement from './CourseAccessManagement';
import AdminSettings from './AdminSettings';
import AdminAuthGuard from '../Auth/AdminAuthGuard';
import { useAuth } from '../../lib/auth';

const AdminPanel: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const { signOut } = useAuth();

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'courses', name: 'Course Access', icon: GraduationCap },
    { id: 'ebooks', name: 'eBook Access', icon: BookOpen },
    { id: 'messages', name: 'Messages', icon: MessageSquare },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const handleNavigation = (pageId: string) => {
    setCurrentPage(pageId);
  };

  useEffect(() => {
    // Check if user has admin access
    const adminAccess = sessionStorage.getItem('admin_access') === 'true';
    setHasAccess(adminAccess);
  }, []);

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  const handleSignOut = async () => {
    try {
      // Clear admin access
      sessionStorage.removeItem('admin_access');
      setHasAccess(false);
      await signOut();
      window.location.href = '/';
    } catch (error) {
      // Error signing out
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard onNavigate={handleNavigation} />;
      case 'users':
        return <UserManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'courses':
        return <CourseAccessManagement />;
      case 'ebooks':
        return <EbookAccessManagement />;
      case 'messages':
        return <ContactMessages />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--admin-bg)]">
      {/* Top Header Bar */}
      <div className="bg-[var(--admin-card)] border-b border-[var(--admin-border)] px-4 md:px-6 py-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          {/* Left Side - Branding */}
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-8 w-8 rounded-lg flex items-center justify-center shadow-md">
              <img src="images\wfavicon.svg" alt="Your Company Logo" className="h-4 w-4" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-[var(--admin-text)]">Zyntiq Admin</h1>
              <p className="text-xs text-[var(--admin-text-secondary)]">Elevate Your Skills - Administration</p>
            </div>
            <div className="md:hidden">
              <h1 className="text-sm font-bold text-[var(--admin-text)]">Zyntiq Admin</h1>
            </div>
          </div>

          {/* Center - Navigation Icons */}
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`p-2 rounded-md transition-all ${
                    currentPage === item.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-[var(--admin-text-secondary)] hover:bg-[var(--admin-border)] hover:bg-opacity-30'
                  }`}
                  title={item.name}
                >
                  <IconComponent className="h-5 w-5" />
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[var(--admin-text-secondary)] hover:bg-[var(--admin-border)] hover:bg-opacity-30 transition-all"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Right Side - Empty on mobile, User Info & Sign Out on desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-[var(--admin-text)]">Admin User</p>
              <p className="text-xs text-[var(--admin-text-secondary)]">admin@zyntiq.in</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center p-2 text-[var(--admin-text-secondary)] hover:bg-[var(--admin-border)] hover:bg-opacity-30 rounded-md transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Side Menu */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-[var(--admin-card)] z-40 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4 border-b border-[var(--admin-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--admin-text)]">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[var(--admin-text-secondary)] hover:bg-[var(--admin-border)] hover:bg-opacity-30 rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleNavigation(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-md text-left transition-all ${
                  currentPage === item.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-[var(--admin-text)] hover:bg-[var(--admin-border)] hover:bg-opacity-30'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--admin-border)]">
          <div className="mb-4 text-center">
            <p className="text-sm font-medium text-[var(--admin-text)]">Admin User</p>
            <p className="text-xs text-[var(--admin-text-secondary)]">admin@zyntiq.in</p>
          </div>
          <button
            onClick={() => {
              handleSignOut();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20">
        {renderContent()}
      </div>
    </div>
  );
};

// Wrap the component with authentication guard
const AdminPanelWithAuth: React.FC = () => {
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    const adminAccess = sessionStorage.getItem('admin_access') === 'true';
    setHasAccess(adminAccess);
  }, []);

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  if (!hasAccess) {
    return <AdminAuthGuard onAccessGranted={handleAccessGranted} panelType="admin" />;
  }

  return <AdminPanel />;
};

export default AdminPanelWithAuth;
