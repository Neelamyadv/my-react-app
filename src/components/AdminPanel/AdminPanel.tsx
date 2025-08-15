import React, { useState } from 'react';
import { Users, MessageSquare, BarChart3, Settings, LogOut, CreditCard, Menu, X, BookOpen, GraduationCap } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import ContactMessages from './ContactMessages';
import PaymentManagement from './PaymentManagement';
import EbookAccessManagement from './EbookAccessManagement';
import CourseAccessManagement from './CourseAccessManagement';
import { useAuth } from '../../lib/auth';

const AdminPanel: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleSignOut = async () => {
    try {
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
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold text-[var(--admin-text)] mb-6">Admin Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="bg-[var(--admin-card)] rounded-lg shadow-sm p-4 md:p-6 border border-[var(--admin-border)]">
                <h2 className="text-lg font-semibold text-[var(--admin-text)] mb-4">General Settings</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Site Name</label>
                    <input type="text" className="w-full px-3 py-2 rounded-md bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]" placeholder="Zyntiq" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Logo URL</label>
                    <input type="text" className="w-full px-3 py-2 rounded-md bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]" placeholder="https://..." />
                  </div>
                  <button type="button" className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                </form>
              </div>
              {/* Email Settings */}
              <div className="bg-[var(--admin-card)] rounded-lg shadow-sm p-4 md:p-6 border border-[var(--admin-border)]">
                <h2 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Email Configuration</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">SMTP Server</label>
                    <input type="text" className="w-full px-3 py-2 rounded-md bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]" placeholder="smtp.example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Sender Email</label>
                    <input type="email" className="w-full px-3 py-2 rounded-md bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]" placeholder="admin@zyntiq.in" />
                  </div>
                  <button type="button" className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                </form>
              </div>
              {/* Payment Settings */}
              <div className="bg-[var(--admin-card)] rounded-lg shadow-sm p-4 md:p-6 border border-[var(--admin-border)]">
                <h2 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Payment Settings</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Payment Gateway Key</label>
                    <input type="text" className="w-full px-3 py-2 rounded-md bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]" placeholder="rzp_test_..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Currency</label>
                    <input type="text" className="w-full px-3 py-2 rounded-md bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]" placeholder="INR" />
                  </div>
                  <button type="button" className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                </form>
              </div>
              {/* Security Settings */}
              <div className="bg-[var(--admin-card)] rounded-lg shadow-sm p-4 md:p-6 border border-[var(--admin-border)]">
                <h2 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Security Settings</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-1">Password Policy</label>
                    <select className="w-full px-3 py-2 rounded-md bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]">
                      <option>Minimum 6 characters</option>
                      <option>Minimum 8 characters, 1 number</option>
                      <option>Minimum 10 characters, 1 number, 1 symbol</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="2fa" className="accent-indigo-600" />
                    <label htmlFor="2fa" className="text-[var(--admin-text-secondary)] text-sm">Enable Two-Factor Authentication</label>
                  </div>
                  <button type="button" className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                </form>
              </div>
            </div>
          </div>
        );
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
            <a
              href="/access"
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              title="Access Panel"
            >
              <Users className="h-4 w-4" />
              Access Panel
            </a>
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

export default AdminPanel;
