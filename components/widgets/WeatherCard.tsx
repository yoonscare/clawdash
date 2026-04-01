'use client';

import { useEffect, useState } from 'react';
import NeoCard from '@/components/ui/NeoCard';

interface WeatherData {
  temp: string;
  condition: string;
  icon: string;
  humidity: string;
  feelsLike: string;
}

export default function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch('https://wttr.in/Seoul?format=j1')
      .then(r => r.json())
      .then(data => {
        const current = data.current_condition?.[0];
        if (current) {
          setWeather({
            temp: current.temp_C,
            condition: translateCondition(current.weatherDesc?.[0]?.value || 'Unknown'),
            icon: getWeatherIcon(current.weatherCode),
            humidity: current.humidity,
            feelsLike: current.FeelsLikeC,
          });
        }
      })
      .catch(() => {
        setWeather({ temp: '--', condition: '로딩 실패', icon: '❓', humidity: '--', feelsLike: '--' });
      });
  }, []);

  return (
    <NeoCard>
      <h3 className="font-mono text-xs font-bold mb-2 opacity-60">🌤 서울 날씨</h3>
      {weather ? (
        <>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{weather.icon}</span>
            <div>
              <div className="font-mono text-3xl font-extrabold">{weather.temp}°C</div>
              <div className="text-sm opacity-70">{weather.condition}</div>
            </div>
          </div>
          <div className="flex gap-4 text-xs mt-2 opacity-50">
            <span>체감 {weather.feelsLike}°C</span>
            <span>습도 {weather.humidity}%</span>
          </div>
        </>
      ) : (
        <div className="h-20 flex items-center justify-center font-mono text-sm animate-pulse">로딩 중...</div>
      )}
    </NeoCard>
  );
}

function translateCondition(en: string): string {
  const map: Record<string, string> = {
    'Clear': '맑음', 'Sunny': '맑음', 'Partly cloudy': '구름 조금',
    'Cloudy': '흐림', 'Overcast': '흐림', 'Mist': '안개',
    'Rain': '비', 'Light rain': '약한 비', 'Heavy rain': '폭우',
    'Snow': '눈', 'Light snow': '약한 눈', 'Thunderstorm': '뇌우',
    'Fog': '안개', 'Drizzle': '이슬비', 'Patchy rain possible': '비 가능성',
  };
  return map[en] || en;
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
