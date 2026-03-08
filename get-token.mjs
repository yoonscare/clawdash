import fs from 'fs';
const auth = JSON.parse(fs.readFileSync('C:\\Users\\김기훈.LAPTOP-1R73PMSJ\\AppData\\Roaming\\com.vercel.cli\\Data\\auth.json','utf8'));
const token = auth.token || auth._;

// Get env vars (should include BLOB_READ_WRITE_TOKEN now)
const res = await fetch('https://api.vercel.com/v9/projects/prj_CLDpwOR2AkIcdTlAv86YBJW0tf60/env', {
  headers: { 'Authorization': 'Bearer ' + token }
});
const data = await res.json();
for (const env of data.envs || []) {
  if (env.key.includes('BLOB')) {
    console.log(env.key, '=', env.value || '(encrypted)');
  }
}
console.log('Total envs:', (data.envs || []).length);
console.log('All keys:', (data.envs || []).map(e => e.key).join(', '));
