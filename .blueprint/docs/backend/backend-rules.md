# Reglas backend

## Express

- Rutas limpias.
- Controllers simples.
- Services para negocio.
- Repositories para datos.
- Middleware para auth y errores.

## Validación

- Zod en entradas.
- Validar params.
- Validar querystring.
- Validar body.

## Errores

- Manejo centralizado.
- No filtrar stack trace.
- Logs útiles y trazables.

## Resiliencia y Ciclo de Vida

- **Validación de Entorno:** Usar Zod para validar todas las variables de entorno (`.env`) al arrancar la aplicación. Si falta una clave crítica, el proceso debe abortar con un error claro.
- **Graceful Shutdown:** Implementar captura de señales (`SIGTERM`, `SIGINT`) para cerrar conexiones a DB y finalizar peticiones pendientes antes de apagar el contenedor.
- **Health Checks:** Endpoint `/health` obligatorio que verifique la conectividad con la base de datos y otros servicios críticos para que Docker/Kubernetes gestione el reinicio.
- **Detección de Zombis:** Asegurar que el proceso Node no deje hilos o conexiones abiertas que saturen la memoria.

## Seguridad

- Auth en middleware.
- Permisos por endpoint.
- Rate limiting en endpoints sensibles.
