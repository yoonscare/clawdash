import fs from 'fs';
const auth = JSON.parse(fs.readFileSync('C:\\Users\\김기훈.LAPTOP-1R73PMSJ\\AppData\\Roaming\\com.vercel.cli\\Data\\auth.json','utf8'));
const token = auth.token || auth._;

// Connect store to project
const res = await fetch('https://api.vercel.com/v1/storage/stores/store_CN059Ems7nzF2qTT/connections', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
  body: JSON.stringify({ projectId: 'prj_CLDpwOR2AkIcdTlAv86YBJW0tf60', environments: ['production','preview','development'] })
});
const text = await res.text();
console.log('Status:', res.status);
console.log('Body:', text);
