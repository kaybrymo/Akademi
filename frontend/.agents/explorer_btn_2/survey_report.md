# Exhaustive Code-Level Survey & Interactive Audit Report
**Scope**: R3 (Tutor Teaching & Payout Buttons) & R4 (Admin & Super Admin Governance Buttons)  
**Target Repository**: `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend`  
**Auditor**: `explorer_btn_2` (Teamwork Preview Explorer)  
**Date**: 2026-09-07  

---

## Executive Summary

An exhaustive code-level survey and interactive audit was conducted across all pages, modals, drawers, and action handlers for **R3 (Tutor Teaching & Payout Buttons)** and **R4 (Admin & Super Admin Governance Buttons)**.

### Overall Assessment:
- **Total Components Audited**: 10 primary modules and modals across `src/pages/dashboard/`, `src/pages/admin/`, and `src/components/ui/`.
- **R3 Status**: Mostly functional with high-quality UI and localStorage persistence. **4 critical defects / dead clicks** identified:
  1. `Sessions.tsx` calendar navigation header controls (`ChevronLeft`, `ChevronRight`, `Today`) have **NO `onClick` handler** (lines 574–583).
  2. `Sessions.tsx` upcoming session card action menu (`MoreVertical`) has **NO `onClick` handler** (line 990).
  3. `Sessions.tsx` lacks an instant booking toggle (it was placed only in `Overview.tsx`).
  4. `Students.tsx` has an orphaned modal and state (`noteModalStudent` at lines 339–397) that is never opened by any UI trigger; also lacks a dedicated "View Progress" button.
- **R4 Status**: Highly robust governance implementation with full Super Admin 2FA challenge flows, gateway probes, SFU WebRTC ping simulation, test push dispatches, and CSV exports. **1 missing capability** identified:
  1. `AdminTutors.tsx` lacks a document inspection viewer/link to review tutor KYC identity cards, degrees, or certifications.

---

## Part 1: Detailed Catalog of R3 (Tutor Teaching & Payout Buttons)

### 1.1 Tutor Overview (`src/pages/dashboard/Overview.tsx`)
**Component Path**: `src/pages/dashboard/Overview.tsx` (1930 lines)

| Button / Link Element | Location | Action / Handler | State Mutation & Storage | Functional Status |
| :--- | :--- | :--- | :--- | :--- |
| **"Set availability"** | Line 498 | `onClick={() => setAvailabilityModalOpen(true)}` | Opens `AvailabilityModal` | ✅ Fully Functional |
| **"New course"** | Line 508 | `onClick={() => setNewCourseModalOpen(true)}` | Opens `NewCourseModal` | ✅ Fully Functional |
| **Save Availability Button** | Lines 1245–1256 | `onClick={handleSaveAvailability}` | Writes to `localStorage.setItem('akademi_tutor_availability', ...)` + Toast | ✅ Fully Functional |
| **Publish Course Button** | Lines 1378–1390 | `onSubmit={handleSaveCourse}` | Writes to `localStorage.setItem('akademi_tutor_courses', ...)` + Toast | ✅ Fully Functional |
| **"Enter Classroom" (Live Session)** | Line 675 | `<Link to={'/classroom/' + session.id}>` | Navigates to WebRTC classroom route | ✅ Fully Functional |
| **"Open Lobby" (Locked Session)** | Lines 684–689 | `onClick={() => { setLobbyModalSession(session); setLobbyModalAccessResult(access); }}` | Opens `ClassroomLobbyModal` with countdown timer | ✅ Fully Functional |
| **"Prep" (Lesson Prep Drawer)** | Line 697 | `onClick={() => setPrepModalSession(session)}` | Opens lesson prep drawer with student profile & materials | ✅ Fully Functional |
| **"Launch Classroom Early"** | Lines 1503–1514 | `<Link to={'/classroom/' + prepModalSession.id}>` | Direct classroom launch shortcut from prep drawer | ✅ Fully Functional |
| **Message Student Shortcut** | Line 796 | `<Link to={'/dashboard/messages?recipient=' + st.studentName}>` with `onClick={() => handleMarkStudentMessaged(st.studentName)}` | Updates `messagedStudents` state + writes to `akademi_messaged_students` | ✅ Fully Functional |
| **"View Session" / "View All"** | Lines 809, 816 | `<Link to="/dashboard/sessions">` | Navigates to schedule matrix | ✅ Fully Functional |
| **"Withdraw earnings"** | Line 878 | `<Link to="/dashboard/billing">` | Navigates to tutor billing portal | ✅ Fully Functional |
| **"Active students"** | Line 902 | `<Link to="/dashboard/students">` | Navigates to tutor student roster | ✅ Fully Functional |

