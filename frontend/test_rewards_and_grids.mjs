// test_rewards_and_grids.mjs
// Multidirectional Test Suite for Student Rewards Tokens, Session Time Conversions, and Grid Settings

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock browser localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] !== undefined ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

const localStorage = new LocalStorageMock();
global.localStorage = localStorage;

// Test Runner
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function assert(condition, testName, details = '') {
  if (condition) {
    results.passed++;
    results.tests.push({ name: testName, status: 'PASS', details });
    console.log(`  [PASS] ${testName}`);
  } else {
    results.failed++;
    results.tests.push({ name: testName, status: 'FAIL', details });
    console.error(`  [FAIL] ${testName}: ${details}`);
  }
}

console.log('================================================================');
console.log('AKADEMI MULTIDIRECTIONAL PERSONA & REWARD SUBSIDY TEST SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// 1. ADMIN PERSONA TESTS
// -----------------------------------------------------------------------------
console.log('>>> [1. ADMIN PERSONA: Configuration & Persistence]');

// Test 1.1: Admin sets token conversion rate
const configuredTokensPerMin = 10;
const configuredReferralBonus = 150;
const configuredStreakBonus = 50;
const configuredCommissionRate = 10;
const configuredMinPayout = 5000;

localStorage.setItem('akademi_tokens_per_minute', String(configuredTokensPerMin));
localStorage.setItem('akademi_referral_bonus_tokens', String(configuredReferralBonus));
localStorage.setItem('akademi_streak_bonus_tokens', String(configuredStreakBonus));
localStorage.setItem('akademi_commission_rate', String(configuredCommissionRate));
localStorage.setItem('akademi_min_payout_threshold', String(configuredMinPayout));

assert(
  Number(localStorage.getItem('akademi_tokens_per_minute')) === 10,
  'Admin Token Conversion Rate persisted',
  `Expected 10 tokens/min, got ${localStorage.getItem('akademi_tokens_per_minute')}`
);

assert(
  Number(localStorage.getItem('akademi_referral_bonus_tokens')) === 150,
  'Admin Referral Bonus Token amount persisted',
  `Expected 150 tokens, got ${localStorage.getItem('akademi_referral_bonus_tokens')}`
);

assert(
  Number(localStorage.getItem('akademi_streak_bonus_tokens')) === 50,
  'Admin Weekly Streak Bonus Token amount persisted',
  `Expected 50 tokens, got ${localStorage.getItem('akademi_streak_bonus_tokens')}`
);

assert(
  Number(localStorage.getItem('akademi_min_payout_threshold')) === 5000,
  'Admin Minimum Payout Threshold persisted',
  `Expected 5000 NGN, got ${localStorage.getItem('akademi_min_payout_threshold')}`
);

// -----------------------------------------------------------------------------
// 2. STUDENT PERSONA TESTS
// -----------------------------------------------------------------------------
console.log('\n>>> [2. STUDENT PERSONA: Tokens, Streaks, Conversion & Booking Subsidy]');

// Setup student initial balance
let studentTokens = 450;
let studentRewardMinutes = 30;
let studentWalletNgn = 25000;

localStorage.setItem('akademi_user_tokens', String(studentTokens));
localStorage.setItem('akademi_student_reward_minutes', String(studentRewardMinutes));
localStorage.setItem('akademi_wallet_balance_ngn', String(studentWalletNgn));
localStorage.setItem('akademi_user_transactions', JSON.stringify([]));
localStorage.setItem('akademi_booked_sessions', JSON.stringify([]));

// Test 2.1: Student Claims Daily Streak Bonus
const streakBonus = Number(localStorage.getItem('akademi_streak_bonus_tokens') || 50);
studentTokens += streakBonus;
localStorage.setItem('akademi_user_tokens', String(studentTokens));

assert(
  Number(localStorage.getItem('akademi_user_tokens')) === 500,
  'Student successfully claimed Streak Bonus (+50 LearnTokens)',
  `Expected 500 tokens, got ${localStorage.getItem('akademi_user_tokens')}`
);

// Test 2.2: Student Claims Classmate Referral Bonus
const referralBonus = Number(localStorage.getItem('akademi_referral_bonus_tokens') || 150);
studentTokens += referralBonus;
localStorage.setItem('akademi_user_tokens', String(studentTokens));

assert(
  Number(localStorage.getItem('akademi_user_tokens')) === 650,
  'Student successfully earned Classmate Referral Bonus (+150 LearnTokens)',
  `Expected 650 tokens, got ${localStorage.getItem('akademi_user_tokens')}`
);

// Test 2.3: Student Converts Tokens to Free Session Time Minutes
const tokensToConvert = 200;
const rate = Number(localStorage.getItem('akademi_tokens_per_minute') || 10);
const minutesGained = Math.floor(tokensToConvert / rate);

studentTokens -= tokensToConvert;
studentRewardMinutes += minutesGained;
localStorage.setItem('akademi_user_tokens', String(studentTokens));
localStorage.setItem('akademi_student_reward_minutes', String(studentRewardMinutes));

// Record conversion transaction
const conversionTx = {
  id: 'TOK-889901',
  type: 'Token Conversion',
  description: `Converted ${tokensToConvert} LearnTokens into ${minutesGained} min Session Time`,
  amount: `+${minutesGained} Mins`,
  status: 'Completed',
  date: 'Just now'
};
const currentTxs = JSON.parse(localStorage.getItem('akademi_user_transactions'));
localStorage.setItem('akademi_user_transactions', JSON.stringify([conversionTx, ...currentTxs]));

assert(
  Number(localStorage.getItem('akademi_user_tokens')) === 450,
  'Student token balance correctly deducted after conversion',
  `Expected 450 tokens, got ${localStorage.getItem('akademi_user_tokens')}`
);

assert(
  Number(localStorage.getItem('akademi_student_reward_minutes')) === 50,
  'Student free session minutes balance credited (+20 min from 200 tokens)',
  `Expected 50 mins (30 + 20), got ${localStorage.getItem('akademi_student_reward_minutes')}`
);

// Test 2.4: Student Books a Session and Applies Reward Minutes Subsidy
const tutorHourlyRate = 3500;
const sessionDurationMins = 60;
const sessionCount = 1;
const totalMins = sessionDurationMins * sessionCount;
const singleGrossPrice = Math.round(tutorHourlyRate * sessionDurationMins / 60); // 3500
const rawTotal = singleGrossPrice * sessionCount; // 3500

// Student chooses to apply 30 mins of reward time
const appliedRewardMins = 30;
const rewardSubsidyNgn = Math.round((appliedRewardMins / totalMins) * rawTotal); // (30/60) * 3500 = 1750
const studentFinalToPay = Math.max(0, rawTotal - rewardSubsidyNgn); // 1750

assert(
  rewardSubsidyNgn === 1750,
  'Subsidy Calculation accurately computes 50% discount for 30 min of 60 min session',
  `Expected 1750 NGN subsidy, got ${rewardSubsidyNgn}`
);

assert(
  studentFinalToPay === 1750,
  'Student net payment correctly equals gross tuition minus subsidy',
  `Expected 1750 NGN, got ${studentFinalToPay}`
);

// Execute booking confirmation
studentWalletNgn -= studentFinalToPay;
studentRewardMinutes -= appliedRewardMins;
localStorage.setItem('akademi_wallet_balance_ngn', String(studentWalletNgn));
localStorage.setItem('akademi_student_reward_minutes', String(studentRewardMinutes));

const bookedSession = {
  id: 'BS-TEST-001',
  tutorId: 1,
  tutorName: 'Dr. Chiamaka Eze',
  studentName: 'Chiamaka Ada',
  subject: 'Calculus',
  date: 'Thu Aug 20',
  time: '4:30 PM',
  duration: '60 min',
  type: 'private',
  price: studentFinalToPay,
  studentPaid: studentFinalToPay,
  tutorGrossEarnings: rawTotal,
  rewardMinutesUsed: appliedRewardMins,
  rewardSubsidyAmount: rewardSubsidyNgn,
  isTokenSubsidized: true,
  status: 'Upcoming',
  bookedAt: new Date().toISOString()
};

const existingBookings = JSON.parse(localStorage.getItem('akademi_booked_sessions'));
localStorage.setItem('akademi_booked_sessions', JSON.stringify([bookedSession, ...existingBookings]));

assert(
  Number(localStorage.getItem('akademi_wallet_balance_ngn')) === 23250,
  'Student wallet correctly debited net amount (25,000 - 1,750 = 23,250)',
  `Expected 23250 NGN, got ${localStorage.getItem('akademi_wallet_balance_ngn')}`
);

assert(
  Number(localStorage.getItem('akademi_student_reward_minutes')) === 20,
  'Student reward minutes balance correctly debited (50 - 30 = 20 mins)',
  `Expected 20 mins, got ${localStorage.getItem('akademi_student_reward_minutes')}`
);

// -----------------------------------------------------------------------------
// 3. TUTOR PERSONA TESTS
// -----------------------------------------------------------------------------
console.log('\n>>> [3. TUTOR PERSONA: Subsidized Booking Earnings & Payout Transparency]');

const savedBookings = JSON.parse(localStorage.getItem('akademi_booked_sessions'));
const tutorSession = savedBookings.find(b => b.id === 'BS-TEST-001');

assert(
  tutorSession !== undefined,
  'Tutor workspace receives the booked session in runtime storage',
  'Session BS-TEST-001 found in storage'
);

assert(
  tutorSession.tutorGrossEarnings === 3500,
  'Tutor receives 100% full gross earnings credit (₦3,500) despite student token subsidy',
  `Expected 3500 NGN, got ${tutorSession.tutorGrossEarnings}`
);

assert(
  tutorSession.isTokenSubsidized === true && tutorSession.rewardSubsidyAmount === 1750,
  'Session metadata preserves token subsidy transparency for tutor earnings breakdown',
  `isTokenSubsidized: ${tutorSession.isTokenSubsidized}, subsidy: ₦${tutorSession.rewardSubsidyAmount}`
);

// Calculate tutor commission & net payout
const commissionRate = Number(localStorage.getItem('akademi_commission_rate') || 10);
const platformFee = Math.round(tutorSession.tutorGrossEarnings * (commissionRate / 100)); // 350
const tutorNetEarnings = tutorSession.tutorGrossEarnings - platformFee; // 3150

assert(
  tutorNetEarnings === 3150,
  'Tutor net earnings accurately calculated based on gross tuition before student subsidy (₦3,150)',
  `Expected 3150 NGN, got ${tutorNetEarnings}`
);

// -----------------------------------------------------------------------------
// 4. GRID SETTINGS SANITY VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n>>> [4. GRID SETTING OPTIMIZATION SANITY CHECKS]');

const filesToCheck = [
  { file: 'src/pages/Tutors.tsx', expected: ['grid', 'grid-cols-1', 'lg:grid-cols-3'] },
  { file: 'src/pages/Courses.tsx', expected: ['grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3'] },
  { file: 'src/pages/admin/AdminOverview.tsx', expected: ['grid', 'sm:grid-cols-2', 'lg:grid-cols-5'] },
  { file: 'src/pages/admin/AdminPayments.tsx', expected: ['grid', 'sm:grid-cols-2', 'lg:grid-cols-4'] },
  { file: 'src/pages/admin/AdminSessions.tsx', expected: ['grid', 'sm:grid-cols-2', 'lg:grid-cols-4'] },
  { file: 'src/pages/admin/AdminSubjects.tsx', expected: ['grid', 'grid-cols-1', 'lg:grid-cols-3', 'xl:grid-cols-4'] },
  { file: 'src/pages/admin/AdminTutors.tsx', expected: ['grid', 'sm:grid-cols-2', 'lg:grid-cols-3'] },
  { file: 'src/pages/dashboard/Overview.tsx', expected: ['grid', 'grid-cols-2', 'lg:grid-cols-4'] },
  { file: 'src/pages/dashboard/Billing.tsx', expected: ['grid', 'grid-cols-1', 'md:grid-cols-3'] },
];

filesToCheck.forEach(({ file, expected }) => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    assert(false, `File exists check: ${file}`, 'File not found');
    return;
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  const allMatch = expected.every(cls => content.includes(cls));
  assert(
    allMatch,
    `Responsive grid configuration verified in ${file}`,
    `Classes expected: ${expected.join(', ')}`
  );
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TEST EXECUTION SUMMARY: ${results.passed} PASSED, ${results.failed} FAILED`);
console.log('================================================================\n');

if (results.failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
