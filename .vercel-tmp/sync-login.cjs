const { spawnSync } = require('child_process');
const result = spawnSync('vercel', ['login'], {
  stdio: 'inherit',
  shell: true,
  timeout: 180000,
  env: { ...process.env, PATH: 'C:\\Program Files\\nodejs;C:\\Users\\Administrator\\AppData\\Roaming\\npm;' + process.env.PATH }
});
console.log('EXIT_CODE:' + (result.status || 0));
if (result.error) console.log('ERROR:' + result.error.message);