---

### 1.2 Tutor Schedule Matrix (`src/pages/dashboard/Sessions.tsx`)
**Component Path**: `src/pages/dashboard/Sessions.tsx` (1695 lines)

| Button / Link Element | Location | Action / Handler | State Mutation & Storage | Functional Status |
| :--- | :--- | :--- | :--- | :--- |
| **Calendar Previous (`ChevronLeft`)** | Line 574 | `<button type="button" className="p-1.5 ...">` | **NONE (Missing `onClick`)** | ❌ **CRITICAL DEFECT: Dead Click** |
| **Calendar Next (`ChevronRight`)** | Line 577 | `<button type="button" className="p-1.5 ...">` | **NONE (Missing `onClick`)** | ❌ **CRITICAL DEFECT: Dead Click** |
| **Calendar "Today" Button** | Line 580 | `<button type="button" className="px-3 py-1 ...">Today</button>` | **NONE (Missing `onClick`)** | ❌ **CRITICAL DEFECT: Dead Click** |
| **Upcoming Card Actions (`MoreVertical`)** | Line 990 | `<button type="button" className="p-1 text-slate-400 ...">` | **NONE (Missing `onClick`)** | ❌ **CRITICAL DEFECT: Dead Click** |
| **View Mode Switcher (Day)** | Line 511 | `onClick={() => setViewMode('day')}` | `setViewMode('day')` | ✅ Fully Functional |
| **View Mode Switcher (Week)** | Line 516 | `onClick={() => setViewMode('week')}` | `setViewMode('week')` | ✅ Fully Functional |
| **View Mode Switcher (Month)** | Line 521 | `onClick={() => setViewMode('month')}` | `setViewMode('month')` | ✅ Fully Functional |
| **"Preferred Meeting Times"** | Line 498 | `onClick={() => setSlotConfigModalOpen(true)}` | Opens weekly slot manager modal | ✅ Fully Functional |
| **"Google Calendar" Sync** | Line 528 | `onClick={handleToggleGoogleCalendar}` | Opens `GoogleAuthModal` in `calendar_connect` mode | ✅ Fully Functional |
| **"+ New session"** | Line 558 | `onClick={() => setNewSessionModalOpen(true)}` | Opens session creation modal | ✅ Fully Functional |
| **Create Session Form Submit** | Lines 1204–1215 | `onSubmit={handleCreateSession}` | Updates `events` state + Toast alert | ✅ Fully Functional |
| **Save Slot Config** | Lines 1162–1170 | `onClick={handleSaveSlotConfig}` | Writes to `localStorage.setItem('akademi_tutor_available_slots', ...)` + Toast | ✅ Fully Functional |
| **Inspect Event in Modal** | Line 847 | `onClick={() => setSelectedEvent(event)}` | Sets `selectedEvent` state | ✅ Fully Functional |
| **Join Classroom from Event Modal** | Line 1056 | `<Link to={'/classroom/' + selectedEvent.id}>` | Navigates to WebRTC classroom | ✅ Fully Functional |
| **Instant Booking Switch** | Missing | **Not present in Sessions.tsx** | Located only in `Overview.tsx` Availability Modal | ⚠️ **MISSING CAPABILITY** |
| **Session Edit / Reschedule** | Missing | Selected Event Modal only displays details | Has no edit/cancel/reschedule buttons | ⚠️ **MISSING CAPABILITY** |

---

