import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

interface AgentMessage {
  time: string;
  from: string;
  to: string;
  text: string;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('agent_chat')
      .select('*')
      .order('id', { ascending: false })
      .limit(30);

    if (error) throw error;

    const messages = (data || []).reverse().map((row) => ({
      id: row.id,
      time: row.time,
      from: row.from_agent,
      to: row.to_agent,
      text: row.text,
    }));

    return NextResponse.json(messages);
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

    const body: AgentMessage = await request.json();
    const { time, from, to, text } = body;

    const { error } = await supabase.from('agent_chat').insert({
      time,
      from_agent: from,
      to_agent: to,
      text,
    });

    if (error) throw error;

    const { count } = await supabase.from('agent_chat').select('*', { count: 'exact', head: true });
    return NextResponse.json({ ok: true, count: count || 0 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// Bulk replace all messages at once
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

    // Delete all existing rows
    await supabase.from('agent_chat').delete().gte('id', 0);

    // Insert new messages (last 30)
    const toInsert = messages.slice(-30).map((m) => ({
      time: m.time,
      from_agent: m.from,
      to_agent: m.to,
      text: m.text,
    }));

    if (toInsert.length > 0) {
      const { error } = await supabase.from('agent_chat').insert(toInsert);
      if (error) throw error;
    }

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

    const { count } = await supabase.from('agent_chat').select('*', { count: 'exact', head: true });
    await supabase.from('agent_chat').delete().gte('id', 0);

    return NextResponse.json({ ok: true, deleted: count || 0 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
