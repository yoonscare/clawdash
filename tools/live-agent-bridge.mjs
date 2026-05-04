#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const API_KEY = fs.readFileSync(path.join(ROOT, '.chatlog-apikey'), 'utf8').trim();
const BASE_URL = process.env.CLAWDASH_BASE_URL || 'https://clawdash-repo.vercel.app';
const STATE_PATH = path.join(ROOT, 'tools', '.live-agent-bridge-state.json');
const POLL_MS = Number(process.env.LIVE_BRIDGE_POLL_MS || 4000);

const AGENTS = [
  { key: 'main', dir: path.join(process.env.USERPROFILE || 'C:\\Users\\김기훈.LAPTOP-1R73PMSJ', '.openclaw', 'agents', 'main', 'sessions'), label: '클로' },
  { key: 'clawau', dir: path.join(process.env.USERPROFILE || 'C:\\Users\\김기훈.LAPTOP-1R73PMSJ', '.openclaw', 'agents', 'clawau', 'sessions'), label: '클로아우' },
  { key: 'clawbi', dir: path.join(process.env.USERPROFILE || 'C:\\Users\\김기훈.LAPTOP-1R73PMSJ', '.openclaw', 'agents', 'clawbi', 'sessions'), label: '클로비' },
];

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

function loadState() {
  return readJson(STATE_PATH, { sessions: {}, recentFingerprints: [] });
}

function saveState(state) {
  writeJson(STATE_PATH, state);
}

function getSessionFile(agent) {
  const sessionsPath = path.join(agent.dir, 'sessions.json');
  const sessions = readJson(sessionsPath, {});
  const entries = Object.values(sessions || {});
  if (!entries.length) return null;
  const preferred = entries.find((entry) => String(entry.lastTo || '').includes('7502131876')) || entries[0];
  if (preferred?.sessionFile) return preferred.sessionFile;
  if (preferred?.sessionId) return path.join(agent.dir, `${preferred.sessionId}.jsonl`);
  return null;
}

function sanitizeText(text) {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractText(content = []) {
  if (!Array.isArray(content)) return '';
  return sanitizeText(
    content
      .filter((item) => item && item.type === 'text' && typeof item.text === 'string')
      .map((item) => item.text.trim())
      .filter(Boolean)
      .join('\n\n')
      .trim()
  );
}

async function pushMessage(payload) {
  const res = await fetch(`${BASE_URL}/api/agent-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`push failed: ${res.status} ${text}`);
  }
}

function rememberFingerprint(state, fingerprint) {
  const recent = Array.isArray(state.recentFingerprints) ? state.recentFingerprints : [];
  recent.push(fingerprint);
  state.recentFingerprints = recent.slice(-500);
}

async function syncAgent(agent, state) {
  const sessionFile = getSessionFile(agent);
  if (!sessionFile || !fs.existsSync(sessionFile)) return 0;

  const sessionState = state.sessions[agent.key] || {};
  const lines = fs.readFileSync(sessionFile, 'utf8').split('\n').filter(Boolean);

  let startIndex = typeof sessionState.index === 'number' ? sessionState.index : lines.length;
  if (sessionState.file !== sessionFile) {
    startIndex = lines.length;
  }

  let pushed = 0;

  for (let i = startIndex; i < lines.length; i += 1) {
    let row;
    try {
      row = JSON.parse(lines[i]);
    } catch {
      continue;
    }

    if (row.type !== 'message' || !row.message) continue;

    const role = row.message.role;
    if (role !== 'user' && role !== 'assistant') continue;

    const text = extractText(row.message.content);
    if (!text) continue;

    const dedupeKey = `${sessionFile}:${row.id}`;
    if (sessionState.lastId === dedupeKey) continue;

    const time = new Date(row.timestamp || Date.now()).toLocaleTimeString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
    });

    const payload = {
      time,
      from: role === 'assistant' ? agent.label : '윤 스케어',
      to: role === 'assistant' ? '윤 스케어' : agent.label,
      text,
    };

    const fingerprint = `${payload.time}|${payload.from}|${payload.to}|${payload.text}`;
    if ((state.recentFingerprints || []).includes(fingerprint)) {
      sessionState.lastId = dedupeKey;
      continue;
    }

    await pushMessage(payload);

    rememberFingerprint(state, fingerprint);
    sessionState.lastId = dedupeKey;
    pushed += 1;
  }

  state.sessions[agent.key] = {
    file: sessionFile,
    index: lines.length,
    lastId: sessionState.lastId || null,
  };

  return pushed;
}

const state = loadState();
let isSyncing = false;

async function loop() {
  if (isSyncing) return;
  isSyncing = true;

  try {
    let total = 0;

    for (const agent of AGENTS) {
      total += await syncAgent(agent, state);
    }

    saveState(state);
    if (total > 0) {
      console.log(`[live-agent-bridge] pushed ${total} message(s) at ${new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' })}`);
    }
  } finally {
    isSyncing = false;
  }
}

console.log(`[live-agent-bridge] watching ${BASE_URL}`);
await loop();
setInterval(() => {
  loop().catch((error) => console.error('[live-agent-bridge]', error.message));
}, POLL_MS);
