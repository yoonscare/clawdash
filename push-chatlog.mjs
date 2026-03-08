import fs from 'fs';
const apiKey = fs.readFileSync('C:\\Users\\김기훈.LAPTOP-1R73PMSJ\\Projects\\clawdash\\.chatlog-apikey','utf8').trim();
const baseUrl = 'https://clawdash-kappa.vercel.app';

const messages = [
  { time: "09:55", from: "클로", text: "일요일 아침 보고! AI Daily Digest 작성 완료 📰" },
  { time: "10:02", from: "윤스케어", text: "clawdash 설치하고 커스텀해줄 수 있어?" },
  { time: "10:05", from: "클로", text: "설치 완료! 한국어화 + 다크모드 적용 🐾" },
  { time: "10:10", from: "윤스케어", text: "배포까지 하는건?" },
  { time: "10:12", from: "클로", text: "Vercel 배포 완료! 🎉" },
  { time: "10:20", from: "윤스케어", text: "위젯 다 해줘 ㅎ" },
  { time: "10:25", from: "클로", text: "대화로그, 미션트래커, 투두, AI Digest 위젯 추가 완료!" },
  { time: "10:30", from: "윤스케어", text: "혈압 체크랑 건강 루틴 관리 칸 만들어줘" },
  { time: "10:35", from: "클로", text: "❤️ 건강관리 위젯 추가! 혈압기록 + 주간루틴" },
  { time: "10:40", from: "윤스케어", text: "캘린더는 내가 직접 넣게 해줘" },
  { time: "10:45", from: "클로", text: "캘린더 인터랙티브로 변경 완료 📅" },
  { time: "10:50", from: "윤스케어", text: "소리로 알려주는건 가능해?" },
  { time: "10:52", from: "클로", text: "🔊 TTS 음성 보고 + 음성메시지 명령 둘 다 가능!" },
  { time: "11:00", from: "윤스케어", text: "대화내용 실시간 업데이트 되게 해줘" },
  { time: "11:05", from: "클로", text: "Vercel Blob API 연동 완료! 실시간 대화 로그 🐾" },
];

for (const msg of messages) {
  const res = await fetch(baseUrl + '/api/chatlog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify(msg)
  });
  const data = await res.json();
  console.log(msg.from, msg.time, '->', data.ok ? '✓' : data.error);
}
console.log('Done!');
