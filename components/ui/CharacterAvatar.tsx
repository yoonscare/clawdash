'use client';

import { useState } from 'react';

interface CharacterAvatarProps {
  id: 'claw' | 'clawau' | 'clovi';
  size?: number;
}

const uploadedAvatarMap: Record<'claw' | 'clawau' | 'clovi', string> = {
  claw: '/characters/claw.jpg',
  clawau: '/characters/clawau.jpg',
  clovi: '/characters/clovi.jpg',
};

function PlaceholderAvatar({
  size,
  label,
  bg,
}: {
  size: number;
  label: string;
  bg: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '9999px',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: 700,
        fontSize: Math.max(12, size * 0.26),
        letterSpacing: '-0.02em',
      }}
    >
      {label}
    </div>
  );
}

function FallbackAvatar({ id, size }: { id: 'claw' | 'clawau' | 'clovi'; size: number }) {
  switch (id) {
    case 'claw':
      return <PlaceholderAvatar size={size} label="클" bg="linear-gradient(135deg, #14b8a6, #0f766e)" />;
    case 'clawau':
      return <PlaceholderAvatar size={size} label="아" bg="linear-gradient(135deg, #f59e0b, #b45309)" />;
    case 'clovi':
      return <PlaceholderAvatar size={size} label="비" bg="linear-gradient(135deg, #f97316, #c2410c)" />;
  }
}

export default function CharacterAvatar({ id, size = 80 }: CharacterAvatarProps) {
  const [failed, setFailed] = useState(false);
  const uploadedSrc = uploadedAvatarMap[id];

  if (!failed) {
    return (
      <img
        src={uploadedSrc}
        alt={`${id} avatar`}
        width={size}
        height={size}
        style={{ width: size, height: size, borderRadius: '9999px', objectFit: 'cover' }}
        onError={() => setFailed(true)}
      />
    );
  }

  return <FallbackAvatar id={id} size={size} />;
}
