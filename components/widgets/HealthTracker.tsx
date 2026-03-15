'use client';

import { useState, useEffect } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import NeoButton from '@/components/ui/NeoButton';

interface BPRecord {
  date: string;
  time: string;
  systolic: number;
  diastolic: number;
  pulse: number;
}

interface WeeklyRoutine {
  label: string;
  emoji: string;
  targetPerWeek: number;
  done: boolean[];
}

const DEFAULT_ROUTINES: WeeklyRoutine[] = [
  { label: 'PT 받기', emoji: '🏋️', targetPerWeek: 2, done: [false, false, false, false, false, false, false] },
  { label: '혈압 측정', emoji: '💉', targetPerWeek: 7, done: [false, false, false, false, false, false, false] },
  { label: '걷기/유산소', emoji: '🚶', targetPerWeek: 3, done: [false, false, false, false, false, false, false] },
];

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

function getBPStatus(sys: number, dia: number): { label: string; color: string } {
  if (sys < 120 && dia < 80) return { label: '정상', color: 'text-green-500' };
  if (sys < 130 && dia < 85) return { label: '주의', color: 'text-yellow-500' };
  if (sys < 140 && dia < 90) return { label: '높은편', color: 'text-orange-500' };
  return { label: '고혈압', color: 'text-red-500' };
}

export default function HealthTracker() {
  const [bpRecords, setBpRecords] = useState<BPRecord[]>([]);
  const [routines, setRoutines] = useState<WeeklyRoutine[]>(DEFAULT_ROUTINES);
  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');
  const [pulse, setPulse] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const storedBP = localStorage.getItem('clawdash-bp');
    if (storedBP) setBpRecords(JSON.parse(storedBP));
    const storedRoutines = localStorage.getItem('clawdash-routines');
    if (storedRoutines) setRoutines(JSON.parse(storedRoutines));

    // 주 초기화: 월요일 기준으로 리셋
    const storedWeek = localStorage.getItem('clawdash-routines-week');
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const weekKey = monday.toISOString().slice(0, 10);
    if (storedWeek !== weekKey) {
      localStorage.setItem('clawdash-routines-week', weekKey);
      const reset = (storedRoutines ? JSON.parse(storedRoutines) : DEFAULT_ROUTINES).map((r: WeeklyRoutine) => ({
        ...r,
        done: [false, false, false, false, false, false, false],
      }));
      setRoutines(reset);
      localStorage.setItem('clawdash-routines', JSON.stringify(reset));
    }
  }, []);

  const addBP = () => {
    const s = parseInt(sys), d = parseInt(dia), p = parseInt(pulse) || 0;
    if (!s || !d) return;
    const now = new Date();
    const record: BPRecord = {
      date: now.toLocaleDateString('ko-KR'),
      time: now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      systolic: s, diastolic: d, pulse: p,
    };
    const updated = [record, ...bpRecords].slice(0, 14);
    setBpRecords(updated);
    localStorage.setItem('clawdash-bp', JSON.stringify(updated));
    setSys(''); setDia(''); setPulse(''); setShowInput(false);
  };

  const toggleRoutine = (ri: number, day: number) => {
    const updated = routines.map((r, i) => {
      if (i !== ri) return r;
      const newDone = [...r.done];
      newDone[day] = !newDone[day];
      return { ...r, done: newDone };
    });
    setRoutines(updated);
    localStorage.setItem('clawdash-routines', JSON.stringify(updated));
  };

  const latest = bpRecords[0];

  return (
    <NeoCard accent="bg-neo-red" span="sm">
      <h3 className="font-mono text-xs font-bold uppercase mb-3 opacity-60">❤️ 건강 관리</h3>

      <div className="space-y-4">
        {/* 주간 루틴 섹션 */}
        <div>
          <div className="font-mono text-xs font-bold mb-2">📅 주간 건강 루틴</div>
          <div className="space-y-2">
            {routines.map((r, ri) => {
              const doneCount = r.done.filter(Boolean).length;
              const achieved = doneCount >= r.targetPerWeek;
              return (
                <div key={ri} className="border-3 border-black dark:border-neo-yellow p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{r.emoji} {r.label}</span>
                    <span className={`font-mono text-xs font-bold ${achieved ? 'text-green-500' : 'opacity-50'}`}>
                      {doneCount}/{r.targetPerWeek}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {DAY_LABELS.map((day, di) => (
                      <button
                        key={di}
                        onClick={() => toggleRoutine(ri, di)}
                        className={`flex-1 py-0.5 border-2 border-black dark:border-neo-yellow text-[10px] font-mono font-bold transition-colors ${
                          r.done[di] ? 'bg-neo-cyan text-black' : 'opacity-40 hover:opacity-70'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 혈압 섹션 */}
        <div>
          <div className="font-mono text-xs font-bold mb-2">💉 혈압</div>
          
          {latest ? (
            <div className="border-4 border-black dark:border-neo-yellow p-3 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-2xl font-black">{latest.systolic}/{latest.diastolic}</span>
                  <span className="text-sm ml-1">mmHg</span>
                  {latest.pulse > 0 && <span className="text-xs ml-2 opacity-50">맥박 {latest.pulse}</span>}
                </div>
                <span className={`font-mono text-sm font-bold ${getBPStatus(latest.systolic, latest.diastolic).color}`}>
                  {getBPStatus(latest.systolic, latest.diastolic).label}
                </span>
              </div>
              <div className="text-xs opacity-40 mt-1">{latest.date} {latest.time}</div>
            </div>
          ) : (
            <div className="border-4 border-black dark:border-neo-yellow p-3 mb-2 text-sm opacity-50">
              아직 기록이 없어요. 측정해보자! 💪
            </div>
          )}

          {showInput ? (
            <div className="border-4 border-black dark:border-neo-yellow p-2 space-y-2">
              <div className="flex gap-2">
                <input value={sys} onChange={e => setSys(e.target.value)} placeholder="수축기" type="number"
                  className="w-1/3 p-1 border-3 border-black dark:border-neo-yellow bg-transparent text-sm text-center focus:outline-none" />
                <span className="font-bold self-center">/</span>
                <input value={dia} onChange={e => setDia(e.target.value)} placeholder="이완기" type="number"
                  className="w-1/3 p-1 border-3 border-black dark:border-neo-yellow bg-transparent text-sm text-center focus:outline-none" />
                <input value={pulse} onChange={e => setPulse(e.target.value)} placeholder="맥박" type="number"
                  className="w-1/4 p-1 border-3 border-black dark:border-neo-yellow bg-transparent text-sm text-center focus:outline-none" />
              </div>
              <div className="flex gap-2">
                <NeoButton variant="primary" onClick={addBP}>저장</NeoButton>
                <NeoButton variant="secondary" onClick={() => setShowInput(false)}>취소</NeoButton>
              </div>
            </div>
          ) : (
            <NeoButton variant="primary" onClick={() => setShowInput(true)}>+ 혈압 기록</NeoButton>
          )}

          {bpRecords.length > 1 && (
            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
              {bpRecords.slice(1, 7).map((r, i) => (
                <div key={i} className="flex justify-between text-xs font-mono border-2 border-black/20 dark:border-neo-yellow/20 p-1">
                  <span className="opacity-50">{r.date} {r.time}</span>
                  <span className="font-bold">{r.systolic}/{r.diastolic}</span>
                  <span className={getBPStatus(r.systolic, r.diastolic).color}>
                    {getBPStatus(r.systolic, r.diastolic).label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </NeoCard>
  );
}
