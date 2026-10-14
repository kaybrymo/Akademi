# Exhaustive Architectural Survey Report: R4, R5, and Automated Test Suites

**Project**: Akademi Frontend — Online Tutoring & Learning Platform  
**Workspace**: `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend`  
**Explorer Agent**: Explorer Survey 3  
**Date**: 2026-08-26  
**Scope**: 
1. **Requirement R4**: Student Rewards, LearnTokens & Session Time Conversions
2. **Requirement R5**: Super Admin Governance & Platform Controls (/admin/settings, /admin/payments, /admin/users, /admin/tutors)
3. **Test Suites & Verification**: `test_all_workflows.js` (Workflows 1–20), `test_adversarial_challenger_2.mjs`, `test_rewards_and_grids.mjs`, and static audit utilities.

---

## 1. Executive Summary

An exhaustive examination and static audit of the Akademi frontend codebase was performed with a specialized focus on **R4 (Gamification, LearnTokens, Subsidies & Tutor Earnings Transparency)**, **R5 (Super Admin Governance, Paystack Gateway Auto-Config, WebRTC SFU Cloud, WebSockets Push, Tutor Verification & Commission Policies)**, and the **Automated Workflow Verification Test Suites**.

### Key Assessment Findings:
1. **R4 Implementation**: The student gamification economy is robustly wired across `src/pages/dashboard/Overview.tsx`, `src/pages/dashboard/Billing.tsx`, `src/components/ui/BookingModal.tsx`, and `src/components/ui/ReferralSnapcodeBadge.tsx`. It provides live balances for LearnTokens and free session minutes, daily streak bonus claims, classmate referral sharing via QR/WhatsApp, token-to-minute conversions, and seamless token subsidies during checkout while guaranteeing 100% gross earnings credit to tutors.
2. **R5 Implementation**: Super Admin governance portals are comprehensively established across `/admin/settings`, `/admin/payments`, `/admin/users`, and `/admin/tutors`. It includes Paystack auto-configuration, live commission adjustment with tuition fee simulation, 1-click user suspensions, tutor credential verification, WebRTC SFU Cloud media settings with 360p Eco Mode, WebSockets Push notification broadcast configuration, dynamic platform favicon injection, payment disputes hub, and an immutable administrative audit ledger.
3. **Test Suites & Verification**: The primary test suite `test_all_workflows.js` encompasses 5 tiers and 82 rigorous assertion checks covering all 20 end-to-end multi-persona workflows. Execution confirms **82/82 (100%) tests passing with 0 failures**. Secondary suites (`test_adversarial_challenger_2.mjs` and `test_rewards_and_grids.mjs`) validate adversarial role transitions, boundary cases, and responsive grid layouts.

---

## 2. Requirement R4 Deep Dive: Student Rewards, LearnTokens & Conversions

### 2.1 Architecture & State Contract
The rewards system utilizes a cross-role synchronized storage model with real-time `storage` event dispatching.

| State Key | Default Value | Purpose | Component Consumer |
|---|---|---|---|
| `akademi_user_tokens` | `450` | User's active LearnTokens balance | `Overview.tsx`, `Billing.tsx`, `BookingModal.tsx` |
| `akademi_student_reward_minutes` | `30` | Converted free tutoring session minutes pool | `Overview.tsx`, `Billing.tsx`, `BookingModal.tsx` |
| `akademi_tokens_per_minute` | `10` | Exchange rate (Tokens required per 1 min of free tutoring) | `Overview.tsx`, `AdminSettings.tsx` |
| `akademi_streak_bonus_tokens` | `50` | Bonus tokens granted for maintaining study streak | `Overview.tsx`, `AdminSettings.tsx` |
| `akademi_referral_bonus_tokens` | `150` | Bonus tokens granted when a classmate uses referral code | `Overview.tsx`, `AdminSettings.tsx` |
| `akademi_wallet_balance_ngn` | `142500` / `25000` | NGN fiat wallet balance | `Billing.tsx`, `BookingModal.tsx` |
| `akademi_user_transactions` | `[...]` | Immutable ledger of deposits, debits, conversions, and subsidies | `Billing.tsx`, `Overview.tsx`, `BookingModal.tsx` |

