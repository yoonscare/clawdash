import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_PATH = join(process.cwd(), 'data', 'health.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const existing = existsSync(DATA_PATH)
      ? JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
      : {};

    const updated = { ...existing, ...body, updatedAt: new Date().toISOString() };
    writeFileSync(DATA_PATH, JSON.stringify(updated, null, 2));

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  try {
    if (existsSync(DATA_PATH)) {
      const data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
      return NextResponse.json(data);
    }
    return NextResponse.json({ steps: 8432, heartRate: 72, sleep: 7.2, calories: 2150 });
  } catch {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
