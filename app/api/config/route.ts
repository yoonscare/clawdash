import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONFIG_PATH = join(process.cwd(), 'data', 'config.json');

export async function GET() {
  try {
    if (existsSync(CONFIG_PATH)) {
      const data = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
      return NextResponse.json(data);
    }
    return NextResponse.json(defaultConfig());
  } catch {
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    writeFileSync(CONFIG_PATH, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true, data: body });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

function defaultConfig() {
  return {
    theme: 'light',
    widgets: [
      { id: 'clock', enabled: true, position: 0 },
      { id: 'weather', enabled: true, position: 1 },
      { id: 'agent', enabled: true, position: 2 },
      { id: 'note', enabled: true, position: 3 },
      { id: 'health', enabled: true, position: 4 },
      { id: 'cron', enabled: true, position: 5 },
      { id: 'calendar', enabled: true, position: 6 },
      { id: 'crypto', enabled: true, position: 7 },
      { id: 'glucose', enabled: true, position: 8 },
      { id: 'news', enabled: true, position: 9 },
    ],
  };
}
