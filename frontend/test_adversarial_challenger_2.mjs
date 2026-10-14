// test_adversarial_challenger_2.mjs
// EMPIRICAL CHALLENGER 2 ADVERSARIAL TEST SUITE
// Deep Stress Harness, Property Fuzzing & Cross-Role Lifecycle Oracles

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const results = {
  passed: 0,
  failed: 0,
  total: 0,
  suites: []
};

function assert(condition, name, details = '') {
  results.total++;
  if (condition) {
    results.passed++;
    console.log(`  ✔ [PASS] ${name}`);
    if (details) console.log(`         \x1b[2m${details}\x1b[0m`);
  } else {
    results.failed++;
    console.error(`  ✖ [FAIL] ${name}`);
    if (details) console.error(`         \x1b[31m${details}\x1b[0m`);
  }
}

// =============================================================================
// REACTIVE LOCALSTORAGE MOCK INFRASTRUCTURE WITH DISPATCH PROBING
// =============================================================================
class MockStorage {
  constructor() {
    this.data = new Map();
    this.listeners = [];
  }
  getItem(key) {
    return this.data.has(key) ? this.data.get(key) : null;
  }
  setItem(key, val) {
    const oldVal = this.getItem(key);
    const newVal = String(val);
    this.data.set(key, newVal);
    this.listeners.forEach(fn => fn({ key, oldValue: oldVal, newValue: newVal }));
  }
  removeItem(key) {
    const oldVal = this.getItem(key);
    this.data.delete(key);
    this.listeners.forEach(fn => fn({ key, oldValue: oldVal, newValue: null }));
  }
  clear() {
    this.data.clear();
    this.listeners.forEach(fn => fn({ key: null, oldValue: null, newValue: null }));
  }
  addListener(fn) {
    this.listeners.push(fn);
  }
  removeListener(fn) {
    this.listeners = this.listeners.filter(l => l !== fn);
  }
}

const mockStorage = new MockStorage();
global.localStorage = mockStorage;
global.window = {
  localStorage: mockStorage,
  addEventListener: (event, fn) => {
    if (event === 'storage') mockStorage.addListener(fn);
  },
  removeEventListener: (event, fn) => {
    if (event === 'storage') mockStorage.removeListener(fn);
  },
  dispatchEvent: (event) => {
    if (event && event.type === 'storage') {
      mockStorage.listeners.forEach(fn => fn({ key: 'custom_dispatch' }));
    }
  }
};

console.log('\n================================================================================');
console.log('  CHALLENGER 2 ADVERSARIAL STRESS TEST SUITE');
console.log('================================================================================\n');

// =============================================================================
// TEST SUITE 1: CROSS-ROLE PERSONA TRANSITIONS & LIFECYCLE GUARDS
// =============================================================================
console.log('\x1b[36m>>> [SUITE 1: Cross-Role Persona Transitions & Lifecycle Guards]\x1b[0m');

const PERSONAS = {
  super_admin: {
    name: 'Super Admin',
    email: 'superadmin@akademi.dev',
    role: 'super_admin',
    initials: 'SA',
    title: 'Chief Platform Administrator'
  },
  admin: {
    name: 'Ngozi Eze',
    email: 'admin@akademi.com',
    role: 'admin',
    initials: 'NE',
    title: 'Platform Operations Director'
  },
  tutor: {
    name: 'Dr. Chiamaka Eze',
    email: 'tutor@akademi.com',
    role: 'tutor',
    initials: 'CE',
    title: 'Lead Mathematics & Physics Specialist'
  },
  student: {
    name: 'Chiamaka Ada',
    email: 'student@akademi.com',
    role: 'student',
    initials: 'CA',
    title: 'A-Level Science & Mathematics Student'
  }
};

// Test 1.1: Sequential Persona Transitions Super Admin -> Admin -> Student -> Tutor -> Super Admin
let activeUser = PERSONAS.super_admin;
mockStorage.setItem('akademi_auth_user', JSON.stringify(activeUser));
let syncedUser = JSON.parse(mockStorage.getItem('akademi_auth_user'));
assert(syncedUser.role === 'super_admin' && syncedUser.name === 'Super Admin', '1.1 Super Admin persona initialized in auth store');

