import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Shield, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  QrCode, 
  Sparkles, 
  Lock, 
  Trash2, 
  Upload, 
  User, 
  Smartphone, 
  Globe, 
  Share2,
  Building2,
  CreditCard,
  FileText,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Check,
  Wallet,
  ArrowRight,
  Coins,
  Gift,
  Clock,
  Calendar,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ReferralSnapcodeBadge from '@/components/ui/ReferralSnapcodeBadge';
import { useTheme } from '@/context/ThemeContext';
import GoogleAuthModal, { GoogleLogo } from '@/components/ui/GoogleAuthModal';

export default function Settings() {
  const { theme, setTheme, isDark } = useTheme();

  // Load current user from localStorage
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
    initials: string;
    phone?: string;
    bio?: string;
    location?: string;
    avatar?: string;
    subject?: string;
    rate?: number;
  }>(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'Chiamaka Eze',
      email: 'chiamaka@akademi.com',
      role: 'student',
      initials: 'CE',
      phone: '+234 802 345 6789',
      bio: 'Preparing for university mathematics and physics examinations.',
      location: 'Lagos, Nigeria',
      avatar: ''
    };
  });

  const isTutorUser = user.role?.toLowerCase() === 'tutor';

  // Form State
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '+234 802 345 6789');
  const [bio, setBio] = useState(user.bio || 'Dedicated educator and mentor on Akademi.');
  const [location, setLocation] = useState(user.location || 'Lagos, Nigeria');
  const [avatar, setAvatar] = useState(user.avatar || '');

  // Password fields
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification Toggles with LocalStorage
  const [toggles, setToggles] = useState(() => {
    try {
      const savedToggles = localStorage.getItem('akademi_settings_notifications');
      if (savedToggles) return JSON.parse(savedToggles);
    } catch (e) {}
    return {
      emailReminders: true,
      smsReminders: true,
      messageAlerts: true,
      weeklyDigest: false,
      twoFactorAuth: false,
      marketingEmails: false
    };
  });

  // Google Calendar Integration State
  const [googleConnected, setGoogleConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('akademi_google_calendar_connected') === 'true';
    } catch (e) {}
    return false;
  });
  const [googleAccount, setGoogleAccount] = useState<string>(() => {
    try {
      return localStorage.getItem('akademi_google_calendar_account') || (user.role === 'tutor' ? 'dr.chiamaka.eze@gmail.com' : 'chiamaka.ada@gmail.com');
    } catch (e) {}
    return 'chiamaka.ada@gmail.com';
  });
  const [calendarAutoSync, setCalendarAutoSync] = useState(true);
  const [calendarLeadTime, setCalendarLeadTime] = useState('15m');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [calendarSyncSuccess, setCalendarSyncSuccess] = useState(false);

  const handleToggleGoogleCalendar = () => {
    if (!googleConnected) {
      setIsGoogleModalOpen(true);
    } else {
      setGoogleConnected(false);
      localStorage.removeItem('akademi_google_calendar_connected');
      showToast('Google Calendar disconnected.');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleGoogleAuthSuccess = (googleData: any) => {
    setGoogleConnected(true);
    setGoogleAccount(googleData.email);
    localStorage.setItem('akademi_google_calendar_connected', 'true');
    localStorage.setItem('akademi_google_calendar_account', googleData.email);
    showToast(`✓ Google Calendar connected (${googleData.email})! Synchronized 11 sessions with reminders.`);
    window.dispatchEvent(new Event('storage'));
  };

  const handleForceCalendarSync = () => {
    setCalendarSyncSuccess(true);
    showToast('✓ Forced calendar synchronization complete! 11 sessions updated.');
    setTimeout(() => setCalendarSyncSuccess(false), 3000);
  };

  // Comprehensive Tutor KYC & Payout State
  const [kycData, setKycData] = useState(() => {
    try {
      const saved = localStorage.getItem('akademi_tutor_kyc');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      legalName: 'Daniel Chukwuebuka Okafor',
      bankName: 'Guaranty Trust Bank (GTBank)',
      accountNumber: '0123456789',
      accountName: 'Daniel Chukwuebuka Okafor',
      bvn: '22119988776',
      idType: 'National Identity Number (NIN)',
      idNumber: '98451234761',
      idFileName: 'NIN_Slip_Daniel_Okafor.pdf',
      address: '14 Admiralty Way, Lekki Phase 1',
      state: 'Lagos State',
      highestDegree: "Master's Degree (M.Sc. Mathematics)",
      institution: 'University of Lagos (UNILAG)',
      gradYear: '2021',
      certFileName: 'UNILAG_Degree_Certificate.pdf',
      payoutSchedule: 'weekly',
      minPayoutThreshold: '5000',
      status: 'Verified'
    };
  });

  // Student Token Rewards & Session Conversion State
  const [studentTokens, setStudentTokens] = useState(() => {
    const saved = localStorage.getItem('akademi_user_tokens') ?? localStorage.getItem('akademi_student_tokens');
    return saved !== null ? Number(saved) : 450;
  });
  const [freeSessionMinutes, setFreeSessionMinutes] = useState(() => {
    const saved = localStorage.getItem('akademi_student_reward_minutes') ?? localStorage.getItem('akademi_student_free_minutes');
    return saved !== null ? Number(saved) : 45;
  });
  const [tokensToConvert, setTokensToConvert] = useState<number>(100);
  const [generatedVoucher, setGeneratedVoucher] = useState<string | null>(null);

  // Read conversion rate set by Super Admin (default 10 tokens = 1 min)
  const [superAdminTokensPerMinute] = useState(() => {
    return Number(localStorage.getItem('akademi_tokens_per_minute') || 10);
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSnapcodeModal, setShowSnapcodeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Storage listener to sync tokens and reward minutes across roles/pages
  useEffect(() => {
    const handleStorageSync = () => {
      try {
        const tokens = localStorage.getItem('akademi_user_tokens');
        if (tokens !== null) setStudentTokens(Number(tokens));
        const mins = localStorage.getItem('akademi_student_reward_minutes');
        if (mins !== null) setFreeSessionMinutes(Number(mins));
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  const handleConvertTokens = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokensToConvert <= 0) {
      showToast('Please select a valid number of tokens to convert.');
      return;
    }
    if (tokensToConvert > studentTokens) {
      showToast('You do not have enough LearnTokens for this conversion.');
      return;
    }
    const minutesGained = Math.floor(tokensToConvert / Math.max(1, superAdminTokensPerMinute));
    const remainingTokens = studentTokens - tokensToConvert;
    const newTotalMinutes = freeSessionMinutes + minutesGained;

    setStudentTokens(remainingTokens);
    setFreeSessionMinutes(newTotalMinutes);
    localStorage.setItem('akademi_user_tokens', String(remainingTokens));
    localStorage.setItem('akademi_student_reward_minutes', String(newTotalMinutes));
    window.dispatchEvent(new Event('storage'));

    const code = `FREE-${minutesGained}MIN-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedVoucher(code);
    showToast(`🎉 Converted ${tokensToConvert} Tokens into ${minutesGained} Minutes of Free Session Time!`);
  };

  // Sync notification toggles
  const handleToggle = (key: keyof typeof toggles) => {
    const updated = { ...toggles, [key]: !toggles[key] };
    setToggles(updated);
    localStorage.setItem('akademi_settings_notifications', JSON.stringify(updated));
    showToast(`${String(key)} preference updated`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveKyc = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('akademi_tutor_kyc', JSON.stringify(kycData));
    showToast('Tutor KYC & Bank Payout details successfully saved and updated!');
  };

  const handleIdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKycData((prev: any) => ({ ...prev, idFileName: file.name }));
      showToast(`Identity document "${file.name}" attached.`);
    }
  };

  const handleCertFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKycData((prev: any) => ({ ...prev, certFileName: file.name }));
      showToast(`Teaching credential "${file.name}" attached.`);
    }
  };

  // Avatar file upload handler
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('File size exceeds 3MB. Please select a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        showToast('Photo uploaded! Click "Save Changes" to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const nameParts = name.trim().split(' ');
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() 
      : name.substring(0, 2).toUpperCase();

    const updatedUser = {
      ...user,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      location: location.trim(),
      avatar: avatar,
      initials: initials
    };

    setUser(updatedUser);
    localStorage.setItem('akademi_auth_user', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('storage'));
    showToast('Profile information successfully saved!');
  };

  // Password Update
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }
    setCurrPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password successfully updated!');
  };

  // Account Delete
  const handleConfirmDelete = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl space-y-8 pb-16 font-sans"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your public profile, photo, referral bag, and security preferences.</p>
      </div>

      {/* ROLE-SCOPED BADGE & REWARDS SECTION */}
      {isTutorUser ? (
        /* Tutor Official Educator Snapcode Referral Badge */
        <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 rounded-2xl p-6 shadow-md text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6 border border-amber-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center shrink-0 shadow-lg">
              <QrCode className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" /> Official Educator Snapcode Badge
              </div>
              <h3 className="text-xl font-black leading-tight">Your Verified Educator Snapcode</h3>
              <p className="text-xs text-slate-900/80 mt-0.5">
                Share your official educator badge on WhatsApp & LinkedIn: new students get 10% OFF & you earn ₦2,000 cash bonus!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSnapcodeModal(true)}
            className="py-3 px-6 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-black shadow-lg transition-transform active:scale-95 whitespace-nowrap flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" /> View Educator Badge
          </button>
        </div>
      ) : (
        /* Student Rewards Tokens & Session Time Conversion Hub */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Gift className="w-3 h-3 text-amber-600" /> Student Rewards Vault
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">LearnTokens & Free Session Time</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Earn tokens by learning and inviting classmates. Convert tokens directly into free 1:1 tutoring time.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Token Balance</span>
                <span className="text-base font-bold text-amber-950 font-mono flex items-center gap-1 justify-end">
                  <Coins className="w-3.5 h-3.5 text-amber-500 inline" /> {studentTokens}
                </span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Free Session Time</span>
                <span className="text-base font-bold text-emerald-950 font-mono flex items-center gap-1 justify-end">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 inline" /> {freeSessionMinutes} Mins
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSnapcodeModal(true)}
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Student Pass
              </button>
            </div>
          </div>

          {/* Token to Session Conversion Form */}
          <div className="bg-gradient-to-br from-amber-50/60 to-emerald-50/60 rounded-xl p-4 sm:p-5 border border-amber-200/70">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" /> Convert Tokens to Session Time
              </span>
              <span className="text-[11px] text-slate-500 font-semibold bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200">
                Super Admin Policy: <strong>{superAdminTokensPerMinute} Tokens = 1 Min</strong>
              </span>
            </div>

            {/* Quick Conversion Amount Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[50, 100, 250, 450].map((amt) => {
                const mins = Math.floor(amt / Math.max(1, superAdminTokensPerMinute));
                const isSelected = tokensToConvert === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTokensToConvert(amt)}
                    className={cn(
                      "p-2.5 rounded-xl border text-xs text-left transition-all",
                      isSelected 
                        ? "bg-amber-100/90 border-2 border-amber-600 text-amber-950 font-bold shadow-2xs" 
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    )}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-600" /> {amt} Tokens
                    </div>
                    <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                      = {mins} Mins Free
                    </div>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleConvertTokens} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-700">
                  <Coins className="w-3.5 h-3.5 inline mr-1" /> Tokens:
                </span>
                <input
                  type="number"
                  min={superAdminTokensPerMinute}
                  max={studentTokens}
                  step={superAdminTokensPerMinute}
                  value={tokensToConvert}
                  onChange={(e) => setTokensToConvert(Number(e.target.value))}
                  className="w-full h-11 pl-24 pr-4 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto h-11 px-6 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Convert into {Math.floor(tokensToConvert / Math.max(1, superAdminTokensPerMinute))} Mins Free Time &rarr;
              </button>
            </form>

            {generatedVoucher && (
              <div className="mt-4 p-3.5 bg-white rounded-xl border border-emerald-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block">Session Voucher Generated</span>
                  <span className="font-mono font-bold text-sm text-slate-900">{generatedVoucher}</span>
                </div>
                <Link
                  to="/tutors"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                >
                  Book Free Session Now &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Settings Sections */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        
        {/* 1. Profile Information */}
        <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Profile Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">Update your photo and information visible to students and tutors.</p>
          </div>
          
          {/* Avatar Photo Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-emerald-600 text-white border-2 border-slate-200 flex items-center justify-center font-black text-2xl overflow-hidden shadow-inner">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{user.initials || 'ME'}</span>
                )}
              </div>
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span className="text-[10px] font-bold mt-1">Change</span>
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarFileChange} 
                className="hidden" 
              />
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Profile Avatar Picture</h3>
              <p className="text-xs text-slate-500">Upload a professional portrait photo (JPG or PNG, max 3MB).</p>
              <div className="flex gap-2 pt-2">
                <label 
                  htmlFor="avatar-upload" 
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload File
                </label>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar('')}
                    className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Bio / Description</label>
              <textarea 
                rows={3} 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Location</label>
              <input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-7 py-3 text-xs font-bold transition-all shadow-md active:scale-98"
            >
              Save Profile Changes
            </button>
          </div>
        </form>

        {/* 2A. Student Wallet & Credit Balance (Visible to Students) */}
        {!isTutorUser && (
          <div className="p-6 sm:p-8 space-y-4 bg-gradient-to-br from-emerald-50/70 via-emerald-50/30 to-blue-50/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0F5338] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Student Learning Wallet</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Credit your Naira wallet to book 1:1 and group tutoring sessions without re-entering card details.
                  </p>
                </div>
              </div>

              <Link
                to="/dashboard/billing"
                className="py-2.5 px-5 bg-[#0F5338] hover:bg-[#0a3d29] text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
              >
                <span>Credit Your Wallet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Balance</p>
                <p className="text-xl font-extrabold text-[#0F5338] mt-0.5">₦142,500</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Secured Gateway</p>
                <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Paystack Secured
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Currency</p>
                <p className="text-xs font-bold text-slate-800 mt-1">Nigerian Naira (₦ NGN)</p>
              </div>
            </div>
          </div>
        )}

        {/* 2B. Comprehensive Tutor KYC & Bank Payout Details (Visible exclusively to Tutors) */}
        {isTutorUser && (
        <form onSubmit={handleSaveKyc} className="p-6 sm:p-8 space-y-6 bg-slate-50/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">Tutor KYC & Bank Payout Details</h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    {kycData.status || 'Verified'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify your Nigerian bank account and official credentials to receive lesson payouts.
                </p>
              </div>
            </div>
            
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Default Payout Method</span>
              <p className="text-xs font-bold text-emerald-800 flex items-center gap-1 justify-end">
                <Check className="w-3.5 h-3.5" /> Direct Bank Transfer (NUBAN)
              </p>
            </div>
          </div>

          {/* Sub-card 1: Bank Account for Receiving Payouts */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              1. Nigerian Bank Account for Payouts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bank Name
                </label>
                <select
                  value={kycData.bankName}
                  onChange={(e) => setKycData({ ...kycData, bankName: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Guaranty Trust Bank (GTBank)">Guaranty Trust Bank (GTBank)</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                  <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                  <option value="Kuda Microfinance Bank">Kuda Microfinance Bank</option>
                  <option value="Moniepoint Microfinance Bank">Moniepoint Microfinance Bank</option>
                  <option value="OPay Digital Services">OPay Digital Services</option>
                  <option value="Stanbic IBTC Bank">Stanbic IBTC Bank</option>
                  <option value="Fidelity Bank">Fidelity Bank</option>
                  <option value="Sterling Bank">Sterling Bank</option>
                  <option value="Union Bank of Nigeria">Union Bank of Nigeria</option>
                  <option value="Wema Bank (ALAT)">Wema Bank (ALAT)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  10-Digit NUBAN Account Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={kycData.accountNumber}
                  onChange={(e) => setKycData({ ...kycData, accountNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder="e.g. 0123456789"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Verified Account Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={kycData.accountName}
                    onChange={(e) => setKycData({ ...kycData, accountName: e.target.value })}
                    className="w-full h-11 pl-3.5 pr-8 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bank Verification Number (BVN / Masked)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={kycData.bvn}
                    onChange={(e) => setKycData({ ...kycData, bvn: e.target.value })}
                    placeholder="2211•••••••"
                    className="w-full h-11 pl-3.5 pr-8 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Sub-card 2: Identity & Legal Verification (KYC Documents) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              2. Government Identity & Legal Verification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Legal Name (as on ID)
                </label>
                <input
                  type="text"
                  value={kycData.legalName}
                  onChange={(e) => setKycData({ ...kycData, legalName: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Government ID Type
                </label>
                <select
                  value={kycData.idType}
                  onChange={(e) => setKycData({ ...kycData, idType: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="National Identity Number (NIN)">National Identity Number (NIN)</option>
                  <option value="International Passport">International Passport</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="Voter's Card (PVC)">Permanent Voter's Card (PVC)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  ID Document Number
                </label>
                <input
                  type="text"
                  value={kycData.idNumber}
                  onChange={(e) => setKycData({ ...kycData, idNumber: e.target.value })}
                  placeholder="e.g. 98451234761"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Upload ID Document (Slip / Card)
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 h-11 px-3.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer transition-colors overflow-hidden">
                    <Upload className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{kycData.idFileName || 'Choose File (PDF/JPG)'}</span>
                    <input type="file" onChange={handleIdFileUpload} className="hidden" accept=".pdf,image/*" />
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Residential Address & State
                </label>
                <input
                  type="text"
                  value={kycData.address}
                  onChange={(e) => setKycData({ ...kycData, address: e.target.value })}
                  placeholder="e.g. 14 Admiralty Way, Lekki Phase 1, Lagos"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Sub-card 3: Academic Credentials & Teaching Verification */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              3. Academic Qualifications & Teaching Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Highest Educational Qualification
                </label>
                <select
                  value={kycData.highestDegree}
                  onChange={(e) => setKycData({ ...kycData, highestDegree: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Bachelor's Degree (B.Sc / B.Ed / B.A)">Bachelor's Degree (B.Sc / B.Ed / B.A)</option>
                  <option value="Master's Degree (M.Sc. Mathematics)">Master's Degree (M.Sc / M.Ed)</option>
                  <option value="Doctorate (Ph.D)">Doctorate (Ph.D)</option>
                  <option value="HND / Higher National Diploma">HND / Higher National Diploma</option>
                  <option value="TRCN Certified Educator">TRCN Certified Educator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Institution / University Attended
                </label>
                <input
                  type="text"
                  value={kycData.institution}
                  onChange={(e) => setKycData({ ...kycData, institution: e.target.value })}
                  placeholder="e.g. University of Lagos (UNILAG)"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={kycData.gradYear}
                  onChange={(e) => setKycData({ ...kycData, gradYear: e.target.value })}
                  placeholder="2021"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Certificate Document (Degree / TRCN)
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 h-11 px-3.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer transition-colors overflow-hidden">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{kycData.certFileName || 'Choose File (PDF/JPG)'}</span>
                    <input type="file" onChange={handleCertFileUpload} className="hidden" accept=".pdf,image/*" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-card 4: Platform Payout & Disbursement Policy (Admin Governed) */}
          <div className="bg-[#FBF9F4] rounded-2xl p-5 border border-[#E8E3D7] shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0F5338]" />
                4. Automated Payout & Disbursement Policy
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto">
                <ShieldCheck className="w-3 h-3" /> Managed by Platform Admin
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-white border border-[#E8E3D7] space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Platform Payout Frequency
                </p>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🗓️</span>
                  <span>{localStorage.getItem('akademi_platform_payout_schedule') || 'Weekly (Every Friday at 4:00 PM)'}</span>
                </p>
                <p className="text-[11px] text-slate-500">Disbursed directly into your verified bank account.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E8E3D7] space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Minimum Payout Threshold
                </p>
                <p className="text-sm font-bold text-[#0F5338] flex items-center gap-1.5">
                  <span>💰</span>
                  <span>₦{Number(localStorage.getItem('akademi_min_payout_threshold') || 5000).toLocaleString()} Minimum Balance</span>
                </p>
                <p className="text-[11px] text-slate-500">Auto-transfers when balance reaches platform minimum.</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed bg-white/60 p-3 rounded-xl border border-[#E8E3D7]/60">
              ℹ️ Platform disbursement schedules and minimum payout thresholds are managed centrally by the <strong>Akademi Super Admin</strong>. Ensure your bank account details above are accurate.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#0F5338] hover:bg-[#0a3d29] text-white rounded-xl px-8 py-3.5 text-xs font-extrabold transition-all shadow-md active:scale-98 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Save Tutor KYC & Payout Details
            </button>
          </div>
        </form>
        )}

        {/* 3. Security & Password */}
        <form onSubmit={handleUpdatePassword} className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Security & Password</h2>
              <p className="text-xs text-slate-500">Update your login password and active session protection.</p>
            </div>
          </div>
          
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Current Password</label>
              <input 
                type="password" 
                value={currPassword}
                onChange={(e) => setCurrPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters" 
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password" 
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            <button 
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 py-2.5 text-xs font-bold transition-colors shadow-sm"
            >
              Update Password
            </button>
          </div>
        </form>

        {/* 3. Google Account & Google Calendar Integration */}
        <div className="p-6 sm:p-8 space-y-6 bg-gradient-to-br from-slate-50/50 via-white to-emerald-50/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0">
                <GoogleLogo className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Google Account & Calendar Sync</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synchronize tutoring bookings with your personal Google Calendar and enable Google SSO.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleGoogleCalendar}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto active:scale-95",
                googleConnected
                  ? "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
                  : "bg-[#0F5338] hover:bg-[#0a3d29] text-white"
              )}
            >
              <GoogleLogo className="w-4 h-4" />
              <span>{googleConnected ? 'Disconnect Google Calendar' : 'Connect Google Calendar'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Sync Status Card */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Connection Status</span>
                <span className={cn(
                  "text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1",
                  googleConnected
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                )}>
                  <span className={cn("w-2 h-2 rounded-full", googleConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
                  {googleConnected ? 'Active & Synced' : 'Not Connected'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {googleConnected 
                  ? `Authorized for: ${googleAccount}`
                  : 'Link your Google account to automatically export lesson meetings to calendar.'}
              </p>
              {googleConnected && (
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleForceCalendarSync}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={cn("w-3.5 h-3.5 text-slate-600", calendarSyncSuccess && "animate-spin")} />
                    <span>{calendarSyncSuccess ? 'Sync Complete!' : 'Force Sync Now'}</span>
                  </button>
                  <span className="text-[11px] text-slate-400">11 sessions in sync</span>
                </div>
              )}
            </div>

            {/* Calendar Reminder Settings */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Calendar Alarm Notification</span>
                <Clock className="w-4 h-4 text-[#0F5338]" />
              </div>
              <p className="text-xs text-slate-500">How long before a class Google Calendar should alert you:</p>
              <select
                value={calendarLeadTime}
                onChange={(e) => setCalendarLeadTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl h-9 px-3 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="10m">10 minutes before lesson</option>
                <option value="15m">15 minutes before lesson (Recommended)</option>
                <option value="30m">30 minutes before lesson</option>
                <option value="1h">1 hour before lesson</option>
                <option value="24h">24 hours before lesson</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Notification Preferences */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
              <p className="text-xs text-slate-500">Configure how you receive session reminders and updates.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 'emailReminders', label: 'Email Session Reminders', desc: 'Receive an automated email 24 hours before your live class.' },
              { id: 'smsReminders', label: 'SMS & WhatsApp Alerts', desc: 'Receive a fast text alert 15 minutes before session start.' },
              { id: 'messageAlerts', label: 'Student / Tutor Messages', desc: 'Get notified immediately when someone sends you a message.' },
              { id: 'weeklyDigest', label: 'Weekly Earnings & Progress Digest', desc: 'Summary of completed lessons, earnings, and student feedback.' },
              { id: 'twoFactorAuth', label: 'Two-Factor Authentication (2FA)', desc: 'Require verification code on new browser logins.' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="pr-4">
                  <h4 className="font-bold text-slate-900 text-sm">{item.label}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleToggle(item.id as keyof typeof toggles)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
                    toggles[item.id as keyof typeof toggles] ? "bg-emerald-500" : "bg-slate-200"
                  )}
                >
                  <span className={cn(
                    "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm",
                    toggles[item.id as keyof typeof toggles] ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Appearance & Theme Settings */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Appearance & Theme</h2>
              <p className="text-xs text-slate-500">Choose between Warm Cream Editorial (Day) and Deep Obsidian (Night) interface.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={cn(
                "p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 relative",
                !isDark 
                  ? "border-[#0F5338] bg-[#EAF5EE]/60 ring-2 ring-[#0F5338] shadow-sm" 
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-[#FBF9F4] border border-[#E8E3D7] flex items-center justify-center text-slate-800 shrink-0">
                ☀️
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Light Mode (Default)</h4>
                <p className="text-xs text-slate-500 mt-0.5">Warm cream canvas with deep forest green editorial tones.</p>
              </div>
              {!isDark && (
                <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#0F5338] text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={cn(
                "p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 relative",
                isDark 
                  ? "border-[#0F5338] bg-[#1A2A22] ring-2 ring-[#0F5338] shadow-sm" 
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-300 shrink-0">
                🌙
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Night Mode (Dark)</h4>
                <p className="text-xs text-slate-500 mt-0.5">Reduced eye strain in low-light with rich dark emerald surfaces.</p>
              </div>
              {isDark && (
                <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#0F5338] text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-rose-200 bg-rose-50/70 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-rose-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Delete Account & Reset Data
          </h3>
          <p className="text-xs text-rose-700/90 mt-1 max-w-lg leading-relaxed">
            Permanently erase your active profile, wallet history, and teaching sessions. This cannot be undone.
          </p>
        </div>
        <button 
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5 py-2.5 text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
        >
          Delete Account
        </button>
      </div>

      {/* Snapcode Referral Modal */}
      <ReferralSnapcodeBadge
        isOpen={showSnapcodeModal}
        onClose={() => setShowSnapcodeModal(false)}
        user={user}
      />

      {/* Account Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-6 border border-slate-200 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Delete Account?</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Are you sure you want to permanently delete your Akademi account and data?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  Yes, Delete All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Google Calendar OAuth Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        mode="calendar_connect"
        onSuccess={handleGoogleAuthSuccess}
      />
    </motion.div>
  );
}
