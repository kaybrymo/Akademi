import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Users, 
  Search, 
  X,
  Play,
  CalendarCheck,
  Lock,
  Zap,
  CheckCircle2,
  Plus,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateSessionAccess } from '@/lib/sessionAccess';

interface SessionItem {
  id: number;
  title: string;
  student: string;
  tutor: string;
  date: string;
  time: string;
  duration: string;
  type: '1:1' | 'Group';
  status: 'Live' | 'Upcoming' | 'Completed' | 'Cancelled';
  roomUrl?: string;
}

const initialSessions: SessionItem[] = [
  { id: 1, title: 'Calculus Fundamentals', student: 'Chioma Adeyemi', tutor: 'Dr. Ibrahim Musa', date: 'Today', time: '2:00 PM', duration: '60 min', type: '1:1', status: 'Live' },
  { id: 2, title: 'Physics Exam Prep', student: 'Oluwaseun Ojo', tutor: 'Sarah Okafor', date: 'Today', time: '4:30 PM', duration: '90 min', type: '1:1', status: 'Upcoming' },
  { id: 3, title: 'Organic Chemistry Basics', student: 'Cohort Alpha (5 students)', tutor: 'Chinedu Eze', date: 'Tomorrow', time: '10:00 AM', duration: '90 min', type: 'Group', status: 'Upcoming' },
  { id: 4, title: 'English Essay Writing', student: 'Emeka Uzo', tutor: 'David Osei', date: 'Yesterday', time: '1:00 PM', duration: '60 min', type: '1:1', status: 'Completed' },
  { id: 5, title: 'Biology Revision', student: 'Ngozi Okoro', tutor: 'Grace Etim', date: 'Oct 24', time: '3:00 PM', duration: '60 min', type: '1:1', status: 'Cancelled' },
  { id: 6, title: 'Further Math Masterclass', student: 'Exam Intensive (12 students)', tutor: 'Dr. Ibrahim Musa', date: 'Oct 25', time: '5:00 PM', duration: '120 min', type: 'Group', status: 'Upcoming' },
  { id: 7, title: 'French Conversation Practice', student: 'Aisha Bello', tutor: 'Marie Claire', date: 'Today', time: '11:00 AM', duration: '45 min', type: '1:1', status: 'Completed' },
  { id: 8, title: 'Accounting & Bookkeeping', student: 'Tobi Bakre', tutor: 'David Osei', date: 'Today', time: '2:15 PM', duration: '60 min', type: '1:1', status: 'Live' },
];

