import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  BookOpen, 
  GraduationCap, 
  MessageSquare, 
  Heart, 
  Bell, 
  CheckCircle2, 
  Video, 
  ExternalLink, 
  Coins, 
  Flame, 
  Award, 
  SlidersHorizontal, 
  Search, 
  X, 
  FileText, 
  RefreshCw,
  Sparkles,
  ChevronDown,
  Play,
  Film,
  Download,
  Share2,
  AlertCircle,
  Star,
  Check,
  UserCheck,
  Lock
} from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { cn } from '@/lib/utils';
import LessonNotesModal from '@/components/ui/LessonNotesModal';
import ClassroomLobbyModal from '@/components/ui/ClassroomLobbyModal';
import { calculateSessionAccess } from '@/lib/sessionAccess';

interface StudentSession {
  id: string;
  subject: string;
  topic: string;
  tutorName: string;
  tutorId: string;
  dateStr: string;
  timeStr: string;
  type: 'One-on-one' | 'Group';
  price: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  classroomLink: string;
  recordingUrl?: string;
  recordingDuration?: string;
  notesAvailable?: boolean;
  rescheduleCount?: number; // Maximum 2 reschedules allowed per session
}

interface MiniTransaction {
  id: string;
  type: 'topup' | 'session' | 'group' | 'refund';
  title: string;
  date: string;
  amount: number;
  isPositive: boolean;
}

interface FavoriteTutor {
  id: string;
  initials: string;
  name: string;
  subject: string;
  rate: number;
  rating: number;
  reviewsCount: number;
  experience: string;
  availableDays: string[]; // e.g. ['MON', 'WED', 'FRI']
  availableHours: string;
  avatarBg: string;
  isFavorite: boolean;
}

interface SubjectMastery {
  id: string;
  name: string;
  examTrack: string;
  progressPercent: number;
  totalTopics: number;
  masteredTopics: number;
  assignedTutor: string;
  nextTopic: string;
  color: string;
}

// Tutor Availability Master Database
const TUTOR_AVAILABILITY: Record<string, {
  name: string;
  availableDays: string[];
  slots: Record<string, string[]>;
}> = {
  '1': {
    name: 'Amara Okoye',
    availableDays: ['MON', 'WED', 'FRI'],
    slots: {
      'MON': ['16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:30 - 20:30'],
      'WED': ['16:00 - 17:00', '17:30 - 18:30', '19:00 - 20:00'],
      'FRI': ['15:00 - 16:00', '16:30 - 17:30', '18:00 - 19:00']
    }
  },
  '2': {
    name: 'Samuel Adeyemi',
    availableDays: ['TUE', 'THU', 'SAT'],
    slots: {
      'TUE': ['17:00 - 18:00', '18:30 - 19:30', '20:00 - 21:00'],
      'THU': ['16:00 - 17:30', '18:00 - 19:30', '19:30 - 21:00'],
      'SAT': ['10:00 - 11:30', '14:00 - 15:30', '16:00 - 17:30']
    }
  },
  '3': {
    name: 'Leila Haddad',
    availableDays: ['MON', 'FRI', 'SUN'],
    slots: {
      'MON': ['08:00 - 09:00', '10:00 - 11:00', '14:00 - 15:00'],
      'FRI': ['08:00 - 09:00', '09:30 - 10:30', '17:00 - 18:00'],
      'SUN': ['11:00 - 12:00', '14:00 - 15:00', '16:00 - 17:00']
    }
  },
  '4': {
    name: 'Daniel Mensah',
    availableDays: ['WED', 'SAT', 'SUN'],
    slots: {
      'WED': ['16:00 - 17:30', '18:00 - 19:30'],
      'SAT': ['09:00 - 10:30', '11:00 - 12:30', '15:00 - 16:30'],
      'SUN': ['14:00 - 15:30', '16:00 - 17:30', '18:00 - 19:30']
    }
  },
  '5': {
    name: 'Dr. Ibrahim Sanni',
    availableDays: ['MON', 'THU', 'SAT'],
    slots: {
      'MON': ['17:00 - 18:30', '19:00 - 20:30'],
      'THU': ['16:00 - 17:30', '18:00 - 19:30'],
      'SAT': ['10:00 - 11:30', '12:00 - 13:30', '15:00 - 16:30']
    }
  }
};

const INITIAL_FAV_TUTORS: FavoriteTutor[] = [
  {
    id: '1',
    initials: 'AO',
    name: 'Amara Okoye',
    subject: 'Mathematics · Pure & Applied',
    rate: 9500,
    rating: 4.9,
    reviewsCount: 124,
    experience: '6 years exp',
    availableDays: ['MON', 'WED', 'FRI'],
    availableHours: '16:00 - 20:30 WAT',
    avatarBg: 'bg-emerald-100 text-emerald-800',
    isFavorite: true
  },
  {
    id: '4',
    initials: 'DM',
    name: 'Daniel Mensah',
    subject: 'Sciences & Chemistry',
    rate: 8000,
    rating: 4.8,
    reviewsCount: 98,
    experience: '5 years exp',
    availableDays: ['WED', 'SAT', 'SUN'],
    availableHours: '14:00 - 19:30 WAT',
    avatarBg: 'bg-blue-100 text-blue-800',
    isFavorite: true
  },
  {
    id: '3',
    initials: 'LH',
    name: 'Leila Haddad',
    subject: 'Languages · French & Spanish',
    rate: 6500,
    rating: 5.0,
    reviewsCount: 110,
    experience: '7 years exp',
    availableDays: ['MON', 'FRI', 'SUN'],
    availableHours: '08:00 - 17:00 WAT',
    avatarBg: 'bg-amber-100 text-amber-800',
    isFavorite: true
  },
  {
    id: '5',
    initials: 'IS',
    name: 'Dr. Ibrahim Sanni',
    subject: 'Physics & Thermodynamics',
    rate: 9000,
    rating: 4.9,
    reviewsCount: 156,
    experience: '9 years exp',
    availableDays: ['MON', 'THU', 'SAT'],
    availableHours: '16:00 - 20:30 WAT',
    avatarBg: 'bg-indigo-100 text-indigo-800',
    isFavorite: true
  },
  {
    id: '2',
    initials: 'SA',
    name: 'Samuel Adeyemi',
    subject: 'Computer Science & Data Structures',
    rate: 6000,
    rating: 4.7,
    reviewsCount: 82,
    experience: '4 years exp',
    availableDays: ['TUE', 'THU', 'SAT'],
    availableHours: '16:00 - 21:00 WAT',
    avatarBg: 'bg-purple-100 text-purple-800',
    isFavorite: true
  }
];

