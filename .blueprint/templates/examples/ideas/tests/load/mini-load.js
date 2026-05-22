import http from 'http';

const URL = 'http://localhost:3001/api/ideas?page=1&limit=5';
const CONCURRENCY = 20;
const TOTAL_REQUESTS = 100;

function makeRequest() {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    http.get(URL, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const latency = Date.now() - start;
        if (res.statusCode !== 200) {
          reject(new Error(`Status ${res.statusCode}`));
          return;
        }
        try {
          const json = JSON.parse(data);
          if (!json.data || !json.meta) throw new Error('Invalid structure');
          resolve(latency);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runTest() {
  console.log(`🚀 Iniciando Mini-Load Test (Native)...`);
  console.log(`URL: ${URL}`);
  
  const start = Date.now();
  let completed = 0;
  let failed = 0;
  const latencies = [];

  for (let i = 0; i < TOTAL_REQUESTS; i += CONCURRENCY) {
    const batch = Array.from({ length: Math.min(CONCURRENCY, TOTAL_REQUESTS - i) }).map(async () => {
      try {
        const latency = await makeRequest();
        latencies.push(latency);
        completed++;
      } catch {
        failed++;
      }
    });
    await Promise.all(batch);
  }

  const duration = Date.now() - start;
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const p95 = latencies.sort((a, b) => a - b)[Math.floor(latencies.length * 0.95)];

  console.log('\n--- 📊 Resultados ---');
  console.log(`Duración Total: ${duration}ms`);
  console.log(`Peticiones Exitosas: ${completed}`);
  console.log(`Peticiones Fallidas: ${failed}`);
  console.log(`Latencia Promedio: ${avgLatency.toFixed(2)}ms`);
  console.log(`Latencia p95: ${p95}ms`);
  
  if (failed === 0 && p95 < 200) {
    console.log('\n✅ TEST PASADO: La paginación es estable y rápida.');
  } else {
    console.log('\n⚠️ TEST CON ADVERTENCIAS.');
  }
}

runTest().catch(console.error);
