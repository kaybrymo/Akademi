# Survey Report: Testing & Workflow Suites Specialist (Survey Explorer 2)

**Investigation Target**: Akademi Frontend Platform Test Infrastructure & Workflow Audit Suites  
**Target Directory**: `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend`  
**Investigator**: Survey Explorer 2  
**Date**: 2026-08-31  

---

## Executive Summary

The Akademi automated test harness is a standalone, high-fidelity Node.js / TypeScript test infrastructure designed to validate platform configurations, reactive cross-role synchronization, edge case boundaries, and multi-persona end-to-end workflows across all 4 personas: **Super Admin**, **Admin**, **Student**, and **Tutor**.

The primary test runner is `test_all_workflows.js` (1,101 lines, 61 assertions across 5 verification tiers), supported by auxiliary adversarial harnesses `test_adversarial_challenger_2.mjs`, `test_rewards_and_grids.mjs`, `scripts/stress_financial_and_timing.mjs`, and static route audit tools `audit_script.cjs` / `check_routes.cjs`.

All test suites execute natively in Node.js (ESM) without external test runner overhead, utilizing an in-memory `LocalStorageMock` and DOM event emitter simulating browser state changes, cross-tab reactive broadcasting, and dynamic document head element manipulation.

---

## 1. Test Harness Inventory & Architecture

### 1.1 Test Scripts & Tooling Overview

| File Path | Runner / Type | Lines | Focus & Scope |
|---|---|---|---|
| `test_all_workflows.js` | Node.js (ESM) | 1,101 | Primary test harness: 5 tiers, 61 assertions covering R1-R5, all 4 personas, boundary conditions, cross-role sync, E2E journey, responsive grids, and 36 routes. |
| `test_adversarial_challenger_2.mjs` | Node.js (ESM) | 392 | Empirical adversarial challenger: persona transitions, role guard redirection matrix, homework dual-mode sync, tutor suspension/restoration lifecycle, commission split conservation oracles. |
| `test_rewards_and_grids.mjs` | Node.js (ESM) | 317 | Multidirectional test harness: student LearnTokens gamification, streak bonuses, referral codes, token-to-minute conversions, subsidized booking gross earnings guarantee, 9-view responsive grids. |
| `scripts/stress_financial_and_timing.mjs` | Node.js (ESM) | 527 | Boundary stress test: commission rate clamping [0, 100], fractional rates, subsidy cap math, payout balance limits, and session access timing engine (lead time, grace period, admin bypass, live status). |
| `audit_script.cjs` | Node.js (CJS) | 76 | Static AST & regex scanner across all `.tsx` and `.ts` files in `src/`, cataloging defined routes, navigation links, `localStorage` usages, empty `onClick` handlers, and TODOs into `audit_results.json`. |
| `check_routes.cjs` | Node.js (CJS) | 39 | Route integrity auditor parsing `audit_results.json` to verify 100% link resolution against declared routes in `src/App.tsx`. |

### 1.2 Execution Commands & Build Checks

```bash
# 1. Run full primary test suite (Acceptance Criteria #2)
npm test
# Equivalent to: node test_all_workflows.js

# 2. Run adversarial stress & challenger suites
node test_adversarial_challenger_2.mjs
node test_rewards_and_grids.mjs
node scripts/stress_financial_and_timing.mjs

# 3. Static routing & AST audit
node audit_script.cjs
node check_routes.cjs

# 4. TypeScript build & compilation verification (Acceptance Criteria #1)
npm run build
# Executes: tsc -b && vite build
```

---

## 2. Detailed Mapping of the 20 Workflow Audit Suites

