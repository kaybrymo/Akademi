// scripts/stress_financial_and_timing.mjs
// Adversarial Empirical Stress Harness for Financial Boundaries & Session Access Engine

import { fileURLToPath } from 'url';
import path from 'path';

const passList = [];
const failList = [];

function test(name, fn) {
  try {
    fn();
    passList.push(name);
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    failList.push({ name, error: err.message });
    console.error(`  [FAIL] ${name} -> ${err.message}`);
  }
}

function expect(val) {
  return {
    toBe(expected) {
      if (val !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(val)}`);
    },
    toEqual(expected) {
      if (JSON.stringify(val) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(val)}`);
    },
    toBeGreaterThanOrEqual(expected) {
      if (val < expected) throw new Error(`Expected ${val} >= ${expected}`);
    },
    toBeLessThanOrEqual(expected) {
      if (val > expected) throw new Error(`Expected ${val} <= ${expected}`);
    },
    toBeTruthy() {
      if (!val) throw new Error(`Expected truthy, got ${val}`);
    },
    toBeFalsy() {
      if (val) throw new Error(`Expected falsy, got ${val}`);
    }
  };
}

console.log('=== FINANCIAL BOUNDARY & TIMING ENGINE ADVERSARIAL STRESS TEST ===\n');

// -------------------------------------------------------------
// 1. FINANCIAL BOUNDARY ADVERSARIAL STRESS TESTS
// -------------------------------------------------------------
console.log('--- 1. Financial Boundary Stress Tests ---');

// Commission variations: 0%, 5%, 10%, 15%, 50%, 100%, and edge cases
function calcCommission(grossPrice, commissionRate) {
  const rate = Math.max(0, Math.min(100, Number(commissionRate) || 0));
  const platformFee = Math.round(grossPrice * (rate / 100));
  const tutorNet = grossPrice - platformFee;
  return { platformFee, tutorNet, rate };
}

test('Commission Rate: 0% fee-free promotion', () => {
  const res = calcCommission(5000, 0);
  expect(res.platformFee).toBe(0);
  expect(res.tutorNet).toBe(5000);
});

test('Commission Rate: 5% promotional rate', () => {
  const res = calcCommission(5000, 5);
  expect(res.platformFee).toBe(250);
  expect(res.tutorNet).toBe(4750);
});

test('Commission Rate: 10% standard default rate', () => {
  const res = calcCommission(3500, 10);
  expect(res.platformFee).toBe(350);
  expect(res.tutorNet).toBe(3150);
});

test('Commission Rate: 15% custom rate', () => {
  const res = calcCommission(10000, 15);
  expect(res.platformFee).toBe(1500);
  expect(res.tutorNet).toBe(8500);
});

test('Commission Rate: 50% high-tier split', () => {
  const res = calcCommission(8000, 50);
  expect(res.platformFee).toBe(4000);
  expect(res.tutorNet).toBe(4000);
});

test('Commission Rate: 100% full platform retention boundary', () => {
  const res = calcCommission(5000, 100);
  expect(res.platformFee).toBe(5000);
  expect(res.tutorNet).toBe(0);
});

test('Commission Rate: Negative rate clamped to 0%', () => {
  const res = calcCommission(5000, -15);
  expect(res.platformFee).toBe(0);
  expect(res.tutorNet).toBe(5000);
});

test('Commission Rate: >100% rate clamped to 100%', () => {
  const res = calcCommission(5000, 120);
  expect(res.platformFee).toBe(5000);
  expect(res.tutorNet).toBe(0);
});

test('Commission Rate: Fractional precision rounding (33.333% on ₦10,000)', () => {
  const res = calcCommission(10000, 33.3333);
  expect(res.platformFee).toBe(3333);
  expect(res.tutorNet).toBe(6667);
  expect(res.platformFee + res.tutorNet).toBe(10000);
});

