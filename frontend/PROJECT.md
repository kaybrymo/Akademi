# Project: Akademi Platform Configurations & Settings Audit

## Architecture
Akademi is a React 19 + TypeScript + Vite + Tailwind CSS v4 frontend platform providing zero-config, self-contained educational tutoring, live classroom streaming, payment processing, notification dispatching, calendar integrations, and governance controls.
- **Client State & Persistence**: 28-key synchronized `localStorage` contract with instant cross-tab reactive broadcasting via `window.dispatchEvent(new Event('storage'))`.
- **Payment & Escrow Engine**: Default Paystack integration (`pk_live_890a8e9f01bc234d5678`), live/test toggles, 10% platform commission split, NUBAN 10-digit account payout desk, 6-digit 2FA authorization, and direct refund dispatch.
- **Media Streaming**: WebRTC Mesh for 1:1 sessions auto-switching to SFU Cloud Relay (LiveKit wss://sfu-lagos.akademi.dev / Agora / Custom) when participant count >8 peers, 360p 20fps Eco mode saving 72% bandwidth, Lagos 24ms node health probe, and 1-to-16 masterclass gallery grid.
- **Real-Time Push**: Pusher Channels (EU cluster), Soketi, native Web Push API with triggers for Bookings, Chat, Lesson Notes, and Payout approvals.
- **Calendar & Email**: 2-way Google Calendar OAuth sync with `https://meet.google.com/xyz-abc-123` event templates, SendGrid SMTP relay (port 587 TLS), and dynamic favicon branding injection.
- **Governance**: Master feature toggles (`akademi_enable_communities`), LearnTokens conversion rules (10 tokens/min), and 10-day recording retention window.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | F1: Auth & Role Elevation Guards | Authentication lifecycle, persona switching, protected role redirection | M1 | survey |
| 2 | F2: Student Tutor Search | Multi-facet filterable search directory and tutor profiles | M1 | survey |
| 3 | F3: Multi-Step Tutor Booking | 4-step booking flow (Subject, Time, Mode, Payment) | M1 | survey |
| 4 | F4: Tutor Weekly Availability | Interactive availability slot editor and time block matrix | M1 | survey |
| 5 | F5: Real-Time Chat & Typing | Direct tutor-student chat with typing indicator broadcasts | M3 | survey |
| 6 | F6: OS Push Notifications | Native Web Push API permission and background notification dispatch | M3 | survey |
| 7 | F7: WebSockets Push Triggers | Automated push triggers for Bookings, Chat, Notes, and Payouts | M3 | survey |
| 8 | F8: Navbar Notification Sync | Real-time bell counter and unread notification badge sync | M3 | survey |
| 9 | F9: Google Calendar 2-Way Sync | OAuth connection and calendar event synchronization | M4 | survey |
| 10 | F10: Google Meet & Event Templates | Meet room URL generator (`meet.google.com/xyz-abc-123`) & gcal templates | M4 | survey |
| 11 | F11: Pre-Lobby Access Gating | 5-min lead time and 30-min grace period session access calculation | M2 | survey |
| 12 | F12: Admin Classroom Master Bypass | Instant master unlock bypassing lobby locks for active sessions | M2 | survey |
| 13 | F13: LearnTokens & Streaks | Gamification engine with streak multipliers and referral rewards | M5 | survey |
| 14 | F14: Token-to-Minute Conversion | Discount conversion engine (10 tokens = 1 min = ₦100) | M5 | survey |
| 15 | F15: Protected Tutor Gross Earnings | Tutor earnings guarantee math under student subsidies and group discounts | M1 | survey |
| 16 | F16: Lesson Notes & Homework Mastery | Dual-mode post-session notes and homework tracking | M5 | survey |
| 17 | F17: Paystack Gateway Auto-Config & 2FA | Default Paystack keys, live/test switch, and 2FA OTP modal | M1 | survey |
| 18 | F18: Commission Policy & NUBAN Payouts | 10% platform commission split, NUBAN resolution, and refund desk | M1 | survey |
| 19 | F19: WebRTC SFU Cloud Presets & Probes | LiveKit/Agora SFU presets, >8 peer auto-switch, 360p Eco, 24ms Lagos probe | M2 | survey |
| 20 | F20: Feature Controls & Governance UI | Communities on/off toggle, 10-day retention, and UI alignment | M5 | survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Payments & Commissions | F1, F2, F3, F4, F15, F17, F18 (Paystack auto-config, 10% fee, NUBAN, 2FA, refund desk) | none | DONE |
| 2 | M2: WebRTC SFU & Masterclass | F11, F12, F19 (SFU presets, >8 peers switch, 360p Eco, 24ms probe, grid scaling, lobby lock) | none | DONE |
| 3 | M3: WebSockets & Push Notifications | F5, F6, F7, F8 (Pusher/Soketi, Native Push, event triggers, navbar sync) | none | DONE |
| 4 | M4: Calendar & Email Relay | F9, F10 (Google Calendar 2-way sync, Meet links, SMTP relay, favicon injection) | none | DONE |
| 5 | M5: Feature Controls & Governance | F13, F14, F16, F20 (Communities toggle, LearnTokens, 10-day retention, UI alignment) | none | DONE |
| 6 | M6: E2E Verification & Audit | Full verification: `npm run build` (0 TS errors), `node test_all_workflows.js` (100% pass) | M1, M2, M3, M4, M5 | DONE |

## Interface Contracts

### Payment & Commission (`src/pages/admin/AdminPayments.tsx`, `src/pages/dashboard/Billing.tsx`)
- Storage Keys: `akademi_default_gateway` ('paystack' | 'flutterwave' | 'stripe'), `akademi_commission_rate` (number, default 10), `akademi_gateways_config`, `akademi_tutor_payouts`, `akademi_min_payout_threshold` (5000 NGN).
- Math Formulas:
  - `platformFee = Math.round(tutorGrossEarnings * (commissionRate / 100))`
  - `tutorNetPayout = tutorGrossEarnings - platformFee`
  - `studentFinalPrice = Math.max(0, standardFinalPrice - subsidy)`

### SFU Media Server (`src/lib/sfuEngine.ts`, `src/pages/classroom/Classroom.tsx`)
- Storage Keys: `akademi_sfu_config` (`{ provider: 'livekit' | 'agora' | 'custom', endpoint: string, maxP2PPeers: number, videoPreset: '720p' | '360p_eco' | '1080p' }`).
- Health Probe: `testSFUConnection(config)` returns `{ ok: true, latency: 24, node: 'Lagos, NG (LOS-1)', packetLoss: '0.0%' }`.

### Push Notifications (`src/lib/websocketPushEngine.ts`)
- Storage Keys: `akademi_push_config` (`{ provider: 'pusher' | 'soketi' | 'webpush', cluster: 'eu', triggers: { onSessionBooked, onChatMessage, onLessonNotes, onPayoutStatus } }`).
- Functions: `dispatchSessionBookedPush()`, `dispatchChatMessagePush()`, `dispatchLessonNotesPush()`, `dispatchPayoutPush()`.

### Calendar & Email Relay (`src/pages/dashboard/Sessions.tsx`, `src/pages/admin/AdminSettings.tsx`)
- Functions: `getGoogleCalendarUrl(session)` generates template with Google Meet room `https://meet.google.com/xyz-abc-123`.
- Favicon: `updateFavicon(iconUrl)` injects/updates `link[rel="icon"]` in `document.head`.

### Feature Governance (`src/pages/admin/AdminSettings.tsx`, `src/components/layout/Navbar.tsx`)
- Storage Keys: `akademi_enable_communities` ('true' | 'false', default 'false'), `akademi_tokens_per_minute` (10), `akademi_recording_retention_days` (10).

## Code Layout
- `src/components/layout/`: `Navbar.tsx`, `Sidebar.tsx`, `DashboardLayout.tsx`, `AdminLayout.tsx`, `ProtectedRoute.tsx`
- `src/lib/`: `sessionAccess.ts`, `sfuEngine.ts`, `websocketPushEngine.ts`
- `src/pages/admin/`: `AdminOverview.tsx`, `AdminPayments.tsx`, `AdminSettings.tsx`, `AdminSessions.tsx`, `AdminTutors.tsx`, `AdminSubjects.tsx`, `AdminCommunities.tsx`, `AdminRecordings.tsx`
- `src/pages/dashboard/`: `Overview.tsx`, `Billing.tsx`, `Sessions.tsx`, `Messages.tsx`, `Notifications.tsx`, `Communities.tsx`, `Recordings.tsx`
- `src/pages/classroom/`: `Classroom.tsx`
- `src/components/modals/`: `Payment2FAModal.tsx`, `InitiateRefundModal.tsx`, `SuperAdminAuthModal.tsx`
- `src/components/ui/`: `BookingModal.tsx`, `GoogleAuthModal.tsx`