Below is the exhaustive architectural enumeration of all 20 workflows covering Requirements R1–R5 and all 4 user personas.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 20 WORKFLOW AUDIT SUITES ARCHITECTURE                                │
├────────────────────────────────┬───────────────────────────────────┬─────────────────────────────────┤
│  Super Admin & Governance      │  Student Learning & Purchase      │  Tutor Teaching & Wallet        │
│    • WF-1: Auth & Role Guards  │    • WF-2: Tutor Search Directory │    • WF-4: Availability Matrix  │
│    • WF-12: Admin Lobby Bypass │    • WF-3: Multi-Step Booking     │    • WF-16: Notes & HW Mastery  │
│    • WF-17: Paystack & 2FA     │    • WF-9: G-Cal 2-Way Sync       │    • WF-18: NUBAN & Payout Desk │
│    • WF-18: Commission Policy  │    • WF-10: G-Cal Event URLs      │    • WF-19: SFU Cloud Presets   │
│    • WF-20: Governance & Flags │    • WF-11: Pre-Lobby Access Gate │                                 │
│                                │    • WF-13: LearnTokens & Streaks │  Cross-Role & Communications    │
│                                │    • WF-14: Token Conversion      │    • WF-5: Real-Time Chat       │
│                                │    • WF-15: Tutor Gross Guarantee │    • WF-6: OS Push Notifications│
│                                │                                   │    • WF-7: WebSockets Triggers  │
│                                │                                   │    • WF-8: Navbar Bell Sync     │
└────────────────────────────────┴───────────────────────────────────┴─────────────────────────────────┘
```

---

### Workflow 1: Authentication, User Lifecycle & Persona Elevation Guards
- **Feature ID**: F1 (Milestone 1 / Requirement R1)
- **Personas**: Super Admin, Admin, Student, Tutor
- **Source Files**: `src/pages/auth/Login.tsx`, `src/pages/auth/Register.tsx`, `src/pages/auth/ForgotPassword.tsx`, `src/components/layout/ProtectedRoute.tsx`, `src/App.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.1, Tier 1.4, Tier 5.2); `test_adversarial_challenger_2.mjs` (Suite 1).
- **Imported / Mocked Data Structures**:
  - `akademi_auth_user`: `{ id, name, email, role: 'student' | 'tutor' | 'admin' | 'super_admin', initials, title }`
  - Protected route guard matrix: `allowedRoles: ['admin', 'super_admin']` vs `allowedRoles: ['student', 'tutor', 'admin', 'super_admin']`.
- **Key Assertions**:
  1. Route aliases `/auth/login`, `/auth/register`, `/auth/forgot-password` map to canonical auth views.
  2. Persona transitions cleanly update `akademi_auth_user`.
  3. Student/Tutor accessing `/admin` is rejected and redirected to `/dashboard`.
  4. Admin/Super Admin accessing `/admin` is granted entry.
- **Potential Failure Modes**: Unhandled role redirects, missing route alias mappings in `App.tsx`, stale `localStorage` persona state during multi-tab operations.

---

### Workflow 2: Student Search & Multi-Facet Tutor Discovery
- **Feature ID**: F2 (Milestone 1 / Requirement R1)
- **Personas**: Student, Administrator
- **Source Files**: `src/pages/Tutors.tsx`, `src/pages/TutorProfile.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.2 lines 445-461); `test_adversarial_challenger_2.mjs` (Suite 3 lines 305-321).
- **Imported / Mocked Data Structures**:
  - `akademi_admin_tutors` / `akademi_registered_tutors`: `Array<{ id, name, subject, rate, rating, verified: boolean, status: 'Verified' | 'Pending' | 'Suspended' }>`
- **Key Assertions**:
  1. Multi-facet filter combines subject match (e.g. Calculus), hourly price slider (`rate <= 5000`), star rating (`rating >= 4.5`), and verified badge (`verified === true`).
  2. Suspended (`status === 'Suspended'`) and unverified (`status === 'Pending'`) tutors are strictly excluded from student search results.
- **Potential Failure Modes**: Case sensitivity mismatches in subject search strings, filter leakage of suspended tutor profiles, empty search result unhandled UI state.

---

### Workflow 3: Multi-Step Booking Wizard, Group Discounts & Conflict Locking
- **Feature ID**: F3 (Milestone 1 / Requirement R1)
- **Personas**: Student, Tutor
- **Source Files**: `src/components/ui/BookingModal.tsx`, `src/pages/TutorProfile.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.2 lines 463-469, Tier 3.3 lines 777-801); `scripts/stress_financial_and_timing.mjs` (lines 115-148).
- **Imported / Mocked Data Structures**:
  - `akademi_booked_sessions`: `Array<{ id, tutorId, studentName, date, time, duration, price, status }>`
  - Group discount formula: `gross * (1 - 0.30)` (30% discount).
  - Multi-session bundle discount: 2 sessions = 5%, 4+ sessions = 10%.