### 1.3 Lesson Notes Upload (`src/components/ui/LessonNotesModal.tsx`)
**Component Path**: `src/components/ui/LessonNotesModal.tsx` (848 lines)

| Button / Link Element | Location | Action / Handler | State Mutation & Storage | Functional Status |
| :--- | :--- | :--- | :--- | :--- |
| **Native File Picker Input** | Line 763 | `<input type="file" ref={fileInputRef} onChange={handleNativeFileUpload} className="hidden" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip" />` | Generates Blob URLs, file size calculations, appends to `editAttachments` | ✅ Fully Functional |
| **"Upload Lesson Materials" Button** | Line 774 | `onClick={() => fileInputRef.current?.click()}` | Triggers file picker dialog | ✅ Fully Functional |
| **Remove Uploaded File** | Line 798 | `onClick={() => handleRemoveAttachment(att.id)}` | Filters attachment from `editAttachments` | ✅ Fully Functional |
| **Add Key Takeaway** | Line 689 | `onClick={handleAddKeyPoint}` | Appends takeaway string to `editKeyTakeaways` | ✅ Fully Functional |
| **Remove Key Takeaway** | Line 704 | `onClick={() => handleRemoveKeyPoint(i)}` | Removes takeaway from array | ✅ Fully Functional |
| **Add Homework Item** | Line 738 | `onClick={handleAddHomework}` | Appends homework object `{ id, text, dueDate, completed }` to `editHomework` | ✅ Fully Functional |
| **Remove Homework Item** | Line 748 | `onClick={() => handleRemoveHomework(item.id)}` | Filters out homework item | ✅ Fully Functional |
| **Toggle Homework Completion** | Line 718 | `onClick={() => handleToggleHomework(item.id)}` | Toggles boolean in state | ✅ Fully Functional |
| **"Save & Publish Notes"** | Line 830 | `onClick={handleSaveTutorNote}` | Writes to `localStorage.setItem('akademi_session_notes', ...)`, dispatches WebSocket event via `dispatchLessonNotesPush()`, displays toast | ✅ Fully Functional |
| **Download Lesson Notes Summary Pack** | Line 635 | `onClick={triggerDownload}` | Generates text blob from summary + tasks and downloads file | ✅ Fully Functional |

---

### 1.4 Tutor Student Roster (`src/pages/dashboard/Students.tsx`)
**Component Path**: `src/pages/dashboard/Students.tsx` (476 lines)

| Button / Link Element | Location | Action / Handler | State Mutation & Storage | Functional Status |
| :--- | :--- | :--- | :--- | :--- |
| **Filter Tabs (All, Active, etc.)** | Line 238 | `onClick={() => setActiveTab(tab.id)}` | Sets `activeTab` state | ✅ Fully Functional |
| **Search Filter Input** | Line 248 | `onChange={(e) => setSearchQuery(e.target.value)}` | Real-time filtering by name/subject | ✅ Fully Functional |
| **"Notes ({count})" Button** | Line 300 | `onClick={() => handleOpenNotes(student)}` | Opens `LessonNotesModal` in tutor mode (`isTutorMode={true}`) | ✅ Fully Functional |
| **"Message" Link** | Line 316 | `<Link to={'/dashboard/messages?recipient=' + encodeURIComponent(student.name)}>` | Navigates to `/dashboard/messages` | ✅ Fully Functional |
| **"Profile" Button** | Line 325 | `onClick={() => setSelectedStudent(student)}` | Opens Student Profile Inspection Modal | ✅ Fully Functional |
| **Profile Modal Close Button** | Line 407 | `onClick={() => setSelectedStudent(null)}` | Dismisses modal | ✅ Fully Functional |
| **Profile Modal "Send Message"** | Line 468 | `<Link to={'/dashboard/messages?recipient=' + encodeURIComponent(selectedStudent.name)}>` | Message shortcut from profile modal | ✅ Fully Functional |
| **Orphaned Notes & Homework Modal** | Lines 339–397 | Defines modal bound to `noteModalStudent` & `handleSaveNote` | **NEVER TRIGGERED in UI**: `setNoteModalStudent` is never called! (The "Notes" button calls `handleOpenNotes` which opens `LessonNotesModal` instead). | ⚠️ **DEAD CODE / ORPHANED MODAL** |
| **"View Progress" Button** | Missing | Inline progress bar exists, but no dedicated button to view curriculum breakdown | No dedicated button | ⚠️ **MISSING CAPABILITY** |

