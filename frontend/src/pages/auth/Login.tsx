import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Mail, 
  GraduationCap, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { apiEnabled, apiLogin, apiErrorMessage } from '@/lib/api';
import GoogleAuthModal, { GoogleLogo } from '@/components/ui/GoogleAuthModal';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('student@akademi.dev');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<'student' | 'tutor' | 'admin' | 'super_admin'>('student');

  const ROLE_MAP: Record<string, { name: string; role: string; initials: string; title: string; avatar: string }> = {
    'ada@akademi.dev':        { name: 'Chiamaka Ada',  role: 'student',     initials: 'CA', title: 'A-Level · Year 13',           avatar: '/images/hero-student.jpg' },
    'student@akademi.dev':    { name: 'Chiamaka Ada',  role: 'student',     initials: 'CA', title: 'A-Level · Year 13',           avatar: '/images/hero-student.jpg' },
    'tutor@akademi.dev':      { name: 'Dr. Babatunde Lawal', role: 'tutor', initials: 'BL', title: 'Senior Mathematics Educator',  avatar: '/images/tutor-daniel.jpg' },
    'daniel@akademi.dev':     { name: 'Dr. Chiamaka Eze', role: 'tutor',    initials: 'CE', title: 'Senior Mathematics Educator',  avatar: '/images/tutor-daniel.jpg' },
    'admin@akademi.dev':      { name: 'Chidi Okafor',  role: 'admin',       initials: 'CO', title: 'Platform Administrator',       avatar: '/images/hero-student.jpg' },
    'superadmin@akademi.dev': { name: 'Ngozi Eze',     role: 'super_admin', initials: 'NE', title: 'Super Administrator',          avatar: '/images/hero-student.jpg' },
  };

  const handleGoogleAuthSuccess = (googleUser: any) => {
    localStorage.setItem('akademi_auth_user', JSON.stringify(googleUser));
    localStorage.setItem('akademi_google_calendar_connected', 'true');
    localStorage.setItem('akademi_google_calendar_account', googleUser.email);
    window.dispatchEvent(new Event('storage'));
    navigate('/dashboard');
  };

  const finishLogin = (profile: { role: string }) => {
    window.dispatchEvent(new Event('storage'));
    if (profile.role === 'admin' || profile.role === 'super_admin') navigate('/admin');
    else navigate('/dashboard');
  };

  const demoLogin = (key: string) => {
    const match = ROLE_MAP[key];
    const fallbackRole = key.includes('tutor') ? 'tutor' : 'student';
    const authUser = match ?? {
      name: fallbackRole === 'tutor' ? 'Dr. Babatunde' : 'Chiamaka',
      email: key,
      role: fallbackRole,
      initials: fallbackRole === 'tutor' ? 'BB' : 'CA',
      title: fallbackRole === 'tutor' ? 'Senior Mathematics Educator' : 'A-Level Student',
      avatar: fallbackRole === 'tutor' ? '/images/tutor-daniel.jpg' : '/images/hero-student.jpg'
    };
    const profile = { ...authUser, email: key };
    localStorage.setItem('akademi_auth_user', JSON.stringify(profile));
    finishLogin(profile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = email.toLowerCase().trim();
    setAuthError('');

    // Built-in demo accounts always work; everything else goes to the API when configured.
    if (!apiEnabled || ROLE_MAP[key]) {
      demoLogin(key);
      return;
    }

    setSubmitting(true);
    try {
      const profile = await apiLogin(key, password);
      localStorage.setItem('akademi_auth_user', JSON.stringify(profile));
      finishLogin(profile);
    } catch (err) {
      setAuthError(apiErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setSubmitting(false);
    }
  };

  const quickLogin = (loginEmail: string, roleKey: 'student' | 'tutor' | 'admin' | 'super_admin') => {
    setEmail(loginEmail);
    setActiveRoleTab(roleKey);
    setTimeout(() => {
      const key = loginEmail.toLowerCase().trim();
      const match = ROLE_MAP[key];
      if (!match) return;
      const profile = { ...match, email: key };
      localStorage.setItem('akademi_auth_user', JSON.stringify(profile));
      window.dispatchEvent(new Event('storage'));
      if (profile.role === 'admin' || profile.role === 'super_admin') navigate('/admin');
      else navigate('/dashboard');
    }, 0);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      {/* Left Column: Deep Forest Branding & Testimonials */}
      <div className="hidden lg:flex flex-col lg:w-1/2 bg-[#0E4833] text-white p-12 lg:p-16 justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.25),_transparent_65%)] pointer-events-none" />
        
        {/* Brand Logo Header */}
        <Link to="/" className="relative z-10 flex items-center gap-3 w-fit hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center text-xl shadow-lg border border-white/20">
            <GraduationCap className="h-6 w-6 text-emerald-300" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl tracking-tight text-white block leading-none">Akademi</span>
            <span className="text-[10px] text-emerald-200/70 font-sans uppercase tracking-widest block mt-0.5">Tutoring Platform</span>
          </div>
        </Link>
        
        {/* Center Content & Value Props */}
        <div className="relative z-10 max-w-lg my-auto py-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-bold mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Welcome Back to Akademi
          </div>

          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight mb-4 leading-[1.15]">
            Pick up where you left off.
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed mb-8">
            Access your 1-on-1 sessions, HD classroom notes, direct tutor messages, and wallet earnings in seconds.
          </p>

          {/* Testimonial Quote Box */}
          <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-md space-y-3 shadow-xl">
            <div className="flex items-center gap-1 text-amber-300">
              {'★'.repeat(5)}
            </div>
            <p className="text-sm text-emerald-50 italic leading-relaxed">
              "Akademi transformed how I study for A-Level Calculus. The interactive HD whiteboard and instant tutor feedback made all the difference!"
            </p>
            <div className="flex items-center justify-between text-xs text-emerald-200/80 pt-1 border-t border-white/10">
              <span className="font-bold text-white">Maya Adebayo</span>
              <span>A-Level Mathematics Student</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-emerald-200/60 pt-6 border-t border-white/10">
          <span>© 2026 Akademi Academy Ltd.</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> SSL Encrypted & Secure</span>
        </div>
      </div>

      {/* Right Column: Clean Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 py-10 sm:px-12 md:px-20 justify-center bg-white relative overflow-y-auto">
        <Link 
          to="/" 
          className="absolute top-8 left-6 sm:left-12 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md mx-auto my-auto"
        >
          {/* Header */}
          <div className="mb-6 text-left">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-950 tracking-tight mb-2">
              Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#0F5338] font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          {/* Quick Demo Role Quick Selector Pills */}
          <div className="mb-6 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 px-2">
              ⚡ Quick 1-Click Demo Login:
            </label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { key: 'student', label: 'Student', email: 'student@akademi.dev', icon: '🎓' },
                { key: 'tutor', label: 'Tutor', email: 'tutor@akademi.dev', icon: '🏫' },
                { key: 'admin', label: 'Admin', email: 'admin@akademi.dev', icon: '🛡️' },
                { key: 'super_admin', label: 'Super', email: 'superadmin@akademi.dev', icon: '👑' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => quickLogin(item.email, item.key as any)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                    activeRoleTab === item.key
                      ? 'bg-[#0F5338] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-[10px] truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl h-12 font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-3 active:scale-[0.98] mb-5 cursor-pointer"
          >
            <GoogleLogo className="w-5 h-5" />
            <span>Continue with Google Account</span>
          </button>

          {/* Separator */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">or with email credentials</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="bg-slate-50/50 border border-slate-300 focus:bg-white rounded-2xl h-12 pl-11 pr-4 w-full focus:ring-2 focus:ring-[#0F5338] focus:border-[#0F5338] outline-none text-xs sm:text-sm text-slate-900 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-bold text-[#0F5338] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-slate-50/50 border border-slate-300 focus:bg-white rounded-2xl h-12 pl-11 pr-12 w-full focus:ring-2 focus:ring-[#0F5338] focus:border-[#0F5338] outline-none text-xs sm:text-sm text-slate-900 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#0F5338] focus:ring-[#0F5338] cursor-pointer accent-[#0F5338]" 
                />
                Keep me signed in on this device
              </label>
            </div>

            {authError && (
              <p role="alert" className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                {authError}
              </p>
            )}

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-[#0F5338] hover:bg-[#0A3D29] disabled:opacity-60 text-white rounded-2xl h-12 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98] cursor-pointer"
            >
              <span>{submitting ? 'Signing in…' : 'Sign In to Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </motion.div>
      </div>

      {/* Google Sign-in Interactive Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        mode="signin"
        onSuccess={handleGoogleAuthSuccess}
      />
    </div>
  );
}
