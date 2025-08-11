import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Award, ChevronDown } from 'lucide-react';
import { useAuth } from '../../lib/auth.tsx';
import { localDB } from '../../lib/database';
import toast from 'react-hot-toast';
import MyCoursesPage from './MyCoursesPage';
import CertificatesPage from './CertificatesPage';

const AccountPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const getProfile = async () => {
      try {
        const { data, error } = await localDB.getProfile(user.id);

        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Error loading profile. Please try again later.');
          return;
        }

        if (data) {
          setProfile({
            first_name: data.first_name || '',
            middle_name: data.middle_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone: data.phone || ''
          });
        }
      } catch (error) {
        console.error('Error in getProfile:', error);
        toast.error('Error loading profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user, navigate]);

  const menuItems = [
    { icon: <User size={20} />, label: 'Profile', key: 'profile' },
    { icon: <BookOpen size={20} />, label: 'My Courses', key: 'courses' },
    { icon: <Award size={20} />, label: 'Certificates', key: 'certificates' }
  ];

  // Mobile dropdown items
  const mobileDropdownItems = [
    { 
      icon: <User size={18} />, 
      label: 'Profile', 
      key: 'profile'
    },
    { 
      icon: <BookOpen size={18} />, 
      label: 'My Courses', 
      key: 'courses'
    },
    { 
      icon: <Award size={18} />, 
      label: 'My Certificates', 
      key: 'certificates'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen yellow-gradient-bg py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4 mb-4 sm:mb-6"></div>
            <div className="h-48 sm:h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen yellow-gradient-bg py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 text-center sm:text-left">
          My <span className="gradient-text">Account</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card-dark rounded-2xl p-4 sm:p-6">
              
              {/* MOBILE: Purple Gradient Tab with Dropdown */}
              <div className="lg:hidden mb-4 relative">
                <div className="relative">
                  <button
                    onClick={() => setShowMobileDropdown(!showMobileDropdown)}
                    className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium text-base flex items-center justify-between hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <span>{menuItems.find(item => item.key === activeTab)?.label || 'Profile'}</span>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform duration-300 ${
                        showMobileDropdown ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                </div>
              </div>

              {/* DESKTOP: Simple Menu Items (No Dropdown, No Arrow) */}
              <ul className="hidden lg:block space-y-3">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setActiveTab(item.key)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 text-left group ${
                        activeTab === item.key
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-[1.02]'
                          : 'hover:bg-purple-50 text-gray-700 hover:text-purple-600 hover:shadow-md hover:scale-[1.01]'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        activeTab === item.key ? 'bg-white/20' : 'group-hover:bg-purple-100'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="font-semibold">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Quick Stats - Desktop Only */}
              <div className="hidden lg:block mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Account Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Member Since</span>
                    <span className="text-gray-800 font-semibold">2024</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Profile Views</span>
                    <span className="text-purple-600 font-semibold">127</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 relative">
            {/* Mobile Dropdown Menu - Layered Above Content */}
            {showMobileDropdown && (
              <div className="lg:hidden absolute top-0 left-0 right-0 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mb-4">
                {mobileDropdownItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveTab(item.key);
                      setShowMobileDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      activeTab === item.key ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      activeTab === item.key ? 'bg-purple-200' : 'bg-gray-100'
                    }`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Content Area */}
            <div className={`transition-all duration-300 ${showMobileDropdown ? 'mt-48' : ''}`}>
              {activeTab === 'profile' && (
                <div className="glass-card-dark rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Profile Information</h2>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300">
                      Edit Profile
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profile.first_name}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-base"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        value={profile.middle_name}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-base"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profile.last_name}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-base"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="flex gap-2">
                        <span className="px-3 py-3 bg-gray-100/80 backdrop-blur-sm rounded-lg text-base">+91</span>
                        <input
                          type="tel"
                          value={profile.phone}
                          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-base"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-base"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Profile Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                        Update Profile
                      </button>
                      <button className="flex-1 px-6 py-3 border-2 border-purple-300 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'courses' && <MyCoursesPage />}
              {activeTab === 'certificates' && <CertificatesPage />}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close mobile dropdown */}
      {showMobileDropdown && (
        <div 
          className="fixed inset-0 z-40 bg-transparent lg:hidden" 
          onClick={() => setShowMobileDropdown(false)}
        />
      )}
    </div>
  );
};

export default AccountPage;