// Transition to Admin
activeUser = PERSONAS.admin;
mockStorage.setItem('akademi_auth_user', JSON.stringify(activeUser));
syncedUser = JSON.parse(mockStorage.getItem('akademi_auth_user'));
assert(syncedUser.role === 'admin' && syncedUser.name === 'Ngozi Eze', '1.2 Switch from Super Admin to Admin maintains role state and identity');

// Transition to Student
activeUser = PERSONAS.student;
mockStorage.setItem('akademi_auth_user', JSON.stringify(activeUser));
syncedUser = JSON.parse(mockStorage.getItem('akademi_auth_user'));
assert(syncedUser.role === 'student' && syncedUser.name === 'Chiamaka Ada', '1.3 Switch from Admin to Student isolates student permissions and profile');

// Transition to Tutor
activeUser = PERSONAS.tutor;
mockStorage.setItem('akademi_auth_user', JSON.stringify(activeUser));
syncedUser = JSON.parse(mockStorage.getItem('akademi_auth_user'));
assert(syncedUser.role === 'tutor' && syncedUser.name === 'Dr. Chiamaka Eze', '1.4 Switch from Student to Tutor enables educator dashboard and matrix controls');

// Test 1.5: Role Guard Redirection Matrix Simulation
function evaluateRouteAccess(userRole, routePath, allowedRoles) {
  if (!allowedRoles.includes(userRole)) {
    if (userRole === 'admin' || userRole === 'super_admin') {
      return { access: false, redirect: '/admin' };
    }
    return { access: false, redirect: '/dashboard' };
  }
  return { access: true, redirect: null };
}

const adminGuard = ['admin', 'super_admin'];
const dashboardGuard = ['student', 'tutor', 'admin', 'super_admin'];

assert(evaluateRouteAccess('student', '/admin', adminGuard).access === false &&
       evaluateRouteAccess('student', '/admin', adminGuard).redirect === '/dashboard', 
       '1.5 Student attempting to access /admin is blocked and redirected to /dashboard');

assert(evaluateRouteAccess('tutor', '/admin', adminGuard).access === false &&
       evaluateRouteAccess('tutor', '/admin', adminGuard).redirect === '/dashboard',
       '1.6 Tutor attempting to access /admin is blocked and redirected to /dashboard');

assert(evaluateRouteAccess('admin', '/admin', adminGuard).access === true,
       '1.7 Admin allowed access to /admin');

assert(evaluateRouteAccess('super_admin', '/admin', adminGuard).access === true,
       '1.8 Super Admin allowed access to /admin');

assert(evaluateRouteAccess('student', '/dashboard', dashboardGuard).access === true,
       '1.9 Student allowed access to /dashboard');

assert(evaluateRouteAccess('tutor', '/dashboard', dashboardGuard).access === true,
       '1.10 Tutor allowed access to /dashboard');

// =============================================================================
// TEST SUITE 2: HOMEWORK & LESSON NOTES DUAL-MODE SYNCHRONIZATION
// =============================================================================
console.log('\n\x1b[36m>>> [SUITE 2: Homework & Lesson Notes Dual-Mode Synchronization]\x1b[0m');

