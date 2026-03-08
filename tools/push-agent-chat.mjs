#!/usr/bin/env node
// 에이전트 간 대화를 대시보드에 push
// Usage: node push-agent-chat.mjs "클로" "클로아우" "메시지 내용"

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_KEY = readFileSync(resolve(__dirname, '../.chatlog-apikey'), 'utf-8').trim();
const BASE_URL = 'https://clawdash-kappa.vercel.app';

const from = process.argv[2] || '클로';
const to = process.argv[3] || '클로아우';
const text = process.argv[4] || 'sessions_send 테스트';

const time = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' });

const res = await fetch(`${BASE_URL}/api/agent-chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
  body: JSON.stringify({ time, from, to, text }),
});

const data = await res.json();
console.log('Push result:', data);
