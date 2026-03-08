import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

const BLOB_KEY = 'tasks.json';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return NextResponse.json([]);
    const res = await fetch(blobs[0].url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('x-api-key');
    if (authHeader !== process.env.CHATLOG_API_KEY && process.env.CHATLOG_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { task, status, emoji } = body;

    let tasks: Array<{ time: string; date: string; task: string; status: string; emoji: string }> = [];
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url);
      tasks = await res.json();
      await del(blobs[0].url);
    }

    const now = new Date();
    tasks.push({
      date: now.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' }),
      time: now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Seoul' }),
      task, status: status || 'done', emoji: emoji || '✅'
    });
    if (tasks.length > 30) tasks = tasks.slice(-30);

    await put(BLOB_KEY, JSON.stringify(tasks), { access: 'public', contentType: 'application/json' });
    return NextResponse.json({ ok: true, count: tasks.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