---

### 1.5 Tutor Billing & Payouts (`src/pages/dashboard/Billing.tsx`)
**Component Path**: `src/pages/dashboard/Billing.tsx` (1318 lines)

| Button / Link Element | Location | Action / Handler | State Mutation & Storage | Functional Status |
| :--- | :--- | :--- | :--- | :--- |
| **Preset Payout Amount Pills (5k, 10k, 25k, 50k)** | Lines 714–728 | `onClick={() => setPayoutAmount(String(preset))}` | Updates `payoutAmount` state | ✅ Fully Functional |
| **"Withdraw All" Shortcut** | Line 733 | `onClick={() => setPayoutAmount(String(withdrawableBalance))}` | Sets full balance in input | ✅ Fully Functional |
| **"Request Payout" Button** | Line 754 | `onClick={handleInitiatePayout}` | Validates amount >= 5000 and <= balance; opens `PayoutModal` | ✅ Fully Functional |
| **"Confirm Payout" Button** | Line 1278 | `onClick={handleConfirmPayout}` | Sets `isProcessing(true)`, creates entry in `akademi_tutor_payouts` and `akademi_user_transactions`, updates balance, closes modal, displays toast | ✅ Fully Functional |
| **Filter Tabs (All, Earnings, Payouts, Top-Ups)** | Line 815 | `onClick={() => setActiveTab(tab.id)}` | Filters transaction ledger | ✅ Fully Functional |
| **Export Statement (CSV)** | Line 801 | `onClick={handleExportStatement}` | Generates CSV Blob and triggers browser download | ✅ Fully Functional |
| **"Add Funds" (Wallet Top-Up)** | Line 581 | `onClick={() => setTopUpModalOpen(true)}` | Opens top-up modal with payment gateway options | ✅ Fully Functional |
| **Edit Connected Bank Details** | Missing on Billing page | Connected bank details are displayed from `akademi_tutor_kyc`, but no "Edit Bank" button exists on `Billing.tsx` | Requires navigating to `/dashboard/settings` KYC tab | ⚠️ **USABILITY GAP** |

---

## Part 2: Detailed Catalog of R4 (Admin & Super Admin Governance Buttons)

### 2.1 Admin Overview (`src/pages/admin/AdminOverview.tsx`)
**Component Path**: `src/pages/admin/AdminOverview.tsx` (363 lines)

| Button / Link Element | Location | Action / Handler | State Mutation & Storage | Functional Status |
| :--- | :--- | :--- | :--- | :--- |
| **Metric Range Switcher (7d)** | Line 235 | `onClick={() => setActiveRange('7d')}` | Sets `activeRange('7d')` and redraws SVG chart | ✅ Fully Functional |
| **Metric Range Switcher (30d)** | Line 239 | `onClick={() => setActiveRange('30d')}` | Sets `activeRange('30d')` and redraws SVG chart | ✅ Fully Functional |
| **Metric Range Switcher (90d)** | Line 243 | `onClick={() => setActiveRange('90d')}` | Sets `activeRange('90d')` and redraws SVG chart | ✅ Fully Functional |
| **Interactive Chart Bar Tooltips** | Line 275 | `onMouseEnter={() => setHoveredBar(i)}`, `onMouseLeave={() => setHoveredBar(null)}` | Displays dynamic lesson count & revenue tooltip | ✅ Fully Functional |
| **Stats Card Links (5 cards)** | Line 172 | `<Link to={card.href}>` | Navigates to `/admin/users`, `/admin/tutors`, `/admin/sessions`, `/admin/payments`, `/admin/communities` | ✅ Fully Functional |
| **Quick Action: Verify Tutors** | Line 323 | `<Link to="/admin/tutors">` | Navigates to tutor verification | ✅ Fully Functional |
| **Quick Action: Financial Reconciliation** | Line 333 | `<Link to="/admin/payments">` | Navigates to payments hub | ✅ Fully Functional |
| **Quick Action: Curriculum Manager** | Line 343 | `<Link to="/admin/subjects">` | Navigates to subjects management | ✅ Fully Functional |
| **Quick Action: Community Moderation** | Line 353 | `<Link to="/admin/communities">` | Navigates to community feeds | ✅ Fully Functional |
| **Recent Bookings: "View all sessions"** | Line 202 | `<Link to="/admin/sessions">` | Navigates to sessions ledger | ✅ Fully Functional |

