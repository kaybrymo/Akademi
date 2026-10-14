# Akademi Test Infrastructure & E2E Test Suite Documentation

## 1. Overview & Architecture

The Akademi automated test harness is an exhaustive, standalone Node.js testing framework engineered to validate all features, boundary conditions, cross-role reactive state synchronizations, and real-world end-to-end user journeys across all four platform personas: **Super Admin**, **Admin**, **Student**, and **Tutor**.

The primary test runner is located at `test_all_workflows.js` in the project root.

---

## 2. 4-Tier Testing Methodology

The test suite is structured into four distinct verification tiers plus static code sanity checks:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Akademi 4-Tier Test Architecture                     │
├─────────────────────────────────────────────────────────────────────────┤
│  Tier 1: Feature Coverage (R1 - R4 Architectural Audit)                │
│    • 1.1 Super Admin & Admin Governance (Gateways, Commission, Logs)   │
│    • 1.2 Student Learning & Purchase Journey (Booking, Notes, Tokens)   │
│    • 1.3 Tutor Teaching & Wallet Suite (Schedule, Files, Payouts)       │
│    • 1.4 Cross-Role Sync & Route Hierarchy (Storage Keys, Events)       │
├─────────────────────────────────────────────────────────────────────────┤
│  Tier 2: Boundary & Corner Cases                                        │
│    • Commission Rate Min/Max/Fractional clamping (0%, 100%, 12.5%)     │
│    • Payout Threshold (₦5,000 min, balance limit, zero balance)         │
│    • Token Underflow Prevention & Floor Rounding (25 tok = 2 min)       │
│    • Classroom Access Time Boundaries (Locked >5m, Lobby <=5m, Live)    │
│    • Compounded Subsidy & Non-Negative Price Floor (₦0 floor)           │
├─────────────────────────────────────────────────────────────────────────┤
│  Tier 3: Cross-Feature & Cross-Role Reactive Integrations               │
│    • Admin Commission -> Student Booking Split -> Tutor Wallet          │
│    • Admin Tutor Suspension -> Student Search Directory Exclusion      │
│    • Tutor Availability Matrix -> Student Booking -> Conflict Locking   │
│    • Student Homework Checklist -> Tutor View -> Roster Mastery Score   │
│    • LearnTokens Subsidy -> 100% Tutor Gross Credit Guarantee          │
├─────────────────────────────────────────────────────────────────────────┤
│  Tier 4: Real-World Multi-Persona E2E User Journeys                     │
│    • Super Admin (Setup) -> Admin (Verify) -> Tutor (KYC/Slots) ->      │
│      Student (Tokens/2FA Booking) -> Classroom (Lobby/Webcam/AI) ->     │
│      Tutor (Notes/HW) -> Student (Checklist) -> Tutor (Payout)          │
├─────────────────────────────────────────────────────────────────────────┤
│  Tier 5: Static Code, Route Hierarchy & Responsive Grid Integrity       │
│    • 9 Core Views Responsive Grid Verification                          │
│    • App.tsx 36-Route Tree Coverage Audit                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Storage & Reactivity Simulation Layer

The test framework implements a high-fidelity in-memory `LocalStorageMock` and browser event dispatcher that models:
- Complete key-value storage (`getItem`, `setItem`, `removeItem`, `clear`)
- Cross-component event broadcasting (`window.addEventListener('storage')`, `window.dispatchEvent(new Event('storage'))`)
- Reactive schema validation across all 28 shared `localStorage` state keys
- Document Head and Favicon dynamic `<link rel="icon">` injection

---

## 4. Requirement-to-Test Coverage Matrix

| Req | Domain | Key Behaviors Verified | Test Suite Section |
|---|---|---|---|
| **R1** | Super Admin & Admin Governance | 9 Admin Portals, Paystack Auto-Config (`pk_live_...`), 2FA enforcement, 10% Commission Rate Policy & Fee Simulator, 1-Click User Suspension, Tutor Verification Approval, SMTP/SendGrid 587 Relay, Dynamic Favicon Injection, Communities Feature Switch, Immutable Audit Logs (`akademi_admin_audit_logs`). | Tier 1.1, Tier 2.1, Tier 4.1 |
| **R2** | Student Learning & Purchase | Multi-facet Search (Subject, Rate ₦500-₦10k, Rating 4.0+, Verified Only), 1:1 vs Group (30% discount), Dynamic Slot Conflict Detector, Paystack Multi-Channel Top-Up (Card/Transfer/USSD), 2FA Verification, Lesson Notes Study Pack ASCII Download, Virtual Classroom Lobby Countdown, Eco Mode 72% Bandwidth Savings, LearnTokens Streak (+50) & Referral (+150). | Tier 1.2, Tier 2.3, Tier 2.4, Tier 3.5, Tier 4.1 |
| **R3** | Tutor Teaching & Wallet | 7-Day Weekly Matrix, Day Timeline, Monthly Calendar, Preferred Day Slots (`akademi_tutor_available_slots`), Instant Booking Toggle, Course Publishing Builder, Native File Attachments (.pdf, .docx, .zip), Student Roster Mastery %, 13 Nigerian Banks & 10-digit NUBAN KYC, Withdrawal Request against ₦5,000 threshold, Settlement History. | Tier 1.3, Tier 2.2, Tier 3.3, Tier 3.4, Tier 4.1 |
| **R4** | Cross-Role Integration & Routes | 28 Shared State Keys, 24 Storage Listeners, 13 Storage Dispatches, Real-Time Bidirectional State Updates, Complete 36 Route Declarations in `src/App.tsx` with 0 Broken Links. | Tier 1.4, Tier 3.1-3.5, Tier 5.1-5.2 |

---

## 5. Test Execution & CI/CD Commands

### Run Full E2E Test Suite:
```bash
node test_all_workflows.js
```

### Run Reward Subsidy & Grid Checks:
```bash
node test_rewards_and_grids.mjs
```

### Run TypeScript Production Build:
```bash
npm run build
```

---

## 6. Output & Exit Code Specification
- **Exit Code 0**: 100% of all test assertions in all 5 tiers passed cleanly.
- **Exit Code 1**: One or more assertions failed (failure details and reasons printed to stderr).
- **ANSI Formatted Output**: Green `✔ [PASS]`, Red `✖ [FAIL]`, Cyan Headers, Magenta Journey Steps.
