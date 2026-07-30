import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, Menu, X, Sun, Moon, User as UserIcon, LayoutDashboard, Briefcase, Search, Bell } from 'lucide-react';
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
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Browse',      path: '/search' },
    { name: 'Experts',     path: '/experts' },
    { name: 'Services',    path: '/services' },
    { name: 'Memberships', path: '/memberships' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isOpen
          ? 'bg-white/95 dark:bg-[#0a0f1e]/95 shadow-[0_4px_24px_rgba(19,28,42,0.08)] backdrop-blur-xl'
          : 'bg-white/80 dark:bg-[#0a0f1e]/70 backdrop-blur-lg'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="UstadHub" className="h-14 sm:h-16 w-auto max-w-[180px] object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 text-[13px] font-semibold tracking-wide transition-all rounded-lg relative group ${
                  isActive(link.path)
                    ? 'text-[#131c2a] dark:text-white'
                    : 'text-[#45464d] dark:text-gray-400 hover:text-[#131c2a] dark:hover:text-white'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#e9c178] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-full text-[#45464d] dark:text-gray-400 hover:bg-[#f0f3ff] dark:hover:bg-dark-800 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 relative">
                {/* Bell */}
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-[#45464d] dark:text-gray-400 hover:bg-[#f0f3ff] dark:hover:bg-dark-800 transition-colors relative"
                >
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#006a63] rounded-full ring-2 ring-white" />
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute top-12 right-20 w-80 bg-white rounded-2xl shadow-2xl border border-[rgba(198,198,206,0.4)] p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-3 border-b border-[rgba(198,198,206,0.3)] mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#131c2a]">Notifications</span>
                      <span className="text-[10px] font-bold text-[#006a63] bg-[#e6f7f6] px-2 py-0.5 rounded-full">2 New</span>
                    </div>
                    <div className="space-y-3">
                      <div className="p-2.5 rounded-xl bg-[#f0f3ff] text-xs">
                        <div className="font-bold text-[#131c2a]">Booking Confirmed</div>
                        <div className="text-[#76767e] mt-0.5">Your consultation with Elena Rostova is confirmed for tomorrow.</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#f0f3ff] text-xs">
                        <div className="font-bold text-[#131c2a]">Welcome to UstadHub</div>
                        <div className="text-[#76767e] mt-0.5">Explore local experts or list your business to get started.</div>
                      </div>
                    </div>
                  </div>
                )}

                {user?.role === 'business_owner' && (
                  <Link
                    to="/business/profile"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#006a63] hover:bg-[#00504a] rounded-lg transition-colors"
                  >
                    <Briefcase size={13} />
                    Business View
                  </Link>
                )}

                {['super_admin', 'admin', 'moderator'].includes(user?.role) && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-100 transition-colors"
                  >
                    <LayoutDashboard size={14} />
                    Admin
                  </Link>
                )}

                {/* Profile avatar */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl border border-[rgba(198,198,206,0.5)] hover:border-[#006a63]/40 transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={user?.fullName || 'User'}
                    className="w-7 h-7 rounded-full border border-[#006a63]/50 object-cover"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-[#131c2a] dark:text-white max-w-[110px] truncate">
                      {user?.fullName}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-[#006a63] dark:text-emerald-400 -mt-0.5">
                      {user?.role === 'business_owner' ? 'Business' : 'Customer'}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-[#76767e] hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#131c2a] dark:text-gray-300 hover:text-[#006a63] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-bold text-[#131c2a] bg-[#e9c178] hover:bg-[#f0cf8a] rounded-lg transition-colors shadow-sm"
                >
                  List Your Business
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-bold text-white bg-[#131c2a] hover:bg-[#1e2940] rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-full text-[#45464d] dark:text-gray-400"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[#131c2a] dark:text-gray-300"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-[#0a0f1e] border-t border-[rgba(198,198,206,0.4)] py-4 px-6 shadow-xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  isActive(link.path)
                    ? 'bg-[#e7eeff] text-[#006a63] font-semibold'
                    : 'text-[#45464d] dark:text-gray-300 hover:bg-[#f0f3ff]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-[rgba(198,198,206,0.4)] my-2" />

            {isAuthenticated && user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-2 py-1">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={user?.fullName || 'User'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#006a63]/40"
                  />
                  <div>
                    <div className="font-bold text-[#131c2a] dark:text-white">{user?.fullName}</div>
                    <div className="text-xs text-[#76767e]">{user?.email}</div>
                  </div>
                </div>

                {user?.role === 'business_owner' && (
                  <Link to="/business/profile" onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#006a63] rounded-xl">
                    <Briefcase size={16} /> Business Dashboard
                  </Link>
                )}

                <Link to="/profile" onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#45464d] dark:text-gray-300 hover:bg-[#f0f3ff] rounded-xl">
                  <UserIcon size={16} /> My Profile
                </Link>

                <button onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 w-full text-left hover:bg-red-50 rounded-xl">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsOpen(false)}
                  className="py-2.5 text-center font-semibold text-[#131c2a] dark:text-gray-300 rounded-xl border border-[rgba(198,198,206,0.5)] hover:bg-[#f0f3ff]">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}
                  className="py-2.5 text-center font-bold text-white bg-[#131c2a] rounded-xl hover:bg-[#1e2940]">
                  Get Started
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