- **Key Assertions**:
  1. Group lesson applies exact 30% discount on tutor base rate (₦4,000 -> ₦2,800).
  2. Booking collision detector flags already booked slots on the same date/time and blocks double-booking.
- **Potential Failure Modes**: Concurrent booking race conditions, floating point rounding errors on discount calculations, missing time slot format normalization.

---

### Workflow 4: Tutor Availability Matrix & Bookable Slot Management
- **Feature ID**: F4 (Milestone 1 / Requirement R1)
- **Personas**: Tutor, Student
- **Source Files**: `src/pages/dashboard/Sessions.tsx`, `src/pages/dashboard/Settings.tsx`, `src/components/ui/BookingModal.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.3 lines 513-526, Tier 3.3 lines 777-785).
- **Imported / Mocked Data Structures**:
  - `akademi_tutor_available_slots`: `{ MON: string[], TUE: string[], WED: string[], THU: string[], FRI: string[], SAT: string[], SUN: string[] }`
  - `akademi_tutor_availability`: `{ instantBook: boolean, days: string[] }`
- **Key Assertions**:
  1. Tutor custom weekly availability persists preferred slots (e.g. `MON: ['9:00 AM', '11:00 AM', '4:30 PM']`).
  2. Instant booking toggle state persists.
  3. Student booking wizard immediately reflects newly saved tutor slots.
- **Potential Failure Modes**: JSON serialization/deserialization crashes on empty days, timezone offset distortions on time string representations.

---

### Workflow 5: Real-Time Messaging Workspace & Contact Ledger
- **Feature ID**: F5 (Milestone 2 / Requirement R2)
- **Personas**: Student, Tutor, Administrator
- **Source Files**: `src/pages/dashboard/Messages.tsx`, `src/lib/websocketPushEngine.ts`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.4, Tier 5.2).
- **Imported / Mocked Data Structures**:
  - `akademi_global_message_ledger`: `Array<{ id, senderId, senderName, recipientId, text, timestamp, read: boolean }>`
  - `dispatchChatMessagePush(senderName, textSnippet)`
- **Key Assertions**:
  1. Messages persist in shared ledger with timestamps and read status.
  2. Sending a message dispatches real-time storage event and triggers simulated push.
- **Potential Failure Modes**: Storage size exhaustion from uncompressed message threads, message order desynchronization.

---

### Workflow 6: In-App Notifications Center & Native OS Web Push Dispatcher
- **Feature ID**: F6 (Milestone 2 / Requirement R2)
- **Personas**: Student, Tutor, Admin, Super Admin
- **Source Files**: `src/pages/dashboard/Notifications.tsx`, `src/lib/websocketPushEngine.ts`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.4, Tier 5.2).
- **Imported / Mocked Data Structures**:
  - `akademi_user_notifications`: `AppNotification[]` (`{ id, title, desc, time, read, type, link }`)
  - `akademi_push_permission`: `'granted' | 'denied' | 'default'`
  - Browser `Notification` API mock (`requestPermission()`, `new Notification()`).
- **Key Assertions**:
  1. `appendAppNotification` prepends new notifications to store and updates unread badge.
  2. Native OS push notification executes only when `Notification.permission === 'granted'`.
  3. Permission prompt denial gracefully falls back to in-app notifications without throwing exceptions.
- **Potential Failure Modes**: Missing `window.Notification` in unsupported browsers / WebViews, stale unread counter.

---

### Workflow 7: WebSockets Push Event Triggers & Resilient Fallback Engine
- **Feature ID**: F7 (Milestone 2 / Requirement R2)
- **Personas**: Student, Tutor, Super Admin
- **Source Files**: `src/lib/websocketPushEngine.ts`, `src/pages/admin/AdminSettings.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.4, Tier 3.1-3.5); `AdminSettings.tsx`.
- **Imported / Mocked Data Structures**:
  - `akademi_push_config`: `WebSocketPushConfig` (`{ provider: 'pusher' | 'soketi' | 'webpush', pusherKey, pusherSecret, pusherCluster, pusherAppId, enableSessionBookedPush, enableChatMessagePush, enableLessonNotesPush, enablePayoutPush }`)
