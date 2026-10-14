# Requirements & Subsystems Comprehensive Architecture Survey (R1 – R5)

**Platform**: Akademi Online Learning & Tutoring Platform  
**Target Directory**: `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend`  
**Survey Date**: 2026-08-31  
**Auditor**: Survey Explorer 3 (Requirements & Subsystems Specialist)

---

## Executive Summary

An exhaustive codebase audit was conducted across all components, pages, services, hooks, utilities, and test suites of the Akademi frontend architecture. The investigation mapped and verified the five core platform requirements:
1. **R1**: Payment Gateway & Financial Commission
2. **R2**: WebRTC SFU Cloud Media Server & Masterclass Relays
3. **R3**: WebSockets & Mobile Push Notification Server
4. **R4**: Google Calendar & Email Communications Relay
5. **R5**: Feature Module Controls & Community Governance

All subsystems have established concrete implementations, state schemas, and reactive fallback mechanisms utilizing 28 synchronized localStorage state keys, event dispatchers, and modular UI components.

---

## Subsystem Survey: Requirements R1 through R5

### R1: Payment Gateway & Financial Commission

#### 1. Implementation Overview
- **Primary Files**:
  - `src/pages/admin/AdminPayments.tsx` (2,036 lines): Super Admin & Payment Gateway Console, Gateway configuration hub, live ledger, dispute hub, direct refund desk, and audit logs.
  - `src/pages/dashboard/Billing.tsx` (1,318 lines): Student & Tutor wallet management, NUBAN KYC payout setup, Paystack direct top-up wizard, 2FA prompt, transaction history.
  - `src/components/modals/Payment2FAModal.tsx` (246 lines): Reusable 6-digit OTP verification modal with auto-focus, paste support, and 45s countdown.
  - `src/components/modals/InitiateRefundModal.tsx` (244 lines): Full (100%) and Partial direct refund execution modal with reason categorization.
  - `src/components/modals/SuperAdminAuthModal.tsx` (178 lines): Master password protection for sensitive financial changes (`admin123`).
  - `src/components/ui/BookingModal.tsx` (1,068 lines): In-modal Paystack checkout (Card, Bank Transfer to Wema Bank, USSD `*737*50*...#`).

#### 2. Key State Keys & Default Configurations
| State Key | Default Value | Description |
|-----------|---------------|-------------|
| `akademi_admin_gateways` | Array of 3 Gateways | Paystack (Active/Default, `pk_live_890a8e9f01bc234d5678`, `sk_live_123456789abcdef01234`), Flutterwave, Stripe |
| `akademi_default_gateway_name` | `'Paystack'` | Global default active payment gateway |
| `akademi_commission_rate` | `10` | 10% platform commission fee |
| `akademi_require_payment_2fa` | `'true'` | Mandatory 6-digit OTP requirement for checkouts |
| `akademi_min_payout_threshold` | `5000` | Minimum tutor withdrawal amount (₦5,000) |
| `akademi_platform_payout_schedule` | `'Weekly (Every Friday at 4:00 PM)'` | Disbursal schedule |
| `akademi_tutor_kyc` | GTBank object | NUBAN 10-digit account verification (`0123456789`) |
| `akademi_wallet_balance_ngn` | `142500` / `30000` | Persistent user wallet balance |
| `akademi_user_transactions` | Array of records | Transaction history ledger |
| `akademi_payment_disputes` | Array of claims | Dispute claim resolution desk |
| `akademi_admin_audit_logs` | Array of log entries | Immutable security and financial audit trail |

#### 3. Verification & Edge Cases
- **Commission Split**: `platformFee = Math.round(gross * (rate / 100))`, `tutorNet = gross - platformFee`. Conserves 100% split across all rates (0% to 100%).
- **NUBAN Verification**: Validates 10 numeric digits conforming to Nigerian banking standards.
- **Refund Flow**: Supports Full (100%) and Partial amounts with automatic credit back to `akademi_wallet_balance_ngn` and audit logging.

