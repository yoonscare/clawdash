# Creating Custom Widgets

## Widget Structure

Every widget follows this pattern:

```tsx
'use client';

import NeoCard from '@/components/ui/NeoCard';

export default function MyWidget() {
  return (
    <NeoCard accent="bg-neo-cyan" span="sm">
      <h3 className="font-mono text-xs font-bold uppercase mb-2 text-zinc-500">
        My Widget
      </h3>
      {/* Widget content */}
    </NeoCard>
  );
}
```

## NeoCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accent` | string | `'bg-neo-yellow'` | Top border color class |
| `span` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Grid column span |
| `className` | string | `''` | Additional CSS classes |

## Available Accent Colors

- `bg-neo-yellow` — #FFE66D
- `bg-neo-pink` — #FF6B9D
- `bg-neo-cyan` — #4ECDC4
- `bg-neo-red` — #FF4757
- `bg-neo-purple` — #A855F7
- `bg-neo-blue` — #3B82F6

## Span Sizes

- `sm` — 1 column (all breakpoints)
- `md` — 1 column mobile, 2 columns tablet+
- `lg` — 1 column mobile, 2 tablet, 3 desktop

## Using Charts

```tsx
import { NeoLineChart, NeoBarChart, NeoDonutChart } from '@/components/ui/NeoChart';

// Line chart
<NeoLineChart data={data} dataKey="value" xKey="time" color="#4ECDC4" height={200} />

// Bar chart
<NeoBarChart data={data} dataKey="count" xKey="name" color="#FFE66D" height={200} />

// Donut chart
<NeoDonutChart data={[{ name: 'A', value: 60, color: '#4ECDC4' }]} height={200} />
```

## Adding to Dashboard

1. Create your widget in `components/widgets/`
2. Import and add it to `app/page.tsx` inside `<DashboardGrid>`

## Data Sources

Widgets can fetch data from:
- `/api/widgets?type=<name>` — reads from `data/<name>.json`
- `/api/health` — Apple Health data endpoint
- External APIs (weather, crypto, etc.)
