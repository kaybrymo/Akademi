/**
 * Universal Classroom Session Access & Lobby Timing Engine
 * Controls when meeting links unlock and provides Super Admin overrides
 */

export interface SessionAccessConfig {
  leadMinutes: number; // e.g. 5 minutes before scheduled start
  graceMinutes: number; // e.g. 30 minutes after scheduled end
  bypassLock: boolean; // Super admin global testing override
  unlockedSessions: (string | number)[]; // Specific session IDs manually unlocked by admin
}

export interface SessionAccessResult {
  isAccessible: boolean;
  status: 'live_now' | 'lobby_open' | 'locked_future' | 'completed' | 'admin_override';
  badgeText: string;
  buttonText: string;
  badgeStyle: string;
  lockReason?: string;
  scheduledTimeDisplay: string;
  unlockTimeDisplay: string;
  startsInText: string;
  startsInMinutes: number;
  canAdminBypass: boolean;
}

export function getSessionAccessConfig(): SessionAccessConfig {
  let leadMinutes = 5;
  let graceMinutes = 30;
  let bypassLock = false;
  let unlockedSessions: (string | number)[] = [];

  try {
    const savedLead = localStorage.getItem('akademi_admin_lobby_lead_minutes');
    if (savedLead !== null) leadMinutes = Number(savedLead);

    const savedGrace = localStorage.getItem('akademi_admin_lobby_grace_minutes');
    if (savedGrace !== null) graceMinutes = Number(savedGrace);

    const savedBypass = localStorage.getItem('akademi_admin_bypass_lobby_lock');
    if (savedBypass !== null) bypassLock = savedBypass === 'true';

    const savedUnlocked = localStorage.getItem('akademi_admin_unlocked_sessions');
    if (savedUnlocked) unlockedSessions = JSON.parse(savedUnlocked);
  } catch (e) {}

  return { leadMinutes, graceMinutes, bypassLock, unlockedSessions };
}

