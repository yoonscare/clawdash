import { put, list, del, head } from '@vercel/blob';
import { NextResponse } from 'next/server';

const BLOB_KEY = 'agent-chat.json';

interface AgentMessage {
  time: string;
  from: string;
  to: string;
  text: string;
}

async function readMessages(): Promise<AgentMessage[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function writeMessages(messages: AgentMessage[]): Promise<void> {
  // Delete all existing blobs first
  const { blobs } = await list({ prefix: BLOB_KEY });
  for (const blob of blobs) {
    await del(blob.url);
  }
  // Write new
  await put(BLOB_KEY, JSON.stringify(messages), {
    access: 'public',
    contentType: 'application/json; charset=utf-8',
  });
}

export async function GET() {
  const data = await readMessages();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('x-api-key');
    if (authHeader !== process.env.CHATLOG_API_KEY && process.env.CHATLOG_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: AgentMessage = await request.json();
    const { time, from, to, text } = body;

    let messages = await readMessages();
    messages.push({ time, from, to, text });
    if (messages.length > 30) messages = messages.slice(-30);

    await writeMessages(messages);

    return NextResponse.json({ ok: true, count: messages.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// Bulk replace all messages at once (avoids race conditions)
export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('x-api-key');
    if (authHeader !== process.env.CHATLOG_API_KEY && process.env.CHATLOG_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages: AgentMessage[] = await request.json();
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Body must be an array' }, { status: 400 });
    }

    await writeMessages(messages.slice(-30));

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
