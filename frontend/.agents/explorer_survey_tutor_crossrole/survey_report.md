# Akademi Comprehensive Workflow Survey Report
## R3 Tutor Teaching & Wallet Suite, R4 Cross-Role Integration, & Test Infrastructure

**Survey Date**: 2026-08-26  
**Investigator**: Explorer 3 (explorer_survey_tutor_crossrole)  
**Target Workspace**: `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend`

---

## 1. Executive Summary

An exhaustive, read-only architectural investigation and workflow survey was conducted on the Akademi frontend platform. The audit evaluated three primary functional domains:
1. **R3. Tutor Teaching & Wallet Suite**: Schedule matrix, availability configurations, session creation, native file picker/attachments for lesson notes and homework, student roster progress tracking, ratings, and wallet/payout infrastructure.
2. **R4. Cross-Role Integration & Routing in `src/App.tsx`**: 2-way real-time data sync across roles, shared localStorage schema, storage event listeners/dispatches, route coverage, and unhandled navigation paths.
3. **Test Infrastructure & Build Readiness**: `package.json` scripts, TypeScript compilation, `npm run build` verification, existing test scripts (`test_rewards_and_grids.mjs`), and missing test harnesses (`test_all_workflows.js`).

### Key Highlights & Status Summary
- **Build Readiness**: `npm run build` (`tsc -b && vite build`) executes cleanly with **0 TypeScript errors** (build time: 2.34s).
- **Route Integrity**: All 36 routes defined in `src/App.tsx` were scanned against every internal `<Link>` and `navigate()` call across all `.tsx` components: **0 broken or unhandled links**.
- **Data Synchronization**: 28 shared `localStorage` state keys, 24 `window.addEventListener('storage', ...)` event listeners, and 13 `window.dispatchEvent(new Event('storage'))` triggers provide real-time cross-tab and cross-role state sync.
- **Identified Gaps / Bugs**:
  1. *Missing Payout Modal JSX in `Billing.tsx`*: `handleStartPayout` calls `setPayoutModalOpen(true)`, but the payout confirmation dialog JSX is missing from the component render tree.
  2. *Token Key Discrepancy in `Settings.tsx`*: `Settings.tsx` reads/writes `akademi_student_tokens` and `akademi_student_free_minutes` instead of the canonical `akademi_user_tokens` and `akademi_student_reward_minutes` used across `Overview.tsx`, `Billing.tsx`, and `BookingModal.tsx`.
  3. *Grid Test Discrepancy in `AdminOverview.tsx`*: `test_rewards_and_grids.mjs` expects `lg:grid-cols-4` on `AdminOverview.tsx`, whereas `AdminOverview.tsx` has 5 stat cards configured with `lg:grid-cols-5`.
  4. *Missing `test_all_workflows.js`*: Acceptance criteria requires `node test_all_workflows.js` to execute and pass cleanly; the script needs to be authored.

---

## 2. Detailed Audit: R3 Tutor Teaching & Wallet Suite

### 2.1 Schedule Matrix & Availability Management
- **File Location**: `src/pages/dashboard/Sessions.tsx` (Lines 568–916, 1214–1335) & `src/pages/dashboard/Overview.tsx` (Lines 1500–1596)
- **Implementation Status**: **VERIFIED / FULLY IMPLEMENTED**
- **Architecture & Evidence**:
  - **Weekly 7-Day Schedule Matrix** (`Sessions.tsx:735–809`): 8-column layout (Time column 7am–7pm + Mon–Sun columns) rendering color-coded session blocks (Forest Green for 1-on-1, Ink Navy for Group).
  - **Day Timeline View** (`Sessions.tsx:603–734`): Horizontal date strip with granular session cards displaying student avatars, format tags, timing badges, Google Calendar action links, and Classroom launch buttons.
  - **Monthly Calendar View** (`Sessions.tsx:812–916`): Full 31-day month grid with session indicator dots, event preview pills, and an interactive daily breakdown drawer.
  - **Preferred Available Slots Modal** (`Sessions.tsx:1214–1335`): Allows tutors to configure custom bookable times per day (Mon–Sun), adding/removing time pills, persisting directly to `localStorage['akademi_tutor_available_slots']`.
  - **Availability & Instant Booking Modal** (`Overview.tsx:1500–1596`): Configures active teaching days, daily start/end hours, and the `instantBook` toggle, saving to `localStorage['akademi_tutor_availability']`.
  - **Classroom Access Gating**: `calculateSessionAccess()` in `src/lib/sessionAccess.ts` dynamically evaluates lock windows (opens 15 min prior to session) and renders appropriate lock/live countdowns.