// LearnTokens Subsidy Edge Cases
function calcBookingPriceWithSubsidy({
  baseRate,
  durationMinutes = 60,
  sessionCount = 1,
  sessionType = 'private',
  rewardMinutesAvailable = 0,
  applyReward = false
}) {
  const singlePrice = Math.round((baseRate * durationMinutes) / 60);
  const singleFinalPrice = sessionType === 'group' ? Math.round(singlePrice * 0.7) : singlePrice;
  const rawTotal = singleFinalPrice * sessionCount;
  const bundleDiscountPercent = sessionCount >= 4 ? 0.10 : sessionCount >= 2 ? 0.05 : 0;
  const standardFinalPrice = Math.round(rawTotal * (1 - bundleDiscountPercent));
  
  const totalMinutes = durationMinutes * sessionCount;
  const maxAppliableMinutes = Math.min(rewardMinutesAvailable, totalMinutes);
  const appliedRewardMinutes = applyReward ? maxAppliableMinutes : 0;
  const rewardSubsidyAmount = appliedRewardMinutes > 0
    ? Math.round((appliedRewardMinutes / totalMinutes) * standardFinalPrice)
    : 0;
  
  const finalStudentPrice = Math.max(0, standardFinalPrice - rewardSubsidyAmount);
  const tutorGrossEarnings = standardFinalPrice; // Tutor always gets full standardFinalPrice
  
  return {
    rawTotal,
    standardFinalPrice,
    appliedRewardMinutes,
    rewardSubsidyAmount,
    finalStudentPrice,
    tutorGrossEarnings,
    remainingRewardMinutes: rewardMinutesAvailable - appliedRewardMinutes
  };
}

test('LearnTokens: 0 tokens available -> 0 subsidy', () => {
  const res = calcBookingPriceWithSubsidy({
    baseRate: 4000,
    durationMinutes: 60,
    sessionCount: 1,
    rewardMinutesAvailable: 0,
    applyReward: true
  });
  expect(res.appliedRewardMinutes).toBe(0);
  expect(res.rewardSubsidyAmount).toBe(0);
  expect(res.finalStudentPrice).toBe(4000);
  expect(res.tutorGrossEarnings).toBe(4000);
});

test('LearnTokens: Partial token subsidy (30 mins of 60 mins)', () => {
  const res = calcBookingPriceWithSubsidy({
    baseRate: 4000,
    durationMinutes: 60,
    sessionCount: 1,
    rewardMinutesAvailable: 30,
    applyReward: true
  });
  expect(res.appliedRewardMinutes).toBe(30);
  expect(res.rewardSubsidyAmount).toBe(2000);
  expect(res.finalStudentPrice).toBe(2000);
  expect(res.tutorGrossEarnings).toBe(4000);
  expect(res.remainingRewardMinutes).toBe(0);
});

test('LearnTokens: Exact 100% token subsidy (60 mins of 60 mins)', () => {
  const res = calcBookingPriceWithSubsidy({
    baseRate: 5000,
    durationMinutes: 60,
    sessionCount: 1,
    rewardMinutesAvailable: 60,
    applyReward: true
  });
  expect(res.appliedRewardMinutes).toBe(60);
  expect(res.rewardSubsidyAmount).toBe(5000);
  expect(res.finalStudentPrice).toBe(0);
  expect(res.tutorGrossEarnings).toBe(5000);
});

test('LearnTokens: Over-subsidy (120 mins available for 60 min session -> capped at 60 mins)', () => {
  const res = calcBookingPriceWithSubsidy({
    baseRate: 5000,
    durationMinutes: 60,
    sessionCount: 1,
    rewardMinutesAvailable: 120,
    applyReward: true
  });
  expect(res.appliedRewardMinutes).toBe(60); // Capped!
  expect(res.rewardSubsidyAmount).toBe(5000);
  expect(res.finalStudentPrice).toBe(0);
  expect(res.remainingRewardMinutes).toBe(60); // 60 mins left
  expect(res.tutorGrossEarnings).toBe(5000);
});

test('LearnTokens: Multi-session bundle with partial reward minutes (2 sessions = 120 mins, 45 reward mins)', () => {
  const res = calcBookingPriceWithSubsidy({
    baseRate: 4000,
    durationMinutes: 60,
    sessionCount: 2,
    rewardMinutesAvailable: 45,
    applyReward: true
  });
  // rawTotal = 8000, bundleDiscount = 5% -> standardFinalPrice = 7600
  // applied mins = 45 / 120 mins -> subsidy = (45/120)*7600 = 2850
  expect(res.standardFinalPrice).toBe(7600);
  expect(res.appliedRewardMinutes).toBe(45);
  expect(res.rewardSubsidyAmount).toBe(2850);
  expect(res.finalStudentPrice).toBe(4750);
  expect(res.tutorGrossEarnings).toBe(7600);
  expect(res.remainingRewardMinutes).toBe(0);
});

