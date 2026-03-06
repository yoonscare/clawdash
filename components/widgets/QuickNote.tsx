'use client';

import { useState, useEffect } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import NeoButton from '@/components/ui/NeoButton';

export default function QuickNote() {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('clawdash-note');
    if (stored) setNote(stored);
  }, []);

  const save = () => {
    localStorage.setItem('clawdash-note', note);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <NeoCard accent="bg-neo-pink">
      <h3 className="font-mono text-xs font-bold uppercase mb-2 opacity-60">Quick Note</h3>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Type a note..."
        className="w-full h-20 p-2 border-4 border-black dark:border-neo-yellow bg-transparent text-sm resize-none focus:outline-none focus:border-neo-pink"
      />
      <div className="flex items-center justify-between mt-2">
        <NeoButton variant="secondary" onClick={save}>Save</NeoButton>
        {saved && <span className="text-xs font-mono font-bold text-neo-cyan">Saved!</span>}
      </div>
    </NeoCard>
  );
}
