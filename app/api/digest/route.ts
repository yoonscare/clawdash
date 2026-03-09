import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const DIGEST_DIR = join(
  'C:',
  'Users',
  '김기훈.LAPTOP-1R73PMSJ',
  'Desktop',
  'Yoons',
  '100-AI',
  '102-Daily-Digest',
  'social',
);

interface DigestItem {
  date: string;
  title: string;
  summary: string;
}

function parseDigest(filename: string, content: string): DigestItem {
  const date = filename.replace('.md', '');

  const lines = content.split('\n');
  const title = (lines.find((l) => l.startsWith('# '))?.replace('# ', '') ?? date);

  const insightHeader = lines.findIndex((l) => /키 인사이트/.test(l));
  let summary = '';
  if (insightHeader !== -1) {
    const bullets: string[] = [];
    for (let i = insightHeader + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const cleaned = line.replace(/^[-*]\s*\*\*/, '').replace(/\*\*.*?—\s*/, '').replace(/\*\*/g, '').trim();
        bullets.push(cleaned);
      }
      if (line.startsWith('#') || line.startsWith('---')) break;
    }
    summary = bullets.join(' / ');
  }

  if (!summary) {
    const firstSection = lines.find(
      (l) => l.startsWith('### ') || l.startsWith('## '),
    );
    summary = firstSection?.replace(/^#+\s*/, '') ?? '';
  }

  return { date, title, summary };
}

export async function GET() {
  try {
    const files = await readdir(DIGEST_DIR);
    const mdFiles = files
      .filter((f) => f.endsWith('.md'))
      .sort()
      .reverse()
      .slice(0, 5);

    const items: DigestItem[] = [];
    for (const file of mdFiles) {
      const content = await readFile(join(DIGEST_DIR, file), 'utf-8');
      items.push(parseDigest(file, content));
    }

    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to read digest files', detail: String(e) },
      { status: 500 },
    );
  }
}
