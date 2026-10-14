import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  ArrowRight,
  ExternalLink,
  Lock,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup' | 'calendar_connect';
  initialRole?: 'student' | 'tutor';
  onSuccess: (userData: {
    name: string;
    email: string;
    role: 'student' | 'tutor';
    avatar: string;
    initials: string;
    title: string;
    googleConnected?: boolean;
  }) => void;
}

export function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.37 7.34 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        fill="#EA4335"
      />
    </svg>
  );
}

const PRELOADED_GOOGLE_ACCOUNTS = [
  {
    name: 'Chiamaka Ada',
    email: 'chiamaka.ada@gmail.com',
    role: 'student' as const,
    avatar: '/images/hero-student.jpg',
    initials: 'CA',
    title: 'A-Level Science & Mathematics Student',
    desc: 'Student Account · Enrolled in 3 Active Subjects'
  },
  {
    name: 'Dr. Chiamaka Eze',
    email: 'dr.chiamaka.eze@gmail.com',
    role: 'tutor' as const,
    avatar: '/images/tutor-daniel.jpg',
    initials: 'CE',
    title: 'Lead Mathematics & Physics Specialist',
    desc: 'Verified Tutor · 4.9★ Rating · 142 Sessions'
  }
];

export default function GoogleAuthModal({
  isOpen,
  onClose,
  mode,
  initialRole = 'student',
  onSuccess
}: GoogleAuthModalProps) {
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<number | null>(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [signupRole, setSignupRole] = useState<'student' | 'tutor'>(initialRole);
  const [subject, setSubject] = useState('Mathematics & Further Maths');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreloaded = (idx: number) => {
    setSelectedAccountIndex(idx);
    setIsProcessing(true);

    const account = PRELOADED_GOOGLE_ACCOUNTS[idx];
    const finalRole = mode === 'signup' ? signupRole : account.role;

    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({
        name: account.name,
        email: account.email,
        role: finalRole,
        avatar: account.avatar,
        initials: account.initials,
        title: finalRole === 'tutor' ? 'Lead Mathematics & Physics Specialist' : 'A-Level Science & Mathematics Student',
        googleConnected: true
      });
      onClose();
    }, 900);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    setIsProcessing(true);
    const cleanName = customName.trim() || customEmail.split('@')[0].replace('.', ' ');
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    const initials = formattedName.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'GA';

    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({
        name: formattedName,
        email: customEmail.trim(),
        role: signupRole,
        avatar: signupRole === 'tutor' ? '/images/tutor-daniel.jpg' : '/images/hero-student.jpg',
        initials: initials,
        title: signupRole === 'tutor' ? `${subject} Educator` : 'A-Level Student',
        googleConnected: true
      });
      onClose();
    }, 900);
  };

  const isCalendarConnect = mode === 'calendar_connect';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-100 relative text-slate-900"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Google Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto shadow-2xs">
            <GoogleLogo className="w-6 h-6" />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {isCalendarConnect 
              ? 'Connect Google Calendar'
              : (mode === 'signup' ? 'Create Account with Google' : 'Sign in with Google')}
          </h2>

          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {isCalendarConnect
              ? 'Allow Akademi to synchronize your tutoring lessons, send reminder alerts, and prevent double-booking.'
              : 'Choose an account to continue to Akademi Online Learning.'}
          </p>
        </div>

        {/* Calendar Permissions Prompt Details */}
        {isCalendarConnect && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <Calendar className="w-4 h-4 text-[#0F5338]" />
              <span>Permissions Requested:</span>
            </div>
            <ul className="space-y-1.5 pl-6 list-disc text-[11px] text-slate-600">
              <li>View and add upcoming tutoring sessions to your Google Calendar</li>
              <li>Auto-sync 1-on-1 and Group schedule meeting links</li>
              <li>Send automatic 15-minute start reminders before each class</li>
            </ul>
          </div>
        )}

        {/* Role Selector for Signup Mode */}
        {mode === 'signup' && !isCalendarConnect && (
          <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">I am joining as a:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSignupRole('student')}
                className={cn(
                  "py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                  signupRole === 'student'
                    ? "bg-[#0F5338] text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                )}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setSignupRole('tutor')}
                className={cn(
                  "py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                  signupRole === 'tutor'
                    ? "bg-[#0F5338] text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                )}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Tutor / Educator</span>
              </button>
            </div>
          </div>
        )}

        {/* Account Selector List */}
        {!isCustomMode ? (
          <div className="space-y-2.5">
            {PRELOADED_GOOGLE_ACCOUNTS.map((acc, idx) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleSelectPreloaded(idx)}
                disabled={isProcessing}
                className={cn(
                  "w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between group",
                  selectedAccountIndex === idx 
                    ? "border-[#0F5338] bg-emerald-50/50 ring-2 ring-emerald-500/20" 
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover shadow-2xs border border-white"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{acc.name}</h4>
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.2 rounded font-bold uppercase",
                        acc.role === 'tutor' ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                      )}>
                        {acc.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{acc.email}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{acc.desc}</p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#0F5338] group-hover:text-white flex items-center justify-center transition-colors text-slate-400">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}

            {/* Use Another Google Account Toggle */}
            <button
              type="button"
              onClick={() => setIsCustomMode(true)}
              className="w-full py-2.5 px-4 text-xs font-semibold text-[#0F5338] hover:text-[#0A3D29] hover:bg-emerald-50/50 rounded-xl transition-colors text-center border border-dashed border-emerald-300"
            >
              + Use another Google Account
            </button>
          </div>
        ) : (
          /* Custom Google Account Form */
          <form onSubmit={handleCustomSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Your Full Name</label>
              <input
                type="text"
                placeholder="e.g. Samuel Adeyemi"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl h-10 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F5338]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Google Email Address</label>
              <input
                type="email"
                placeholder="you@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl h-10 px-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F5338]"
                required
              />
            </div>

            {signupRole === 'tutor' && mode === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Subject Area</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl h-10 px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F5338]"
                >
                  <option value="Mathematics & Further Maths">Mathematics & Further Maths</option>
                  <option value="Physics & Engineering">Physics & Engineering</option>
                  <option value="Chemistry & Medical Exam">Chemistry & Medical Exam</option>
                  <option value="Conversational Spanish & French">Conversational Spanish & French</option>
                  <option value="Computer Science & Python">Computer Science & Python</option>
                </select>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                {isProcessing ? 'Authenticating...' : (isCalendarConnect ? 'Authorize & Sync' : 'Continue')}
              </button>
            </div>
          </form>
        )}

        {/* Security & Privacy Notice */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Google OAuth 2.0 Secure</span>
          </span>
          <span>Akademi Privacy Protected</span>
        </div>
      </motion.div>
    </div>
  );
}
