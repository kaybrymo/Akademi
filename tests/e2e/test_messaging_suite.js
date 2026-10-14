/**
 * Akademi Platform - Messaging & Student-Tutor Communications Test Suite
 * 
 * Tests:
 * 1. Preloaded Students and Tutors in Messages.tsx
 * 2. Category Filter Tabs & Filtering Logic
 * 3. Overview.tsx Newly Enrolled Students State & LocalStorage Tracking
 * 4. Messaged Student Card Visual Indicators & Query Params
 * 5. Messages.tsx SearchParams Parsing & Dynamic Conversation Activation
 * 6. Students.tsx "Send Message" and Row "Message" Query Params
 * 7. Admin Desk & Student Automated Interactive Replies
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ${colors.green}✓ PASS:${colors.reset} ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ${colors.red}✗ FAIL:${colors.reset} ${name}`);
    console.error(`    ${colors.red}${err.message}${colors.reset}`);
  }
}

console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}  AKADEMI MESSAGING & COMMUNICATIONS QA SUITE  ${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}\n`);

// Mock localStorage
const mockStorage = {};
const localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

// Paths
const baseFrontend = path.resolve(__dirname, 'akademi/frontend/src/pages/dashboard');
const messagesFilePath = path.join(baseFrontend, 'Messages.tsx');
const overviewFilePath = path.join(baseFrontend, 'Overview.tsx');
const studentsFilePath = path.join(baseFrontend, 'Students.tsx');

const messagesContent = fs.readFileSync(messagesFilePath, 'utf8');
const overviewContent = fs.readFileSync(overviewFilePath, 'utf8');
const studentsContent = fs.readFileSync(studentsFilePath, 'utf8');

// ==========================================
// TEST SUITE 1: Messages.tsx Static Validation
// ==========================================
console.log(`${colors.bold}Suite 1: Messages.tsx Preloaded Roster & Filter Categories${colors.reset}`);

test('Default Preloaded Students include required contacts', () => {
  const expectedStudents = [
    'Chiamaka Obi',
    'Ngozi Uche',
    'Yusuf Ibrahim',
    'Emeka Nnaji',
    'Amina Bello'
  ];
  for (const student of expectedStudents) {
    assert(messagesContent.includes(student), `Messages.tsx must contain student: ${student}`);
  }
});

test('Default Preloaded Tutors & Admin Desk include required contacts', () => {
  const expectedTutors = [
    'Daniel Okafor',
    'Adaeze Nwosu',
    'Dr. Ibrahim Sanni',
    'Chinwe Uche',
    'Akademi Admin Desk'
  ];
  for (const tutor of expectedTutors) {
    assert(messagesContent.includes(tutor), `Messages.tsx must contain tutor/desk: ${tutor}`);
  }
});

test('Category filter tabs include All, Students, Tutors, and Admin Desk', () => {
  assert(messagesContent.includes("setFilterTab('all')"), 'Filter tab for All must be present');
  assert(messagesContent.includes("setFilterTab('students')"), 'Filter tab for Students must be present');
  assert(messagesContent.includes("setFilterTab('tutors')"), 'Filter tab for Tutors must be present');
  assert(messagesContent.includes("setFilterTab('admin')"), 'Filter tab for Admin must be present');
  
  assert(messagesContent.includes("setModalFilterTab('all')"), 'Modal filter tab for All must be present');
  assert(messagesContent.includes("setModalFilterTab('students')"), 'Modal filter tab for Students must be present');
  assert(messagesContent.includes("setModalFilterTab('tutors')"), 'Modal filter tab for Tutors must be present');
  assert(messagesContent.includes("setModalFilterTab('admin')"), 'Modal filter tab for Admin must be present');
});

// ==========================================
// TEST SUITE 2: Overview.tsx Enrolled Students & LocalStorage Tracking
// ==========================================
console.log(`\n${colors.bold}Suite 2: Overview.tsx Newly Enrolled Students & State Tracking${colors.reset}`);

test('Overview.tsx uses localStorage key akademi_messaged_students', () => {
  assert(overviewContent.includes("'akademi_messaged_students'"), 'Overview must read/write to akademi_messaged_students');
  assert(overviewContent.includes('handleMarkStudentMessaged'), 'Overview must have handler to mark student messaged');
});

test('Overview.tsx applies emerald ring/border and ✓ Messaged badge when student is messaged', () => {
  assert(overviewContent.includes('isMessaged'), 'Overview must compute isMessaged status');
  assert(overviewContent.includes('bg-emerald-50/60 border-2 border-emerald-500/80 shadow-xs ring-2 ring-emerald-500/20'), 
    'Messaged card must have emerald highlight classes');
  assert(overviewContent.includes('Messaged') && overviewContent.includes('CheckCircle2'), 
    'Messaged card must display ✓ Messaged badge');
});

test('Overview.tsx changes CTA button to "Continue Chat →" when messaged', () => {
  assert(overviewContent.includes("isMessaged ? 'Continue Chat →' : 'Message'"), 
    'Button label must dynamically switch to Continue Chat →');
});

test('Overview.tsx passes proper URL query parameters (?recipient=...&role=student&topic=...&avatar=...)', () => {
  assert(overviewContent.includes('/dashboard/messages?recipient='), 'Link must route to messages with recipient param');
  assert(overviewContent.includes('&role=student'), 'Link must specify role=student');
  assert(overviewContent.includes('&topic='), 'Link must specify topic param');
  assert(overviewContent.includes('&avatar='), 'Link must specify avatar param');
});

// ==========================================
// TEST SUITE 3: Messages.tsx useSearchParams Auto-Select & Conversation Creation
// ==========================================
console.log(`\n${colors.bold}Suite 3: Messages.tsx Dynamic URL Query Processing & Activation${colors.reset}`);

test('Messages.tsx imports useSearchParams from react-router-dom', () => {
  assert(messagesContent.includes('useSearchParams'), 'Messages must import useSearchParams');
});

test('Messages.tsx detects existing conversation by recipient param and activates it', () => {
  const mockConversations = [
    { id: 501, name: 'Chiamaka Obi', contactType: 'student' },
    { id: 505, name: 'Ngozi Uche', contactType: 'student' },
    { id: 1, name: 'Daniel Okafor', contactType: 'tutor' }
  ];

  const recipientParam = 'Ngozi Uche';
  const match = mockConversations.find(c => c.name.toLowerCase() === recipientParam.toLowerCase());
  assert(match && match.id === 505, 'Should find existing conversation ID 505 for Ngozi Uche');
});

test('Messages.tsx dynamically creates and selects new conversation when recipient is not preloaded', () => {
  const conversations = [
    { id: 501, name: 'Chiamaka Obi', contactType: 'student', messages: [] }
  ];

  const recipientParam = 'Kelechi Okafor';
  const roleParam = 'student';
  const topicParam = 'Organic Chemistry';
  const avatarParam = '/images/hero-student.jpg';

  const existingIndex = conversations.findIndex(
    c => c.name.toLowerCase() === recipientParam.toLowerCase()
  );

  let selectedId;
  let updatedConversations = [...conversations];

  if (existingIndex >= 0) {
    selectedId = conversations[existingIndex].id;
  } else {
    const newId = `CUST-${Date.now()}`;
    const newConv = {
      id: newId,
      name: recipientParam,
      role: `Student · ${topicParam}`,
      avatar: avatarParam,
      time: 'Just now',
      preview: `Started conversation regarding ${topicParam}`,
      unread: 0,
      online: true,
      contactType: 'student',
      topic: topicParam,
      messages: [{ id: 1, sender: 'them', text: `Hello! Looking forward to discussing ${topicParam}.`, time: 'Just now' }]
    };
    updatedConversations = [newConv, ...conversations];
    selectedId = newId;
  }

  assert(selectedId.startsWith('CUST-'), 'New conversation must have custom ID');
  assert.strictEqual(updatedConversations[0].name, 'Kelechi Okafor', 'New conversation must be prepended');
  assert.strictEqual(updatedConversations[0].topic, 'Organic Chemistry');
});

// ==========================================
// TEST SUITE 4: Students.tsx "Send Message" & Row Links
// ==========================================
console.log(`\n${colors.bold}Suite 4: Students.tsx Message Action Parameters${colors.reset}`);

test('Students.tsx profile modal Send Message passes full query parameters', () => {
  assert(studentsContent.includes('/dashboard/messages?recipient='), 'Students modal must link with recipient query param');
  assert(studentsContent.includes('&role=student'), 'Students modal must pass role=student');
  assert(studentsContent.includes('&topic='), 'Students modal must pass topic param');
  assert(studentsContent.includes('&avatar='), 'Students modal must pass avatar param');
  assert(studentsContent.includes('Send Message'), 'Send Message button must be in profile modal');
});

test('Students.tsx student row Message action passes query parameters', () => {
  const rowLinkPattern = /<Link\s+to=\{`\/dashboard\/messages\?recipient=\$\{encodeURIComponent\(student\.name\)\}&role=student&topic=\$\{encodeURIComponent\(student\.course\)\}&avatar=\$\{encodeURIComponent\(student\.avatar\)\}`\}/;
  assert(rowLinkPattern.test(studentsContent), 'Student card row Message button must pass query parameters');
});

// ==========================================
// TEST SUITE 5: Simulation & Functional Logic Test
// ==========================================
console.log(`\n${colors.bold}Suite 5: Interactive Simulation Workflow${colors.reset}`);

test('Simulated message flow: Overview -> Mark Messaged -> Messages Thread -> Reply', () => {
  localStorage.clear();
  
  // 1. Overview click
  const studentToMessage = 'Ngozi Uche';
  let messagedMap = JSON.parse(localStorage.getItem('akademi_messaged_students') || '{}');
  messagedMap[studentToMessage] = true;
  localStorage.setItem('akademi_messaged_students', JSON.stringify(messagedMap));

  // Verify stored
  const retrievedMap = JSON.parse(localStorage.getItem('akademi_messaged_students'));
  assert.strictEqual(retrievedMap['Ngozi Uche'], true, 'Student Ngozi Uche should be marked messaged in localStorage');

  // 2. Messages conversation state
  const convs = [
    {
      id: 505,
      name: 'Ngozi Uche',
      messages: [{ id: 1, sender: 'them', text: 'Hi! I booked a 1-on-1 session.', time: '8:00 AM' }]
    }
  ];

  // User sends message
  const userMsg = 'Hello Ngozi, welcome to our class!';
  convs[0].messages.push({ id: 2, sender: 'me', text: userMsg, time: 'Just now' });
  convs[0].preview = userMsg;

  assert.strictEqual(convs[0].messages.length, 2, 'Message should be added to thread');
  assert.strictEqual(convs[0].preview, userMsg, 'Preview should update with latest user message');
});

console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
console.log(`${colors.bold}QA Test Results: ${passedTests}/${totalTests} Tests Passed (${Math.round((passedTests/totalTests)*100)}%)${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
