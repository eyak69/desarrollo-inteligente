# Códigos HTTP

Tabla de uso. Sin inventar códigos. Si no estás seguro entre dos, usar el más
genérico de la familia.

## 2xx — Éxito

| Código | Cuándo                                                       |
|--------|--------------------------------------------------------------|
| 200    | OK con cuerpo                                                |
| 201    | Recurso creado (devolver `Location` y/o el recurso)          |
| 204    | OK sin cuerpo (DELETE típico)                                |

## 3xx

Solo para redirecciones reales del backend (no para "no encontrado"). Casi
nunca se usan en una API JSON.

## 4xx — Error del cliente

| Código | Cuándo                                                       |
|--------|--------------------------------------------------------------|
| 400    | Request mal formado (no parsea, falta campo estructural)     |
| 401    | No autenticado / token inválido o ausente                    |
| 403    | Autenticado pero sin permiso para este recurso/acción        |
| 404    | Recurso no existe **o** el usuario no debería saber que existe (anti-IDOR) |
| 409    | Conflicto de estado (duplicado, optimistic lock, etc.)       |
| 410    | Recurso existió pero fue eliminado de forma definitiva       |
| 422    | Request bien formado pero falla validación de negocio (Zod, reglas) |
| 429    | Rate limit superado                                          |

## 5xx — Error del servidor

| Código | Cuándo                                                       |
|--------|--------------------------------------------------------------|
| 500    | Bug genuino del servidor (no debería pasar)                  |
| 502    | El servidor falló al hablar con un upstream                  |
| 503    | El servicio está caído / en mantenimiento                    |
| 504    | Timeout hablando con un upstream                             |

## Reglas

- [BLOCKER] **403 vs 404 anti-IDOR:** si el recurso existe pero no es del
  usuario, devolver **404**, no 403, para no filtrar la existencia.
- [STRICT] **400 vs 422:** 400 es "no entendí lo que mandaste"; 422 es
  "lo entendí pero no es válido por reglas de negocio o esquema".
- [STRICT] **409:** usar para violaciones de unicidad, conflicto de versión,
  ya existe el recurso, etc. Evitar 400 para esto.
- [BLOCKER] Nunca devolver 200 con `{ ok: false }` para errores. Si fue error,
  el código HTTP refleja el error.
- [BLOCKER] Stack traces solo se loguean. Nunca se devuelven.
