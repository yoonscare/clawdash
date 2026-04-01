# TASK: Upgrade AgentOffice to ClawFamily Dashboard

## Goal
Upgrade the AgentOffice widget to show 3 ClawFamily characters with profile cards and recent chat.

## 1. Add 클로비(Beaver 🦫) as 3rd character in AgentOffice.tsx

- Draw a pixel art beaver (brown/amber tones, flat wide tail, buck teeth)
- Add 3rd room: '클로비의 작업실' (right side)
- 클로비 gets own desk, workspace area
- Speech bubbles: ['기둥부터 세울게', '물길 막힌 데부터 뚫자', '먼저 돌아가는 걸 만들게', '구조부터 잡아보자', '프로토타입 먼저!']
- Increase CANVAS_W to ~1200 to fit 3 rooms
- Add DESK_3 coordinates for 클로비
- Add 3rd room divider, label, desk, chair, bookshelf similar style to existing rooms

## 2. Add Character Profile Cards below canvas

3 cards in a grid, each showing:
- Emoji + name
- Role: 클로=메인 비서/오케스트레이터, 클로아우=간호교육 전문 브레인/문서 감수, 클로비=빌더/시스템 메이커
- Intro: 클로=흐름을 읽고 도구를 골라 일을 굴리는 수달 비서, 클로아우=기준과 맥락을 지키며 문서와 내용을 단단하게 만드는 곰 브레인, 클로비=구조를 짓고 자동화를 엮고 결과물이 남게 만드는 비버 빌더
- Keywords: 클로=차분함·유연함·실용적, 클로아우=든든함·성실함·꼼꼼함, 클로비=뚝심·제작자기질·공학적사고
- Status badge (online/idle/offline)
- Neo-brutalism style, accent colors: teal=클로, amber=클로아우, brown=클로비

## 3. Show recent chat messages

- Fetch from /api/agent-chat
- Show last 5 messages with from→to direction
- Add 클로비 mappings: emoji=🦫, color=brown/amber

## 4. Update agent status grid to 3 columns

- Add 클로비 to agents array with fallback data
- 3-col grid for status cards

## Design
- Neo-brutalism (thick black borders, bold mono fonts)
- Dark mode support (dark: classes)
- Pixelated canvas rendering
- Only modify frontend: AgentOffice.tsx and AgentChat.tsx
- Do NOT touch API routes
