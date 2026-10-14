# DISPATCH — Explorer Survey Admin

## Mission
Investigate and survey R1 Super Admin & Admin Governance workflow in the Akademi frontend codebase (`C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend`).

Read `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\ORIGINAL_REQUEST.md`.

Investigate:
1. Super Admin & Admin navigation, layout, routes, role switching/guards.
2. Elevated controls: Paystack & payment gateway auto-configuration/credentials.
3. Commission rate edits (default 10%, persistence, validation).
4. User management: user suspensions/reactivations, tutor verification status toggles.
5. Email server relay configuration and test email / state handling.
6. Favicon and branding injection / dynamic customization.
7. Communities toggle and moderation controls.
8. Audit log generation and persistence in localStorage under `akademi_admin_audit_logs`.

Examine all relevant components, hooks, stores, and pages. Check for missing UI elements, broken event handlers, missing localStorage sync, state glitches, or build issues.
Write your detailed findings and evidence report to `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\explorer_survey_admin\survey_report.md` and deliver `handoff.md`.
