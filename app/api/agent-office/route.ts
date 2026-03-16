import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface AgentInfo {
  id: string;
  name: string;
  emoji: string;
  status: 'online' | 'idle' | 'offline';
  lastActivity: string;
  currentTask: string;
  model: string;
  tokenUsage: number;
}

const OPENCLAW_BASE = process.env.OPENCLAW_AGENTS_PATH
  || path.join(process.env.USERPROFILE || 'C:\\Users\\김기훈.LAPTOP-1R73PMSJ', '.openclaw', 'agents');

function readSessionsJson(agentDir: string): Record<string, unknown> | null {
  const sessionsPath = path.join(OPENCLAW_BASE, agentDir, 'sessions', 'sessions.json');
  try {
    return JSON.parse(fs.readFileSync(sessionsPath, 'utf8'));
  } catch {
    return null;
  }
}

function getLastJsonlLine(agentDir: string, sessionId: string): Record<string, unknown> | null {
  const filePath = path.join(OPENCLAW_BASE, agentDir, 'sessions', `${sessionId}.jsonl`);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.trim().split('\n').filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const parsed = JSON.parse(lines[i]);
        if (parsed.timestamp) return parsed;
      } catch { /* skip malformed lines */ }
    }
  } catch { /* file not found */ }
  return null;
}

function getAgentStatus(updatedAt: number): 'online' | 'idle' | 'offline' {
  const now = Date.now();
  const diff = now - updatedAt;
  const FIVE_MIN = 5 * 60 * 1000;
  const THIRTY_MIN = 30 * 60 * 1000;
  if (diff < FIVE_MIN) return 'online';
  if (diff < THIRTY_MIN) return 'idle';
  return 'offline';
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금 전';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

function extractCurrentTask(lastLine: Record<string, unknown> | null): string {
  if (!lastLine) return '대기 중';
  const type = lastLine.type as string;
  if (type === 'assistant') return '응답 작성 중...';
  if (type === 'tool_use') return `도구 실행 중...`;
  if (type === 'user' || type === 'human') return '메시지 수신';
  return '대기 중';
}

function buildAgentInfo(
  id: string,
  name: string,
  emoji: string,
  agentDir: string,
  sessionKey: string,
): AgentInfo {
  const sessions = readSessionsJson(agentDir);
  if (!sessions) {
    return { id, name, emoji, status: 'offline', lastActivity: '알 수 없음', currentTask: '오프라인', model: '-', tokenUsage: 0 };
  }

  // Find the main session entry
  const entry = (sessions[sessionKey] || Object.values(sessions)[0]) as Record<string, unknown> | undefined;
  if (!entry) {
    return { id, name, emoji, status: 'offline', lastActivity: '알 수 없음', currentTask: '오프라인', model: '-', tokenUsage: 0 };
  }

  const updatedAt = (entry.updatedAt as number) || 0;
  const model = (entry.model as string) || 'claude-opus-4-6';
  const tokenUsage = (entry.totalTokens as number) || 0;
  const sessionId = entry.sessionId as string;

  const lastLine = sessionId ? getLastJsonlLine(agentDir, sessionId) : null;

  return {
    id,
    name,
    emoji,
    status: getAgentStatus(updatedAt),
    lastActivity: formatTimeAgo(updatedAt),
    currentTask: extractCurrentTask(lastLine),
    model: model.replace('claude-', '').replace('-4-6', ' 4.6'),
    tokenUsage,
  };
}

export async function GET() {
  try {
    const agents: AgentInfo[] = [
      buildAgentInfo('claw', '클로', '🦦', 'main', 'agent:main:main'),
      buildAgentInfo('clawau', '클로아우', '🐻', 'clawau', 'agent:clawau:main'),
    ];

    return NextResponse.json({ agents, timestamp: Date.now() });
  } catch (error) {
    console.error('Agent office API error:', error);
    return NextResponse.json({
      agents: [
        { id: 'claw', name: '클로', emoji: '🦦', status: 'offline', lastActivity: '-', currentTask: '오프라인', model: '-', tokenUsage: 0 },
        { id: 'clawau', name: '클로아우', emoji: '🐻', status: 'offline', lastActivity: '-', currentTask: '오프라인', model: '-', tokenUsage: 0 },
      ],
      timestamp: Date.now(),
    });
  }
}