export function calculateSessionAccess(session: {
  id: string | number;
  timeDisplay?: string;
  time?: string;
  dateStr?: string;
  status?: string;
  isLive?: boolean;
  startHour?: number;
  startMinute?: number;
  durationMinutes?: number;
  dayIndex?: number;
  type?: string;
}): SessionAccessResult {
  const config = getSessionAccessConfig();
  const rawStatus = (session.status || '').toLowerCase();
  const timeStr = session.timeDisplay || session.time || '';
  const lowerTime = timeStr.toLowerCase();

  // 1. If session is already completed or cancelled
  if (rawStatus === 'completed') {
    return {
      isAccessible: false,
      status: 'completed',
      badgeText: 'Completed',
      buttonText: 'View Notes / Replay',
      badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
      scheduledTimeDisplay: timeStr || 'Past Session',
      unlockTimeDisplay: 'Session Ended',
      startsInText: 'Ended',
      startsInMinutes: -999,
      canAdminBypass: false
    };
  }

  // 2. If Super Admin enabled Global Bypass OR manually unlocked this specific session
  const isManuallyUnlocked = config.unlockedSessions.some(id => String(id) === String(session.id));
  if (config.bypassLock || isManuallyUnlocked) {
    return {
      isAccessible: true,
      status: 'admin_override',
      badgeText: 'Admin Unlocked ⚡',
      buttonText: 'Join Classroom (Override)',
      badgeStyle: 'bg-amber-100 text-amber-950 border-amber-300 font-bold',
      scheduledTimeDisplay: timeStr || 'Scheduled Time',
      unlockTimeDisplay: 'Unlocked by Administrator',
      startsInText: 'Available Now',
      startsInMinutes: 0,
      canAdminBypass: true
    };
  }

  // 3. If marked explicitly as Live / Ongoing
  if (session.isLive || rawStatus === 'live' || rawStatus === 'ongoing') {
    return {
      isAccessible: true,
      status: 'live_now',
      badgeText: '🟢 Live Now',
      buttonText: 'Join Class Now',
      badgeStyle: 'bg-emerald-100 text-emerald-950 border-emerald-300 animate-pulse font-bold',
      scheduledTimeDisplay: timeStr || 'In Progress',
      unlockTimeDisplay: 'Lobby Open',
      startsInText: 'Class in session',
      startsInMinutes: 0,
      canAdminBypass: true
    };
  }

  // 4. Time Window Evaluation based on Demo Schedule Rules:
  // - If scheduled for "Today · 4:30 PM" (or session 101 / today's first slot):
  //   We simulate that it's within the early-access lobby window (e.g. 3 mins to start).
  // - If scheduled for "Tomorrow" / "Friday" / "Aug 21" / later today:
  //   It is strictly locked until the lead time before that meeting.

  let isWithinLobbyWindow = false;
  let startsInMinutes = 45; // default future distance
  let scheduledTimeDisplay = timeStr;
  let unlockTimeDisplay = `5 min before start`;

  if (lowerTime.includes('today · 4:30') || lowerTime.includes('today 4:30') || String(session.id) === '1' || String(session.id) === 'DS-1' || String(session.id) === '101') {
    // This is the active demo session for Today 4:30 PM:
    // If admin lead time is >= 5, it is in lobby window (starts in 3 minutes)
    startsInMinutes = 3;
    isWithinLobbyWindow = startsInMinutes <= config.leadMinutes;
    scheduledTimeDisplay = 'Today at 4:30 PM';
    unlockTimeDisplay = `Today at 4:25 PM (${config.leadMinutes}m before)`;
  } else if (lowerTime.includes('tomorrow') || lowerTime.includes('fri') || lowerTime.includes('aug 21') || lowerTime.includes('aug 23') || String(session.id) === '2' || String(session.id) === '3') {
    startsInMinutes = lowerTime.includes('tomorrow') ? 1440 : 2880;
    isWithinLobbyWindow = false;
    scheduledTimeDisplay = timeStr;
    unlockTimeDisplay = `${config.leadMinutes} min before scheduled start`;
  } else if (session.startHour !== undefined) {
    // If numerical start hour is provided (e.g. from week matrix)
    if (session.startHour === 8 && session.dayIndex === 0) {
      // 8:00 AM Mon
      startsInMinutes = 4;
      isWithinLobbyWindow = startsInMinutes <= config.leadMinutes;
      scheduledTimeDisplay = '8:00 AM (Mon 8/17)';
      unlockTimeDisplay = `7:55 AM (${config.leadMinutes}m before)`;
    } else {
      startsInMinutes = (session.startHour - 8) * 60;
      isWithinLobbyWindow = startsInMinutes <= config.leadMinutes && startsInMinutes >= -config.graceMinutes;
      scheduledTimeDisplay = session.timeDisplay || `${session.startHour}:00`;
      unlockTimeDisplay = `${config.leadMinutes}m prior to ${session.startHour}:00`;
    }
  }

  // 5. Build Result
  if (isWithinLobbyWindow) {
    return {
      isAccessible: true,
      status: 'lobby_open',
      badgeText: `🟢 Lobby Open (${startsInMinutes}m to start)`,
      buttonText: 'Join Class Now',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold',
      scheduledTimeDisplay,
      unlockTimeDisplay,
      startsInText: `Starts in ${startsInMinutes} minutes`,
      startsInMinutes,
      canAdminBypass: true
    };
  }

  const hoursToStart = Math.floor(startsInMinutes / 60);
  const remainingMins = startsInMinutes % 60;
  const startsInFormatted = hoursToStart > 24 
    ? `${Math.floor(hoursToStart / 24)}d ${hoursToStart % 24}h`
    : hoursToStart > 0 
    ? `${hoursToStart}h ${remainingMins}m`
    : `${remainingMins}m`;

  return {
    isAccessible: false,
    status: 'locked_future',
    badgeText: `🔒 Opens ${config.leadMinutes}m before`,
    buttonText: `🔒 Opens in ${startsInFormatted}`,
    badgeStyle: 'bg-slate-100 text-slate-600 border-slate-200 font-medium',
    lockReason: `Meeting link will automatically become active ${config.leadMinutes} minutes before the scheduled start time (${scheduledTimeDisplay}).`,
    scheduledTimeDisplay,
    unlockTimeDisplay,
    startsInText: `Starts in ${startsInFormatted}`,
    startsInMinutes,
    canAdminBypass: true
  };
}
