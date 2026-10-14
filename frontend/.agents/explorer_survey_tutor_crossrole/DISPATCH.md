# DISPATCH — Explorer Survey Tutor & Cross-Role / Test Infra

## Mission
Investigate and survey R3 Tutor Teaching & Wallet Suite, R4 Cross-Role Integration & Stale State, and test execution harness in the Akademi frontend codebase (`C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend`).

Read `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\ORIGINAL_REQUEST.md`.

Investigate:
1. R3 Tutor Teaching Suite:
   - Schedule matrix, weekly availability grid, availability modal.
   - Instant booking toggle & pricing configuration.
   - New session creation (1-on-1 and Group sessions, date/time, subject, pricing).
   - Native file picker / attachment flow for lesson notes and homework.
   - Student roster and progress tracking / ratings.
   - Wallet & payout config, bank account setup, withdrawal requests, transaction ledger.
2. R4 Cross-Role Integration & Route State:
   - 2-way real-time data sync across roles (localStorage events, shared storage keys, cross-tab synchronization).
   - Audit all routes in `src/App.tsx` for unhandled paths, redirect loops, or broken state dependencies.
3. Testing & Verification Infrastructure:
   - Check `package.json`, TypeScript configuration, build scripts (`npm run build`).
   - Check `test_all_workflows.js` or existing test harnesses. Inspect test coverage across Super Admin, Admin, Student, and Tutor workflows.

Write your detailed findings and evidence report to `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\explorer_survey_tutor_crossrole\survey_report.md` and deliver `handoff.md`.
