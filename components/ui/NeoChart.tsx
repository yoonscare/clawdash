'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface NeoLineChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey?: string;
  color?: string;
  height?: number;
}

export function NeoLineChart({ data, dataKey, xKey = 'time', color = '#4ECDC4', height = 200 }: NeoLineChartProps) {
  return (
    <div className="border border-black/10 dark:border-white/10 rounded-xl p-2 bg-white dark:bg-zinc-800">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey={xKey} tick={{ fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
          <YAxis tick={{ fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
          <Tooltip contentStyle={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', fontFamily: "'JetBrains Mono'" }} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface NeoBarChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey?: string;
  color?: string;
  height?: number;
}

export function NeoBarChart({ data, dataKey, xKey = 'name', color = '#FFE66D', height = 200 }: NeoBarChartProps) {
  return (
    <div className="border border-black/10 dark:border-white/10 rounded-xl p-2 bg-white dark:bg-zinc-800">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey={xKey} tick={{ fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
          <YAxis tick={{ fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
          <Tooltip contentStyle={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', fontFamily: "'JetBrains Mono'" }} />
          <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface NeoDonutChartProps {
  data: { name: string; value: number; color: string }[];
  height?: number;
}

export function NeoDonutChart({ data, height = 200 }: NeoDonutChartProps) {
  return (
    <div className="border border-black/10 dark:border-white/10 rounded-xl p-2 bg-white dark:bg-zinc-800">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', fontFamily: "'JetBrains Mono'" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