- **Key Assertions**:
  1. Dedicated trigger functions exist for:
     - Session Bookings (`dispatchSessionBookedPush`)
     - Chat Messages (`dispatchChatMessagePush`)
     - Lesson Notes (`dispatchLessonNotesPush`)
     - Payouts (`dispatchPayoutPush`)
  2. Every dispatch writes to `akademi_user_notifications` and emits a `'storage'` event.
- **Potential Failure Modes**: Invalid Pusher credentials, network disconnects during WebSocket handshake.

---

### Workflow 8: Navigation Bar Bell Notification Counter Synchronization
- **Feature ID**: F8 (Milestone 2 / Requirement R2)
- **Personas**: Student, Tutor, Admin, Super Admin
- **Source Files**: `src/components/layout/Navbar.tsx`, `src/components/layout/DashboardLayout.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.4).
- **Imported / Mocked Data Structures**:
  - `akademi_user_notifications`
  - Window `'storage'` event listener and dispatcher.
- **Key Assertions**:
  1. Top navbar notification bell icon dynamically displays count of unread notifications (`!n.read`).
  2. Marking notifications as read or adding new notifications immediately synchronizes across open tabs/views via storage events.
- **Potential Failure Modes**: Unremoved event listeners causing memory leaks, negative badge counter.

---

### Workflow 9: Google Calendar 2-Way OAuth Sync & Account Persistence
- **Feature ID**: F9 (Milestone 3 / Requirement R3)
- **Personas**: Student, Tutor
- **Source Files**: `src/components/ui/GoogleAuthModal.tsx`, `src/pages/dashboard/Settings.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.4, Tier 4.1).
- **Imported / Mocked Data Structures**:
  - `akademi_google_calendar_connected`: `'true' | 'false'`
  - `akademi_google_account_email`: `string`
  - OAuth Scopes: `https://www.googleapis.com/auth/calendar.events`, `https://www.googleapis.com/auth/calendar.readonly`.
- **Key Assertions**:
  1. `GoogleAuthModal` in `calendar_connect` mode displays Google OAuth scopes and account consent UI.
  2. Connected state and account email persist in `localStorage`.
- **Potential Failure Modes**: Disconnected state not updating calendar link indicators, OAuth token expiry edge cases.

---

### Workflow 10: Dynamic Google Calendar Event URLs & Direct Meeting Room Links
- **Feature ID**: F10 (Milestone 3 / Requirement R3)
- **Personas**: Student, Tutor
- **Source Files**: `src/components/ui/ClassroomLobbyModal.tsx`, `src/pages/dashboard/Sessions.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.2, Tier 4.1).
- **Imported / Mocked Data Structures**:
  - URL template generator: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...&details=...&location=...`
  - Meeting link format: `https://meet.google.com/xyz-abc-123` or platform classroom deep link `/classroom/:sessionId`.
- **Key Assertions**:
  1. Generated Google Calendar URLs contain properly ISO-formatted UTC timestamps and URL-encoded query parameters.
  2. Direct meeting link is visibly displayed in session cards and lobby modals.
- **Potential Failure Modes**: Malformed date-time strings, unencoded ampersands or special characters in session titles.

---

