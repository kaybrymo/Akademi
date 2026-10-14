# Akademi Brand & Design System Guide
**Version:** 2.4.0  
**Target:** EdTech Tutoring & Skool-Style Learning Community Platform  
**Market:** Nigeria & Sub-Saharan Africa (Primary) + Global Pan-African Learners  
**Base Currency:** Nigerian Naira (₦ / NGN)  

---

## 1. Brand Essence & Visual Philosophy

Akademi represents **academic excellence, verified mentorship, high-trust digital learning, and vibrant community cohesion**.

### Design Principles:
1. **Academic Trust & Dignity**: Deep Forest Greens evoke heritage, growth, integrity, and institutions of higher learning.
2. **High Energy & Achievement**: Radiant Golds and Amber accents signify rewards, tokens, mastery, streak achievements, and premium masterclasses.
3. **Modern Clarity**: Clean borders, subtle shadows, crisp typography, and generous whitespace ensure complex dashboards remain accessible even on entry-level Android devices and low-bandwidth connections.
4. **Community Cohesion**: Warm avatar rings, celebratory badge pills, and gamified level tags make learners feel seen, celebrated, and accountable.

---

## 2. Color Palette & Tokens

### 2.1 Primary Brand Palette

| Token Name | Hex Code | RGB | Tailwind Class | Semantic Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Forest Emerald 900** | `#0A3D29` | `10, 61, 41` | `bg-[#0A3D29]` | Darkest navbar headers, active dropdown hovers, high-contrast borders |
| **Forest Emerald 800** | `#0E4833` | `14, 72, 51` | `bg-[#0E4833]` | Mobile header bar, deep brand cards, secondary dark containers |
| **Deep Forest Emerald (Core)** | `#0F5338` | `15, 83, 56` | `bg-[#0F5338]` | **Primary Brand Color**: Navigation bars, primary buttons, brand logos, active tabs |
| **Forest Emerald 600** | `#14724E` | `20, 114, 78` | `bg-[#14724E]` | Button hover states, interactive card highlights |
| **Vibrant Emerald 500** | `#10B981` | `16, 185, 129` | `bg-emerald-500` | Success badges, "LIVE NOW" indicators, online status dots, progress bars |
| **Soft Emerald 100** | `#D1FAE5` | `209, 250, 229` | `bg-emerald-100` | Light badge background for active/verified items |
| **Subtle Emerald 50** | `#ECFDF5` | `236, 253, 245` | `bg-emerald-50` | Card background accents, success notification backgrounds |

### 2.2 Secondary Accent & Rewards Palette (Gold & Amber)

| Token Name | Hex Code | RGB | Tailwind Class | Semantic Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Radiant Gold / Amber (Core)** | `#F59E0B` | `245, 158, 11` | `bg-[#F59E0B]` | **Secondary Accent**: High-conversion CTA buttons, star ratings, reward tokens, streak badges |
| **Deep Amber 600** | `#D97706` | `217, 119, 6` | `bg-amber-600` | CTA button hover, active reward tab borders |
| **Warm Amber 700** | `#B45309` | `180, 83, 9` | `bg-amber-700` | High-contrast gold text on light backgrounds |
| **Amber Light 100** | `#FEF3C7` | `254, 243, 199` | `bg-amber-100` | Token pill backgrounds, warning banners, review count tags |
| **Amber Subtle 50** | `#FFFBEB` | `255, 251, 235` | `bg-amber-50` | Highlighted discussion posts, featured tutor callouts |

### 2.3 Neutral & Slate Scale

| Token Name | Hex Code | Tailwind Class | Semantic Usage |
| :--- | :--- | :--- | :--- |
| **Slate 950** | `#020617` | `text-slate-950` | Primary headings, highest-emphasis text |
| **Slate 900** | `#0F172A` | `bg-slate-900` | Dark classroom mode, video tile backgrounds |
| **Slate 800** | `#1E293B` | `bg-slate-800` | Classroom toolbars, secondary dark surfaces |
| **Slate 700** | `#334155` | `text-slate-700` | Primary body text in light mode |
| **Slate 500** | `#64748B` | `text-slate-500` | Subtitles, timestamps, metadata labels |
| **Slate 400** | `#94A3B8` | `text-slate-400` | Placeholder text, secondary icons |
| **Slate 200** | `#E2E8F0` | `border-slate-200` | Standard card dividers and input borders |
| **Slate 100** | `#F1F5F9` | `bg-slate-100` | Chip tags, code block backgrounds, disabled states |
| **Slate 50** | `#F8FAFC` | `bg-slate-50` | Global page background, outer layout wrap |
| **White** | `#FFFFFF` | `bg-white` | Card backgrounds, modals, input fields |

### 2.4 Status & Role Indicators

