# Handoff Report — explorer_btn_2
**Milestone**: R3 (Tutor Teaching & Payout Buttons) & R4 (Admin & Super Admin Governance Buttons) Audit  
**Author**: `explorer_btn_2` (Teamwork Preview Explorer)  
**Date**: 2026-09-07  
**Working Directory**: `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\explorer_btn_2`  
**Handoff Type**: Hard (Task complete)  

---

## 1. Observation

Direct code-level inspection of all button triggers, links, modal handlers, and form submissions across R3 and R4 revealed the following exact observations:

### Observation 1: Calendar Navigation Buttons in `Sessions.tsx` Lack Event Handlers
- **File**: `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\src\pages\dashboard\Sessions.tsx`
- **Lines**: 574–583
- **Verbatim Code**:
  ```tsx
  574: <button type="button" className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded transition-all">
  575:   <ChevronLeft className="w-4 h-4" />
  576: </button>
  577: <button type="button" className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded transition-all">
  578:   <ChevronRight className="w-4 h-4" />
  579: </button>
  580: <button type="button" className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-all">
  581:   Today
  582: </button>
  ```
- **Finding**: None of these three elements have an `onClick` attribute. Clicking them produces no state mutation or visual update.

### Observation 2: Upcoming Card Action Menu in `Sessions.tsx` Lacks Event Handler
- **File**: `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\src\pages\dashboard\Sessions.tsx`
- **Line**: 990
- **Verbatim Code**:
  ```tsx
  990: <button type="button" className="p-1 text-slate-400 hover:text-slate-600 rounded">
  991:   <MoreVertical className="w-4 h-4" />
  992: </button>
  ```
- **Finding**: The `MoreVertical` button on upcoming session cards has no `onClick` attribute.

### Observation 3: Orphaned Quick Notes Modal in `Students.tsx`
- **File**: `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\src\pages\dashboard\Students.tsx`
- **Lines**: 64, 339–397
- **Verbatim Code**:
  ```tsx
  64: const [noteModalStudent, setNoteModalStudent] = useState<Student | null>(null);
  ...
  339: {noteModalStudent && (
  340:   <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
  ...
  397: )}
  ```
- **Finding**: `setNoteModalStudent` is declared at line 64 and reset to `null` on modal dismissal (line 349), but is never set to a student object anywhere in the component markup. Student card line 300 instead invokes `handleOpenNotes(student)` which opens the global `LessonNotesModal` via `activeNotesStudent`. The inline modal at lines 339–397 is dead code.

### Observation 4: Verified Operational Handlers in R3
- **File**: `src/pages/dashboard/Overview.tsx`
  - Line 498: `onClick={() => setAvailabilityModalOpen(true)}` opens modal; line 1245 `onClick={handleSaveAvailability}` saves to `localStorage.getItem('akademi_tutor_availability')`.
  - Line 675: `<Link to={'/classroom/' + session.id}>` initiates WebRTC classroom launch.
  - Line 684: `onClick={() => { setLobbyModalSession(session); setLobbyModalAccessResult(access); }}` opens `ClassroomLobbyModal`.
  - Line 697: `onClick={() => setPrepModalSession(session)}` opens lesson prep drawer.
  - Line 796: `<Link to={'/dashboard/messages?recipient=' + st.studentName}>` marks messaged in `messagedStudents` state and `akademi_messaged_students`.
- **File**: `src/components/ui/LessonNotesModal.tsx`
  - Line 763: Native `<input type="file" multiple ... />` triggered by line 774 button `fileInputRef.current?.click()`.
  - Lines 689 & 738: Task builder buttons for adding takeaways and homework items.
  - Line 830: `onClick={handleSaveTutorNote}` writes to `akademi_session_notes` and fires `dispatchLessonNotesPush()`.
- **File**: `src/pages/dashboard/Billing.tsx`
  - Lines 714–733: Preset buttons (5k, 10k, 25k, 50k) and "Withdraw All" update amount.
  - Line 754: `onClick={handleInitiatePayout}` validates threshold >= 5,000 NGN.
  - Line 1278: `onClick={handleConfirmPayout}` creates payout entry in `akademi_tutor_payouts` and `akademi_user_transactions` with status 'Processing'.

### Observation 5: Verified Operational Handlers in R4
- **File**: `src/pages/admin/AdminOverview.tsx`
  - Lines 235–243: 7d/30d/90d switcher buttons update `activeRange` and dynamically redraw SVG chart bars.
  - Line 172: Stats cards link to `/admin/users`, `/admin/tutors`, `/admin/sessions`, `/admin/payments`, `/admin/communities`.
- **File**: `src/pages/admin/AdminUsers.tsx`
  - Line 378: `onSubmit={handleCreateUser}` persists new user to `akademi_admin_users`.
  - Lines 306–325: `onClick={() => handleToggleStatus(user.id)}` toggles active/suspended status with toast.
  - Line 327: `onClick={() => handleDeleteUser(user.id)}` removes user with toast.
- **File**: `src/pages/admin/AdminTutors.tsx`
  - Line 480: `onClick={() => handleVerify(tutor.id)}` syncs status to `akademi_admin_tutors` and `akademi_registered_tutors`.
  - Line 488: `onClick={() => handleSuspend(tutor.id)}` suspends tutor.
- **File**: `src/pages/admin/AdminPayments.tsx`
  - Line 940: `handleSetDefault` invokes `requestSuperAdminAuth()` to enforce 2FA before gateway changes.
  - Line 959: `handleProbeLatency` tests gateway ping.
  - Line 1109 & 1146: Save commission rate and platform payout schedule.
  - Line 1735: `handleRefundDispute` credits student wallet and records audit log entry.
  - `InitiateRefundModal.tsx` Line 153: Direct ledger refund supports full/partial refund and persists transaction.
