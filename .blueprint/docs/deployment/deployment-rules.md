# Deploy y CI/CD

## CI/CD (GitHub Actions)

- **Integración Continua (CI):** Ejecución automática de tests, linting y build en cada Pull Request a `develop` o `main`. Prohibido mergear si el CI falla.
- **Despliegue Continuo (CD):** Publicación automática en el servidor de producción tras un merge exitoso a la rama `main`.
- **GitHub Secrets:** Todas las credenciales de producción (Keys, DB Passwords) deben residir en GitHub Secrets, nunca en el archivo `.yml`.

## Docker

- Dockerfile por app.
- Variables por entorno.
- No secretos en imagen.
- Healthchecks.

## Producción

- **Ejecución de Migraciones:** Ejecutar automáticamente las migraciones pendientes antes de activar la nueva versión de la app.
- **Validación de Esquema:** Comprobar que el servidor de producción tenga todos los campos y tablas requeridos por el nuevo código antes de finalizar el deploy.
- [BLOCKER] **HTTPS obligatorio** en todos los entornos públicos.
- Logs centralizados (ver `docs/observability/logging.md`).
- Backups verificados periódicamente (no alcanza con que existan).
- 