---

### 2.2 User Management (`src/pages/admin/AdminUsers.tsx`)
**Component Path**: `src/pages/admin/AdminUsers.tsx` (445 lines)

| Button / Link Element | Location | Action / Handler | State Mutation & Storage | Functional Status |
| :--- | :--- | :--- | :--- | :--- |
| **Role Filter Tabs** | Line 240 | `onClick={() => setSelectedRole(tab.id)}` | Filters by 'all', 'student', 'tutor', 'admin', 'super_admin' | ✅ Fully Functional |
| **Search Input** | Line 260 | `onChange={(e) => setSearchQuery(e.target.value)}` | Live filtering by name and email | ✅ Fully Functional |
| **"Add User" Modal Trigger** | Line 220 | `onClick={() => setShowAddModal(true)}` | Opens Add User Modal | ✅ Fully Functional |
| **Add User Form Submit** | Line 378 | `onSubmit={handleCreateUser}` | Appends user to `users` state, persists to `akademi_admin_users`, displays toast | ✅ Fully Functional |
| **Suspend / Activate Toggle Button** | Lines 306–325 | `onClick={() => handleToggleStatus(user.id)}` | Toggles status between 'active' and 'suspended', writes to `localStorage`, displays toast | ✅ Fully Functional |
| **Delete User Button** | Line 327 | `onClick={() => handleDeleteUser(user.id)}` | Removes user from state, updates `localStorage`, displays toast | ✅ Fully Functional |

---

### 2.3 Tutor Management (`src/pages/admin/AdminTutors.tsx`)
**Component Path**: `src/pages/admin/AdminTutors.tsx` (735 lines)

| Button / Link Element | Location | Action / Handler | State Mutation & Storage | Functional Status |
| :--- | :--- | :--- | :--- | :--- |
| **Status Filter Tabs** | Line 392 | `onClick={() => setSelectedTab(tab.id)}` | Filters by 'all', 'pending', 'verified', 'suspended' with dynamic counts | ✅ Fully Functional |
| **"Add Tutor" Button** | Line 374 | `onClick={() => setShowAddModal(true)}` | Opens Add Tutor Modal | ✅ Fully Functional |
| **"View Profile" Modal Trigger** | Line 472 | `onClick={() => setSelectedTutor(tutor)}` | Opens Tutor Profile inspection modal with competencies and bio | ✅ Fully Functional |
| **"Verify Now" Button** | Line 480 | `onClick={() => handleVerify(tutor.id)}` | Updates status to 'verified', updates `akademi_admin_tutors` and `akademi_registered_tutors`, syncs auth user, displays toast | ✅ Fully Functional |
| **"Suspend" Button** | Line 488 | `onClick={() => handleSuspend(tutor.id)}` | Updates status to 'suspended', updates `localStorage`, displays toast | ✅ Fully Functional |
| **"Restore" Button** | Line 496 | `onClick={() => handleRestore(tutor.id)}` | Updates status back to 'verified', updates `localStorage`, displays toast | ✅ Fully Functional |
| **Tutor Search Input** | Line 412 | `onChange={(e) => setSearchQuery(e.target.value)}` | Live filtering by name and subject | ✅ Fully Functional |
| **"Inspect Documents" (KYC / Degrees)** | Missing | No document review link or certificate modal exists | Cannot view uploaded ID card, degree, or credentials | ⚠️ **MISSING CAPABILITY** |

