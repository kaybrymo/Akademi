import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  GraduationCap, 
  Search, 
  Moon, 
  Sun, 
  Bell, 
  Check, 
  ShieldCheck, 
  Video, 
  Compass, 
  ChevronDown,
  ExternalLink,
  Users,
  Users2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface NotificationItem {
  id: string | number;
  title: string;
  desc: string;
  time: string;
  unread?: boolean;
  read?: boolean;
  type?: string;
  link?: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Session Starting Soon",
    desc: "Calculus with Dr. Chiamaka Eze starts in 20 minutes.",
    time: "10m ago",
    read: false
  },
  {
    id: "notif-2",
    title: "New Message Received",
    desc: "Halima Yusuf sent you the Spanish vocabulary list.",
    time: "1h ago",
    read: false
  },
  {
    id: "notif-3",
    title: "Wallet Deposit Confirmed",
    desc: "₦10,000 top-up via Paystack has been credited.",
    time: "3h ago",
    read: false
  }
];

const getStoredNotifications = (): NotificationItem[] => {
  try {
    const saved = localStorage.getItem('akademi_user_notifications');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_NOTIFICATIONS;
};

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Load registered user profile from localStorage
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: 'student' | 'tutor' | 'admin' | 'super_admin';
    initials: string;
    title: string;
    avatar?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('User session parse error:', e);
    }
    return {
      name: 'Chiamaka',
      email: 'ada@akademi.dev',
      role: 'student',
      initials: 'CA',
      title: 'A-level · Year 13',
      avatar: '/images/hero-student.jpg'
    };
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('akademi_auth_user');
        if (saved) setUser(JSON.parse(saved));
      } catch (e) {}

      try {
        const savedNotifs = localStorage.getItem('akademi_user_notifications');
        if (savedNotifs) {
          setNotifications(JSON.parse(savedNotifs));
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('akademi_auth_user');
    navigate('/login');
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false, read: true }));
    setNotifications(updated);
    try {
      localStorage.setItem('akademi_user_notifications', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const unreadCount = notifications.filter(n => n.unread === true || n.read === false).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/dashboard/courses?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const isTutor = user.role === 'tutor';

  const handleToggleRoleView = () => {
    const newRole = user.role === 'tutor' ? 'student' : 'tutor';
    const updatedUser = {
      ...user,
      role: newRole,
      title: newRole === 'tutor' ? 'Senior Mathematics Educator' : 'A-level · Year 13',
      name: newRole === 'tutor' ? 'Dr. Chiamaka Eze' : 'Chiamaka'
    };
    setUser(updatedUser as any);
    localStorage.setItem('akademi_auth_user', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('storage'));
  };

  const [enableCommunities, setEnableCommunities] = useState(() => {
    const saved = localStorage.getItem('akademi_enable_communities');
    return saved !== null ? saved === 'true' : false;
  });

  useEffect(() => {
    const syncSettings = () => {
      const savedComm = localStorage.getItem('akademi_enable_communities');
      setEnableCommunities(savedComm !== null ? savedComm === 'true' : false);
    };
    window.addEventListener('storage', syncSettings);
    return () => window.removeEventListener('storage', syncSettings);
  }, []);

  const allNavItems = isTutor ? [
    { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Schedule", icon: Calendar, path: "/dashboard/sessions" },
    { label: "Students", icon: Users, path: "/dashboard/students" },
    { label: "Communities", icon: Users2, path: "/dashboard/communities" },
    { label: "My Courses", icon: BookOpen, path: "/dashboard/courses" },
    { label: "Messages", icon: MessageSquare, path: "/dashboard/messages" },
    { label: "Earnings", icon: CreditCard, path: "/dashboard/billing" },
    { label: "Settings", icon: Settings, path: "/dashboard/settings" },
  ] : [
    { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Sessions", icon: Calendar, path: "/dashboard/sessions" },
    { label: "Communities", icon: Users2, path: "/dashboard/communities" },
    { label: "Recordings", icon: Video, path: "/dashboard/recordings" },
    { label: "Learning Profile", icon: GraduationCap, path: "/dashboard/courses" },
    { label: "Messages", icon: MessageSquare, path: "/dashboard/messages" },
    { label: "Billing", icon: CreditCard, path: "/dashboard/billing" },
    { label: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  const navItems = enableCommunities ? allNavItems : allNavItems.filter(item => item.label !== "Communities");
  const getRoleInfo = (role: string = '') => {
    const r = role.toLowerCase();
    if (r === 'super_admin') {
      return {
        label: 'Super Admin',
        badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
        dotClass: 'bg-amber-500'
      };
    }
    if (r === 'admin') {
      return {
        label: 'Admin',
        badgeClass: 'bg-purple-100 text-purple-900 border border-purple-200 font-semibold',
        dotClass: 'bg-purple-500'
      };
    }
    if (r === 'tutor') {
      return {
        label: 'Tutor',
        badgeClass: 'bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold',
        dotClass: 'bg-emerald-500'
      };
    }
    return {
      label: 'Student',
      badgeClass: 'bg-blue-100 text-blue-900 border border-blue-200 font-semibold',
      dotClass: 'bg-blue-500'
    };
  };

  const roleInfo = getRoleInfo(user.role);
  const isAdminUser = user.role === 'admin' || (user.role as string) === 'super_admin';

  const rolePersonas: Record<'student' | 'tutor' | 'admin', {
    name: string;
    email: string;
    role: 'student' | 'tutor' | 'admin';
    initials: string;
    avatar: string;
    title: string;
  }> = {
    student: {
      name: 'Chiamaka Ada',
      email: 'student@akademi.com',
      role: 'student',
      initials: 'CA',
      avatar: '/images/hero-student.jpg',
      title: 'A-Level Science & Mathematics Student'
    },
    tutor: {
      name: 'Dr. Chiamaka Eze',
      email: 'tutor@akademi.com',
      role: 'tutor',
      initials: 'CE',
      avatar: '/images/tutor-daniel.jpg',
      title: 'Lead Mathematics & Physics Specialist'
    },
    admin: {
      name: 'Ngozi Eze',
      email: 'admin@akademi.com',
      role: 'admin',
      initials: 'NE',
      avatar: '/images/hero-student.jpg',
      title: 'Platform Operations Director'
    }
  };

  const handleSwitchRole = (role: 'student' | 'tutor' | 'admin') => {
    const updatedUser = {
      ...user,
      ...rolePersonas[role]
    };
    setUser(updatedUser as any);
    localStorage.setItem('akademi_auth_user', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('storage'));

    // Directly redirect to Admin Panel if admin selected, otherwise to Dashboard
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#141E18] flex font-sans transition-colors duration-200">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-[#FBF9F4] border-b border-[#E8E3D7] z-30 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F5338] text-white flex items-center justify-center">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-[#0F5338]">Akademi</span>
        </Link>
        <div className="flex items-center gap-2">
          {isAdminUser && (
            <Link
              to="/admin"
              className="p-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-lg border border-emerald-300"
            >
              Admin
            </Link>
          )}
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-700">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-xs z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside className={cn(
        "w-60 bg-[#FBF9F4] border-r border-[#E8E3D7] fixed inset-y-0 left-0 z-50 flex flex-col justify-between p-6 transition-transform duration-200 ease-in-out md:translate-x-0",
        isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        <div>
          {/* Top Logo */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F5338] text-white flex items-center justify-center shadow-xs shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl tracking-tight text-[#0F5338] leading-none">
                  Akademi
                </span>
                {isTutor && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                    TUTOR WORKSPACE
                  </span>
                )}
              </div>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-full px-4 py-2.5 text-xs font-semibold transition-all",
                    isActive 
                      ? "bg-[#E3EDE6] text-[#0F5338] font-bold" 
                      : "text-slate-600 hover:bg-[#F3EFE6] hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-[#0F5338]" : "text-slate-500")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Explore & Portals Section */}
          <div className="mt-8 pt-4 border-t border-[#E8E3D7]">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Explore & Portals
            </p>
            <div className="space-y-1">
              <Link
                to="/tutors"
                className="flex items-center gap-3 rounded-full px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-[#F3EFE6] hover:text-slate-900 transition-colors"
              >
                <Compass className="w-4 h-4 text-slate-500" />
                <span>Find Tutors</span>
              </Link>
              {isAdminUser && (
                <Link
                  to="/admin"
                  className="flex items-center justify-between rounded-full px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 transition-colors border border-emerald-200/60"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Admin Panel</span>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase bg-emerald-700 text-white px-1.5 py-0.2 rounded">
                    Portal
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Sign out */}
        <div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors w-full rounded-full hover:bg-[#F3EFE6]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-60 pt-16 md:pt-0 min-h-screen flex flex-col">
        {/* Top Header Controls Bar */}
        <header className="h-16 px-6 sm:px-10 flex items-center justify-between border-b border-[#E8E3D7]/60 relative">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutors, courses, lessons..."
              className="w-full bg-white border border-[#E8E3D7] rounded-full h-9 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F5338] shadow-2xs transition-colors"
            />
          </form>

          {/* Right utility items */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Quick Link to Admin (only for Super Admin / Admin) */}
            {isAdminUser && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition-colors"
                title="Open Admin Console"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Dark mode toggle button */}
            <button 
              type="button"
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Night Mode"}
              className="w-8 h-8 rounded-full border border-[#E8E3D7] bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-all active:scale-95"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>

            {/* Platform Role Pill / Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#141E18] uppercase tracking-wider hidden sm:inline">Akademi</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className={cn("text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-2xs", roleInfo.badgeClass)}>
                <span className={cn("w-1.5 h-1.5 rounded-full", roleInfo.dotClass)} />
                {roleInfo.label} Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dynamic Interactive Role Switcher Toggle (For Testing / Multi-Role) */}
            <div className="hidden lg:flex items-center bg-[#E8E3D7]/60 p-0.5 rounded-full text-[10px] font-bold">
              <button
                type="button"
                onClick={() => handleSwitchRole('student')}
                className={cn(
                  "px-2.5 py-1 rounded-full transition-all",
                  user.role === 'student' ? "bg-white text-[#0F5338] shadow-2xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleSwitchRole('tutor')}
                className={cn(
                  "px-2.5 py-1 rounded-full transition-all",
                  user.role === 'tutor' ? "bg-white text-emerald-800 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                Tutor
              </button>
              <button
                type="button"
                onClick={() => handleSwitchRole('admin')}
                className={cn(
                  "px-2.5 py-1 rounded-full transition-all",
                  user.role === 'admin' ? "bg-white text-purple-800 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                )}
              >
                Admin
              </button>
            </div>

            {/* Notifications with counter pill & dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                title="Notifications"
                className="relative w-8 h-8 rounded-full border border-[#E8E3D7] bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-all active:scale-95"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0F5338] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown with AnimatePresence */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E8E3D7] rounded-2xl shadow-xl z-50 overflow-hidden font-sans"
                  >
                    <div className="p-3.5 bg-[#FBF9F4] border-b border-[#E8E3D7] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-[#0F5338]" />
                        <span className="font-bold text-xs text-[#141E18]">Notifications</span>
                      </div>
                      {unreadCount > 0 && (
                        <button 
                          type="button"
                          onClick={handleMarkAllRead}
                          className="text-[10px] font-semibold text-[#0F5338] hover:underline flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="divide-y divide-[#E8E3D7]/60 max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 space-y-1.5">
                          <p className="text-xs font-semibold text-slate-600">You're all caught up! ☕</p>
                          <p className="text-[10px] text-slate-400">No new notifications right now.</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            className={cn(
                              "p-3.5 hover:bg-[#FBF9F4]/60 transition-colors text-left",
                              (n.unread === true || n.read === false) ? "bg-[#EAF5EE]/30" : ""
                            )}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-xs font-bold text-[#141E18]">{n.title}</h4>
                              <span className="text-[10px] text-slate-400">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">{n.desc}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2.5 bg-[#FBF9F4] border-t border-[#E8E3D7] text-center">
                      <Link 
                        to="/dashboard/notifications" 
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-[11px] font-semibold text-[#0F5338] hover:underline"
                      >
                        View all notifications &rarr;
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar & Interactive Switcher Menu */}
            <div className="relative" ref={userMenuRef}>
              <button 
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-white border border-[#E8E3D7] rounded-full py-1 pl-1.5 pr-2.5 shadow-2xs hover:border-[#0F5338] transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#0F5338] text-white text-[10px] font-bold flex items-center justify-center">
                  {user.initials || 'CA'}
                </div>
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline">{user.name}</span>
                <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider", roleInfo.badgeClass)}>
                  {roleInfo.label}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-[#E8E3D7] rounded-2xl shadow-xl z-50 overflow-hidden font-sans p-1.5"
                  >
                    <div className="p-3 bg-[#FBF9F4] rounded-xl mb-1.5 border border-[#E8E3D7]">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 flex items-center gap-1", roleInfo.badgeClass)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", roleInfo.dotClass)} />
                          {roleInfo.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="space-y-0.5 text-xs">
                      <Link
                        to={isAdminUser ? "/admin" : "/dashboard"}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-[#F3EFE6] font-medium"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          {user.role === 'super_admin' 
                            ? 'Super Admin Console' 
                            : (user.role === 'admin' 
                                ? 'Admin Portal' 
                                : (user.role === 'tutor' 
                                    ? 'Tutor Workspace' 
                                    : 'Student Dashboard'))}
                        </span>
                      </Link>

                      <Link
                        to="/tutors"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-[#F3EFE6] font-medium"
                      >
                        <Compass className="w-3.5 h-3.5 text-slate-500" />
                        <span>Find & Book Tutors</span>
                      </Link>

                      {isAdminUser && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-lg text-emerald-800 hover:bg-emerald-50 font-bold"
                        >
                          <div className="flex items-center gap-2.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Admin Panel</span>
                          </div>
                          <ExternalLink className="w-3 h-3 text-emerald-600" />
                        </Link>
                      )}

                      <Link
                        to="/dashboard/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-[#F3EFE6] font-medium"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                        <span>Account Settings</span>
                      </Link>

                      <hr className="border-[#E8E3D7]/60 my-1" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="p-6 sm:p-10 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
