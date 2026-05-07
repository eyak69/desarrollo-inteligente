# Reglas backend

## Express

- [STRICT] Rutas limpias: solo definen el path y delegan al controller.
- [STRICT] Controllers simples: reciben request, llaman al service, devuelven response. Sin lógica de negocio.
- [STRICT] Services para negocio: toda lógica de dominio vive aquí.
- [STRICT] Repositories para datos: los services no hacen queries directas. Ver `docs/architecture/repository-rules.md`.
- [STRICT] Middleware para auth y errores: nunca repetir lógica de autenticación o manejo de errores en controllers individuales.

## Validación

La validación con Zod se aplica en el **middleware de validación**, antes de llegar al controller. El controller nunca recibe datos sin validar.

- [BLOCKER] Zod en todas las entradas externas: params, querystring y body.
- [BLOCKER] Validar params de ruta (`req.params`) con schema Zod en el middleware de la ruta correspondiente.
- [BLOCKER] Validar querystring (`req.query`) en endpoints que acepten filtros o paginación.
- [BLOCKER] Validar body (`req.body`) en todos los endpoints POST/PUT/PATCH.
- [STRICT] Los errores de validación Zod deben mapearse al shape estándar `VALIDATION_FAILED` (422). Ver `docs/conventions/api-error-format.md`.

## Errores

- [BLOCKER] Manejo centralizado: un único middleware de errores al final de la cadena Express. Los controllers nunca devuelven errores directamente, lanzan excepciones.
- [BLOCKER] No filtrar stack trace hacia el cliente. Solo `code`, `message` y `details` según el shape de `api-error-format.md`.
- [STRICT] Logs útiles y trazables: todo error inesperado debe loguearse con `requestId`, nivel `error`, y contexto suficiente para reproducirlo. Ver `docs/observability/logging.md`.

## Resiliencia y Ciclo de Vida

- [BLOCKER] **Validación de Entorno:** Usar Zod para validar todas las variables de entorno (`.env`) al arrancar la aplicación. Si falta una clave crítica, el proceso debe abortar con un error claro.
- [STRICT] **Graceful Shutdown:** Implementar captura de señales (`SIGTERM`, `SIGINT`) para cerrar conexiones a DB y finalizar peticiones pendientes antes de apagar el contenedor.
- [STRICT] **Health Checks:** Endpoint `/health` obligatorio que verifique la conectividad con la base de datos y otros servicios críticos para que Docker/Kubernetes gestione el reinicio.
- [GUIDE] **Detección de Zombis:** Asegurar que el proceso Node no deje hilos o conexiones abiertas que saturen la memoria.

## Seguridad

- [BLOCKER] Auth en middleware: nunca en lógica de negocio ni en el controller.
- [BLOCKER] Permisos por endpoint: cada ruta declara explícitamente qué rol puede acceder.
- [STRICT] Rate limiting en endpoints sensibles (auth, reset de contraseña, envío de emails).
