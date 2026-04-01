'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import NeoCard from '@/components/ui/NeoCard';
import NeoBadge from '@/components/ui/NeoBadge';

// ─── Types ──────────────────────────────────────────────

interface AgentData {
  id: string;
  name: string;
  emoji: string;
  status: 'online' | 'idle' | 'offline';
  lastActivity: string;
  currentTask: string;
  model: string;
  tokenUsage: number;
}

type CharacterState = 'working' | 'wandering' | 'sleeping' | 'meeting' | 'sitting';

interface Character {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  state: CharacterState;
  frame: number;
  direction: 'left' | 'right';
  bubbleText: string;
  bubbleTimer: number;
  bobOffset: number;
}

// ─── Constants ──────────────────────────────────────────

const CANVAS_W = 1200;
const CANVAS_H = 400;
const CHAR_W = 40;
const CHAR_H = 48;
const MOVE_SPEED = 1.5;

// Office layout coordinates - spread across the full canvas
const DESK_1 = { x: 100, y: 200 };   // 클로's desk
const DESK_2 = { x: 600, y: 200 };   // 클로아우's desk
const DESK_3 = { x: 850, y: 200 };   // 클로비's desk
const SOFA = { x: 350, y: 280 };
const MEETING = { x: 350, y: 120 };
const COFFEE = { x: 700, y: 100 };

const CLAW_BUBBLES = ['잠수 좀 타볼게', '배 위에 올려놨어', '물살이 좀 거칠었어', '수달파워!', '로그 분석 중...'];
const CLAWAU_BUBBLES = ['코드 리뷰 중...', '빌드 완료!', '버그 잡았다', '커밋 푸시 중...', '테스트 통과!'];
const CLOVI_BUBBLES = ['기둥부터 세울게', '물길 막힌 데부터 뚫자', '먼저 돌아가는 걸 만들게', '구조부터 잡아보자', '프로토타입 먼저!'];

const PROFILES = [
  {
    name: '클로',
    emoji: '🦦',
    role: '메인 비서 / 오케스트레이터',
    intro: '흐름을 읽고 도구를 골라 일을 굴리는 수달 비서',
    keywords: ['차분함', '유연함', '실용적'],
    bg: 'bg-teal-100/60 dark:bg-teal-900/30',
  },
  {
    name: '클로아우',
    emoji: '🐾',
    role: '간호교육 전문 브레인 / 문서 감수',
    intro: '기준과 맥락을 지키며 문서와 내용을 단단하게 만드는 곰 브레인',
    keywords: ['든든함', '성실함', '꼼꼼함'],
    bg: 'bg-amber-100/60 dark:bg-amber-900/30',
  },
  {
    name: '클로비',
    emoji: '🦫',
    role: '빌더 / 시스템 메이커',
    intro: '구조를 짓고 자동화를 엮고 결과물이 남게 만드는 비버 빌더',
    keywords: ['뚝심', '제작자기질', '공학적사고'],
    bg: 'bg-orange-100/60 dark:bg-orange-900/30',
  },
];

// ─── Pixel Art Drawing ──────────────────────────────────

function drawOtter(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, dir: 'left' | 'right', bob: number) {
  const flip = dir === 'left' ? -1 : 1;
  ctx.save();
  ctx.translate(x + CHAR_W / 2, y + Math.sin(bob) * 2.5);
  ctx.scale(flip, 1);

  // Body (teal)
  ctx.fillStyle = '#2DD4BF';
  ctx.fillRect(-14, 4, 28, 28);

  // Belly (light)
  ctx.fillStyle = '#99F6E4';
  ctx.fillRect(-8, 8, 16, 20);

  // Head
  ctx.fillStyle = '#2DD4BF';
  ctx.fillRect(-16, -16, 32, 24);

  // Ears
  ctx.fillRect(-18, -16, 6, 8);
  ctx.fillRect(12, -16, 6, 8);

  // Inner ears
  ctx.fillStyle = '#99F6E4';
  ctx.fillRect(-16, -14, 2, 4);
  ctx.fillRect(14, -14, 2, 4);

  // Eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(-10, -8, 6, 6);
  ctx.fillRect(4, -8, 6, 6);

  // Eye shine
  ctx.fillStyle = '#FFF';
  ctx.fillRect(-8, -8, 2, 2);
  ctx.fillRect(6, -8, 2, 2);

  // Nose
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(-2, -2, 4, 2);

  // Whiskers
  ctx.fillStyle = '#666';
  ctx.fillRect(-16, -4, 6, 2);
  ctx.fillRect(10, -4, 6, 2);

  // Tail (flat, otter-style)
  ctx.fillStyle = '#14B8A6';
  ctx.fillRect(-22, 16, 8, 6);
  ctx.fillRect(-26, 18, 6, 4);

  // Feet - animate on walk
  const legOffset = Math.sin(frame * 0.3) * 4;
  ctx.fillStyle = '#14B8A6';
  ctx.fillRect(-10, 32 + (frame % 2 === 0 ? legOffset : 0), 8, 6);
  ctx.fillRect(2, 32 + (frame % 2 === 0 ? 0 : legOffset), 8, 6);

  ctx.restore();
}

