const https = require('https');
const http = require('http');
const dns = require('dns');

// ========== 配置 ==========
const ENDPOINTS = [
  { name: '阿里云 IIS',   url: 'http://121.43.192.101',  proto: http },
  { name: 'Vercel (域名)', url: 'https://zhangqiang.work', proto: https },
  { name: 'Vercel (www)',  url: 'https://www.zhangqiang.work', proto: https },
];
const EXPECTED_DNS_IP = '76.76.21.21';
const TIMEOUT_MS = 10000;

// ========== 工具函数 ==========
function timestamp() {
  return new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
}

function checkDNS(host) {
  return new Promise(resolve => {
    dns.resolve4(host, (err, addrs) => {
      if (err) resolve({ host, ok: false, error: err.code });
      else resolve({ host, ok: true, addresses: addrs, vercel: addrs.includes(EXPECTED_DNS_IP) });
    });
  });
}

function checkHTTP(endpoint) {
  return new Promise(resolve => {
    const start = Date.now();
    const req = endpoint.proto.get(endpoint.url, { timeout: TIMEOUT_MS }, res => {
      let body = '';
      res.on('data', d => body += d.toString());
      res.on('end', () => {
        const latency = Date.now() - start;
        const hasContent = body.includes('吃什么') || body.includes('<!DOCTYPE');
        resolve({
          name: endpoint.name,
          url: endpoint.url,
          ok: res.statusCode === 200 && hasContent,
          status: res.statusCode,
          latency,
          size: body.length,
          contentOk: hasContent,
        });
      });
    });
    req.on('error', e => {
      resolve({ name: endpoint.name, url: endpoint.url, ok: false, error: e.message, latency: Date.now() - start });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ name: endpoint.name, url: endpoint.url, ok: false, error: 'TIMEOUT', latency: TIMEOUT_MS });
    });
  });
}

// ========== 主逻辑 ==========
async function main() {
  const mode = process.argv[2]; // --json 输出 JSON 格式
  const results = { time: timestamp(), dns: [], http: [], summary: { total: 0, healthy: 0, unhealthy: 0 } };

  // DNS 检查
  const dnsResults = await Promise.all([
    checkDNS('zhangqiang.work'),
    checkDNS('www.zhangqiang.work'),
  ]);
  results.dns = dnsResults;

  // HTTP 检查
  const httpResults = await Promise.all(ENDPOINTS.map(checkHTTP));
  results.http = httpResults;
  results.summary.total = httpResults.length;
  results.summary.healthy = httpResults.filter(r => r.ok).length;
  results.summary.unhealthy = results.summary.total - results.summary.healthy;

  if (mode === '--json') {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  // 可读输出
  console.log(`\n====== 吃什么 - 健康检查报告 ======`);
  console.log(`时间: ${results.time}\n`);

  console.log('--- DNS 解析 ---');
  for (const d of dnsResults) {
    if (d.ok) {
      console.log(`  ${d.host}: ${d.addresses.join(', ')} ${d.vercel ? '[Vercel]' : '[非Vercel]'}`);
    } else {
      console.log(`  ${d.host}: 未解析 (${d.error})`);
    }
  }

  console.log('\n--- 服务状态 ---');
  for (const r of httpResults) {
    if (r.ok) {
      console.log(`  [OK]   ${r.name} (${r.url}) - HTTP ${r.status}, ${r.latency}ms, ${r.size} bytes`);
    } else {
      console.log(`  [FAIL] ${r.name} (${r.url}) - ${r.error || 'HTTP ' + r.status}, ${r.latency}ms`);
    }
  }

  console.log(`\n--- 汇总 ---`);
  console.log(`  健康: ${results.summary.healthy}/${results.summary.total}  异常: ${results.summary.unhealthy}/${results.summary.total}`);

  if (results.summary.unhealthy > 0) {
    console.log('\n[!] 存在异常节点，请检查。');
    process.exitCode = 1;
  } else {
    console.log('\n[OK] 所有节点正常。');
  }
}

main();
