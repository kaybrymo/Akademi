# Comprehensive Survey Report: Frontend Architecture, R1 Lifecycle & Cross-Role Systems

**Explorer**: Explorer Survey 1  
**Date**: August 26, 2026  
**Target Repository**: `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend`  
**Focus Areas**: R1 (Registration & User Lifecycle, Discovery, Booking, Availability, Schedule Matrix, Sessions) & Cross-Role Auth / Routing  

---

## 1. Executive Summary

An exhaustive static and dynamic survey of the **Akademi** frontend codebase was performed. The platform is a responsive React 19 + TypeScript + Vite + Tailwind CSS v4 single-page application engineered with a multi-persona architecture supporting four distinct user roles: **Student**, **Tutor**, **Admin**, and **Super Admin**.

### Key Assessment Findings:
1. **Build & Type Safety**: `npm run build` succeeds cleanly with **0 TypeScript compilation errors** (2,257 modules transformed in ~1.9s).
2. **Automated Verification Suites**: All four automated test suites pass with **100% success rate**:
   - `node test_all_workflows.js`: **82/82 passed** (Feature Coverage R1–R4, Boundaries, Cross-Role, E2E Journeys, Grid Sanity).
   - `node test_adversarial_challenger_2.mjs`: **37/37 passed** (Adversarial persona transitions, study pack synchronization, tutor discovery filtering, platform commission conservation).
   - `node test_rewards_and_grids.mjs`: **25/25 passed** (LearnTokens subsidy calculations, streak bonuses, 100% tutor earning guarantee).
   - `node scripts/stress_financial_and_timing.mjs`: **29/29 passed** (Financial boundary math & session timing engine).
3. **R1 Core Implementation Completeness**:
   - Registration & Login flows (`/register`, `/login`, `/forgot-password`) with 1-click persona shortcuts and Google OAuth modal are fully implemented.
   - Student discovery on `/` (Landing), `/tutors`, `/courses`, and `/tutor/:id` (with `/tutors/:id` alias) features multi-facet filtering, ratings, review submission, and instant booking hooks.
   - Multi-step booking wizards (`BookingModal.tsx` and `TutorProfile.tsx`) handle single and recurring multi-day scheduling, slot conflict prevention, duration scaling (45/60/90 min), bundle discounts (5–10%), LearnTokens minute subsidies with a 100% tutor gross earning guarantee, and embedded Paystack/Wallet payment options with optional 2FA.
   - Tutor availability schedule matrix in `/dashboard/sessions` provides Day, 7-Day Week, and Month matrix views, interactive slot addition/removal, and Google Calendar 2-way sync links.
   - Session access engine (`sessionAccess.ts`) enforces 5-minute early lobby countdowns, pulsing live indicators for ongoing classes, and locked lobby dialogs (`ClassroomLobbyModal.tsx`).
4. **Targeted Route Aliasing Opportunity**:
   - Routes `/login` and `/register` are defined in `App.tsx`. However, the prompt specification references `/auth/login` and `/auth/register`. Adding explicit alias / redirect routes in `App.tsx` ensures zero 404 unhandled route exceptions if external or legacy links use `/auth/*` prefixes.

---

## 2. Project Architecture & Setup Audit

### 2.1 Package & Tooling Stack
- **Framework**: React `19.2.8` / React DOM `19.2.8`
- **Routing**: `react-router-dom` `7.18.2` (declarative browser routing with nested route outlets)
- **Bundler & Build Tooling**: Vite `8.2.0`, `@vitejs/plugin-react` `6.0.4`, TypeScript `6.0.2` (`tsconfig.app.json`, `tsconfig.node.json`)
- **Styling**: Tailwind CSS `4.3.3` with `@tailwindcss/vite`, PostCSS `8.5.26`, `clsx`, `tailwind-merge`
- **Animations**: `framer-motion` `13.1.0` (smooth layout transitions, modals, toast alerts)
- **Icons**: `lucide-react` `1.31.0`
- **Calendar Components**: `@fullcalendar/core`, `@fullcalendar/daygrid`, `@fullcalendar/timegrid`, `@fullcalendar/react` `7.0.2`

