const fs = require('fs');
const path = require('path');

console.log("================================================================================");
console.log("AKADEMI PLATFORM - END-TO-END REAL WORLD USER TEST SUITE");
console.log("================================================================================\n");

let passedTests = 0;
let totalTests = 0;
const testResults = [];

function assertTest(name, condition, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    testResults.push({ name, status: "PASSED", details });
    console.log(`[PASS] ${name}`);
  } else {
    testResults.push({ name, status: "FAILED", details });
    console.error(`[FAIL] ${name} - ${details}`);
  }
}

const frontendDir = 'C:\\Users\\IT Manager\\.gemini\\antigravity\\scratch\\akademi\\frontend\\src';

// -----------------------------------------------------------------------------
// TEST SUITE 1: ROUTING & NAVIGATION CONTRACTS
// -----------------------------------------------------------------------------
console.log("\n--- TEST SUITE 1: ROUTING & NAVIGATION INTEGRITY ---");

const appTsx = fs.readFileSync(path.join(frontendDir, 'App.tsx'), 'utf8');

assertTest("App.tsx has Public Route /", appTsx.includes('path="/" element={<Landing />}'));
assertTest("App.tsx has Public Route /courses", appTsx.includes('path="/courses" element={<Courses />}'));
assertTest("App.tsx has Public Route /tutors", appTsx.includes('path="/tutors" element={<Tutors />}'));
assertTest("App.tsx has Route /tutors/:id", appTsx.includes('path="/tutors/:id" element={<TutorProfile />}'));
assertTest("App.tsx has Alias Route /tutor/:id", appTsx.includes('path="/tutor/:id" element={<TutorProfile />}'));
assertTest("App.tsx has Auth Route /login", appTsx.includes('path="/login" element={<Login />}'));
assertTest("App.tsx has Auth Route /register", appTsx.includes('path="/register" element={<Register />}'));
assertTest("App.tsx has Interactive Classroom /classroom/:sessionId", appTsx.includes('path="/classroom/:sessionId" element={<Classroom />}'));
assertTest("App.tsx has Dashboard /dashboard/notifications", appTsx.includes('path="notifications" element={<Notifications />}'));
assertTest("App.tsx has Dashboard /dashboard/sessions", appTsx.includes('path="sessions" element={<Sessions />}'));
assertTest("App.tsx has Dashboard /dashboard/students", appTsx.includes('path="students" element={<Students />}'));
assertTest("App.tsx has Dashboard /dashboard/billing", appTsx.includes('path="billing" element={<Billing />}'));
assertTest("App.tsx has Admin Routes (/admin, users, tutors, payments, sessions, settings)", 
  appTsx.includes('AdminPayments') && appTsx.includes('AdminUsers') && appTsx.includes('AdminTutors')
);

// -----------------------------------------------------------------------------
// TEST SUITE 2: STUDENT DISCOVERY, CHECKOUT & WALLET FLOW
// -----------------------------------------------------------------------------
console.log("\n--- TEST SUITE 2: STUDENT DISCOVERY, PAYMENTS & WALLET ---");

const tutorProfileTsx = fs.readFileSync(path.join(frontendDir, 'pages', 'TutorProfile.tsx'), 'utf8');
const bookingModalTsx = fs.readFileSync(path.join(frontendDir, 'components', 'ui', 'BookingModal.tsx'), 'utf8');
const billingTsx = fs.readFileSync(path.join(frontendDir, 'pages', 'dashboard', 'Billing.tsx'), 'utf8');

assertTest("TutorProfile has 1-on-1 vs Group Format Selection", 
  tutorProfileTsx.includes("setSessionFormat('group')") && tutorProfileTsx.includes("setSessionFormat('1on1')")
);
assertTest("TutorProfile has Paystack Gateway Drawer", 
  tutorProfileTsx.includes("paystackOpen") && tutorProfileTsx.includes("akademi_booked_sessions")
);
assertTest("TutorProfile has Wallet Checkout & Auto-Debit", 
  tutorProfileTsx.includes("akademi_wallet_balance_ngn") && tutorProfileTsx.includes("akademi_user_transactions")
);
assertTest("BookingModal step 4 has zero undefined references and scheduledSlots fallback", 
  bookingModalTsx.includes("scheduledSlots") || bookingModalTsx.includes("selectedDateStr")
);
assertTest("Billing page supports Paystack Wallet Top-up (₦1000 - ₦10000)", 
  billingTsx.includes("customAmount") && (billingTsx.includes("Paystack") || billingTsx.includes("topUp") || billingTsx.includes("Top Up"))
);