function drawBear(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, dir: 'left' | 'right', bob: number) {
  const flip = dir === 'left' ? -1 : 1;
  ctx.save();
  ctx.translate(x + CHAR_W / 2, y + Math.sin(bob) * 2.5);
  ctx.scale(flip, 1);

  // Body (brown/orange)
  ctx.fillStyle = '#D97706';
  ctx.fillRect(-16, 4, 32, 32);

  // Belly (cream)
  ctx.fillStyle = '#FDE68A';
  ctx.fillRect(-10, 8, 20, 24);

  // Head
  ctx.fillStyle = '#D97706';
  ctx.fillRect(-18, -20, 36, 28);

  // Round ears
  ctx.fillRect(-22, -24, 10, 10);
  ctx.fillRect(12, -24, 10, 10);

  // Inner ears
  ctx.fillStyle = '#FDE68A';
  ctx.fillRect(-20, -22, 6, 6);
  ctx.fillRect(14, -22, 6, 6);

  // Eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(-10, -10, 6, 6);
  ctx.fillRect(4, -10, 6, 6);

  // Eye shine
  ctx.fillStyle = '#FFF';
  ctx.fillRect(-8, -10, 2, 2);
  ctx.fillRect(6, -10, 2, 2);

  // Nose
  ctx.fillStyle = '#92400E';
  ctx.fillRect(-4, -4, 8, 4);

  // Mouth
  ctx.fillStyle = '#000';
  ctx.fillRect(-2, 0, 4, 2);

  // Stubby arms
  ctx.fillStyle = '#B45309';
  ctx.fillRect(-22, 8, 6, 16);
  ctx.fillRect(16, 8, 6, 16);

  // Feet
  const legOffset = Math.sin(frame * 0.3) * 4;
  ctx.fillStyle = '#92400E';
  ctx.fillRect(-12, 36 + (frame % 2 === 0 ? legOffset : 0), 10, 6);
  ctx.fillRect(2, 36 + (frame % 2 === 0 ? 0 : legOffset), 10, 6);

  ctx.restore();
}

function drawBeaver(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, dir: 'left' | 'right', bob: number) {
  const flip = dir === 'left' ? -1 : 1;
  ctx.save();
  ctx.translate(x + CHAR_W / 2, y + Math.sin(bob) * 2.5);
  ctx.scale(flip, 1);

  // Body (warm brown)
  ctx.fillStyle = '#92400E';
  ctx.fillRect(-14, 4, 28, 30);

  // Belly (lighter tan)
  ctx.fillStyle = '#D97706';
  ctx.fillRect(-8, 8, 16, 22);

  // Head
  ctx.fillStyle = '#92400E';
  ctx.fillRect(-16, -16, 32, 24);

  // Round ears (small)
  ctx.fillRect(-18, -16, 8, 8);
  ctx.fillRect(10, -16, 8, 8);

  // Inner ears
  ctx.fillStyle = '#D97706';
  ctx.fillRect(-16, -14, 4, 4);
  ctx.fillRect(12, -14, 4, 4);

  // Eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(-10, -8, 6, 6);
  ctx.fillRect(4, -8, 6, 6);

  // Eye shine
  ctx.fillStyle = '#FFF';
  ctx.fillRect(-8, -8, 2, 2);
  ctx.fillRect(6, -8, 2, 2);

  // Nose (big round beaver nose)
  ctx.fillStyle = '#5C2D0E';
  ctx.fillRect(-3, -2, 6, 4);

  // Buck teeth!
  ctx.fillStyle = '#FFF';
  ctx.fillRect(-3, 2, 3, 5);
  ctx.fillRect(0, 2, 3, 5);
  ctx.fillStyle = '#E5E7EB';
  ctx.fillRect(-3, 5, 6, 1);

  // Flat wide tail (beaver signature)
  ctx.fillStyle = '#5C2D0E';
  ctx.fillRect(-24, 20, 10, 14);
  ctx.fillRect(-30, 24, 8, 8);
  ctx.fillStyle = '#78350F';
  ctx.fillRect(-28, 26, 6, 4);

  // Feet - animate on walk
  const legOffset = Math.sin(frame * 0.3) * 4;
  ctx.fillStyle = '#78350F';
  ctx.fillRect(-10, 34 + (frame % 2 === 0 ? legOffset : 0), 8, 6);
  ctx.fillRect(2, 34 + (frame % 2 === 0 ? 0 : legOffset), 8, 6);

  ctx.restore();
}

function drawBubble(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
  ctx.save();
  ctx.font = '13px "Noto Sans KR", sans-serif';
  const metrics = ctx.measureText(text);
  const bw = metrics.width + 16;
  const bh = 24;
  const bx = x - bw / 2;
  const by = y - 30;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(bx + 2, by + 2, bw, bh);

  // Bubble bg
  ctx.fillStyle = '#FFF';
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);

  // Tail
  ctx.fillStyle = '#FFF';
  ctx.fillRect(x - 3, by + bh, 6, 6);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 4, by + bh);
  ctx.lineTo(x, by + bh + 7);
  ctx.lineTo(x + 4, by + bh);
  ctx.stroke();

  // Text
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, by + 17);

  ctx.restore();
}

// ─── Office Drawing ─────────────────────────────────────

