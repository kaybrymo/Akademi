# Akademi — Pan-African EdTech Tutoring & Learning Community Platform

<p align="center">
  <strong>1-on-1 Tutoring • Interactive Classroom • Skool-Style Communities • Token Rewards</strong>
</p>

---

## 🌟 Overview

**Akademi** is a comprehensive educational ecosystem built for Nigerian and Pan-African learners and educators. It unifies:
- **1-on-1 & Small Group Tutoring**: Verified tutor matching, real-time availability matrix, multi-currency pricing (₦ NGN).
- **Skool-Style Communities**: 7-tab spaces featuring peer discussion feeds, modular course classrooms, live masterclass calendars, expert directories, gamified leaderboards, and AI study bots.
- **Interactive Virtual Classroom**: Full-screen WebRTC meeting suite with adaptive SFU bitrate, 16-grid video layout, interactive whiteboard, screen sharing, in-session chat, and cloud recording.
- **Gamification & Token Economy**: Study streaks, lesson completion XP, and LearnTokens convertible into free live tutoring sessions.
- **Super Admin Governance**: Multi-role permission model, Paystack gateway auto-config, 2FA security gates, and audit trails.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State & Animation**: Framer Motion, TanStack Query
- **Icons**: Lucide React
- **Calendar**: FullCalendar Suite

### Backend
- **Framework**: Laravel 11 / PHP 8.2+
- **Database**: PostgreSQL / MySQL
- **Real-Time**: WebSockets (Laravel Reverb / Pusher)
- **Payments**: Paystack (Card, USSD, Bank Transfer, Apple Pay)
- **Live Video**: WebRTC SFU (LiveKit / Mediasoup)

---

## 📁 Repository Structure

```text
akademi/
├── frontend/             # React 19 + TypeScript + Vite SPA
│   ├── src/
│   │   ├── components/   # Reusable UI, modals, layouts
│   │   ├── pages/        # Dashboard, Admin, Community, Classroom pages
│   │   ├── lib/          # Utilities, session access logic, helpers
│   │   └── context/      # Theme and global state providers
│   └── package.json
├── backend/              # Laravel API backend
│   ├── app/              # Models, Controllers, Middleware
│   ├── database/         # Migrations, factories, seeders
│   └── routes/           # REST API endpoints
└── docs/                 # Documentation & Design System
    ├── BRAND_GUIDE.md
    ├── COMMUNITY_ARCHITECTURE.md
    ├── COMMUNITY_REPLICATION_GUIDE.md
    ├── LOVABLE_AI_COMMUNITY_PROMPT.md
    └── Akademi_Community_Architecture_and_Brand_Guide.pdf
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ & npm
- PHP 8.2+ & Composer

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`.

### 2. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

---

## 🎨 Brand Design Tokens
- **Primary**: Forest Emerald (`#0F5338` / `#0A3D29`)
- **Accent**: Radiant Gold (`#F59E0B` / `#D97706`)
- **Live / Verified**: Vibrant Emerald (`#10B981`)
- **Classroom Dark**: Deep Slate (`#0F172A`)
- **Base Currency**: Nigerian Naira (₦ / NGN)

---

## 📄 License & Confidentiality
Confidential property of Akademi EdTech.
