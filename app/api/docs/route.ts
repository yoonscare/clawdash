import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('docs')
      .select('*')
      .order('id', { ascending: false })
      .limit(30);

    if (error) throw error;

    const docs = (data || []).reverse().map((row) => ({
      title: row.title,
      path: row.path,
      date: row.date,
      emoji: row.emoji,
    }));

    return NextResponse.json(docs);
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

    const now = new Date();
    const { error } = await supabase.from('docs').insert({
      title,
      path: path || '',
      date: now.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' }),
      emoji: emoji || '📄',
    });

    if (error) throw error;

    const { count } = await supabase.from('docs').select('*', { count: 'exact', head: true });
    return NextResponse.json({ ok: true, count: count || 0 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
