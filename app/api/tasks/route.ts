import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('id', { ascending: false })
      .limit(30);

    if (error) throw error;

    // Return in chronological order (oldest first) to match previous behavior
    const tasks = (data || []).reverse().map((row) => ({
      date: row.date,
      time: row.time,
      task: row.task,
      status: row.status,
      emoji: row.emoji,
    }));

    return NextResponse.json(tasks);
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

    const now = new Date();
    const { error } = await supabase.from('tasks').insert({
      date: now.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' }),
      time: now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Seoul' }),
      task,
      status: status || 'done',
      emoji: emoji || '✅',
    });

    if (error) throw error;

    const { count } = await supabase.from('tasks').select('*', { count: 'exact', head: true });
    return NextResponse.json({ ok: true, count: count || 0 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
