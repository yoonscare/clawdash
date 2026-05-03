'use client';

import { useState } from 'react';

interface CharacterAvatarProps {
  id: 'claw' | 'clawau' | 'clovi';
  size?: number;
}

const uploadedAvatarMap: Record<'claw' | 'clawau' | 'clovi', string> = {
  claw: '/characters/claw.png',
  clawau: '/characters/clawau.png',
  clovi: '/characters/clovi.png',
};

function ClawSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="40" cy="40" r="40" fill="#99F6E4" />
      {/* Body */}
      <ellipse cx="40" cy="54" rx="16" ry="14" fill="#2DD4BF" />
      {/* Belly */}
      <ellipse cx="40" cy="56" rx="10" ry="10" fill="#B2F5EA" />
      {/* Head */}
      <circle cx="40" cy="32" r="16" fill="#2DD4BF" />
      {/* Ears */}
      <circle cx="27" cy="22" r="5" fill="#2DD4BF" />
      <circle cx="53" cy="22" r="5" fill="#2DD4BF" />
      <circle cx="27" cy="22" r="3" fill="#99F6E4" />
      <circle cx="53" cy="22" r="3" fill="#99F6E4" />
      {/* Eyes */}
      <circle cx="34" cy="30" r="4" fill="#1A1A2E" />
      <circle cx="46" cy="30" r="4" fill="#1A1A2E" />
      {/* Eye shine */}
      <circle cx="35.5" cy="28.5" r="1.5" fill="white" />
      <circle cx="47.5" cy="28.5" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="40" cy="35" rx="2.5" ry="1.5" fill="#1A1A2E" />
      {/* Whiskers */}
      <line x1="22" y1="33" x2="32" y2="34" stroke="#78716C" strokeWidth="1" />
      <line x1="22" y1="36" x2="32" y2="36" stroke="#78716C" strokeWidth="1" />
      <line x1="48" y1="34" x2="58" y2="33" stroke="#78716C" strokeWidth="1" />
      <line x1="48" y1="36" x2="58" y2="36" stroke="#78716C" strokeWidth="1" />
      {/* Smile */}
      <path d="M36 38 Q40 42 44 38" stroke="#1A1A2E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ClawauSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="40" cy="40" r="40" fill="#FDE68A" />
      {/* Body */}
      <ellipse cx="40" cy="56" rx="17" ry="15" fill="#D97706" />
      {/* Belly */}
      <ellipse cx="40" cy="58" rx="11" ry="11" fill="#FDE68A" />
      {/* Head */}
      <circle cx="40" cy="32" r="17" fill="#D97706" />
      {/* Ears */}
      <circle cx="25" cy="19" r="7" fill="#D97706" />
      <circle cx="55" cy="19" r="7" fill="#D97706" />
      <circle cx="25" cy="19" r="4" fill="#FDE68A" />
      <circle cx="55" cy="19" r="4" fill="#FDE68A" />
      {/* Eyes */}
      <circle cx="33" cy="30" r="4" fill="#1A1A2E" />
      <circle cx="47" cy="30" r="4" fill="#1A1A2E" />
      {/* Eye shine */}
      <circle cx="34.5" cy="28.5" r="1.5" fill="white" />
      <circle cx="48.5" cy="28.5" r="1.5" fill="white" />
      {/* Glasses */}
      <circle cx="33" cy="30" r="6" stroke="#78716C" strokeWidth="1.5" fill="none" />
      <circle cx="47" cy="30" r="6" stroke="#78716C" strokeWidth="1.5" fill="none" />
      <line x1="39" y1="30" x2="41" y2="30" stroke="#78716C" strokeWidth="1.5" />
      {/* Nose */}
      <ellipse cx="40" cy="36" rx="3" ry="2" fill="#92400E" />
      {/* Rosy cheeks */}
      <circle cx="27" cy="36" r="4" fill="#FCA5A5" opacity="0.6" />
      <circle cx="53" cy="36" r="4" fill="#FCA5A5" opacity="0.6" />
      {/* Gentle smile */}
      <path d="M35 40 Q40 44 45 40" stroke="#1A1A2E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function CloviSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="40" cy="40" r="40" fill="#D4A574" />
      {/* Body */}
      <ellipse cx="40" cy="56" rx="16" ry="14" fill="#92400E" />
      {/* Belly */}
      <ellipse cx="40" cy="58" rx="10" ry="10" fill="#D97706" />
      {/* Flat tail */}
      <ellipse cx="18" cy="60" rx="8" ry="5" fill="#5C2D0E" />
      {/* Head */}
      <circle cx="40" cy="32" r="16" fill="#92400E" />
      {/* Ears */}
      <circle cx="27" cy="20" r="5" fill="#92400E" />
      <circle cx="53" cy="20" r="5" fill="#92400E" />
      <circle cx="27" cy="20" r="3" fill="#D97706" />
      <circle cx="53" cy="20" r="3" fill="#D97706" />
      {/* Hard hat */}
      <rect x="28" y="14" width="24" height="8" rx="2" fill="#FBBF24" />
      <rect x="32" y="11" width="16" height="5" rx="2" fill="#F59E0B" />
      {/* Eyes */}
      <circle cx="34" cy="30" r="4" fill="#1A1A2E" />
      <circle cx="46" cy="30" r="4" fill="#1A1A2E" />
      {/* Eye shine */}
      <circle cx="35.5" cy="28.5" r="1.5" fill="white" />
      <circle cx="47.5" cy="28.5" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="40" cy="35" rx="3" ry="2" fill="#5C2D0E" />
      {/* Buck teeth */}
      <rect x="37" y="38" width="3" height="5" rx="0.5" fill="white" />
      <rect x="40.5" y="38" width="3" height="5" rx="0.5" fill="white" />
      {/* Smile line behind teeth */}
      <path d="M36 38 Q40 37 44 38" stroke="#1A1A2E" strokeWidth="1" fill="none" />
    </svg>
  );
}

function FallbackAvatar({ id, size }: { id: 'claw' | 'clawau' | 'clovi'; size: number }) {
  switch (id) {
    case 'claw':
      return <ClawSVG size={size} />;
    case 'clawau':
      return <ClawauSVG size={size} />;
    case 'clovi':
      return <CloviSVG size={size} />;
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