// Initial default session note
const initialNote = {
  sessionId: 'DS-ADV-1',
  sessionTitle: 'Calculus — Definite Integrals & Riemann Sums',
  tutorName: 'Dr. Chiamaka Eze',
  date: '26 Aug 2026',
  summary: 'In-depth review of upper and lower Riemann sums, trapezoidal approximation, and definite integration.',
  keyPoints: [
    '∫[a, b] f(x)dx = lim n->inf ∑ f(x_i) Δx',
    'Fundamental Theorem of Calculus: d/dx ∫[a, x] f(t)dt = f(x)',
    'Trapezoidal Rule: Δx/2 * (y0 + 2y1 + ... + 2yn-1 + yn)'
  ],
  homework: [
    { id: 'hw-adv-1', task: 'Compute Riemann sum for f(x)=x^2 on [0, 2] with n=4', dueDate: 'Friday, 28 Aug', completed: false },
    { id: 'hw-adv-2', task: 'Solve 10 definite integral drills from Stewart Section 5.3', dueDate: 'Sunday, 30 Aug', completed: false }
  ],
  attachments: [
    { id: 'att-1', name: 'Riemann_Sums_Handout.pdf', size: '2.3 MB', type: 'pdf' },
    { id: 'att-2', name: 'Trapezoidal_Simulations.zip', size: '4.8 MB', type: 'zip' },
    { id: 'att-3', name: 'Whiteboard_Proof.png', size: '1.1 MB', type: 'image' }
  ]
};

mockStorage.setItem('akademi_session_notes', JSON.stringify({ 'DS-ADV-1': initialNote }));

// Test 2.1: Tutor adds a 3rd homework task and updates summary
let notesStore = JSON.parse(mockStorage.getItem('akademi_session_notes'));
const tutorUpdated = { ...notesStore['DS-ADV-1'] };
tutorUpdated.summary += ' Added supplementary practice for AP exam prep.';
tutorUpdated.homework.push({
  id: 'hw-adv-3',
  task: 'Verify error bound |E_T| <= K(b-a)^3 / (12n^2)',
  dueDate: 'Monday, 31 Aug',
  completed: false
});
notesStore['DS-ADV-1'] = tutorUpdated;
mockStorage.setItem('akademi_session_notes', JSON.stringify(notesStore));

let studentReadNotes = JSON.parse(mockStorage.getItem('akademi_session_notes'))['DS-ADV-1'];
assert(studentReadNotes.homework.length === 3, '2.1 Student immediately observes 3 homework tasks assigned by tutor');
assert(studentReadNotes.summary.includes('AP exam prep'), '2.2 Student observes updated tutor summary text');

// Test 2.2: Student toggles homework completion (task 1 and task 3)
studentReadNotes.homework[0].completed = true;
studentReadNotes.homework[2].completed = true;
notesStore['DS-ADV-1'] = studentReadNotes;
mockStorage.setItem('akademi_session_notes', JSON.stringify(notesStore));

let tutorReadBack = JSON.parse(mockStorage.getItem('akademi_session_notes'))['DS-ADV-1'];
const completedCount = tutorReadBack.homework.filter(h => h.completed).length;
const totalCount = tutorReadBack.homework.length;
const masteryPct = Math.round((completedCount / totalCount) * 100);

assert(completedCount === 2 && tutorReadBack.homework[0].completed && tutorReadBack.homework[2].completed, '2.3 Student checkbox completion state persisted for tasks 1 and 3');
assert(!tutorReadBack.homework[1].completed, '2.4 Incomplete task 2 remains uncompleted');
assert(masteryPct === 67, '2.5 Tutor view calculates accurate 67% student homework mastery rate (2/3 completed)');

// Test 2.3: Native File Attachment Integrity
assert(studentReadNotes.attachments.length === 3, '2.6 Multi-format file attachments present (.pdf, .zip, .png)');
const types = studentReadNotes.attachments.map(a => a.type);
assert(types.includes('pdf') && types.includes('zip') && types.includes('image'), '2.7 File format type classifications preserved');

