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
    <div className="border-4 border-black dark:border-neo-yellow p-2 bg-white dark:bg-zinc-800">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey={xKey} tick={{ fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
          <YAxis tick={{ fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
          <Tooltip contentStyle={{ border: '3px solid #000', fontFamily: "'JetBrains Mono'" }} />
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
    <div className="border-4 border-black dark:border-neo-yellow p-2 bg-white dark:bg-zinc-800">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey={xKey} tick={{ fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
          <YAxis tick={{ fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
          <Tooltip contentStyle={{ border: '3px solid #000', fontFamily: "'JetBrains Mono'" }} />
          <Bar dataKey={dataKey} fill={color} stroke="#000" strokeWidth={2} />
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
    <div className="border-4 border-black dark:border-neo-yellow p-2 bg-white dark:bg-zinc-800">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} innerRadius={40} outerRadius={70} dataKey="value" stroke="#000" strokeWidth={2}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ border: '3px solid #000', fontFamily: "'JetBrains Mono'" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
