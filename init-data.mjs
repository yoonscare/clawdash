import fs from 'fs';
const apiKey = fs.readFileSync('C:\\Users\\김기훈.LAPTOP-1R73PMSJ\\Projects\\clawdash\\.chatlog-apikey','utf8').trim();
const base = 'https://clawdash-kappa.vercel.app';

const tasks = [
  { task: "ClawDash 설치 및 한국어 커스텀", status: "done", emoji: "🛠️" },
  { task: "Vercel 배포 완료", status: "done", emoji: "🚀" },
  { task: "위젯 4종 추가 (대화로그, 미션, 투두, AI Digest)", status: "done", emoji: "📦" },
  { task: "건강관리 위젯 추가 (혈압 + 주간루틴)", status: "done", emoji: "❤️" },
  { task: "캘린더 인터랙티브 전환", status: "done", emoji: "📅" },
  { task: "대화 로그 실시간 API 연동 (Vercel Blob)", status: "done", emoji: "🔗" },
  { task: "미션 스테이트먼트 상단 고정", status: "done", emoji: "🎯" },
  { task: "Task Tracker + Documents Viewer 추가", status: "done", emoji: "📋" },
];

const docs = [
  { title: "AI Daily Digest (2026-03-08)", path: "55-AI-Daily-Digest/news/2026-03-08.md", emoji: "📰" },
  { title: "HWPX-CLI 사용법 가이드", path: "50-AI-Tools/hwpx-cli-guide.md", emoji: "📝" },
  { title: "OpenClaw 설치 튜토리얼", path: "130-AI-학습/openclaw-install.md", emoji: "🔧" },
  { title: "ClawDash 미션 컨트롤", path: "60-Projects/clawdash/README.md", emoji: "🐾" },
];

for (const t of tasks) {
  const res = await fetch(base + '/api/tasks', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify(t)
  });
  const d = await res.json();
  console.log('Task:', t.emoji, d.ok ? '✓' : d.error);
}

for (const doc of docs) {
  const res = await fetch(base + '/api/docs', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify(doc)
  });
  const d = await res.json();
  console.log('Doc:', doc.emoji, d.ok ? '✓' : d.error);
}
console.log('Done!');