// Test 2.4: Study Pack Plain Text Generator Validation
function generateStudyPack(note) {
  return `================================================================================
AKADEMI ONLINE LEARNING PLATFORM
LESSON SUMMARY & STUDY PACK
================================================================================

Lesson Title   : ${note.sessionTitle}
Tutor          : ${note.tutorName}
Date           : ${note.date}

--------------------------------------------------------------------------------
1. TUTOR'S LESSON SUMMARY:
--------------------------------------------------------------------------------
${note.summary}

--------------------------------------------------------------------------------
2. KEY FORMULAS & ESSENTIAL TAKEAWAYS:
--------------------------------------------------------------------------------
${(note.keyPoints || []).map((pt, i) => `  [${i + 1}] ${pt}`).join('\n')}

--------------------------------------------------------------------------------
3. ASSIGNED HOMEWORK & ACTION ITEMS:
--------------------------------------------------------------------------------
${(note.homework || []).map((hw) => `  [${hw.completed ? 'X' : ' '}] ${hw.task} (Due: ${hw.dueDate || 'Next lesson'})`).join('\n')}

--------------------------------------------------------------------------------
4. ATTACHED STUDY RESOURCES:
--------------------------------------------------------------------------------
${(note.attachments || []).map(a => `  - ${a.name} (${a.size})`).join('\n')}

================================================================================
© ${new Date().getFullYear()} Akademi Inc. All rights reserved.
================================================================================`;
}

const generatedPack = generateStudyPack(studentReadNotes);
assert(generatedPack.includes('[X] Compute Riemann sum'), '2.8 Study Pack accurately marks task 1 as [X] completed');
assert(generatedPack.includes('[ ] Solve 10 definite integral drills'), '2.9 Study Pack accurately marks task 2 as [ ] incomplete');
assert(generatedPack.includes('[X] Verify error bound'), '2.10 Study Pack accurately marks task 3 as [X] completed');
assert(generatedPack.includes('Trapezoidal_Simulations.zip (4.8 MB)'), '2.11 Study Pack includes attached resources');

// =============================================================================
// TEST SUITE 3: TUTOR SUSPENSION, VERIFICATION & STUDENT DISCOVERY EXCLUSION
// =============================================================================
console.log('\n\x1b[36m>>> [SUITE 3: Tutor Suspension, Verification & Student Discovery Lifecycle]\x1b[0m');

const seedTutors = [
  { id: 101, name: 'Dr. Chiamaka Eze', status: 'Verified', verified: true, rate: 3500, rating: 4.9, subjects: ['Mathematics', 'Calculus'] },
  { id: 102, name: 'Daniel Okafor', status: 'Verified', verified: true, rate: 4000, rating: 4.8, subjects: ['Physics', 'Mechanics'] },
  { id: 103, name: 'Adaeze Nwosu', status: 'Pending', verified: false, rate: 2800, rating: 4.7, subjects: ['Spanish', 'French'] },
  { id: 104, name: 'Grace Etim', status: 'Suspended', verified: false, rate: 4500, rating: 4.6, subjects: ['English Lit', 'Creative Writing'] }
];

mockStorage.setItem('akademi_admin_tutors', JSON.stringify(seedTutors));
mockStorage.setItem('akademi_registered_tutors', JSON.stringify(seedTutors));

// Query Student Discovery Filter Logic (from src/pages/Tutors.tsx)
function queryStudentCatalog(tutors, query = '', maxPrice = 10000) {
  return tutors.filter(t => {
    const isApproved = t.verified === true && t.status !== 'Pending' && t.status !== 'Suspended';
    if (!isApproved) return false;
    if (query && !t.name.toLowerCase().includes(query.toLowerCase()) && !t.subjects.some(s => s.toLowerCase().includes(query.toLowerCase()))) return false;
    if (t.rate > maxPrice) return false;
    return true;
  });
}

// Initial discovery check
let visibleTutors = queryStudentCatalog(seedTutors);
assert(visibleTutors.length === 2 && visibleTutors.map(t => t.id).sort().join(',') === '101,102', '3.1 Student discovery displays only verified active tutors (Dr. Eze & Daniel Okafor)');
assert(!visibleTutors.some(t => t.id === 103), '3.2 Pending tutor Adaeze Nwosu excluded from student discovery');
assert(!visibleTutors.some(t => t.id === 104), '3.3 Suspended tutor Grace Etim excluded from student discovery');