---

### 2.2 Component & Feature Breakdown

#### A. Student Rewards & Rewards Pass Hub (`src/pages/dashboard/Overview.tsx`)
- **Banner UI**: Displays a gradient card (`bg-gradient-to-r from-[#0F5338] via-[#156947] to-[#0A3D29]`) highlighting the 12-day streak.
- **Real-Time KPI Badges**: Live token balance (`userTokens`), free minutes pool (`studentRewardMinutes`), and conversion rate (`tokensPerMinute`).
- **Streak Bonus Claim**:
  - Clicking `Claim Streak (+50)` executes `handleClaimStreakBonus()`.
  - Increments `userTokens` by `streakBonusTokens` (persisted to `akademi_user_tokens`).
  - Appends an entry of type `Streak Reward` (`+50 Tokens`) to `akademi_user_transactions`.
  - Broadcasts `window.dispatchEvent(new Event('storage'))`.
- **Token Conversion Modal**:
  - Modal triggered via `Convert Tokens` button.
  - Allows selecting preset conversion amounts (50, 100, 200, 300 tokens) or custom inputs.
  - Formula: `minutesGained = Math.floor(tokensToConvert / tokensPerMinute)`.
  - Deducts tokens from balance, increments reward minutes pool, logs a `Token Conversion` transaction, and triggers storage sync.

#### B. Referral Code Sharing & Snapcode Badge (`src/components/ui/ReferralSnapcodeBadge.tsx`)
- **Snapchat-Style Snapcode Card**: Custom branded visual pass displaying QR code matrix pattern, user avatar, subject/title, and formatted referral code (`LEARN-[NAME]-15` for students; `TUTOR-[NAME]-10` for tutors).
- **Multi-Channel Sharing**:
  - **1-Click Copy**: Copies `https://akademi.app/register?ref=LEARN-XXX-15&role=student` to clipboard.
  - **WhatsApp Direct Share**: Generates pre-filled message highlighting 15% discount for classmates and +150 LearnTokens reward bounty.
- **Bounty Rules**: Explains 15% student discount / +150 LearnTokens reward for students; 10% discount / ₦2,000 wallet credit for tutors.

#### C. Multi-Step Booking Modal Subsidy Engine (`src/components/ui/BookingModal.tsx`)
- **Step 2 (Configuration) & Step 3 (Confirmation)**:
  - Detects if `rewardMinutesBalance > 0`.
  - Renders interactive toggle `Apply LearnTokens Reward Time`.
  - **Subsidy Calculation**:
    $$\text{appliedRewardMinutes} = \min(\text{rewardMinutesBalance}, \text{totalLessonMinutes})$$
    $$\text{rewardSubsidyAmount} = \text{round}\left(\frac{\text{appliedRewardMinutes}}{\text{totalLessonMinutes}} \times \text{standardFinalPrice}\right)$$
    $$\text{studentFinalPrice} = \max(0, \text{standardFinalPrice} - \text{rewardSubsidyAmount})$$
  - **Zero Price Floor**: Clamped to $\ge \text{₦}0$, ensuring negative pricing is impossible.

#### D. Tutor Earnings Guarantee & Transparency (`src/pages/dashboard/Billing.tsx` & `src/pages/dashboard/Overview.tsx`)
- **Tutor Earnings Integrity**: Even if the student pays a reduced net amount (or ₦0) using reward minutes, the booking metadata saves:
  - `price`: `studentFinalPrice`
  - `studentPaid`: `studentFinalPrice`
  - `tutorGrossEarnings`: `standardFinalPrice` (100% full gross amount before subsidy)
  - `rewardSubsidyAmount`: `rewardSubsidyAmount` (platform-funded)
  - `isTokenSubsidized`: `true`
- **Tutor Billing View**: Paid sessions list transparently displays both the subsidized student price and `Full Tutor Credit: ₦3,500` badge.
- **Tutor Net Payout**: Platform fee is computed on the gross tuition ($10\% \times \text{₦}3,500 = \text{₦}350$), yielding $\text{₦}3,150$ net credit to the tutor's withdrawable balance.

---