---

### R2: WebRTC SFU Cloud Media Server & Masterclass Relays

#### 1. Implementation Overview
- **Primary Files**:
  - `src/lib/sfuEngine.ts` (125 lines): WebRTC SFU configuration engine, resolution presets, network stats models, and peer generators.
  - `src/pages/classroom/Classroom.tsx` (1,583 lines): Full-screen interactive meeting room, pre-class lobby countdown, Web Audio API volume visualizer, MediaRecorder recording, and dynamic participant grid.
  - `src/pages/admin/AdminSettings.tsx` (2,020 lines): SFU provider preset selection, threshold settings, mobile eco mode toggle, latency health probe.

#### 2. Key Capabilities & Presets
- **SFU Providers**:
  - `livekit` (Default / Recommended - Lagos/London SFU nodes)
  - `agora` (Agora Video WebRTC SFU Relay)
  - `custom` (Akademi Custom WebRTC SFU Engine)
- **Auto-Switch Threshold**: Automatically upgrades from P2P Mesh to SFU Cloud Relay when participant count exceeds threshold (default: >8 peers; selectable 4, 8, 12).
- **Resolution Presets (`VIDEO_PRESETS`)**:
  - `1080p` (Full HD, 2.5 Mbps, 30fps)
  - `720p` (HD Standard, 1.2 Mbps, 30fps - Default)
  - `480p` (SD Data Saver, 600 Kbps, 24fps)
  - `360p_eco` (360p Eco SFU Mode, 300-420 Kbps, 20fps - Saves 72% bandwidth for 3G/4G stability)
- **Lagos 24ms Node Health Probe**:
  - Simulated latency check: `📡 SFU Cloud Relay Active · Ping: 24ms (Lagos Node) · Packet Loss: 0.0% · Protocol: LiveKit WebRTC`.
- **Participant Grid Scaling**:
  - 1-on-1 mode (2 participants, Mesh)
  - Group mode (8 participants, 2x4 grid)
  - Masterclass SFU mode (up to 16 participants, 4x4 gallery with active speaker highlight and signal indicators).

---

### R3: WebSockets & Mobile Push Notification Server

#### 1. Implementation Overview
- **Primary Files**:
  - `src/lib/websocketPushEngine.ts` (158 lines): Real-time broadcast engine, WebSocket push config, native Web Push API triggers, persistent notification append helpers.
  - `src/pages/admin/AdminSettings.tsx`: WebSockets & Push server configuration, automated trigger toggles, test push dispatcher.
  - `src/pages/dashboard/Notifications.tsx` (215 lines): Notification center with mark-all-as-read and filtering.
  - `src/pages/dashboard/Messages.tsx` (1,154 lines): Real-time messaging with live push dispatch.

#### 2. Key Providers & Event Triggers
- **Providers**: `pusher` (Pusher Channels, cluster: `eu`), `soketi` (Self-hosted Laravel WebSockets), `webpush` (Native Web Push API).
- **Config Key**: `akademi_push_config`
- **Instant Event Triggers**:
  1. `dispatchSessionBookedPush()`: Dispatched upon booking confirmation (`BookingModal.tsx:380`).
  2. `dispatchChatMessagePush()`: Dispatched on incoming messages.
  3. `dispatchLessonNotesPush()`: Dispatched on study notes upload (`LessonNotesModal.tsx`).
  4. `dispatchPayoutPush()`: Dispatched on payout release (`AdminPayments.tsx:440`).
- **Live Storage Event Fallbacks**:
  - `window.addEventListener('storage', ...)` and `window.dispatchEvent(new Event('storage'))` guarantee immediate synchronization across multiple browser tabs with zero page refreshes.

---

### R4: Google Calendar & Email Communications Relay

