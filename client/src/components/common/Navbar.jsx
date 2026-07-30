import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, Menu, X, Sun, Moon, User as UserIcon, LayoutDashboard, Store, Briefcase } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toggleDarkMode } from '../../redux/slices/uiSlice';

const Navbar = () => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const darkMode = useSelector((state) => state.ui.darkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll transparency management
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Services', path: '/search' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white dark:bg-dark-900 shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Ustad Hub" className="h-16 sm:h-20 w-auto max-w-[190px] object-contain" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-blue-500'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                {user?.role === 'business_owner' && (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/profile"
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-dark-700 dark:text-gray-300 dark:hover:border-blue-900/50 dark:hover:text-blue-300"
                    >
                      <UserIcon size={14} />
                      Customer View
                    </Link>
                    <Link
                      to="/business/profile"
                      className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      <Briefcase size={14} />
                      Business Owner View
                    </Link>
                  </div>
                )}

                {/* Admin button shortcut */}
                {['super_admin', 'admin', 'moderator'].includes(user?.role) && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600"
                  >
                    <LayoutDashboard size={16} />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Prominent Role Badge */}
                <div className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm transition-all hover:scale-105">
                  {user?.role === 'business_owner' ? '💼 Business Owner' : '👤 Customer'}
                </div>

                {/* Profile avatar link */}
                <Link to="/profile" className="flex items-center gap-2 bg-gray-50 dark:bg-dark-800 border border-gray-100 dark:border-dark-700/60 pl-2 pr-3 py-1 rounded-2xl hover:border-gray-200 dark:hover:border-dark-700 transition-colors">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={user?.fullName || 'User'}
                    className="w-7 h-7 rounded-full border border-blue-500 object-cover"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-900 dark:text-white font-outfit max-w-[120px] truncate">
                      {user?.fullName}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400 -mt-0.5">
                      {user?.role === 'business_owner' ? 'Businessman' : 'Customer'}
                    </span>
                  </div>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="md:hidden flex items-center gap-3">
            {/* Theme Toggle (Mobile) */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-800 py-4 px-6 shadow-lg animate-in fade-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                {link.name}
              </Link>
            ))}
            
            <hr className="border-gray-200 dark:border-dark-800" />
            
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={user?.fullName || 'User'}
                    className="w-10 h-10 rounded-full object-cover border border-blue-500"
                  />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white font-outfit">{user?.fullName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 rounded-md">
                      {user?.role === 'business_owner' ? 'Businessman' : 'Customer'}
                    </span>
                  </div>
                </div>

                {['super_admin', 'admin', 'moderator'].includes(user?.role) && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-base font-medium text-blue-500"
                  >
                    <LayoutDashboard size={18} />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {user?.role === 'business_owner' && (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-300"
                    >
                      <UserIcon size={18} />
                      <span>Customer View</span>
                    </Link>
                    <Link
                      to="/business/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-base font-medium text-blue-500"
                    >
                      <Briefcase size={18} />
                      <span>Business Owner View</span>
                    </Link>
                  </div>
                )}

                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 text-base font-medium text-red-500 w-full text-left"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
