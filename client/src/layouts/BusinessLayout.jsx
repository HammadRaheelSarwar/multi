import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Store,
  Briefcase,
  CalendarCheck,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  User as UserIcon,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toggleDarkMode } from '../redux/slices/uiSlice';

const BusinessLayout = () => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const darkMode = useSelector((state) => state.ui.darkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Security Gate
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const allowedRoles = ['business_owner', 'super_admin', 'admin'];
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard',  path: '/business',          icon: <LayoutDashboard size={18} /> },
    { name: 'My Profile', path: '/business/profile',  icon: <Store size={18} /> },
    { name: 'Services',   path: '/business/services', icon: <Briefcase size={18} /> },
    { name: 'Bookings',   path: '/business/bookings', icon: <CalendarCheck size={18} /> },
    { name: 'Messages',   path: '/business/reviews',  icon: <MessageSquare size={18} /> },
    { name: 'Payments',   path: '/business/reviews',  icon: <CreditCard size={18} /> },
    { name: 'Settings',   path: '/business/reviews',  icon: <Settings size={18} /> },
  ];

  const isActiveLink = (path) =>
    location.pathname === path ||
    (path === '/business' && location.pathname === '/business/overview');

  return (
    <div className="flex h-screen bg-[#f9f9ff] dark:bg-[#0a0f1e] overflow-hidden">

      {/* ────── Sidebar — Desktop ────── */}
      <aside className="hidden md:flex md:flex-col md:w-[240px] bg-white dark:bg-[#111827] border-r border-[rgba(198,198,206,0.35)] dark:border-[rgba(255,255,255,0.07)] transition-colors shadow-[4px_0_20px_rgba(19,28,42,0.04)]">

        {/* Logo */}
        <div className="px-6 py-6 border-b border-[rgba(198,198,206,0.3)] dark:border-[rgba(255,255,255,0.06)]">
          <Link to="/" className="block">
            <img src="/logo.png" alt="UstadHub" className="h-12 w-auto object-contain" />
          </Link>
        </div>

        {/* User Profile Card */}
        <div className="mx-4 my-4 p-3.5 rounded-2xl bg-[#f0f3ff] dark:bg-[#1e2940] border border-[rgba(198,198,206,0.35)] dark:border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
              alt={user?.fullName}
              className="w-10 h-10 rounded-xl object-cover border-2 border-[rgba(0,106,99,0.3)]"
            />
            <div className="overflow-hidden flex-1">
              <div className="text-sm font-bold text-[#131c2a] dark:text-white truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {user?.fullName}
              </div>
              <div className="text-[10px] font-semibold text-[#006a63] dark:text-emerald-400 mt-0.5 uppercase tracking-wide">
                Verified Professional
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">
          {menuItems.map((item) => {
            const active = isActiveLink(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`uh-sidebar-link ${active ? 'active' : ''}`}
              >
                <span className={active ? 'text-[#006a63]' : 'text-[#76767e]'}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[rgba(198,198,206,0.3)] dark:border-[rgba(255,255,255,0.06)] space-y-3">
          {/* Promote Profile CTA */}
          <button
            onClick={() => navigate('/search')}
            className="w-full py-3 bg-[#131c2a] dark:bg-white text-white dark:text-[#131c2a] text-sm font-bold rounded-xl hover:bg-[#1e2940] dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <TrendingUp size={15} /> Promote Profile
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full py-2.5 text-sm font-medium text-[#76767e] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* ────── Main Panel ────── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xl border-b border-[rgba(198,198,206,0.3)] dark:border-[rgba(255,255,255,0.06)] transition-colors shadow-sm">

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#45464d] dark:text-gray-400 hover:bg-[#f0f3ff] dark:hover:bg-[#1e2940] rounded-xl md:hidden"
          >
            <Menu size={20} />
          </button>

          {/* Welcome text */}
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-[#131c2a] dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Welcome back, {user?.fullName?.split(' ')[0] || 'Partner'}
            </h1>
            <p className="text-xs text-[#76767e]">Here is what's happening with your business today.</p>
          </div>

          {/* Page title (mobile) */}
          <h1 className="md:hidden text-sm font-bold text-[#131c2a] dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {menuItems.find(m => isActiveLink(m.path))?.name || 'Dashboard'}
          </h1>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Customer view link */}
            {user?.role === 'business_owner' && (
              <Link
                to="/"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#45464d] dark:text-gray-400 hover:text-[#006a63] dark:hover:text-emerald-400 border border-[rgba(198,198,206,0.5)] px-3 py-1.5 rounded-xl hover:border-[#006a63]/40 transition-all"
              >
                <UserIcon size={12} /> Customer View
              </Link>
            )}

            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 text-[#45464d] dark:text-gray-400 hover:bg-[#f0f3ff] dark:hover:bg-[#1e2940] rounded-xl transition-colors"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-[#45464d] dark:text-gray-400 hover:bg-[#f0f3ff] dark:hover:bg-[#1e2940] rounded-xl transition-colors">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#006a63] rounded-full" />
            </button>

            {/* Avatar */}
            <Link to="/profile">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                alt={user?.fullName}
                className="w-8 h-8 rounded-xl object-cover border-2 border-[rgba(0,106,99,0.3)] hover:border-[#006a63] transition-colors"
              />
            </Link>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto bg-[#f9f9ff] dark:bg-[#0a0f1e] transition-colors">
          <Outlet />
        </main>
      </div>

      {/* ────── Mobile Drawer ────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />

          <div className="relative flex flex-col w-[240px] bg-white dark:bg-[#111827] h-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-[rgba(198,198,206,0.3)]">
              <img src="/logo.png" alt="UstadHub" className="h-10 w-auto object-contain" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-[#f0f3ff] text-[#45464d]">
                <X size={18} />
              </button>
            </div>

            {/* User card */}
            <div className="mx-4 my-4 p-3 rounded-2xl bg-[#f0f3ff] dark:bg-[#1e2940]">
              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                  alt={user?.fullName}
                  className="w-9 h-9 rounded-xl object-cover border border-[rgba(0,106,99,0.3)]"
                />
                <div className="overflow-hidden">
                  <div className="text-sm font-bold text-[#131c2a] dark:text-white truncate">{user?.fullName}</div>
                  <div className="text-[10px] text-[#006a63] font-semibold">Verified Professional</div>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
              {menuItems.map((item) => {
                const active = isActiveLink(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`uh-sidebar-link ${active ? 'active' : ''}`}
                  >
                    <span className={active ? 'text-[#006a63]' : 'text-[#76767e]'}>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[rgba(198,198,206,0.3)] space-y-2">
              <button onClick={() => { setMobileMenuOpen(false); navigate('/search'); }}
                className="w-full py-2.5 bg-[#131c2a] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2">
                <TrendingUp size={14} /> Promote Profile
              </button>
              <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-center gap-2">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessLayout;
