# Deploy y CI/CD

## CI/CD (GitHub Actions)

- [BLOCKER] **Integración Continua (CI):** Ejecución automática de tests, linting y build en cada Pull Request a `develop` o `main`. Prohibido mergear si el CI falla.
- [BLOCKER] **Despliegue Continuo (CD):** Publicación automática en el servidor de producción tras un merge exitoso a la rama `main`.
- [BLOCKER] **GitHub Secrets:** Todas las credenciales de producción (API Keys, DB Passwords, tokens) deben residir en GitHub Secrets, nunca hardcodeadas en el archivo `.yml` ni en el código.

### Pipeline mínimo obligatorio

```yaml
# Secuencia requerida en cada PR:
1. Install dependencies       # npm ci (no npm install)
2. Lint                        # ESLint — falla si hay errores
3. Type check                  # tsc --noEmit
4. Unit & integration tests    # vitest run
5. Build                       # vite build / tsc
```

- [STRICT] Usar `npm ci` (no `npm install`) en CI para garantizar reproducibilidad.
- [STRICT] El pipeline de CD solo se dispara si el pipeline de CI pasó en su totalidad.
- [GUIDE] Cachear `node_modules` por hash de `package-lock.json` para acelerar builds.

## Docker

- [STRICT] Un `Dockerfile` por aplicación (client y server tienen sus propios archivos).
- [BLOCKER] No incluir secretos en la imagen Docker. Las variables sensibles se inyectan en runtime via variables de entorno del orquestador.
- [STRICT] Variables de configuración por entorno (dev, staging, prod): nunca hardcodeadas en la imagen.
- [STRICT] Healthchecks declarados en el `Dockerfile` o `docker-compose.yml` para que Docker/Kubernetes detecte y reinicie contenedores colgados.
- [GUIDE] Usar imágenes base oficiales de Node con tag de versión fija (ej: `node:22-alpine`). No usar `latest`.
- [GUIDE] Aplicar multi-stage builds para minimizar el tamaño de la imagen final: stage de build separado del stage de producción.

## Producción

- [BLOCKER] **HTTPS obligatorio** en todos los entornos públicos. Sin excepciones.
- [BLOCKER] **Ejecución de Migraciones:** Ejecutar automáticamente las migraciones pendientes antes de activar la nueva versión de la app. Nunca desplegar código que espera un schema que no existe todavía.
- [STRICT] **Validación de Esquema:** Comprobar que el servidor de producción tenga todos los campos y tablas requeridos por el nuevo código antes de finalizar el deploy.
- [STRICT] Logs centralizados. Ver `docs/observability/logging.md`.
- [STRICT] Backups verificados periódicamente (no alcanza con que existan). Restauración probada al menos una vez por entorno.

## Secretos y rotación

- [BLOCKER] Ningún secret, API key, ni password en el repositorio git. Incluye archivos `.env` de producción.
- [STRICT] El archivo `.env.example` documenta todas las variables necesarias con comentarios, pero sin valores reales.
- [GUIDE] Rotar secrets ante cualquier sospecha de exposición (leak en logs, PR público accidental, salida de un colaborador con acceso).
- [GUIDE] Revisar accesos a GitHub Secrets periódicamente y revocar los que ya no sean necesarios.