// Payout Minimum Threshold Validation
function validatePayout(requestedAmount, currentBalance, minThreshold = 5000) {
  const amt = Number(requestedAmount);
  if (isNaN(amt) || amt <= 0) return { valid: false, error: 'Invalid amount' };
  if (amt < minThreshold) return { valid: false, error: `Minimum payout is ₦${minThreshold.toLocaleString()}` };
  if (amt > currentBalance) return { valid: false, error: `Exceeds available balance of ₦${currentBalance.toLocaleString()}` };
  return { valid: true, amount: amt, remainingBalance: currentBalance - amt };
}

test('Payout Threshold: ₦0 withdrawal is rejected', () => {
  const res = validatePayout(0, 50000, 5000);
  expect(res.valid).toBe(false);
});

test('Payout Threshold: ₦4,999 (₦1 below threshold) is rejected', () => {
  const res = validatePayout(4999, 50000, 5000);
  expect(res.valid).toBe(false);
});

test('Payout Threshold: Exact minimum ₦5,000 is accepted', () => {
  const res = validatePayout(5000, 50000, 5000);
  expect(res.valid).toBe(true);
  expect(res.remainingBalance).toBe(45000);
});

test('Payout Threshold: High withdrawal ₦100,000 with ₦150,000 balance is accepted', () => {
  const res = validatePayout(100000, 150000, 5000);
  expect(res.valid).toBe(true);
  expect(res.remainingBalance).toBe(50000);
});

test('Payout Threshold: Exact total balance (₦50,000 of ₦50,000) is accepted', () => {
  const res = validatePayout(50000, 50000, 5000);
  expect(res.valid).toBe(true);
  expect(res.remainingBalance).toBe(0);
});

test('Payout Threshold: Over-balance withdrawal (₦50,001 of ₦50,000) is rejected', () => {
  const res = validatePayout(50001, 50000, 5000);
  expect(res.valid).toBe(false);
});

// -------------------------------------------------------------
// 2. SESSION ACCESS TIMING ENGINE ADVERSARIAL STRESS TESTS
// -------------------------------------------------------------
console.log('\n--- 2. Session Access Timing Engine Stress Tests ---');

// Mock localStorage for session access testing
const mockStorage = {};
const mockLocalStorage = {
  getItem: (k) => mockStorage[k] ?? null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};
global.localStorage = mockLocalStorage;

// Import or recreate calculateSessionAccess with exact logic from sessionAccess.ts
function getSessionAccessConfig() {
  let leadMinutes = 5;
  let graceMinutes = 30;
  let bypassLock = false;
  let unlockedSessions = [];

  try {
    const savedLead = mockLocalStorage.getItem('akademi_admin_lobby_lead_minutes');
    if (savedLead !== null) leadMinutes = Number(savedLead);

    const savedGrace = mockLocalStorage.getItem('akademi_admin_lobby_grace_minutes');
    if (savedGrace !== null) graceMinutes = Number(savedGrace);

    const savedBypass = mockLocalStorage.getItem('akademi_admin_bypass_lobby_lock');
    if (savedBypass !== null) bypassLock = savedBypass === 'true';

    const savedUnlocked = mockLocalStorage.getItem('akademi_admin_unlocked_sessions');
    if (savedUnlocked) unlockedSessions = JSON.parse(savedUnlocked);
  } catch (e) {}

  return { leadMinutes, graceMinutes, bypassLock, unlockedSessions };
}

