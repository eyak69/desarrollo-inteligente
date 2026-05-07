# Reglas de Git y Control de Versiones

## Estrategia de Ramas

- **main:** Rama de producción. Solo código estable y probado.
- **develop:** Rama de integración para desarrollo.
- **feature/*:** Ramas temporales para tareas específicas (ej: `feature/login-google`).

## Mensajes de Commit (Conventional Commits)

- **feat:** Nueva funcionalidad.
- **fix:** Corrección de error.
- **docs:** Cambios en documentación.
- **style:** Cambios de formato (no afectan lógica).
- **refactor:** Cambio de código que no arregla error ni añade función.
- **chore:** Tareas de mantenimiento (build, dependencias).

## Ciclo de Vida del Commit

1. **Documentar:** Si el commit incluye una excepción a una regla STRICT/BLOCKER
   o un aprendizaje relevante, actualizar `/.blueprint/Learning.md` con el
   contexto (ver formato en ese archivo).
2. **Probar:** Ejecutar tests locales.
3. **Commit:** Mensaje descriptivo siguiendo Conventional Commits.
4. **Push:** Subir a la rama correspondiente.
5. **Tag:** Usar Versionado Semántico (SemVer) para hitos en `main` (ej: `v1.0.0`).

## Automatización

- Todo `push` a `main` debe disparar el flujo de publicación automática en GitHub Actions.
