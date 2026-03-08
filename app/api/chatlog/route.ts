import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

const BLOB_KEY = 'chatlog.json';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) {
      return NextResponse.json([]);
    }
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
    const { time, from, text } = body;

    // Get existing messages
    let messages: Array<{ time: string; from: string; text: string }> = [];
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url);
      messages = await res.json();
      // Delete old blob
      await del(blobs[0].url);
    }

    // Add new message, keep last 20
    messages.push({ time, from, text });
    if (messages.length > 20) messages = messages.slice(-20);

    // Save
    await put(BLOB_KEY, JSON.stringify(messages), {
      access: 'public',
      contentType: 'application/json',
    });

    return NextResponse.json({ ok: true, count: messages.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
