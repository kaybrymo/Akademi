import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Clock, 
  Calendar, 
  Sparkles, 
  GraduationCap, 
  Plus, 
  Search,
  CheckCircle2,
  CalendarDays,
  Play,
  ChevronLeft,
  ChevronRight,
  Filter,
  Link as LinkIcon,
  Check,
  X,
  MoreVertical,
  MapPin,
  Users,
  AlertCircle,
  FileText,
  ExternalLink,
  Download,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LessonNotesModal from '@/components/ui/LessonNotesModal';
import GoogleAuthModal, { GoogleLogo } from '@/components/ui/GoogleAuthModal';
import ClassroomLobbyModal from '@/components/ui/ClassroomLobbyModal';
import { calculateSessionAccess, type SessionAccessResult } from '@/lib/sessionAccess';

export function getGoogleCalendarUrl(session: {
  id: string | number;
  title: string;
  student?: string;
  tutor?: string;
  timeDisplay?: string;
  dateStr?: string;
}) {
  const now = new Date();
  const startISO = new Date(now.getTime() + 3600000).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const endISO = new Date(now.getTime() + 7200000).toISOString().replace(/-|:|\.\d\d\d/g, '');
  const text = encodeURIComponent(`Akademi Session: ${session.title}`);
  const details = encodeURIComponent(
    `Akademi Live Tutoring Session\n` +
    `Subject: ${session.title}\n` +
    `Participants: ${session.tutor || session.student || 'Akademi Student & Educator'}\n` +
    `Classroom URL: https://akademi.ng/classroom/${session.id}\n` +
    `Direct Meeting Link: https://meet.google.com/xyz-abc-123\n` +
    `Platform: Akademi Calm Learning Workspace`
  );
  const location = encodeURIComponent(`https://meet.google.com/xyz-abc-123`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startISO}/${endISO}&details=${details}&location=${location}`;
}

interface CalendarEvent {
  id: number;
  title: string;
  student: string;
  studentAvatar: string;
  dayIndex: number; // 0: Mon, 1: Tue, 2: Wed, 3: Thu, 4: Fri, 5: Sat, 6: Sun
  dayName: string;
  dateStr: string;
  startHour: number; // 8 = 8am, 13 = 1pm
  startMinute: number;
  durationMinutes: number;
  timeDisplay: string;
  type: '1on1' | 'group' | 'video' | 'in_person' | 'pending';
}

const tutorEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Calculus II',
    student: 'Chiamaka Obi',
    studentAvatar: '/images/hero-student.jpg',
    dayIndex: 0,
    dayName: 'Mon',
    dateStr: 'Mon 8/17',
    startHour: 8,
    startMinute: 0,
    durationMinutes: 120,
    timeDisplay: '8:00 - 10:00 AM',
    type: '1on1'
  },
  {
    id: 2,
    title: 'Mechanics',
    student: 'Emeka Nnaji',
    studentAvatar: '/images/tutor-daniel.jpg',
    dayIndex: 0,
    dayName: 'Mon',
    dateStr: 'Mon 8/17',
    startHour: 13,
    startMinute: 0,
    durationMinutes: 90,
    timeDisplay: '1:00 - 2:30 PM',
    type: '1on1'
  },
  {
    id: 3,
    title: 'Algebra prep',
    student: 'Amina Bello',
    studentAvatar: '/images/tutor-adaeze.jpg',
    dayIndex: 1,
    dayName: 'Tue',
    dateStr: 'Tue 8/18',
    startHour: 10,
    startMinute: 0,
    durationMinutes: 60,
    timeDisplay: '10:00 - 11:00 AM',
    type: '1on1'
  },
  {
    id: 4,
    title: 'Linear algebra',
    student: 'Kelechi Umeh',
    studentAvatar: '/images/hero-student.jpg',
    dayIndex: 1,
    dayName: 'Tue',
    dateStr: 'Tue 8/18',
    startHour: 14,
    startMinute: 0,
    durationMinutes: 90,
    timeDisplay: '2:00 - 3:30 PM',
    type: 'group'
  },
  {
    id: 5,
    title: 'Trig review',
    student: 'Segun Adeyemi',
    studentAvatar: '/images/tutor-ibrahim.jpg',
    dayIndex: 2,
    dayName: 'Wed',
    dateStr: 'Wed 8/19',
    startHour: 11,
    startMinute: 0,
    durationMinutes: 60,
    timeDisplay: '11:00 - 12:00 PM',
    type: '1on1'
  },
  {
    id: 6,
    title: 'Statistics drill',
    student: 'Chiamaka Eze (Group · 4 students)',
    studentAvatar: '/images/hero-student.jpg',
    dayIndex: 2,
    dayName: 'Wed',
    dateStr: 'Wed 8/19',
    startHour: 15,
    startMinute: 0,
    durationMinutes: 60,
    timeDisplay: '3:00 - 4:00 PM',
    type: 'group'
  },
  {
    id: 7,
    title: 'Vectors',
    student: 'Ngozi Uche',
    studentAvatar: '/images/hero-student.jpg',
    dayIndex: 3,
    dayName: 'Thu',
    dateStr: 'Thu 8/20',
    startHour: 14,
    startMinute: 0,
    durationMinutes: 60,
    timeDisplay: '2:00 - 3:00 PM',
    type: '1on1'
  },
  {
    id: 8,
    title: 'Physics lab',
    student: 'Cohort Beta (6 students)',
    studentAvatar: '/images/tutor-ibrahim.jpg',
    dayIndex: 3,
    dayName: 'Thu',
    dateStr: 'Thu 8/20',
    startHour: 16,
    startMinute: 0,
    durationMinutes: 120,
    timeDisplay: '4:00 - 6:00 PM',
    type: 'group'
  },
  {
    id: 9,
    title: 'Integration',
    student: 'Chiamaka Obi',
    studentAvatar: '/images/hero-student.jpg',
    dayIndex: 4,
    dayName: 'Fri',
    dateStr: 'Fri 8/21',
    startHour: 8,
    startMinute: 0,
    durationMinutes: 120,
    timeDisplay: '8:00 - 10:00 AM',
    type: '1on1'
  },
  {
    id: 10,
    title: 'Mock exam review',
    student: 'A-level Cohort (8 students)',
    studentAvatar: '/images/tutor-daniel.jpg',
    dayIndex: 4,
    dayName: 'Fri',
    dateStr: 'Fri 8/21',
    startHour: 11,
    startMinute: 0,
    durationMinutes: 90,
    timeDisplay: '11:00 - 12:30 PM',
    type: 'group'
  },
  {
    id: 11,
    title: 'Office hours',
    student: 'Amina Bello',
    studentAvatar: '/images/tutor-adaeze.jpg',
    dayIndex: 5,
    dayName: 'Sat',
    dateStr: 'Sat 8/22',
    startHour: 12,
    startMinute: 0,
    durationMinutes: 120,
    timeDisplay: '12:00 - 2:00 PM',
    type: '1on1'
  }
];

const daysOfWeek = [
  { name: 'MON', date: '8/17' },
  { name: 'TUE', date: '8/18' },
  { name: 'WED', date: '8/19' },
  { name: 'THU', date: '8/20' },
  { name: 'FRI', date: '8/21' },
  { name: 'SAT', date: '8/22' },
  { name: 'SUN', date: '8/23' }
];

const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

export default function Sessions() {
  const [user, setUser] = useState<{ role?: string; name?: string }>(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { role: 'tutor', name: 'Dr. Chiamaka Eze' };
  });

  useEffect(() => {
    const loadUser = () => {
      try {
        const saved = localStorage.getItem('akademi_auth_user');
        if (saved) setUser(JSON.parse(saved));
      } catch (e) {}
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const isTutor = user.role === 'tutor';

  // Tutor Schedule View state
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0: Mon, 1: Tue, 2: Wed, 3: Thu, 4: Fri, 5: Sat, 6: Sun
  const [selectedMonthDate, setSelectedMonthDate] = useState(17); // Aug 17 default
  const [weekOffset, setWeekOffset] = useState(0);

  const handleNavigateCalendar = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setWeekOffset(0);
      setSelectedDayIndex(0);
      setSelectedMonthDate(17);
    } else if (direction === 'prev') {
      setWeekOffset(prev => prev - 1);
      if (viewMode === 'day') {
        setSelectedDayIndex(idx => (idx > 0 ? idx - 1 : 6));
      } else if (viewMode === 'month') {
        setSelectedMonthDate(d => Math.max(1, d - 7));
      }
    } else if (direction === 'next') {
      setWeekOffset(prev => prev + 1);
      if (viewMode === 'day') {
        setSelectedDayIndex(idx => (idx < 6 ? idx + 1 : 0));
      } else if (viewMode === 'month') {
        setSelectedMonthDate(d => Math.min(31, d + 7));
      }
    }
  };
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'in_person' | 'pending'>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
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
  const [isGoogleCalendarModalOpen, setIsGoogleCalendarModalOpen] = useState(false);
  const [newSessionModalOpen, setNewSessionModalOpen] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);

  // Classroom Lobby Locked Modal State
  const [lobbyModalSession, setLobbyModalSession] = useState<any | null>(null);
  const [lobbyModalAccessResult, setLobbyModalAccessResult] = useState<SessionAccessResult | null>(null);

  // Periodic heartbeat timer to keep lock timers & countdowns live
  const [, setHeartbeat] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setHeartbeat(h => h + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  // Preferred Available Meeting Slots per Day
  const [sessionTypeSettings, setSessionTypeSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('akademi_session_type_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      virtual1on1: true,
      virtualGroup: true,
      inPerson: false,
      inPersonLgaMatch: true,
      inPersonStateMatch: true
    };
  });

  const [preferredSlots, setPreferredSlots] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('akademi_tutor_available_slots');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      'MON': ['8:00 AM', '10:00 AM', '1:00 PM', '4:00 PM'],
      'TUE': ['9:00 AM', '10:00 AM', '2:00 PM', '5:00 PM'],
      'WED': ['11:00 AM', '1:00 PM', '3:00 PM', '6:00 PM'],
      'THU': ['10:00 AM', '2:00 PM', '4:00 PM', '7:00 PM'],
      'FRI': ['8:00 AM', '11:00 AM', '2:00 PM', '4:30 PM'],
      'SAT': ['10:00 AM', '12:00 PM', '2:00 PM'],
      'SUN': ['2:00 PM', '4:00 PM']
    };
  });

  const [activeSlotDay, setActiveSlotDay] = useState('MON');
  const [newSlotTime, setNewSlotTime] = useState('09:00 AM');

  const handleAddSlot = () => {
    if (!newSlotTime.trim()) return;
    setPreferredSlots(prev => {
      const current = prev[activeSlotDay] || [];
      if (current.includes(newSlotTime)) return prev;
      const updated = { ...prev, [activeSlotDay]: [...current, newSlotTime] };
      localStorage.setItem('akademi_tutor_available_slots', JSON.stringify(updated));
      return updated;
    });
    setToastMsg(`Added ${newSlotTime} to ${activeSlotDay} preferred booking slots!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRemoveSlot = (day: string, slot: string) => {
    setPreferredSlots(prev => {
      const updated = {
        ...prev,
        [day]: (prev[day] || []).filter(s => s !== slot)
      };
      localStorage.setItem('akademi_tutor_available_slots', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSavePreferredTimes = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('akademi_tutor_available_slots', JSON.stringify(preferredSlots));
    setAvailabilityModalOpen(false);
    setToastMsg('Preferred meeting times updated! Students will now see these bookable slots.');
    setTimeout(() => setToastMsg(null), 3500);
  };

  // New session form
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionStudent, setNewSessionStudent] = useState('Chiamaka Obi');
  const [newSessionDay, setNewSessionDay] = useState(0);
  const [newSessionStartHour, setNewSessionStartHour] = useState(10);
  const [newSessionDuration, setNewSessionDuration] = useState(60);
  const [newSessionType, setNewSessionType] = useState<'video' | 'in_person'>('video');

  const [eventsList, setEventsList] = useState<CalendarEvent[]>(tutorEvents);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredEvents = eventsList.filter(e => {
    if (typeFilter === 'all') return true;
    return e.type === typeFilter;
  });

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;

    const startH = Number(newSessionStartHour);
    const dur = Number(newSessionDuration);
    const endH = startH + Math.floor(dur / 60);
    const endM = dur % 60;
    const timeStr = `${startH > 12 ? startH - 12 : startH}:00 - ${endH > 12 ? endH - 12 : endH}:${endM === 0 ? '00' : endM} ${endH >= 12 ? 'PM' : 'AM'}`;

    const newEv: CalendarEvent = {
      id: Date.now(),
      title: newSessionTitle,
      student: newSessionStudent,
      studentAvatar: '/images/hero-student.jpg',
      dayIndex: Number(newSessionDay),
      dayName: daysOfWeek[Number(newSessionDay)].name,
      dateStr: `${daysOfWeek[Number(newSessionDay)].name} ${daysOfWeek[Number(newSessionDay)].date}`,
      startHour: startH,
      startMinute: 0,
      durationMinutes: dur,
      timeDisplay: timeStr,
      type: newSessionType
    };

    setEventsList(prev => [...prev, newEv]);
    setNewSessionModalOpen(false);
    setNewSessionTitle('');
    setToastMsg(`Scheduled "${newSessionTitle}" with ${newSessionStudent}!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleGoogleCalendar = () => {
    if (!googleConnected) {
      setIsGoogleCalendarModalOpen(true);
    } else {
      setGoogleConnected(false);
      localStorage.removeItem('akademi_google_calendar_connected');
      setToastMsg("Google Calendar disconnected.");
      setTimeout(() => setToastMsg(null), 3500);
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleGoogleCalendarAuthSuccess = (googleData: any) => {
    setGoogleConnected(true);
    setGoogleAccount(googleData.email);
    localStorage.setItem('akademi_google_calendar_connected', 'true');
    localStorage.setItem('akademi_google_calendar_account', googleData.email);
    setToastMsg(`✓ Google Calendar connected (${googleData.email})! Synchronized 11 sessions with reminders.`);
    setTimeout(() => setToastMsg(null), 4500);
    window.dispatchEvent(new Event('storage'));
  };

  // Student view filter & sessions
  const [studentFilter, setStudentFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');
  const [studentTimeframe, setStudentTimeframe] = useState<'all' | 'day' | 'week' | 'month'>('all');
  const [studentFormatFilter, setStudentFormatFilter] = useState<'all' | '1on1' | 'group'>('all');

  // Lesson Note Modal state
  const [selectedNoteSession, setSelectedNoteSession] = useState<any | null>(null);
  const [isNoteTutorMode, setIsNoteTutorMode] = useState<boolean>(false);

  // Load persistent booked sessions
  const [userBookedSessions, setUserBookedSessions] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_booked_sessions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    const syncBooked = () => {
      try {
        const saved = localStorage.getItem('akademi_booked_sessions');
        if (saved) setUserBookedSessions(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('storage', syncBooked);
    return () => window.removeEventListener('storage', syncBooked);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 max-w-7xl font-sans"
    >
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#0F5338] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TUTOR SCHEDULE VIEW (MATCHES SCREENSHOT EXACTLY) */}
      {/* ========================================================================= */}
      {isTutor ? (
        <div className="space-y-6">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141E18] tracking-tight">
                Schedule
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                <strong className="text-slate-900 font-bold">{filteredEvents.length} sessions</strong> matching filters this week
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Set Preferred Meeting Times button */}
              <button
                type="button"
                onClick={() => setAvailabilityModalOpen(true)}
                className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Clock className="w-3.5 h-3.5 text-[#0F5338]" />
                <span>Preferred Meeting Times</span>
              </button>

              {/* Day / Week / Month Switcher */}
              <div className="bg-slate-100 p-1 rounded-full flex items-center border border-slate-200">
                {(['day', 'week', 'month'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setViewMode(m)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold capitalize transition-all",
                      viewMode === m
                        ? "bg-[#0F5338] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Google Calendar Connect */}
              <button
                type="button"
                onClick={handleToggleGoogleCalendar}
                className={cn(
                  "px-4 py-2 rounded-full border text-xs font-semibold transition-all flex items-center gap-2 active:scale-95 shadow-2xs",
                  googleConnected
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                )}
                title={googleConnected ? `Synced with ${googleAccount}` : "Connect Google Calendar"}
              >
                <GoogleLogo className="w-4 h-4" />
                <span>{googleConnected ? 'G-Cal Synced ✓' : 'Connect Google Calendar'}</span>
              </button>

              {/* Filter Button with select */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs focus:outline-none cursor-pointer"
                >
                  <option value="all">All Formats</option>
                  <option value="1on1">🟢 1-on-1 (Virtual)</option>
                  <option value="group">🔵 Group (Virtual)</option>
                </select>
              </div>

              {/* + New session */}
              <button
                type="button"
                onClick={() => setNewSessionModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full px-5 py-2 text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                <span>New session</span>
              </button>
            </div>
          </div>

          {/* Main Grid & Right Sidebar Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Week Calendar Matrix */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E8E3D7] p-5 sm:p-6 shadow-2xs overflow-hidden">
              {/* Calendar Controls & Legend */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-5 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => handleNavigateCalendar('prev')}
                    title="Previous"
                    className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleNavigateCalendar('next')}
                    title="Next"
                    className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleNavigateCalendar('today')}
                    className="px-3 py-1 rounded-full border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    Today
                  </button>
                </div>

                <h3 className="font-serif font-bold text-base text-slate-900">
                  {viewMode === 'day' && `Day Schedule — ${daysOfWeek[selectedDayIndex].name} (${daysOfWeek[selectedDayIndex].date})`}
                  {viewMode === 'week' && (weekOffset === 0 ? 'Weekly Schedule Matrix' : `Weekly Schedule Matrix (${weekOffset > 0 ? `+${weekOffset} wks` : `${weekOffset} wks`})`)}
                  {viewMode === 'month' && `Monthly Overview (August 2026${weekOffset !== 0 ? ` · ${weekOffset > 0 ? `+${weekOffset}w` : `${weekOffset}w`}` : ''})`}
                </h3>

                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>1-on-1</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Group</span>
                  </span>
                </div>
              </div>

              {/* VIEW 1: DAY SCHEDULE VIEW */}
              {viewMode === 'day' && (
                <div className="space-y-4">
                  {/* Day Picker Horizontal Strip */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
                    {daysOfWeek.map((d, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedDayIndex(i)}
                        className={cn(
                          "px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex flex-col items-center",
                          selectedDayIndex === i 
                            ? "bg-[#0F5338] text-white shadow-xs ring-2 ring-[#0F5338]/30" 
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                        )}
                      >
                        <span className="text-[10px] uppercase font-semibold opacity-80">{d.name}</span>
                        <span className="text-xs font-black">{d.date}</span>
                      </button>
                    ))}
                  </div>

                  {/* Day Events Timeline */}
                  <div className="space-y-3 pt-1">
                    {filteredEvents.filter(e => e.dayIndex === selectedDayIndex).length === 0 ? (
                      <div className="py-14 text-center text-slate-400 space-y-2">
                        <Calendar className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                        <p className="text-xs font-semibold">No sessions scheduled for {daysOfWeek[selectedDayIndex].name} ({daysOfWeek[selectedDayIndex].date}).</p>
                        <button
                          type="button"
                          onClick={() => setNewSessionModalOpen(true)}
                          className="text-xs font-bold text-[#0F5338] hover:underline"
                        >
                          + Add a new session for this day
                        </button>
                      </div>
                    ) : (
                      filteredEvents.filter(e => e.dayIndex === selectedDayIndex).map((ev) => {
                        const access = calculateSessionAccess(ev);

                        return (
                          <div 
                            key={ev.id}
                            className="p-4 rounded-2xl bg-[#FBF9F4] border border-[#E8E3D7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-300 transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-16 py-2 rounded-xl bg-white text-center shrink-0 border border-[#E8E3D7] shadow-2xs">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase leading-none">TIME</span>
                                <span className="text-xs font-black text-slate-900 leading-tight block mt-0.5">{ev.timeDisplay.split(' ')[0]}</span>
                              </div>
                              <img 
                                src={ev.studentAvatar} 
                                alt={ev.student} 
                                className="w-10 h-10 rounded-full object-cover shrink-0 shadow-2xs"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-sm font-bold text-slate-900 truncate">{ev.title}</h4>
                                  <span className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                    ev.type === 'group' 
                                      ? "bg-blue-50 text-blue-800 border-blue-200" 
                                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  )}>
                                    {ev.type === 'group' ? '👥 Group Virtual' : '📹 1-on-1 Virtual'}
                                  </span>

                                  {/* Live / Lobby / Lock Timing Badge */}
                                  <span className={cn("text-[9px] px-2 py-0.5 rounded-full border", access.badgeStyle)}>
                                    {access.badgeText}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">{ev.student} · {ev.durationMinutes} minutes ({ev.timeDisplay})</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={getGoogleCalendarUrl({
                                  id: ev.id,
                                  title: ev.title,
                                  student: ev.student,
                                  timeDisplay: ev.timeDisplay,
                                  dateStr: ev.dateStr
                                })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700 rounded-xl transition-all shadow-2xs"
                                title="Add to Google Calendar"
                              >
                                <GoogleLogo className="w-4 h-4" />
                              </a>

                              {access.isAccessible ? (
                                <Link
                                  to={`/classroom/${ev.id}`}
                                  className="px-4 py-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5 active:scale-95"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                  <span>{access.buttonText}</span>
                                </Link>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLobbyModalSession(ev);
                                    setLobbyModalAccessResult(access);
                                  }}
                                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-2xs border border-slate-200 flex items-center gap-1.5 active:scale-95"
                                  title={access.lockReason}
                                >
                                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                                  <span>{access.buttonText}</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setSelectedEvent(ev)}
                                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* VIEW 2: WEEK SCHEDULE VIEW (7-DAY MATRIX) */}
              {viewMode === 'week' && (
                <>
                  {/* Weekly Day Headers */}
                  <div className="grid grid-cols-8 text-center text-xs font-bold pb-3 border-b border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase">GMT+1</div>
                    {daysOfWeek.map((d, i) => (
                      <div key={i} className="text-slate-700">
                        <span className="block text-[11px] text-slate-500 uppercase">{d.name}</span>
                        <span className="text-xs font-bold text-slate-900">{d.date}</span>
                      </div>
                    ))}
                  </div>

                  {/* Time Matrix Rows & Event Slots */}
                  <div className="relative overflow-x-auto">
                    <div className="min-w-[620px]">
                      {hours.map((h) => {
                        const hourLabel = h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`;
                        return (
                          <div key={h} className="grid grid-cols-8 min-h-[56px] border-b border-slate-100/70 items-start">
                            {/* Time Label */}
                            <div className="text-[11px] text-slate-400 font-medium pt-1 pr-2 text-right">
                              {hourLabel}
                            </div>

                            {/* 7 Day Slots */}
                            {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                              const eventStarting = filteredEvents.find(
                                e => e.dayIndex === dayIdx && e.startHour === h
                              );

                              return (
                                <div 
                                  key={dayIdx} 
                                  className="border-l border-slate-100/80 h-full p-1 relative min-h-[56px] hover:bg-slate-50/50 transition-colors"
                                >
                                  {eventStarting && (
                                    <motion.div
                                      initial={{ scale: 0.9, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      onClick={() => setSelectedEvent(eventStarting)}
                                      className={cn(
                                        "rounded-xl p-2 text-left cursor-pointer transition-all shadow-2xs border hover:shadow-md hover:-translate-y-0.5",
                                        eventStarting.type === 'group'
                                          ? "bg-[#EEF4FE] border-[#D4E3FC] text-blue-950"
                                          : "bg-white border-slate-200 text-slate-900"
                                      )}
                                      style={{
                                        height: eventStarting.durationMinutes > 60 ? `${(eventStarting.durationMinutes / 60) * 54}px` : 'auto',
                                        zIndex: 10
                                      }}
                                    >
                                      <div className="flex items-center justify-between mb-0.5">
                                        <h4 className="font-bold text-[11px] leading-tight truncate">
                                          {eventStarting.title}
                                        </h4>
                                        <span className={cn(
                                          "w-1.5 h-1.5 rounded-full shrink-0",
                                          eventStarting.type === 'group' ? "bg-[#1E3A5F]" : "bg-emerald-500"
                                        )} />
                                      </div>
                                      <p className="text-[9px] text-slate-500 truncate">{eventStarting.student}</p>
                                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">{eventStarting.timeDisplay.split(' ')[0]}</p>
                                    </motion.div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* VIEW 3: MONTH SCHEDULE VIEW */}
              {viewMode === 'month' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-serif font-bold text-sm text-slate-900">August 2026</h4>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {filteredEvents.length} Sessions This Month
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {Array.from({ length: 31 }, (_, idx) => idx + 1).map((dayNum) => {
                      const isEventDay = [17, 18, 19, 20, 21, 22].includes(dayNum);
                      const isSelected = selectedMonthDate === dayNum;
                      
                      // Match day index for mock events (17=Mon(0), 18=Tue(1), etc.)
                      const dayIdx = (dayNum - 17) >= 0 && (dayNum - 17) <= 6 ? (dayNum - 17) : -1;
                      const dayEvs = dayIdx >= 0 ? filteredEvents.filter(e => e.dayIndex === dayIdx) : [];

                      return (
                        <button
                          key={dayNum}
                          type="button"
                          onClick={() => setSelectedMonthDate(dayNum)}
                          className={cn(
                            "p-2 rounded-2xl min-h-[64px] border text-left transition-all flex flex-col justify-between",
                            isSelected
                              ? "border-[#0F5338] bg-emerald-50/70 ring-1 ring-[#0F5338]"
                              : isEventDay
                              ? "bg-[#FBF9F4] border-[#E8E3D7] hover:border-emerald-300"
                              : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                          )}
                        >
                          <div className="flex justify-between items-center">
                            <span className={cn("text-xs font-bold", isSelected ? "text-[#0F5338]" : isEventDay ? "text-slate-900" : "text-slate-400")}>
                              {dayNum}
                            </span>
                            {isEventDay && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            )}
                          </div>

                          {dayEvs.length > 0 ? (
                            <div className="space-y-0.5 mt-1">
                              <span className="block text-[9px] font-bold text-emerald-800 bg-emerald-100/80 px-1 py-0.2 rounded truncate leading-tight">
                                {dayEvs[0].title}
                              </span>
                              {dayEvs.length > 1 && (
                                <span className="block text-[8px] font-semibold text-slate-500">
                                  +{dayEvs.length - 1} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[8px] text-slate-300 block">&nbsp;</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Month Date Detail Banner */}
                  {selectedMonthDate && (
                    <div className="p-4 rounded-2xl bg-[#FBF9F4] border border-[#E8E3D7] mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-xs font-bold text-slate-900">
                          Scheduled for August {selectedMonthDate}, 2026
                        </h5>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {filteredEvents.filter(e => e.dayIndex === ((selectedMonthDate - 17) >= 0 && (selectedMonthDate - 17) <= 6 ? (selectedMonthDate - 17) : -1)).length} sessions
                        </span>
                      </div>

                      {(() => {
                        const dIdx = (selectedMonthDate - 17) >= 0 && (selectedMonthDate - 17) <= 6 ? (selectedMonthDate - 17) : -1;
                        const evs = dIdx >= 0 ? filteredEvents.filter(e => e.dayIndex === dIdx) : [];
                        if (evs.length === 0) return <p className="text-xs text-slate-400">No scheduled sessions for this date.</p>;
                        return (
                          <div className="space-y-2">
                            {evs.map(e => (
                              <div key={e.id} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                  <img src={e.studentAvatar} alt={e.student} className="w-7 h-7 rounded-full object-cover" />
                                  <div>
                                    <p className="font-bold text-slate-900">{e.title} · <span className="font-normal text-slate-500">{e.student}</span></p>
                                    <p className="text-[10px] text-slate-400">{e.timeDisplay}</p>
                                  </div>
                                </div>
                                <Link to={`/classroom/${e.id}`} className="px-3 py-1 bg-[#0F5338] text-white rounded-lg text-[10px] font-bold">
                                  Join
                                </Link>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Google Calendar + Upcoming Sessions Cards */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 1: Google Calendar Integration */}
              <div className="bg-white rounded-3xl border border-[#E8E3D7] p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-blue-600 shadow-2xs">
                    G
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Google Calendar</h3>
                    <p className="text-[11px] text-slate-500">Sync sessions & push alerts to your phone.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleGoogleCalendar}
                  className={cn(
                    "w-full py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95",
                    googleConnected
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      : "bg-[#0F5338] hover:bg-[#0A3D29] text-white"
                  )}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{googleConnected ? 'Disconnect Calendar' : 'Connect'}</span>
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  📱 Automated notifications on iOS & Android
                </p>
              </div>

              {/* Card 2: Upcoming sessions list */}
              <div className="bg-white rounded-3xl border border-[#E8E3D7] p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="font-serif font-bold text-base text-slate-900">Upcoming</h3>
                  <Link to="/dashboard/sessions" className="text-xs font-semibold text-[#0F5338] hover:underline">
                    View all
                  </Link>
                </div>

                <div className="space-y-3">
                  {filteredEvents.slice(0, 5).map((ev) => (
                    <div 
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className="p-3 rounded-2xl bg-[#FBF9F4] border border-[#E8E3D7] hover:border-emerald-300 transition-colors cursor-pointer flex items-center justify-between gap-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={ev.studentAvatar} 
                          alt={ev.student} 
                          className="w-9 h-9 rounded-full object-cover shrink-0 shadow-2xs"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{ev.title}</h4>
                          <p className="text-[11px] text-slate-500 truncate">{ev.student}</p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                            <span>{ev.dateStr.split(' ')[0]} · {ev.timeDisplay.split(' ')[0]}</span>
                            <span>·</span>
                            <span className={cn(
                              "font-semibold flex items-center gap-1",
                              ev.type === 'group' ? "text-[#1E3A5F]" : "text-emerald-700"
                            )}>
                              {ev.type === 'group' ? '👥 Group' : '📹 1-on-1'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(ev);
                        }}
                        title="Session options"
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Modal: Event Details Drawer */}
          <AnimatePresence>
            {selectedEvent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4 font-sans"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <span className={cn(
                        "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border",
                        selectedEvent.type === 'group' 
                          ? "bg-blue-50 text-blue-800 border-blue-200" 
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      )}>
                        {selectedEvent.type === 'group' ? '👥 Group Virtual' : '📹 1-on-1 Virtual'}
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 mt-1">{selectedEvent.title}</h3>
                    </div>
                    <button onClick={() => setSelectedEvent(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs text-slate-700">
                    <div className="flex items-center gap-3 p-3 bg-[#FBF9F4] rounded-2xl border border-[#E8E3D7]">
                      <img src={selectedEvent.studentAvatar} alt={selectedEvent.student} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{selectedEvent.student}</p>
                        <p className="text-slate-500">Enrolled Student</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Date & Time</span>
                        <span className="font-bold text-slate-800">{selectedEvent.dateStr}</span>
                        <span className="text-[10px] text-slate-500 block">{selectedEvent.timeDisplay}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Duration</span>
                        <span className="font-bold text-slate-800">{selectedEvent.durationMinutes} min</span>
                        <span className="text-[10px] text-emerald-700 block font-semibold">Confirmed</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Meeting Link:</span>
                      <a 
                        href="https://meet.google.com/xyz-abc-123" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#0F5338] font-mono font-bold hover:underline flex items-center gap-1"
                      >
                        <span>https://meet.google.com/xyz-abc-123</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex gap-2">
                      <Link
                        to={`/classroom/${selectedEvent.id}`}
                        onClick={() => setSelectedEvent(null)}
                        className="flex-1 py-2.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{selectedEvent.type === 'group' ? 'Launch Group Classroom' : 'Launch 1-on-1 Classroom'}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedNoteSession(selectedEvent);
                          setIsNoteTutorMode(true);
                          setSelectedEvent(null);
                        }}
                        className="px-3.5 py-2.5 bg-[#EAF5EE] text-[#0F5338] hover:bg-[#D5EADB] rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                        title="Add lesson summary, formula cheat sheets, or homework"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Add / Edit Notes</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedEvent(null)}
                      className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Modal: New Session Creation */}
          <AnimatePresence>
            {newSessionModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 space-y-4 font-sans"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-bold text-base text-slate-900">Schedule New Session</h3>
                    <button onClick={() => setNewSessionModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateSession} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Session Title</label>
                      <input 
                        type="text"
                        value={newSessionTitle}
                        onChange={(e) => setNewSessionTitle(e.target.value)}
                        placeholder="e.g. Calculus — Integration Practice"
                        required
                        className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Student</label>
                        <select 
                          value={newSessionStudent}
                          onChange={(e) => setNewSessionStudent(e.target.value)}
                          className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                        >
                          <option value="Chiamaka Obi">Chiamaka Obi</option>
                          <option value="Emeka Nnaji">Emeka Nnaji</option>
                          <option value="Amina Bello">Amina Bello</option>
                          <option value="Segun Adeyemi">Segun Adeyemi</option>
                          <option value="Ngozi Uche">Ngozi Uche</option>
                          <option value="Yusuf Ibrahim">Yusuf Ibrahim</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Day</label>
                        <select 
                          value={newSessionDay}
                          onChange={(e) => setNewSessionDay(Number(e.target.value))}
                          className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                        >
                          {daysOfWeek.map((d, i) => (
                            <option key={i} value={i}>{d.name} ({d.date})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Start Hour</label>
                        <select
                          value={newSessionStartHour}
                          onChange={(e) => setNewSessionStartHour(Number(e.target.value))}
                          className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                        >
                          {hours.map(h => (
                            <option key={h} value={h}>{h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                        <select
                          value={newSessionDuration}
                          onChange={(e) => setNewSessionDuration(Number(e.target.value))}
                          className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                        >
                          <option value={30}>30 min</option>
                          <option value={45}>45 min</option>
                          <option value={60}>60 min</option>
                          <option value={90}>90 min</option>
                          <option value={120}>120 min</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Format</label>
                        <select
                          value={newSessionType}
                          onChange={(e) => setNewSessionType(e.target.value as any)}
                          className="w-full bg-[#FBF9F4] border border-[#E8E3D7] rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                        >
                          <option value="video">🟢 1:1 HD Video (Virtual)</option>
                          {sessionTypeSettings?.inPerson && (
                            <option value="in_person">📍 In-Person (Same LGA)</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setNewSessionModalOpen(false)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-5 py-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold shadow-xs"
                      >
                        Add to Schedule
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Modal: Preferred Meeting Times & Availability Configuration */}
          <AnimatePresence>
            {availabilityModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl border border-slate-100 space-y-5 font-sans"
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#0F5338]" />
                        <h3 className="font-bold text-base text-slate-900">Set Preferred Meeting Times</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Students can only book sessions during these scheduled slots.</p>
                    </div>
                    <button onClick={() => setAvailabilityModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Day Picker Pills */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Select Day of Week</label>
                    <div className="grid grid-cols-7 gap-1.5">
                      {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setActiveSlotDay(day)}
                          className={cn(
                            "py-2 rounded-xl text-xs font-bold transition-all",
                            activeSlotDay === day 
                              ? "bg-[#0F5338] text-white shadow-xs" 
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {day}
                          <span className="block text-[9px] font-normal opacity-80">
                            {(preferredSlots[day] || []).length} slots
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Configured Slots for Active Day */}
                  <div className="p-4 bg-[#FBF9F4] rounded-2xl border border-[#E8E3D7] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Bookable Slots for {activeSlotDay}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Live on Student Booking
                      </span>
                    </div>

                    {(preferredSlots[activeSlotDay] || []).length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center">No meeting slots set for {activeSlotDay}. Add below.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {(preferredSlots[activeSlotDay] || []).map((slot, idx) => (
                          <div 
                            key={idx}
                            className="bg-white border border-[#E8E3D7] rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-bold text-slate-800 shadow-2xs"
                          >
                            <span>{slot}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSlot(activeSlotDay, slot)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-0.5 rounded"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add new time slot picker */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                      <select
                        value={newSlotTime}
                        onChange={(e) => setNewSlotTime(e.target.value)}
                        className="bg-white border border-[#E8E3D7] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0F5338]"
                      >
                        {['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddSlot}
                        className="px-4 py-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Slot</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setAvailabilityModalOpen(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Close
                    </button>
                    <button 
                      type="button"
                      onClick={handleSavePreferredTimes}
                      className="px-5 py-2 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      Save Preferred Times
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* ========================================================================= */
        /* STUDENT SESSIONS VIEW */
        /* ========================================================================= */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">My schedule</p>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141E18] tracking-tight">
                Sessions
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                Manage upcoming lessons, review history, and join live HD classrooms.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Google Calendar Connect for Student */}
              <button
                type="button"
                onClick={handleToggleGoogleCalendar}
                className={cn(
                  "px-4 py-2.5 rounded-full border text-xs font-semibold transition-all flex items-center gap-2 active:scale-95 shadow-2xs",
                  googleConnected
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                )}
                title={googleConnected ? `Synced with ${googleAccount}` : "Connect Google Calendar"}
              >
                <GoogleLogo className="w-4 h-4" />
                <span>{googleConnected ? 'G-Cal Synced ✓' : 'Connect Google Calendar'}</span>
              </button>

              <Link
                to="/tutors"
                className="bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-full px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Book a new session</span>
              </Link>
            </div>
          </div>

          {/* Filter tabs & Timeframe switcher */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3 border-b border-[#E8E3D7] pb-3">
            {/* Status pills & Format filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200">
                {[
                  { id: 'upcoming', label: 'Upcoming' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'all', label: 'All sessions' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStudentFilter(tab.id as any)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold transition-all",
                      studentFilter === tab.id
                        ? "bg-[#0F5338] text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-200/60"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Format pills: 1-on-1 vs Group */}
              <div className="flex items-center gap-1.5 bg-[#FBF9F4] p-1 rounded-full border border-[#E8E3D7]">
                {[
                  { id: 'all', label: 'All Formats' },
                  { id: '1on1', label: '📹 1-on-1' },
                  { id: 'group', label: '👥 Group' }
                ].map(fmt => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setStudentFormatFilter(fmt.id as any)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold transition-all",
                      studentFormatFilter === fmt.id
                        ? fmt.id === 'group'
                          ? "bg-[#1E3A5F] text-white shadow-xs"
                          : "bg-[#0F5338] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Day / Week / Month Timeframe Switcher */}
            <div className="bg-slate-100 p-1 rounded-full flex items-center border border-slate-200">
              {[
                { id: 'day', label: 'Today' },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: 'all', label: 'All Time' }
              ].map(tf => (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => setStudentTimeframe(tf.id as any)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold transition-all",
                    studentTimeframe === tf.id
                      ? "bg-[#0F5338] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Student Session Cards */}
          <div className="space-y-3">
            {(() => {
              const defaultStudentSessions = [
                { id: 'DS-1', month: "Aug", day: "20", title: "Calculus — Integration by parts", person: "Daniel Okafor", time: "Today · 4:30 PM", duration: "60 min", status: "upcoming", price: "₦3,500", timeframe: 'day', type: '1on1' },
                { id: 'DS-2', month: "Aug", day: "21", title: "Spanish conversation practice", person: "Adaeze Nwosu", time: "Tomorrow · 6:00 PM", duration: "45 min", status: "upcoming", price: "₦2,800", timeframe: 'week', type: 'group' },
                { id: 'DS-3', month: "Aug", day: "23", title: "Physics — Quantum basics", person: "Dr. Ibrahim Sanni", time: "Friday · 5:15 PM", duration: "60 min", status: "upcoming", price: "₦4,500", timeframe: 'week', type: '1on1' },
                { id: 'DS-4', month: "Jul", day: "28", title: "Organic Chemistry Revision", person: "Chinwe Uche", time: "Jul 28 · 2:00 PM", duration: "60 min", status: "completed", price: "₦3,000", timeframe: 'month', type: 'group' }
              ];

              const parsedBookings = userBookedSessions.map((b: any) => {
                const parts = (b.date || '').split(' ');
                const day = parts[0] || '20';
                const month = parts[1] || 'Aug';
                const isGroup = b.type === 'group' || (b.format && b.format.toLowerCase().includes('group')) || (b.sessionType === 'group');

                return {
                  id: b.id,
                  month: month,
                  day: day,
                  title: `${b.subject} Lesson`,
                  person: b.tutorName,
                  time: `${b.date} · ${b.time}`,
                  duration: b.duration || '60 min',
                  status: (b.status || 'upcoming').toLowerCase(),
                  price: `₦${Number(b.price || 3500).toLocaleString()}`,
                  timeframe: 'week',
                  type: isGroup ? 'group' : '1on1',
                  isNew: true
                };
              });

              const allStudentSessions = [...parsedBookings, ...defaultStudentSessions];
              const filtered = allStudentSessions.filter(s => {
                const matchesStatus = studentFilter === 'all' || s.status === studentFilter;
                const matchesFormat = studentFormatFilter === 'all' || s.type === studentFormatFilter;
                const matchesTf = studentTimeframe === 'all' 
                  ? true 
                  : studentTimeframe === 'day' 
                  ? s.timeframe === 'day' || s.time.toLowerCase().includes('today')
                  : studentTimeframe === 'week'
                  ? s.timeframe === 'day' || s.timeframe === 'week' || s.time.toLowerCase().includes('tomorrow') || s.time.toLowerCase().includes('today') || s.time.toLowerCase().includes('friday')
                  : true; // month matches all current month

                return matchesStatus && matchesFormat && matchesTf;
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-white rounded-2xl border border-[#E8E3D7] p-8 text-center text-slate-400 text-xs">
                    No {studentFilter} {studentFormatFilter !== 'all' ? (studentFormatFilter === 'group' ? 'Group' : '1-on-1') : ''} sessions found.
                  </div>
                );
              }

              return filtered.map(session => {
                const isGroup = session.type === 'group';
                const access = calculateSessionAccess(session);

                return (
                  <div
                    key={session.id}
                    className={cn(
                      "bg-white rounded-2xl border p-4 sm:p-5 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-all",
                      isGroup 
                        ? "border-[#CBDFF2] bg-[#F7FAFD]/70 hover:border-[#1E3A5F]/40"
                        : (session as any).isNew 
                        ? "border-emerald-300 bg-emerald-50/20 hover:border-[#0F5338]/40" 
                        : "border-[#E8E3D7] hover:border-[#0F5338]/40"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border shadow-2xs",
                        isGroup 
                          ? "bg-[#EBF3FA] text-[#1E3A5F] border-[#CBDFF2]" 
                          : "bg-[#EAF5EE] text-[#0F5338] border-[#D5EADB]"
                      )}>
                        <span className="text-[10px] font-bold uppercase">{session.month}</span>
                        <span className="text-base font-extrabold leading-none">{session.day}</span>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900">{session.title}</h3>
                          
                          {/* Distinctive Group (Ink Navy) vs 1-on-1 (Forest Green) Badge */}
                          {isGroup ? (
                            <span className="px-2.5 py-0.5 bg-[#EBF3FA] text-[#1E3A5F] border border-[#CBDFF2] text-[10px] font-bold uppercase rounded-full tracking-wider flex items-center gap-1 shadow-2xs">
                              <Users className="w-3 h-3 text-[#1E3A5F]" />
                              Group (Max 8)
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase rounded-full tracking-wider flex items-center gap-1 shadow-2xs">
                              <Video className="w-3 h-3 text-emerald-600" />
                              1-on-1 Session
                            </span>
                          )}

                          {/* Access Timing Badge (Live / Lobby Open / Locked) */}
                          <span className={cn("text-[9px] px-2 py-0.5 rounded-full border", access.badgeStyle)}>
                            {access.badgeText}
                          </span>

                          {(session as any).isNew && (
                            <span className="px-2 py-0.5 bg-[#0F5338] text-white text-[9px] font-black uppercase rounded-full tracking-wider shadow-2xs">
                              Newly Booked
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          with <span className="font-semibold text-slate-800">{session.person}</span> · {session.time} ({session.duration}) · <span className={cn("font-bold", isGroup ? "text-[#1E3A5F]" : "text-[#0F5338]")}>{isGroup ? '👥 Group Virtual Meeting' : '📹 1:1 Private Virtual'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <span className="text-sm font-mono font-bold text-slate-900">{session.price}</span>
                      
                      {/* Add to Google Calendar Button */}
                      <a
                        href={getGoogleCalendarUrl({
                          id: session.id,
                          title: session.title,
                          student: (session as any).student,
                          tutor: session.person || (session as any).tutor,
                          timeDisplay: session.time
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                        title="Add this lesson event to your Google Calendar"
                      >
                        <GoogleLogo className="w-3.5 h-3.5" />
                        <span>Add to G-Cal</span>
                      </a>

                      {/* Lesson Notes Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedNoteSession(session);
                          setIsNoteTutorMode(false);
                        }}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                        title="View tutor summary, formula cheat sheet & assigned homework"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#0F5338]" />
                        <span>Lesson Notes</span>
                      </button>

                      {session.status === 'completed' ? (
                        <Link
                          to={`/dashboard/recordings`}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold flex items-center gap-1 transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Replay</span>
                        </Link>
                      ) : access.isAccessible ? (
                        <Link
                          to={`/classroom/${session.id}`}
                          className={cn(
                            "px-4 py-2 text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all active:scale-95",
                            isGroup ? "bg-[#1E3A5F] hover:bg-[#152943]" : "bg-[#0F5338] hover:bg-[#0A3D29]"
                          )}
                        >
                          {isGroup ? <Users className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                          <span>{access.buttonText}</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setLobbyModalSession(session);
                            setLobbyModalAccessResult(access);
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold shadow-2xs border border-slate-200 flex items-center gap-1.5 transition-all active:scale-95"
                          title={access.lockReason}
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{access.buttonText}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Interactive Lesson Notes & Homework Modal (Tutor Upload / Student View) */}
      <LessonNotesModal
        isOpen={!!selectedNoteSession}
        onClose={() => setSelectedNoteSession(null)}
        session={selectedNoteSession}
        isTutorMode={isNoteTutorMode}
      />

      {/* Google Calendar OAuth Permission Consent Modal */}
      <GoogleAuthModal
        isOpen={isGoogleCalendarModalOpen}
        onClose={() => setIsGoogleCalendarModalOpen(false)}
        mode="calendar_connect"
        onSuccess={handleGoogleCalendarAuthSuccess}
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