function drawOffice(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // ── Background fill ──
  ctx.fillStyle = '#1A1510';
  ctx.fillRect(0, 0, w, h);

  // ── Wooden floor planks ──
  for (let ty = 80; ty < h; ty += 20) {
    const isEvenRow = ((ty - 80) / 20) % 2 === 0;
    for (let tx = isEvenRow ? 0 : -50; tx < w + 50; tx += 100) {
      ctx.fillStyle = (tx + ty) % 40 === 0 ? '#8B6914' : '#7A5C12';
      ctx.fillRect(tx, ty, 96, 16);
      ctx.fillStyle = '#5C4510';
      ctx.fillRect(tx, ty + 16, 96, 4);
      ctx.fillRect(tx + 96, ty, 4, 20);
    }
    if (ty % 40 === 0) {
      ctx.fillStyle = 'rgba(139,105,20,0.15)';
      ctx.fillRect(0, ty + 6, w, 2);
    }
  }

  // ── Warm walls (top section) ──
  ctx.fillStyle = '#D4C5A0';
  ctx.fillRect(0, 0, w, 80);
  for (let tx = 0; tx < w; tx += 12) {
    ctx.fillStyle = tx % 24 === 0 ? 'rgba(190,170,130,0.3)' : 'rgba(220,200,160,0.2)';
    ctx.fillRect(tx, 0, 12, 80);
  }

  // Wall baseboard
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(0, 74, w, 6);
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(0, 77, w, 3);

  // ── Window 1 (left) ──
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(60, 8, 100, 60);
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(63, 11, 94, 54);
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(66, 14, 88, 48);
  ctx.fillStyle = '#FFF8DC';
  ctx.fillRect(66, 14, 88, 16);
  ctx.fillStyle = '#FFEEBB';
  ctx.fillRect(66, 30, 88, 10);
  // Sun
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(90, 18, 16, 16);
  ctx.fillStyle = '#FFF8DC';
  ctx.fillRect(94, 22, 8, 8);
  // Clouds
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(72, 24, 12, 6);
  ctx.fillRect(69, 27, 18, 5);
  ctx.fillRect(120, 22, 16, 6);
  ctx.fillRect(117, 25, 22, 5);
  // Cross divider
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(108, 14, 4, 48);
  ctx.fillRect(66, 36, 88, 4);
  // Sunlight rays
  ctx.fillStyle = 'rgba(255,248,220,0.08)';
  ctx.fillRect(50, 80, 120, 160);
  ctx.fillStyle = 'rgba(255,248,220,0.05)';
  ctx.fillRect(70, 80, 80, 240);

  // ── Window 2 (center) ──
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(380, 8, 90, 60);
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(383, 11, 84, 54);
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(386, 14, 78, 48);
  ctx.fillStyle = '#FFF8DC';
  ctx.fillRect(386, 14, 78, 14);
  ctx.fillStyle = '#FFEEBB';
  ctx.fillRect(386, 28, 78, 8);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(400, 22, 16, 6);
  ctx.fillRect(397, 25, 22, 5);
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(423, 14, 4, 48);
  ctx.fillRect(386, 36, 78, 4);
  ctx.fillStyle = 'rgba(255,248,220,0.06)';
  ctx.fillRect(370, 80, 110, 140);

  // ── Window 3 (right) ──
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(720, 8, 90, 60);
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(723, 11, 84, 54);
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(726, 14, 78, 48);
  ctx.fillStyle = '#FFF8DC';
  ctx.fillRect(726, 14, 78, 14);
  ctx.fillStyle = '#FFEEBB';
  ctx.fillRect(726, 28, 78, 8);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(740, 20, 14, 6);
  ctx.fillRect(737, 23, 20, 5);
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(763, 14, 4, 48);
  ctx.fillRect(726, 36, 78, 4);
  ctx.fillStyle = 'rgba(255,248,220,0.06)';
  ctx.fillRect(710, 80, 110, 140);

  // ── Room dividers (wooden, spanning more height) ──
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(250, 80, 6, 200);
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(252, 80, 3, 200);
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(530, 80, 6, 200);
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(532, 80, 3, 200);
  // 3rd divider
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(780, 80, 6, 200);
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(782, 80, 3, 200);

  // ── Room labels (centered in rooms) ──
  ctx.font = 'bold 13px "Noto Sans KR", "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  // Claw's room
  ctx.fillStyle = '#2DD4BF';
  ctx.fillRect(75, 84, 120, 18);
  ctx.fillStyle = '#1A1510';
  ctx.fillText('클로의 방', 135, 97);
  // Lounge
  ctx.fillStyle = '#C084FC';
  ctx.fillRect(330, 84, 120, 18);
  ctx.fillStyle = '#1A1510';
  ctx.fillText('휴게실', 390, 97);
  // Clawau's room
  ctx.fillStyle = '#FB923C';
  ctx.fillRect(600, 84, 140, 18);
  ctx.fillStyle = '#1A1510';
  ctx.fillText('클로아우의 방', 670, 97);
  // Clovi's room
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(840, 84, 150, 18);
  ctx.fillStyle = '#1A1510';
  ctx.fillText('클로비의 작업실', 915, 97);

  // ── Clock on wall ──
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(275, 12, 4, 10);
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(264, 22, 30, 30);
  ctx.fillStyle = '#FFF8DC';
  ctx.fillRect(267, 25, 24, 24);
  ctx.fillStyle = '#1A1510';
  ctx.fillRect(278, 28, 3, 10);
  ctx.fillRect(278, 33, 8, 2);
  ctx.fillRect(278, 36, 3, 3);

  // ── Framed pictures on wall ──
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(500, 14, 36, 30);
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(503, 17, 30, 24);
  ctx.fillStyle = '#228B22';
  ctx.fillRect(503, 30, 30, 11);
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(512, 20, 10, 10);
  // Picture 2
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(545, 18, 30, 26);
  ctx.fillStyle = '#FF6B6B';
  ctx.fillRect(548, 21, 24, 20);
  ctx.fillStyle = '#4ECDC4';
  ctx.fillRect(551, 24, 8, 8);
  ctx.fillStyle = '#FFE66D';
  ctx.fillRect(563, 28, 5, 10);

  // ── 클로's desk (left room) ──
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(60, 200, 100, 36);
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(63, 201, 94, 5);
  // Desk legs
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(60, 236, 7, 20);
  ctx.fillRect(153, 236, 7, 20);
  // Shadow under desk
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(63, 256, 94, 5);
  // Monitor
  ctx.fillStyle = '#2A2520';
  ctx.fillRect(82, 165, 56, 38);
  ctx.fillStyle = '#4ECDC4';
  ctx.fillRect(86, 169, 48, 30);
  // Screen glow pixels
  ctx.fillStyle = '#6EE7B7';
  ctx.fillRect(90, 174, 16, 4);
  ctx.fillRect(90, 182, 28, 4);
  ctx.fillRect(90, 190, 20, 4);
  // Monitor stand
  ctx.fillStyle = '#2A2520';
  ctx.fillRect(104, 201, 12, 5);
  // Desk lamp
  ctx.fillStyle = '#2A2520';
  ctx.fillRect(66, 188, 4, 14);
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(60, 182, 16, 8);
  ctx.fillStyle = 'rgba(255,248,180,0.15)';
  ctx.fillRect(50, 176, 36, 32);
  // Mug on desk
  ctx.fillStyle = '#2DD4BF';
  ctx.fillRect(144, 203, 10, 8);
  ctx.fillStyle = '#99F6E4';
  ctx.fillRect(146, 205, 6, 4);
  // Chair
  ctx.fillStyle = '#4ECDC4';
  ctx.fillRect(90, 248, 40, 20);
  ctx.fillStyle = '#2DD4BF';
  ctx.fillRect(96, 234, 28, 18);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(92, 268, 36, 3);

  // ── Bookshelf in Claw's room ──
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(10, 110, 60, 120);
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(14, 114, 52, 112);
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(14, 146, 52, 3);
  ctx.fillRect(14, 180, 52, 3);
  ctx.fillRect(14, 214, 52, 3);
  // Books (row 1)
  ctx.fillStyle = '#EF4444'; ctx.fillRect(18, 118, 7, 26);
  ctx.fillStyle = '#3B82F6'; ctx.fillRect(27, 122, 5, 22);
  ctx.fillStyle = '#22C55E'; ctx.fillRect(34, 116, 7, 28);
  ctx.fillStyle = '#F59E0B'; ctx.fillRect(43, 120, 5, 24);
  ctx.fillStyle = '#8B5CF6'; ctx.fillRect(50, 118, 8, 26);
  // Books (row 2)
  ctx.fillStyle = '#06B6D4'; ctx.fillRect(18, 150, 8, 28);
  ctx.fillStyle = '#D97706'; ctx.fillRect(28, 152, 5, 26);
  ctx.fillStyle = '#7C3AED'; ctx.fillRect(35, 148, 7, 30);
  ctx.fillStyle = '#10B981'; ctx.fillRect(44, 154, 5, 24);
  ctx.fillStyle = '#F43F5E'; ctx.fillRect(51, 150, 7, 28);
  // Books (row 3) + small plant
  ctx.fillStyle = '#2563EB'; ctx.fillRect(18, 184, 5, 28);
  ctx.fillStyle = '#DC2626'; ctx.fillRect(25, 186, 7, 26);
  ctx.fillStyle = '#059669'; ctx.fillRect(34, 182, 8, 30);
  // Small plant on shelf
  ctx.fillStyle = '#92400E'; ctx.fillRect(48, 200, 14, 12);
  ctx.fillStyle = '#22C55E'; ctx.fillRect(50, 190, 5, 14);
  ctx.fillStyle = '#16A34A'; ctx.fillRect(57, 186, 7, 18);

  // ── 클로아우's desk (right room) ──
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(570, 200, 100, 36);
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(573, 201, 94, 5);
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(570, 236, 7, 20);
  ctx.fillRect(663, 236, 7, 20);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(573, 256, 94, 5);
  // Monitor
  ctx.fillStyle = '#2A2520';
  ctx.fillRect(592, 165, 56, 38);
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(596, 169, 48, 30);
  ctx.fillStyle = '#FDE68A';
  ctx.fillRect(600, 174, 24, 4);
  ctx.fillRect(600, 182, 16, 4);
  ctx.fillRect(600, 190, 32, 4);
  ctx.fillStyle = '#2A2520';
  ctx.fillRect(614, 201, 12, 5);
  // Desk lamp
  ctx.fillStyle = '#2A2520';
  ctx.fillRect(660, 188, 4, 14);
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(654, 182, 16, 8);
  ctx.fillStyle = 'rgba(255,248,180,0.15)';
  ctx.fillRect(644, 176, 36, 32);
  // Snack
  ctx.fillStyle = '#FDE68A';
  ctx.fillRect(576, 204, 8, 6);
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(578, 206, 4, 3);
  // Chair
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(600, 248, 40, 20);
  ctx.fillStyle = '#D97706';
  ctx.fillRect(606, 234, 28, 18);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(602, 268, 36, 3);

  // ── Bookshelf in Clawau's room ──
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(800, 110, 56, 100);
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(804, 114, 48, 92);
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(804, 146, 48, 3);
  ctx.fillRect(804, 180, 48, 3);
  // Books
  ctx.fillStyle = '#F97316'; ctx.fillRect(808, 118, 7, 26);
  ctx.fillStyle = '#6366F1'; ctx.fillRect(817, 120, 5, 24);
  ctx.fillStyle = '#14B8A6'; ctx.fillRect(824, 116, 8, 28);
  ctx.fillStyle = '#E11D48'; ctx.fillRect(834, 120, 5, 24);
  ctx.fillStyle = '#8B5CF6'; ctx.fillRect(841, 118, 7, 26);
  // Books row 2
  ctx.fillStyle = '#0EA5E9'; ctx.fillRect(808, 150, 5, 28);
  ctx.fillStyle = '#EAB308'; ctx.fillRect(815, 152, 7, 26);
  ctx.fillStyle = '#22C55E'; ctx.fillRect(824, 148, 8, 30);
  ctx.fillStyle = '#F43F5E'; ctx.fillRect(834, 152, 5, 26);
  ctx.fillStyle = '#7C3AED'; ctx.fillRect(841, 150, 7, 28);

  // ── Window 4 (클로비's room) ──
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(960, 8, 90, 60);
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(963, 11, 84, 54);
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(966, 14, 78, 48);
  ctx.fillStyle = '#FFF8DC';
  ctx.fillRect(966, 14, 78, 14);
  ctx.fillStyle = '#FFEEBB';
  ctx.fillRect(966, 28, 78, 8);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(980, 22, 14, 6);
  ctx.fillRect(977, 25, 20, 5);
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(1003, 14, 4, 48);
  ctx.fillRect(966, 36, 78, 4);
  ctx.fillStyle = 'rgba(255,248,220,0.06)';
  ctx.fillRect(950, 80, 110, 140);

  // ── 클로비's desk (right-most room) ──
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(810, 200, 100, 36);
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(813, 201, 94, 5);
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(810, 236, 7, 20);
  ctx.fillRect(903, 236, 7, 20);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(813, 256, 94, 5);
  // Monitor
  ctx.fillStyle = '#2A2520';
  ctx.fillRect(832, 165, 56, 38);
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(836, 169, 48, 30);
  ctx.fillStyle = '#FDE68A';
  ctx.fillRect(840, 174, 20, 4);
  ctx.fillRect(840, 182, 32, 4);
  ctx.fillRect(840, 190, 14, 4);
  ctx.fillStyle = '#2A2520';
  ctx.fillRect(854, 201, 12, 5);
  // Desk lamp
  ctx.fillStyle = '#2A2520';
  ctx.fillRect(900, 188, 4, 14);
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(894, 182, 16, 8);
  ctx.fillStyle = 'rgba(255,248,180,0.15)';
  ctx.fillRect(884, 176, 36, 32);
  // Toolbox on desk
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(816, 203, 12, 8);
  ctx.fillStyle = '#DC2626';
  ctx.fillRect(818, 205, 8, 4);
  // Chair
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(840, 248, 40, 20);
  ctx.fillStyle = '#D97706';
  ctx.fillRect(846, 234, 28, 18);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(842, 268, 36, 3);

  // ── Workbench in Clovi's room ──
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(1050, 110, 56, 100);
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(1054, 114, 48, 92);
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(1054, 146, 48, 3);
  ctx.fillRect(1054, 180, 48, 3);
  // Tools on shelf
  ctx.fillStyle = '#6B7280'; ctx.fillRect(1058, 118, 7, 26);
  ctx.fillStyle = '#EF4444'; ctx.fillRect(1067, 120, 5, 24);
  ctx.fillStyle = '#3B82F6'; ctx.fillRect(1074, 116, 8, 28);
  ctx.fillStyle = '#F59E0B'; ctx.fillRect(1084, 120, 5, 24);
  ctx.fillStyle = '#10B981'; ctx.fillRect(1091, 118, 7, 26);
  // Row 2
  ctx.fillStyle = '#8B5CF6'; ctx.fillRect(1058, 150, 5, 28);
  ctx.fillStyle = '#EC4899'; ctx.fillRect(1065, 152, 7, 26);
  ctx.fillStyle = '#14B8A6'; ctx.fillRect(1074, 148, 8, 30);
  ctx.fillStyle = '#F97316'; ctx.fillRect(1084, 152, 5, 26);
  ctx.fillStyle = '#06B6D4'; ctx.fillRect(1091, 150, 7, 28);

  // ── Plant in Clovi's room ──
  ctx.fillStyle = '#B45309';
  ctx.fillRect(1100, 310, 28, 28);
  ctx.fillStyle = '#D97706';
  ctx.fillRect(1096, 306, 36, 6);
  ctx.fillStyle = '#16A34A';
  ctx.fillRect(1096, 280, 12, 30);
  ctx.fillStyle = '#22C55E';
  ctx.fillRect(1112, 274, 12, 36);
  ctx.fillStyle = '#15803D';
  ctx.fillRect(1104, 270, 10, 18);

  // ── Lounge area (center) ──
  // Warm rug/carpet
  ctx.fillStyle = '#C2185B';
  ctx.fillRect(290, 260, 160, 100);
  ctx.fillStyle = '#AD1457';
  ctx.fillRect(294, 264, 152, 92);
  ctx.fillStyle = '#E91E63';
  ctx.fillRect(304, 274, 132, 3);
  ctx.fillRect(304, 346, 132, 3);
  ctx.fillRect(304, 274, 3, 75);
  ctx.fillRect(433, 274, 3, 75);
  ctx.fillStyle = '#F48FB1';
  ctx.fillRect(350, 306, 8, 8);
  ctx.fillRect(386, 306, 8, 8);
  ctx.fillRect(368, 296, 8, 8);
  ctx.fillRect(368, 316, 8, 8);

  // Sofa (warm purple with cushions)
  ctx.fillStyle = '#7E22CE';
  ctx.fillRect(310, 280, 120, 36);
  ctx.fillStyle = '#9333EA';
  ctx.fillRect(316, 268, 108, 16);
  // Sofa arms
  ctx.fillRect(302, 268, 14, 48);
  ctx.fillRect(424, 268, 14, 48);
  // Cushions
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(320, 272, 20, 12);
  ctx.fillStyle = '#2DD4BF';
  ctx.fillRect(400, 272, 20, 12);
  ctx.fillStyle = '#EC4899';
  ctx.fillRect(360, 274, 16, 10);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(306, 316, 132, 5);

  // Coffee table
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(340, 330, 60, 20);
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(343, 331, 54, 4);
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(346, 350, 7, 10);
  ctx.fillRect(386, 350, 7, 10);
  ctx.fillStyle = '#FFF';
  ctx.fillRect(356, 332, 10, 8);
  ctx.fillStyle = '#92400E';
  ctx.fillRect(358, 334, 6, 4);
  ctx.fillStyle = '#E5E7EB';
  ctx.fillRect(372, 333, 14, 6);
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(374, 335, 4, 3);
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(380, 335, 4, 3);

  // ── Coffee machine (top-right area) ──
  ctx.fillStyle = '#5C4033';
  ctx.fillRect(685, 85, 44, 54);
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(689, 89, 36, 20);
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(693, 93, 28, 12);
  ctx.fillStyle = '#4ADE80';
  ctx.fillRect(693, 117, 5, 5);
  ctx.fillStyle = '#FFF';
  ctx.fillRect(702, 123, 14, 10);
  ctx.fillStyle = '#92400E';
  ctx.fillRect(704, 125, 10, 6);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(706, 115, 3, 5);
  ctx.fillRect(712, 111, 3, 7);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(708, 107, 3, 5);

  // ── Meeting table (center room, upper area) ──
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(330, 120, 60, 44);
  ctx.fillStyle = '#DEB887';
  ctx.fillRect(333, 122, 54, 5);
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(336, 164, 5, 10);
  ctx.fillRect(379, 164, 5, 10);

  // ── Whiteboard ──
  ctx.fillStyle = '#D4C5A0';
  ctx.fillRect(340, 80, 60, 3);
  ctx.fillStyle = '#F5F5F4';
  ctx.fillRect(320, 16, 70, 48);
  ctx.fillStyle = '#E7E5E4';
  ctx.fillRect(324, 20, 62, 40);
  // Sticky notes
  ctx.fillStyle = '#FDE68A'; ctx.fillRect(327, 23, 14, 12);
  ctx.fillStyle = '#FBCFE8'; ctx.fillRect(345, 23, 14, 12);
  ctx.fillStyle = '#A7F3D0'; ctx.fillRect(363, 23, 14, 12);
  ctx.fillStyle = '#BAE6FD'; ctx.fillRect(327, 40, 14, 12);
  ctx.fillStyle = '#FED7AA'; ctx.fillRect(345, 40, 14, 12);
  ctx.fillStyle = '#DDD6FE'; ctx.fillRect(363, 40, 14, 12);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(329, 27, 10, 2);
  ctx.fillRect(347, 27, 10, 2);
  ctx.fillRect(365, 27, 10, 2);
  ctx.fillRect(329, 44, 10, 2);
  ctx.fillRect(347, 44, 10, 2);
  ctx.fillRect(365, 44, 10, 2);

  // ── Big potted plant (left corner) ──
  ctx.fillStyle = '#B45309';
  ctx.fillRect(5, 330, 32, 32);
  ctx.fillStyle = '#D97706';
  ctx.fillRect(1, 326, 40, 6);
  ctx.fillStyle = '#5C4033';
  ctx.fillRect(8, 326, 24, 5);
  ctx.fillStyle = '#16A34A';
  ctx.fillRect(5, 294, 14, 36);
  ctx.fillRect(22, 288, 14, 42);
  ctx.fillRect(12, 280, 16, 22);
  ctx.fillStyle = '#22C55E';
  ctx.fillRect(8, 302, 10, 16);
  ctx.fillRect(26, 296, 10, 22);
  ctx.fillRect(14, 284, 10, 16);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(5, 362, 32, 4);

  // ── Small plant (right of lounge) ──
  ctx.fillStyle = '#B45309';
  ctx.fillRect(470, 320, 18, 20);
  ctx.fillStyle = '#D97706';
  ctx.fillRect(466, 316, 26, 5);
  ctx.fillStyle = '#16A34A';
  ctx.fillRect(466, 298, 10, 20);
  ctx.fillStyle = '#22C55E';
  ctx.fillRect(478, 294, 10, 24);
  ctx.fillStyle = '#15803D';
  ctx.fillRect(472, 290, 7, 14);

  // ── Another plant (right room) ──
  ctx.fillStyle = '#B45309';
  ctx.fillRect(860, 310, 28, 28);
  ctx.fillStyle = '#D97706';
  ctx.fillRect(856, 306, 36, 6);
  ctx.fillStyle = '#16A34A';
  ctx.fillRect(856, 280, 12, 30);
  ctx.fillStyle = '#22C55E';
  ctx.fillRect(872, 274, 12, 36);
  ctx.fillStyle = '#15803D';
  ctx.fillRect(864, 270, 10, 18);

  // ── Warm ambient glow overlay ──
  ctx.fillStyle = 'rgba(255,235,180,0.03)';
  ctx.fillRect(0, 0, w, h);
}