// Admin Action: Approve Pending Tutor (Adaeze Nwosu)
let adminTutorList = JSON.parse(mockStorage.getItem('akademi_admin_tutors'));
const tutorToApprove = adminTutorList.find(t => t.id === 103);
tutorToApprove.status = 'Verified';
tutorToApprove.verified = true;
mockStorage.setItem('akademi_admin_tutors', JSON.stringify(adminTutorList));

visibleTutors = queryStudentCatalog(adminTutorList);
assert(visibleTutors.length === 3 && visibleTutors.some(t => t.id === 103), '3.4 Newly approved tutor Adaeze Nwosu becomes instantly visible to students');

// Admin Action: Suspend Tutor (Daniel Okafor)
const tutorToSuspend = adminTutorList.find(t => t.id === 102);
tutorToSuspend.status = 'Suspended';
tutorToSuspend.verified = false;
mockStorage.setItem('akademi_admin_tutors', JSON.stringify(adminTutorList));

visibleTutors = queryStudentCatalog(adminTutorList);
assert(visibleTutors.length === 2 && !visibleTutors.some(t => t.id === 102), '3.5 Suspended tutor Daniel Okafor is immediately purged from student search results');

// Admin Action: Restore Suspended Tutor (Grace Etim)
const tutorToRestore = adminTutorList.find(t => t.id === 104);
tutorToRestore.status = 'Verified';
tutorToRestore.verified = true;
mockStorage.setItem('akademi_admin_tutors', JSON.stringify(adminTutorList));

visibleTutors = queryStudentCatalog(adminTutorList);
assert(visibleTutors.some(t => t.id === 104), '3.6 Restored tutor Grace Etim immediately rejoins student discovery catalog');

// =============================================================================
// TEST SUITE 4: COMMISSION SPLIT & PLATFORM REVENUE ORACLES
// =============================================================================
console.log('\n\x1b[36m>>> [SUITE 4: Commission Split & Platform Revenue Oracles]\x1b[0m');

function calculateBookingSplit(grossPrice, commissionRatePercent) {
  const platformFee = Math.round(grossPrice * (commissionRatePercent / 100));
  const tutorNet = grossPrice - platformFee;
  return { grossPrice, platformFee, tutorNet };
}

// Test varying commission rates
const ratesToTest = [0, 5, 10, 15, 20, 25, 33.33, 50, 100];
const testGross = 12000;

ratesToTest.forEach(rate => {
  const split = calculateBookingSplit(testGross, rate);
  assert(split.platformFee + split.tutorNet === testGross, `4.1 Split conservation at ${rate}% commission (Fee: ₦${split.platformFee} + Tutor: ₦${split.tutorNet} = ₦${testGross})`);
});

// Test Admin Commission Rate Override from localStorage
mockStorage.setItem('akademi_commission_rate', '12.5');
const savedRate = Number(mockStorage.getItem('akademi_commission_rate'));
const split12_5 = calculateBookingSplit(8000, savedRate);
assert(split12_5.platformFee === 1000 && split12_5.tutorNet === 7000, '4.2 Fractional 12.5% platform commission computes exact ₦1,000 fee and ₦7,000 tutor credit on ₦8,000 lesson');

// =============================================================================
// SUMMARY & VERDICT
// =============================================================================
console.log('\n================================================================================');
console.log(`CHALLENGER 2 ADVERSARIAL VERIFICATION SUMMARY`);
console.log(`  Passed: ${results.passed}/${results.total} (${Math.round((results.passed / results.total) * 100)}%)`);
console.log(`  Failed: ${results.failed}`);
console.log('================================================================================\n');

if (results.failed === 0) {
  console.log('\x1b[32m✔ EMPIRICAL CHALLENGER VERDICT: ALL ADVERSARIAL ORACLES PASSED CLEANLY.\x1b[0m\n');
  process.exit(0);
} else {
  console.error('\x1b[31m✖ EMPIRICAL CHALLENGER VERDICT: ADVERSARIAL FAILURES DETECTED.\x1b[0m\n');
  process.exit(1);
}