function calculateSessionAccess(session) {
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
  let isWithinLobbyWindow = false;
  let startsInMinutes = 45; // default future distance
  let scheduledTimeDisplay = timeStr;
  let unlockTimeDisplay = `5 min before start`;

  if (lowerTime.includes('today · 4:30') || lowerTime.includes('today 4:30') || String(session.id) === '1' || String(session.id) === 'DS-1' || String(session.id) === '101') {
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
    if (session.startHour === 8 && session.dayIndex === 0) {
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

test('Session Timing: Early access lobby (3 mins before start) is accessible with leadMinutes=5', () => {
  mockLocalStorage.clear();
  mockLocalStorage.setItem('akademi_admin_lobby_lead_minutes', '5');
  const res = calculateSessionAccess({ id: '1', time: 'Today · 4:30 PM', status: 'Upcoming' });
  expect(res.isAccessible).toBe(true);
  expect(res.status).toBe('lobby_open');
  expect(res.badgeText).toBe('🟢 Lobby Open (3m to start)');
  expect(res.buttonText).toBe('Join Class Now');
});

test('Session Timing: Lead time reduced to 2 min locks 3-min early session', () => {
  mockLocalStorage.clear();
  mockLocalStorage.setItem('akademi_admin_lobby_lead_minutes', '2'); // 2 < 3
  const res = calculateSessionAccess({ id: '1', time: 'Today · 4:30 PM', status: 'Upcoming' });
  expect(res.isAccessible).toBe(false);
  expect(res.status).toBe('locked_future');
  expect(res.badgeText).toBe('🔒 Opens 2m before');
});

test('Session Timing: Far future session (Tomorrow / Friday) is locked', () => {
  mockLocalStorage.clear();
  const res = calculateSessionAccess({ id: '2', time: 'Tomorrow at 10:00 AM', status: 'Upcoming' });
  expect(res.isAccessible).toBe(false);
  expect(res.status).toBe('locked_future');
  expect(res.buttonText.startsWith('🔒 Opens in')).toBe(true);
});

test('Session Timing: Explicit live session is accessible immediately', () => {
  mockLocalStorage.clear();
  const res = calculateSessionAccess({ id: '99', time: 'Anytime', status: 'Live', isLive: true });
  expect(res.isAccessible).toBe(true);
  expect(res.status).toBe('live_now');
  expect(res.badgeText).toBe('🟢 Live Now');
});

test('Session Timing: Completed session is locked and routes to notes/replay', () => {
  mockLocalStorage.clear();
  const res = calculateSessionAccess({ id: '1', time: 'Today · 4:30 PM', status: 'completed' });
  expect(res.isAccessible).toBe(false);
  expect(res.status).toBe('completed');
  expect(res.badgeText).toBe('Completed');
  expect(res.buttonText).toBe('View Notes / Replay');
});

test('Session Timing: Global Admin Bypass unlocks locked future session', () => {
  mockLocalStorage.clear();
  mockLocalStorage.setItem('akademi_admin_bypass_lobby_lock', 'true');
  const res = calculateSessionAccess({ id: '2', time: 'Tomorrow at 10:00 AM', status: 'Upcoming' });
  expect(res.isAccessible).toBe(true);
  expect(res.status).toBe('admin_override');
  expect(res.badgeText).toBe('Admin Unlocked ⚡');
});

test('Session Timing: Targeted Admin Session Unlock overrides specific session only', () => {
  mockLocalStorage.clear();
  mockLocalStorage.setItem('akademi_admin_unlocked_sessions', JSON.stringify(['TARGET-SES-42']));
  
  const targetedRes = calculateSessionAccess({ id: 'TARGET-SES-42', time: 'Next Month', status: 'Upcoming' });
  const otherRes = calculateSessionAccess({ id: 'OTHER-SES-99', time: 'Next Month', status: 'Upcoming' });
  
  expect(targetedRes.isAccessible).toBe(true);
  expect(targetedRes.status).toBe('admin_override');
  expect(otherRes.isAccessible).toBe(false);
  expect(otherRes.status).toBe('locked_future');
});

test('Session Timing: Numerical startHour inside grace period (within 30m after start)', () => {
  mockLocalStorage.clear();
  mockLocalStorage.setItem('akademi_admin_lobby_lead_minutes', '5');
  mockLocalStorage.setItem('akademi_admin_lobby_grace_minutes', '30');
  
  // startHour=8 -> startsInMinutes = (8-8)*60 = 0 -> in window [-30, 5]
  const res = calculateSessionAccess({ id: 'GRID-1', startHour: 8, dayIndex: 1 });
  expect(res.isAccessible).toBe(true);
  expect(res.status).toBe('lobby_open');
});

test('Session Timing: Numerical startHour past grace period (>30m after start)', () => {
  mockLocalStorage.clear();
  mockLocalStorage.setItem('akademi_admin_lobby_lead_minutes', '5');
  mockLocalStorage.setItem('akademi_admin_lobby_grace_minutes', '30');
  
  // startHour=7 -> startsInMinutes = (7-8)*60 = -60 -> < -30 graceMinutes -> not within lobby window
  const res = calculateSessionAccess({ id: 'GRID-OLD', startHour: 7, dayIndex: 1 });
  expect(res.isAccessible).toBe(false);
  expect(res.status).toBe('locked_future');
});

console.log('\n=============================================================');
console.log(`STRESS TEST SUMMARY: ${passList.length} Passed, ${failList.length} Failed`);
console.log('=============================================================');

if (failList.length > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
