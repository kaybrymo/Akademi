import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Lock, 
  Clock, 
  Calendar, 
  Video, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Mic,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getGoogleCalendarUrl } from '@/pages/dashboard/Sessions';
import { type SessionAccessResult } from '@/lib/sessionAccess';
import { GoogleLogo } from '@/components/ui/GoogleAuthModal';

export interface ClassroomLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: {
    id: string | number;
    title: string;
    person?: string;
    student?: string;
    tutor?: string;
    timeDisplay?: string;
    time?: string;
    duration?: string;
    type?: string;
  };
  accessResult: {
    isAccessible: boolean;
    status: string;
    lockReason?: string;
    scheduledTimeDisplay: string;
    unlockTimeDisplay: string;
    startsInText: string;
    startsInMinutes: number;
    canAdminBypass?: boolean;
  };
  onAdminUnlock?: () => void;
}

export default function ClassroomLobbyModal({
  isOpen,
  onClose,
  session,
  accessResult,
  onAdminUnlock
}: ClassroomLobbyModalProps) {
  const navigate = useNavigate();
  const [currentUser] = useState<{ role?: string }>(() => {
    try {
      const saved = localStorage.getItem('akademi_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { role: 'student' };
  });

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';

  // Live active countdown timer (ticking every 1 second)
  const [secondsRemaining, setSecondsRemaining] = React.useState(() => {
    const mins = accessResult.startsInMinutes > 0 ? accessResult.startsInMinutes : 5;
    return mins * 60;
  });

  React.useEffect(() => {
    if (!isOpen) return;
    const initialSecs = (accessResult.startsInMinutes > 0 ? accessResult.startsInMinutes : 5) * 60;
    setSecondsRemaining(initialSecs);

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, accessResult.startsInMinutes]);

  if (!isOpen) return null;

  const formatCountdown = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n: number) => String(n).padStart(2, '0');

    if (hours > 0) {
      return `${hours}h ${pad(mins)}m ${pad(secs)}s`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const isNowUnlocked = secondsRemaining === 0;

  const handleBypassAndEnter = () => {
    if (onAdminUnlock) onAdminUnlock();
    try {
      const existing = JSON.parse(localStorage.getItem('akademi_admin_unlocked_sessions') || '[]');
      if (!existing.includes(session.id)) {
        localStorage.setItem('akademi_admin_unlocked_sessions', JSON.stringify([...existing, session.id]));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) {}
    onClose();
    navigate(`/classroom/${session.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-100 relative text-slate-900 space-y-5"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
            <Lock className="w-7 h-7" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-950 font-bold text-[10px] uppercase tracking-wider border border-amber-300">
            Lobby Currently Locked
          </span>

          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-slate-900">
            {session.title || 'Scheduled Session'}
          </h2>

          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Meeting rooms activate strictly <strong>5 minutes before start time</strong> to ensure tutors and students are ready simultaneously.
          </p>
        </div>

        {/* Session Timing & Status Details */}
        <div className="p-4 rounded-2xl bg-[#FBF9F4] border border-[#E8E3D7] space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-[#E8E3D7]/60 pb-2">
            <span className="text-slate-500 font-medium">Scheduled Time</span>
            <strong className="text-slate-900 font-bold">{accessResult.scheduledTimeDisplay}</strong>
          </div>

          <div className="flex items-center justify-between border-b border-[#E8E3D7]/60 pb-2">
            <span className="text-slate-500 font-medium">Lobby Unlocks At</span>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {accessResult.unlockTimeDisplay}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Live Countdown</span>
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-mono font-black text-sm px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors",
                isNowUnlocked
                  ? "bg-emerald-100 text-emerald-950 border-emerald-300 animate-bounce"
                  : "bg-amber-100 text-amber-950 border-amber-300"
              )}>
                <span className={cn("w-2 h-2 rounded-full", isNowUnlocked ? "bg-emerald-500" : "bg-amber-500 animate-ping")} />
                {isNowUnlocked ? 'LOBBY OPEN!' : formatCountdown(secondsRemaining)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#E8E3D7]/60 pt-2 text-[11px]">
            <span className="text-slate-500 font-medium">Direct Meeting Link</span>
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

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {/* Instant Enter when Unlocked */}
          {isNowUnlocked ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/classroom/${session.id}`);
              }}
              className="w-full py-3 px-4 bg-[#0F5338] hover:bg-[#0A3D29] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md animate-pulse"
            >
              <Video className="w-4 h-4" />
              <span>🎉 Lobby Unlocked — Enter Classroom Now!</span>
            </button>
          ) : null}
          {/* Add to Google Calendar Action */}
          <a
            href={getGoogleCalendarUrl({
              id: session.id,
              title: session.title,
              student: session.student,
              tutor: session.person || session.tutor,
              timeDisplay: session.timeDisplay || session.time
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <GoogleLogo className="w-4 h-4" />
            <span>Add Calendar Reminder (Google)</span>
          </a>

          {/* Super Admin Override Button */}
          {isAdmin && (
            <button
              type="button"
              onClick={handleBypassAndEnter}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Zap className="w-4 h-4" />
              <span>Super Admin Override: Enter Classroom Now</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