---

### 2.4 Payments & Disputes Hub (`src/pages/admin/AdminPayments.tsx`)
**Component Path**: `src/pages/admin/AdminPayments.tsx` (2036 lines)  
**Supporting Modals**: `InitiateRefundModal.tsx`, `SuperAdminAuthModal.tsx`

| Button / Link Element | Location | Action / Handler | State Mutation & Storage | Functional Status |
| :--- | :--- | :--- | :--- | :--- |
| **Main Tab Navigation (4 tabs)** | Line 894 | `onClick={() => setActiveTab(tab.id)}` | Switches between 'gateways', 'disputes', 'transactions', 'audit' | ✅ Fully Functional |
| **Switch Default Gateway** | Line 940 | `onClick={() => handleSetDefault(gw.id)}` | Challenges via `requestSuperAdminAuth()`; updates default gateway, updates audit log | ✅ Fully Functional |
| **"Configure API Keys" Button** | Line 949 | `onClick={() => handleEditKeys(gw)}` | Opens Edit Gateway Keys Modal | ✅ Fully Functional |
| **Save API Keys Form** | Line 1582 | `onSubmit={handleSaveKeys}` | Writes keys to `gateways` state, updates `localStorage`, displays toast | ✅ Fully Functional |
| **"Probe Latency" Button** | Line 959 | `onClick={() => handleProbeLatency(gw.id)}` | Simulates HTTP ping (138ms), updates status badge, displays toast | ✅ Fully Functional |
| **Save Commission Rate Button** | Line 1109 | `onClick={handleSaveCommissionRate}` | Persists platform commission percentage, updates audit log, displays toast | ✅ Fully Functional |
| **Save Platform Payout Policy** | Line 1146 | `onClick={handleSavePayoutPolicy}` | Persists schedule and minimum threshold, displays toast | ✅ Fully Functional |
| **Super Admin 2FA Policy Toggle** | Line 1240 | `onClick={handleToggle2FA}` | Protected by `requestSuperAdminAuth()`, updates 2FA enforcement state | ✅ Fully Functional |
| **Inspect Dispute Claim** | Line 1284 | `onClick={() => setSelectedDispute(d)}` | Opens Dispute Inspection Modal with evidence, booking info, and disputed sum | ✅ Fully Functional |
| **"Refund Student" (Dispute Modal)** | Line 1735 | `onClick={() => handleRefundDispute(selectedDispute)}` | Credits student wallet, updates dispute status to 'Refunded', logs in transactions and audit log, displays toast | ✅ Fully Functional |
| **"Decline Claim" (Dispute Modal)** | Line 1727 | `onClick={() => handleDeclineDispute(selectedDispute)}` | Updates dispute status to 'Declined', updates audit log, displays toast | ✅ Fully Functional |
| **"Initiate Refund" (Transactions Table)** | Line 1395 | `onClick={() => setRefundTargetTx(tx)}` | Opens `InitiateRefundModal` | ✅ Fully Functional |
| **Execute Refund in Modal** | `InitiateRefundModal.tsx`: Line 153 | `onSubmit={handleSubmit}` | Validates full/partial amount, updates transaction in `akademi_admin_transactions`, logs in audit log, credits wallet, displays toast | ✅ Fully Functional |
| **Export Transactions (CSV)** | Line 1362 | `onClick={handleExportTransactionsCsv}` | Generates CSV Blob and triggers browser download | ✅ Fully Functional |
| **Export Audit Logs (CSV)** | Line 1466 | `onClick={handleExportAuditLogsCsv}` | Generates CSV Blob and triggers browser download | ✅ Fully Functional |

---

### 2.5 Platform Settings (`src/pages/admin/AdminSettings.tsx`)
**Component Path**: `src/pages/admin/AdminSettings.tsx` (2020 lines)

