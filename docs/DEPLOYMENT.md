# Deployment Guide

## Vercel (Recommended)

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Framework will be auto-detected as Next.js
4. Click **Deploy**

Environment variables (optional):
- No env vars required for basic usage

## Tailscale Serve

Expose ClawDash on your Tailscale network:

```bash
# Build and start
npm run build
npm start

# In another terminal, expose via Tailscale
tailscale serve https / http://localhost:3000
```

Your dashboard will be available at `https://<machine-name>.<tailnet>.ts.net`

## Docker

### Using Docker Compose (recommended)

```bash
docker compose up -d
```

### Using Docker directly

```bash
# Build
docker build -t clawdash .

# Run
docker run -d -p 3000:3000 -v ./data:/app/data clawdash
```

### Updating

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

## Manual (PM2)

```bash
npm install
npm run build
npx pm2 start npm --name clawdash -- start
```
