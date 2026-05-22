import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Test de carga para validación de paginación
 * Verifica:
 * 1. El formato de respuesta { data, meta }
 * 2. Rendimiento bajo concurrencia
 * 3. Correcto funcionamiento de los parámetros page y limit
 */
export const options = {
  stages: [
    { duration: '10s', target: 20 }, // Subida rápida a 20 usuarios
    { duration: '20s', target: 20 }, // Mantener 20 usuarios
    { duration: '10s', target: 0 },  // Bajada
  ],
  thresholds: {
    http_req_duration: ['p(99)<200'], // 99% de las peticiones deben ser ultrarrápidas (<200ms)
    http_req_failed: ['rate<0.01'],    // Menos del 1% de fallos
  },
};

const BASE_URL = 'http://localhost:3001/api/ideas';

export default function () {
  // Probamos diferentes páginas y límites
  const page = Math.floor(Math.random() * 5) + 1;
  const limit = 5;
  
  const res = http.get(`${BASE_URL}?page=${page}&limit=${limit}`);
  
  const isOk = check(res, {
    'status is 200': (r) => r.status === 200,
    'has data array': (r) => {
      const body = JSON.parse(r.body);
      return Array.isArray(body.data);
    },
    'has meta object': (r) => {
      const body = JSON.parse(r.body);
      return typeof body.meta === 'object' && body.meta !== null;
    },
    'meta page is correct': (r) => {
      const body = JSON.parse(r.body);
      return body.meta.page === page;
    }
  });

  if (!isOk) {
    console.error(`Error en la petición: ${res.status} ${res.body}`);
  }

  sleep(0.5); // Simular navegación humana rápida
}