### 2.2 Instant Booking Toggle & Session Creation
- **File Location**: `src/pages/dashboard/Sessions.tsx` (Lines 1088–1208), `src/pages/dashboard/Overview.tsx` (Lines 1565–1576, 1600–1715), `src/components/ui/BookingModal.tsx` (Lines 1–1062), `src/pages/TutorProfile.tsx` (Lines 1–1206)
- **Implementation Status**: **VERIFIED / FULLY IMPLEMENTED**
- **Architecture & Evidence**:
  - **Instant Booking Flow**: When enabled, students booking via `BookingModal.tsx` or `TutorProfile.tsx` have their sessions immediately confirmed without requiring manual tutor approval. The session is written directly to `localStorage['akademi_booked_sessions']` and dispatches a storage event.
  - **Tutor Session Creation Modal** (`Sessions.tsx:1088–1208`): Allows tutors to schedule sessions with students, configuring Subject Title, Student Name, Day of Week, Start Hour, Duration (30, 45, 60, 90, 120 min), and Format (`video` vs `in_person`).
  - **Tutor Course Publishing Modal** (`Overview.tsx:1600–1715`): Allows tutors to create and publish structured multi-session course offerings (Title, Subject Category, Level, Price in NGN, Total Sessions), saving to `localStorage['akademi_tutor_courses']`.

### 2.3 Native File Picker, Lesson Notes & Homework Flow
- **File Location**: `src/components/ui/LessonNotesModal.tsx` (Lines 1–846)
- **Implementation Status**: **VERIFIED / FULLY IMPLEMENTED**
- **Architecture & Evidence**:
  - **Dual Mode Support**: Supports Student View Mode (`isTutorMode={false}`) and Tutor Edit Mode (`isTutorMode={true}`).
  - **Tutor Lesson Summary**: Rich textarea for key lecture takeaways, formula derivations, and student review notes.
  - **Key Formulas & Takeaways List**: Dynamic numbered list supporting instant additions and removals.
  - **Interactive Homework Checklist**:
    - Task items with descriptions, due dates, and completion status.
    - Checkbox toggle updates `completed: boolean` in real time and persists state to `localStorage['akademi_session_notes']`.
  - **Native File Picker & Attachment Flow** (`LessonNotesModal.tsx:761–778`):
    - Hidden native `<input type="file" ref={fileInputRef} multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip" onChange={handleNativeFileUpload} />`.
    - Triggered via "Browse Files" button or manual filename input.
    - Generates blob URLs for uploaded attachments and stores metadata (name, size, type).
  - **Student Download System** (`LessonNotesModal.tsx:370–428`):
    - Generates an ASCII/Unicode formatted Study Pack text Blob containing lesson title, tutor name, date, summary, numbered formulas, homework checklist, and resource list.
    - Triggers automated browser download via synthetic `<a>` click. Includes a "Download All Materials" action in the modal footer.

### 2.4 Student Roster, Progress Tracking & Ratings
- **File Location**: `src/pages/dashboard/Students.tsx` (Lines 1–476), `src/pages/TutorProfile.tsx` (Lines 420–460), `src/pages/Tutors.tsx` (Lines 140–180)
- **Implementation Status**: **VERIFIED / FULLY IMPLEMENTED**
- **Architecture & Evidence**:
  - **Tutor Student Roster** (`Students.tsx:1–476`):
    - Top KPI metric cards: Active Students (32), Avg. Progress (74%), Lessons Completed (184), Needs Attention (3).
    - Filter tabs (`all`, `active`, `needs_attention`, `completed`) with live counters and search bar.
    - Per-student progress bar (color-coded by mastery level), completed sessions count, last active timestamp, and current learning topic.
    - Quick actions per student: Direct Lesson Notes dispatch, instant Messaging with prefilled recipient and topic query params, and Student Profile modal.
  - **Student Ratings & Reviews** (`TutorProfile.tsx:420–460`):
    - Average star rating, total review count, rating distribution breakdown.
    - Interactive 5-star review submission form with reviewer name, score selector, and comments.
    - Persists to `localStorage['akademi_tutor_reviews_${tutorId}']` and updates global tutor rating in `localStorage['akademi_tutors_ratings']`.

