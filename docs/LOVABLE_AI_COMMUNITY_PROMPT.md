# Lovable.ai Prompt Package: Akademi Skool-Style Community Platform
**Purpose:** Ready-to-paste prompts and system specifications for **Lovable.ai** (or v0 / Bolt.new) to generate the complete interactive Community & Classroom ecosystem.

---

## 📋 How to Use This in Lovable.ai

1. **Option A (All-in-One New Project)**: Copy **PROMPT 1 (Master Project Specification)** into Lovable's project creation box.
2. **Option B (Feature-by-Feature)**: First generate the layout with **PROMPT 1**, then supply **PROMPT 2 (7-Tab Space)** and **PROMPT 3 (Classroom & Video)** for deep iterations.

---

```markdown
### 🚀 PROMPT 1: MASTER LOVABLE.AI SYSTEM PROMPT (Paste into Lovable.ai)

Build a modern, high-retention EdTech Community and Masterclass platform called "Akademi" inspired by Skool and Circle, designed for students and verified tutors in Nigeria and Pan-Africa.

### 1. TECH STACK & LIBRARIES
- React 18/19 + TypeScript + Vite
- Tailwind CSS (with arbitrary values support)
- Lucide React (for all iconography)
- Framer Motion (for smooth micro-interactions, modal transitions, and accordion toggles)
- Radix UI primitives / Tailwind Dialog for accessible modals
- Currency formatted throughout in Nigerian Naira: ₦ (e.g. ₦4,500/mo, ₦6,500/hr)

### 2. EXACT BRAND DESIGN SYSTEM & COLOR TOKENS
Strictly adhere to this color palette:
- Primary Brand / Headers / Active Tabs: Deep Forest Emerald `#0F5338` (hover: `#0A3D29`, dark border: `#0E4833`)
- High-Conversion CTA Buttons & Reward Badges: Radiant Gold `#F59E0B` (hover: `#D97706`, subtle bg: `#FEF3C7`)
- Success / Live Indicators / Verified Badges: Vibrant Emerald `#10B981` (light bg: `#D1FAE5`)
- Dark Classroom / Video Surfaces: Deep Slate `#0F172A` and `#1E293B`
- Background & Canvas: Clean Slate `#F8FAFC`
- Text Colors: Primary `#020617`, Secondary `#64748B`, Subtle `#94A3B8`
- Border Radii: Rounded-2xl (`16px`) for cards, rounded-xl (`12px`) for buttons, rounded-full for badges.
- Typography: Plus Jakarta Sans / Inter font stack.

### 3. CORE PAGES & VIEWS REQUIRED

#### PAGE 1: Community Discovery Hub (`/communities`)
1. Top Hero Header: "Explore Learning Communities & Masterclasses", search bar with live filtering, and a "+ Create Space" button.
2. Filter Tabs: "All Communities", "My Joined Hubs", "Tutor Masterclasses", "Data & Tech", "Mathematics & Sciences", "Languages & Culture", "Exam Prep (WAEC/JAMB/A-Levels)".
3. Community Cards Grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop):
   - High-quality cover photo with category badge pill top-left.
   - Creator avatar with verified checkmark badge (`#10B981`).
   - Community Title, Tagline, and Short Bio.
   - Stats row: Members count (`👥 342 members`), Courses count (`📚 3 courses`), Live events (`📅 6 live sessions`).
   - Pricing pill: Either "● Free Community" (green pill) or "🔒 ₦4,500/mo" (gold pill).
   - Action Button: "View Space →" (if joined) or "Join Hub • ₦4,500/mo" (if paid) with Paystack 2FA modal trigger.
4. "Create Space" Modal: Form with Name, Slug, Category, Access Type (Free vs Paid), Monthly Price (NGN), Cover Image URL, Attached Courses selector, and Welcome Message.

---

#### PAGE 2: The Skool-Style 7-Tab Community Space (`/communities/:id`)
Build the complete interactive workspace with a sticky hero header and 7 dedicated tabs:

A. Community Hero Banner & Identity Header:
- Cover image banner (height 200px mobile, 260px desktop) with subtle dark gradient overlay.
- Large circular community avatar (height 80px) overlapping the banner with border-4 white.
- Title: "Data Analytics Career Hub" with emerald verified checkmark.
- Subtitle: "Led by Ade Adeyemi • 342 Members • ₦4,500/month".
- Action Buttons: "Joined (Member)" toggle button, Share button, and "Invite Friends".

B. Sticky 7-Tab Navigation Bar (Horizontal scrolling on mobile):
Create clickable tabs with active indicator pill styling (`bg-[#0F5338] text-white` when active):
1. 💬 Community (Discussion Feed)
2. 📚 Classroom (Modules & Curriculum)
3. 📅 Events (Live Masterclasses & Calendar)
4. 👨‍🏫 Experts (Tutors & Mentors)
5. 🏆 Leaderboard (Gamification & Points)
6. 🤖 Maya AI (Contextual AI Study Bot)
7. ⚙️ Creator Studio (Moderation & Analytics - visible to owner/admin)

C. Tab 1: Community Feed (2-Column Layout on Desktop):
- Left Main Column:
  - Post Composer Box: "Write a discussion, ask a question, or share a project...", title input, markdown text area, category pills (`#General`, `#Q&A`, `#Projects`, `#Resources`), photo attachment icon, and "Publish Post" button.
  - Discussion Posts List:
    - Author avatar, name, level badge pill (e.g. `Level 4 Scholar`), timestamp (`2 hours ago`), and category tag.
    - Post Title (bold 16px) and Body text with markdown formatting.
    - Action bar: Upvote button with like counter (clicking increments upvote and animates heart), Comment counter with toggle to expand reply thread, and Share button.
    - Inline threaded comments with reply input and avatar.