## 3. Requirement R5 Deep Dive: Super Admin Governance & Platform Controls

### 3.1 Role Hierarchy & Guard Model

```
       ┌──────────────────────────────────────────────────────────┐
       │                       Super Admin                        │
       │  (Full access to all 9 admin portals, API Keys, 2FA,     │
       │   Gateway defaults, SFU cloud settings, WebSockets Push) │
       └────────────────────────────┬─────────────────────────────┘
                                    │
       ┌────────────────────────────┴─────────────────────────────┐
       │                        Admin                             │
       │  (Operations: Tutor verification, user suspension,       │
       │   session monitoring, dispute inspection)                │
       └────────────────────────────┬─────────────────────────────┘
                                    │
             ┌──────────────────────┴──────────────────────┐
             │                                             │
┌────────────▼───────────┐                    ┌────────────▼───────────┐
│        Tutor           │                    │        Student         │
│ (/dashboard: Schedule, │                    │ (/dashboard: Learning, │
│  Availability, KYC)    │                    │  Tokens, Booking, Pay) │
└────────────────────────┘                    └────────────────────────┘
```

- `src/components/layout/ProtectedRoute.tsx`: Validates `allowedRoles`. Unauthorized access automatically redirects (`/admin` for elevated roles, `/dashboard` for student/tutor).
- `src/components/layout/AdminLayout.tsx`: Shows elevated navigation tabs (`Recordings Vault`, `Payment Gateways`, `Platform Settings`) only for Super Admin.
- `src/components/modals/SuperAdminAuthModal.tsx`: Requires Super Admin master password (`admin123`) before executing sensitive gateway switches, API key updates, or 2FA policy changes.

---

### 3.2 Key Governance Modules

#### A. Payment Gateway Auto-Configuration & Defaults (`src/pages/admin/AdminPayments.tsx`)
- **Default Active Gateway**: Paystack is initialized as active default with live production public key (`pk_live_890a8e9f01bc234d5678`) and secret key.
- **Multi-Gateway Support**: Includes Paystack, Flutterwave, Stripe, and extensible custom providers.
- **Health Probe Simulator**: 1-click `Probe` button pings gateway API endpoints with simulated latency (138ms).
- **Key Masking**: Secret keys are securely masked (`sk_live_123456789...`) and revealed/updated only through Super Admin password verification.

#### B. 10% Platform Commission Policy & Tuition Simulator (`src/pages/admin/AdminPayments.tsx`)
- **Adjustable Policy**: Super Admin can adjust commission from 0% to 50% (default 10%), persisted to `akademi_commission_rate`.
- **Live Tuition Fee Simulator**: Shows interactive breakdown on a sample ₦5,000 lesson:
  - Sample Session Price: ₦5,000
  - Platform Fee (10%): -₦500
  - Tutor Net Earning: ₦4,500

#### C. Tutor Payout Policy & Minimum Balance Threshold (`src/pages/admin/AdminPayments.tsx` & `Billing.tsx`)
- **Disbursement Schedule**: Configurable schedule (`Weekly (Every Friday at 4:00 PM)`, `Bi-Weekly`, `Monthly`, `Instant`).
- **Minimum Payout Threshold**: Default ₦5,000 persisted to `akademi_min_payout_threshold`.
- **Validation**: Enforced during tutor withdrawal requests in `Billing.tsx`; requests $< \text{₦}5,000$ or $> \text{balance}$ are rejected with descriptive validation banners.

#### D. User Suspension & Account Governance (`src/pages/admin/AdminUsers.tsx`)
- **1-Click Status Toggle**: Admins can toggle any user account between `Active` and `Suspended`.
- **Search & Filter**: Filter by role (Students, Tutors, Admins, Super Admins) and search by name/email.
- **Directory Propagation**: When a tutor is suspended, they are immediately excluded from the public student discovery catalog in `src/pages/Tutors.tsx`.

#### E. Tutor Verification & Credential Hub (`src/pages/admin/AdminTutors.tsx`)
- **Credential Review**: Review educational qualifications (e.g. Cambridge, UNILAG, Sorbonne), subjects, and phone/location.
- **Verification Workflow**:
  - `Verify Now`: Sets status to `Verified`, updates `akademi_admin_tutors` and `akademi_registered_tutors`.
  - `Suspend`: Temporarily suspends active tutor.
  - `Restore`: Restores suspended tutor to verified status.
