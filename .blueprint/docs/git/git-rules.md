# Reglas de Git y Control de Versiones

## Estrategia de Ramas

- [BLOCKER] **main:** Rama de producción. Solo código estable y probado. Nadie hace push directo — solo merges desde `develop` via PR aprobado con CI verde.
- [STRICT] **develop:** Rama de integración. Todo feature se merge aquí primero.
- [STRICT] **feature/\*:** Ramas temporales para tareas específicas. Formato: `feature/login-google`, `fix/orden-paginacion`, `chore/actualizar-deps`.

## Mensajes de Commit (Conventional Commits)

- [BLOCKER] Todo commit sigue el formato `tipo: descripción en minúscula`.
- [STRICT] No mezclar múltiples cambios no relacionados en un mismo commit.

| Tipo | Cuándo usarlo |
|------|--------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de error |
| `docs` | Cambios en documentación |
| `style` | Cambios de formato (no afectan lógica) |
| `refactor` | Cambio de código que no arregla error ni añade función |
| `test` | Agrega o modifica tests |
| `chore` | Tareas de mantenimiento (build, dependencias) |

Ejemplos válidos:
```
feat: agregar endpoint de creación de ideas
fix: corregir filtro de soft delete en listado
chore: actualizar dependencias de seguridad
```

## Ciclo de vida del commit

1. [STRICT] **Documentar excepciones:** Si el commit incluye una excepción a una regla `[STRICT]` o `[BLOCKER]`, actualizar `/.blueprint/Learning.md` antes del commit.
2. [BLOCKER] **Tests locales:** Ejecutar tests locales antes de hacer push. No pushear código con tests rotos.
3. [STRICT] **Commit atómico:** Cada commit representa un cambio coherente y compilable.
4. [STRICT] **Tag en hitos:** Usar SemVer (`v1.0.0`, `v1.1.0`) para releases en `main`.

## Automatización

- [BLOCKER] Todo `push` a `main` dispara el flujo de publicación automática en GitHub Actions.
- [BLOCKER] El pre-commit hook (Husky) no puede saltarse con `--no-verify` salvo emergencia documentada en `Learning.md`.
- [STRICT] Un PR a `main` o `develop` solo se puede mergear con CI verde y al menos una aprobación humana.
