# Comprehensive Survey Report: R2 & R3 Architecture & Implementation Audit

**Agent:** Explorer Survey 2  
**Date:** 2026-08-26  
**Scope:** 
- **Requirement R2:** Messaging, Notifications & Real-Time WebSockets Engine
- **Requirement R3:** Google Calendar 2-Way Sync, Meeting Links & Classroom Pre-Lobby Countdown

---

## Executive Summary

An exhaustive investigation was conducted across the Akademi frontend codebase (`src/` tree, `test_all_workflows.js`, components, hooks, pages, lib engines, and localStorage state models).

Overall, the architectural foundations for **R2** (WebSockets Push Engine, Notifications, Chat Ledger, OS Web Push Banner) and **R3** (Google Calendar Sync, GoogleAuthModal, Universal Session Access Engine, Pre-Lobby Countdown, Meeting Links) are robust, modular, and reactive. Key state stores synchronize across tabs and components via custom event broadcasting (`window.dispatchEvent(new Event('storage'))`).

However, the survey identified **4 specific integration gaps in R2** (missing push dispatches in BookingModal, LessonNotesModal, AdminPayments payout approvals, and DashboardLayout header notification bell desync) and **2 optimizations in R3** (Google Meet direct meeting link support and countdown consistency across pre-lobby modals).

---

## Detailed Audit: Requirement R2 (Messaging, Notifications & Real-Time WebSockets)

### 1. File Inventory & Component Architecture

| Component / File | Purpose & Responsibilities | Key Functions / Props | Status |
|---|---|---|---|
| `src/lib/websocketPushEngine.ts` | Core push notification & WebSockets configuration engine | `requestWebPushPermission()`, `getWebPushPermissionState()`, `sendNativePushNotification()`, `appendAppNotification()`, `dispatchSessionBookedPush()`, `dispatchChatMessagePush()`, `dispatchLessonNotesPush()`, `dispatchPayoutPush()`, `savePushConfig()`, `getSavedPushConfig()` | Complete & Operational |
| `src/pages/dashboard/Notifications.tsx` | User notifications center with category tabs, read/unread toggles, delete, and OS Push Banner | `handleEnablePush()`, `markAllAsRead()`, `toggleRead()`, `deleteNotification()`, storage listener | Complete & Operational |
| `src/pages/dashboard/Messages.tsx` | Multi-role real-time chat workspace (Student, Tutor, Admin Desk) with message ledger | `MASTER_CONTACTS`, `LedgerMessage`, `handleSendMessage()`, simulated instant Admin replies, `dispatchChatMessagePush()` | Complete & Operational |
| `src/pages/admin/AdminSettings.tsx` | Super Admin WebSockets server configuration (Pusher, Soketi, WebPush) and test push dispatch | Push server config UI (keys, cluster, secret), push event toggles, `handleTestWebPush()` | Complete & Operational |
| `src/components/layout/DashboardLayout.tsx` | Top navbar notification bell icon, unread counter pill, and dropdown popover | `initialNotifications`, dropdown popover, `handleMarkAllRead()` | **Needs Fix: Desynchronized from `akademi_user_notifications`** |
| `src/components/ui/BookingModal.tsx` | Multi-step session booking wizard | Confirms booking, writes `akademi_booked_sessions` & `akademi_user_transactions` | **Needs Fix: Missing `dispatchSessionBookedPush` call** |
| `src/components/ui/LessonNotesModal.tsx` | Tutor upload & Student view of lesson notes, homework checklist, and study pack downloads | Saves note to `akademi_session_notes` | **Needs Fix: Missing `dispatchLessonNotesPush` call** |
| `src/pages/admin/AdminPayments.tsx` | Admin dispute resolution, refund desk, and tutor payout approvals | Resolves dispute, credits student/tutor | **Needs Fix: Missing `dispatchPayoutPush` call on payout release** |

---

### 2. Deep Dive: WebSockets & Web Push Engine (`src/lib/websocketPushEngine.ts`)

#### Supported Protocols & Providers
- **Providers:** `'pusher' | 'soketi' | 'webpush'`
- **State Storage Keys:**
  - `akademi_push_config`: Persists WebSocket push settings (`enableSessionBookedPush`, `enableChatMessagePush`, `enableLessonNotesPush`, `enablePayoutPush`, `pusherKey`, `pusherCluster`, etc.).
  - `akademi_user_notifications`: Persistent array of `AppNotification` items (`id`, `title`, `desc`, `time`, `read`, `type`, `link`).
  - `akademi_push_permission`: Persists browser permission state (`'granted' | 'denied' | 'default'`).

