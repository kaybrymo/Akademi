# Dispatch for Worker: Implementation & Hardening (M1–M5)

You are Worker: Full Platform Implementation & Hardening.
Working Directory: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\worker_m1_m5
Original Request: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\ORIGINAL_REQUEST.md
Project Blueprint: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\PROJECT.md

## Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Objective
Implement the identified improvements across Milestones M1–M5:
1. **Milestone M1 (R1 - Auth Route Aliases)**:
   - In `src/App.tsx`: Add route aliases `<Route path="/auth/login" element={<Login />} />`, `<Route path="/auth/register" element={<Register />} />`, and `<Route path="/auth/forgot-password" element={<ForgotPassword />} />` to support both `/login` and `/auth/login` route patterns.
2. **Milestone M2 (R2 - WebSockets Push & Notifications Sync)**:
   - In `src/components/ui/BookingModal.tsx`: Call `dispatchSessionBookedPush(tutor.name, tutor.subject, `${slot.dateStr} · ${slot.time}`, `₦${finalPrice.toLocaleString()}`)` when a booking is confirmed in `handleConfirm`.
   - In `src/components/ui/LessonNotesModal.tsx`: Call `dispatchLessonNotesPush(updatedNote.tutorName, updatedNote.sessionTitle)` when notes are saved in `handleSaveTutorNote`.
   - In `src/pages/admin/AdminPayments.tsx`: Call `dispatchPayoutPush(`₦${target.amount.toLocaleString()}`, 'Approved')` when payouts/releases are authorized.
   - In `src/components/layout/DashboardLayout.tsx`: Ensure the top navbar notification bell reads live from `localStorage.getItem('akademi_user_notifications')`, reacts to the `storage` event, and displays the accurate unread count.
3. **Milestone M3 (R3 - Meeting Links & Google Calendar Polish)**:
   - Ensure session card details and Google Calendar entries explicitly display direct meeting links (including `https://meet.google.com/xyz-abc-123` format).
4. **Milestone M4 (R4) & Milestone M5 (R5)**:
   - Verify that LearnTokens balance, Snapcode referral sharing, token-to-minute conversion, tutor earnings protection (100% gross earnings), Paystack auto-config, 10% commission rate edits, user suspensions, tutor verification, and WebRTC SFU Cloud settings are intact and operational.
5. **Verification**:
   - Run `npm run build` to confirm 0 TypeScript compilation errors.
   - Run `node test_all_workflows.js` to ensure 100% of all 20 workflows pass.
   - Run secondary test scripts if present (`test_adversarial_challenger_2.mjs`, `test_rewards_and_grids.mjs`, `scripts/stress_financial_and_timing.mjs`).

## Output Requirements
Write a complete handoff report to `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\worker_m1_m5\handoff.md` detailing:
- Exact files modified and changes made
- Build and test commands run with full terminal output
- Confirmation of zero TypeScript errors and all test passes
