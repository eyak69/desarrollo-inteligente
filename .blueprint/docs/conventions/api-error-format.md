# Formato de errores de API

Toda respuesta de error de la API tiene la misma forma. El frontend asume
esto y lo trata centralizado.

## Shape

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "El campo email es inválido.",
    "details": [
      { "path": "email", "message": "Formato inválido" }
    ],
    "requestId": "req_01HX..."
  }
}
```

## Campos

- `code` — string corto en UPPER_SNAKE_CASE. Lo usa el frontend para lógica
  (ej: `EMAIL_ALREADY_USED` → mostrar mensaje específico).
- `message` — string para mostrar al usuario. Sin stack, sin info técnica.
- `details` — opcional. Array de errores por campo (validación Zod).
- `requestId` — id correlacionable con logs del backend.

## Reglas

- [BLOCKER] Toda respuesta no-2xx usa este shape. Sin excepciones.
- [BLOCKER] `message` no contiene SQL, paths internos, ni nombres de tabla.
- [STRICT] `code` es estable: cambiarlo es breaking change para el cliente.
- [STRICT] `requestId` también va en logs y en header `X-Request-Id`.

## Códigos sugeridos

| `code`                | HTTP | Caso                                    |
|-----------------------|------|-----------------------------------------|
| BAD_REQUEST           | 400  | request mal formado                     |
| UNAUTHENTICATED       | 401  | falta token / inválido                  |
| FORBIDDEN             | 403  | sin permiso                             |
| NOT_FOUND             | 404  | recurso inexistente o ajeno             |
| CONFLICT              | 409  | conflicto de estado                     |
| VALIDATION_FAILED     | 422  | falla validación Zod                    |
| RATE_LIMITED          | 429  | rate limit                              |
| INTERNAL_ERROR        | 500  | bug genuino                             |
| UPSTREAM_UNAVAILABLE  | 502  | upstream caído                          |
| SERVICE_UNAVAILABLE   | 503  | servicio en mantenimiento               |

## Implementación sugerida

- Una clase `AppError(code, httpStatus, message, details?)` en `/server/src/errors/`.
- Un middleware de errores único al final de la cadena Express que:
  1. Reconoce `AppError` y arma el shape.
  2. Para `ZodError`, mapea a `VALIDATION_FAILED` (422) con `details`.
  3. Para todo lo demás, loguea con `requestId` y devuelve `INTERNAL_ERROR` (500)
     con un message genérico.
