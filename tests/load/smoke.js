import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 3, // 3 usuarios virtuales
  duration: '30s', // durante 30 segundos
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% de las peticiones < 500ms
  },
};

export default function () {
  const url = 'http://localhost:3000/api/ideas'; // Asumiendo puerto 3000
  const res = http.get(url);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body has content': (r) => r.body.length > 0,
  });

  sleep(1);
}