### Workflow 11: Universal Classroom Pre-Lobby Timing Engine & Access Gates
- **Feature ID**: F11 (Milestone 3 / Requirement R3)
- **Personas**: Student, Tutor
- **Source Files**: `src/lib/sessionAccess.ts`, `src/components/ui/ClassroomLobbyModal.tsx`, `src/pages/classroom/Classroom.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.2, Tier 2.4, Tier 4.1); `scripts/stress_financial_and_timing.mjs` (Section 2).
- **Imported / Mocked Data Structures**:
  - `calculateSessionAccess(session)` -> `SessionAccessResult`
  - Default config: `leadMinutes = 5`, `graceMinutes = 30`.
- **Key Assertions**:
  1. Future session (> 5 min before start) -> `status: 'locked_future'`, `isAccessible: false`.
  2. Lobby window (<= 5 min before start) -> `status: 'lobby_open'`, `isAccessible: true`.
  3. Live session (`isLive: true` or `status: 'live'`) -> `status: 'live_now'`, `isAccessible: true`.
  4. Past/completed session (`status: 'completed'`) -> `status: 'completed'`, `isAccessible: false`.
- **Potential Failure Modes**: 12-hour vs 24-hour time parsing bugs, client clock drift, NaN comparisons.

---

### Workflow 12: Super Admin Classroom Access Bypass & Session Overrides
- **Feature ID**: F12 (Milestone 3 / Requirement R3)
- **Personas**: Super Admin, Administrator
- **Source Files**: `src/lib/sessionAccess.ts`, `src/pages/admin/AdminSettings.tsx`, `src/pages/admin/AdminSessions.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 2.4 lines 719-730); `scripts/stress_financial_and_timing.mjs` (lines 474-495).
- **Imported / Mocked Data Structures**:
  - `akademi_admin_bypass_lobby_lock`: `'true' | 'false'`
  - `akademi_admin_unlocked_sessions`: `Array<string | number>`
- **Key Assertions**:
  1. Global bypass toggle unlocks all locked future sessions with `status: 'admin_override'` and `isAccessible: true`.
  2. Specific session ID in `akademi_admin_unlocked_sessions` unlocks only that target session.
- **Potential Failure Modes**: Number vs string ID mismatch, failure to clear override state after administrative testing.

---

### Workflow 13: LearnTokens Gamification, Daily Streaks & Referral Sharing
- **Feature ID**: F13 (Milestone 4 / Requirement R4)
- **Personas**: Student
- **Source Files**: `src/components/ui/ReferralSnapcodeBadge.tsx`, `src/pages/dashboard/Overview.tsx`, `src/pages/dashboard/Billing.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.2, Tier 4.1); `test_rewards_and_grids.mjs` (Tier 2.1-2.2).
- **Imported / Mocked Data Structures**:
  - `akademi_user_tokens`: `number` (default: 450)
  - `akademi_streak_bonus_tokens`: `number` (default: 50)
  - `akademi_referral_bonus_tokens`: `number` (default: 150)
  - Snapcode dynamic referral format: `LEARN-XXX-15`, `TUTOR-XXX-10`.
- **Key Assertions**:
  1. Claiming streak bonus increments tokens by configured streak amount (+50).
  2. Claiming classmate referral bonus increments tokens by configured referral amount (+150).
  3. WhatsApp share link contains valid referral URL and code.
- **Potential Failure Modes**: Double-claiming bonuses without cooldown, token integer overflow.

---

### Workflow 14: Token-to-Minute Conversion & Underflow Protection Math
- **Feature ID**: F14 (Milestone 4 / Requirement R4)
- **Personas**: Student, Administrator
- **Source Files**: `src/components/ui/TokenConverterModal.tsx`, `src/pages/dashboard/Billing.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 2.3 lines 681-692); `test_rewards_and_grids.mjs` (Tier 2.3).
- **Imported / Mocked Data Structures**:
  - `convertTokensToMinutes(tokens, balance, rate)`
  - Conversion rate: `akademi_tokens_per_minute` (default: 10 tokens = 1 min).
- **Key Assertions**:
  1. Attempting to convert more tokens than available is rejected with `success: false`.
  2. Fractional conversion uses floor rounding: 25 tokens @ 10 tokens/min = 2 minutes gained, 75 tokens remaining (5 unconvertible tokens preserved).
- **Potential Failure Modes**: Fractional floating-point minutes, debiting tokens without granting session minutes.

---