export default function AdminSessions() {
  const [sessions, setSessions] = useState<SessionItem[]>(initialSessions);
  const [activeTab, setActiveTab] = useState<'All' | 'Live' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');
  const [timeframe, setTimeframe] = useState<'all' | 'day' | 'week' | 'month'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newSession, setNewSession] = useState({
    title: '',
    student: '',
    tutor: 'Dr. Ibrahim Musa',
    date: 'Today',
    time: '3:00 PM',
    duration: '60 min',
    type: '1:1' as '1:1' | 'Group',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCancelSession = (id: number) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, status: 'Cancelled' } : s));
    showToast('Session marked as cancelled.');
  };

  const handleMarkCompleted = (id: number) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, status: 'Completed' } : s));
    showToast('Session marked as completed.');
  };

  const handleUnlockLobby = (id: number) => {
    try {
      const existing = JSON.parse(localStorage.getItem('akademi_admin_unlocked_sessions') || '[]');
      if (!existing.includes(id)) {
        localStorage.setItem('akademi_admin_unlocked_sessions', JSON.stringify([...existing, id]));
        window.dispatchEvent(new Event('storage'));
      }
      showToast(`⚡ Super Admin Override: Lobby for Session #${id} unlocked for student & tutor!`);
    } catch (e) {}
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSession.title.trim() || !newSession.student.trim()) return;

    const created: SessionItem = {
      id: Date.now(),
      title: newSession.title,
      student: newSession.student,
      tutor: newSession.tutor,
      date: newSession.date,
      time: newSession.time,
      duration: newSession.duration,
      type: newSession.type,
      status: 'Upcoming',
    };

    setSessions([created, ...sessions]);
    setShowAddModal(false);
    setNewSession({
      title: '',
      student: '',
      tutor: 'Dr. Ibrahim Musa',
      date: 'Today',
      time: '3:00 PM',
      duration: '60 min',
      type: '1:1',
    });
    showToast('New session scheduled successfully.');
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesTab = activeTab === 'All' || s.status === activeTab;
    const matchesSearch = 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tutor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTf = timeframe === 'all' 
      ? true 
      : timeframe === 'day' 
      ? s.date.toLowerCase().includes('today')
      : timeframe === 'week'
      ? s.date.toLowerCase().includes('today') || s.date.toLowerCase().includes('tomorrow') || s.date.toLowerCase().includes('yesterday')
      : true;

    return matchesTab && matchesSearch && matchesTf;
  });

  const stats = [
    { label: 'Upcoming', value: sessions.filter(s => s.status === 'Upcoming').length, color: 'text-blue-600', pulse: false },
    { label: 'Live Now', value: sessions.filter(s => s.status === 'Live').length, color: 'text-emerald-600', pulse: true },
    { label: 'Completed', value: sessions.filter(s => s.status === 'Completed').length, color: 'text-slate-900', pulse: false },
    { label: 'Cancelled', value: sessions.filter(s => s.status === 'Cancelled').length, color: 'text-red-600', pulse: false },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Session Supervision</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor live classrooms, scheduled lessons, and attendance</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search session, student, tutor..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-sm whitespace-nowrap gap-2"
          >
            <Plus className="h-4 w-4" />
            Schedule Session
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              {stat.pulse && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              )}
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
            <p className={cn("text-3xl font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs & Timeframe Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {/* Status Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-1">
          {(['All', 'Live', 'Upcoming', 'Completed', 'Cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border",
                activeTab === tab
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Day / Week / Month Timeframe Switcher */}
        <div className="bg-slate-100 p-1 rounded-full flex items-center border border-slate-200 shrink-0">
          {[
            { id: 'day', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'all', label: 'All Time' }
          ].map(tf => (
            <button
              key={tf.id}
              type="button"
              onClick={() => setTimeframe(tf.id as any)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-all",
                timeframe === tf.id
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Session Details</th>
                <th className="px-6 py-4">Participants</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Format</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    No sessions match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/50 group transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 mb-0.5">{session.title}</div>
                      <div className="flex items-center text-xs text-slate-500 gap-1.5">
                        <Video className="h-3.5 w-3.5 text-emerald-600" /> Akademi HD Classroom
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{session.student}</div>
                      <div className="text-xs text-slate-500">Tutor: {session.tutor}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{session.date}</div>
                      <div className="flex items-center text-xs text-slate-500 gap-2 mt-0.5">
                        <span>{session.time}</span>
                        <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {session.duration}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold",
                        session.type === 'Group' ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"
                      )}>
                        {session.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const access = calculateSessionAccess({
                          id: session.id,
                          timeDisplay: `${session.date} · ${session.time}`,
                          status: session.status.toLowerCase()
                        });

                        return (
                          <div className="space-y-1">
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                              session.status === 'Live' ? "bg-emerald-100 text-emerald-700 animate-pulse" :
                              session.status === 'Upcoming' ? "bg-blue-100 text-blue-700" :
                              session.status === 'Completed' ? "bg-slate-100 text-slate-700" :
                              "bg-red-100 text-red-700"
                            )}>
                              {session.status}
                            </span>
                            {session.status === 'Upcoming' && (
                              <span className={cn("block text-[10px] px-2 py-0.2 rounded border font-medium", access.badgeStyle)}>
                                {access.badgeText}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {session.status === 'Upcoming' && (
                          <button
                            type="button"
                            onClick={() => handleUnlockLobby(session.id)}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs active:scale-95"
                            title="Manually unlock classroom lobby now for students and tutor"
                          >
                            <Zap className="h-3 w-3 text-amber-600" /> Unlock Lobby
                          </button>
                        )}
                        <Link 
                          to={`/classroom/${session.id}`}
                          className="px-3 py-1.5 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          <Play className="h-3 w-3 fill-current" /> Supervise Room
                        </Link>
                        {session.status === 'Upcoming' && (
                          <button 
                            onClick={() => handleCancelSession(session.id)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg text-xs font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        {session.status === 'Live' && (
                          <button 
                            onClick={() => handleMarkCompleted(session.id)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            End Session
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Session Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900">Schedule Tutoring Session</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddSession} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Session Subject & Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. A-Level Physics Mechanics Revision" 
                    value={newSession.title}
                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Student / Cohort Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Babatunde Lawal" 
                    value={newSession.student}
                    onChange={(e) => setNewSession({ ...newSession, student: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Assigned Tutor</label>
                  <select 
                    value={newSession.tutor}
                    onChange={(e) => setNewSession({ ...newSession, tutor: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Dr. Ibrahim Musa">Dr. Ibrahim Musa (Mathematics)</option>
                    <option value="Sarah Okafor">Sarah Okafor (Physics)</option>
                    <option value="David Osei">David Osei (Economics)</option>
                    <option value="Marie Claire">Marie Claire (French)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Date</label>
                    <input 
                      type="text" 
                      value={newSession.date}
                      onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Time</label>
                    <input 
                      type="text" 
                      value={newSession.time}
                      onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Duration</label>
                    <select 
                      value={newSession.duration}
                      onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="30 min">30 minutes</option>
                      <option value="45 min">45 minutes</option>
                      <option value="60 min">60 minutes</option>
                      <option value="90 min">90 minutes</option>
                      <option value="120 min">120 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Session Type</label>
                    <select 
                      value={newSession.type}
                      onChange={(e) => setNewSession({ ...newSession, type: e.target.value as any })}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="1:1">1-on-1 Lesson</option>
                      <option value="Group">Group Session</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)} 
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    Create Session
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
