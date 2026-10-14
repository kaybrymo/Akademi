# Original User Request

## 2026-08-26T13:32:46Z

Perform an exhaustive end-to-end workflow audit and cross-role integration verification across all 4 user roles (**Super Admin**, **Admin**, **Student**, and **Tutor**) on the Akademi platform at `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend`, identify any missing gaps or friction points, and output actionable advice on pending features.

Working directory: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend
Integrity mode: development

## Requirements

### R1. Super Admin & Admin Governance Audit
- Verify Admin Layout & Navigation (`/admin`, `/admin/users`, `/admin/tutors`, `/admin/sessions`, `/admin/subjects`, `/admin/payments`, `/admin/settings`).
- Audit Super Admin elevated controls: Paystack & Gateway auto-config, commission rate edits (10%), user suspensions, tutor verification toggles, email server relay, favicon injection, and Communities feature toggle.
- Verify audit log recording in `localStorage` (`akademi_admin_audit_logs`).

### R2. Student Learning & Purchase Journey Audit
- Test Discovery & Booking (`/`, `/tutors`, `/courses`, `/tutor/:id`): Filter by subject/format, multi-step booking modal with Paystack and Wallet payment methods.
- Test Session Management (`/dashboard/sessions`): Session cards with 1-on-1 vs Group badges, Lesson Notes & Homework modal with checkbox state and material downloads.
- Test Virtual Classroom (`/classroom/:id`): Video streams, mute/camera/screenshare, whiteboard tools, meeting chat, leave meeting flow.
- Test LearnTokens & Session Time Rewards: Token conversion, referral pass sharing, and streak bonus claiming.

### R3. Tutor Teaching & Wallet Suite Audit
- Test Tutor Overview & Schedule Matrix (`/dashboard`, `/dashboard/sessions`): Teaching schedule, instant booking toggle, availability modal, new session creation.
- Test Lesson Notes & Homework Upload: Native file picker, homework task builder, and student progress tracking in Roster (`/dashboard/students`).
- Test Wallet & Payout Configuration (`/dashboard/billing`): Earnings summary, withdrawal requests, bank account setup.

### R4. Cross-Role Integration & Stale State Audit
- Verify 2-way real-time data sync across roles (e.g. Student books session -> Tutor schedule matrix updates; Tutor uploads notes -> Student sees notes immediately; Admin updates commission -> Payments hub updates).
- Audit all routes in `src/App.tsx` for unhandled paths or broken state dependencies.

## Acceptance Criteria

### Automated Verification
- [ ] `npm run build` succeeds with 0 TypeScript compilation errors.
- [ ] `node test_all_workflows.js` executes and all workflow suites pass cleanly.

### Cross-Role Coverage
- [ ] Super Admin -> Admin -> Student -> Tutor end-to-end user journeys are 100% verified.
- [ ] Detailed report generated listing verified workflows, pending items, and strategic advice on how to tackle them.

## 2026-09-07T10:46:32Z

Perform an exhaustive interactive button, link, and action handler audit across every page, modal, drawer, and role persona on the Akademi platform at `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend`. Verify that every button triggers its designated action, navigates without broken routes, updates state correctly, provides visual feedback (loading/toast/animations), and has no dead clicks or unhandled exceptions.

Working directory: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend
Integrity mode: development

## Requirements

### R1. Public & Authentication Buttons
- Audit all buttons and links in Landing (`Landing.tsx`), Navbar (`Navbar.tsx`), and Footer (`Footer.tsx`).
- Audit all action controls in Sign In (`Login.tsx`), Register (`Register.tsx`), Forgot Password (`ForgotPassword.tsx`), and Google Auth modal (`GoogleAuthModal.tsx`).
- Verify role selector pills, password visibility toggles (`Eye`/`EyeOff`), and 1-click persona quick logins.

### R2. Student Journey Buttons & Modals
- Audit tutor discovery filters and "Book Session" CTA buttons (`/tutors`, `/courses`, `TutorProfile.tsx`).
- Audit the 4-step Booking Modal (`BookingModal.tsx`): date/slot picks, Paystack vs Wallet checkout, and confirmation buttons.
- Audit Student Sessions (`Sessions.tsx`): "Join Classroom", "Lesson Notes & Homework", "Google Calendar Sync", and materials download.
- Audit Wallet Top-up & Transactions (`Billing.tsx`), Notifications ("Enable Mobile Push", "Mark all as read", delete), and Settings ("Save Changes", "Change Password").

### R3. Tutor Teaching & Payout Buttons
- Audit Tutor Overview (`Overview.tsx`): "Set Availability", "Create Session", and student message shortcuts.
- Audit Tutor Schedule Matrix (`Sessions.tsx`): Day/Week/Month toggles, instant booking switch, and session edit modal.
- Audit Lesson Notes upload: native file picker, task builder, and "Publish Notes".
- Audit Tutor Student Roster (`Students.tsx`): "Send Message", "View Progress", and profile inspection drawers.
- Audit Tutor Billing (`Billing.tsx`): "Request Payout", bank details modal, and withdrawal submissions.

### R4. Admin & Super Admin Governance Buttons
- Audit Admin Overview (`AdminOverview.tsx`): quick metric filters, quick action buttons, and recent bookings table.
- Audit User & Tutor Management (`AdminUsers.tsx`, `AdminTutors.tsx`): suspend/activate user, approve tutor credentials, inspect documents.
- Audit Payments & Disputes Hub (`AdminPayments.tsx`): refund buttons, 2FA authorization dialog, and gateway commission sliders.
- Audit Platform Settings (`AdminSettings.tsx`): probe SFU latency, test push notification, test email sender, favicon presets, download configuration backup JSON, and load launch presets.

### R5. Virtual Classroom Suite Hardware & In-Meeting Buttons
- Audit Pre-Class Lobby: "Unlock Room (Bypass)", countdown timer, and hardware test buttons.
- Audit In-Room Toolbar (`Classroom.tsx`): Mic toggle, Camera toggle, Screen share, Whiteboard tools (pen, eraser, color swatches, clear canvas), In-meeting Chat send, Participant count stepper, 16-Grid Masterclass SFU switch, SFU Quality modal, Raise hand, and Leave meeting.

## Acceptance Criteria

### Automated Verification
- [ ] `npm run build` succeeds with 0 TypeScript compilation errors.
- [ ] `node test_all_workflows.js` executes and all 20 workflow audit suites pass (100%).
- [ ] Every button and action handler in all components has a valid `onClick`, `onSubmit`, or `to` link handler without dead clicks or unhandled console errors.

