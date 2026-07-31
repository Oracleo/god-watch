# 🛡️ God Watch — Every Day Leaves Evidence

A premium, production-grade SaaS habit tracker and daily checklist — organized by date, not by task. Built with Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase PostgreSQL, and Auth.js.

![License: MIT](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

---

## ✨ Features

### Core
- **Date-first dashboard** — sticky date rail auto-scrolls to today, task columns expand dynamically with horizontal scrolling.
- **Task management** — add, rename, delete, archive, reorder, and color-code unlimited tasks.
- **Status cell engine** — each cell cycles through Pending → Completed → Failed → Missed with a confirmation dialog.
- **Month separators** — beautifully styled quote cards between months.
- **Notes** — autosave notes per date.

### Analytics
- **Dashboard summary** — daily completion %, current streak, motivational quote.
- **Full analytics** — daily, weekly, monthly, yearly completion rates.
- **Streaks** — current streak + longest streak calculation.
- **Heatmap calendar** — GitHub-style activity heatmap.
- **Charts** — pie charts (status distribution) + bar charts (task-wise performance).
- **Best/worst month** — automatically computed.
- **Profile page** — lifetime stats, recent activity feed, achievement badges.

### Data & Security
- **Google OAuth only** — SSO via Auth.js v5.
- **User isolation** — every user sees only their own data.
- **Activity log** — full audit trail of all user actions.
- **Rate limiting** — in-memory (drop-in Redis/Upstash for production multi-instance).
- **Zod validation** — shared schemas between client and server.
- **CSRF, XSS, SQL injection** — protections via Prisma prepared statements, Next.js headers, input sanitization.

### Quality of Life
- **Keyboard shortcuts** — `1` (Completed), `2` (Failed), `3` (Missed), `0` (Pending), `Cmd+K` (Search), `Cmd+Z` (Undo).
- **Drag & drop** — reorder tasks via drag-and-drop.
- **Undo** — Zustand-powered undo stack for the last action.
- **Encouraging toasts** — Sonner toasts react to every status change.
- **Dark/light/system theme** — next-themes powered.
- **PWA** — installable, offline shell, service worker auto-sync.
- **Daily reminders** — browser notifications at configurable time.
- **Global search** — search all task names and dates.
- **Export CSV/PDF** — download your data.

### Accessibility
- WCAG AA contrast ratios.
- `aria-pressed`, `role="grid"`, focus rings.
- Reduced-motion respect.
- Screen reader friendly.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js 15 App Router                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  RSC      │  │  Client  │  │  API Route Handlers  │  │
│  │ (Reads)   │  │ (Write)  │  │  + Server Actions    │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                 Zustand (Optimistic UI)                 │
├─────────────────────────────────────────────────────────┤
│              Prisma ORM → Supabase PostgreSQL            │
├─────────────────────────────────────────────────────────┤
│                 Auth.js (Google OAuth)                   │
└─────────────────────────────────────────────────────────┘
```

### Key Decisions

| Decision | Rationale |
|---|---|
| **RSC for reads, actions for writes** | Smaller client bundle, faster LCP, built-in cache revalidation. |
| **`TaskStatus(taskId, date)` composite unique** | Fully normalized row-per-cell; trivial analytics aggregation. |
| **Zustand + localStorage** | Optimistic state, offline queue, undo stack, instant cell clicks. |
| **JWT session strategy** | Zero DB lookups on hot paths; edge-deployable. |
| **UTC-normalized `date` stored as `String @db.Date`** | Eliminates timezone drift; client renders in local time. |
| **Zod as single validation source** | Shared across client and server; eliminates drift. |

---

## 📁 Project Structure

```
god-watch/
├── prisma/                    # Schema, migrations, seed
│   ├── schema.prisma          # Full DB schema (10 models)
│   └── seed.ts                # Quotes + achievements seed
├── public/                    # Static assets
│   ├── manifest.webmanifest   # PWA manifest
│   └── sw.js                  # Service worker (offline)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/login/      # Login page
│   │   ├── (dashboard)/       # Protected pages
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── analytics/     # Analytics + charts
│   │   │   ├── profile/       # User profile
│   │   │   └── settings/      # Settings + export
│   │   ├── api/auth/          # Auth.js route handler
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   ├── loading.tsx        # Global loading skeleton
│   │   └── error.tsx          # Error boundary
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives
│   │   ├── auth/              # Login form
│   │   ├── dashboard/         # Core dashboard components
│   │   ├── analytics/         # Charts, heatmap, stat cards
│   │   ├── profile/           # Profile view
│   │   ├── settings/          # Settings view
│   │   ├── navigation/        # TopNav, theme toggle, user menu
│   │   ├── search/            # Global search dialog
│   │   ├── shared/            # Footer, icons, PWA client
│   │   └── providers/         # Theme, session, toast providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Core business logic
│   ├── store/                 # Zustand stores
│   ├── types/                 # Shared TypeScript types
│   └── styles/                # Global CSS tokens
├── tests/                     # Test suites
│   ├── unit/                  # Vitest unit tests
│   ├── e2e/                   # Playwright E2E tests
│   └── setup.ts              # Test setup
├── middleware.ts              # Auth route protection
├── next.config.ts             # Security headers, image config
├── tailwind.config.ts         # Design tokens
├── vitest.config.ts           # Unit test configuration
├── playwright.config.ts       # E2E test configuration
├── vercel.json                # Vercel deployment config
└── README.md                  # You are here
```

---

## 🗄️ Database Schema

| Model | Purpose |
|---|---|
| **User** | Auth.js user (name, email, image) |
| **Account** | Auth.js OAuth accounts |
| **Session** | Auth.js sessions |
| **VerificationToken** | Auth.js email verification |
| **Task** | User-defined habits (name, color, order, archived) |
| **TaskStatus** | Cell status (PENDING/COMPLETED/FAILED/MISSED) per task+date |
| **Note** | Autosaved notes per date |
| **ActivityLog** | Full audit trail |
| **Quote** | Inspirational quotes |
| **Achievement** | Badge definitions |
| **UserAchievement** | User-badge join |
| **Settings** | Per-user preferences |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Google Cloud Console](https://console.cloud.google.com) OAuth 2.0 Client ID + Secret

### 1. Clone & Install

```bash
git clone <repo-url>
cd god-watch
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Run `openssl rand -hex 32` to generate |
| `GOOGLE_CLIENT_ID` | From GCP Console |
| `GOOGLE_CLIENT_SECRET` | From GCP Console |
| `DATABASE_URL` | Supabase pooled connection string (`:6543`) |
| `DIRECT_URL` | Supabase direct connection string (`:5432`) |
| `NEXT_PUBLIC_APP_URL` | Your deployed URL (or `http://localhost:3000`) |

**Google OAuth authorized redirect URI:**
`{NEXT_PUBLIC_APP_URL}/api/auth/callback/google`

### 3. Database Setup

```bash
# Push schema directly (first-time setup)
npx prisma db push

# Or create a migration
npx prisma migrate dev --name init

# Seed quotes and achievements
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and sign in with Google.

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Unit tests (watch mode)
npm run test:watch

# E2E tests (requires running app + Google OAuth configured)
npm run test:e2e

# TypeScript type check
npm run typecheck

# Lint
npm run lint
```

---

## 🌐 Deployment (Vercel)

1. Push to GitHub.
2. Import the repo into Vercel.
3. Set all environment variables (see `.env.example`) in Vercel's project settings.
4. Set `DATABASE_URL` to Supabase pooled connection.
5. Add `DIRECT_URL` for Prisma migrations.
6. Deploy — Vercel automatically runs `npm run build` (which calls `prisma generate` then `next build`).
7. Update your Google OAuth redirect URI to point to your production URL.

---

## 🎨 Design System

God Watch uses a neutral zinc-based palette with semantic status colors.

| Token | Light | Dark |
|---|---|---|
| `--background` | `0 0% 100%` | `240 10% 3.9%` |
| `--foreground` | `240 10% 3.9%` | `0 0% 98%` |
| `--primary` | `240 5.9% 10%` | `0 0% 98%` |
| `--success` | `142 76% 36%` | `142 69% 48%` |
| `--danger` | `0 72% 51%` | `0 72% 55%` |
| `--warning` | `24 95% 53%` | `30 92% 56%` |
| `--radius` | `0.75rem` | `0.75rem` |

Typography uses Geist (Geist Sans + Geist Mono) for a clean, modern look.

---

## 🔒 Security

- **Google OAuth only** — no password storage.
- **Row-level security via userId** — every query includes `WHERE userId = ?`.
- **CSRF protection** — Next.js Server Actions enforce `Origin` header checks.
- **XSS prevention** — React's default escaping + Content Security Policy headers.
- **SQL injection prevention** — Prisma uses parameterized queries / prepared statements.
- **Input validation** — Zod schemas on every API endpoint.
- **Rate limiting** — 60 requests/minute per IP.
- **HTTPS enforced** — via Vercel + HSTS header.
- **Secure cookies** — `httpOnly`, `sameSite`, `secure` flags.

---

## 📄 License

MIT — see LICENSE file.

---

## 👨‍💻 Author

**Devnetra Consultancy**  
Email: [dr.neeconnect@gmail.com](mailto:dr.neeconnect@gmail.com)

---

> *"Every day leaves evidence." — God Watch*

