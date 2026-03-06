export const neoBrutalism = {
  colors: {
    background: { light: '#FFFEF2', dark: '#0A0A0A' },
    yellow: '#FFE66D',
    pink: '#FF6B9D',
    cyan: '#4ECDC4',
    red: '#FF4757',
    purple: '#A855F7',
    blue: '#3B82F6',
    black: '#000000',
    white: '#FFFFFF',
  },
  shadow: {
    default: '8px 8px 0 #000',
    sm: '4px 4px 0 #000',
    hover: '12px 12px 0 #000',
    dark: '8px 8px 0 #FFE66D',
    darkSm: '4px 4px 0 #FFE66D',
    darkHover: '12px 12px 0 #FFE66D',
  },
  border: 'border-4 border-black dark:border-neo-yellow',
  fonts: {
    heading: "'JetBrains Mono', monospace",
    body: "'Inter', sans-serif",
  },
} as const;

export const widgetColors = {
  clock: 'neo-yellow',
  weather: 'neo-cyan',
  crypto: 'neo-purple',
  glucose: 'neo-red',
  health: 'neo-pink',
  news: 'neo-blue',
  agent: 'neo-cyan',
  cron: 'neo-yellow',
  note: 'neo-pink',
  calendar: 'neo-purple',
} as const;
