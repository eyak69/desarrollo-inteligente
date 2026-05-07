# Checklist OWASP práctico

Antes de dar una feature por terminada. Todos los ítems son `[BLOCKER]` salvo indicación contraria.

## Control de acceso

- [BLOCKER] ¿El backend valida que el usuario esté autenticado?
- [BLOCKER] ¿El backend valida el rol del usuario para esta operación?
- [BLOCKER] ¿El backend valida que el recurso pertenezca al usuario (ownership)?
- [BLOCKER] ¿Se evita IDOR? (el usuario no puede adivinar IDs ajenos — usar UUIDs)

## Inputs

- [BLOCKER] ¿Todos los inputs externos se validan con Zod antes de llegar al service?
- [BLOCKER] ¿Hay límites de longitud en strings para evitar payloads gigantes?
- [BLOCKER] ¿Los tipos esperados están definidos (no acepta número donde espera string)?
- [STRICT] ¿Hay sanitización de HTML cuando el contenido se renderiza como markup?

## Errores

- [BLOCKER] ¿Las respuestas de error no muestran stack traces?
- [BLOCKER] ¿Las respuestas de error no muestran SQL ni rutas internas del servidor?
- [BLOCKER] ¿El usuario ve mensajes claros pero sin información técnica sensible?

## Dependencias

- [STRICT] ¿Se revisaron vulnerabilidades con `npm audit` antes del deploy?
- [STRICT] ¿La librería nueva es realmente necesaria (no duplica algo ya instalado)?
- [STRICT] ¿La librería tiene mantenimiento activo (último commit <1 año)?

## Datos

- [BLOCKER] ¿La API devuelve solo los campos necesarios (no el objeto completo de DB)?
- [BLOCKER] ¿No se exponen campos internos (`deleted_at`, `password_hash`, etc.)?
- [BLOCKER] ¿No se exponen secretos ni tokens en ninguna respuesta?

## Frontend

- [BLOCKER] ¿El frontend no toma decisiones de seguridad (permisos, acceso a datos)?
- [BLOCKER] ¿Los tokens de sesión no se guardan en `localStorage` ni `sessionStorage`?
- [BLOCKER] ¿No se usa `dangerouslySetInnerHTML` sin sanitización previa?
