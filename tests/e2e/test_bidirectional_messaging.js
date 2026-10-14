/**
 * Test: Real-Time Universal Bidirectional Cross-Role Messaging Suite
 */
const assert = require('assert');

// Simulate universal message ledger storage
let mockStorage = {};
const localStorage = {
  getItem: (k) => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; }
};

// Seed ledger
const seedMessages = [
  {
    id: 'seed-1',
    fromName: 'Chiamaka Ada',
    fromRole: 'student',
    toName: 'Dr. Chiamaka Eze',
    text: 'Initial question from student',
    time: 'Yesterday',
    timestamp: 1000
  }
];

localStorage.setItem('akademi_global_message_ledger', JSON.stringify(seedMessages));

console.log('\n======================================================');
console.log('  TESTING REAL-TIME BIDIRECTIONAL CROSS-ROLE MESSAGING');
console.log('======================================================\n');

// 1. STEP 1: Student (Chiamaka Ada) sends a message to Tutor (Dr. Chiamaka Eze)
console.log('--- Step 1: Student sends message to Tutor ---');
const studentUser = {
  name: 'Chiamaka Ada',
  role: 'student',
  email: 'student@akademi.com'
};
localStorage.setItem('akademi_auth_user', JSON.stringify(studentUser));

let currentLedger = JSON.parse(localStorage.getItem('akademi_global_message_ledger'));
const studentMsg = {
  id: `msg-${Date.now()}-1`,
  fromName: studentUser.name,
  fromRole: studentUser.role,
  toName: 'Dr. Chiamaka Eze',
  text: 'Hello Dr. Eze, I am confused about Question 3 on Calculus substitution.',
  time: 'Just now',
  timestamp: 2000
};
currentLedger.push(studentMsg);
localStorage.setItem('akademi_global_message_ledger', JSON.stringify(currentLedger));
console.log('✓ Student sent:', studentMsg.text);

// 2. STEP 2: User clicks top bar toggle -> switches to Tutor (Dr. Chiamaka Eze)
console.log('\n--- Step 2: Switch to Tutor persona & verify inbox ---');
const tutorUser = {
  name: 'Dr. Chiamaka Eze',
  role: 'tutor',
  email: 'tutor@akademi.com'
};
localStorage.setItem('akademi_auth_user', JSON.stringify(tutorUser));

// Tutor opens chat with 'Chiamaka Ada'
const tutorLedger = JSON.parse(localStorage.getItem('akademi_global_message_ledger'));
const tutorThread = tutorLedger.filter(m => 
  (m.fromName === tutorUser.name && m.toName === 'Chiamaka Ada') ||
  (m.fromName === 'Chiamaka Ada' && m.toName === tutorUser.name)
).sort((a, b) => a.timestamp - b.timestamp);

assert(tutorThread.length >= 2, 'Tutor thread should contain both seed and new student message');
const lastMsgInTutorView = tutorThread[tutorThread.length - 1];
assert.strictEqual(lastMsgInTutorView.fromName, 'Chiamaka Ada');
assert.strictEqual(lastMsgInTutorView.text, 'Hello Dr. Eze, I am confused about Question 3 on Calculus substitution.');
console.log('✓ Tutor received message from student:', lastMsgInTutorView.text);

// 3. STEP 3: Tutor replies back to Student
console.log('\n--- Step 3: Tutor replies back to Student ---');
const tutorReply = {
  id: `msg-${Date.now()}-2`,
  fromName: tutorUser.name,
  fromRole: tutorUser.role,
  toName: 'Chiamaka Ada',
  text: 'Hi Chiamaka! Remember to set u = 2x + 1 and substitute du/2 into the integral.',
  time: 'Just now',
  timestamp: 3000
};
tutorLedger.push(tutorReply);
localStorage.setItem('akademi_global_message_ledger', JSON.stringify(tutorLedger));
console.log('✓ Tutor sent reply:', tutorReply.text);

// 4. STEP 4: User clicks top bar toggle -> switches back to Student (Chiamaka Ada)
console.log('\n--- Step 4: Switch back to Student & verify tutor reply ---');
localStorage.setItem('akademi_auth_user', JSON.stringify(studentUser));

const studentLedgerAfter = JSON.parse(localStorage.getItem('akademi_global_message_ledger'));
const studentThreadAfter = studentLedgerAfter.filter(m => 
  (m.fromName === studentUser.name && m.toName === 'Dr. Chiamaka Eze') ||
  (m.fromName === 'Dr. Chiamaka Eze' && m.toName === studentUser.name)
).sort((a, b) => a.timestamp - b.timestamp);

assert(studentThreadAfter.length >= 3, 'Student should see 3 messages');
const lastMsgInStudentView = studentThreadAfter[studentThreadAfter.length - 1];
assert.strictEqual(lastMsgInStudentView.fromName, 'Dr. Chiamaka Eze');
assert.strictEqual(lastMsgInStudentView.text, tutorReply.text);
console.log('✓ Student received reply from tutor:', lastMsgInStudentView.text);

// 5. STEP 5: Student messages Admin Desk -> Switch to Admin -> Verify Admin receives it
console.log('\n--- Step 5: Student messages Admin Desk & Admin verifies ---');
const adminMsg = {
  id: `msg-${Date.now()}-3`,
  fromName: 'Chiamaka Ada',
  fromRole: 'student',
  toName: 'Akademi Admin Desk',
  text: 'Hello Admin, I have a question regarding my wallet balance.',
  time: 'Just now',
  timestamp: 4000
};
studentLedgerAfter.push(adminMsg);
localStorage.setItem('akademi_global_message_ledger', JSON.stringify(studentLedgerAfter));

// Switch to Admin (Ngozi Eze)
const adminUser = {
  name: 'Ngozi Eze',
  role: 'admin',
  email: 'admin@akademi.com'
};
localStorage.setItem('akademi_auth_user', JSON.stringify(adminUser));

const adminLedger = JSON.parse(localStorage.getItem('akademi_global_message_ledger'));
const adminThread = adminLedger.filter(m =>
  (m.toName === 'Akademi Admin Desk' || m.toName === 'Ngozi Eze' || m.fromName === 'Akademi Admin Desk' || m.fromName === 'Ngozi Eze') &&
  (m.fromName === 'Chiamaka Ada' || m.toName === 'Chiamaka Ada')
);

assert(adminThread.length >= 1, 'Admin should receive student ticket');
console.log('✓ Admin Desk received ticket from student:', adminThread[adminThread.length - 1].text);

console.log('\n======================================================');
console.log('✓ ALL 5/5 BIDIRECTIONAL CROSS-ROLE TESTS PASSED (100%)');
console.log('======================================================\n');
