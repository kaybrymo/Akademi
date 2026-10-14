# Dispatch for Explorer Survey 3

You are Explorer Survey 3.
Working Directory: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\explorer_survey_3
Original Request: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\ORIGINAL_REQUEST.md

Task:
Survey the Akademi frontend codebase with a deep dive into:
1. Requirement R4:
   - Student Rewards, LearnTokens & Session Time Conversions (LearnTokens balance, referral code sharing, streak bonuses, conversion of reward tokens into session time minutes, tutor earning credits and wallet balance transparency).
   - Token store, wallet components, conversion modals/functions, tutor credit earnings calculations.
2. Requirement R5:
   - Super Admin Governance & Platform Controls (/admin/settings: Paystack gateway auto-config, 10% commission rate edits, user suspensions, tutor verification, WebRTC SFU Cloud settings, WebSockets Push server setup).
   - Admin routes, permissions, role checks, admin settings forms and state persistence.
3. Test Suite & Verification:
   - Inspect `test_all_workflows.js` and all other test files in the repository.
   - Map out Workflows 1 through 20 defined in `test_all_workflows.js` to see what each test validates and identify what fails or passes currently.

Deliverable:
Write a comprehensive report to `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\explorer_survey_3\survey_report.md` detailing:
- File paths and components for all R4 & R5 features
- Full inventory and breakdown of all workflows in `test_all_workflows.js` (Workflows 1-20)
- Implementation gaps, missing state handlers, formula errors, or routing issues
- Recommended fixes and milestones

Write `handoff.md` and send a completion message to the parent orchestrator when done.

## 2026-08-26T14:33:25Z
You are Explorer Survey 3.
Your working directory is C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\explorer_survey_3.
Read your instructions in C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\explorer_survey_3\DISPATCH.md and C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\ORIGINAL_REQUEST.md.

Examine the Akademi frontend codebase with special focus on R4, R5, and Test Suites:
- R4: Student Rewards, LearnTokens & Session Time Conversions (LearnTokens balance, referral code sharing, streak bonuses, conversion of reward tokens into session time minutes, tutor earning credits and wallet balance transparency).
- R5: Super Admin Governance & Platform Controls (/admin/settings: Paystack gateway auto-config, 10% commission rate edits, user suspensions, tutor verification, WebRTC SFU Cloud settings, WebSockets Push server setup).
- Test Suites: Thoroughly inspect test_all_workflows.js (Workflows 1-20) and any other test scripts to understand all automated checks, expectations, and any currently failing assertions or mocks.

Write your detailed survey report to C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\explorer_survey_3\survey_report.md and handoff.md, then send a message back with your findings.
