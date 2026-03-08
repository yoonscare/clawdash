import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

const BLOB_KEY = 'docs.json';

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
    const { title, path, emoji } = body;

    let docs: Array<{ title: string; path: string; date: string; emoji: string }> = [];
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url);
      docs = await res.json();
      await del(blobs[0].url);
    }

    const now = new Date();
    docs.push({
      title, path: path || '',
      date: now.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' }),
      emoji: emoji || '📄'
    });
    if (docs.length > 30) docs = docs.slice(-30);

    await put(BLOB_KEY, JSON.stringify(docs), { access: 'public', contentType: 'application/json' });
    return NextResponse.json({ ok: true, count: docs.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
