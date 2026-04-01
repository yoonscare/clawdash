import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('autoresearch')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('x-api-key');
    if (authHeader !== process.env.CHATLOG_API_KEY && process.env.CHATLOG_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { skill_name, status, baseline_score, best_score, experiments, eval_breakdown } = body;

    if (!skill_name) {
      return NextResponse.json({ error: 'skill_name is required' }, { status: 400 });
    }

    // Upsert by skill_name
    const { error } = await supabase
      .from('autoresearch')
      .upsert(
        {
          skill_name,
          status: status || 'running',
          baseline_score: baseline_score ?? 0,
          best_score: best_score ?? 0,
          experiments: experiments || [],
          eval_breakdown: eval_breakdown || [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'skill_name' }
      );

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