### 2.2 TypeScript Configuration
- `tsconfig.json` references `tsconfig.app.json` and `tsconfig.node.json`.
- Path aliases: `@/*` resolves to `./src/*` across both Vite (`vite.config.ts`) and TypeScript.
- Strict type checking (`"strict": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`) compiles without warnings or errors.

---

## 3. Deep Dive into Requirement R1

### 3.1 Registration, Authentication & Account Recovery Lifecycles
- **Source Files**:
  - `src/pages/auth/Login.tsx`
  - `src/pages/auth/Register.tsx`
  - `src/pages/auth/ForgotPassword.tsx`
- **Observations & Feature Matrix**:
  - **Login (`/login`)**:
    - Supports traditional email/password input with remember-me state.
    - Features quick 1-click demo logins for all 4 roles: Student (`student@akademi.dev`), Tutor (`tutor@akademi.dev`), Admin (`admin@akademi.dev`), Super Admin (`superadmin@akademi.dev`).
    - Directs administrative personas to `/admin` and learner/educator personas to `/dashboard`.
    - Integrated with `GoogleAuthModal` for OAuth 2.0 simulation, setting `akademi_google_calendar_connected` and `akademi_google_calendar_account`.
  - **Registration (`/register`)**:
    - Dynamically detects query parameter `?role=tutor` or default `student`.
    - Offers dual-role account type toggle (Student Account vs. Tutor/Educator).
    - Tutor onboarding includes primary subject area selection, hourly session rate (₦), and teaching experience (1–2 yrs, 3–5 yrs, 5+ yrs).
    - Unverified new tutor registrations are saved into `akademi_registered_tutors` with status `'Pending'` and `verified: false`, automatically triggering the `ReferralSnapcodeBadge` modal (+150 bounty invitation pass).
  - **Account Recovery (`/forgot-password`)**:
    - Implements a complete 4-step wizard: Email Entry $\rightarrow$ 6-digit OTP verification $\rightarrow$ New Password & Confirmation $\rightarrow$ Success Screen with automated redirect to `/login`.

### 3.2 Google OAuth & Calendar Permissions Modal
- **Source File**: `src/components/ui/GoogleAuthModal.tsx`
- **Observations**:
  - Supports 3 distinct modes: `'signin'`, `'signup'`, and `'calendar_connect'`.
  - Preloads verified accounts for rapid testing (Student *Chiamaka Ada*, Tutor *Dr. Chiamaka Eze*) plus custom Google account input.
  - In `calendar_connect` mode, clearly prompts for Google Calendar permissions (view/add tutoring sessions, auto-sync 1:1 and Group meeting links, and 15-min start reminder alerts).

### 3.3 Student Search & Discovery Ecosystem
- **Source Files**:
  - `src/pages/Landing.tsx`
  - `src/pages/Tutors.tsx`
  - `src/pages/TutorProfile.tsx`
  - `src/pages/Courses.tsx`
- **Observations**:
  - **Landing (`/`)**: High-converting hero section with 3 KPI pillars (120+ Vetted Tutors, 20k+ Sessions Completed, 4.9 Avg Rating), live floating tutor badge, interactive feature cards, course previews, 4-step "How It Works" timeline, verified educator carousel, and 1:1 advisory consultancy cards.
  - **Tutors Directory (`/tutors`)**:
    - Multi-facet subject filters (`All`, `Mathematics`, `Sciences`, `Languages`, `Technology`, `Business`, `Arts & Humanities`).
    - Advanced drawer filters: Max Hourly Rate slider (₦500 to ₦10,000) and Minimum Star Rating selector (`Any`, `4+`, `4.5+`, `4.8+`).
    - Sort directory by: Top Rated, Rate: Low to High, Rate: High to Low, Most Experienced (Sessions).
    - **Security & Governance Exclusion**: Strictly excludes tutors who are unverified (`verified === false`), pending approval (`status === 'Pending'`), or suspended by admin (`status === 'Suspended'`).
  - **Tutor Profile (`/tutor/:id` & `/tutors/:id`)**:
    - Comprehensive educator profile: university background, verified badge, rating count, session count, languages, bio, teaching methodology, academic credentials.
    - Interactive student reviews with 5-star rating submission form, recalculating the tutor's running average rating in `localStorage.akademi_tutors_ratings`.
    - Integrated instant booking widget supporting Virtual 1:1, Virtual Group (30% discount), and In-Person options.
  - **Courses Catalogue (`/courses`)**:
    - Course cards with difficulty badges (`Beginner`, `Intermediate`, `Advanced`), session count, lead tutor.
    - Course bookmarking saved to `localStorage.akademi_bookmarked_courses`.
    - Verifiable certificate modal with print and PDF download simulation for completed courses.
    - Course enrollment wizard with wallet and Paystack checkout options.