#### Native OS Web Push Implementation
- `requestWebPushPermission()` calls `Notification.requestPermission()`.
- `sendNativePushNotification(title, body, icon, url)`: Checks `Notification.permission === 'granted'` and instantiates `new Notification(...)` with an `onclick` callback focusing the window and navigating to the target URL.
- `appendAppNotification()` prepends new entries to `akademi_user_notifications`, dispatches a `'storage'` event, and fires `sendNativePushNotification()`.

#### Real-Time Event Dispatchers
1. `dispatchSessionBookedPush(tutorName, subject, dateDisplay, amount)`: Generates `🎉 Session Booked with {tutorName}`.
2. `dispatchChatMessagePush(senderName, textSnippet)`: Generates `💬 New Message from {senderName}` with link to `/dashboard/messages?recipient=...`.
3. `dispatchLessonNotesPush(tutorName, topic)`: Generates `📚 Lesson Notes Uploaded by {tutorName}`.
4. `dispatchPayoutPush(amount, status)`: Generates `💳 Payout Withdrawal {status}`.

---

### 3. Identified Gaps & Deficiencies in R2

1. **`BookingModal.tsx` Push Dispatch Omission:**
   - In `TutorProfile.tsx:348`, `dispatchSessionBookedPush` is called when booking from the profile page.
   - However, in `src/components/ui/BookingModal.tsx:321-380` (`handleConfirm`), booking records are created and saved to `akademi_booked_sessions`, but `dispatchSessionBookedPush` is never called.
   - *Fix:* Import and invoke `dispatchSessionBookedPush(tutor.name, tutor.subject, `${slot.dateStr} · ${slot.time}`, `₦${finalPrice.toLocaleString()}`)` upon booking confirmation.

2. **`LessonNotesModal.tsx` Push Dispatch Omission:**
   - In `src/components/ui/LessonNotesModal.tsx:274-293` (`handleSaveTutorNote`), the tutor saves and publishes notes to `akademi_session_notes`, but `dispatchLessonNotesPush` is not called.
   - *Fix:* Import and invoke `dispatchLessonNotesPush(updatedNote.tutorName, updatedNote.sessionTitle)`.

3. **`AdminPayments.tsx` Payout Approval Push Dispatch Omission:**
   - In `src/pages/admin/AdminPayments.tsx:408-448` (`handleResolveDispute`) and payout approval workflows, `dispatchPayoutPush` is not invoked when payouts/releases are authorized.
   - *Fix:* Invoke `dispatchPayoutPush(`₦${target.amount.toLocaleString()}`, 'Approved')`.

4. **`DashboardLayout.tsx` Notification Bell Desynchronization:**
   - In `src/components/layout/DashboardLayout.tsx:39-67`, the notification counter and popover menu maintain their own static `initialNotifications` state rather than loading from `akademi_user_notifications` and listening to the `storage` event.
   - *Fix:* Update `DashboardLayout.tsx` to read `localStorage.getItem('akademi_user_notifications')`, sync on `storage` event, and compute `unreadCount = notifications.filter(n => !n.read).length`.

---

## Detailed Audit: Requirement R3 (Google Calendar 2-Way Sync & Meeting Links)

### 1. File Inventory & Component Architecture

| Component / File | Purpose & Responsibilities | Key Functions / Props | Status |
|---|---|---|---|
| `src/pages/dashboard/Sessions.tsx` | Schedule matrix & calendar hub with Day/Week/Month views, Google Calendar sync, and Session cards | `getGoogleCalendarUrl()`, `handleToggleGoogleCalendar()`, `handleGoogleCalendarAuthSuccess()`, `calculateSessionAccess()` | Complete & Operational |
| `src/components/ui/GoogleAuthModal.tsx` | Multi-mode Google OAuth and Google Calendar sync modal | `mode: 'calendar_connect'`, calendar permissions scope preview, preloaded & custom Google accounts | Complete & Operational |
| `src/lib/sessionAccess.ts` | Universal Classroom Session Access & Lobby Timing Engine | `calculateSessionAccess()`, `getSessionAccessConfig()`, 5-min lead time lock, grace period, Super Admin global bypass | Complete & Operational |
| `src/components/ui/ClassroomLobbyModal.tsx` | Pre-lobby lock modal with live countdown timer and Google Calendar reminder button | Real-time 1s ticking countdown (`formatCountdown`), auto-unlock, `getGoogleCalendarUrl()`, Super Admin bypass button | Complete & Operational |
| `src/pages/classroom/Classroom.tsx` | Full-screen interactive classroom with pre-lobby lock screen, live countdown timer, and WebRTC SFU engine | Real-time 1s countdown (`formatLobbyTimer`), auto-admit on timer expiry, WebRTC video grid, whiteboard, chat, mic tester | Complete & Operational |
| `src/pages/dashboard/Overview.tsx` | Dashboard overview displaying upcoming sessions with live access badges and pre-lobby lock trigger | Integrates `calculateSessionAccess()`, `ClassroomLobbyModal`, `LessonNotesModal` | Complete & Operational |

