import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const WORKSPACE_FILES = ['SOUL.md', 'MEMORY.md', 'TOOLS.md', 'HEARTBEAT.md'];

interface WidgetSuggestion {
  widget: string;
  reason: string;
  confidence: number;
}

const KEYWORD_MAP: Record<string, { widget: string; reason: string }> = {
  glucose: { widget: 'glucose-monitor', reason: 'Health tracking keywords detected' },
  cgm: { widget: 'glucose-monitor', reason: 'CGM device references found' },
  health: { widget: 'apple-health', reason: 'Health data integration mentioned' },
  steps: { widget: 'apple-health', reason: 'Activity tracking keywords found' },
  heartrate: { widget: 'apple-health', reason: 'Heart rate monitoring mentioned' },
  crypto: { widget: 'crypto-tracker', reason: 'Cryptocurrency references found' },
  bitcoin: { widget: 'crypto-tracker', reason: 'Bitcoin tracking mentioned' },
  portfolio: { widget: 'crypto-tracker', reason: 'Portfolio management keywords' },
  cron: { widget: 'cron-monitor', reason: 'Scheduled tasks detected' },
  schedule: { widget: 'cron-monitor', reason: 'Scheduling references found' },
  agent: { widget: 'agent-status', reason: 'Agent monitoring keywords found' },
  openclaw: { widget: 'agent-status', reason: 'OpenClaw agent references detected' },
  news: { widget: 'news-feed', reason: 'News consumption patterns found' },
  rss: { widget: 'news-feed', reason: 'RSS feed references detected' },
  calendar: { widget: 'calendar', reason: 'Calendar/scheduling keywords found' },
  meeting: { widget: 'calendar', reason: 'Meeting references detected' },
  note: { widget: 'quick-note', reason: 'Note-taking patterns found' },
  todo: { widget: 'quick-note', reason: 'Task management keywords detected' },
  weather: { widget: 'weather', reason: 'Weather tracking references found' },
};

export function analyzeWorkspace(workspacePath: string): WidgetSuggestion[] {
  const content = WORKSPACE_FILES
    .map(f => {
      const path = join(workspacePath, f);
      return existsSync(path) ? readFileSync(path, 'utf-8') : '';
    })
    .join('\n')
    .toLowerCase();

  if (!content.trim()) {
    return defaultSuggestions();
  }

  const suggestions = new Map<string, WidgetSuggestion>();

  for (const [keyword, mapping] of Object.entries(KEYWORD_MAP)) {
    const count = (content.match(new RegExp(keyword, 'gi')) || []).length;
    if (count > 0) {
      const existing = suggestions.get(mapping.widget);
      const confidence = Math.min(count * 0.2, 1);
      if (!existing || existing.confidence < confidence) {
        suggestions.set(mapping.widget, {
          widget: mapping.widget,
          reason: mapping.reason,
          confidence,
        });
      }
    }
  }

  // Always include clock and weather as defaults
  if (!suggestions.has('clock')) {
    suggestions.set('clock', { widget: 'clock', reason: 'Default utility widget', confidence: 0.5 });
  }

  return Array.from(suggestions.values()).sort((a, b) => b.confidence - a.confidence);
}

function defaultSuggestions(): WidgetSuggestion[] {
  return [
    { widget: 'clock', reason: 'Default utility', confidence: 1 },
    { widget: 'weather', reason: 'Default utility', confidence: 0.9 },
    { widget: 'agent-status', reason: 'OpenClaw monitoring', confidence: 0.8 },
    { widget: 'quick-note', reason: 'Productivity tool', confidence: 0.7 },
  ];
}
