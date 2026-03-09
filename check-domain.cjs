const dns = require('dns');
const https = require('https');
const http = require('http');

const DOMAIN = 'zhangqiang.work';
const EXPECTED_IP = '76.76.21.21';

console.log(`=== 域名验证: ${DOMAIN} ===\n`);

// Step 1: DNS 解析检查
function checkDNS(host) {
  return new Promise(resolve => {
    dns.resolve4(host, (err, addresses) => {
      if (err) {
        console.log(`[DNS] ${host}: 未解析 (${err.code})`);
        resolve(false);
      } else {
        const match = addresses.includes(EXPECTED_IP);
        console.log(`[DNS] ${host}: ${addresses.join(', ')} ${match ? '-> 正确指向Vercel' : '-> 未指向Vercel(期望 ' + EXPECTED_IP + ')'}`);
        resolve(match);
      }
    });
  });
}

// Step 2: HTTP 访问检查
function checkHTTP(url) {
  return new Promise(resolve => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: 10000 }, res => {
      let body = '';
      res.on('data', d => body += d.toString());
      res.on('end', () => {
        const ok = res.statusCode === 200 && body.includes('吃什么');
        console.log(`[HTTP] ${url}: ${res.statusCode} (${body.length} bytes) ${ok ? '-> 页面正常' : '-> 页面异常'}`);
        resolve(ok);
      });
    });
    req.on('error', e => {
      console.log(`[HTTP] ${url}: 连接失败 (${e.message})`);
      resolve(false);
    });
    req.on('timeout', () => {
      console.log(`[HTTP] ${url}: 连接超时`);
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  // DNS checks
  const dns1 = await checkDNS(DOMAIN);
  const dns2 = await checkDNS('www.' + DOMAIN);

  console.log('');

  if (!dns1 && !dns2) {
    console.log('DNS 尚未配置。请在域名服务商后台添加以下记录:');
    console.log('  类型: A  主机记录: @    记录值: 76.76.21.21');
    console.log('  类型: A  主机记录: www  记录值: 76.76.21.21');
    console.log('\n配置后等待几分钟再运行此脚本验证。');
    return;
  }

  // HTTP checks
  if (dns1) {
    await checkHTTP('https://' + DOMAIN);
    await checkHTTP('http://' + DOMAIN);
  }
  if (dns2) {
    await checkHTTP('https://www.' + DOMAIN);
  }

  console.log('\n=== 验证完成 ===');
}

main();