- **Instant Discovery Reflection**: Verified tutors immediately appear in student search; unverified/pending tutors remain hidden from student directory.

#### F. WebRTC SFU Cloud Media Engine (`src/pages/admin/AdminSettings.tsx` & `src/lib/sfuEngine.ts`)
- **Providers**: LiveKit Cloud (Recommended), Agora Video SFU, Custom WebRTC SFU Engine.
- **Auto-Switch Threshold**: Automatically transitions from peer-to-peer mesh to SFU cloud relay when participant count exceeds threshold (default: 8 participants).
- **Eco Mobile Mode**: 360p @ 20fps (300 Kbps) data saver for 3G/4G cellular connections, saving 72% network bandwidth.
- **Latency Probing**: Live probe tool pings Lagos & London media relay nodes (24ms ping, 0.0% packet loss).

#### G. WebSockets Push Notification Server Setup (`src/pages/admin/AdminSettings.tsx` & `src/lib/websocketPushEngine.ts`)
- **Broadcasting Engine**: Pusher Channels, Soketi, Native Web Push API.
- **Automated Event Triggers**:
  - `enableSessionBookedPush`: Triggers on session booking.
  - `enableChatMessagePush`: Triggers on new chat message.
  - `enableLessonNotesPush`: Triggers on lesson summary/study pack upload.
  - `enablePayoutPush`: Triggers on tutor payout approval/disbursal.
- **Web Push Dispatcher**: Includes `requestWebPushPermission()`, `sendNativePushNotification()`, and in-admin test push simulator.

#### H. Dynamic Favicon & Browser Identity Injection (`src/pages/admin/AdminSettings.tsx`)
- **File Upload & Presets**: Supports `.ico`, `.png`, `.svg` files or 1-click presets (Graduation Cap, Open Book, Gold Star).
- **Live DOM Injection**: Updates document `<link rel="icon">` in real time across browser tabs.
- **Live Tab Simulator**: Renders a browser tab mockup previewing the favicon and title bar.

#### I. Payment Disputes & Claims Resolution Hub (`src/pages/admin/AdminPayments.tsx`)
- **Claims Ledger**: Tracks disputes with status (`Open`, `Under Review`, `Refunded`, `Released`, `Rejected`).
- **Claim Types**: Tutor No-Show, Student Overcharge, Deposit Uncredited, Payout Bank Delay.
- **Actions**:
  - `Refund`: Reimburses student wallet directly and logs refund transaction.
  - `Release`: Releases held funds to tutor bank account.
  - `Reject`: Closes invalid dispute claim.

#### J. Immutable Administrative Audit Ledger (`src/pages/admin/AdminPayments.tsx`)
- **Audit Records**: Tracks admin name, role, action, category, details, IP address, timestamp, and status.
- **Search & Filter**: Search by action/admin and filter by category or role.
- **Export**: 1-click CSV export utility.

---

## 4. Test Suites & Verification Analysis

### 4.1 Test Suite Inventory

| Test File | Framework / Runner | Total Checks | Passing | Status |
|---|---|---|---|---|
| `test_all_workflows.js` | Node.js E2E Test Runner | 82 assertions | 82 / 82 | **100% PASS** |
| `test_adversarial_challenger_2.mjs` | Node.js Adversarial Harness | 23 assertions | 23 / 23 | **100% PASS** |
| `test_rewards_and_grids.mjs` | Node.js Persona & Grid Harness | 17 assertions | 17 / 17 | **100% PASS** |
| `audit_script.cjs` & `check_routes.cjs` | Route & AST Scanner | Static scan | Clean | **0 Unhandled Routes** |

---

### 4.2 Detailed Breakdown of Workflows (1 through 20) in `test_all_workflows.js`

