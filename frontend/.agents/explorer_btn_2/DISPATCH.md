## 2026-09-07T10:51:05Z

You are explorer_btn_2, a teamwork_preview_explorer.
Your mission: Conduct an exhaustive code-level survey and interactive audit of all buttons, links, and action handlers for R3 (Tutor Teaching & Payout Buttons) and R4 (Admin & Super Admin Governance Buttons) in the Akademi frontend repository at C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend.

Working Directory: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\explorer_btn_2
Original Request: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\ORIGINAL_REQUEST.md

Read ORIGINAL_REQUEST.md first!

Examine:
1. R3: Tutor Teaching & Payout Buttons:
   - Tutor Overview (`Overview.tsx`): "Set Availability", "Create Session", and student message shortcuts.
   - Tutor Schedule Matrix (`Sessions.tsx`): Day/Week/Month toggles, instant booking switch, and session edit modal.
   - Lesson Notes upload: native file picker, task builder, and "Publish Notes".
   - Tutor Student Roster (`Students.tsx`): "Send Message", "View Progress", and profile inspection drawers.
   - Tutor Billing (`Billing.tsx`): "Request Payout", bank details modal, and withdrawal submissions.
2. R4: Admin & Super Admin Governance Buttons:
   - Admin Overview (`AdminOverview.tsx`): quick metric filters, quick action buttons, and recent bookings table.
   - User & Tutor Management (`AdminUsers.tsx`, `AdminTutors.tsx`): suspend/activate user, approve tutor credentials, inspect documents.
   - Payments & Disputes Hub (`AdminPayments.tsx`): refund buttons, 2FA authorization dialog, and gateway commission sliders.
   - Platform Settings (`AdminSettings.tsx`): probe SFU latency, test push notification, test email sender, favicon presets, download configuration backup JSON, and load launch presets.

For every button, link, and action handler:
- Check if it has a valid `onClick`, `onSubmit`, or `to` link.
- Check for dead clicks (e.g. empty functions `() => {}`, missing props, prevented defaults without actions).
- Check navigation targets (are any routes broken or mismatched with App.tsx / routes?).
- Check state updates (does it properly mutate state or dispatch store actions?).
- Check visual feedback (loading spinners, toast alerts, button disabled states during async operations, animated transitions).
- Check error handling (try/catch, console errors avoided).

Write your detailed findings, catalog of buttons/handlers, identified bugs/dead clicks, and recommended fixes into:
`C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\explorer_btn_2\survey_report.md`
and deliver your handoff report to `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\explorer_btn_2\handoff.md`.
Use send_message to notify the orchestrator when completed.
