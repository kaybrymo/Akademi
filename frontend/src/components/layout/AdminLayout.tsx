import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  CreditCard, 
  Settings, 
  Menu,
  X,
  LogOut,
  Bell,
  Video,
  ExternalLink,
  Home,
  Compass,
  Users2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children?: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [enableCommunities, setEnableCommunities] = useState(() => {
    const saved = localStorage.getItem('akademi_enable_communities');
    return saved !== null ? saved === 'true' : false;
  });

  React.useEffect(() => {
    const syncSettings = () => {
      const savedComm = localStorage.getItem('akademi_enable_communities');
      setEnableCommunities(savedComm !== null ? savedComm === 'true' : false);
    };
    window.addEventListener('storage', syncSettings);
    return () => window.removeEventListener('storage', syncSettings);
  }, []);

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'Ngozi Eze',
      email: 'admin@akademi.com',
      role: 'admin',
      initials: 'NE'
    };
  });

  const handleLogout = () => {
    localStorage.removeItem('akademi_auth_user');
    navigate('/login');
  };

  const handleSwitchRole = (role: 'student' | 'tutor' | 'admin' | 'super_admin') => {
    const rolePersonas: Record<string, any> = {
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
      },
      super_admin: {
        name: 'Super Admin',
        email: 'superadmin@akademi.dev',
        role: 'super_admin',
        initials: 'SA',
        avatar: '/images/tutor-ibrahim.jpg',
        title: 'Chief Platform Administrator'
      }
    };

    const updated = { ...user, ...rolePersonas[role] };
    setUser(updated);
    localStorage.setItem('akademi_auth_user', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    if (role === 'student' || role === 'tutor') {
      navigate('/dashboard');
    } else {
      navigate('/admin');
    }
  };

  const isSuperAdmin = user.role === 'super_admin';
  const roleLabel = isSuperAdmin ? 'Super Admin' : (user.role === 'admin' ? 'Administrator' : 'Admin');

  const allNavItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, superOnly: false },
    { name: 'Communities Hubs', path: '/admin/communities', icon: Users2, superOnly: false },
    { name: isSuperAdmin ? 'All Users Directory' : 'Students & Users', path: '/admin/users', icon: Users, superOnly: false },
    { name: 'Tutors Management', path: '/admin/tutors', icon: GraduationCap, superOnly: false },
    { name: 'Sessions', path: '/admin/sessions', icon: Calendar, superOnly: false },
    { name: 'Subjects', path: '/admin/subjects', icon: BookOpen, superOnly: false },
    { name: 'Recordings Vault', path: '/admin/recordings', icon: Video, superOnly: true },
    { name: 'Payment Gateways', path: '/admin/payments', icon: CreditCard, superOnly: true },
    { name: 'Platform Settings', path: '/admin/settings', icon: Settings, superOnly: true },
  ];

  const visibleNavItems = allNavItems
    .filter(item => isSuperAdmin || !item.superOnly)
    .filter(item => enableCommunities || item.path !== '/admin/communities');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col justify-between",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          <div className="flex h-16 shrink-0 items-center justify-between px-6 bg-slate-950">
            <Link to="/" className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">Akademi</span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                isSuperAdmin ? "text-amber-400" : "text-emerald-400"
              )}>
                {isSuperAdmin ? 'Super Admin Console' : 'Admin: Tutor & Student Hub'}
              </span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1 px-3 py-4 overflow-y-auto max-h-[calc(100vh-270px)]">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "group flex items-center rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors",
                    isActive 
                      ? (isSuperAdmin ? "bg-amber-600 text-white shadow-sm" : "bg-emerald-600 text-white shadow-sm")
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className={cn("mr-3 h-4 w-4 flex-shrink-0")} aria-hidden="true" />
                  <span className="truncate">{item.name}</span>
                  {item.superOnly && (
                    <span className="ml-auto text-[8px] font-black uppercase bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded">
                      Super
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switcher & User Strip (Bidirectional Multi-Portal Navigation) */}
        <div className="p-3 bg-slate-950 space-y-2 border-t border-slate-800">
          <p className="px-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
            {isSuperAdmin ? 'Multi-Portal Roaming' : 'Direct Quick Access'}
          </p>

          {/* Quick Exit / Roaming Links */}
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400" />
                <span>Learning Workspace</span>
              </div>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </Link>

            <Link
              to="/tutors"
              className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <Compass className="h-3.5 w-3.5 text-amber-400" />
                <span>Tutors Directory</span>
              </div>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </Link>

            {isSuperAdmin && (
              <Link
                to="/courses"
                className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-purple-400" />
                  <span>Course Catalog</span>
                </div>
                <ExternalLink className="h-3 w-3 text-slate-500" />
              </Link>
            )}

            <Link
              to="/"
              className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <Home className="h-3.5 w-3.5 text-blue-400" />
                <span>Main Site</span>
              </div>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* User Strip */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white",
              isSuperAdmin ? "bg-amber-600 ring-2 ring-amber-400/40" : "bg-emerald-700"
            )}>
              {user.initials || 'AD'}
            </div>
            <div className="ml-2.5 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-bold text-white">{user.name}</p>
                <span className={cn(
                  "text-[8px] font-extrabold px-1.5 py-0.2 rounded uppercase",
                  isSuperAdmin ? "bg-amber-500 text-amber-950 font-black" : "bg-emerald-700 text-white"
                )}>
                  {roleLabel}
                </span>
              </div>
              <p className="truncate text-[10px] text-slate-400">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 p-1.5 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden text-slate-500 hover:text-slate-700 p-1"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Akademi Administration System &bull; Production Mode
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Multi-Persona Fast Switcher */}
            <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-full text-[10px] font-bold border border-slate-200">
              <button
                type="button"
                onClick={() => handleSwitchRole('student')}
                className="px-2.5 py-1 rounded-full text-slate-600 hover:text-slate-900 transition-all"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleSwitchRole('tutor')}
                className="px-2.5 py-1 rounded-full text-slate-600 hover:text-slate-900 transition-all"
              >
                Tutor
              </button>
              <button
                type="button"
                onClick={() => handleSwitchRole('admin')}
                className={cn(
                  "px-2.5 py-1 rounded-full transition-all",
                  user.role === 'admin' ? "bg-white text-emerald-800 shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"
                )}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleSwitchRole('super_admin')}
                className={cn(
                  "px-2.5 py-1 rounded-full transition-all",
                  user.role === 'super_admin' ? "bg-amber-500 text-white shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"
                )}
              >
                👑 Super Admin
              </button>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Workspace</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