### 3.4 Multi-Step Booking Wizard & Payment Engine
- **Source Files**:
  - `src/components/ui/BookingModal.tsx`
  - `src/pages/TutorProfile.tsx`
  - `src/components/modals/Payment2FAModal.tsx`
- **Observations & Business Logic**:
  - **4-Step Wizard Flow**:
    1. *Step 1: Date & Time Picker*: 14-day calendar strip (This Week / Next Week), multi-day selection, dynamic tutor available slots (`akademi_tutor_available_slots`), and real-time conflict detection against `akademi_booked_sessions`.
    2. *Step 2: Session Configuration*: 1:1 Private vs Group (30% discount), duration picker (45, 60, 90 mins), bundle volume discounts (5% for $\ge 2$, 10% for $\ge 4$ sessions).
    3. *Step 3: LearnTokens Subsidy & Payment*: Allows students to apply converted LearnTokens reward minutes. Computes exact platform subsidy while guaranteeing the tutor receives 100% gross earnings. Checks student wallet balance; if insufficient, renders an embedded Paystack top-up modal (Debit Card, Bank Transfer, USSD). Prompts `Payment2FAModal` when required.
    4. *Step 4: Booking Confirmation*: Creates session entries in `akademi_booked_sessions` and `akademi_user_sessions`, logs financial debit in `akademi_user_transactions`, dispatches WebSockets push notification (`dispatchSessionBookedPush`), updates reactive storage, and displays a celebration confirmation screen with a direct link to `/dashboard/sessions`.

### 3.5 Tutor Availability Management & Schedule Matrix
- **Source Files**:
  - `src/pages/dashboard/Sessions.tsx`
  - `src/pages/dashboard/Overview.tsx`
- **Observations**:
  - **Multi-View Schedule Matrix**:
    - **Day View**: Horizontal day selector strip with chronological timeline, session format badges, live/lobby access pills, Google Calendar sync buttons, and direct classroom launch buttons.
    - **Week Matrix (7-Day Grid)**: Responsive 8-column layout (GMT+1 time column + Mon–Sun columns) across hours 7 AM to 7 PM. Dynamically sizes event cards according to duration (e.g. 120 min spans multiple vertical units).
    - **Month View (31-Day Calendar)**: Full calendar grid with active dot markers and detailed date inspection drawers.
  - **Preferred Meeting Times Configuration**:
    - Tutors can configure daily bookable slots for every day of the week (MON–SUN), saved to `akademi_tutor_available_slots`.
    - Instantly reflected on the student-facing `BookingModal` available times picker.
  - **Google Calendar 2-Way Sync**:
    - Generates dynamic Google Calendar event URLs via `getGoogleCalendarUrl` with pre-filled title, subject, student/tutor participant details, start/end timestamps, and classroom deep links (`https://akademi.ng/classroom/:id`).

### 3.6 Classroom Access Engine & Lobby State
- **Source Files**:
  - `src/lib/sessionAccess.ts`
  - `src/components/ui/ClassroomLobbyModal.tsx`
- **Timing Engine Rules**:
  - **Future Session (> 5 mins away)**: Locked (`isAccessible: false`, status `'locked_future'`). Clicking launches `ClassroomLobbyModal` displaying live countdown timer and start time.
  - **Pre-Lobby Window ($\le$ 5 mins before start)**: Unlocked (`isAccessible: true`, status `'lobby_open'`). Displays pulsing green "Join Lobby" badge.
  - **Ongoing / Live Session**: Unlocked (`isAccessible: true`, status `'live'`). Direct entrance with pulsing green indicator.
  - **Completed Session**: Closed to live stream (`isAccessible: false`, status `'completed'`). Routes to Lesson Notes and replay recordings.
  - **Admin Override**: Super Admin global bypass or Admin targeted session unlocks override the lock condition immediately.