export default function DashboardCourses() {
  const navigate = useNavigate();

  // Active view tab: 'schedule' (exact image match) | 'mastery' (academic syllabus)
  const [activeTab, setActiveTab] = useState<'schedule' | 'mastery'>('schedule');

  // Filter tabs for sessions: 'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  const [sessionFilter, setSessionFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('upcoming');

  // Calendar view mode: 'day' | 'week' | 'month'
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week');

  // Tutor Availability Overlay in Calendar
  const [overlayTutorId, setOverlayTutorId] = useState<string>('all');

  // User details from localStorage
  const [user, setUser] = useState<{
    name: string;
    email: string;
    title: string;
    avatar?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'Chiamaka Ada',
      email: 'student@akademi.dev',
      title: 'A-Level Candidate · Year 13',
      avatar: '/images/hero-student.jpg'
    };
  });

  // Wallet balance state (persistent in localStorage)
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('akademi_wallet_balance_ngn');
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return 19000;
  });

  // LearnTokens balance
  const [userTokens, setUserTokens] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('akademi_user_tokens');
      if (saved !== null) return Number(saved);
    } catch (e) {}
    return 450;
  });

  // Calendar Day / Month selection state
  const [selectedDayDate, setSelectedDayDate] = useState<string>('24');
  const [selectedDayName, setSelectedDayName] = useState<string>('Monday');
  const [selectedDayCode, setSelectedDayCode] = useState<string>('MON');
  const [selectedMonthDate, setSelectedMonthDate] = useState<number>(24);

  // Modals state
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(10000);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [reschedulingSession, setReschedulingSession] = useState<StudentSession | null>(null);
  const [rescheduleSelectedDay, setRescheduleSelectedDay] = useState<string>('MON');
  const [rescheduleDate, setRescheduleDate] = useState('2026-08-24');
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState('17:00 - 18:00');
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedNotesSession, setSelectedNotesSession] = useState<StudentSession | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Recording Video Player Modal
  const [isRecordingPlayerOpen, setIsRecordingPlayerOpen] = useState(false);
  const [playingRecordingSession, setPlayingRecordingSession] = useState<StudentSession | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, isRecordingPlayerOpen]);

  // Lobby Lock Modal State for sessions ahead of time
  const [isLobbyModalOpen, setIsLobbyModalOpen] = useState(false);
  const [selectedLobbySession, setSelectedLobbySession] = useState<StudentSession | null>(null);

  // All Favourite Tutors Modal
  const [isAllFavoritesOpen, setIsAllFavoritesOpen] = useState(false);
  const [favoritesSearch, setFavoritesSearch] = useState('');

  // Persistent Favourites List
  const [favouriteTutors, setFavouriteTutors] = useState<FavoriteTutor[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_favourite_tutors');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_FAV_TUTORS;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sessions List (Includes Ended/Completed Session with Recording Available & Reschedule Counts)
  const [sessions, setSessions] = useState<StudentSession[]>([
    {
      id: 'sess-1',
      subject: 'Calculus',
      topic: 'integration by parts',
      tutorName: 'Amara Okoye',
      tutorId: '1',
      dateStr: 'Mon 24 Aug',
      timeStr: '17:00 - 18:00',
      type: 'One-on-one',
      price: 9500,
      status: 'upcoming',
      classroomLink: '/classroom/session-calc-24',
      notesAvailable: true,
      rescheduleCount: 0
    },
    {
      id: 'sess-2',
      subject: 'Data structures',
      topic: 'review & tree traversals',
      tutorName: 'Samuel Adeyemi',
      tutorId: '2',
      dateStr: 'Wed 26 Aug',
      timeStr: '19:30 - 21:00',
      type: 'Group',
      price: 6000,
      status: 'upcoming',
      classroomLink: '/classroom/session-ds-26',
      notesAvailable: true,
      rescheduleCount: 0
    },
    {
      id: 'sess-3',
      subject: 'French',
      topic: 'oral fluency & vocabulary clinic',
      tutorName: 'Leila Haddad',
      tutorId: '3',
      dateStr: 'Fri 28 Aug',
      timeStr: '08:00 - 09:00',
      type: 'One-on-one',
      price: 6500,
      status: 'upcoming',
      classroomLink: '/classroom/session-french-28',
      notesAvailable: false,
      rescheduleCount: 0
    },
    {
      id: 'sess-4',
      subject: 'Chemistry clinic',
      topic: 'organic reaction mechanisms',
      tutorName: 'Daniel Mensah',
      tutorId: '4',
      dateStr: 'Sun 30 Aug',
      timeStr: '16:00 - 17:30',
      type: 'Group',
      price: 5500,
      status: 'upcoming',
      classroomLink: '/classroom/session-chem-30',
      notesAvailable: true,
      rescheduleCount: 1 // Already rescheduled 1 time (max 2)
    },
    {
      id: 'sess-5',
      subject: 'Physics Dynamics',
      topic: 'rotational motion & torque',
      tutorName: 'Dr. Ibrahim Sanni',
      tutorId: '5',
      dateStr: 'Sat 22 Aug',
      timeStr: '11:00 - 12:30',
      type: 'One-on-one',
      price: 8500,
      status: 'completed', // ENDED SESSION -> CANNOT JOIN ROOM, MUST WATCH RECORDING
      classroomLink: '/classroom/session-phys-22',
      recordingUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      recordingDuration: '58 min',
      notesAvailable: true,
      rescheduleCount: 0
    },
    {
      id: 'sess-6',
      subject: 'Differential Calculus',
      topic: 'chain rule & optimization',
      tutorName: 'Amara Okoye',
      tutorId: '1',
      dateStr: 'Wed 19 Aug',
      timeStr: '16:00 - 17:30',
      type: 'One-on-one',
      price: 9500,
      status: 'completed', // ENDED SESSION
      classroomLink: '/classroom/session-calc-19',
      recordingUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      recordingDuration: '62 min',
      notesAvailable: true,
      rescheduleCount: 0
    }
  ]);

  // Mini Transactions
  const [transactions, setTransactions] = useState<MiniTransaction[]>([
    {
      id: 'tx-1',
      type: 'topup',
      title: 'Wallet top-up via Paystack',
      date: '12 Aug',
      amount: 25000,
      isPositive: true
    },
    {
      id: 'tx-2',
      type: 'session',
      title: 'Session – Amara Okoye',
      date: '10 Aug',
      amount: 9500,
      isPositive: false
    },
    {
      id: 'tx-3',
      type: 'group',
      title: 'Group session – Samuel Adeyemi',
      date: '08 Aug',
      amount: 4500,
      isPositive: false
    },
    {
      id: 'tx-4',
      type: 'refund',
      title: 'Refund – cancelled session',
      date: '05 Aug',
      amount: 8000,
      isPositive: true
    }
  ]);

  // Notifications
  const [notificationsList, setNotificationsList] = useState<string[]>([
    'Booking confirmed – Calculus, Mon 24 Aug 17:00.',
    'Samuel Adeyemi requested a reschedule to 20:00.',
    'Recording is ready: Physics Dynamics (Sat 22 Aug).',
    'Review requested for your session with Leila Haddad.'
  ]);

  // Subject Mastery Tracks
  const [subjectMasteryList, setSubjectMasteryList] = useState<SubjectMastery[]>([
    {
      id: 'sub-1',
      name: 'A-Level Mathematics',
      examTrack: 'Cambridge CAIE 9709',
      progressPercent: 78,
      totalTopics: 24,
      masteredTopics: 19,
      assignedTutor: 'Amara Okoye',
      nextTopic: 'Differential Equations & Integration by Parts',
      color: 'from-emerald-600 to-teal-700'
    },
    {
      id: 'sub-2',
      name: 'A-Level Physics',
      examTrack: 'Cambridge CAIE 9702',
      progressPercent: 62,
      totalTopics: 20,
      masteredTopics: 12,
      assignedTutor: 'Dr. Ibrahim Sanni',
      nextTopic: 'Thermodynamics & Carnot Cycles',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      id: 'sub-3',
      name: 'Conversational French',
      examTrack: 'DELF B2 Examination',
      progressPercent: 45,
      totalTopics: 16,
      masteredTopics: 7,
      assignedTutor: 'Leila Haddad',
      nextTopic: 'Subjunctive Mood & Formal Dialogue',
      color: 'from-amber-600 to-orange-700'
    }
  ]);

  // Filtered Sessions
  const filteredSessions = sessions.filter(s => {
    if (sessionFilter === 'all') return true;
    return s.status === sessionFilter;
  });

  // Top Up Wallet Handler
  const handleConfirmTopUp = () => {
    const updatedBalance = walletBalance + topUpAmount;
    setWalletBalance(updatedBalance);
    localStorage.setItem('akademi_wallet_balance_ngn', String(updatedBalance));

    const newTx: MiniTransaction = {
      id: `tx-${Date.now()}`,
      type: 'topup',
      title: 'Wallet top-up via Paystack',
      date: 'Today',
      amount: topUpAmount,
      isPositive: true
    };
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);

    setIsTopUpOpen(false);
    window.dispatchEvent(new Event('storage'));
    showToast(`✓ Successfully deposited ₦${topUpAmount.toLocaleString()} to your wallet!`);
  };

  // Reschedule Handler respecting Tutor Availability and 2-Reschedule Maximum Limit
  const handleOpenReschedule = (session: StudentSession) => {
    if ((session.rescheduleCount || 0) >= 2) {
      showToast('⚠️ Maximum of 2 reschedules reached for this session. Further rescheduling is not permitted.');
      return;
    }
    setReschedulingSession(session);
    const tutorData = TUTOR_AVAILABILITY[session.tutorId] || TUTOR_AVAILABILITY['1'];
    const initialDay = tutorData.availableDays[0] || 'MON';
    setRescheduleSelectedDay(initialDay);
    const availableSlots = tutorData.slots[initialDay] || ['17:00 - 18:00'];
    setRescheduleTimeSlot(availableSlots[0]);
    setIsRescheduleOpen(true);
  };

  const handleSelectRescheduleDay = (day: string) => {
    if (!reschedulingSession) return;
    const tutorData = TUTOR_AVAILABILITY[reschedulingSession.tutorId] || TUTOR_AVAILABILITY['1'];
    if (!tutorData.availableDays.includes(day)) {
      showToast(`⚠️ ${tutorData.name} is not available on ${day}. Available days: ${tutorData.availableDays.join(', ')}`);
      return;
    }
    setRescheduleSelectedDay(day);
    const slots = tutorData.slots[day] || ['17:00 - 18:00'];
    setRescheduleTimeSlot(slots[0]);
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingSession) return;
    if ((reschedulingSession.rescheduleCount || 0) >= 2) {
      showToast('⚠️ Maximum of 2 reschedules reached for this session.');
      setIsRescheduleOpen(false);
      return;
    }

    const nextCount = (reschedulingSession.rescheduleCount || 0) + 1;
    const updated = sessions.map(s => {
      if (s.id === reschedulingSession.id) {
        return {
          ...s,
          dateStr: `${rescheduleSelectedDay} (${rescheduleDate})`,
          timeStr: rescheduleTimeSlot,
          rescheduleCount: nextCount
        };
      }
      return s;
    });
    setSessions(updated);
    setIsRescheduleOpen(false);
    showToast(`✓ Rescheduled with ${reschedulingSession.tutorName} for ${rescheduleSelectedDay} at ${rescheduleTimeSlot}! (${nextCount}/2 reschedules used)`);
  };

  // Join Room Click Handler (Prevents joining ahead of time)
  const handleJoinRoomClick = (e: React.MouseEvent, session: StudentSession) => {
    const access = calculateSessionAccess({
      id: session.id,
      timeDisplay: session.timeStr,
      time: session.timeStr,
      dateStr: session.dateStr,
      status: session.status
    });

    if (!access.isAccessible) {
      e.preventDefault();
      setSelectedLobbySession(session);
      setIsLobbyModalOpen(true);
    }
  };

  // Recording Modal Handler
  const handleOpenRecording = (session: StudentSession) => {
    setPlayingRecordingSession(session);
    setIsRecordingPlayerOpen(true);
  };

  // Toggle Favorite Tutor Handler
  const handleToggleFavorite = (tutorId: string) => {
    const updated = favouriteTutors.map(t => {
      if (t.id === tutorId) {
        const nextState = !t.isFavorite;
        showToast(nextState ? `✓ Added ${t.name} to Favourite Tutors!` : `Removed ${t.name} from favourites`);
        return { ...t, isFavorite: nextState };
      }
      return t;
    });
    setFavouriteTutors(updated);
    localStorage.setItem('akademi_favourite_tutors', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  // Active Favourites List
  const activeFavoriteTutors = favouriteTutors.filter(t => t.isFavorite);

  // Filtered Favourites for Modal
  const modalFilteredFavorites = activeFavoriteTutors.filter(t => 
    t.name.toLowerCase().includes(favoritesSearch.toLowerCase()) ||
    t.subject.toLowerCase().includes(favoritesSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-slate-800 pb-16 font-sans">
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Student Academic Profile Header Card */}
        <div className="bg-white rounded-2xl border border-[#EAE5DB] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF5EE] text-[#0E4833] border border-[#D5EADB]">
                  🎓 {user.title || 'Student Track'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Exams: Cambridge A-Levels & UTME 2026 · Enrolled in 3 Subject Cohorts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 bg-[#F7F5F0] border border-[#E8E3D7] px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>5-Day Streak</span>
            </div>

            <div className="flex items-center gap-2 bg-[#F7F5F0] border border-[#E8E3D7] px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{userTokens} LearnTokens</span>
            </div>

            <Link
              to="/tutors"
              className="px-3.5 py-2 bg-[#0E4833] hover:bg-[#093223] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Tutor</span>
            </Link>
          </div>
        </div>

        {/* View Switcher: Sessions & Schedule (Matching Mockup) vs Subject Mastery */}
        <div className="flex items-center justify-between border-b border-[#EAE5DB] pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('schedule')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2",
                activeTab === 'schedule'
                  ? "bg-[#0E4833] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-[#EAE5DB]"
              )}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Learning Hub & Sessions</span>
            </button>

            <button
              onClick={() => setActiveTab('mastery')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2",
                activeTab === 'mastery'
                  ? "bg-[#0E4833] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-[#EAE5DB]"
              )}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Syllabus & Degree Progress</span>
            </button>
          </div>

          <span className="hidden sm:inline-block text-xs text-slate-500 font-medium">
            Active Term: <strong className="text-slate-800">Autumn Cohort 2026</strong>
          </span>
        </div>

        {/* TAB 1: SESSIONS & SCHEDULE (EXACT MATCH TO UPLOADED MOCKUP) */}
        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Sessions Filter + Session Cards + Weekly Calendar Matrix (Col-span 8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Filter Pills Bar */}
              <div className="bg-white rounded-2xl border border-[#EAE5DB] p-4 shadow-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  {(['all', 'upcoming', 'ongoing', 'completed', 'cancelled'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSessionFilter(filter)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer",
                        sessionFilter === filter
                          ? "bg-[#EDE8DF] text-slate-900 font-bold shadow-2xs"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Session Cards List */}
                <div className="mt-4 space-y-3">
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => {
                      const isEnded = session.status === 'completed';

                      return (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "bg-white rounded-xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                            isEnded ? "border-slate-200 bg-slate-50/40" : "border-[#EAE5DB] hover:border-slate-300"
                          )}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                {session.subject} – {session.topic}
                              </h3>
                              <span className={cn(
                                "px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize",
                                isEnded 
                                  ? "bg-slate-100 text-slate-600 border-slate-300" 
                                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
                              )}>
                                {isEnded ? 'Session Ended' : session.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {session.tutorName} · {session.dateStr}, {session.timeStr} · {session.type}
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            <span className="text-sm sm:text-base font-bold text-slate-900">
                              ₦{session.price.toLocaleString()}
                            </span>

                            <div className="flex items-center gap-2">
                              {/* If upcoming, can reschedule up to 2 times */}
                              {!isEnded && (
                                <button
                                  onClick={() => handleOpenReschedule(session)}
                                  disabled={(session.rescheduleCount || 0) >= 2}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5",
                                    (session.rescheduleCount || 0) >= 2
                                      ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-70"
                                      : "border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
                                  )}
                                  title={(session.rescheduleCount || 0) >= 2 ? "Maximum 2 reschedules reached" : "Reschedule session"}
                                >
                                  <span>Reschedule</span>
                                  {(session.rescheduleCount || 0) > 0 && (
                                    <span className={cn(
                                      "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                                      (session.rescheduleCount || 0) >= 2 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"
                                    )}>
                                      {session.rescheduleCount}/2
                                    </span>
                                  )}
                                </button>
                              )}

                              {/* REQUIREMENT 1: If session ended, NEVER SHOW JOIN ROOM. Show Watch Recording instead! */}
                              {isEnded ? (
                                <button
                                  onClick={() => handleOpenRecording(session)}
                                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                                >
                                  <Play className="w-3.5 h-3.5 fill-white" />
                                  <span>Watch Recording</span>
                                </button>
                              ) : (
                                <Link
                                  to={session.classroomLink}
                                  onClick={(e) => handleJoinRoomClick(e, session)}
                                  className="px-3 py-1.5 rounded-lg bg-[#0E4833] hover:bg-[#093223] text-white text-xs font-semibold transition-all flex items-center gap-1 shadow-xs"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                  <span>Join Room</span>
                                </Link>
                              )}

                              {session.notesAvailable && (
                                <button
                                  onClick={() => {
                                    setSelectedNotesSession(session);
                                    setIsNotesModalOpen(true);
                                  }}
                                  title="View shared lesson notes, formula sheet & homework"
                                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#0E4833] hover:bg-emerald-50 transition-all cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-500 font-medium">No {sessionFilter} sessions found.</p>
                      <Link to="/tutors" className="mt-2 inline-block text-xs font-bold text-emerald-700 hover:underline">
                        Find a tutor & book a session →
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Weekly Calendar Matrix Strip with Tutor Availability Overlays */}
              <div className="bg-white rounded-2xl border border-[#EAE5DB] p-4 sm:p-5 shadow-xs space-y-4">
                {/* Clean Top Row: Title + Day/Week/Month Toggle (Never Breaks) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#F0ECE4]">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-slate-600 shrink-0" />
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 whitespace-nowrap">
                      {calendarView === 'day' && `Day View — ${selectedDayName}, ${selectedDayDate} August`}
                      {calendarView === 'week' && 'Week of 24 August'}
                      {calendarView === 'month' && 'Month of August 2026'}
                    </h2>
                  </div>

                  {/* Day / Week / Month Pill Group */}
                  <div className="flex items-center gap-1 bg-[#F7F5F0] p-1 rounded-xl border border-[#E8E3D7] self-start sm:self-auto">
                    {(['day', 'week', 'month'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setCalendarView(mode)}
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer",
                          calendarView === mode
                            ? "bg-white text-slate-900 font-bold shadow-2xs"
                            : "text-slate-500 hover:text-slate-800"
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-bar: Compact Tutor Availability Schedule Overlay */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FBF9F4] p-2.5 rounded-xl border border-[#EAE5DB]">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">Tutor Availability:</span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">• Overlay active teaching days</span>
                  </div>

                  <select
                    value={overlayTutorId}
                    onChange={(e) => setOverlayTutorId(e.target.value)}
                    className="h-8 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 w-full sm:w-auto"
                  >
                    <option value="all">My Booked Sessions (Default)</option>
                    <option value="1">Amara Okoye (Maths · Mon, Wed, Fri)</option>
                    <option value="2">Samuel Adeyemi (CS · Tue, Thu, Sat)</option>
                    <option value="3">Leila Haddad (Lang · Mon, Fri, Sun)</option>
                    <option value="4">Daniel Mensah (Science · Wed, Sat, Sun)</option>
                    <option value="5">Dr. Ibrahim Sanni (Physics · Mon, Thu, Sat)</option>
                  </select>
                </div>

                {/* VIEW 1: DAY VIEW — Shows Sessions Specifically for the Selected Day */}
                {calendarView === 'day' && (
                  <div className="space-y-4">
                    {/* Day Selector Pill Strip */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                      {[
                        { day: 'MON', date: '24', name: 'Monday', hasSession: true },
                        { day: 'TUE', date: '25', name: 'Tuesday', hasSession: false },
                        { day: 'WED', date: '26', name: 'Wednesday', hasSession: true },
                        { day: 'THU', date: '27', name: 'Thursday', hasSession: false },
                        { day: 'FRI', date: '28', name: 'Friday', hasSession: true },
                        { day: 'SAT', date: '29', name: 'Saturday', hasSession: false },
                        { day: 'SUN', date: '30', name: 'Sunday', hasSession: true }
                      ].map((d) => (
                        <button
                          key={d.date}
                          type="button"
                          onClick={() => {
                            setSelectedDayDate(d.date);
                            setSelectedDayName(d.name);
                            setSelectedDayCode(d.day);
                          }}
                          className={cn(
                            "px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer flex items-center gap-2",
                            selectedDayDate === d.date
                              ? "bg-[#0E4833] text-white border-[#0E4833] shadow-xs"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          )}
                        >
                          <span>{d.day} {d.date}</span>
                          {d.hasSession && (
                            <span className={cn(
                              "w-2 h-2 rounded-full",
                              selectedDayDate === d.date ? "bg-emerald-300" : "bg-emerald-600"
                            )} />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Day Sessions List */}
                    <div className="space-y-3 pt-2">
                      {sessions.filter(s => s.dateStr.includes(selectedDayDate) || (selectedDayDate === '24' && s.id === 'sess-1') || (selectedDayDate === '26' && s.id === 'sess-2') || (selectedDayDate === '28' && s.id === 'sess-3') || (selectedDayDate === '30' && s.id === 'sess-4')).length > 0 ? (
                        sessions
                          .filter(s => s.dateStr.includes(selectedDayDate) || (selectedDayDate === '24' && s.id === 'sess-1') || (selectedDayDate === '26' && s.id === 'sess-2') || (selectedDayDate === '28' && s.id === 'sess-3') || (selectedDayDate === '30' && s.id === 'sess-4'))
                          .map((session) => {
                            const isEnded = session.status === 'completed';
                            return (
                              <div
                                key={session.id}
                                className="p-4 bg-white border border-[#EAE5DB] rounded-xl hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900">{session.subject} – {session.topic}</h4>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                      {session.timeStr}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500">
                                    Tutor: {session.tutorName} · {session.type} · ₦{session.price.toLocaleString()}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                  {!isEnded ? (
                                    <>
                                      <button
                                        onClick={() => handleOpenReschedule(session)}
                                        disabled={(session.rescheduleCount || 0) >= 2}
                                        className={cn(
                                          "px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5",
                                          (session.rescheduleCount || 0) >= 2
                                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-70"
                                            : "border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
                                        )}
                                        title={(session.rescheduleCount || 0) >= 2 ? "Maximum 2 reschedules reached" : "Reschedule session"}
                                      >
                                        <span>Reschedule</span>
                                        {(session.rescheduleCount || 0) > 0 && (
                                          <span className={cn(
                                            "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                                            (session.rescheduleCount || 0) >= 2 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"
                                          )}>
                                            {session.rescheduleCount}/2
                                          </span>
                                        )}
                                      </button>
                                      <Link
                                        to={session.classroomLink}
                                        onClick={(e) => handleJoinRoomClick(e, session)}
                                        className="px-3 py-1.5 rounded-lg bg-[#0E4833] hover:bg-[#093223] text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                                      >
                                        <Video className="w-3.5 h-3.5" />
                                        <span>Join Room</span>
                                      </Link>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => handleOpenRecording(session)}
                                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                                    >
                                      <Play className="w-3.5 h-3.5 fill-white" />
                                      <span>Watch Recording</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        <div className="p-6 text-center bg-[#FDFCF9] rounded-xl border border-dashed border-slate-200 space-y-2">
                          <p className="text-xs font-semibold text-slate-600">
                            No tutoring sessions booked for {selectedDayName}, {selectedDayDate} August.
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Tutor {(TUTOR_AVAILABILITY[overlayTutorId] || TUTOR_AVAILABILITY['1']).name} is available on {(TUTOR_AVAILABILITY[overlayTutorId] || TUTOR_AVAILABILITY['1']).availableDays.join(', ')}.
                          </p>
                          <Link
                            to="/tutors"
                            className="inline-block px-3 py-1.5 bg-[#0E4833] text-white text-xs font-bold rounded-lg shadow-xs mt-1"
                          >
                            + Book Session for {selectedDayName}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* VIEW 2: WEEK VIEW — 7-Day Matrix Columns (Displays Bookings + Selected Tutor Available Slots) */}
                {calendarView === 'week' && (
                  <div className="overflow-x-auto pb-1 scrollbar-thin">
                    <div className="grid grid-cols-7 gap-2 text-center min-w-[560px] sm:min-w-0">
                      {[
                        { day: 'MON', date: '24', name: 'Monday', booking: '17:00 Calculus' },
                        { day: 'TUE', date: '25', name: 'Tuesday', booking: null },
                        { day: 'WED', date: '26', name: 'Wednesday', booking: '19:30 Data structures' },
                        { day: 'THU', date: '27', name: 'Thursday', booking: null },
                        { day: 'FRI', date: '28', name: 'Friday', booking: '08:00 French' },
                        { day: 'SAT', date: '29', name: 'Saturday', booking: null },
                        { day: 'SUN', date: '30', name: 'Sunday', booking: '16:00 Chemistry clinic' }
                      ].map((d) => {
                        const tutorInfo = overlayTutorId !== 'all' ? TUTOR_AVAILABILITY[overlayTutorId] : null;
                        const isTutorAvailable = tutorInfo ? tutorInfo.availableDays.includes(d.day) : false;

                        return (
                          <div 
                            key={d.day}
                            onClick={() => {
                              setSelectedDayDate(d.date);
                              setSelectedDayName(d.name);
                              setSelectedDayCode(d.day);
                              setCalendarView('day');
                            }}
                            className={cn(
                              "border rounded-xl p-2 min-h-[115px] flex flex-col justify-between transition-all cursor-pointer hover:border-emerald-500",
                              isTutorAvailable ? "bg-emerald-50/50 border-emerald-300" : "bg-[#FDFCF9] border-[#EAE5DB]"
                            )}
                          >
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-bold tracking-wider text-slate-400">{d.day}</p>
                              <p className="text-base font-bold text-slate-800">{d.date}</p>
                            </div>

                            <div className="space-y-1 my-1">
                              {d.booking && (
                                <div className="p-1 rounded text-[10px] font-semibold text-left leading-snug bg-slate-100 text-slate-800 border border-slate-200 break-words">
                                  {d.booking}
                                </div>
                              )}

                              {tutorInfo && (
                                <div className={cn(
                                  "p-1 rounded text-[9px] font-bold text-left leading-tight border",
                                  isTutorAvailable 
                                    ? "bg-emerald-100/90 text-emerald-900 border-emerald-300" 
                                    : "bg-slate-100/60 text-slate-400 border-dashed border-slate-200"
                                )}>
                                  {isTutorAvailable ? '✓ Open' : 'Off'}
                                </div>
                              )}
                            </div>

                            <div className="text-[9px] text-slate-400">
                              {isTutorAvailable ? 'Teaching' : 'Click for day'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* VIEW 3: MONTH VIEW — Full August 2026 Monthly Grid */}
                {calendarView === 'month' && (
                  <div className="space-y-4">
                    {/* Month Grid Header */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 pb-1 border-b border-slate-100">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>

                    {/* Month Dates Grid (August 2026: 1st is Saturday) */}
                    <div className="grid grid-cols-7 gap-1.5 text-center">
                      {/* Empty padding days for Aug 2026 start */}
                      <div className="h-10 bg-slate-50/50 rounded-lg opacity-30" />
                      <div className="h-10 bg-slate-50/50 rounded-lg opacity-30" />
                      <div className="h-10 bg-slate-50/50 rounded-lg opacity-30" />
                      <div className="h-10 bg-slate-50/50 rounded-lg opacity-30" />
                      <div className="h-10 bg-slate-50/50 rounded-lg opacity-30" />

                      {Array.from({ length: 31 }, (_, i) => i + 1).map((dateNum) => {
                        const hasSession = [10, 19, 22, 24, 26, 28, 30].includes(dateNum);
                        const isSelected = selectedMonthDate === dateNum;
                        const isToday = dateNum === 24; // Current Date: 24 August 2026 (or matches new Date().getDate())

                        return (
                          <button
                            key={dateNum}
                            type="button"
                            onClick={() => {
                              setSelectedMonthDate(dateNum);
                              setSelectedDayDate(String(dateNum));
                            }}
                            className={cn(
                              "min-h-[58px] sm:min-h-[64px] rounded-xl p-1.5 text-xs font-semibold transition-all border relative flex flex-col items-center justify-between cursor-pointer",
                              isSelected
                                ? "bg-[#0E4833] text-white border-[#0E4833] shadow-xs"
                                : isToday
                                ? "bg-amber-50/70 border-amber-400 text-amber-950 ring-2 ring-amber-400/40"
                                : hasSession
                                ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 hover:bg-emerald-100"
                                : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
                            )}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className={cn(
                                "text-[11px] font-bold leading-none",
                                isSelected ? "text-white" : isToday ? "text-amber-900" : "text-slate-800"
                              )}>
                                {dateNum}
                              </span>
                              {isToday && (
                                <span className={cn(
                                  "px-1 py-0.2 rounded text-[8px] font-extrabold uppercase tracking-tight",
                                  isSelected 
                                    ? "bg-amber-300 text-amber-950" 
                                    : "bg-amber-500 text-white"
                                )}>
                                  Today
                                </span>
                              )}
                            </div>

                            {/* Session Booked Indicator Badge */}
                            {hasSession ? (
                              <div className={cn(
                                "w-full py-0.5 px-1 rounded text-[8px] font-bold truncate flex items-center justify-center gap-1",
                                isSelected 
                                  ? "bg-emerald-800/80 text-emerald-100" 
                                  : "bg-emerald-100 text-emerald-900 border border-emerald-300/80"
                              )}>
                                <span className={cn(
                                  "w-1.5 h-1.5 rounded-full shrink-0",
                                  isSelected ? "bg-emerald-300" : "bg-emerald-600"
                                )} />
                                <span className="hidden sm:inline">Booked</span>
                              </div>
                            ) : (
                              <div className="h-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Month Date Details Banner & Session Preview */}
                    {(() => {
                      const daySessions = sessions.filter(s => 
                        s.dateStr.includes(String(selectedMonthDate)) || 
                        (selectedMonthDate === 24 && s.id === 'sess-1') || 
                        (selectedMonthDate === 26 && s.id === 'sess-2') || 
                        (selectedMonthDate === 28 && s.id === 'sess-3') || 
                        (selectedMonthDate === 30 && s.id === 'sess-4') || 
                        (selectedMonthDate === 22 && s.id === 'sess-5') || 
                        (selectedMonthDate === 19 && s.id === 'sess-6')
                      );

                      return (
                        <div className="space-y-3 pt-2">
                          <div className="p-3 bg-[#FBF9F4] rounded-xl border border-[#EAE5DB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">Selected Date: {selectedMonthDate} August 2026</span>
                                {daySessions.length > 0 && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    {daySessions.length} {daySessions.length === 1 ? 'Session' : 'Sessions'}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {daySessions.length > 0 
                                  ? `✓ Scheduled session details for this date are shown below` 
                                  : `No tutoring sessions booked for ${selectedMonthDate} August`}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDayDate(String(selectedMonthDate));
                                setCalendarView('day');
                              }}
                              className="px-3 py-1.5 bg-[#0E4833] hover:bg-[#093223] text-white rounded-lg text-xs font-bold transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-xs flex items-center gap-1.5"
                            >
                              <span>Open in Day View</span>
                              <span>→</span>
                            </button>
                          </div>

                          {/* Render session cards for this date */}
                          {daySessions.length > 0 ? (
                            <div className="space-y-2.5">
                              {daySessions.map((session) => {
                                const isEnded = session.status === 'completed';

                                return (
                                  <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3.5 bg-white border border-[#EAE5DB] rounded-xl hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-sm font-bold text-slate-900">
                                          {session.subject} – {session.topic}
                                        </h4>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                          {session.timeStr}
                                        </span>
                                        <span className={cn(
                                          "px-2 py-0.5 rounded text-[10px] font-semibold border capitalize",
                                          isEnded 
                                            ? "bg-slate-100 text-slate-600 border-slate-300" 
                                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                        )}>
                                          {isEnded ? 'Session Ended' : session.status}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-500">
                                        Tutor: <strong className="text-slate-700">{session.tutorName}</strong> · {session.type} · ₦{session.price.toLocaleString()}
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                      {!isEnded ? (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleOpenReschedule(session)}
                                            disabled={(session.rescheduleCount || 0) >= 2}
                                            className={cn(
                                              "px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all",
                                              (session.rescheduleCount || 0) >= 2
                                                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-70"
                                                : "border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer"
                                            )}
                                            title={(session.rescheduleCount || 0) >= 2 ? "Maximum 2 reschedules reached" : "Reschedule session"}
                                          >
                                            <span>Reschedule</span>
                                            {(session.rescheduleCount || 0) > 0 && (
                                              <span className={cn(
                                                "px-1.5 py-0.2 rounded-full text-[9px] font-bold",
                                                (session.rescheduleCount || 0) >= 2 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"
                                              )}>
                                                {session.rescheduleCount}/2
                                              </span>
                                            )}
                                          </button>
                                          <Link
                                            to={session.classroomLink}
                                            onClick={(e) => handleJoinRoomClick(e, session)}
                                            className="px-3 py-1.5 rounded-lg bg-[#0E4833] hover:bg-[#093223] text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-all"
                                          >
                                            <Video className="w-3.5 h-3.5" />
                                            <span>Join Room</span>
                                          </Link>
                                        </>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => handleOpenRecording(session)}
                                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                                        >
                                          <Play className="w-3.5 h-3.5 fill-white" />
                                          <span>Watch Recording</span>
                                        </button>
                                      )}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-4 bg-[#FDFCF9] rounded-xl border border-dashed border-slate-200 text-center space-y-1.5">
                              <p className="text-xs text-slate-600">
                                No sessions booked on this day.
                              </p>
                              <Link
                                to="/tutors"
                                className="inline-block text-xs font-bold text-[#0E4833] hover:underline"
                              >
                                + Book a Masterclass for {selectedMonthDate} August →
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: WALLET + NOTIFICATIONS + FAVOURITE TUTORS (Col-span 4) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* WALLET CARD */}
              <div className="bg-white rounded-2xl border border-[#EAE5DB] p-5 shadow-xs space-y-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Wallet</p>
                  <p className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                    ₦{walletBalance.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsTopUpOpen(true)}
                    className="w-full py-2 bg-[#0E4833] hover:bg-[#093223] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add funds</span>
                  </button>

                  <Link
                    to="/dashboard/billing"
                    className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer"
                  >
                    History
                  </Link>
                </div>

                {/* Mini Transactions List */}
                <div className="space-y-2.5 pt-2 border-t border-[#F0ECE4]">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2 max-w-[170px]">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]",
                          tx.isPositive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                        )}>
                          {tx.isPositive ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        </div>
                        <span className="truncate text-slate-600">{tx.title}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-slate-400 text-[11px]">{tx.date}</span>
                        <span className={cn("font-bold", tx.isPositive ? "text-emerald-700" : "text-slate-800")}>
                          {tx.isPositive ? '+' : '-'}₦{tx.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NOTIFICATIONS CARD */}
              <div className="bg-white rounded-2xl border border-[#EAE5DB] p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-500" />
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600 divide-y divide-[#F0ECE4]">
                  {notificationsList.map((notif, idx) => (
                    <p key={idx} className={idx > 0 ? "pt-2.5" : ""}>
                      {notif}
                    </p>
                  ))}
                </div>
              </div>

              {/* REQUIREMENT 3: FAVOURITE TUTORS CARD (WITH VIEW ALL MODAL TRIGGER & HEART TOGGLES) */}
              <div className="bg-white rounded-2xl border border-[#EAE5DB] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <h3 className="text-sm font-bold text-slate-900">Favourite tutors ({activeFavoriteTutors.length})</h3>
                  </div>
                  {/* VIEW ALL BUTTON OPENS DEDICATED FAVORITE TUTORS MODAL */}
                  <button
                    onClick={() => setIsAllFavoritesOpen(true)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    View all ({activeFavoriteTutors.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {activeFavoriteTutors.slice(0, 3).map((tutor) => (
                    <div key={tutor.id} className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-slate-50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs", tutor.avatarBg)}>
                          {tutor.initials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{tutor.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {tutor.subject} · <strong className="text-slate-700">₦{tutor.rate.toLocaleString()}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleFavorite(tutor.id)}
                          title="Toggle favorite"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                        >
                          <Heart className="w-4 h-4 fill-rose-500" />
                        </button>

                        <Link
                          to={`/tutor/${tutor.id}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-[#0E4833] hover:text-white text-slate-700 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                        >
                          Book
                        </Link>
                      </div>
                    </div>
                  ))}

                  {activeFavoriteTutors.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No favourite tutors yet.
                      <Link to="/tutors" className="block text-emerald-700 font-bold mt-1">
                        Browse verified tutors →
                      </Link>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: SUBJECT MASTERY & SYLLABUS PROGRESSION */}
        {activeTab === 'mastery' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#EAE5DB] p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-1">Target Syllabus Progression Matrix</h2>
              <p className="text-xs text-slate-500 mb-6">
                Real-time tracking of curriculum topics mastered across your 1-on-1 sessions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subjectMasteryList.map((subject) => (
                  <div 
                    key={subject.id}
                    className="border border-[#EAE5DB] rounded-2xl p-5 bg-white space-y-4 shadow-2xs hover:shadow-xs transition-all"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {subject.examTrack}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{subject.name}</h3>
                      <p className="text-xs text-slate-500">Tutor: {subject.assignedTutor}</p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">Syllabus Mastered</span>
                        <span className="text-emerald-700">{subject.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${subject.progressPercent}%` }} 
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 text-right">
                        {subject.masteredTopics} of {subject.totalTopics} modules certified
                      </p>
                    </div>

                    <div className="p-3 bg-[#F7F5F0] rounded-xl border border-[#E8E3D7] text-xs space-y-1">
                      <p className="font-bold text-slate-800">Next Focus Topic:</p>
                      <p className="text-slate-600">{subject.nextTopic}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Link
                        to="/tutors"
                        className="w-full py-2 bg-[#0E4833] hover:bg-[#093223] text-white text-xs font-bold rounded-xl text-center transition-all shadow-xs"
                      >
                        Book Next Lesson
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedNotesSession(sessions[0]);
                          setIsNotesModalOpen(true);
                        }}
                        className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Vault
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* REQUIREMENT 1 MODAL: HD RECORDING VIDEO PLAYER (AFTER SESSION ENDS) */}
      <AnimatePresence>
        {isRecordingPlayerOpen && playingRecordingSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Film className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {playingRecordingSession.subject} — {playingRecordingSession.topic}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tutor: {playingRecordingSession.tutorName} · Duration: {playingRecordingSession.recordingDuration || '58 min'}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsRecordingPlayerOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Simulated Video Player */}
              <div className="relative aspect-video bg-black flex items-center justify-center group">
                <video
                  ref={videoRef}
                  src={playingRecordingSession.recordingUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Video Toolbar & Controls */}
              <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Speed:</span>
                  {[1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                        playbackSpeed === spd
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-xs text-slate-500 font-medium">
                    🛡️ 10-Day Retention Window (7 days remaining)
                  </span>

                  <a
                    href={playingRecordingSession.recordingUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-[#0E4833] hover:bg-[#093223] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MP4</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REQUIREMENT 2 MODAL: RESCHEDULE WITH TUTOR'S REAL AVAILABILITY MATRIX */}
      <AnimatePresence>
        {isRescheduleOpen && reschedulingSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Reschedule: {reschedulingSession.subject}
                    </h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold border",
                      (reschedulingSession.rescheduleCount || 0) >= 2
                        ? "bg-rose-100 text-rose-800 border-rose-300"
                        : (reschedulingSession.rescheduleCount || 0) === 1
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-slate-100 text-slate-700 border-slate-300"
                    )}>
                      Reschedules: {reschedulingSession.rescheduleCount || 0}/2 used
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assigned Tutor: <strong className="text-slate-800">{reschedulingSession.tutorName}</strong> · Maximum 2 reschedules permitted per session
                  </p>
                </div>
                <button 
                  onClick={() => setIsRescheduleOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tutor's Schedule Rules Banner */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>{reschedulingSession.tutorName}'s Weekly Teaching Days:</span>
                </div>
                <p className="text-emerald-800 text-[11px]">
                  Available on: <strong>{(TUTOR_AVAILABILITY[reschedulingSession.tutorId] || TUTOR_AVAILABILITY['1']).availableDays.join(', ')}</strong>. Please pick one of the active days below.
                </p>
              </div>

              {/* Day Selector with Available vs Unavailable States */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. Pick an Available Day:
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => {
                    const tutorData = TUTOR_AVAILABILITY[reschedulingSession.tutorId] || TUTOR_AVAILABILITY['1'];
                    const isAvail = tutorData.availableDays.includes(day);
                    const isSelected = rescheduleSelectedDay === day;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleSelectRescheduleDay(day)}
                        className={cn(
                          "py-2 rounded-xl text-center text-xs font-bold transition-all border cursor-pointer",
                          isSelected
                            ? "bg-[#0E4833] text-white border-[#0E4833] shadow-xs"
                            : isAvail
                            ? "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-400 border-slate-200 opacity-60 hover:bg-slate-200"
                        )}
                      >
                        <span className="block text-[11px]">{day}</span>
                        <span className="text-[9px] block font-normal">
                          {isAvail ? 'Open' : 'Off'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot Selector for the selected day */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Select Available Time Slot on {rescheduleSelectedDay}:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {((TUTOR_AVAILABILITY[reschedulingSession.tutorId] || TUTOR_AVAILABILITY['1']).slots[rescheduleSelectedDay] || ['17:00 - 18:00', '18:30 - 19:30']).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setRescheduleTimeSlot(slot)}
                      className={cn(
                        "p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between",
                        rescheduleTimeSlot === slot
                          ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <span>{slot}</span>
                      {rescheduleTimeSlot === slot && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRescheduleOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReschedule}
                  className="w-1/2 py-2.5 bg-[#0E4833] hover:bg-[#093223] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Confirm New Slot
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REQUIREMENT 3 MODAL: "VIEW ALL" FAVOURITE TUTORS DEDICATED DIRECTORY MODAL */}
      <AnimatePresence>
        {isAllFavoritesOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      My Favourite Tutors ({activeFavoriteTutors.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your pinned educators with instant 1-click booking and schedule availability
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAllFavoritesOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Inside Favorites */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search favourites by tutor name or subject..."
                  value={favoritesSearch}
                  onChange={(e) => setFavoritesSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Favourite Tutors List */}
              <div className="overflow-y-auto space-y-3 flex-1 pr-1">
                {modalFilteredFavorites.length > 0 ? (
                  modalFilteredFavorites.map((tutor) => (
                    <div 
                      key={tutor.id}
                      className="border border-[#EAE5DB] rounded-2xl p-4 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs", tutor.avatarBg)}>
                          {tutor.initials}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{tutor.name}</h4>
                            <span className="flex items-center text-[11px] text-amber-500 font-bold gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {tutor.rating}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">{tutor.subject}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span>{tutor.experience}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">Available: {tutor.availableDays.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-bold text-slate-900">₦{tutor.rate.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400">per 60-min session</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleFavorite(tutor.id)}
                            title="Remove from favourites"
                            className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                          >
                            <Heart className="w-4 h-4 fill-rose-500" />
                          </button>

                          <Link
                            to={`/dashboard/messages?recipient=${encodeURIComponent(tutor.name)}`}
                            className="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition-all cursor-pointer"
                            title="Message Tutor"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/tutor/${tutor.id}`}
                            className="px-3.5 py-2 bg-[#0E4833] hover:bg-[#093223] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>Book</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">No favourite tutors matched your search.</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Total Active Favourites: <strong>{activeFavoriteTutors.length}</strong>
                </span>
                <Link
                  to="/tutors"
                  onClick={() => setIsAllFavoritesOpen(false)}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  Explore more tutors in catalog →
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOP-UP MODAL */}
      <AnimatePresence>
        {isTopUpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Deposit Funds to Wallet</h3>
                  <p className="text-xs text-slate-500">Instant deposit via Paystack Secure Checkout</p>
                </div>
                <button 
                  onClick={() => setIsTopUpOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Preset Amount:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5000, 10000, 25000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={cn(
                        "py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                        topUpAmount === amt
                          ? "bg-[#0E4833] text-white border-[#0E4833] shadow-xs"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="mt-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Or Enter Custom Amount (₦)
                  </label>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>256-Bit SSL Encrypted Paystack Payment Gateway</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTopUpOpen(false)}
                  className="w-1/2 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmTopUp}
                  className="w-1/2 py-2.5 bg-[#0E4833] hover:bg-[#093223] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Pay ₦{topUpAmount.toLocaleString()}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHARED LESSON NOTES MODAL */}
      <LessonNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        session={{
          id: selectedNotesSession?.id || 'sess-1',
          title: selectedNotesSession ? `${selectedNotesSession.subject} — ${selectedNotesSession.topic}` : 'Calculus – Integration by Parts',
          tutorName: selectedNotesSession?.tutorName || 'Amara Okoye',
          subject: selectedNotesSession?.subject || 'Calculus',
          date: selectedNotesSession?.dateStr || 'Mon 24 Aug',
          time: selectedNotesSession?.timeStr || '17:00 - 18:00'
        }}
      />

      {/* CLASSROOM PRE-CLASS LOBBY MODAL (PREVENTS STARTING AHEAD OF TIME) */}
      {selectedLobbySession && (
        <ClassroomLobbyModal
          isOpen={isLobbyModalOpen}
          onClose={() => {
            setIsLobbyModalOpen(false);
            setSelectedLobbySession(null);
          }}
          session={{
            id: selectedLobbySession.id,
            title: `${selectedLobbySession.subject} – ${selectedLobbySession.topic}`,
            tutor: selectedLobbySession.tutorName,
            timeDisplay: selectedLobbySession.timeStr,
            time: selectedLobbySession.timeStr,
            type: selectedLobbySession.type
          }}
          accessResult={calculateSessionAccess({
            id: selectedLobbySession.id,
            timeDisplay: selectedLobbySession.timeStr,
            time: selectedLobbySession.timeStr,
            dateStr: selectedLobbySession.dateStr,
            status: selectedLobbySession.status
          })}
        />
      )}
    </div>
  );
}

function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
