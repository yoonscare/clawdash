# ClawDash 🦞

**AI-powered customizable dashboard generator for OpenClaw users**

AI 기반 커스터마이즈 가능 대시보드 — OpenClaw 사용자를 위한 오픈소스 프로젝트

![Neo Brutalism Design](https://img.shields.io/badge/Design-Neo%20Brutalism-FFE66D?style=flat-square&labelColor=000)
![Next.js 15](https://img.shields.io/badge/Next.js-15-000?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square)
![License MIT](https://img.shields.io/badge/License-MIT-4ECDC4?style=flat-square&labelColor=000)

---

## Screenshots

> Screenshots will be added after first deployment

---

## Features / 기능

- **10 Built-in Widgets** — Clock, Weather, Crypto, Glucose Monitor, Apple Health, News, Agent Status, Cron Monitor, Quick Notes, Calendar
- **Neo Brutalism Design** — Bold borders, hard shadows, vibrant colors
- **Dark Mode** — Full dark mode support
- **Responsive** — Mobile 1col → Tablet 2col → Desktop 3-4col
- **JSON-based** — No database required, all data stored in JSON files
- **Workspace Analyzer** — Parses SOUL.md, MEMORY.md to suggest widgets

---

## Quick Start / 빠른 시작

### Manual Setup

```bash
git clone https://github.com/reallygood83/clawdash.git
cd clawdash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment / 배포

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/reallygood83/clawdash)

### Tailscale Serve

```bash
npm run build && npm start
tailscale serve https / http://localhost:3000
```

### Docker

```bash
docker compose up -d
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

---

## Widgets / 위젯 목록

| Widget | Size | Category | Description |
|--------|------|----------|-------------|
| Clock | sm | Utility | Current time & date |
| Weather | sm | Info | Temperature from wttr.in |
| Crypto Tracker | lg | Finance | BTC price + 24h chart |
| Glucose Monitor | lg | Health | CGM data + TIR donut |
| Apple Health | md | Health | Steps, HR, Sleep, Calories |
| News Feed | lg | Info | Scrollable news items |
| Agent Status | sm | Agent | OpenClaw agent monitoring |
| Cron Monitor | md | Agent | Cron job status list |
| Quick Note | sm | Productivity | Simple note-taking |
| Calendar | md | Productivity | Today's events |

---

## Tech Stack / 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Storage**: JSON files (no database)

---

## Custom Widgets / 커스텀 위젯

See [docs/WIDGETS.md](docs/WIDGETS.md) for a guide on creating your own widgets.

---

## Contributing / 기여하기

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-widget`)
3. Commit your changes (`git commit -m 'Add my widget'`)
4. Push to the branch (`git push origin feature/my-widget`)
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with 🦞 by the OpenClaw community
