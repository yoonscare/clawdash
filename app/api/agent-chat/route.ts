import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

const BLOB_KEY = 'agent-chat.json';

interface AgentMessage {
  time: string;
  from: string;
  to: string;
  text: string;
}

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
    const { time, from, to, text } = body;

    let messages: AgentMessage[] = [];
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url);
      messages = await res.json();
      await del(blobs[0].url);
    }

    messages.push({ time, from, to, text });
    if (messages.length > 30) messages = messages.slice(-30);

    await put(BLOB_KEY, JSON.stringify(messages), {
      access: 'public',
      contentType: 'application/json; charset=utf-8',
    });

    return NextResponse.json({ ok: true, count: messages.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('x-api-key');
    if (authHeader !== process.env.CHATLOG_API_KEY && process.env.CHATLOG_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { blobs } = await list({ prefix: BLOB_KEY });
    for (const blob of blobs) {
      await del(blob.url);
    }

    return NextResponse.json({ ok: true, deleted: blobs.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