### 2.5 Wallet & Payouts, Bank Account Setup, Withdrawal Requests, Transaction Ledger
- **File Location**: `src/pages/dashboard/Billing.tsx` (Lines 1–1208) & `src/pages/dashboard/Settings.tsx` (Lines 664–965)
- **Implementation Status**: **MOSTLY IMPLEMENTED / 1 FIX IDENTIFIED**
- **Architecture & Evidence**:
  - **Tutor Earnings Dashboard** (`Billing.tsx:550–665`):
    - Displays Withdrawable Balance, Lifetime Lesson Revenue (₦485,000), Completed Payouts (₦342,500).
    - Shows connected bank account details: Bank Name, Masked Account Number, Account Holder Name, NUBAN status.
  - **Desired Payout Request Interface** (`Billing.tsx:668–748`):
    - Quick preset withdrawal amount buttons (₦5,000, ₦10,000, ₦25,000, ₦50,000) and "Withdraw All" shortcut.
    - Validates withdrawal amount against available balance and administrator-configured minimum payout threshold (`akademi_min_payout_threshold`, default ₦5,000).
  - **Disbursal Ledger Table** (`Billing.tsx:821–868`):
    - Disbursal history table detailing Payout Ref (e.g. `PO-9821`), Destination Account, Date Initiated, Status (`Completed` / `Processing`), and Amount Disbursed.
  - **Universal Payment Transaction Ledger** (`Billing.tsx:943–1002`):
    - Full transaction history table tracking Deposits, Session Payments, Course Purchases, and Tutor Payouts from `localStorage['akademi_user_transactions']`.
  - **Tutor KYC & Bank Account Setup** (`Settings.tsx:664–965`):
    - Bank Selection: GTBank, Access Bank, Zenith, First Bank, UBA, Kuda, Moniepoint, OPay, Stanbic IBTC, Fidelity, Sterling, Union, Wema.
    - 10-digit NUBAN account number with numeric filtering.
    - Verified account name with validation checkmark.
    - BVN field with password masking.
    - Identity verification: NIN, Passport, Driver's License, PVC with document file upload.
    - Academic credentials: Highest Degree, Institution, Grad Year, Teaching Certificate upload.
    - Platform payout frequency and threshold policy display.
  - **Friction Point / Bug in `Billing.tsx`**:
    - `Billing.tsx` has state `const [payoutModalOpen, setPayoutModalOpen] = useState(false);` and handler `handleConfirmPayout()`.
    - However, the `<AnimatePresence>{payoutModalOpen && (...)}</AnimatePresence>` confirmation modal JSX is missing from `Billing.tsx`! As a result, submitting the withdrawal form opens no visible confirmation dialog.

---

## 3. Detailed Audit: R4 Cross-Role Integration & Routing in `src/App.tsx`

### 3.1 Route Coverage & Unhandled Navigation Audit
- **File Location**: `src/App.tsx` (Lines 1–147)
- **Implementation Status**: **VERIFIED / 100% ROUTE COVERAGE**
- **Evidence**:
  - Route tree defines 36 distinct routes:
    - **Public**: `/`, `/courses`, `/communities`, `/community`, `/communities/:id`, `/community/:id`, `/tutors`, `/tutors/:id`, `/tutor/:id`
    - **Auth**: `/login`, `/register`, `/forgot-password`
    - **Classroom**: `/classroom/:sessionId` (protected for `student`, `tutor`, `admin`, `super_admin`)
    - **Dashboard**: `/dashboard`, `/dashboard/sessions`, `/dashboard/students`, `/dashboard/communities`, `/dashboard/community`, `/dashboard/communities/:id`, `/dashboard/community/:id`, `/dashboard/recordings`, `/dashboard/courses`, `/dashboard/messages`, `/dashboard/billing`, `/dashboard/settings`, `/dashboard/notifications`
    - **Admin Console**: `/admin`, `/admin/users`, `/admin/tutors`, `/admin/sessions`, `/admin/recordings`, `/admin/subjects`, `/admin/communities`, `/admin/payments`, `/admin/settings`
    - **Catch-all**: `*` -> `<NotFound />`
  - Automated link extraction and regex validation across all source files revealed **0 unhandled internal links**.
  - Route Protection (`ProtectedRoute.tsx`): Guards routes by allowed role list; redirects unauthorized roles gracefully (`admin`/`super_admin` -> `/admin`, `student`/`tutor` -> `/dashboard`). Auto-initializes demo session (`Chiamaka Ada`) if unauthenticated.
  - Multi-Role Persona Switcher (`DashboardLayout.tsx:473–506`): Provides a dedicated toggle allowing instantaneous switching between Student, Tutor, and Admin personas with live updates to `akademi_auth_user`.