### Workflow 15: Protected Tutor Gross Earnings & Platform Subsidy Invariant
- **Feature ID**: F15 (Milestone 4 / Requirement R4)
- **Personas**: Student, Tutor, Super Admin
- **Source Files**: `src/components/ui/BookingModal.tsx`, `src/pages/dashboard/Billing.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.2, Tier 2.5, Tier 3.5, Tier 4.1); `test_rewards_and_grids.mjs` (Tier 2.4, Tier 3); `scripts/stress_financial_and_timing.mjs` (Section 1).
- **Imported / Mocked Data Structures**:
  - `rewardSubsidy = Math.round((appliedRewardMins / totalMins) * grossPrice)`
  - `studentFinalPrice = Math.max(0, grossPrice - rewardSubsidy)`
  - `tutorGrossEarnings = grossPrice` (100% full gross tuition credited)
  - `isTokenSubsidized: true`, `rewardSubsidyAmount: number`
- **Key Assertions**:
  1. Student price is reduced by reward minutes subsidy, clamped to non-negative ₦0 floor.
  2. Tutor gross earnings are 100% protected: tutor is credited the full base price regardless of student subsidy.
  3. Platform transparently funds and records the subsidy difference in session metadata.
- **Potential Failure Modes**: Tutor earnings penalized by student subsidies, negative student price on high token redemptions.

---

### Workflow 16: Interactive Lesson Notes, Study Pack ASCII & Homework Mastery Sync
- **Feature ID**: F16 (Milestone 4 / Requirement R4)
- **Personas**: Tutor, Student
- **Source Files**: `src/components/ui/LessonNotesModal.tsx`, `src/pages/dashboard/Sessions.tsx`, `src/pages/dashboard/Students.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.2, Tier 1.3, Tier 3.4, Tier 4.1); `test_adversarial_challenger_2.mjs` (Suite 2).
- **Imported / Mocked Data Structures**:
  - `akademi_session_notes`: `{ [sessionId: string]: { sessionId, sessionTitle, tutorName, date, summary, keyPoints: string[], homework: Array<{ id, task, dueDate, completed: boolean }>, attachments: Array<{ id, name, size, type }> } }`
  - `generateStudyPackContent(note)` -> ASCII text study pack.
- **Key Assertions**:
  1. Tutor uploads lesson summary, formulas, attachments (.pdf, .docx, .zip), and homework tasks.
  2. Student toggling homework items directly updates shared session notes store.
  3. Tutor student roster view calculates live mastery % (`Math.round(completed / total * 100)`).
  4. ASCII Study Pack accurately formats `[X]` for completed tasks and `[ ]` for incomplete tasks.
- **Potential Failure Modes**: Division by zero when `homework.length === 0`, corrupted JSON in `akademi_session_notes`.

---

### Workflow 17: Paystack Gateway Auto-Config, Multi-Channel Payments & 2FA Desk
- **Feature ID**: F17 (Milestone 5 / Requirement R5)
- **Personas**: Super Admin, Administrator, Student
- **Source Files**: `src/pages/admin/AdminPayments.tsx`, `src/components/modals/Payment2FAModal.tsx`, `src/components/modals/SuperAdminAuthModal.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.1 lines 342-358); `AdminPayments.tsx`.
- **Imported / Mocked Data Structures**:
  - `akademi_admin_gateways`: `Gateway[]` (Paystack `pk_live_...`, Flutterwave, Stripe)
  - `akademi_default_gateway_name`: `'Paystack'`
  - `akademi_require_payment_2fa`: `'true'`
  - `akademi_super_admin_pass`: `'admin123'`
- **Key Assertions**:
  1. Paystack is auto-configured as the active default payment gateway with a live public key (`pk_live_...`).
  2. Mandatory 2FA policy is enforced for financial payouts and major gateway edits.
  3. Super Admin authorization password is required for elevated changes.
- **Potential Failure Modes**: Empty gateway array fallback missing, plain-text sensitive secret exposure.

---

### Workflow 18: Platform Commission Policy, Fee Simulator & NUBAN Payout Desk
- **Feature ID**: F18 (Milestone 5 / Requirement R5)
- **Personas**: Super Admin, Finance Admin, Tutor
- **Source Files**: `src/pages/admin/AdminPayments.tsx`, `src/pages/dashboard/Billing.tsx`, `src/components/modals/InitiateRefundModal.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.1, Tier 1.3, Tier 2.1-2.2, Tier 3.1); `test_adversarial_challenger_2.mjs` (Suite 4); `scripts/stress_financial_and_timing.mjs` (Section 1).
- **Imported / Mocked Data Structures**:
  - `akademi_commission_rate`: `number` (default: 10%)
  - `akademi_min_payout_threshold`: `number` (default: 5000)
  - `akademi_tutor_kyc`: `{ bankName, accountNumber, accountName, bvn, isVerified }`
  - `akademi_tutor_payouts`: `Array<{ id, amount, bankName, accountNumber, date, status: 'Processing' | 'Completed' | 'Failed' }>`
