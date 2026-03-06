# ClawDash Development Task

## What to Build
ClawDash — an open-source, AI-powered customizable dashboard generator for OpenClaw users.
Design: **Neo Brutalism** (bold borders, hard shadows, vibrant color blocks, monospace typography)

## Tech Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4
- Recharts (charts)
- NO database — JSON file based

## Required Files

### 1. README.md (Korean + English bilingual)
- Project description, screenshots section
- Quick Start (npx, manual)
- Deployment guides: Vercel, Tailscale Serve, Docker
- Widget list
- Contributing guide
- License MIT

### 2. Neo Brutalism Design System
Create `lib/themes/neo-brutalism.ts` and UI components:
- `NeoCard` — border-4 border-black, shadow-[8px_8px_0_#000], hover lift
- `NeoButton` — bold, uppercase, hard shadow
- `NeoProgress` — thick bar, no rounded corners
- `NeoBadge` — status badges
- `NeoChart` — recharts wrapper with neo styling

Color palette:
- Background: #FFFEF2 (light) / #0A0A0A (dark)
- Yellow: #FFE66D, Pink: #FF6B9D, Cyan: #4ECDC4
- Red: #FF4757, Purple: #A855F7, Blue: #3B82F6

### 3. Dashboard Layout
- `app/page.tsx` — responsive grid of widgets
- `app/layout.tsx` — Neo Brutalism global styles, dark mode support
- `components/layout/DashboardGrid.tsx` — CSS grid, responsive
- `components/layout/Header.tsx` — title + dark mode toggle + settings

### 4. Widget Components (build ALL of these)
Each widget uses NeoCard wrapper with appropriate color:

a) **ClockWidget** (sm, utility) — current time + date, neo style
b) **WeatherCard** (sm, info) — wttr.in API, temperature + icon
c) **CryptoTracker** (lg, finance) — BTC price from public API, 24h chart, portfolio value
d) **GlucoseMonitor** (lg, health) — glucose value + trend arrow + 24h sparkline + TIR donut
e) **AppleHealthSync** (md, health) — steps, heart rate, sleep, calories in grid
f) **NewsFeed** (lg, info) — scrollable news items with titles + timestamps
g) **AgentStatus** (sm, agent) — OpenClaw agent online/offline + uptime
h) **CronMonitor** (md, agent) — list of cron jobs with last run status
i) **QuickNote** (sm, productivity) — simple text input that saves to JSON
j) **CalendarWidget** (md, productivity) — today's events list

### 5. API Routes
- `app/api/health/route.ts` — POST to receive Apple Health data
- `app/api/widgets/route.ts` — GET widget data from JSON files
- `app/api/config/route.ts` — GET/PUT dashboard configuration

### 6. Sample Data
Create `data/` directory with sample JSON files for demo:
- `data/config.json` — dashboard layout config
- `data/glucose.json` — sample glucose readings
- `data/health.json` — sample health data
- `data/news.json` — sample news items
- `data/crypto.json` — sample crypto data

### 7. Workspace Analyzer (basic)
`lib/analyzer/index.ts` — parse SOUL.md, MEMORY.md, TOOLS.md, HEARTBEAT.md
Extract keywords → suggest widgets. This is the MVP version.

### 8. Docker Support
- `Dockerfile` (multi-stage build)
- `docker-compose.yml`

### 9. Deployment Docs
- `docs/DEPLOYMENT.md` — Vercel + Tailscale + Docker step-by-step
- `docs/WIDGETS.md` — how to create custom widgets

### 10. package.json
Name: clawdash, description in English, scripts for dev/build/start

## Design Rules
- ALL cards must use Neo Brutalism style (border-4, hard shadow, bold colors)
- Dark mode must work (toggle in header)
- Responsive: mobile 1 col, tablet 2 col, desktop 3-4 col
- Typography: JetBrains Mono for headings/numbers, Inter for body
- Every widget card has a distinct accent color
- Hover effects: shadow grows + card lifts slightly

## When Done
1. Git add, commit, push to origin main
2. Run: /Users/moon/moltbot/node_modules/.pnpm/node_modules/.bin/openclaw system event --text "ClawDash 개발 완료! GitHub에 푸시했어요. https://github.com/reallygood83/clawdash" --mode now
