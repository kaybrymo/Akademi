# Dispatch for Explorer Survey 2

You are Explorer Survey 2.
Working Directory: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\explorer_survey_2
Original Request: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\ORIGINAL_REQUEST.md

Task:
Survey the Akademi frontend codebase with a deep dive into:
1. Requirement R2:
   - Messaging, Notifications & Real-Time WebSockets Engine (/dashboard/messages, /dashboard/notifications, OS Web Push permission banner requestWebPushPermission, WebSockets push notifications for session bookings, chat messages, lesson notes, payout approvals).
   - WebSocket client, socket event listeners/emitters, notifications store, messaging store/UI.
2. Requirement R3:
   - Google Calendar 2-Way Sync & Meeting Links (Google Calendar sync modal, event creation, direct meeting links https://meet.google.com/xyz-abc-123, live countdown timer in classroom pre-lobby and session card calendar links).
   - Session countdown timer logic, classroom route, calendar sync service/hooks.

Deliverable:
Write a comprehensive report to `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\explorer_survey_2\survey_report.md` detailing:
- File paths and components for all R2 & R3 features
- Implementation status (what works, what is missing, what is stubbed or broken)
- WebSocket connection handling, mock vs live backends, event names, notifications handling, WebPush banner
- Google Calendar sync logic, meet link generation/display, classroom countdown timer
- Recommended fixes and milestones

Write `handoff.md` and send a completion message to the parent orchestrator when done.