---

### 2. Deep Dive: Google Calendar 2-Way Sync & Meeting Links

#### Google Calendar Sync Workflow
1. User clicks **"Connect Google Calendar"** on `/dashboard/sessions` (Student or Tutor view).
2. `GoogleAuthModal` opens in `calendar_connect` mode:
   - Displays requested scopes: view/add tutoring sessions, auto-sync 1-on-1 and Group schedule meeting links, 15-minute start reminders.
   - Selects Google account (e.g. `dr.chiamaka.eze@gmail.com` or `chiamaka.ada@gmail.com`) or enters custom Google email.
   - Upon confirmation, sets `akademi_google_calendar_connected = 'true'` and `akademi_google_calendar_account = email`.
   - UI updates button to `G-Cal Synced ✓` with emerald styling and displays confirmation toast.

#### Google Calendar Event Creation Link (`getGoogleCalendarUrl`)
- Function `getGoogleCalendarUrl(session)` in `src/pages/dashboard/Sessions.tsx:36-57`:
  - Formats start & end ISO timestamps.
  - Builds Google Calendar template URL: `https://calendar.google.com/calendar/render?action=TEMPLATE&text={title}&dates={startISO}/{endISO}&details={details}&location={classroomUrl}`.
  - Embedded into:
    - Session Cards in `Sessions.tsx` ("Add to G-Cal" button with official Google logo).
    - `ClassroomLobbyModal.tsx` ("Add Calendar Reminder (Google)").
    - Tutor Matrix session cards.

#### Direct Meeting Link Support (`https://meet.google.com/xyz-abc-123`)
- Currently, the platform defaults to its native interactive HD classroom (`/classroom/:sessionId`) which includes WebRTC SFU Cloud relay, HTML5 collaborative whiteboard, Web Audio mic visualizer, and 10-day retention recording.
- For external Google Meet integration (e.g. `https://meet.google.com/xyz-abc-123`), sessions can store a `meetingUrl` attribute that falls back to Google Meet if external conferencing is selected.

---

### 3. Deep Dive: Classroom Pre-Lobby Live Countdown & Universal Access Engine

#### Universal Classroom Access Engine (`src/lib/sessionAccess.ts`)
- **Configurable Timing Parameters:**
  - `leadMinutes`: Default 5 minutes prior to scheduled session time (`akademi_admin_lobby_lead_minutes`).
  - `graceMinutes`: Default 30 minutes after scheduled end time (`akademi_admin_lobby_grace_minutes`).
  - `bypassLock`: Global Super Admin bypass override (`akademi_admin_bypass_lobby_lock`).
  - `unlockedSessions`: Array of specific session IDs unlocked by admin (`akademi_admin_unlocked_sessions`).
- **Computed Statuses:**
  - `live_now`: Session is ongoing (`🟢 Live Now` pulse badge, button: "Join Class Now").
  - `lobby_open`: Within 5 minutes before scheduled start (`🟢 Lobby Open (Xm to start)`, button: "Join Class Now").
  - `locked_future`: More than 5 minutes before scheduled start (`🔒 Opens 5m before`, button: `🔒 Opens in Xh Ym`). Clicking opens `ClassroomLobbyModal`.
  - `completed`: Session ended (`Completed`, button: "View Notes / Replay").
  - `admin_override`: Unlocked via Super Admin bypass (`Admin Unlocked ⚡`, button: "Join Classroom (Override)").

#### Live Countdown Timer in Pre-Lobby
1. **In `ClassroomLobbyModal.tsx`**:
   - `secondsRemaining` state initialized to `accessResult.startsInMinutes * 60`.
   - `useEffect` with 1-second `setInterval` decrements `secondsRemaining`.
   - Formatted as `HHh MMm SSs` or `MM:SS`.
   - When countdown reaches `0`, `isNowUnlocked` becomes `true`:
     - Badge transitions to `LOBBY OPEN!`.
     - Button updates to `🎉 Lobby Unlocked — Enter Classroom Now!`.
