import { NextResponse } from 'next/server';

// OpenClaw gateway API에서 크론 목록 가져오기
export async function GET() {
  try {
    const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:4445';
    const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN || '';

    const res = await fetch(`${gatewayUrl}/api/cron/jobs`, {
      headers: {
        ...(gatewayToken ? { Authorization: `Bearer ${gatewayToken}` } : {}),
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Gateway returned ${res.status}`);
    }

    const data = await res.json();
    const jobs = (data.jobs || []).map((job: Record<string, unknown>) => {
      const state = (job.state || {}) as Record<string, unknown>;
      const schedule = (job.schedule || {}) as Record<string, unknown>;

      // 마지막 실행 시간 포맷
      let lastRun = '없음';
      if (state.lastRunAtMs) {
        const d = new Date(state.lastRunAtMs as number);
        lastRun = d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }

      // 다음 실행 시간
      let nextRun = '';
      if (state.nextRunAtMs) {
        const d = new Date(state.nextRunAtMs as number);
        nextRun = d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }

      // 스케줄 표시
      let scheduleStr = '';
      if (schedule.kind === 'cron') scheduleStr = schedule.expr as string;
      else if (schedule.kind === 'every') scheduleStr = `every ${Math.round((schedule.everyMs as number) / 60000)}m`;
      else if (schedule.kind === 'at') scheduleStr = `at ${schedule.at}`;

      return {
        name: (job.name as string) || (job.id as string),
        schedule: scheduleStr,
        lastRun,
        nextRun,
        status: state.lastRunStatus === 'ok' ? 'success' : state.lastRunStatus === 'error' ? 'failed' : 'running',
        enabled: job.enabled,
      };
    });

    return NextResponse.json(jobs);
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch cron jobs', detail: String(e) },
      { status: 500 },
    );
  }
}