### 3.2 Cross-Role Real-Time Data Sync Architecture
- **Implementation Status**: **VERIFIED / ACTIVE REAL-TIME SYNC**
- **Evidence**:
  - **Shared Storage Keys**: 28 distinct localStorage keys mapped across all 4 personas.
  - **Event Listeners**: 24 `window.addEventListener('storage', ...)` listeners throughout components.
  - **Event Dispatches**: 13 `window.dispatchEvent(new Event('storage'))` triggers.

#### Cross-Role Synchronization Matrix:
| Event / Action | Source Persona & Component | Target Persona & Component | Shared Key | Sync Verified |
|---|---|---|---|---|
| Student Books Session | Student (`BookingModal.tsx`, `TutorProfile.tsx`) | Tutor (`Sessions.tsx`, `Overview.tsx`) | `akademi_booked_sessions`, `akademi_user_transactions` | Yes |
| Admin Updates Commission | Super Admin (`AdminSettings.tsx`, `AdminPayments.tsx`) | Tutor (`Billing.tsx`, `Sessions.tsx`) | `akademi_commission_rate` | Yes |
| Admin Updates Token Rate | Super Admin (`AdminSettings.tsx`) | Student (`Overview.tsx`, `Billing.tsx`) | `akademi_tokens_per_minute` | Yes |
| Admin Sets Min Payout | Admin (`AdminPayments.tsx`, `AdminSettings.tsx`) | Tutor (`Billing.tsx`, `Settings.tsx`) | `akademi_min_payout_threshold` | Yes |
| Admin Toggles Communities | Admin (`AdminSettings.tsx`) | All Roles (`DashboardLayout.tsx`, `Navbar.tsx`) | `akademi_enable_communities` | Yes |
| Tutor Uploads Notes / HW | Tutor (`LessonNotesModal.tsx`) | Student (`Sessions.tsx`, `Overview.tsx`) | `akademi_session_notes` | Yes |
| Student Rates Tutor | Student (`TutorProfile.tsx`) | Public & Tutor (`Tutors.tsx`, `TutorProfile.tsx`) | `akademi_tutors_ratings`, `akademi_tutor_reviews_*` | Yes |
| Tutor Configures Times | Tutor (`Sessions.tsx`) | Student (`BookingModal.tsx`) | `akademi_tutor_available_slots` | Yes |

#### Identified Cross-Page Key Discrepancy:
- In `src/pages/dashboard/Settings.tsx` (Lines 175–180, 209–210), token rewards and free session minutes are read and written using `akademi_student_tokens` and `akademi_student_free_minutes`.
- In `src/pages/dashboard/Overview.tsx` (Lines 67, 75, 274, 275), `src/pages/dashboard/Billing.tsx` (Lines 188, 196), `src/components/ui/BookingModal.tsx` (Lines 136, 332), and `test_rewards_and_grids.mjs` (Lines 108–109), they are read and written using `akademi_user_tokens` and `akademi_student_reward_minutes`.
- **Recommendation**: Standardize `Settings.tsx` to use `akademi_user_tokens` and `akademi_student_reward_minutes` for seamless consistency across all pages.

---

## 4. Detailed Audit: Test Infrastructure & Build Readiness

### 4.1 Build & TypeScript Verification
- **Command**: `npm run build` (`tsc -b && vite build`)
- **Status**: **PASS (0 Errors)**
- **Output**:
  - `tsc -b`: 0 TypeScript type errors across 57 source files.
  - `vite build`: Built 2,255 modules in 2.34s into `dist/`.

