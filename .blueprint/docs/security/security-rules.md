# Seguridad base

## Autenticación

- **Login Mixto:** El sistema debe soportar inicio de sesión mediante Email/Password y Google OAuth de forma simultánea.
- **Google OAuth:** Implementar flujo de Google One Tap o botón oficial de Google. El backend debe validar el `id_token` de Google.
- **Consistencia:** Independientemente del método, el sistema debe emitir las mismas cookies `httpOnly` + `secure` + `sameSite`.
- **Persistencia de Proveedores:** La tabla de usuarios debe permitir múltiples proveedores de identidad para una misma cuenta (vinculación de cuentas).
- **Seguridad de Cookies:** Preferir cookies httpOnly + secure + sameSite.
- **JWT:** No guardar JWT en localStorage.
- **Sesiones:** Sesiones con expiración controlada.
- **Refresh Token:** Implementar rotación de Refresh Tokens de forma segura.
- **Passwords:** Hashing fuerte (bcrypt/argon2) solo para cuentas de email. No guardar passwords para usuarios de Google.

## Autorización

- Validar permisos en backend.
- Validar ownership.
- No confiar en la UI.
- Proteger endpoints por rol y recurso.

## SQL Injection

- SQL siempre parametrizado.
- Nunca concatenar strings del usuario.
- Validar entradas con Zod.

## XSS

- No usar dangerouslySetInnerHTML salvo autorización.
- Escapar contenido dinámico.
- Sanitizar HTML si es inevitable.

## APIs

- No exponer stack traces.
- No devolver datos innecesarios (usar DTOs/Filtros).
- No devolver secretos.
- Manejo centralizado de errores.

## Protección contra Ataques

- **Rate Limiting:** Implementar límites de peticiones en endpoints sensibles (Login, Registro, Password Reset) para prevenir fuerza bruta.
- **CORS:** Configurar una whitelist estricta de orígenes. Jamás usar `*` en producción.
- **CSRF:** Dado el uso de cookies, implementar protección anti-CSRF (Tokens o validación estricta de SameSite).
- **Security Headers:** Uso obligatorio de Helmet para configurar headers como `Content-Security-Policy`, `X-Frame-Options`, etc.
- **Sanitización de Salida:** No devolver jamás el objeto completo de la base de datos; usar DTOs o filtrar campos sensibles.

## Secretos

- Usar variables de entorno.
- No subir .env al repo.
- [BLOCKER] No poner claves privadas, tokens con permisos de escritura, ni
  secrets en el frontend bajo ninguna forma (variables `VITE_PUBLIC_*`,
  respuestas de API, bundle embebido). Solo datos no sensibles pueden ir
  en variables públicas del cliente.
- [STRICT] Toda variable de entorno nueva debe estar documentada en
  `.env.example` con un comentario que indique su propósito y si es
  requerida u opcional.

## Logs

- No loguear tokens.
- No loguear passwords.
- No loguear datos sensibles.
