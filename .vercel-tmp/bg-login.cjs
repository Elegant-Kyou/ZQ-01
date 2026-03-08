const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'login-output.log');
const fd = fs.openSync(logFile, 'w');

console.log('Starting vercel login...');
console.log('Log file:', logFile);

const child = spawn('vercel', ['login'], {
  stdio: ['ignore', fd, fd],
  shell: true
});

let url = null;
let checks = 0;
const maxChecks = 240; // 2 minutes

const interval = setInterval(() => {
  checks++;
  try {
    const content = fs.readFileSync(logFile, 'utf8');
    
    if (content.includes('Congratulations!') || content.includes('Success')) {
      console.log('Login successful!');
      clearInterval(interval);
      fs.closeSync(fd);
      process.exit(0);
    }
    
    if (!url) {
      const match = content.match(/https:\/\/vercel\.com\/oauth\/device\?user_code=[A-Z0-9-]+/);
      if (match) {
        url = match[0];
        console.log('AUTH_URL:' + url);
      }
    }
    
    if (content.includes('Error:') || content.includes('aborted')) {
      console.log('Login failed:', content.trim());
      clearInterval(interval);
      fs.closeSync(fd);
      process.exit(1);
    }
  } catch(e) {}
  
  if (checks >= maxChecks) {
    console.log('Timeout waiting for login');
    clearInterval(interval);
    child.kill();
    fs.closeSync(fd);
    process.exit(1);
  }
}, 500);