- **File**: `src/pages/admin/AdminSettings.tsx`
  - Line 703: `handleProbeSfu` displays Lagos SFU latency toast (24ms).
  - Line 861: `handleSendTestNotification` dispatches in-app push alert.
  - Lines 1045–1068: Favicon preset selector modifies document `<link rel="icon">`.
  - Line 1179: `handleExportConfig` downloads configuration JSON backup.
  - Line 1848 & 1971: Test email sender triggers SMTP simulated delivery.

---

## 2. Logic Chain

1. **Premise**: User actions in interactive web applications must have corresponding event handlers (`onClick`, `onSubmit`, `onChange`, or `<Link to="...">`).
2. **Analysis of Calendar Header**:
   - `Sessions.tsx` line 574, 577, and 580 declare buttons intended to navigate time intervals (`ChevronLeft`, `ChevronRight`, `Today`).
   - Examination of lines 574–583 reveals no `onClick` property or event binding on any of the three `<button>` tags.
   - Therefore, clicking any of these three elements has no programmatic effect (Dead Clicks).
3. **Analysis of Session Card Actions**:
   - `Sessions.tsx` line 990 renders a `<button>` with `<MoreVertical className="w-4 h-4" />`.
   - Inspection of lines 990–992 confirms the absence of an `onClick` property.
   - Therefore, clicking the action trigger on session cards is dead.
4. **Analysis of Students.tsx Modal**:
   - `Students.tsx` lines 339–397 render a modal conditionally when `noteModalStudent` is truthy.
   - A grep search across `Students.tsx` for `setNoteModalStudent` finds only two occurrences: the `useState` definition at line 64 and the close button handler at line 349 (`onClick={() => setNoteModalStudent(null)}`).
   - There are zero calls that pass a `Student` object to `setNoteModalStudent`.
   - Therefore, the modal at lines 339–397 cannot ever be opened by a user in the UI.
5. **Analysis of Tutor Document Inspection**:
   - In `AdminTutors.tsx`, tutors register KYC credentials (ID cards, degrees) stored in `akademi_tutor_kyc`.
   - Inspection of lines 470–505 and modal lines 550–650 reveals no link or button to view or preview KYC attachments prior to clicking "Verify Now".
   - Therefore, document inspection is missing from the admin tutor verification workflow.

---

## 3. Caveats

- **Network-Level API Endpoints**: All tested handlers rely on browser local storage (`localStorage`), in-memory React state, and custom browser events/WebSockets (`dispatchLessonNotesPush`, `appendAppNotification`). Backend REST/GraphQL endpoints were not tested against a live production database because this audit is scoped to the frontend repository.
- **Third-Party Integrations**: LiveKit SFU server ping and SMTP email dispatches are simulated on the frontend with realistic network latency timers (24ms–138ms) and visual feedback toasts.
- **Permissions**: Super Admin master password modal checks against hardcoded test password `akademi_super_2026` as expected in development mode.

---

## 4. Conclusion

The frontend action handler infrastructure across R3 and R4 is structurally complete and exhibits high visual fidelity, thoughtful defensive validation (e.g. payout minimum threshold checks, 2FA challenge modals, and lobby countdown locks), and real-time state synchronizations.

To achieve 100% interactive integrity, four targeted remediation tasks must be dispatched to implementation workers:
1. **Fix Calendar Navigation**: Bind `ChevronLeft`, `ChevronRight`, and `Today` buttons in `Sessions.tsx` (lines 574–583) to active date state manipulation.
2. **Wire Session Card Actions**: Connect `MoreVertical` (line 990) in `Sessions.tsx` to `setSelectedEvent(event)` or an action dropdown menu.
3. **Resolve Student Notes Redundancy**: Remove the orphaned modal markup in `Students.tsx` (lines 339–397) or wire a secondary quick-note trigger.
4. **Add KYC Document Previewer**: Add an "Inspect Documents" button on `AdminTutors.tsx` cards and profile drawer to view submitted certificates.

---

## 5. Verification Method

To independently verify all findings and validate future fixes:

1. **Verify Dead Buttons in `Sessions.tsx`**:
   - Inspect `src/pages/dashboard/Sessions.tsx` at lines 574–583 and line 990 using `view_file`.
   - Confirm lack of `onClick` attributes.
2. **Verify Orphaned State in `Students.tsx`**:
   - Run grep search for `setNoteModalStudent` in `src/pages/dashboard/Students.tsx`:
     Only line 64 and line 349 exist. No trigger exists in card renderers.
3. **Verify Operational Features**:
   - Run frontend dev server: `npm run dev` in `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend`.
   - Open `/dashboard/overview`: Click "Set availability" -> change hours -> click Save -> verify toast appears and `localStorage.getItem('akademi_tutor_availability')` is updated.
   - Open `/dashboard/billing`: Select preset "10,000" -> click "Request Payout" -> confirm modal -> verify balance decreases and transaction is logged.
   - Open `/admin/settings`: Click "Probe SFU Latency" -> verify 24ms ping banner appears; click "Send Test Email" -> submit recipient -> verify simulation toast.
4. **Invalidation Conditions**:
   - If `Sessions.tsx` is updated such that `onClick` handlers are attached to lines 574, 577, 580, and 990, the dead click defect is resolved.
   - If `Students.tsx` wires `setNoteModalStudent(student)` to an action button or removes the duplicate modal, the orphaned code finding is resolved.
