import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type');

  if (!type) {
    return NextResponse.json({ error: 'Missing type parameter' }, { status: 400 });
  }

  const filePath = join(DATA_DIR, `${type}.json`);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: `No data for type: ${type}` }, { status: 404 });
  }

  try {
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
