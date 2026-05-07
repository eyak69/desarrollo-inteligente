# Logging y observabilidad

## Stack

- [STRICT] Backend: `pino` (rápido, JSON nativo).
- [STRICT] Frontend: errores no-controlados van a la consola en dev y a un
  endpoint `/api/client-errors` (rate-limited) en prod, o al servicio de
  observabilidad acordado.

## Niveles

| Nivel | Uso                                                        |
|-------|------------------------------------------------------------|
| fatal | el proceso no puede seguir                                 |
| error | falla recuperable que requiere atención (5xx, excepciones) |
| warn  | algo raro pero no rompe (deprecado, retry, timeout breve)  |
| info  | eventos significativos (login, mutación importante)        |
| debug | detalle técnico, solo en dev                               |
| trace | ruido fino, normalmente apagado                            |

- [STRICT] Default en producción: `info`.
- [STRICT] Default en desarrollo: `debug`.
- [STRICT] Nivel se controla por `LOG_LEVEL` en `.env`.

## Formato

- [BLOCKER] Logs en producción son **JSON, una línea por evento**.
- [STRICT] Cada log incluye:
  - `requestId` (correlación con `X-Request-Id`)
  - `userId` si hay usuario autenticado
  - `route`, `method`, `status`, `durationMs` para HTTP
  - `err.name`, `err.message`, `err.stack` para errores

## Qué NO loguear (BLOCKER)

- Passwords, hashes incluidos.
- JWT, refresh tokens, cookies.
- Datos personales sensibles más allá de lo necesario para el evento.
- Bodies completos de endpoints sensibles (login, payment, etc.). Filtrar campos.
- Números de tarjeta, CVVs, claves de API.

## Errores no controlados

- [BLOCKER] Capturar `uncaughtException` y `unhandledRejection` en backend,
  loguear como `fatal` y terminar el proceso (que el orquestador lo levante).
- [BLOCKER] Errores de cliente capturados con un `ErrorBoundary` global que
  muestra `ErrorState` y reporta al backend.

## Métricas mínimas

- [STRICT] Endpoint `/health` que verifica DB y dependencias críticas.
- [STRICT] Endpoint `/metrics` (si hay Prometheus) o equivalente.
- [GUIDE] Trazas distribuidas con OpenTelemetry si el proyecto lo amerita.

## Correlación

- [STRICT] Middleware al inicio del request genera `requestId` (ULID/UUID),
  lo pone en `req.id`, lo devuelve como `X-Request-Id` y lo incluye en
  todos los logs del request.