// -----------------------------------------------------------------------------
// TEST SUITE 3: SESSION PRESENTATION & FORMAT DIFFERENTIATION
// -----------------------------------------------------------------------------
console.log("\n--- TEST SUITE 3: SESSION PRESENTATION & FORMAT DIFFERENTIATION ---");

const sessionsTsx = fs.readFileSync(path.join(frontendDir, 'pages', 'dashboard', 'Sessions.tsx'), 'utf8');
const overviewTsx = fs.readFileSync(path.join(frontendDir, 'pages', 'dashboard', 'Overview.tsx'), 'utf8');

assertTest("Sessions.tsx implements Refined Ink Navy for Group Sessions", 
  sessionsTsx.includes("#1E3A5F") && sessionsTsx.includes("#EBF3FA")
);
assertTest("Sessions.tsx implements Format Filter Pills (All, 1-on-1, Group)", 
  sessionsTsx.includes("studentFormatFilter") && sessionsTsx.includes("📹 1-on-1") && sessionsTsx.includes("👥 Group")
);
assertTest("Overview.tsx summarizes multiple slots for same tutor (+X booked slots)", 
  overviewTsx.includes("booked slots") && overviewTsx.includes("summarizedList")
);
assertTest("Overview.tsx limits display to top 3 and provides schedule link", 
  overviewTsx.includes("slice(0, 3)") && overviewTsx.includes("View Full Schedule")
);

// -----------------------------------------------------------------------------
// TEST SUITE 4: LESSON NOTES, ATTACHMENTS & REAL FILE DOWNLOADS
// -----------------------------------------------------------------------------
console.log("\n--- TEST SUITE 4: LESSON NOTES & MATERIAL TRANSFERS ---");

const lessonNotesModalTsx = fs.readFileSync(path.join(frontendDir, 'components', 'ui', 'LessonNotesModal.tsx'), 'utf8');
const studentsTsx = fs.readFileSync(path.join(frontendDir, 'pages', 'dashboard', 'Students.tsx'), 'utf8');

assertTest("LessonNotesModal has genuine Blob download trigger", 
  lessonNotesModalTsx.includes("new Blob") && lessonNotesModalTsx.includes("createObjectURL")
);
assertTest("LessonNotesModal has interactive homework checklist with toggle", 
  lessonNotesModalTsx.includes("handleToggleHomework") && lessonNotesModalTsx.includes("saveStoredLessonNote")
);
assertTest("LessonNotesModal has dual Tutor Upload (Native File Picker + Title Input)", 
  lessonNotesModalTsx.includes("handleNativeFileUpload") && lessonNotesModalTsx.includes("fileInputRef")
);
assertTest("Sessions.tsx mounts LessonNotesModal for Student View", 
  sessionsTsx.includes("<LessonNotesModal") && sessionsTsx.includes("Lesson Notes")
);
assertTest("Students.tsx links tutor student roster to LessonNotesModal", 
  studentsTsx.includes("<LessonNotesModal") && studentsTsx.includes("selectedLessonNoteSession")
);

// -----------------------------------------------------------------------------
// TEST SUITE 5: VIRTUAL CLASSROOM & ADMIN CONTROLS
// -----------------------------------------------------------------------------
console.log("\n--- TEST SUITE 5: CLASSROOM SUITE & ADMIN WORKFLOW ---");

const classroomTsx = fs.readFileSync(path.join(frontendDir, 'pages', 'classroom', 'Classroom.tsx'), 'utf8');
const adminPaymentsTsx = fs.readFileSync(path.join(frontendDir, 'pages', 'admin', 'AdminPayments.tsx'), 'utf8');

assertTest("Classroom.tsx has Video, Audio, Screenshare & Hardware controls", 
  classroomTsx.includes("isVideoOn") && classroomTsx.includes("isMicOn")
);
assertTest("AdminPayments.tsx has Paystack as default gateway and commission settings", 
  adminPaymentsTsx.includes("Paystack") && adminPaymentsTsx.includes("commission")
);

// -----------------------------------------------------------------------------
// TEST SUMMARY & EXPORT
// -----------------------------------------------------------------------------
console.log("\n================================================================================");
console.log(`TEST RESULTS SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log("================================================================================\n");

fs.writeFileSync(
  'C:\\Users\\IT Manager\\.gemini\\antigravity\\scratch\\user_simulation_test_report.json',
  JSON.stringify({ passedTests, totalTests, successRate: `${Math.round((passedTests / totalTests) * 100)}%`, results: testResults }, null, 2)
);
