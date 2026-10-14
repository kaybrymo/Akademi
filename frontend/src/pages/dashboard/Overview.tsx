import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Star, 
  TrendingUp, 
  Plus, 
  BookOpen, 
  ArrowRight,
  Users,
  Wallet,
  DollarSign,
  CheckCircle2,
  X,
  Sparkles,
  SlidersHorizontal,
  MoreHorizontal,
  MessageSquare,
  Video,
  Play,
  FileText,
  Lock,
  Gift,
  Zap,
  Coins,
  QrCode,
  Flame,
  Award,
  Users2,
  ShieldCheck
} from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { cn } from '@/lib/utils';
import LessonNotesModal from '@/components/ui/LessonNotesModal';
import ClassroomLobbyModal from '@/components/ui/ClassroomLobbyModal';
import ReferralSnapcodeBadge from '@/components/ui/ReferralSnapcodeBadge';
import { calculateSessionAccess, type SessionAccessResult } from '@/lib/sessionAccess';

export default function Overview() {
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
    } catch (e) {}
    return {
      name: 'Maya',
      email: 'maya@akademi.dev',
      role: 'tutor',
      initials: 'MY',
      title: 'Mathematics · Physics',
      avatar: '/images/tutor-daniel.jpg'
    };
  });

  // Student LearnTokens & Session Time Reward States
  const [userTokens, setUserTokens] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('akademi_user_tokens');
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return 450;
  });

  const [studentRewardMinutes, setStudentRewardMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('akademi_student_reward_minutes');
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return 30;
  });

  const [tokensPerMinute, setTokensPerMinute] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('akademi_tokens_per_minute');
      if (saved) return Number(saved);
    } catch (e) {}
    return 10;
  });

  const [streakBonusTokens, setStreakBonusTokens] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('akademi_streak_bonus_tokens');
      if (saved) return Number(saved);
    } catch (e) {}
    return 50;
  });

  const [referralBonusTokens, setReferralBonusTokens] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('akademi_referral_bonus_tokens');
      if (saved) return Number(saved);
    } catch (e) {}
    return 150;
  });

  const [enableCommunities, setEnableCommunities] = useState(() => {
    const saved = localStorage.getItem('akademi_enable_communities');
    return saved !== null ? saved === 'true' : false;
  });

  const [tokenConverterModalOpen, setTokenConverterModalOpen] = useState(false);
  const [customConvertTokens, setCustomConvertTokens] = useState<number>(100);
  const [snapcodeModalOpen, setSnapcodeModalOpen] = useState(false);

  const defaultEnrolledStudents = [
    {
      id: 101,
      name: 'Ngozi Uche',
      topic: 'Trigonometry & Calculus',
      time: '10m ago',
      amount: '₦3,500',
      avatar: '/images/hero-student.jpg',
      status: 'Paid & Confirmed'
    },
    {
      id: 102,
      name: 'Yusuf Ibrahim',
      topic: 'Physics Lab & Wave Optics',
      time: '45m ago',
      amount: '₦4,000',
      avatar: '/images/tutor-ibrahim.jpg',
      status: 'Paid & Confirmed'
    }
  ];

  const [enrolledStudents, setEnrolledStudents] = useState<any[]>(defaultEnrolledStudents);

  // Group enrolled students so repeat bookings from the same user appear ONCE with a multi-payment badge
  const groupedEnrolledStudents = React.useMemo(() => {
    const groups: Record<string, {
      studentName: string;
      avatar: string;
      totalBookings: number;
      totalPaidNgn: number;
      totalSubsidyNgn: number;
      isSubsidized: boolean;
      latestTime: string;
      latestTopic: string;
      sessions: Array<{ id: string | number; topic: string; amount: string; time: string; isSubsidized?: boolean }>;
    }> = {};

    enrolledStudents.forEach(item => {
      const key = (item.name || 'Student').trim().toLowerCase();
      const rawAmt = Number(String(item.amount).replace(/[^0-9]/g, '')) || 3500;
      const subsidyAmt = Number(item.rewardSubsidyAmount) || 0;
      const isSub = Boolean(item.isTokenSubsidized || subsidyAmt > 0);
      
      if (!groups[key]) {
        groups[key] = {
          studentName: item.name,
          avatar: item.avatar || '/images/hero-student.jpg',
          totalBookings: 0,
          totalPaidNgn: 0,
          totalSubsidyNgn: 0,
          isSubsidized: false,
          latestTime: item.time,
          latestTopic: item.topic,
          sessions: []
        };
      }

      groups[key].totalBookings += 1;
      groups[key].totalPaidNgn += rawAmt;
      groups[key].totalSubsidyNgn += subsidyAmt;
      if (isSub) groups[key].isSubsidized = true;
      groups[key].sessions.push({
        id: item.id,
        topic: item.topic,
        amount: item.amount,
        time: item.time,
        isSubsidized: isSub
      });
    });

    return Object.values(groups);
  }, [enrolledStudents]);

  const [messagedStudents, setMessagedStudents] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('akademi_messaged_students');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  const handleMarkStudentMessaged = (name: string) => {
    const updated = { ...messagedStudents, [name]: true };
    setMessagedStudents(updated);
    try {
      localStorage.setItem('akademi_messaged_students', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  useEffect(() => {
    const loadData = () => {
      try {
        const saved = localStorage.getItem('akademi_auth_user');
        if (saved) setUser(JSON.parse(saved));
      } catch (e) {}

      try {
        const savedMessaged = localStorage.getItem('akademi_messaged_students');
        if (savedMessaged) setMessagedStudents(JSON.parse(savedMessaged));
      } catch (e) {}

      try {
        const savedTokens = localStorage.getItem('akademi_user_tokens');
        if (savedTokens !== null) setUserTokens(Number(savedTokens));
        const savedMins = localStorage.getItem('akademi_student_reward_minutes');
        if (savedMins !== null) setStudentRewardMinutes(Number(savedMins));
        const savedRate = localStorage.getItem('akademi_tokens_per_minute');
        if (savedRate) setTokensPerMinute(Number(savedRate));
        const savedStreak = localStorage.getItem('akademi_streak_bonus_tokens');
        if (savedStreak) setStreakBonusTokens(Number(savedStreak));
        const savedRef = localStorage.getItem('akademi_referral_bonus_tokens');
        if (savedRef) setReferralBonusTokens(Number(savedRef));
      } catch (e) {}

      try {
        const savedBookings = localStorage.getItem('akademi_booked_sessions');
        if (savedBookings) {
          const list = JSON.parse(savedBookings);
          const dynamic = list.map((b: any, idx: number) => ({
            id: b.id || `EB-${idx}`,
            name: b.studentName || 'Chiamaka Adeyemi',
            topic: `${b.subject || 'Calculus'} · ${b.timeSlot || 'Scheduled Session'}`,
            time: b.bookedAt || 'Just now',
            amount: b.price || '₦3,500',
            avatar: '/images/hero-student.jpg',
            status: 'Paid & Confirmed',
            isTokenSubsidized: b.isTokenSubsidized,
            rewardMinutesUsed: b.rewardMinutesUsed,
            rewardSubsidyAmount: b.rewardSubsidyAmount,
            studentPaid: b.studentPaid,
            tutorGrossEarnings: b.tutorGrossEarnings
          }));
          setEnrolledStudents([...dynamic, ...defaultEnrolledStudents]);
        }
      } catch (e) {}

      try {
        const savedComm = localStorage.getItem('akademi_enable_communities');
        setEnableCommunities(savedComm !== null ? savedComm === 'true' : false);
      } catch (e) {}
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const handleConvertTokens = (tokensToConvert: number) => {
    if (userTokens < tokensToConvert) {
      setToastMsg(`Insufficient tokens! You need ${tokensToConvert} LearnTokens.`);
      setTimeout(() => setToastMsg(null), 3000);
      return;
    }
    const minutesGained = Math.floor(tokensToConvert / tokensPerMinute);
    const nextTokens = userTokens - tokensToConvert;
    const nextMinutes = studentRewardMinutes + minutesGained;

    setUserTokens(nextTokens);
    setStudentRewardMinutes(nextMinutes);
    localStorage.setItem('akademi_user_tokens', String(nextTokens));
    localStorage.setItem('akademi_student_reward_minutes', String(nextMinutes));

    // Log transaction
    try {
      const existingTx = JSON.parse(localStorage.getItem('akademi_user_transactions') || '[]');
      const newTx = {
        id: `TOK-${Date.now().toString().slice(-6)}`,
        type: 'Token Conversion',
        description: `Converted ${tokensToConvert} LearnTokens into ${minutesGained} min Session Time`,
        amount: `+${minutesGained} Mins`,
        status: 'Completed',
        date: 'Just now'
      };
      localStorage.setItem('akademi_user_transactions', JSON.stringify([newTx, ...existingTx]));
    } catch (e) {}

    window.dispatchEvent(new Event('storage'));
    setTokenConverterModalOpen(false);
    setToastMsg(`🎉 Success! Converted ${tokensToConvert} LearnTokens into +${minutesGained} Free Session Minutes.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleClaimStreakBonus = () => {
    const nextTokens = userTokens + streakBonusTokens;
    setUserTokens(nextTokens);
    localStorage.setItem('akademi_user_tokens', String(nextTokens));
    
    try {
      const existingTx = JSON.parse(localStorage.getItem('akademi_user_transactions') || '[]');
      const newTx = {
        id: `STRK-${Date.now().toString().slice(-6)}`,
        type: 'Streak Reward',
        description: `Claimed 12-day streak bonus reward`,
        amount: `+${streakBonusTokens} Tokens`,
        status: 'Completed',
        date: 'Just now'
      };
      localStorage.setItem('akademi_user_transactions', JSON.stringify([newTx, ...existingTx]));
    } catch (e) {}

    window.dispatchEvent(new Event('storage'));
    setToastMsg(`🔥 Daily Streak Bonus claimed! +${streakBonusTokens} LearnTokens added to your balance.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const isTutor = user.role === 'tutor';

  // Availability modal state
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [availableDays, setAvailableDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [instantBook, setInstantBook] = useState(true);

  // New Course modal state
  const [newCourseModalOpen, setNewCourseModalOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('Mathematics');
  const [courseLevel, setCourseLevel] = useState('Intermediate');
  const [coursePrice, setCoursePrice] = useState('35000');
  const [courseSessions, setCourseSessions] = useState('12');

  // Today's schedule state for tutor
  const [todaySchedule, setTodaySchedule] = useState([
    {
      id: 1,
      period: 'PM',
      time: '4:30',
      title: 'Calculus — Integration by parts',
      student: 'Chiamaka Obi',
      duration: '60 min',
      avatar: '/images/hero-student.jpg',
      isLive: true
    },
    {
      id: 2,
      period: 'PM',
      time: '6:00',
      title: 'Mechanics — Projectile motion',
      student: 'Emeka Nnaji',
      duration: '45 min',
      avatar: '/images/tutor-daniel.jpg',
      isLive: false
    },
    {
      id: 3,
      period: 'PM',
      time: '7:30',
      title: 'Algebra refresher',
      student: 'Amina Bello',
      duration: '30 min',
      avatar: '/images/tutor-adaeze.jpg',
      isLive: false
    }
  ]);

  // Prep modal state
  const [prepModalSession, setPrepModalSession] = useState<any | null>(null);
  const [selectedNoteSession, setSelectedNoteSession] = useState<any | null>(null);

  // Classroom Lobby Modal State
  const [lobbyModalSession, setLobbyModalSession] = useState<any | null>(null);
  const [lobbyModalAccessResult, setLobbyModalAccessResult] = useState<SessionAccessResult | null>(null);

  // Periodic heartbeat timer to keep lock timers & countdowns live
  const [, setHeartbeat] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setHeartbeat(h => h + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('akademi_tutor_availability', JSON.stringify({ availableDays, startTime, endTime, instantBook }));
    setAvailabilityModalOpen(false);
    setToastMsg('Weekly teaching availability updated successfully!');
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    const newCourse = {
      id: Date.now(),
      title: courseTitle,
      category: courseCategory.toUpperCase(),
      level: courseLevel,
      price: `₦${Number(coursePrice).toLocaleString()}`,
      sessions: `${courseSessions} sessions`,
      progress: 0,
      tutor: user.name,
      rating: '5.0',
      purchaseDate: 'Just now',
      avatar: user.avatar || '/images/tutor-daniel.jpg',
      bg: 'bg-[#EAF5EE]',
      border: 'border-[#D5EADB]'
    };
    const existing = JSON.parse(localStorage.getItem('akademi_tutor_courses') || '[]');
    localStorage.setItem('akademi_tutor_courses', JSON.stringify([newCourse, ...existing]));
    setNewCourseModalOpen(false);
    setCourseTitle('');
    setToastMsg(`Course "${courseTitle}" created and submitted for catalog review!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Student dashboard dynamic & static upcoming sessions
  const [upcomingSessionsStudent, setUpcomingSessionsStudent] = useState<any[]>(() => {
    const staticSessions = [
      { id: 1, title: "Calculus — Integration by parts", tutor: "Dr. Chiamaka Eze", duration: "60 min", time: "Today · 4:30 PM", image: "/images/tutor-daniel.jpg", type: '1on1' },
      { id: 2, title: "Spanish conversation practice", tutor: "Halima Yusuf", duration: "45 min", time: "Tomorrow · 6:00 PM", image: "/images/tutor-adaeze.jpg", type: 'group' },
      { id: 3, title: "Physics — Quantum basics", tutor: "James Okonkwo", duration: "60 min", time: "Fri · 5:15 PM", image: "/images/tutor-ibrahim.jpg", type: '1on1' }
    ];
    try {
      const savedBookings = localStorage.getItem('akademi_booked_sessions');
      if (savedBookings) {
        const parsed = JSON.parse(savedBookings);
        const dynamic = parsed.map((b: any, idx: number) => ({
          id: 100 + idx,
          title: `${b.subject} Lesson`,
          tutor: b.tutorName || 'Vetted Tutor',
          duration: b.duration || '60 min',
          time: `${b.date || 'Today'} · ${b.time || '4:30 PM'}`,
          image: b.tutorAvatar || '/images/tutor-daniel.jpg',
          type: (b.type === 'group' || (b.format && b.format.toLowerCase().includes('group'))) ? 'group' : '1on1',
          isNew: true
        }));
        return [...dynamic, ...staticSessions];
      }
    } catch (e) {}
    return staticSessions;
  });

  const recentMessagesStudent = [
    { id: 1, name: "Dr. Chiamaka Eze", time: "2m", text: "Great work on the practice set — let's review Q4 tomorrow.", image: "/images/tutor-daniel.jpg" },
    { id: 2, name: "Halima Yusuf", time: "1h", text: "¡Hola! I've shared the vocab list for our next session.", image: "/images/tutor-adaeze.jpg" },
    { id: 3, name: "James Okonkwo", time: "3h", text: "Sending over a reading list for quantum mechanics.", image: "/images/tutor-ibrahim.jpg" }
  ];

  const enrolledCoursesStudent = [
    { id: 1, title: "A-level Mathematics", lessons: "24 lessons", progress: 72, bg: "bg-[#EAF5EE]", border: "border-[#D5EADB]" },
    { id: 2, title: "Conversational Spanish", lessons: "16 lessons", progress: 38, bg: "bg-[#FDF2E3]", border: "border-[#F3E3CD]" },
    { id: 3, title: "Physics Fundamentals", lessons: "18 lessons", progress: 55, bg: "bg-[#E8F3F5]", border: "border-[#D4E7EA]" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8 max-w-6xl font-sans"
    >
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#0F5338] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TUTOR WORKSPACE VIEW (MATCHES SCREENSHOT EXACTLY) */}
      {/* ========================================================================= */}
      {isTutor ? (
        <>
          {/* Top Greeting & Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">
                {user.title || 'Mathematics · Physics'}
              </p>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141E18] tracking-tight">
                Welcome back, <span className="text-[#0F5338]">{user.name || 'Maya'}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                You have <strong className="text-slate-900 font-bold">{todaySchedule.length} sessions today</strong> and <strong className="text-slate-900 font-bold">{groupedEnrolledStudents.length} newly enrolled students</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setAvailabilityModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-all active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Set availability</span>
              </button>

              <button
                type="button"
                onClick={() => setNewCourseModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full px-5 py-2.5 text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                <span>New course</span>
              </button>
            </div>
          </div>

          {/* Pending Verification Notice for Tutors */}
          {isTutor && ((user as any).status === 'Pending' || (user as any).verified === false) && (
            <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-amber-950 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold shrink-0 text-base">
                ⏳
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-amber-900">Application Under Review (Pending Admin Verification)</p>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-extrabold text-[9px] uppercase tracking-wider rounded-full">
                    Pending
                  </span>
                </div>
                <p className="text-amber-900/80 mt-1 leading-relaxed text-xs">
                  Your tutor application is currently being reviewed by the Akademi admin team. Your profile is hidden from the public student directory ("Find Tutors") until verified. You can still set up your availability schedule and manage your materials below.
                </p>
              </div>
            </div>
          )}

          {/* 4 Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-[#E8E3D7] p-5 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  EARNINGS THIS MONTH
                </span>
                <span className="text-xs font-bold text-[#0F5338] bg-emerald-50 w-6 h-6 rounded-full flex items-center justify-center border border-emerald-100">
                  ₦
                </span>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#141E18]">
                  ₦5,130,000
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E3D7] p-5 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  SESSIONS COMPLETED
                </span>
                <Calendar className="h-4 w-4 text-[#0F5338]/70" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#141E18]">
                  48
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3 h-3" /> +6
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E3D7] p-5 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  ACTIVE STUDENTS
                </span>
                <Users className="h-4 w-4 text-[#0F5338]/70" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#141E18]">
                  32
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3 h-3" /> +4
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E3D7] p-5 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  AVG. RATING
                </span>
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#141E18]">
                  4.9
                </h3>
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mt-1">
                  <span className="text-amber-500">★</span> 192 reviews
                </span>
              </div>
            </div>
          </div>

          {/* Middle Row: Today's schedule (Left) & Booking requests (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Today's schedule */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E3D7] p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#141E18]">
                      Today's schedule
                    </h2>
                    <p className="text-xs text-slate-400">Friday, June 12</p>
                  </div>
                  <Link 
                    to="/dashboard/sessions" 
                    className="text-xs font-semibold text-[#0F5338] hover:underline flex items-center gap-1"
                  >
                    Full calendar &rarr;
                  </Link>
                </div>

                <div className="space-y-3">
                  {todaySchedule.map((session) => {
                    const access = calculateSessionAccess({
                      id: session.id,
                      timeDisplay: `Today · ${session.time} ${session.period}`,
                      isLive: session.isLive
                    });

                    return (
                      <div 
                        key={session.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FBF9F4] border border-[#E8E3D7] gap-3 hover:border-emerald-200 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Time Box */}
                          <div className="w-14 py-1.5 rounded-xl bg-slate-100/90 text-center shrink-0 border border-slate-200/60">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase leading-none">{session.period}</span>
                            <span className="text-xs font-black text-slate-800 leading-tight">{session.time}</span>
                          </div>

                          {/* Student Avatar */}
                          <img 
                            src={session.avatar} 
                            alt={session.student} 
                            className="w-10 h-10 rounded-full object-cover shrink-0 shadow-2xs"
                          />

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs font-bold text-[#141E18] truncate">
                                {session.title}
                              </h4>
                              <span className={cn("text-[9px] px-1.5 py-0.2 rounded border", access.badgeStyle)}>
                                {access.badgeText}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                              {session.student} · {session.duration}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          {access.isAccessible ? (
                            <Link
                              to={`/classroom/${session.id}`}
                              className="bg-[#0F5338] hover:bg-[#0A3D29] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1 active:scale-95"
                            >
                              <Video className="w-3 h-3" />
                              <span>{access.buttonText}</span>
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setLobbyModalSession(session);
                                setLobbyModalAccessResult(access);
                              }}
                              className="border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 inline-flex items-center gap-1"
                              title={access.lockReason}
                            >
                              <Lock className="w-3 h-3 text-amber-600" />
                              <span>{access.buttonText}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setPrepModalSession(session)}
                            className="border border-slate-200 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 inline-flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3 text-slate-400" />
                            <span>Prep</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Newly Enrolled Students (Auto-Confirmed & Paid) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E3D7] p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#141E18]">
                      Newly enrolled students
                    </h2>
                    <p className="text-xs text-slate-400">Paid & automatically confirmed</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {groupedEnrolledStudents.length} active
                  </span>
                </div>

                {groupedEnrolledStudents.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    No new enrolled students yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {groupedEnrolledStudents.map((st) => {
                      const isMulti = st.totalBookings > 1;
                      const isMessaged = !!messagedStudents[st.studentName];
                      return (
                        <div 
                          key={st.studentName}
                          className={cn(
                            "p-3.5 rounded-2xl transition-all space-y-3",
                            isMessaged 
                              ? "bg-emerald-50/60 border-2 border-emerald-500/80 shadow-xs ring-2 ring-emerald-500/20" 
                              : "bg-[#FBF9F4] border border-[#E8E3D7]"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative shrink-0">
                                <img 
                                  src={st.avatar} 
                                  alt={st.studentName} 
                                  className={cn(
                                    "w-10 h-10 rounded-full object-cover shadow-2xs",
                                    isMessaged ? "ring-2 ring-[#0F5338]" : ""
                                  )}
                                />
                                {isMulti && (
                                  <span 
                                    className="absolute -top-1 -right-1 bg-[#0F5338] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs" 
                                    title={`${st.totalBookings} paid bookings by this student`}
                                  >
                                    {st.totalBookings}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="text-xs font-bold text-slate-900 leading-none truncate">{st.studentName}</h4>
                                  {isMessaged && (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#0F5338] bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full shadow-2xs">
                                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" /> Messaged
                                    </span>
                                  )}
                                  {isMulti ? (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full shadow-2xs">
                                      ⚡ {st.totalBookings}x Sessions (₦{st.totalPaidNgn.toLocaleString()} Paid)
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                                      ₦{st.totalPaidNgn.toLocaleString()} Paid
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1 truncate">
                                  {isMulti 
                                    ? `${st.latestTopic} (+${st.totalBookings - 1} more scheduled)` 
                                    : st.latestTopic}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium shrink-0">{st.latestTime}</span>
                          </div>

                          <div className="flex gap-2">
                            <Link
                              to={`/dashboard/messages?recipient=${encodeURIComponent(st.studentName)}&role=student&topic=${encodeURIComponent(st.latestTopic)}&avatar=${encodeURIComponent(st.avatar)}`}
                              onClick={() => handleMarkStudentMessaged(st.studentName)}
                              className={cn(
                                "flex-1 py-1.5 rounded-xl text-xs font-bold text-center transition-all shadow-2xs flex items-center justify-center gap-1 active:scale-95",
                                isMessaged 
                                  ? "bg-emerald-700 hover:bg-emerald-800 text-white" 
                                  : "bg-[#0F5338] hover:bg-[#0A3D29] text-white"
                              )}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{isMessaged ? 'Continue Chat →' : 'Message'}</span>
                            </Link>
                            <Link
                              to="/dashboard/sessions"
                              className="flex-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
                            >
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{isMulti ? `View All (${st.totalBookings})` : 'View Session'}</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row: Earnings (Left) & Active students (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Earnings Overview */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E8E3D7] p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#141E18]">
                      Earnings
                    </h2>
                    <p className="text-xs text-slate-400">This week</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                    ↗ +18% vs last week
                  </span>
                </div>

                <div className="my-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#141E18]">
                      ₦1,263,000
                    </span>
                    <span className="text-xs text-slate-400">/ ₦1,800,000 goal</span>
                  </div>
                </div>

                {/* Mini Weekly Bar Chart */}
                <div className="grid grid-cols-7 gap-2 items-end h-28 pt-4 pb-2 border-b border-slate-100 mb-5">
                  {[
                    { day: 'Mon', height: '60%', active: false },
                    { day: 'Tue', height: '80%', active: false },
                    { day: 'Wed', height: '45%', active: false },
                    { day: 'Thu', height: '90%', active: false },
                    { day: 'Fri', height: '100%', active: true },
                    { day: 'Sat', height: '70%', active: false },
                    { day: 'Sun', height: '30%', active: false },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <div 
                        className={cn(
                          "w-full rounded-t-lg transition-all duration-500",
                          bar.active ? "bg-[#0F5338]" : "bg-emerald-100 hover:bg-emerald-200"
                        )}
                        style={{ height: bar.height }}
                      />
                      <span className="text-[10px] text-slate-400 font-semibold">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/dashboard/billing"
                className="w-full py-3 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Withdraw earnings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Right: Active Students list */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E8E3D7] p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-serif font-bold text-[#141E18]">
                    Active students
                  </h2>
                  <Link 
                    to="/dashboard/students" 
                    className="text-xs font-semibold text-[#0F5338] hover:underline flex items-center gap-1"
                  >
                    View all 142 &rarr;
                  </Link>
                </div>

                <div className="divide-y divide-slate-100">
                  {[
                    { name: 'Chiamaka Obi', course: 'A-level Mathematics', progress: 72, time: 'Today', avatar: '/images/hero-student.jpg' },
                    { name: 'Emeka Nnaji', course: 'Physics Fundamentals', progress: 58, time: 'Yesterday', avatar: '/images/tutor-daniel.jpg' },
                    { name: 'Amina Bello', course: 'Algebra Foundations', progress: 41, time: '2 days ago', avatar: '/images/tutor-adaeze.jpg' },
                    { name: 'Segun Adeyemi', course: 'A-level Mathematics', progress: 86, time: 'Today', avatar: '/images/tutor-ibrahim.jpg' },
                  ].map((st, i) => (
                    <div key={i} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={st.avatar} 
                          alt={st.name} 
                          className="w-9 h-9 rounded-full object-cover shrink-0 shadow-2xs"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{st.name}</h4>
                          <p className="text-[11px] text-slate-400 truncate">{st.course}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="w-20 hidden sm:block">
                          <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                            <span>{st.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-[#0F5338] h-full rounded-full" 
                              style={{ width: `${st.progress}%` }}
                            />
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-400 font-medium w-14 text-right">
                          {st.time}
                        </span>

                        <Link to="/dashboard/students" className="p-1 text-slate-400 hover:text-slate-600 rounded">
                          <MoreHorizontal className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ========================================================================= */
        /* STUDENT VIEW (POLISHED DASHBOARD) */
        /* ========================================================================= */
        <>
          {/* 1. TOP HEADER GREETING & CTA */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">
                {user.title || 'A-level · Year 13'}
              </p>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141E18] tracking-tight">
                Hi, <span className="italic font-normal text-[#0F5338]">{user.name}</span> 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                You're on a <strong className="text-slate-900 font-bold">12-day streak.</strong> Keep it going.
              </p>
            </div>

            <Link
              to="/tutors"
              className="inline-flex items-center gap-1.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full px-5 py-2.5 text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" /> Book a session
            </Link>
          </div>

          {/* 2. 4 METRIC STAT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "HOURS THIS MONTH", value: 24.5, decimals: 1, icon: Clock },
              { label: "SESSIONS COMPLETED", value: 38, decimals: 0, icon: Calendar },
              { label: "AVG. TUTOR RATING", value: 4.9, decimals: 1, icon: Star },
              { label: "PROGRESS", value: 18, prefix: "+", suffix: "%", decimals: 0, icon: TrendingUp }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={i} 
                  className="bg-white rounded-2xl border border-[#E8E3D7] p-5 shadow-2xs flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {stat.label}
                    </span>
                    <Icon className="h-4 w-4 text-[#0F5338]/70" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#141E18]">
                    <AnimatedCounter 
                      value={stat.value} 
                      prefix={stat.prefix || ""} 
                      suffix={stat.suffix || ""} 
                      decimals={stat.decimals}
                    />
                  </h3>
                </div>
              );
            })}
          </div>

          {/* 2.5. STUDENT REWARDS & SESSION TIME CONVERTER HUB */}
          <div className="bg-linear-to-r from-[#0F5338] via-[#156947] to-[#0A3D29] rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden border border-emerald-700/40">
            {/* Background shimmer decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                  <span>Akademi LearnTokens & Rewards Pass</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white">
                  Turn Your Study Streak into Free Tutoring Time
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
                  Earn LearnTokens from study streaks and classmate referrals, convert them into free session minutes, and apply them seamlessly when booking any tutor.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                  <div className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    <Coins className="w-4 h-4 text-amber-300" />
                    <span>Balance: <strong className="text-white font-bold">{userTokens} Tokens</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    <Clock className="w-4 h-4 text-emerald-300" />
                    <span>Free Time: <strong className="text-white font-bold">{studentRewardMinutes} Mins Available</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-200/90 text-[11px] font-medium">
                    <span>Rate: <strong>{tokensPerMinute} Tokens = 1 Free Minute</strong></span>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setTokenConverterModalOpen(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-2xl text-xs font-extrabold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Coins className="w-4 h-4 text-amber-900" />
                  <span>Convert Tokens</span>
                </button>

                <button
                  type="button"
                  onClick={handleClaimStreakBonus}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                  title={`Claim daily streak bonus (+${streakBonusTokens} tokens)`}
                >
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span>Claim Streak (+{streakBonusTokens})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSnapcodeModalOpen(true)}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                  title="Share Referral Pass QR (+150 Tokens)"
                >
                  <QrCode className="w-4 h-4 text-emerald-300" />
                  <span>Invite (+{referralBonusTokens})</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2.5 MY COMMUNITIES & STUDY CIRCLES (COMMUNITY-FIRST HUB) */}
          {enableCommunities && (
            <div className="bg-white rounded-3xl border border-[#E8E3D7] p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-serif font-bold text-[#141E18]">My Communities & Study Circles</h2>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-[#0F5338] border border-emerald-200 rounded-full text-[10px] font-bold">
                      Active Hubs
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Your daily interactive spaces for discussions, course vaults, live workshops, and expert mentors.</p>
                </div>
                <Link to="/communities" className="text-xs font-bold text-[#0F5338] hover:underline flex items-center gap-1">
                  Browse all communities &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    id: 'comm-2',
                    name: "Dr. Chiamaka's Calculus Circle",
                    category: 'Mathematics & Sciences',
                    type: 'Tutor Masterclass',
                    creator: 'Dr. Chiamaka Eze',
                    creatorRole: 'Verified Tutor',
                    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
                    cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80',
                    members: 821,
                    activity: '🔥 14 new discussions today',
                    isPaid: false
                  },
                  {
                    id: 'comm-1',
                    name: 'Data Analytics Career Hub',
                    category: 'Data & Tech',
                    type: 'Tutor Masterclass',
                    creator: 'Ade Adeyemi',
                    creatorRole: 'Lead Tutor',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
                    members: 342,
                    activity: '📅 Live workshop this Sat at 7 PM',
                    isPaid: true,
                    price: '₦4,500/mo'
                  },
                  {
                    id: 'comm-3',
                    name: 'UNILAG Engineering 300L Mastermind',
                    category: 'Mathematics & Sciences',
                    type: 'Peer Study Hub',
                    creator: 'Chiamaka Ada',
                    creatorRole: 'Peer Study Leader',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                    cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
                    members: 145,
                    activity: '💬 8 unsolved past questions',
                    isPaid: false
                  }
                ].map((hub) => {
                  const isCreator = Boolean(
                    (user?.name && hub.creator && user.name.toLowerCase().trim() === hub.creator.toLowerCase().trim())
                  );

                  return (
                    <div 
                      key={hub.id}
                      className={cn(
                        "rounded-2xl border overflow-hidden bg-[#FBF9F4] hover:shadow-md transition-all flex flex-col justify-between",
                        isCreator ? "border-amber-400 ring-1 ring-amber-300" : "border-slate-200"
                      )}
                    >
                      <div>
                        <div className="relative h-24 w-full bg-slate-800">
                          <img src={hub.cover} alt={hub.name} className="w-full h-full object-cover opacity-80" />
                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                              hub.type === 'Tutor Masterclass' 
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-blue-100 text-blue-900 border border-blue-300"
                            )}>
                              {hub.type === 'Tutor Masterclass' ? '🎓 Masterclass' : '👥 Study Circle'}
                            </span>
                            {isCreator && (
                              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 rounded text-[9px] font-black uppercase tracking-wider border border-amber-300 shadow-2xs">
                                👑 Your Hub
                              </span>
                            )}
                          </div>
                          {hub.isPaid && (
                            <div className="absolute top-2 right-2">
                              <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[9px] font-bold">
                                {hub.price}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <img src={hub.avatar} alt={hub.creator} className="w-5 h-5 rounded-full object-cover border border-slate-200" />
                            <span className="text-[11px] font-bold text-slate-700 truncate">
                              {isCreator ? `${hub.creator} (You)` : hub.creator}
                            </span>
                          </div>
                          <h3 className="font-bold text-xs text-slate-900 line-clamp-1 mb-1">{hub.name}</h3>
                          <p className="text-[10px] text-emerald-800 font-semibold bg-emerald-50/80 px-2 py-1 rounded-lg border border-emerald-100">
                            {hub.activity}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <Link
                          to={`/communities/${hub.id}`}
                          className={cn(
                            "w-full py-2 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5",
                            isCreator 
                              ? "bg-amber-400 hover:bg-amber-300 text-slate-950 font-black" 
                              : "bg-[#0F5338] hover:bg-[#0A3D29] text-white"
                          )}
                        >
                          <span>{isCreator ? 'Manage Your Hub' : 'Enter Community Space'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. MIDDLE SPLIT: UPCOMING SESSIONS & MESSAGES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (7 cols): Upcoming Sessions */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E3D7] p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-serif font-bold text-[#141E18]">
                      Upcoming sessions
                    </h2>
                    {upcomingSessionsStudent.length > 0 && (
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-[#0F5338] border border-emerald-200 rounded-full text-[10px] font-bold">
                        {upcomingSessionsStudent.length} Total
                      </span>
                    )}
                  </div>
                  <Link 
                    to="/dashboard/sessions" 
                    className="text-xs font-semibold text-[#0F5338] hover:underline flex items-center gap-1"
                  >
                    View all &rarr;
                  </Link>
                </div>

                {/* Summarized Unique Session Rows */}
                {(() => {
                  const map = new Map<string, {
                    id: string | number;
                    title: string;
                    tutor: string;
                    duration: string;
                    nextTime: string;
                    image: string;
                    type: '1on1' | 'group' | 'mixed';
                    slotCount: number;
                  }>();

                  upcomingSessionsStudent.forEach(s => {
                    const key = `${s.tutor}_${s.title}`;
                    if (!map.has(key)) {
                      map.set(key, {
                        id: s.id,
                        title: s.title,
                        tutor: s.tutor,
                        duration: s.duration,
                        nextTime: s.time,
                        image: s.image,
                        type: s.type,
                        slotCount: 1
                      });
                    } else {
                      const existing = map.get(key)!;
                      existing.slotCount += 1;
                      if (existing.type !== s.type) existing.type = 'mixed';
                    }
                  });

                  const summarizedList = Array.from(map.values()).slice(0, 3);

                  if (upcomingSessionsStudent.length === 0) {
                    return (
                      <div className="p-8 text-center text-slate-400 text-xs bg-[#FBF9F4] rounded-2xl border border-[#E8E3D7]">
                        No upcoming sessions scheduled.
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {upcomingSessionsStudent.slice(0, 3).map((session) => {
                        const access = calculateSessionAccess({
                          id: session.id,
                          timeDisplay: session.time,
                          type: session.type
                        });

                        return (
                          <div 
                            key={session.id}
                            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FBF9F4] border border-[#E8E3D7] gap-3 hover:border-emerald-200 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img 
                                src={session.image} 
                                alt={session.tutor} 
                                className="w-10 h-10 rounded-full object-cover shrink-0 shadow-2xs border border-slate-200"
                              />
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <h4 className="text-xs font-bold text-[#141E18] truncate">
                                    {session.title}
                                  </h4>

                                  {/* Format Badge */}
                                  {session.type === 'group' ? (
                                    <span className="px-2 py-0.5 rounded-full bg-[#EBF3FA] text-[#1E3A5F] border border-[#CBDFF2] text-[9px] font-bold uppercase shrink-0 flex items-center gap-1">
                                      <Users className="w-2.5 h-2.5" /> Group
                                    </span>
                                  ) : session.type === '1on1' ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold uppercase shrink-0 flex items-center gap-1">
                                      <Video className="w-2.5 h-2.5" /> 1-on-1
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-[9px] font-bold uppercase shrink-0">
                                      Mixed
                                    </span>
                                  )}

                                  {/* Access Timing Badge */}
                                  <span className={cn("text-[9px] px-1.5 py-0.2 rounded border", access.badgeStyle)}>
                                    {access.badgeText}
                                  </span>
                                </div>

                                <p className="text-[11px] text-slate-500 mt-1 truncate">
                                  with <span className="font-semibold text-slate-800">{session.tutor}</span> · Next: <span className="font-bold text-slate-700">{session.time}</span> ({session.duration})
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setSelectedNoteSession(session)}
                                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shadow-2xs"
                                title="View Lesson Notes & Materials"
                              >
                                <FileText className="w-4 h-4 text-[#0F5338]" />
                              </button>

                              {access.isAccessible ? (
                                <Link
                                  to={`/classroom/${session.id}`}
                                  className={cn(
                                    "text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs flex items-center gap-1 active:scale-95",
                                    session.type === 'group' ? "bg-[#1E3A5F] hover:bg-[#152943]" : "bg-[#0F5338] hover:bg-[#0A3D29]"
                                  )}
                                >
                                  <span>{access.buttonText}</span>
                                </Link>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLobbyModalSession(session);
                                    setLobbyModalAccessResult(access);
                                  }}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold shadow-2xs border border-slate-200 flex items-center gap-1 transition-all active:scale-95"
                                  title={access.lockReason}
                                >
                                  <Lock className="w-3 h-3 text-amber-600" />
                                  <span>{access.buttonText}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Summary footer when multiple sessions exist */}
                      {upcomingSessionsStudent.length > 3 && (
                        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                          <span className="text-slate-500 font-medium">
                            Showing top 3 of {upcomingSessionsStudent.length} booked slots
                          </span>
                          <Link 
                            to="/dashboard/sessions" 
                            className="font-bold text-[#0F5338] hover:underline flex items-center gap-1"
                          >
                            View Full Schedule ({upcomingSessionsStudent.length}) &rarr;
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right Column (5 cols): Messages */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8E3D7] p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-serif font-bold text-[#141E18]">
                    Messages
                  </h2>
                  <Link 
                    to="/dashboard/messages" 
                    className="text-xs font-semibold text-[#0F5338] hover:underline"
                  >
                    Inbox
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentMessagesStudent.map((msg) => (
                    <Link
                      key={msg.id}
                      to="/dashboard/messages"
                      className="flex items-start gap-3 hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src={msg.image} 
                        alt={msg.name} 
                        className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-xs font-bold text-[#141E18] truncate">{msg.name}</p>
                          <span className="text-[10px] text-slate-400">{msg.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 leading-normal">
                          {msg.text}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. BOTTOM SECTION: YOUR COURSES */}
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-serif font-bold text-[#141E18]">
                Your courses
              </h2>
              <Link 
                to="/courses" 
                className="text-xs font-semibold text-[#0F5338] hover:underline flex items-center gap-1"
              >
                Browse catalog &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {enrolledCoursesStudent.map((course) => (
                <div
                  key={course.id}
                  className={`${course.bg} ${course.border} border rounded-2xl p-6 shadow-2xs flex flex-col justify-between`}
                >
                  <div>
                    <BookOpen className="h-4 w-4 text-[#0F5338] mb-3" />
                    <h3 className="text-base font-serif font-bold text-[#141E18] mb-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">{course.lessons}</p>

                    {/* Progress bar */}
                    <div className="space-y-1.5 mb-6">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-black/10 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-[#0F5338] h-full rounded-full transition-all duration-500" 
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/dashboard/courses"
                    className="text-xs font-bold text-[#0F5338] hover:underline inline-flex items-center gap-1"
                  >
                    Continue learning &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SET AVAILABILITY */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {availabilityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 space-y-5"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0F5338]" />
                  <h3 className="font-bold text-base text-slate-900">Teaching Availability & Hours</h3>
                </div>
                <button onClick={() => setAvailabilityModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAvailability} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Available Days of Week
                  </label>
                  <div className="grid grid-cols-7 gap-1.5">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                      const isSel = availableDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setAvailableDays(prev => 
                              prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                            );
                          }}
                          className={cn(
                            "py-2 rounded-xl text-xs font-bold transition-all",
                            isSel ? "bg-[#0F5338] text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Daily Start Time
                    </label>
                    <input 
                      type="time" 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Daily End Time
                    </label>
                    <input 
                      type="time" 
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-emerald-950">Instant Booking</p>
                    <p className="text-[10px] text-emerald-800/80">Allow verified students to book without manual approval</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={instantBook}
                    onChange={(e) => setInstantBook(e.target.checked)}
                    className="w-4 h-4 accent-[#0F5338] rounded cursor-pointer"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setAvailabilityModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Save Availability
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: NEW COURSE CREATION */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {newCourseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 space-y-5"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0F5338]" />
                  <h3 className="font-bold text-base text-slate-900">Publish New Course Offering</h3>
                </div>
                <button onClick={() => setNewCourseModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Course Title
                  </label>
                  <input 
                    type="text" 
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g. Advanced Calculus & Mechanics Mastery"
                    required
                    className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subject Category
                    </label>
                    <select
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value)}
                      className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Languages">Languages</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Level
                    </label>
                    <select
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value)}
                      className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced (A-Level / Uni)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Price (₦ NGN)
                    </label>
                    <input 
                      type="number" 
                      value={coursePrice}
                      onChange={(e) => setCoursePrice(e.target.value)}
                      required
                      className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Total Sessions
                    </label>
                    <input 
                      type="number" 
                      value={courseSessions}
                      onChange={(e) => setCourseSessions(e.target.value)}
                      required
                      className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setNewCourseModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Publish Course
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: LESSON PREP DRAWER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {prepModalSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Lesson Preparation</h3>
                  <p className="text-xs text-slate-500">{prepModalSession.title} · {prepModalSession.student}</p>
                </div>
                <button onClick={() => setPrepModalSession(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="p-3 bg-[#FBF9F4] rounded-2xl border border-[#E8E3D7]">
                  <p className="font-bold text-slate-900 mb-1">Student Focus Areas:</p>
                  <p className="text-slate-600">Review homework worksheet problems #3 and #7. Focus on step-by-step calculus proofs.</p>
                </div>

                <div className="p-3 bg-[#EAF5EE] rounded-2xl border border-[#D5EADB] text-emerald-950">
                  <p className="font-bold mb-1">Recommended Whiteboard Assets:</p>
                  <p className="text-emerald-800">Coordinate plane grid, integration table formulas loaded in Classroom.</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Link
                  to={`/classroom/${prepModalSession.id}`}
                  onClick={() => setPrepModalSession(null)}
                  className="flex-1 py-2.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Launch Classroom Early</span>
                </Link>
                <button 
                  type="button" 
                  onClick={() => setPrepModalSession(null)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 4: TOKEN CONVERTER MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {tokenConverterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Convert LearnTokens</h3>
                    <p className="text-[11px] text-slate-500">Exchange tokens for free tutoring session minutes</p>
                  </div>
                </div>
                <button onClick={() => setTokenConverterModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-900 font-semibold">Your Available Balance:</span>
                  <span className="font-black text-amber-950 bg-amber-200/80 px-2.5 py-0.5 rounded-full">{userTokens} Tokens</span>
                </div>
                <div className="flex items-center justify-between text-xs text-amber-900/80 pt-1 border-t border-amber-200/60">
                  <span>Platform Rate:</span>
                  <span className="font-bold text-amber-950">{tokensPerMinute} Tokens = 1 Free Minute</span>
                </div>
              </div>

              {/* Conversion Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Token Amount to Convert:
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[50, 100, 200, 300].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCustomConvertTokens(val)}
                      disabled={userTokens < val}
                      className={cn(
                        "py-2 rounded-xl text-xs font-bold transition-all border",
                        customConvertTokens === val 
                          ? "bg-[#0F5338] text-white border-[#0F5338] shadow-xs" 
                          : userTokens >= val 
                            ? "bg-slate-50 text-slate-800 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300" 
                            : "bg-slate-100 text-slate-400 border-slate-200 opacity-50 cursor-not-allowed"
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min={tokensPerMinute}
                    max={userTokens}
                    step={tokensPerMinute}
                    value={customConvertTokens}
                    onChange={(e) => setCustomConvertTokens(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                    placeholder="Enter custom token amount..."
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold pointer-events-none">
                    Tokens
                  </span>
                </div>
              </div>

              {/* Output Preview */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950">You Will Receive:</span>
                </div>
                <span className="text-sm font-black text-[#0F5338]">
                  +{Math.floor(customConvertTokens / tokensPerMinute)} Free Minutes
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTokenConverterModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConvertTokens(customConvertTokens)}
                  disabled={customConvertTokens <= 0 || userTokens < customConvertTokens}
                  className="flex-1 py-2.5 bg-[#0F5338] hover:bg-[#0A3D29] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Convert Now</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 5: SNAPCODE REFERRAL MODAL */}
      {/* ========================================================================= */}
      <ReferralSnapcodeBadge
        isOpen={snapcodeModalOpen}
        onClose={() => setSnapcodeModalOpen(false)}
        user={{
          name: user.name,
          role: user.role,
          subject: user.title,
          avatar: user.avatar,
          initials: user.initials
        }}
      />

      {/* Lesson Notes Modal */}
      <LessonNotesModal
        isOpen={!!selectedNoteSession}
        onClose={() => setSelectedNoteSession(null)}
        session={selectedNoteSession}
        isTutorMode={false}
      />

      {/* Classroom Locked Lobby Modal */}
      <ClassroomLobbyModal
        isOpen={!!lobbyModalSession}
        onClose={() => setLobbyModalSession(null)}
        session={lobbyModalSession || { id: '', title: '' }}
        accessResult={lobbyModalAccessResult || {
          isAccessible: false,
          status: 'locked_future',
          scheduledTimeDisplay: '',
          unlockTimeDisplay: '',
          startsInText: '',
          startsInMinutes: 0
        }}
      />
    </motion.div>
  );
}