- **Key Assertions**:
  1. Conservation of money: `platformFee + tutorNet === grossPrice` across all commission rates (0% to 100%).
  2. Commission editor clamps inputs to [0, 100] and handles decimal percentages (e.g. 12.5%).
  3. Tutor bank account conforms to 10-digit Nigerian NUBAN format.
  4. Payout requests below ₦5,000 threshold or exceeding available balance are rejected.
- **Potential Failure Modes**: Negative commission rate injection, floating-point subtraction rounding drift.

---

### Workflow 19: WebRTC SFU Cloud Media Engine, Eco Mode & Node Health Probes
- **Feature ID**: F19 (Milestone 5 / Requirement R5)
- **Personas**: Super Admin, Student, Tutor
- **Source Files**: `src/lib/sfuEngine.ts`, `src/pages/admin/AdminSettings.tsx`, `src/pages/classroom/Classroom.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.2 lines 501-506); `sfuEngine.ts`.
- **Imported / Mocked Data Structures**:
  - `akademi_sfu_config`: `SFUConfig` (`{ provider: 'livekit' | 'agora' | 'custom', serverUrl: 'wss://sfu-lagos.akademi.dev', autoSwitchThreshold: 8, enableEcoMobileMode: true, apiKey, apiSecret }`)
  - `VIDEO_PRESETS`: `1080p`, `720p`, `480p`, `360p_eco` (300-420 Kbps @ 20fps).
- **Key Assertions**:
  1. SFU Cloud configuration supports LiveKit, Agora, and Custom server presets.
  2. Auto-switch threshold switches from P2P mesh to SFU relay when peer count > 8.
  3. 360p Eco Mobile mode reduces bitrate from 1500 kbps to 420 kbps (72% bandwidth savings).
  4. Node health probe verifies Lagos SFU cloud node latency (< 30ms).
- **Potential Failure Modes**: Unsupported WebRTC codecs on mobile browsers, fallback failure when SFU server URL is unreachable.

---

### Workflow 20: Governance Controls, Module Toggles, Email Relay & Dynamic Favicon
- **Feature ID**: F20 (Milestone 5 / Requirement R5)
- **Personas**: Super Admin, Platform Operations Director
- **Source Files**: `src/pages/admin/AdminSettings.tsx`, `src/pages/admin/AdminRecordings.tsx`, `src/pages/admin/AdminCommunities.tsx`, `src/components/layout/Navbar.tsx`.
- **Test File / Tier**: `test_all_workflows.js` (Tier 1.1 lines 396-438); `AdminSettings.tsx`.
- **Imported / Mocked Data Structures**:
  - `akademi_enable_communities`: `'true' | 'false'` (default: `'false'`)
  - `akademi_email_provider`: `'SendGrid'`, port 587 (TLS)
  - `akademi_platform_favicon`: Base64 / SVG data URI
  - `akademi_admin_audit_logs`: `AdminAuditLog[]`
  - 10-day recording retention policy (`daysRemaining`, `Active (Free 10d)`).
- **Key Assertions**:
  1. Communities module toggle defaults to off (`'false'`), hiding community navigation elements across Navbar/Sidebar.
  2. SendGrid SMTP relay configuration persists host, port 587, and sender email.
  3. Dynamic SVG/image favicon is injected into `document.head` `<link rel="icon">`.
  4. Immutable audit log ledger records all administrative governance actions.
- **Potential Failure Modes**: Navbar or sidebar crashing when Communities feature flag is toggled, broken SVG data URI in favicon tag.

---

## 3. Tier-by-Tier Assertion Breakdown of `test_all_workflows.js`

`test_all_workflows.js` contains **61 total assertions** distributed across 5 tiers:

| Tier | Name | Assertions | Key Requirements Verified |
|---|---|---|---|
| **Tier 1** | Feature Coverage (R1–R4 Architectural Audit) | 18 Assertions | Admin navigation portals (9), Paystack auto-config, live API key, mandatory 2FA, master password, 10% commission default, fee simulator, user suspension, tutor verification, SMTP 587 relay, dynamic favicon injection, communities launch switch, immutable audit log, student tutor search & budget filter, group 30% discount, reward minutes 50% subsidy, lesson notes study pack ASCII generator, 360p Eco mode 72% bandwidth savings, tutor availability slots, instant booking flag, native file picker (.pdf, .zip), student roster 90% mastery, GTBank 10-digit NUBAN KYC, ₦5,000 minimum payout threshold, 28 shared state keys schema inventory, storage event broadcast. |
| **Tier 2** | Boundary & Corner Cases | 15 Assertions | Commission rate validation [0%, 100%, 12.5%, rejection of negatives & >100%], payout withdrawal thresholds (₦4,999 rejected, ₦5,000 allowed, ₦20,001 over-balance rejected, ₦20,000 exact allowed, ₦0 rejected), token conversion underflow & floor rounding (25 tokens @ 10/min = 2 mins + 75 tokens left), classroom access engine timing boundaries (future locked >5m, lobby open <=5m, live now, completed closed, global admin bypass override, targeted session unlock), compounded subsidy non-negative price floor (₦0 floor). |
| **Tier 3** | Cross-Role Reactive Integrations | 10 Assertions | Admin commission change (15%) immediately updates booking split (₦1,500 fee + ₦8,500 tutor net); admin tutor suspension instantly excludes tutor from student discovery; tutor availability configuration updates student booking slot picker & activates double-booking conflict detection; student homework completion in notes modal synchronizes live tutor roster mastery % (75%); LearnTokens subsidy reduces student price while preserving 100% tutor gross earnings guarantee (₦6,000 credit). |
| **Tier 4** | Real-World Multi-Persona E2E User Journeys | 8 Assertions | Full synchronous lifecycle: (Step 1) Super Admin initializes governance policy & audit ledger -> (Step 2) Admin verifies Dr. Eze credentials -> (Step 3) Tutor configures GTBank KYC & Monday 4:30 PM slot -> (Step 4) Student earns streak (+50) & referral (+150), converts 200 tokens, and books subsidized session -> (Step 5) Classroom access engine unlocks lobby for Today 4:30 PM session -> (Step 6) Tutor uploads summary notes & 2 homework tasks -> (Step 7) Student completes 100% of homework checklist -> (Step 8) Tutor submits ₦25,000 payout request to verified GTBank account. |
| **Tier 5** | Static Code & Routing Sanity | 10 Assertions | Responsive Tailwind grid class validation across all 9 views (`Tutors.tsx`, `Courses.tsx`, `AdminOverview.tsx`, `AdminPayments.tsx`, `AdminSessions.tsx`, `AdminSubjects.tsx`, `AdminTutors.tsx`, `Overview.tsx`, `Billing.tsx`) and complete 36-route hierarchy verification in `src/App.tsx`. |

---

## 4. Exact Acceptance Criteria for 100% Pass

1. **TypeScript Compilation Cleanliness**:
   - `npm run build` (`tsc -b && vite build`) executes with **0 errors**.
   - Strict TypeScript rules honored (`verbatimModuleSyntax: true`, type imports `import type { ... }`).
   - Module resolution using bundler and `@/*` path aliases.

2. **Full Workflow Test Pass Rate**:
   - `node test_all_workflows.js` finishes with **Exit Code 0**.
   - Exactly **61/61 assertions passed (100%)** across all 5 tiers.
   - All 20 workflow audit suites validated with zero runtime exceptions.

3. **Auxiliary Adversarial & Stress Harnesses**:
   - `node test_adversarial_challenger_2.mjs` exits with code 0 (all 4 adversarial suites passed).
   - `node test_rewards_and_grids.mjs` exits with code 0 (all persona reward and grid tests passed).
   - `node scripts/stress_financial_and_timing.mjs` exits with code 0 (17 boundary stress tests passed).

4. **Zero-Config Defaults & Health Probes**:
   - Out-of-the-box defaults for Paystack, SFU LiveKit, Pusher/WebSockets, SendGrid SMTP, and LearnTokens conversion operate with 0 configuration overhead.
   - Probing mechanisms (SFU node 24ms check, WebSockets test dispatch, email test relay) function cleanly without throwing errors.
