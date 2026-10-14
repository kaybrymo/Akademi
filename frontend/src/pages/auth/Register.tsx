import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  BookOpen, 
  CheckCircle2, 
  Mail, 
  Lock, 
  GraduationCap,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Coins,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiEnabled, apiRegister, apiErrorMessage } from '@/lib/api';
import GoogleAuthModal, { GoogleLogo } from '@/components/ui/GoogleAuthModal';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read role from query param (?role=tutor) or default to student
  const initialRole = searchParams.get('role') === 'tutor' ? 'tutor' : 'student';
  const [role, setRole] = useState<'student' | 'tutor'>(initialRole);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [subject, setSubject] = useState('Mathematics & Further Maths');
  const [rate, setRate] = useState('3500');
  const [experience, setExperience] = useState('3+ years');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get('role') === 'tutor') {
      setRole('tutor');
    }
  }, [searchParams]);

  const handleGoogleAuthSuccess = (googleUser: any) => {
    localStorage.setItem('akademi_auth_user', JSON.stringify(googleUser));
    localStorage.setItem('akademi_google_calendar_connected', 'true');
    localStorage.setItem('akademi_google_calendar_account', googleUser.email);
    
    if (googleUser.role === 'tutor') {
      const newTutorItem = {
        id: Date.now(),
        name: googleUser.name,
        email: googleUser.email,
        phone: '+234 800 000 0000',
        location: 'Lagos, Nigeria',
        initials: googleUser.initials,
        color: 'bg-emerald-600',
        subjects: ['Mathematics', 'General Science', 'Exam Prep'],
        speciality: 'Mathematics & Calculus Specialist',
        rating: 5.0,
        reviewCount: 0,
        rate: 4500,
        sessions: 0,
        experience: '3+ years',
        languages: ['English'],
        status: 'Pending',
        verified: false,
        bio: `Verified educator on Akademi with Google credentials.`
      };

      try {
        const existingTutors = JSON.parse(localStorage.getItem('akademi_registered_tutors') || '[]');
        localStorage.setItem('akademi_registered_tutors', JSON.stringify([newTutorItem, ...existingTutors]));
      } catch (e) {}
      
      setShowSuccessModal(true);
    } else {
      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Create the real account first when the API is configured.
    let apiProfile: Awaited<ReturnType<typeof apiRegister>> | null = null;
    if (apiEnabled) {
      setSubmitting(true);
      try {
        apiProfile = await apiRegister({ name: name.trim(), email: email.trim(), password, role });
      } catch (err) {
        setAuthError(apiErrorMessage(err, 'Could not create your account.'));
        return;
      } finally {
        setSubmitting(false);
      }
    }
    
    const cleanName = name.trim() || (role === 'tutor' ? 'Dr. Babatunde Lawal' : 'Chiamaka Eze');
    const nameParts = cleanName.split(' ');
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() 
      : cleanName.substring(0, 2).toUpperCase();

    const authUser = {
      ...(apiProfile ?? {}),
      name: cleanName,
      email: email.trim() || (role === 'tutor' ? 'tutor@akademi.com' : 'chiamaka@akademi.com'),
      role: role,
      initials: initials,
      subject: subject,
      rate: Number(rate) || 3500,
      experience: experience,
      status: role === 'tutor' ? 'Pending' : 'Active',
      verified: role !== 'tutor',
      title: role === 'tutor' ? `${subject} Educator` : 'A-Level Student'
    };

    localStorage.setItem('akademi_auth_user', JSON.stringify(authUser));
    
    if (role === 'tutor') {
      const newTutorItem = {
        id: Date.now(),
        name: cleanName,
        email: authUser.email,
        phone: '+234 800 000 0000',
        location: 'Lagos, Nigeria',
        initials: initials,
        color: 'bg-emerald-600',
        subjects: [subject, 'General Studies', 'Exam Prep'],
        speciality: subject,
        rating: 5.0,
        reviewCount: 0,
        rate: Number(rate) || 3500,
        sessions: 0,
        experience: experience,
        languages: ['English'],
        status: 'Pending',
        verified: false,
        bio: `Certified ${subject} tutor with ${experience} experience. Ready to teach students on Akademi.`
      };

      try {
        const existingTutors = JSON.parse(localStorage.getItem('akademi_registered_tutors') || '[]');
        localStorage.setItem('akademi_registered_tutors', JSON.stringify([newTutorItem, ...existingTutors]));
      } catch (e) {}

      setShowSuccessModal(true);
    } else {
      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard');
    }
  };

  const handleFinishRegistration = () => {
    window.dispatchEvent(new Event('storage'));
    navigate('/dashboard');
  };

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: 'bg-slate-200', width: 'w-0' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-rose-500', width: 'w-1/3' };
    if (password.length < 10) return { label: 'Good', color: 'bg-amber-500', width: 'w-2/3' };
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      {/* Left Column: Deep Forest Branding & Role Benefits */}
      <div className="hidden lg:flex flex-col lg:w-1/2 bg-[#0E4833] text-white p-12 lg:p-16 justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.25),_transparent_65%)] pointer-events-none" />
        
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

        {/* Dynamic Benefits depending on active role */}
        <div className="relative z-10 max-w-lg my-auto py-8">
          <AnimatePresence mode="wait">
            {role === 'tutor' ? (
              <motion.div
                key="tutor-benefits"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-bold mb-6">
                  <GraduationCap className="h-3.5 w-3.5" /> Educator Onboarding
                </div>
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight mb-4 leading-[1.15]">
                  Teach & earn on <span className="text-emerald-300">your terms.</span>
                </h2>
                <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed mb-8">
                  Join our network of verified educators. Set your own session rates, teach via our HD video classroom, and receive direct wallet payouts.
                </p>

                <div className="space-y-3.5">
                  {[
                    { title: "Direct Weekly Payouts", desc: "Automated instant NUBAN bank withdrawals via Paystack." },
                    { title: "Calm HD Classroom Suite", desc: "Integrated video streams, interactive whiteboard & screen share." },
                    { title: "10-Day Session Vault", desc: "Automated session recording and extended storage management." }
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-4 bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-md">
                      <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-sm text-white">{feat.title}</h3>
                        <p className="text-emerald-100/70 text-xs mt-0.5">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="student-benefits"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-bold mb-6">
                  <Sparkles className="h-3.5 w-3.5" /> Student Learning Hub
                </div>
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight mb-4 leading-[1.15]">
                  Start learning, <span className="text-emerald-300">beautifully.</span>
                </h2>
                <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed mb-8">
                  Join thousands of ambitious students connected with verified 1-on-1 tutors across STEM, Languages, and Exam Prep.
                </p>

                <div className="space-y-3.5">
                  {[
                    { title: "Vetted Subject Experts", desc: "Top 5% verified tutors with proven academic credentials." },
                    { title: "Smart Instant Booking", desc: "Reserve 1-on-1 or group masterclass sessions in seconds." },
                    { title: "Gamified LearnTokens", desc: "Earn tokens on streaks and convert them into free lesson time." }
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-4 bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-md">
                      <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-sm text-white">{feat.title}</h3>
                        <p className="text-emerald-100/70 text-xs mt-0.5">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-emerald-200/60 pt-6 border-t border-white/10">
          <span>© 2026 Akademi Academy Ltd.</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> SSL Encrypted & Secure</span>
        </div>
      </div>

      {/* Right Column: Clean Registration Form */}
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
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-950 tracking-tight mb-2">
              {role === 'tutor' ? 'Teach on Akademi' : 'Create an Account'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[#0F5338] font-bold hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>

          {/* Account Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button 
              type="button"
              onClick={() => setRole('student')}
              className={cn(
                "rounded-2xl p-3.5 flex flex-col items-center gap-1.5 transition-all border text-center cursor-pointer",
                role === 'student' 
                  ? "border-[#0F5338] bg-emerald-50/70 text-[#0F5338] ring-2 ring-[#0F5338]/20 font-bold shadow-xs" 
                  : "border-slate-200 hover:border-slate-300 text-slate-600 font-medium"
              )}
            >
              <User className="w-5 h-5 text-[#0F5338]" />
              <span className="text-xs">🎓 Student Account</span>
            </button>
            <button 
              type="button"
              onClick={() => setRole('tutor')}
              className={cn(
                "rounded-2xl p-3.5 flex flex-col items-center gap-1.5 transition-all border text-center cursor-pointer",
                role === 'tutor' 
                  ? "border-[#0F5338] bg-emerald-50/70 text-[#0F5338] ring-2 ring-[#0F5338]/20 font-bold shadow-xs" 
                  : "border-slate-200 hover:border-slate-300 text-slate-600 font-medium"
              )}
            >
              <BookOpen className="w-5 h-5 text-[#0F5338]" />
              <span className="text-xs">🏫 Educator / Tutor</span>
            </button>
          </div>

          {/* Google Sign-up Button */}
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-2xl h-12 font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-3 active:scale-[0.98] mb-4 cursor-pointer"
          >
            <GoogleLogo className="w-5 h-5" />
            <span>Sign up with Google Account</span>
          </button>

          {/* Separator */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">or sign up manually</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  id="name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'tutor' ? 'Dr. Babatunde Lawal' : 'Chiamaka Eze'}
                  required
                  className="bg-slate-50/50 border border-slate-300 focus:bg-white rounded-2xl h-12 pl-11 pr-4 w-full focus:ring-2 focus:ring-[#0F5338] focus:border-[#0F5338] outline-none text-xs sm:text-sm text-slate-900 transition-all font-medium"
                />
              </div>
            </div>

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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" htmlFor="password">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
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

              {/* Password strength bar */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-300", strength.color, strength.width)} />
                  </div>
                  <p className="text-[10px] text-slate-500 text-right font-medium">
                    Strength: <span className="font-bold">{strength.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Educator Specific Fields */}
            {role === 'tutor' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-2 border-t border-slate-200"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Primary Teaching Specialty
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-slate-50/50 border border-slate-300 focus:bg-white rounded-2xl h-12 px-4 w-full focus:ring-2 focus:ring-[#0F5338] focus:border-[#0F5338] outline-none text-xs sm:text-sm text-slate-900 font-medium"
                  >
                    <option value="Mathematics & Further Maths">Mathematics & Further Maths</option>
                    <option value="Physics & Engineering">Physics & Engineering</option>
                    <option value="Chemistry & Biochemistry">Chemistry & Biochemistry</option>
                    <option value="English Literature & SAT Prep">English Literature & SAT Prep</option>
                    <option value="Spanish & Modern Languages">Spanish & Modern Languages</option>
                    <option value="Data Science & Python">Data Science & Python</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Session Rate (₦/hr)
                    </label>
                    <input 
                      type="number"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      placeholder="3500"
                      className="bg-slate-50/50 border border-slate-300 focus:bg-white rounded-2xl h-12 px-4 w-full focus:ring-2 focus:ring-[#0F5338] focus:border-[#0F5338] outline-none text-xs sm:text-sm text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Teaching Experience
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="bg-slate-50/50 border border-slate-300 focus:bg-white rounded-2xl h-12 px-4 w-full focus:ring-2 focus:ring-[#0F5338] focus:border-[#0F5338] outline-none text-xs sm:text-sm text-slate-900 font-medium"
                    >
                      <option value="1-2 years">1–2 years</option>
                      <option value="3+ years">3+ years</option>
                      <option value="5+ years">5+ years</option>
                      <option value="10+ years (Master)">10+ years (Master)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

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
              <span>{role === 'tutor' ? 'Submit Educator Application' : 'Create Student Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </motion.div>
      </div>

      {/* Google Sign-in Interactive Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        mode="signup"
        onSuccess={handleGoogleAuthSuccess}
      />

      {/* Educator Application Received Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={handleFinishRegistration}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl z-10 border border-slate-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#0F5338] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-slate-950">Educator Application Submitted!</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Welcome to Akademi! Your credentials have been submitted for priority verification by platform administrators.
                </p>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-[#0F5338] text-left font-medium space-y-1">
                <p className="font-bold flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-emerald-600" /> Educator Portal Unlocked</p>
                <p className="text-slate-600">You can set your availability and configure your profile while verification completes.</p>
              </div>

              <button
                type="button"
                onClick={handleFinishRegistration}
                className="w-full py-3.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Go to Educator Dashboard →
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
