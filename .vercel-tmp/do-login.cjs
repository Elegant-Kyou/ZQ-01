const { spawnSync } = require('child_process');
const r = spawnSync('vercel', ['login'], {
  stdio: 'inherit',
  shell: true,
  timeout: 120000
});
process.exit(r.status || 0);