- **Verified Tutor / Official Badge**: Emerald fill (`#10B981`) with white checkmark
- **Admin / Super Admin Badge**: Royal Indigo (`#4F46E5` / `bg-indigo-600`) with shield icon
- **AI Maya / Bot Assistant**: Violet Purple (`#8B5CF6` / `bg-purple-600`) with bot spark icon
- **Live Now Pulsing Dot**: Emerald ring with continuous animate-ping (`#10B981`)
- **Urgent / Expiring / Refund**: Crimson Rose (`#EF4444` / `bg-rose-500`)
- **Paid Tier Badge**: Amber tag with padlock (`bg-amber-100 text-amber-900 border border-amber-300`)
- **Free Tier Badge**: Emerald tag with check (`bg-emerald-100 text-emerald-900 border border-emerald-300`)

---

## 3. Typography Scale & Standards

### Font Stack:
```css
font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Hierarchy:

| Level | Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `2.5rem - 3.25rem` (40px-52px) | Bold / 800 | 1.15 | `-0.025em` | Landing page main headline |
| **Heading 1 (H1)** | `1.75rem - 2.25rem` (28px-36px) | Bold / 700 | 1.2 | `-0.02em` | Community title, Dashboard page titles |
| **Heading 2 (H2)** | `1.25rem - 1.5rem` (20px-24px) | Semi-Bold / 600 | 1.3 | `-0.015em` | Section titles, Modal headings |
| **Heading 3 (H3)** | `1.0rem - 1.125rem` (16px-18px) | Semi-Bold / 600 | 1.4 | `-0.01em` | Post titles, Card headers, Module names |
| **Body Large** | `1.0rem` (16px) | Regular / 400 | 1.5 | `normal` | Long post content, lesson descriptions |
| **Body Standard** | `0.875rem` (14px) | Regular / 400 | 1.5 | `normal` | Default body text, form inputs, comments |
| **Body Small** | `0.75rem` (12px) | Medium / 500 | 1.4 | `normal` | Timestamps, author subtext, counts |
| **Caption / Tiny** | `0.6875rem` (11px) | Bold / 700 | 1.3 | `0.05em` (uppercase) | Badges, tags, table column headers |

---

## 4. UI Component Design Specifications

### 4.1 Buttons

1. **Primary Brand Action (`#0F5338`)**:
   - `bg-[#0F5338] text-white hover:bg-[#0A3D29] font-bold rounded-xl px-5 py-2.5 transition-all shadow-sm hover:shadow-md`
   - Used for: "Create Post", "Enroll Now", "Open Classroom", "Save Changes".

2. **High-Conversion CTA (`#F59E0B`)**:
   - `bg-[#F59E0B] text-slate-950 hover:bg-amber-500 font-extrabold rounded-full px-6 py-3 transition-all shadow-lg hover:shadow-xl`
   - Used for: "Join Community ₦X/mo", "Book 1:1 Session", "Upgrade to Pro".

3. **Secondary Outlined**:
   - `bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl px-4 py-2 transition-colors`
   - Used for: "Cancel", "Filter", "Export", "Preview".

4. **Ghost / Icon Buttons**:
   - `p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors`
   - Used for: Heart like, Share, Paperclip attachment, More options.

### 4.2 Cards & Surfaces

- **Default Content Card**: `bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all`
- **Elevated Hero Card**: `bg-white rounded-3xl border border-slate-200 shadow-md p-6`
- **Dark Classroom Card**: `bg-slate-900 rounded-2xl border border-slate-800 text-white shadow-xl`
- **Accent Highlight Card**: `bg-gradient-to-br from-[#0F5338]/5 to-emerald-500/5 rounded-2xl border border-emerald-500/20 p-5`

### 4.3 Badges & Chips

- **Category Tag**: `px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full hover:bg-slate-200`
- **Price Tag (Free)**: `px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full`
- **Price Tag (Paid)**: `px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full`
- **Live Indicator**: `flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 text-rose-600 text-xs font-black rounded-full uppercase tracking-wider`

---

## 5. Voice, Tone & Microcopy Standards

- **Encouraging, Professional & Respectful**: Blend authentic academic rigour with warm Nigerian community spirit.
- **Clear Financial Transparency**: All currency figures formatted with the Naira symbol (`₦`) and comma separators (e.g. `₦4,500/month`, `₦6,500/hour`).
- **No Vague Confirmations**: Action buttons must state what happens: "Confirm ₦4,500 Payment", "Publish Discussion to Feed", "Enter Live Masterclass".
- **Empty States**: Never leave blank tables or feeds. Provide positive, actionable empty states with an illustration or icon and a clear CTA (e.g., "No discussions here yet — be the first to start a conversation!").
