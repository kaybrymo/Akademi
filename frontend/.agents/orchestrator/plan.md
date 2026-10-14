# Orchestrator Plan: Button, Link & Action Handler Platform Audit

## Phase 0: Survey & Investigation (3 Parallel Explorers)
- **Explorer 1 (R1 & R2)**:
  - R1: Landing (`Landing.tsx`), Navbar (`Navbar.tsx`), Footer (`Footer.tsx`), Sign In (`Login.tsx`), Register (`Register.tsx`), Forgot Password (`ForgotPassword.tsx`), Google Auth modal (`GoogleAuthModal.tsx`).
  - Role selector pills, password visibility toggles (`Eye`/`EyeOff`), 1-click persona quick logins.
  - R2: Tutor discovery filters & Book Session CTAs (`/tutors`, `/courses`, `TutorProfile.tsx`).
  - 4-step Booking Modal (`BookingModal.tsx`): date/slot picks, Paystack vs Wallet checkout, confirmation.
  - Student Sessions (`Sessions.tsx`): Join Classroom, Lesson Notes & Homework, Google Calendar Sync, materials download.
  - Wallet Top-up & Transactions (`Billing.tsx`), Notifications (Push, mark read, delete), Settings (Save changes, change password).
- **Explorer 2 (R3 & R4)**:
  - R3: Tutor Overview (`Overview.tsx`): Set Availability, Create Session, student message shortcuts.
  - Tutor Schedule Matrix (`Sessions.tsx`): Day/Week/Month toggles, instant booking switch, session edit modal.
  - Lesson Notes upload: native file picker, task builder, Publish Notes.
  - Tutor Student Roster (`Students.tsx`): Send Message, View Progress, profile inspection drawers.
  - Tutor Billing (`Billing.tsx`): Request Payout, bank details modal, withdrawal submissions.
  - R4: Admin Overview (`AdminOverview.tsx`): quick metric filters, quick action buttons, recent bookings table.
  - User & Tutor Management (`AdminUsers.tsx`, `AdminTutors.tsx`): suspend/activate, approve credentials, inspect documents.
  - Payments & Disputes Hub (`AdminPayments.tsx`): refund buttons, 2FA authorization dialog, gateway commission sliders.
  - Platform Settings (`AdminSettings.tsx`): SFU latency probe, test push, test email, favicon presets, download backup JSON, load launch presets.
- **Explorer 3 (R5 & Test Suites)**:
  - R5: Pre-Class Lobby: Unlock Room (Bypass), countdown timer, hardware test buttons.
  - In-Room Toolbar (`Classroom.tsx`): Mic, Camera, Screen share, Whiteboard (pen, eraser, swatches, clear), Chat send, Participant stepper, 16-Grid Masterclass SFU switch, SFU Quality modal, Raise hand, Leave meeting.
  - Workflow test runner & suites (`test_all_workflows.js` and all 20 workflow audit suites): baseline execution status, button event handlers inspected, gaps or failures identified.

## Phase 1: Synthesis & Fix Planning
- Synthesize all dead clicks, broken navigation, missing feedback (loading/toast/animation), and unhandled exceptions identified by Explorers.
- Produce comprehensive work items for Worker.

## Phase 2: Implementation & Verification (Worker)
- Worker fixes all dead clicks, broken routes, unhandled exceptions, and missing visual feedback across R1-R5 components.
- Worker verifies TypeScript compilation (`npm run build` with 0 errors).
- Worker runs `node test_all_workflows.js` (20/20 suites pass).

## Phase 3: Independent Verification (Reviewers, Challengers, Forensic Auditor)
- Reviewer 1: Public, Auth, Student Journey & Classroom UI (R1, R2, R5)
- Reviewer 2: Tutor & Admin Systems, Settings, Payments (R3, R4)
- Challenger 1: Workflow test execution, edge cases, rapid click stress
- Challenger 2: Form validation, state updates, modal toggling, navigation routing
- Auditor 1: Forensic integrity verification (Zero cheating, genuine event handling)

## Phase 4: Final Gate & Reporting
- Verify all gate criteria pass strictly.
- Report completion and handoff.