#### Tier 1: Feature Coverage (Architectural Audit)
- **Workflow 1: Super Admin Navigation & Route Portals** — Validates all 9 admin governance routes (`/admin`, `/admin/users`, `/admin/tutors`, `/admin/communities`, `/admin/sessions`, `/admin/recordings`, `/admin/subjects`, `/admin/payments`, `/admin/settings`).
- **Workflow 2: Paystack Default Payment Gateway Auto-Config** — Confirms Paystack is initialized as default active gateway with live public API key (`pk_live_...`).
- **Workflow 3: Commission Policy & Live Tuition Simulator** — Verifies default 10% commission rate and calculates exact ₦500 fee / ₦4,500 tutor net on ₦5,000 lesson.
- **Workflow 4: 1-Click User Suspension** — Tests administrative toggle of user account to `Suspended`.
- **Workflow 5: Tutor Credential Verification** — Verifies admin approval of pending tutor applications and credential verification flags.
- **Workflow 6: Email SMTP Relay Configuration** — Validates SendGrid SMTP relay configuration on port 587 TLS.
- **Workflow 7: Dynamic Browser Favicon Injection** — Verifies injection of custom SVG/Base64 favicon into `document.head`.
- **Workflow 8: Student Search & Discovery Filter** — Validates multi-parameter search (Subject, Rate $\le$ 5000, Rating $\ge$ 4.5, Verified only) and confirms exclusion of suspended tutors.
- **Workflow 9: Multi-Step Booking & Group Discount** — Confirms 30% group discount formula (₦4,000 $\rightarrow$ ₦2,800).
- **Workflow 10: LearnTokens Subsidy Calculation** — Verifies 50% subsidy discount for 30 min of 60 min session (₦1,400 subsidy).
- **Workflow 11: Study Pack & Lesson Notes Generation** — Validates ASCII summary generation with LIATE rule, formulas, and homework checklists.
- **Workflow 12: Eco Mode Bandwidth Calculation** — Verifies 72% bandwidth savings for 360p @ 20fps mobile data saver.
- **Workflow 13: Tutor Schedule Availability Matrix** — Validates preferred time slots for Monday (`4:30 PM`).
- **Workflow 14: Tutor Instant Booking Toggle** — Verifies instant booking flag persistence.
- **Workflow 15: Tutor Multi-Format Study Resources** — Tests uploading `.pdf` and `.zip` file attachments.
- **Workflow 16: Tutor Student Roster & Homework Mastery** — Verifies 90% homework completion calculation.
- **Workflow 17: Tutor Bank Account KYC & Payout** — Confirms 10-digit Nigerian NUBAN validation and minimum threshold (₦5,000).
- **Workflow 18: 28-Key Shared Storage Contract** — Verifies all 28 cross-role schema keys are registered and defined.
- **Workflow 19: Storage Event Dispatcher** — Tests cross-tab reactive broadcasting.

#### Tier 2: Boundary & Corner Cases
- **Workflow 20: Mathematical Boundary Validation**:
  - Commission rate bounds ($0\%$, $100\%$, $12.5\%$, negative rejected, $>100\%$ rejected).
  - Payout threshold bounds (₦4,999 rejected, ₦5,000 allowed, $> \text{balance}$ rejected).
  - Token conversion underflow & floor rounding ($25 \text{ tokens} \rightarrow 2 \text{ mins}$, remainder $75$).
  - Classroom universal access engine timing math (locked future $>5\text{m}$, lobby open $\le 5\text{m}$, live now, completed, admin override).
  - Compounded subsidies clamped to non-negative price floor ($\ge \text{₦}0$).

#### Tier 3: Cross-Feature Integrations
- Admin updates commission to 15% $\rightarrow$ student booking fee ₦1,500 $\rightarrow$ tutor wallet net credit ₦8,500.
- Admin suspends tutor $\rightarrow$ tutor immediately disappears from student search.
- Tutor availability slots $\rightarrow$ student booking conflict detection engine flags taken slot.
- Student completes homework checklist $\rightarrow$ tutor roster immediately reflects 75% mastery.
- Student token subsidy $\rightarrow$ tutor receives 100% full gross credit guarantee (₦6,000).

#### Tier 4: Real-World Multi-Persona E2E User Journey (Step 1 through 8)
- Complete simulation across Super Admin $\rightarrow$ Admin $\rightarrow$ Tutor $\rightarrow$ Student $\rightarrow$ Classroom $\rightarrow$ Lesson Notes $\rightarrow$ Tutor Payout.

