# DISPATCH — Test Writer (E2E Test Suite Creation)

## Mission
Design and create `test_all_workflows.js` and `TEST_INFRA.md` at `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\`.

Read `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\ORIGINAL_REQUEST.md` and `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\PROJECT.md`.

## Requirements
Build an exhaustive, automated Node.js test suite in `test_all_workflows.js` that tests and verifies all 4 roles and all requirements (R1, R2, R3, R4) following the 4-tier methodology:
1. **Tier 1: Feature Coverage**:
   - Super Admin & Admin Governance (Layout/navigation, elevated controls, Paystack auto-config, commission rate edits 10%, user suspensions, tutor verification toggles, email server relay, favicon injection, communities toggle, audit logs in `akademi_admin_audit_logs`).
   - Student Learning & Purchase Journey (Discovery/booking, session cards 1-on-1 vs Group, Lesson Notes & Homework modal with checkbox state/downloads, Virtual Classroom streams/controls/whiteboard/chat/leave, LearnTokens conversion/referral pass/streak bonus).
   - Tutor Teaching & Wallet Suite (Schedule matrix, instant booking toggle, availability modal, new session creation, native file picker for notes/homework, student progress in roster, wallet & payout config, withdrawal requests, bank account setup).
   - Cross-Role Integration & Stale State (2-way real-time data sync across roles, route audit in `src/App.tsx`).
2. **Tier 2: Boundary & Corner Cases**:
   - Minimum/maximum commission rate boundary checks.
   - Payout minimum threshold (₦5,000) and balance validation.
   - Token balance underflow prevention, streak bonus idempotency.
   - File attachment size/type filtering in notes modal.
   - Universal classroom access engine time boundary calculations (locked > 5 min, lobby <= 5 min, live within window, past window).
3. **Tier 3: Cross-Feature / Cross-Role Combinations**:
   - Admin changes commission rate -> student booking calculation reflects updated split -> tutor wallet gets credit.
   - Admin suspends tutor -> tutor excluded from student search -> direct booking blocked.
   - Tutor configures availability -> student booking modal reflects slots -> booking writes to `akademi_booked_sessions` -> tutor schedule matrix reflects new session.
   - Student completes homework checklist in `LessonNotesModal` -> tutor view reads updated status -> student roster progress updates.
4. **Tier 4: Real-World Multi-Persona E2E Workflows**:
   - Full journey: Super Admin sets up platform -> Tutor onboarded & verified -> Student discovers tutor, applies LearnTokens subsidy, completes Paystack 2FA booking -> Tutor & Student enter Virtual Classroom -> Tutor uploads notes & homework -> Student checks off homework -> Tutor requests payout.

## Execution & Output
- The script `node test_all_workflows.js` must execute synchronously or via clean async promises, print formatted colorful test results per suite, and exit with code 0 on all tests passing.
- Create `TEST_INFRA.md` and publish `TEST_READY.md`.
- Run `node test_all_workflows.js` to verify it passes 100%.

Write your handoff report to `C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\test_writer_e2e\handoff.md`.

## 2026-08-26T13:41:18Z
You are the Test Writer responsible for creating the comprehensive E2E test suite in test_all_workflows.js and documentation.
Working directory: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\test_writer_e2e\
Read C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\test_writer_e2e\DISPATCH.md, C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\ORIGINAL_REQUEST.md, and C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\PROJECT.md.

Implement:
1. `test_all_workflows.js` in C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\ containing complete 4-tier testing (Tier 1 Feature coverage across R1-R4, Tier 2 Boundary/Corner cases, Tier 3 Cross-feature/Cross-role, Tier 4 Real-world user journeys Super Admin -> Admin -> Student -> Tutor).
2. Create `TEST_INFRA.md` and publish `TEST_READY.md` at project root.
3. Execute `node test_all_workflows.js` to ensure 100% pass rate.

Write handoff report to C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\test_writer_e2e\handoff.md. Send message when complete.