#### 1. Implementation Overview
- **Primary Files**:
  - `src/pages/dashboard/Sessions.tsx` (1,695 lines): Google Calendar connect status, 2-way sync toggle, `getGoogleCalendarUrl()` generator.
  - `src/components/ui/GoogleAuthModal.tsx` (360 lines): Google OAuth modal supporting signin, signup, and calendar connect with preloaded and custom accounts.
  - `src/pages/admin/AdminSettings.tsx`: SMTP email server settings, provider picker, test email sender, dynamic platform favicon branding uploader and presets.

#### 2. Key Features & Specifications
- **Google Calendar URL & Template Generation**:
  - `getGoogleCalendarUrl(session)` in `Sessions.tsx:36-58` constructs standard Google Calendar URLs:
    - `action=TEMPLATE`
    - `text=Akademi Session: ${title}`
    - `dates=${startISO}/${endISO}`
    - `details=...` including Classroom URL (`https://akademi.ng/classroom/${id}`) and Direct Meet Link (`https://meet.google.com/xyz-abc-123`).
    - `location=https://meet.google.com/xyz-abc-123`
- **SMTP Email Server Relay Settings**:
  - Providers: `SendGrid` (Default, `smtp.sendgrid.net`), `Custom SMTP`, `Amazon SES`, `Mailgun`.
  - Port & Encryption: Standard Port `587` (TLS), `465` (SSL), `STARTTLS`.
  - Sender Identity: `Akademi Platform` (`no-reply@akademi.com`), Reply-to (`support@akademi.com`).
  - Test Sender: Interactive modal simulating test email dispatch.
- **Platform Favicon Branding Injection**:
  - Dynamically updates `<link rel="icon">` in `document.head`.
  - Supports custom file upload (max 2MB, .ico/.png/.svg/.webp) and 1-click presets (Grad Cap 🎓, Open Book 📖, Gold Star ⭐).

---

### R5: Feature Module Controls & Community Governance

#### 1. Implementation Overview
- **Primary Files**:
  - `src/pages/admin/AdminSettings.tsx`: Master module toggle for Communities (`akademi_enable_communities`), LearnTokens conversion rules, Classroom lobby timing controls.
  - `src/components/layout/Navbar.tsx`: Conditionally hides 'Communities' navigation link when toggle is false.
  - `src/components/layout/DashboardLayout.tsx`: Conditionally filters 'Communities' from student/tutor sidebar.
  - `src/components/layout/AdminLayout.tsx`: Admin navigation with Super Admin role gates.
  - `src/pages/dashboard/Overview.tsx`: Conditionally displays 'My Communities & Study Circles', LearnTokens balance, and conversion modal.
  - `src/pages/dashboard/Communities.tsx`: Shows friendly "Communities Launch Pending" banner redirecting to `/tutors` when disabled.
  - `src/pages/dashboard/Recordings.tsx`: 10-day free recording retention window with countdowns and optional extension (₦1,500/mo).

#### 2. Key Policies & State Controls
- **Communities Module Launch Flag**:
  - Key: `akademi_enable_communities` (defaults to `'false'` for initial 1:1 launch focus).
  - Consistent across Navbar, Dashboard Sidebar, Overview screens, and Communities index.
- **LearnTokens Rewards Policies**:
  - `akademi_tokens_per_minute` (default: 10 tokens = 1 min free lesson time).
  - `akademi_referral_bonus_tokens` (default: 150 tokens for inviting a friend).
  - `akademi_streak_bonus_tokens` (default: 50 tokens for 7-day study streak).
  - `akademi_student_reward_minutes` (pool of free minutes).
  - Guaranteed 100% full gross credit to tutor earnings even when student pays with token subsidy.
- **10-Day Recording Retention**:
  - Free 10-day retention window tracked in `daysRemaining`.
  - In-browser MediaRecorder saves recordings directly to `akademi_recorded_sessions`.
  - Option to retain recordings beyond 10 days for ₦1,500/month.

---

## State Schema Inventory (28 Core Keys)