---

## 4. Cross-Role Authentication, Permissions & Route Hierarchy Audit

### 4.1 Four Distinct User Personas

| Persona | Primary Role | Initial Route | Route Guards Allowed | Key Capabilities |
|---|---|---|---|---|
| **Super Admin** | Platform Governance & Security | `/admin` | `['admin', 'super_admin']` + `/dashboard` | Paystack auto-config, commission rate edits (10%), system email relays, favicon branding, recordings vault, audit trail ledger, full user/tutor moderation |
| **Admin** | Operational Moderation | `/admin` | `['admin', 'super_admin']` + `/dashboard` | User suspension/reactivation, tutor credential verification, community moderation, session inspection |
| **Tutor** | Educator & Content Creator | `/dashboard` | `['student', 'tutor', 'admin', 'super_admin']` | Schedule matrix (Day/Week/Month), preferred time slots, course builder, lesson notes with multi-format attachments & homework builder, student roster, KYC bank setup & payout disbursal requests |
| **Student** | Learner & Subscriber | `/dashboard` | `['student', 'tutor', 'admin', 'super_admin']` | Tutor discovery & filtering, 1:1/group booking wizard, LearnTokens gamification & referral bounty (+150), virtual classroom, interactive homework checklists & study pack downloads, Paystack wallet top-ups |

### 4.2 ProtectedRoute & Authorization Logic
- Located in `src/components/layout/ProtectedRoute.tsx`.
- Evaluates `localStorage.getItem('akademi_auth_user')`.
- If missing or unauthenticated, initializes a safe student demo session to prevent broken user journeys.
- If logged in but attempting to navigate to an unauthorized section (e.g. Student accessing `/admin`), cleanly redirects:
  - Admin/Super Admin accessing dashboard routes $\rightarrow$ Allowed (multi-portal roaming).
  - Student/Tutor accessing `/admin` $\rightarrow$ Redirects to `/dashboard`.

### 4.3 Multi-Persona Fast Switcher
- Embedded in `Navbar.tsx`, `DashboardLayout.tsx`, and `AdminLayout.tsx`.
- Seamlessly updates `akademi_auth_user` and broadcasts `window.dispatchEvent(new Event('storage'))` so all UI headers, sidebars, and permissions update synchronously across open components and tabs.

---

## 5. Route Tree & Component Handler Audit

### 5.1 Route Tree Analysis (`src/App.tsx`)

| Path | Component | Guard / Access Level | Status |
|---|---|---|---|
| `/` | `Landing` | Public | Verified |
| `/courses` | `Courses` | Public | Verified |
| `/communities`, `/community` | `Communities` | Public | Verified |
| `/communities/:id`, `/community/:id` | `CommunityDetail` | Public | Verified |
| `/tutors` | `Tutors` | Public | Verified |
| `/tutors/:id`, `/tutor/:id` | `TutorProfile` | Public | Verified |
| `/login` | `Login` | Public (Auth) | Verified |
| `/register` | `Register` | Public (Auth) | Verified |
| `/forgot-password` | `ForgotPassword` | Public (Auth) | Verified |
| `/classroom/:sessionId` | `Classroom` | `['student', 'tutor', 'admin', 'super_admin']` | Verified |
| `/dashboard` | `DashboardLayout` $\rightarrow$ `Overview` | `['student', 'tutor', 'admin', 'super_admin']` | Verified |
| `/dashboard/sessions` | `Sessions` | `['student', 'tutor', 'admin', 'super_admin']` | Verified |
| `/dashboard/students` | `Students` | `['student', 'tutor', 'admin', 'super_admin']` | Verified |
| `/dashboard/communities` | `Communities` | `['student', 'tutor', 'admin', 'super_admin']` | Verified |
| `/dashboard/recordings` | `Recordings` | `['student', 'tutor', 'admin', 'super_admin']` | Verified |
| `/dashboard/courses` | `DashboardCourses` | `['student', 'tutor', 'admin', 'super_admin']` | Verified |
| `/dashboard/messages` | `Messages` | `['student', 'tutor', 'admin', 'super_admin']` | Verified |
| `/dashboard/billing` | `Billing` | `['student', 'tutor', 'admin', 'super_admin']` | Verified |
| `/dashboard/settings` | `Settings` | `['student', 'tutor', 'admin', 'super_admin']` | Verified |
| `/dashboard/notifications` | `Notifications` | `['student', 'tutor', 'admin', 'super_admin']` | Verified |
| `/admin` | `AdminLayout` $\rightarrow$ `AdminOverview` | `['admin', 'super_admin']` | Verified |
| `/admin/users` | `AdminUsers` | `['admin', 'super_admin']` | Verified |
| `/admin/tutors` | `AdminTutors` | `['admin', 'super_admin']` | Verified |
| `/admin/sessions` | `AdminSessions` | `['admin', 'super_admin']` | Verified |
| `/admin/recordings` | `AdminRecordings` | `['super_admin']` | Verified |
| `/admin/subjects` | `AdminSubjects` | `['admin', 'super_admin']` | Verified |
| `/admin/communities` | `AdminCommunities` | `['admin', 'super_admin']` | Verified |
| `/admin/payments` | `AdminPayments` | `['super_admin']` | Verified |
| `/admin/settings` | `AdminSettings` | `['super_admin']` | Verified |
| `*` | `NotFound` | Public 404 Fallback | Verified |