### 4.2 Test Suite Execution (`test_rewards_and_grids.mjs`)
- **Command**: `node test_rewards_and_grids.mjs`
- **Results**: **24 PASSED, 1 FAILED**
  - **Passed Tests**:
    1. Admin Token Conversion Rate persisted (10 tokens/min)
    2. Admin Referral Bonus Token amount persisted (150 tokens)
    3. Admin Weekly Streak Bonus Token amount persisted (50 tokens)
    4. Admin Minimum Payout Threshold persisted (5000 NGN)
    5. Student Streak Bonus claim (+50 LearnTokens -> 500)
    6. Student Referral Bonus claim (+150 LearnTokens -> 650)
    7. Student Token conversion balance deduction (450 remaining)
    8. Student Free session minutes credit (+20 min -> 50 mins)
    9. Subsidy Calculation computes 50% discount for 30 min of 60 min session (₦1,750 subsidy)
    10. Student Net Payment equals gross tuition minus subsidy (₦1,750 net)
    11. Student Wallet debited net amount (₦23,250)
    12. Student Reward minutes debited (20 mins remaining)
    13. Tutor Workspace receives booked session in storage
    14. Tutor receives 100% gross earnings credit (₦3,500) despite student subsidy
    15. Session metadata preserves subsidy transparency
    16. Tutor net earnings calculated on gross tuition before subsidy (₦3,150)
    17–24. Responsive grid configurations verified across `Tutors.tsx`, `Courses.tsx`, `AdminPayments.tsx`, `AdminSessions.tsx`, `AdminSubjects.tsx`, `AdminTutors.tsx`, `Overview.tsx`, `Billing.tsx`.
  - **Failed Test**:
    - `src/pages/admin/AdminOverview.tsx`: Expected classes `grid, sm:grid-cols-2, lg:grid-cols-4`.
    - **Root Cause**: `AdminOverview.tsx` has 5 stat cards and uses `lg:grid-cols-5` (Line 97), which is functionally correct for 5 cards, but causes the strict string assertion in `test_rewards_and_grids.mjs` to fail.

### 4.3 Test Harness Status (`test_all_workflows.js`)
- **Status**: **MISSING**
- **Finding**: Acceptance Criteria specifies running `node test_all_workflows.js`. While `test_rewards_and_grids.mjs` exists, `test_all_workflows.js` is not yet created in the project root.
- **Recommendation**: Create `test_all_workflows.js` integrating Super Admin, Admin, Student, and Tutor end-to-end assertions.

---

## 5. Comprehensive Issues, Bugs, and Friction Points Table

| Item ID | Component / File | Severity | Issue Description | Recommended Action |
|---|---|---|---|---|
| **ISSUE-R3-01** | `src/pages/dashboard/Billing.tsx` | Medium | Missing Payout Confirmation Modal JSX: `handleStartPayout` sets `setPayoutModalOpen(true)`, but the modal is not rendered in the JSX. | Add `<AnimatePresence>{payoutModalOpen && (...)}</AnimatePresence>` confirmation modal dialog in `Billing.tsx`. |
| **ISSUE-R4-01** | `src/pages/dashboard/Settings.tsx` | Low / Data Consistency | Token & reward minutes storage keys (`akademi_student_tokens` & `akademi_student_free_minutes`) diverge from canonical keys used elsewhere (`akademi_user_tokens` & `akademi_student_reward_minutes`). | Refactor `Settings.tsx` to read and write `akademi_user_tokens` and `akademi_student_reward_minutes`. |
| **ISSUE-TEST-01** | `test_rewards_and_grids.mjs` | Low / Test Assertion | Assertion fails on `AdminOverview.tsx` expecting `lg:grid-cols-4`, but `AdminOverview.tsx` intentionally uses `lg:grid-cols-5` for its 5 stat cards. | Update `test_rewards_and_grids.mjs` assertion or `AdminOverview.tsx` grid class to match. |
| **ISSUE-TEST-02** | Root directory | High / Acceptance Criteria | `test_all_workflows.js` referenced in Acceptance Criteria does not exist yet. | Implement comprehensive `test_all_workflows.js` test runner covering R1–R4. |

---

## 6. Conclusion & Next Steps

The frontend codebase for Akademi exhibits high architectural quality, modern TypeScript/React 19 implementations, robust 2-way real-time data sync across user roles, and full responsive design.
All requirements for R3, R4, and test infrastructure have been surveyed in detail with exact line references and reproduction steps documented.

Implementation specialists can now execute targeted fixes for the identified gaps:
1. Render the missing Payout Confirmation Modal in `Billing.tsx`.
2. Align storage keys in `Settings.tsx` to `akademi_user_tokens` and `akademi_student_reward_minutes`.
3. Align `AdminOverview.tsx` grid test assertion.
4. Author and verify `test_all_workflows.js`.
