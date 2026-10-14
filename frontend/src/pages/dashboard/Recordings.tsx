import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Calendar, 
  Download, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  X, 
  Sparkles, 
  Lock, 
  Database,
  RefreshCw,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Recording {
  id: number;
  title: string;
  tutor: string;
  tutorInitials: string;
  subject: string;
  date: string;
  duration: string;
  sizeMb: number;
  daysRemaining: number;
  isKept: boolean;
  monthlyFee: number;
  videoUrl: string;
  attendees: string[];
  color: string;
}

const initialRecordings: Recording[] = [
  {
    id: 1,
    title: 'Calculus — Integration by parts & substitution',
    tutor: 'Daniel Okafor',
    tutorInitials: 'DO',
    subject: 'Mathematics',
    date: 'Jun 9, 2026',
    duration: '58 min',
    sizeMb: 240,
    daysRemaining: 7, // 7 days of free 10-day window left
    isKept: false,
    monthlyFee: 1500,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    attendees: ['Chiamaka (You)', 'Daniel Okafor'],
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 2,
    title: 'Spanish conversation drill & verb conjugations',
    tutor: 'Adaeze Nwosu',
    tutorInitials: 'AN',
    subject: 'Languages',
    date: 'Jun 7, 2026',
    duration: '44 min',
    sizeMb: 180,
    daysRemaining: 5,
    isKept: false,
    monthlyFee: 1500,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    attendees: ['Chiamaka (You)', 'Adaeze Nwosu'],
    color: 'bg-rose-100 text-rose-700'
  },
  {
    id: 3,
    title: 'Physics — Quantum mechanics and wave packets',
    tutor: 'Dr. Ibrahim Sanni',
    tutorInitials: 'IS',
    subject: 'Sciences',
    date: 'May 28, 2026',
    duration: '62 min',
    sizeMb: 310,
    daysRemaining: 9999,
    isKept: true, // Retained under extended billing
    monthlyFee: 1500,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    attendees: ['Chiamaka (You)', 'Dr. Ibrahim Sanni'],
    color: 'bg-indigo-100 text-indigo-700'
  },
  {
    id: 4,
    title: 'Essay structure & thesis development workshop',
    tutor: 'Adaeze Nwosu',
    tutorInitials: 'AN',
    subject: 'Languages',
    date: 'Jun 1, 2026',
    duration: '32 min',
    sizeMb: 130,
    daysRemaining: 2, // Expiring soon
    isKept: false,
    monthlyFee: 1500,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    attendees: ['Chiamaka (You)', 'Adaeze Nwosu'],
    color: 'bg-amber-100 text-amber-700'
  }
];

