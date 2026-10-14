# Original User Request

## Initial Request — 2026-08-31T09:40:08Z

You are the Project Orchestrator for the task:
Audit all platform configurations and settings for the Akademi platform at C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend. Recommend optimal production configurations for launch and implement zero-config defaults, health probes, and robust fallbacks so every platform subsystem operates out-of-the-box with zero configuration friction.

Working directory: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend
Agent metadata working directory: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\orchestrator

Original request is recorded at:
C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\ORIGINAL_REQUEST.md

Key Requirements:
- R1: Payment Gateway & Financial Commission Configuration (Paystack API key auto-config, live/test mode toggles, 10% commission, NUBAN payout setup, 2FA payment authorization, transaction refund desks).
- R2: WebRTC SFU Cloud Media Server & Masterclass Relays (SFU presets LiveKit/Agora/Custom SFU, >8 peers auto-switch, 360p Eco mobile preset, Lagos 24ms node health probe latency check, participant grid scaling).
- R3: WebSockets & Mobile Push Notification Server (Pusher Channels, Soketi, Native Web Push API, push triggers for Session Bookings, Chat Messages, Lesson Notes, Payout approvals with live storage event fallbacks).
- R4: Google Calendar & Email Communications Relay (2-way Google Calendar OAuth sync, event template generation, direct Google Meet room link generation https://meet.google.com/xyz-abc-123, SMTP email server relay settings, test email sender, platform favicon branding injection).
- R5: Feature Module Controls & Community Governance (feature module toggles for Communities on/off, LearnTokens rewards, 10-day recording retention; alignment across Navbar, Sidebar, Overview screens, and Super Admin settings with zero broken links or unhandled fallbacks).

Acceptance Criteria:
- `npm run build` succeeds with 0 TypeScript compilation errors.
- `node test_all_workflows.js` executes and all 20 workflow audit suites pass (100%).
- All configuration health probes and zero-config fallback mechanisms function cleanly.

Please maintain your plan.md, progress.md, and context.md in your agent directory C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\orchestrator and orchestrate your specialist workers to complete the audit and implementation. Report back when finished.

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