// ─── Sleeping effect ────────────────────────────────────

function drawZzz(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  ctx.save();
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#A1A1AA';
  const off = Math.sin(frame * 0.08) * 5;
  ctx.globalAlpha = 0.6 + Math.sin(frame * 0.05) * 0.3;
  ctx.fillText('z', x + 20, y - 16 + off);
  ctx.fillText('z', x + 30, y - 30 + off * 0.7);
  ctx.fillText('Z', x + 40, y - 44 + off * 0.5);
  ctx.restore();
}

// ─── Component ──────────────────────────────────────────

export default function AgentOffice() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef<number>(0);
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [meeting, setMeeting] = useState(false);
  const charsRef = useRef<Character[]>([
    {
      id: 'claw',
      x: DESK_1.x, y: DESK_1.y,
      targetX: DESK_1.x, targetY: DESK_1.y,
      state: 'working',
      frame: 0, direction: 'right',
      bubbleText: '', bubbleTimer: 0, bobOffset: 0,
    },
    {
      id: 'clawau',
      x: DESK_2.x, y: DESK_2.y,
      targetX: DESK_2.x, targetY: DESK_2.y,
      state: 'working',
      frame: 0, direction: 'left',
      bubbleText: '', bubbleTimer: 0, bobOffset: Math.PI,
    },
    {
      id: 'clovi',
      x: DESK_3.x, y: DESK_3.y,
      targetX: DESK_3.x, targetY: DESK_3.y,
      state: 'working',
      frame: 0, direction: 'left',
      bubbleText: '', bubbleTimer: 0, bobOffset: Math.PI / 2,
    },
  ]);

  // Fetch agent data
  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/agent-office');
      if (!res.ok) return;
      const data = await res.json();
      setAgents(data.agents);

      // Update character states based on real data
      const chars = charsRef.current;
      data.agents.forEach((agent: AgentData, i: number) => {
        if (!chars[i]) return;
        if (meeting) return; // Don't override meeting state

        if (agent.status === 'online') {
          chars[i].state = 'working';
          const desk = i === 0 ? DESK_1 : i === 1 ? DESK_2 : DESK_3;
          chars[i].targetX = desk.x;
          chars[i].targetY = desk.y;
        } else if (agent.status === 'idle') {
          if (chars[i].state !== 'wandering' && chars[i].state !== 'sitting') {
            const doSit = Math.random() > 0.5;
            if (doSit) {
              chars[i].state = 'sitting';
              chars[i].targetX = SOFA.x + i * 40;
              chars[i].targetY = SOFA.y - 20;
            } else {
              chars[i].state = 'wandering';
              pickRandomTarget(chars[i]);
            }
          }
        } else {
          chars[i].state = 'sleeping';
          const desk = i === 0 ? DESK_1 : i === 1 ? DESK_2 : DESK_3;
          chars[i].targetX = desk.x;
          chars[i].targetY = desk.y;
        }
      });
    } catch {
      // Silently handle fetch errors
    }
  }, [meeting]);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 10000);
    return () => clearInterval(interval);
  }, [fetchAgents]);

  // Meeting mode
  useEffect(() => {
    if (!meeting) return;
    const chars = charsRef.current;
    chars[0].state = 'meeting';
    chars[0].targetX = MEETING.x - 40;
    chars[0].targetY = MEETING.y;
    chars[1].state = 'meeting';
    chars[1].targetX = MEETING.x + 40;
    chars[1].targetY = MEETING.y;
    chars[2].state = 'meeting';
    chars[2].targetX = MEETING.x;
    chars[2].targetY = MEETING.y + 30;

    const timer = setTimeout(() => setMeeting(false), 8000);
    return () => clearTimeout(timer);
  }, [meeting]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      frameRef.current++;
      const frame = frameRef.current;
      const chars = charsRef.current;

      // Update characters
      chars.forEach((char, i) => {
        char.bobOffset += 0.06;
        char.frame = frame;

        // Move toward target
        const dx = char.targetX - char.x;
        const dy = char.targetY - char.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 2) {
          char.x += (dx / dist) * MOVE_SPEED;
          char.y += (dy / dist) * MOVE_SPEED;
          char.direction = dx > 0 ? 'right' : 'left';
        } else if (char.state === 'wandering' && frame % 180 === 0) {
          pickRandomTarget(char);
        }

        // Random speech bubbles
        if (char.bubbleTimer > 0) {
          char.bubbleTimer--;
        } else if (Math.random() < 0.003 && char.state !== 'sleeping') {
          const bubbles = i === 0 ? CLAW_BUBBLES : i === 1 ? CLAWAU_BUBBLES : CLOVI_BUBBLES;
          char.bubbleText = bubbles[Math.floor(Math.random() * bubbles.length)];
          char.bubbleTimer = 150;
        }
      });

      // Draw
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      drawOffice(ctx, CANVAS_W, CANVAS_H);

      // Draw characters
      chars.forEach((char, i) => {
        if (i === 0) {
          drawOtter(ctx, char.x, char.y, frame, char.direction, char.bobOffset);
        } else if (i === 1) {
          drawBear(ctx, char.x, char.y, frame, char.direction, char.bobOffset);
        } else {
          drawBeaver(ctx, char.x, char.y, frame, char.direction, char.bobOffset);
        }

        if (char.state === 'sleeping') {
          drawZzz(ctx, char.x, char.y, frame);
        }

        if (char.bubbleTimer > 0) {
          drawBubble(ctx, char.x + CHAR_W / 2, char.y - 12, char.bubbleText);
        }
      });

      // Meeting bubble
      if (meeting && chars[0].state === 'meeting') {
        const mx = (chars[0].x + chars[1].x) / 2 + CHAR_W / 2;
        const my = Math.min(chars[0].y, chars[1].y);
        drawBubble(ctx, mx, my - 16, '🤝 회의 중...');
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [meeting]);

  // Resize canvas for crisp rendering
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = CANVAS_W;
      canvas.height = CANVAS_H;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const statusColor = (s: string) => {
    if (s === 'online') return 'bg-emerald-400';
    if (s === 'idle') return 'bg-neo-yellow';
    return 'bg-zinc-500';
  };

  const statusLabel = (s: string) => {
    if (s === 'online') return '작업 중';
    if (s === 'idle') return '대기 중';
    return '오프라인';
  };

  const statusBadge = (s: string): 'success' | 'warning' | 'error' => {
    if (s === 'online') return 'success';
    if (s === 'idle') return 'warning';
    return 'error';
  };

  return (
    <NeoCard accent="bg-neo-purple" span="md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-mono text-xs font-bold uppercase opacity-60">
          🏢 에이전트 오피스
        </h3>
        <button
          onClick={() => setMeeting(true)}
          disabled={meeting}
          className={`
            font-mono text-[10px] font-bold px-3 py-1
            border-2 border-black dark:border-neo-yellow
            transition-all duration-150
            ${meeting
              ? 'bg-zinc-300 dark:bg-zinc-700 opacity-50 cursor-not-allowed'
              : 'bg-neo-purple text-white hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer'
            }
          `}
        >
          {meeting ? '회의 중...' : '🤝 회의 소집'}
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="border-4 border-black dark:border-neo-yellow overflow-hidden mb-3"
        style={{ imageRendering: 'pixelated' }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="w-full"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Character Profile Cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {PROFILES.map((p) => {
          const agent = agents.find((a) => a.name === p.name);
          const status = agent?.status || 'offline';
          return (
            <div
              key={p.name}
              className={`border-4 border-black dark:border-neo-yellow p-3 ${p.bg}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-lg">{p.emoji}</span>
                <span className="font-mono text-xs font-bold">{p.name}</span>
                <NeoBadge variant={statusBadge(status)}>
                  {statusLabel(status)}
                </NeoBadge>
              </div>
              <div className="font-mono text-[10px] font-bold opacity-80 mb-1">{p.role}</div>
              <div className="font-mono text-[10px] opacity-60 mb-1.5 leading-relaxed">{p.intro}</div>
              <div className="flex flex-wrap gap-1">
                {p.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="font-mono text-[9px] px-1.5 py-0.5 border-2 border-black dark:border-neo-yellow bg-white/40 dark:bg-black/30"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Status Cards */}
      <div className="grid grid-cols-3 gap-2">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="border-2 border-black dark:border-neo-yellow p-2 bg-zinc-50 dark:bg-zinc-800"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`w-2 h-2 rounded-full ${statusColor(agent.status)}`} />
              <span className="font-mono text-xs font-bold">
                {agent.emoji} {agent.name}
              </span>
              <NeoBadge variant={statusBadge(agent.status)}>
                {statusLabel(agent.status)}
              </NeoBadge>
            </div>
            <div className="font-mono text-[10px] opacity-70 space-y-0.5">
              <div>{agent.currentTask}</div>
              <div className="flex justify-between">
                <span>{agent.model}</span>
                <span>{agent.lastActivity}</span>
              </div>
              {agent.tokenUsage > 0 && (
                <div className="text-[9px] opacity-50">
                  {(agent.tokenUsage / 1000).toFixed(0)}K 토큰
                </div>
              )}
            </div>
          </div>
        ))}
        {agents.length === 0 && (
          <div className="col-span-3 text-center font-mono text-xs opacity-50 py-2">
            에이전트 데이터 로딩 중...
          </div>
        )}
      </div>
    </NeoCard>
  );
}

// ─── Helpers ────────────────────────────────────────────

function pickRandomTarget(char: Character) {
  const zones = [
    { x: 280 + Math.random() * 180, y: 140 + Math.random() * 120 },
    { x: COFFEE.x - 20, y: COFFEE.y + 30 },
    { x: SOFA.x + Math.random() * 40, y: SOFA.y - 20 },
    { x: 40 + Math.random() * 100, y: 280 + Math.random() * 60 },
    { x: 560 + Math.random() * 120, y: 280 + Math.random() * 60 },
  ];
  const target = zones[Math.floor(Math.random() * zones.length)];
  char.targetX = target.x;
  char.targetY = target.y;
}