| Button / Link Element | Location | Action / Handler | State Mutation & Storage | Functional Status |
| :--- | :--- | :--- | :--- | :--- |
| **"Probe SFU Latency" Button** | Line 703 | `onClick={handleProbeSfu}` | Tests connection to Lagos SFU node, shows 24ms ping badge & toast | ✅ Fully Functional |
| **"Dispatch Test Push Notification"** | Line 861 | `onClick={handleSendTestNotification}` | Appends notification to `appendAppNotification()`, displays toast | ✅ Fully Functional |
| **Favicon Preset Buttons (3 presets)** | Lines 1045–1068 | `onClick={() => handleSelectPresetFavicon(preset)}` | Updates document `<link rel="icon">`, writes to `localStorage` | ✅ Fully Functional |
| **Custom Favicon File Upload** | Line 1083 | `<input type="file" onChange={handleFaviconUpload}>` | Validates file size (<2MB), reads Data URL, updates favicon | ✅ Fully Functional |
| **"Download Configuration Backup (JSON)"**| Line 1179 | `onClick={handleExportConfig}` | Generates and downloads `akademi-platform-config-<timestamp>.json` | ✅ Fully Functional |
| **"Load Recommended Launch Presets"** | Line 1188 | `onClick={handleLoadLaunchPresets}` | Configures launch defaults (Communities OFF, SFU Eco ON, Pusher ON) + Toast | ✅ Fully Functional |
| **Save Session Type Rules Button** | Line 1484 | `onClick={handleSaveSessionTypeSettings}` | Persists online/in-person and LGA proximity rules to `localStorage` | ✅ Fully Functional |
| **Save Classroom Timing Controls** | Line 1605 | `onClick={handleSaveTimingSettings}` | Persists lobby lead time (5m) and grace period (30m) to `localStorage` | ✅ Fully Functional |
| **Global Lobby Bypass Switch** | Line 1581 | `onClick={() => setBypassLobbyLock(!bypassLobbyLock)}` | Global override for testing and QA evaluation | ✅ Fully Functional |
| **Send Test Email Button** | Line 1848 | `onClick={() => setShowTestEmailModal(true)}` | Opens `showTestEmailModal` | ✅ Fully Functional |
| **Send Test Email Form Submit** | Line 1971 | `onSubmit={handleSendTestEmail}` | Simulates SMTP delivery, shows sending spinner, displays toast | ✅ Fully Functional |
| **Save Email Server Settings** | Line 1855 | `onClick={handleSaveEmailSettings}` | Persists host, port, encryption, and credentials to `akademi_admin_email_settings` | ✅ Fully Functional |
| **Maintenance Mode Switch** | Line 1918 | `onClick={() => setMaintenanceMode(!maintenanceMode)}` | Toggles platform maintenance mode with toast alert | ✅ Fully Functional |

---

## Part 3: Defect & Gap Analysis

### Defect 1: Dead Buttons in Calendar Header (`src/pages/dashboard/Sessions.tsx`)
- **Location**: `src/pages/dashboard/Sessions.tsx`, lines 574–583
- **Verbatim Code**:
  ```tsx
  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
    <button type="button" className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded transition-all">
      <ChevronLeft className="w-4 h-4" />
    </button>
    <button type="button" className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded transition-all">
      <ChevronRight className="w-4 h-4" />
    </button>
    <button type="button" className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-all">
      Today
    </button>
  </div>
  ```
- **Analysis**: These three buttons lack `onClick` handlers. Clicking Previous, Next, or Today produces zero response.
- **Impact**: Tutors cannot navigate between weeks/months or return to the current day in the calendar matrix.

### Defect 2: Dead Menu Button on Upcoming Session Cards (`src/pages/dashboard/Sessions.tsx`)
- **Location**: `src/pages/dashboard/Sessions.tsx`, line 990
- **Verbatim Code**:
  ```tsx
  <button type="button" className="p-1 text-slate-400 hover:text-slate-600 rounded">
    <MoreVertical className="w-4 h-4" />
  </button>
  ```
- **Analysis**: The action menu trigger on upcoming session cards lacks an `onClick` handler.
- **Impact**: Tutors cannot access secondary card actions (e.g., reschedule, cancel, or copy meeting link).