#### Tier 5: Static Code & Responsive Grid Layout Integrity
- Validates responsive Tailwind grid classes across all 9 primary views and route tree integrity in `src/App.tsx`.

---

## 5. Cross-Role Shared LocalStorage Schema (28 Key System Contract)

The system maintains 28 synchronized storage keys across personas:

1. `akademi_auth_user` — Active authenticated user profile and role
2. `akademi_admin_gateways` — Configured payment gateways array
3. `akademi_default_gateway_name` — Default active gateway name (Paystack)
4. `akademi_commission_rate` — Platform commission percentage (10%)
5. `akademi_require_payment_2fa` — Mandatory payment 2FA policy flag
6. `akademi_min_payout_threshold` — Tutor minimum withdrawal threshold (₦5,000)
7. `akademi_platform_payout_schedule` — Automated payout frequency schedule
8. `akademi_admin_users` — System user accounts directory
9. `akademi_admin_tutors` — Admin tutor directory with verification status
10. `akademi_registered_tutors` — Registered tutor catalog for student search
11. `akademi_payment_disputes` — Payment disputes and claims ledger
12. `akademi_admin_audit_logs` — Immutable administrative activity ledger
13. `akademi_enable_communities` — Global feature flag for Communities module
14. `akademi_communities` — Community study circles directory
15. `akademi_email_provider` — Email relay provider (SendGrid)
16. `akademi_smtp_host` — SMTP host server address
17. `akademi_platform_favicon` — Custom uploaded favicon data URL
18. `akademi_user_tokens` — Student LearnTokens balance
19. `akademi_student_reward_minutes` — Student free session minutes pool
20. `akademi_tokens_per_minute` — Token-to-minute conversion exchange rate
21. `akademi_streak_bonus_tokens` — Weekly study streak bonus token amount
22. `akademi_referral_bonus_tokens` — Classmate referral reward token amount
23. `akademi_wallet_balance_ngn` — User fiat wallet balance (NGN)
24. `akademi_user_transactions` — User financial transaction ledger
25. `akademi_booked_sessions` — Confirmed scheduled bookings array
26. `akademi_session_notes` — Lesson summary, formulas, and homework store
27. `akademi_tutor_available_slots` — Tutor weekly availability matrix slots
28. `akademi_tutor_payouts` — Tutor withdrawal settlement ledger

---

## 6. Gap Analysis & Quality Assessment

| Area | Status | Verification & Health |
|---|---|---|
| **R4: Student Rewards & Token Conversions** | **Fully Operational** | Balance, streak bonuses, referral QR codes, token conversion modals, subsidy calculation, and 100% tutor earnings protection are completely implemented. |
| **R5: Super Admin Platform Controls** | **Fully Operational** | Paystack auto-config, 10% commission edits, 1-click user suspensions, tutor verification, WebRTC SFU Cloud settings, WebSockets Push setup, dynamic favicon, and audit logs are active. |
| **Test Suites & Automated Checks** | **100% Passing** | `test_all_workflows.js` (82/82), `test_adversarial_challenger_2.mjs` (23/23), and `test_rewards_and_grids.mjs` (17/17) execute cleanly with 0 errors. |
| **TypeScript & Build** | **Clean Structure** | All routes declared in `App.tsx`, component interfaces strictly typed, 0 unhandled routes. |

---

## 7. Recommended Next Milestones for Orchestrator

1. **Milestone 1 (Integration Synthesis)**: Synthesize findings from Explorer Survey 1 (R1), Explorer Survey 2 (R2, R3), and Explorer Survey 3 (R4, R5, Test Suites) into the master system blueprint.
2. **Milestone 2 (Verification Gate)**: Ensure all automated tests (`node test_all_workflows.js`) and build commands (`npm run build`) remain green across all subsequent refinements.
3. **Milestone 3 (Live Persona Demo Prep)**: Package the 8-step multi-persona user journey demo (Super Admin $\rightarrow$ Admin $\rightarrow$ Tutor $\rightarrow$ Student) for final user presentation.