- Right Sidebar Column:
  - "About Community" card with detailed description and rules.
  - "Community Creator & Verified Tutors" card with tutor bio and "Message" button.
  - "Upcoming Live Masterclass" widget with live countdown timer and "Join Room" button.
  - "Top 3 Members This Week" leaderboard preview.

D. Tab 2: Classroom (Course Modules & Lessons):
- Top progress card: Overall completion percentage with an animated emerald progress bar (`45% Completed • 9/20 Lessons`).
- Accordion Module Cards:
  - Module 1: Foundations (e.g. "Python & SQL Essentials") - 4 lessons.
  - Module 2: Exploratory Data Analysis - 6 lessons.
  - Each lesson row includes: Lesson icon (Video camera or PDF document), Lesson Title, Duration badge (`15:20` or `PDF Worksheet`), and a clickable completion checkmark button (`+15 XP`).
  - Clicking a lesson opens an embedded video player / reader modal with Next/Previous lesson navigation.

E. Tab 3: Events (Live Masterclasses & Calendar):
- Filter between "Upcoming Sessions" and "Past Recordings".
- Live Event Card:
  - Date banner (e.g. `THU, OCT 16`), time in West Africa Time (`5:00 PM GMT+1`), and topic title.
  - Host avatar and name ("Dr. Chiamaka Eze").
  - "Join Live Room" button: If the session is within 15 minutes, launches meeting at `/classroom/meeting-101`; if future, opens a countdown lobby modal with "Add to Google Calendar".

F. Tab 4: Experts (Resident Tutors & Mentors Directory):
- Grid of verified instructors and resident teaching assistants.
- Card details: Photo, verified badge, subjects taught, hourly rate in Naira (e.g. `₦6,500/hr`), star rating (`★ 4.9 (52 reviews)`), and short bio.
- Buttons: "Book 1:1 Session" (opens booking modal with time slots) and "Send Message" (routes to chat).

G. Tab 5: Leaderboard & Gamification:
- Filter buttons: "7 Days", "30 Days", "All Time".
- Top 3 Podium Cards: 1st Place (Gold trophy, avatar, 1,420 XP), 2nd Place (Silver), 3rd Place (Bronze).
- Ranked Table (Ranks 4 to 20): Rank number, member avatar & name, level badge (`Level 1 Novice` to `Level 9 Grandmaster`), consecutive login streak (`🔥 14 days`), and total points.
- "Token Rewards Exchange" card: Explains "100 Tokens = 30 Minutes Free 1:1 Tutoring with Verified Tutors" with a "Convert Tokens" button.

H. Tab 6: Maya AI Study Assistant:
- Interactive chat interface pre-trained on the community curriculum.
- Quick prompt suggestion pills: "Explain Integration by Parts", "Give me 3 practice SQL interview queries", "Summarize Module 2".
- Chat thread with instant simulated AI responses formatted with code snippets and LaTeX math.

I. Tab 7: Creator Studio & Admin Desk:
- Metric Cards: Total Members (`342`), Monthly Recurring Revenue (`₦1,539,000 NGN`), Daily Active Users (`184`), Completion Rate (`68%`).
- Member Moderation Table with Search, Role toggle (Member vs Moderator), and Ban/Remove button.
- Curriculum Builder button to add new modules and upload video lesson links.

---

### 4. SAMPLE DATA & INTERACTIVE STATE
- Include preloaded realistic sample data for 3 communities:
  1. "Data Analytics Career Hub" (Paid, ₦4,500/mo, Ade Adeyemi)
  2. "Calculus & Advanced Math Circle" (Free, Dr. Chiamaka Eze)
  3. "Polyglot Spanish & Global Languages" (Paid, ₦3,500/mo, Halima Yusuf)
- All tabs must be fully functional and switchable with instant state updates.
- Upvoting a post must increment its counter and toggle active state.
- Checking a lesson checkmark must update the progress bar percentage dynamically.
- Mobile responsive: All grids collapse cleanly to 1-column on mobile, with horizontal scroll for tabs and sticky floating action buttons.
```

---

## 🎨 PROMPT 2: COMPONENT & STYLING PROMPT (For Fine-Tuning)

```markdown
Update the design and styling of the community pages to match the official Akademi Brand Guidelines:

1. Colors:
   - Primary buttons and active tab highlights: #0F5338
   - CTA join buttons and token reward badges: #F59E0B
   - Verified checkmarks and live indicators: #10B981
   - Page background: #F8FAFC
   - Card surfaces: Pure white #FFFFFF with border border-slate-200/80 and subtle shadow-xs

2. Badges:
   - Free tier: bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full px-2.5 py-0.5 text-xs font-bold
   - Paid tier: bg-amber-100 text-amber-900 border border-amber-300 rounded-full px-2.5 py-0.5 text-xs font-bold
   - Level badge: bg-[#0F5338] text-white rounded-full px-2 py-0.5 text-[10px] font-bold uppercase

3. Micro-Interactions:
   - Add hover lift effect on community cards: transition-all duration-200 hover:-translate-y-1 hover:shadow-md
   - Add pulse animation to the "LIVE NOW" event dot: animate-ping bg-rose-500
   - Confetti or badge flash when a student marks a lesson completed.
```