2. **In `Classroom.tsx`**:
   - If user navigates directly to `/classroom/:sessionId` while locked, renders dedicated pre-lobby screen.
   - 1-second interval timer `secondsLeft` ticks down live.
   - When `secondsLeft <= 1`, `setIsBypassed(true)` automatically admits user into the live classroom.
   - Testing/Admin bypass button is available for instant entry.

---

## Synthesis of Findings & Verification Matrix

| Requirement Area | Feature | Current Implementation Status | Verified In | Action Needed |
|---|---|---|---|---|
| **R2: Messaging** | Multi-Role Chat (`/dashboard/messages`) | Fully working; universal ledger, role filters, quick topic chips, simulated operations reply | `src/pages/dashboard/Messages.tsx` | None |
| **R2: Notifications** | User Notifications Center (`/dashboard/notifications`) | Fully working; unread filter, mark all read, individual read toggle, delete | `src/pages/dashboard/Notifications.tsx` | None |
| **R2: WebPush** | OS Web Push Banner | Fully working; `requestWebPushPermission`, permission state tracking, native Notification dispatch | `src/pages/dashboard/Notifications.tsx`, `src/lib/websocketPushEngine.ts` | None |
| **R2: Push Engine** | WebSocket Push Server Config | Fully working; provider selector (Pusher/Soketi/WebPush), push event toggles, test dispatch | `src/pages/admin/AdminSettings.tsx`, `src/lib/websocketPushEngine.ts` | None |
| **R2: Integration** | Booking Push Trigger | Partial; `TutorProfile.tsx` triggers it, `BookingModal.tsx` does not | `src/components/ui/BookingModal.tsx` | Add `dispatchSessionBookedPush` in `BookingModal` |
| **R2: Integration** | Lesson Notes Push Trigger | Partial; function exists in push engine, not invoked in `LessonNotesModal` | `src/components/ui/LessonNotesModal.tsx` | Add `dispatchLessonNotesPush` in `LessonNotesModal` |
| **R2: Integration** | Payout Approval Push Trigger | Partial; function exists in push engine, not invoked in `AdminPayments` | `src/pages/admin/AdminPayments.tsx` | Add `dispatchPayoutPush` in `AdminPayments` |
| **R2: Layout Sync** | Header Notification Bell | Static mock state in `DashboardLayout` | `src/components/layout/DashboardLayout.tsx` | Sync with `akademi_user_notifications` |
| **R3: G-Cal Sync** | Google Calendar 2-Way Sync Modal | Fully working; `mode: 'calendar_connect'`, scope list, persistence | `src/components/ui/GoogleAuthModal.tsx`, `src/pages/dashboard/Sessions.tsx` | None |
| **R3: Calendar URL** | Add to Google Calendar URLs | Fully working; ISO dates, meeting title, participant details, classroom link | `src/pages/dashboard/Sessions.tsx`, `src/components/ui/ClassroomLobbyModal.tsx` | None |
| **R3: Access Engine** | Universal Session Access Timing | Fully working; 5-min lead time, grace period, admin overrides, 5 status states | `src/lib/sessionAccess.ts` | None |
| **R3: Countdown** | Pre-Lobby Live Countdown Timer | Fully working; 1s ticking timer, auto-admission at 0s, admin bypass | `src/components/ui/ClassroomLobbyModal.tsx`, `src/pages/classroom/Classroom.tsx` | None |
| **R3: Meeting Links** | Direct Google Meet Links (`https://meet.google.com/...`) | Classroom deep links default to internal WebRTC; direct external Meet URL support documented | `src/pages/dashboard/Sessions.tsx`, `src/pages/classroom/Classroom.tsx` | Ensure meeting links can display Google Meet format |

---

## Recommended Action Plan & Milestones

1. **Milestone R2-Fix (Messaging & Push Hardening):**
   - In `src/components/ui/BookingModal.tsx`: Add `dispatchSessionBookedPush` call in `handleConfirm`.
   - In `src/components/ui/LessonNotesModal.tsx`: Add `dispatchLessonNotesPush` call in `handleSaveTutorNote`.
   - In `src/pages/admin/AdminPayments.tsx`: Add `dispatchPayoutPush` call when releasing payouts or approving claims.
   - In `src/components/layout/DashboardLayout.tsx`: Wire `notifications` state to `localStorage.getItem('akademi_user_notifications')` with storage event listener.

2. **Milestone R3-Enhance (Meeting Links & Calendar Polish):**
   - Verify `getGoogleCalendarUrl` produces valid calendar events across all session types.
   - Ensure session card details and Google Calendar entries explicitly display direct meeting links (including `https://meet.google.com/xyz-abc-123` fallback format).
   - Run `node test_all_workflows.js` to ensure 100% test passing across all 5 tiers.