| Key | Type | Default / Example Value | Description |
|---|---|---|---|
| `akademi_auth_user` | JSON | `{"role": "student", "name": "Chiamaka"}` | Active authenticated user persona |
| `akademi_admin_gateways` | JSON | Array of 3 Gateways | Payment gateway configurations & API keys |
| `akademi_default_gateway_name` | string | `'Paystack'` | Active primary payment gateway |
| `akademi_commission_rate` | string | `'10'` | Platform tutoring commission percentage |
| `akademi_require_payment_2fa` | string | `'true'` | Mandatory 2FA checkout requirement |
| `akademi_min_payout_threshold` | string | `'5000'` | Minimum tutor payout balance threshold (NGN) |
| `akademi_platform_payout_schedule` | string | `'Weekly (Every Friday at 4:00 PM)'` | Payout disbursal frequency |
| `akademi_admin_users` | JSON | Array of Users | Admin user accounts & suspension statuses |
| `akademi_admin_tutors` | JSON | Array of Tutors | Tutor verification & approval statuses |
| `akademi_registered_tutors` | JSON | Array of Tutors | Public tutor directory search catalog |
| `akademi_payment_disputes` | JSON | Array of Disputes | Payment disputes & claims ledger |
| `akademi_admin_audit_logs` | JSON | Array of Audit Logs | Governance immutable audit trail |
| `akademi_enable_communities` | string | `'false'` | Master feature flag for Communities module |
| `akademi_communities` | JSON | Array of Communities | Communities catalog and membership data |
| `akademi_email_provider` | string | `'SendGrid'` | Active email relay provider |
| `akademi_smtp_host` | string | `'smtp.sendgrid.net'` | SMTP mail server address |
| `akademi_platform_favicon` | string | Base64 SVG data URL | Dynamic platform favicon link |
| `akademi_user_tokens` | string | `'450'` | Student LearnTokens balance |
| `akademi_student_reward_minutes`| string | `'30'` | Free tutoring session minutes pool |
| `akademi_tokens_per_minute` | string | `'10'` | Conversion rate (tokens per 1 min lesson) |
| `akademi_streak_bonus_tokens` | string | `'50'` | Weekly streak bonus grant |
| `akademi_referral_bonus_tokens` | string | `'150'` | Friend referral QR bonus grant |
| `akademi_wallet_balance_ngn` | string | `'142500'` | User wallet cash balance (NGN) |
| `akademi_user_transactions` | JSON | Array of Transactions | Transaction history ledger |
| `akademi_booked_sessions` | JSON | Array of Bookings | Persistent session bookings |
| `akademi_session_notes` | JSON | Map of Study Packs | Structured lesson summaries & homework |
| `akademi_tutor_available_slots` | JSON | Map of Day Slots | Tutor preferred bookable meeting hours |
| `akademi_tutor_payouts` | JSON | Array of Payouts | Tutor withdrawal requests & statuses |

---

## Key Integration Observations & Refinements

1. **Admin Sidebar Communities Alignment**:
   - In `src/components/layout/AdminLayout.tsx`, `allNavItems` / `visibleNavItems` at line 125 declares `{ name: 'Communities Hubs', path: '/admin/communities' }`. While lines 40-54 define `navItems` with an `enableCommunities` filter, the component maps `visibleNavItems` on line 178. Unifying this ensures the Admin Sidebar cleanly reflects the Communities state or flags it as an admin-only moderation console.
2. **Admin Overview Quick Actions**:
   - In `src/pages/admin/AdminOverview.tsx`, stat card line 103 and quick action card line 178 reference Communities without checking `enableCommunities`. A simple badge or label noting "(Feature Module Disabled / Pending)" when the toggle is OFF provides enhanced clarity.
3. **TypeScript & Test Harness Certification**:
   - All 5 tiers in `test_all_workflows.js` (Feature Coverage, Boundary Cases, Cross-Role Integrations, E2E User Journeys, Static Sanity) execute with 100% pass rate.
   - All tests in `test_adversarial_challenger_2.mjs` and `test_rewards_and_grids.mjs` confirm robust fallback handling.
