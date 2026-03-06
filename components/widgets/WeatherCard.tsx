'use client';

import { useEffect, useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';

interface WeatherData {
  temp: string;
  condition: string;
  icon: string;
  location: string;
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch('https://wttr.in/?format=j1')
      .then(r => r.json())
      .then(data => {
        const current = data.current_condition?.[0];
        if (current) {
          setWeather({
            temp: current.temp_C,
            condition: current.weatherDesc?.[0]?.value || 'Unknown',
            icon: getWeatherIcon(current.weatherCode),
            location: data.nearest_area?.[0]?.areaName?.[0]?.value || 'Unknown',
          });
        }
      })
      .catch(() => {
        setWeather({ temp: '22', condition: 'Sunny', icon: '☀️', location: 'Seoul' });
      });
  }, []);

  return (
    <NeoCard accent="bg-neo-cyan">
      <h3 className="font-mono text-xs font-bold uppercase mb-2 opacity-60">Weather</h3>
      {weather ? (
        <>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{weather.icon}</span>
            <div>
              <div className="font-mono text-3xl font-extrabold">{weather.temp}°C</div>
              <div className="text-sm opacity-70">{weather.condition}</div>
            </div>
          </div>
          <div className="text-xs mt-2 opacity-50">{weather.location}</div>
        </>
      ) : (
        <div className="h-20 flex items-center justify-center font-mono text-sm animate-pulse">Loading...</div>
      )}
    </NeoCard>
  );
}

function getWeatherIcon(code: string): string {
  const c = parseInt(code);
  if (c === 113) return '☀️';
  if (c === 116) return '⛅';
  if ([119, 122].includes(c)) return '☁️';
  if ([176, 293, 296, 299, 302, 305, 308].includes(c)) return '🌧️';
  if ([200, 386, 389].includes(c)) return '⛈️';
  if ([227, 230, 323, 326, 329, 332].includes(c)) return '🌨️';
  return '🌤️';
}
