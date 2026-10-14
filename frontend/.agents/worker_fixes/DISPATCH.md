## 2026-09-07T11:01:09Z

You are worker_fixes, a teamwork_preview_worker.
Your mission: Implement all required fixes for interactive buttons, links, and action handlers across R1, R2, R3, R4, and R5 in the Akademi frontend at C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend.

Working Directory: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\worker_fixes
Original Request: C:\Users\IT Manager\.gemini\antigravity\scratch\akademi\frontend\.agents\ORIGINAL_REQUEST.md

Tasks to implement:

1. R1 & R2:
   - `src/pages/Landing.tsx`:
     - In featured tutors mapping (around line 390): update `<Link to="/tutors/1">` to dynamic `<Link to={`/tutors/${tutor.id}`}>`.
     - In advisors mapping (around line 430): update `<Link to="/tutors/1">` to dynamic `<Link to={`/tutors/${advisor.id}`}>`.
     - In bottom CTA (lines 476-486): bind the email input to state (`ctaEmail`), navigate to `/register?email=${encodeURIComponent(ctaEmail)}` when filled or `/register` when blank.
   - `src/components/layout/Navbar.tsx`:
     - In `handleSignOut` (line 51-55): add `window.dispatchEvent(new Event('storage'))` after `localStorage.removeItem('akademi_auth_user')`.
   - `src/pages/auth/Register.tsx`:
     - Line 490: Update success modal backdrop `onClick` to call `handleFinishRegistration` so user state is stored and storage event is dispatched.
   - `src/pages/auth/ForgotPassword.tsx`:
     - Line 243: Replace blocking `window.alert` with non-blocking toast/banner notification.
   - `src/pages/TutorProfile.tsx`:
     - Line 1186: In booking success modal, use dynamic session ID for `<Link to={`/classroom/${bookedSessionId || '1'}`}>`.

2. R3 & R4:
   - `src/pages/dashboard/Sessions.tsx`:
     - Calendar Header (lines 574-583): Attach `onClick` handlers to `ChevronLeft`, `ChevronRight`, and `Today` buttons to adjust active calendar date or provide navigational feedback.
     - Upcoming Session Card (line 990): Attach `onClick` to `MoreVertical` button to open session details or an action menu.
   - `src/pages/dashboard/Students.tsx`:
     - Wire a trigger button on student cards for the quick notes modal (`onClick={() => setNoteModalStudent(student)}`), or consolidate with `handleOpenNotes(student)` cleanly without dead code.
   - `src/pages/admin/AdminTutors.tsx`:
     - Add a KYC Document inspection modal or link button to view/preview submitted tutor verification certificates and ID cards before approving.

3. R5:
   - `src/pages/classroom/Classroom.tsx`:
     - Pre-Class Lobby (lines 715-740): Add interactive hardware test buttons (Microphone test and Camera preview toggle) under the lobby instructions.
     - In-Room Toolbar (lines 1315-1378): Add the missing Screen Share button with `<Monitor />` icon, toggling `isScreenSharing`, active visual indicator styling.
     - Masterclass 16-Grid SFU: When participant count is 16 / Masterclass SFU mode, render all 16 participant tiles in a 4x4 responsive grid layout.
     - "Mute All" button (line 1202): Update to use React state (e.g. `mutedParticipantIds`) so all participant tiles reactively reflect their muted state.
     - SFU Quality Drawer: In "Apply SFU Settings & Close", persist `selectedPreset` to localStorage via `saveSFUConfig` and show visual toast feedback.

4. Verification & Testing:
   - Run `npm run build` and ensure 0 TypeScript compilation errors.
   - Run `node test_all_workflows.js` and ensure all 20 workflow audit suites pass (100%).
   - Verify every button and action handler in all modified components has a valid `onClick`, `onSubmit`, or `to` link handler without dead clicks or unhandled console errors.

## 2026-09-07T11:20:11Z
From: parent (232887ac-2ef2-42d2-a60c-f6b466e59d1a)
**Context**: Status check on interactive button implementations and verification.
**Content**: Please provide a status update on your progress implementing the fixes across Landing, Navbar, Register, ForgotPassword, TutorProfile, Sessions, Students, AdminTutors, and Classroom, as well as the npm run build and node test_all_workflows.js verification runs.
**Action**: Reply with your current progress and update your progress.md.
