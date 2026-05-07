# Seguridad base

## Autenticación

- [BLOCKER] **Login Mixto:** El sistema debe soportar inicio de sesión mediante Email/Password y Google OAuth de forma simultánea.
- [BLOCKER] **Google OAuth:** Implementar flujo de Google One Tap o botón oficial. El backend valida el `id_token` de Google — nunca confiar en datos del frontend.
- [BLOCKER] **Cookies seguras:** Usar cookies `httpOnly + secure + sameSite=strict`. Independientemente del método de login, el sistema emite las mismas cookies.
- [BLOCKER] **JWT:** No guardar JWT en `localStorage` ni `sessionStorage`. Solo en cookies `httpOnly`.
- [BLOCKER] **Passwords:** Hashing fuerte (bcrypt/argon2) solo para cuentas de email. No guardar passwords para usuarios de Google.
- [STRICT] **Refresh Token:** Implementar rotación de Refresh Tokens. Un token usado se invalida inmediatamente.
- [STRICT] **Sesiones:** Sesiones con expiración controlada. Definir TTL de access token y refresh token explícitamente.
- [STRICT] **Persistencia de proveedores:** La tabla de usuarios debe permitir múltiples proveedores de identidad para una misma cuenta (vinculación de cuentas).

## Autorización

- [BLOCKER] Validar permisos en backend en cada request. El frontend nunca decide qué puede hacer un usuario.
- [BLOCKER] Validar ownership: el usuario A no puede operar sobre recursos del usuario B.
- [BLOCKER] No confiar en ningún dato del cliente (headers, body, querystring) sin validación.
- [STRICT] Proteger endpoints por rol y recurso. Documentar en el handler qué rol requiere cada endpoint.

## SQL Injection

- [BLOCKER] SQL siempre parametrizado — usar Knex o bindings `?`. Nunca concatenar strings del usuario.
- [BLOCKER] Validar y tipar entradas con Zod antes de que lleguen a cualquier query.
- [BLOCKER] No usar `db.raw` con valores interpolados directamente. Ver `docs/database/database-rules.md`.

## XSS

- [BLOCKER] No usar `dangerouslySetInnerHTML` salvo autorización explícita con sanitización previa (DOMPurify o similar).
- [STRICT] Escapar contenido dinámico que se renderiza como HTML.
- [STRICT] Configurar `Content-Security-Policy` via Helmet en el backend.

## APIs

- [BLOCKER] No exponer stack traces en respuestas de error. Ver `docs/conventions/api-error-format.md`.
- [BLOCKER] No devolver el objeto completo de DB — usar DTOs que filtren campos sensibles.
- [BLOCKER] No devolver secretos, tokens ni passwords en ninguna respuesta.
- [STRICT] Manejo centralizado de errores — un solo middleware al final de Express.

## Protección contra ataques

- [BLOCKER] **Rate Limiting:** Implementar límites en endpoints sensibles (login, registro, reset de contraseña).
- [BLOCKER] **CORS:** Configurar whitelist estricta de orígenes. Prohibido `origin: '*'` en producción.
- [STRICT] **CSRF:** Dado el uso de cookies, implementar protección anti-CSRF (tokens o validación estricta de `SameSite`).
- [STRICT] **Security Headers:** Usar Helmet para `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, etc.
- [STRICT] **Sanitización de salida:** No devolver el objeto completo de la base de datos; filtrar siempre con DTOs.

## Secretos

- [BLOCKER] No poner claves privadas, tokens con permisos de escritura, ni secrets en el frontend bajo ninguna forma (variables `VITE_PUBLIC_*`, respuestas de API, bundle embebido).
- [BLOCKER] No subir `.env` de producción al repositorio git.
- [STRICT] Toda variable de entorno nueva debe estar documentada en `.env.example` con comentario de propósito y si es requerida u opcional.
- [GUIDE] Rotar secrets ante cualquier sospecha de exposición (leak en logs, PR público accidental, salida de colaborador con acceso).

## Logs

- [BLOCKER] No loguear tokens de sesión ni refresh tokens.
- [BLOCKER] No loguear passwords ni hashes de passwords.
- [STRICT] No loguear datos sensibles del usuario (DNI, tarjetas, datos de salud).
- [STRICT] Logs de errores incluyen `requestId` para correlación. Ver `docs/observability/logging.md`.
