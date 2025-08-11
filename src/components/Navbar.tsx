import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Crown, Menu, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useEnrollment } from '../hooks/useEnrollment';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { hasPremiumPass } = useEnrollment();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Logged out successfully');
      navigate('/');
      setIsMobileMenuOpen(false);
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Training', path: '/training' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header className="py-1 px-4 sm:px-6 md:px-12 flex justify-between items-center relative z-50 bg-transparent opacity-100 backdrop-filter-none"> {/* Changed/Added classes here */}
        {/* Logo - Made Larger */}
        <Link to="/" className="flex items-center gap-3 z-50" onClick={closeMobileMenu}>
          <img 
            src="images\whitelogomain.png" 
            alt="Zyntiq Logo" 
            className="h-14 sm:h-14 md:h-16 w-auto object-contain"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex gap-6 xl:gap-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="text-neutral-50 hover:text-purple-600 transition-colors duration-300 font-light"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <Link
                  to="/account"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-purple-300 text-gray-700 hover:bg-gray-50 transition-colors duration-300 relative"
                >
                  <User size={20} />
                  {hasPremiumPass && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </Link>
                {hasPremiumPass && (
                  <div className="hidden xl:flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium border border-yellow-300">
                    <Crown className="w-3 h-3" />
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white hover:shadow-md transition-all duration-300"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="px-4 py-2 rounded-full border border-purple-300 text-gray-50 hover:bg-gradient-to-r from-purple-400 to-indigo-500 transition-colors duration-300 font-medium"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white hover:shadow-md transition-all duration-300 font-medium"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors z-50 bg-transparent" // Added bg-transparent here
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={closeMobileMenu} />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-60 max-w-[85vw] bg-white shadow-8xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${ 
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 pt-20">
          {/* Mobile Navigation */}
          <nav className="mb-8">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="block text-lg font-medium text-gray-800 hover:text-purple-600 transition-colors duration-300 py-2"
                    onClick={() => {
                      window.scrollTo(0, 0);
                      closeMobileMenu();
                    }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Auth Section */}
          <div className="border-t border-gray-200 pt-6">
            {user ? (
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center relative">
                    <User className="w-6 h-6 text-white" />
                    {hasPremiumPass && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {hasPremiumPass && (
                      <div className="flex items-center gap-1 mt-1">
                        <Crown className="w-3 h-3 text-yellow-600" />
                        <span className="text-xs font-medium text-yellow-700">Premium Member</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Actions */}
                <div className="space-y-3">
                  <Link
                    to="/account"
                    className="block w-full text-center py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                    onClick={closeMobileMenu}
                  >
                    My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center py-3 px-4 border-2 border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center py-3 px-4 border-2 border-purple-300 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                  onClick={closeMobileMenu}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              © 2024 Zyntiq. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;