export default function Recordings() {
  const [recordings, setRecordings] = useState<Recording[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_recordings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialRecordings;
  });

  const [activeFilter, setActiveFilter] = useState<'All' | 'Free 10-Day' | 'Extended' | 'Expiring Soon'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedPlayback, setSelectedPlayback] = useState<Recording | null>(null);
  const [keepModalRecording, setKeepModalRecording] = useState<Recording | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const saveRecordings = (updated: Recording[]) => {
    setRecordings(updated);
    localStorage.setItem('akademi_recordings', JSON.stringify(updated));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmKeep = () => {
    if (!keepModalRecording) return;
    
    // Deduct ₦1,500 monthly fee from wallet
    let currentBal = 142500;
    try {
      const savedBal = localStorage.getItem('akademi_wallet_balance_ngn');
      if (savedBal) currentBal = Number(savedBal);
    } catch (e) {}
    const newBal = Math.max(0, currentBal - keepModalRecording.monthlyFee);
    localStorage.setItem('akademi_wallet_balance_ngn', String(newBal));

    const updated = recordings.map(r => {
      if (r.id === keepModalRecording.id) {
        return { ...r, isKept: true, daysRemaining: 9999 };
      }
      return r;
    });

    saveRecordings(updated);
    showToast(`"${keepModalRecording.title}" extended! Storage fee (₦1,500/mo) billed to wallet.`);
    setKeepModalRecording(null);
  };

  const handleDelete = (id: number) => {
    const target = recordings.find(r => r.id === id);
    const updated = recordings.filter(r => r.id !== id);
    saveRecordings(updated);
    showToast(`Recording "${target?.title}" deleted from replay vault.`);
  };

  const filteredRecordings = recordings.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      activeFilter === 'All' ? true :
      activeFilter === 'Free 10-Day' ? !r.isKept :
      activeFilter === 'Extended' ? r.isKept :
      r.daysRemaining <= 3 && !r.isKept;

    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-6xl font-sans pb-12"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 text-xs font-semibold"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner with Policy Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" /> 10-Day Secure Replay Vault
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Session Recordings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Replays are available for 10 days for session attendees only. Extend retention beyond 10 days to keep indefinitely.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search recordings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Retention Policy Callout Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg shrink-0">
            10d
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Automatic 10-Day Free Retention</h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Recordings are private to verified classroom attendees. Extend storage for ₦1,500/month or download offline archives.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-1">
        {(['All', 'Free 10-Day', 'Extended', 'Expiring Soon'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border",
              activeFilter === tab
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Recordings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRecordings.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            No recordings match your filter.
          </div>
        ) : (
          filteredRecordings.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Top Video Header */}
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {rec.subject}
                  </span>

                  {rec.isKept ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <Database className="h-3 w-3" /> Extended Storage (₦{rec.monthlyFee}/mo)
                    </span>
                  ) : rec.daysRemaining <= 3 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full animate-pulse">
                      <AlertTriangle className="h-3 w-3" /> Expires in {rec.daysRemaining} days
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      <Clock className="h-3 w-3" /> {rec.daysRemaining} days left of 10-day free window
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug">{rec.title}</h3>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <span className="font-medium text-slate-800">{rec.tutor}</span>
                  <span>·</span>
                  <span>{rec.date}</span>
                  <span>·</span>
                  <span>{rec.duration}</span>
                  <span>·</span>
                  <span>{rec.sizeMb} MB</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Access restricted to session attendees</span>
                  </div>
                  <span className="font-bold text-slate-800">{rec.attendees.length} Members</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 border-t border-slate-200 bg-slate-50 divide-x divide-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setSelectedPlayback(rec)}
                  className="py-3 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="h-4 w-4 fill-current" /> Replay
                </button>

                {!rec.isKept ? (
                  <button
                    onClick={() => setKeepModalRecording(rec)}
                    className="py-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Keep Beyond 10d
                  </button>
                ) : (
                  <span className="py-3 text-emerald-700 bg-emerald-50/50 flex items-center justify-center gap-1 text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Extended
                  </span>
                )}

                <button
                  onClick={() => handleDelete(rec.id)}
                  className="py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Video Replay Modal */}
      <AnimatePresence>
        {selectedPlayback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              onClick={() => setSelectedPlayback(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-slate-900 text-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-800"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedPlayback.title}</h3>
                  <p className="text-xs text-slate-400">Taught by {selectedPlayback.tutor} · {selectedPlayback.date}</p>
                </div>
                <button onClick={() => setSelectedPlayback(null)} className="text-slate-400 hover:text-white p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Video Player */}
              <div className="aspect-video bg-black flex items-center justify-center relative">
                <video 
                  controls 
                  autoPlay
                  src={selectedPlayback.videoUrl} 
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-4 bg-slate-950 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="h-4 w-4" /> Verified Classroom Attendee
                </span>
                <button 
                  onClick={() => showToast('Downloading MP4 session recording...')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> Download MP4 ({selectedPlayback.sizeMb} MB)
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Keep Beyond 10 Days Modal */}
        {keepModalRecording && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setKeepModalRecording(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6 border border-slate-200"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Database className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-bold text-center mb-2">Retain Recording Beyond 10 Days?</h3>
              <p className="text-xs text-slate-600 text-center mb-5 leading-relaxed">
                By default, session recordings are stored free for 10 days. Extending this recording subscribes it to the platform's extended vault storage plan.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 mb-6 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Session:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[200px]">{keepModalRecording.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Storage Size:</span>
                  <span className="font-semibold text-slate-900">{keepModalRecording.sizeMb} MB</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                  <span className="text-slate-900">Monthly Storage Fee:</span>
                  <span className="text-emerald-600">₦{keepModalRecording.monthlyFee.toLocaleString()}/month</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Billed automatically from wallet balance on a monthly basis.</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setKeepModalRecording(null)}
                  className="flex-1 py-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmKeep}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Confirm & Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
