import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout } = await execAsync('openclaw cron list --json', {
      timeout: 10000,
    });
    const jobs = JSON.parse(stdout);
    return NextResponse.json(jobs);
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch cron jobs', detail: String(e) },
      { status: 500 },
    );
  }
}