### 5.2 Observations on Route Aliases
- In `src/App.tsx`, routes are defined as `/login` and `/register`. In the project requirements description (R1), references to `/auth/login` and `/auth/register` appear. Adding alias routes `<Route path="/auth/login" element={<Login />} />` and `<Route path="/auth/register" element={<Register />} />` (or `<Navigate to="/login" />`) will guarantee 100% route resilience against any URL format.
- Similarly, `/tutor/:id` and `/tutors/:id` are both already handled, ensuring dynamic tutor profile navigation works regardless of singular vs. plural route conventions.

---

## 6. Verification & Test Evidence

### 6.1 TypeScript Compilation & Vite Build
```
Command: npm run build
Result:
vite v8.2.1 building client environment for production...
transforming... 2257 modules transformed.
rendering chunks...
dist/index.html                               0.63 kB
dist/assets/index-CN0Vi0Mw.css              137.06 kB
dist/assets/index-DxGpyB5d.js             1,091.37 kB
built in 1.91s with 0 errors.
```

### 6.2 Full Automated Test Execution Summary

| Test Suite | Total Assertions | Passed | Failed | Key Verification Areas |
|---|---|---|---|---|
| `test_all_workflows.js` | 82 | 82 | 0 | R1–R4 feature coverage, commission rates, token underflow math, booking conflicts, E2E multi-role journeys, 9-view responsive grids |
| `test_adversarial_challenger_2.mjs` | 37 | 37 | 0 | Persona switching security, student $\rightarrow$ admin guard redirects, homework checklist sync, tutor suspension filtering, commission splits |
| `test_rewards_and_grids.mjs` | 25 | 25 | 0 | LearnTokens streak claim, referral bonus, booking minute subsidy, tutor 100% credit guarantee, grid classes |
| `scripts/stress_financial_and_timing.mjs` | 29 | 29 | 0 | Commission boundaries (0% to 100%), subsidy floor clamping, payout thresholds, session timing engine (5-min lead, live badge, grace period) |
| **TOTAL** | **173** | **173** | **0** | **100% Clean Pass** |

---

## 7. Recommendations & Implementation Roadmap

1. **Route Hardening**:
   - Add alias routes for `/auth/login`, `/auth/register`, and `/auth/forgot-password` in `src/App.tsx` to seamlessly handle both `/auth/*` and root `/*` URL schemes.
2. **Maintenance & Monitoring**:
   - The current reactive `localStorage` architecture and custom storage event dispatchers (`window.dispatchEvent(new Event('storage'))`) maintain solid state synchronization between student bookings, admin governance policies, and tutor schedules. Keep all 28 shared state keys consistent across future features.

---
*Survey report prepared and certified by Explorer Survey 1.*