### Defect 3: Missing Instant Booking Switch on `Sessions.tsx`
- **Analysis**: While `Overview.tsx` has an "Allow Instant Booking without prior confirmation" checkbox inside its Availability Modal, `Sessions.tsx` (the primary schedule management interface) lacks an instant booking toggle.
- **Impact**: Tutors managing their schedule matrix have to switch back to Overview to toggle instant bookings.

### Defect 4: Orphaned Modal & State in `src/pages/dashboard/Students.tsx`
- **Location**: `src/pages/dashboard/Students.tsx`, lines 339–397
- **Analysis**: The component defines `noteModalStudent` state and a full modal markup for adding quick session notes and homework (`handleSaveNote`). However, `setNoteModalStudent` is never called anywhere in the component markup. The "Notes" button on student cards instead calls `handleOpenNotes(student)`, which opens the external `LessonNotesModal`.
- **Impact**: 60 lines of dead code and unreachable modal dialog.

### Defect 5: Missing Document Inspection in `src/pages/admin/AdminTutors.tsx`
- **Analysis**: Admin tutor cards provide "Verify Now", "Suspend", and "View Profile" (competencies/bio), but do not provide a way to inspect KYC documents (such as Government ID cards, university degree certificates, or background checks stored in `akademi_tutor_kyc`).
- **Impact**: Admins verifying tutors have no interface to examine submitted credentials before clicking "Verify Now".

---

## Part 4: Proposed Code Fixes & Implementation Guidance

### Fix 1: Calendar Navigation Handlers in `Sessions.tsx`
**File**: `src/pages/dashboard/Sessions.tsx`  
**Description**: Add state for `currentDate` and wire up `ChevronLeft`, `ChevronRight`, and `Today`.

```tsx
// Before:
<div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
  <button type="button" className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded transition-all">
    <ChevronLeft className="w-4 h-4" />
  </button>
  <button type="button" className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded transition-all">
    <ChevronRight className="w-4 h-4" />
  </button>
  <button type="button" className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-all">
    Today
  </button>
</div>

// After:
<div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
  <button 
    type="button" 
    onClick={() => handleNavigateCalendar('prev')}
    title="Previous period"
    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded transition-all"
  >
    <ChevronLeft className="w-4 h-4" />
  </button>
  <button 
    type="button" 
    onClick={() => handleNavigateCalendar('next')}
    title="Next period"
    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded transition-all"
  >
    <ChevronRight className="w-4 h-4" />
  </button>
  <button 
    type="button" 
    onClick={() => handleNavigateCalendar('today')}
    className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-all"
  >
    Today
  </button>
</div>
```

### Fix 2: Card Action Menu in `Sessions.tsx`
**File**: `src/pages/dashboard/Sessions.tsx`  
**Description**: Wire `MoreVertical` to open the event inspector modal or action popover.

```tsx
// Before:
<button type="button" className="p-1 text-slate-400 hover:text-slate-600 rounded">
  <MoreVertical className="w-4 h-4" />
</button>

// After:
<button 
  type="button" 
  onClick={() => setSelectedEvent(event)}
  title="Manage session"
  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
>
  <MoreVertical className="w-4 h-4" />
</button>
```

### Fix 3: Document Inspection Link in `AdminTutors.tsx`
**File**: `src/pages/admin/AdminTutors.tsx`  
**Description**: Add a document preview button to the tutor card and profile modal that displays uploaded KYC credentials.

```tsx
// Inside Tutor Card action bar:
<button
  type="button"
  onClick={() => handleInspectDocuments(tutor)}
  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
>
  <FileText className="w-3.5 h-3.5" />
  <span>Inspect Docs</span>
</button>
```

---

## Conclusion
The R3 and R4 functional layers in Akademi are exceptionally well designed, with robust state management, Super Admin security barriers, real-time alerts, and comprehensive financial controls. Remediation of the calendar navigation dead buttons in `Sessions.tsx`, connecting the tutor document inspection viewer in `AdminTutors.tsx`, and pruning or wiring the orphaned modal in `Students.tsx` will elevate the system to 100% production readiness.
