import fs from 'fs';
import crypto from 'crypto';
const auth = JSON.parse(fs.readFileSync('C:\\Users\\김기훈.LAPTOP-1R73PMSJ\\AppData\\Roaming\\com.vercel.cli\\Data\\auth.json','utf8'));
const token = auth.token || auth._;
const apiKey = crypto.randomBytes(24).toString('hex');

const res = await fetch('https://api.vercel.com/v10/projects/prj_CLDpwOR2AkIcdTlAv86YBJW0tf60/env', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'CHATLOG_API_KEY', value: apiKey, type: 'encrypted', target: ['production','preview','development'] })
});
const data = await res.json();
console.log('Status:', res.status);
console.log('API Key:', apiKey);
fs.writeFileSync('C:\\Users\\김기훈.LAPTOP-1R73PMSJ\\Projects\\clawdash\\.chatlog-apikey', apiKey);
