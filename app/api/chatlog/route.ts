import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('chatlog')
      .select('*')
      .order('id', { ascending: false })
      .limit(20);

    if (error) throw error;

    const messages = (data || []).reverse().map((row) => ({
      time: row.time,
      from: row.from_name,
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

    const body = await request.json();
    const { time, from, text } = body;

    const { error } = await supabase.from('chatlog').insert({
      time,
      from_name: from,
      text,
    });

    if (error) throw error;

    const { count } = await supabase.from('chatlog').select('*', { count: 'exact', head: true });
    return NextResponse.json({ ok: true, count: count || 0 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
