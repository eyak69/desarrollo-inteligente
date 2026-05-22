# Blueprint Enforce

## Rol
Auditar código existente contra las reglas del Blueprint. Reporta violaciones con severidad, archivo fuente de la regla y ubicación exacta en el código. No sugiere mejoras de estilo — solo reporta incumplimientos.

## Cuándo usarlo
- **Gate pre-commit:** antes de hacer commit de una feature
- **Gate pre-PR:** antes de abrir un pull request
- **Revisión puntual:** cuando sospechás que algo viola una regla
- **Onboarding:** para auditar código legacy antes de tocarlo

```
@blueprint-enforce
@blueprint-enforce client/src/features/ideas/
@blueprint-enforce server/src/routes/ideas.ts
@blueprint-enforce revisá el último commit
```

Sin argumento: audita todos los archivos modificados según `git status`.

---

## Protocolo de auditoría

### 1. Determinar el scope

- Si se pasó un path: auditar ese directorio o archivo
- Si se pasó "último commit" o similar: obtener lista de archivos con `git diff HEAD~1 --name-only`
- Sin argumento: obtener lista con `git status --short`

### 2. Leer los archivos de código del scope

Leer cada archivo identificado en el scope.

### 3. Leer las reglas relevantes del blueprint

Según los archivos en scope, leer los documentos del blueprint que aplican:

| Si el scope incluye | Leer reglas de |
|--------------------|---------------|
| `client/src/` | `docs/frontend/frontend-rules.md`, `docs/ui/notification-rules.md`, `design-system/components.md` |
| `server/src/routes/` | `docs/backend/backend-rules.md`, `docs/conventions/api-error-format.md`, `docs/conventions/http-errors.md` |
| `server/src/services/` | `docs/architecture/repository-rules.md`, `project-standards/architecture.md` |
| `server/src/repositories/` | `docs/architecture/repository-rules.md`, `docs/database/database-rules.md` |
| `*.migration.*` o `migrations/` | `docs/database/database-rules.md` |
| cualquier archivo | `docs/security/security-rules.md`, `docs/conventions/naming.md` |

### 4. Auditar y reportar

Para cada violación encontrada, reportar con este formato exacto:

```
[BLOCKER] window.confirm() en client/src/features/ideas/IdeasPage.tsx:42
  Regla: Prohibido usar window.confirm(). Usar ConfirmDialog del blueprint.
  Fuente: .blueprint/docs/ui/notification-rules.md

[STRICT] useState por campo en client/src/features/ideas/IdeaForm.tsx:15-28
  Regla: Los formularios deben usar useForm + zodResolver, no useState por campo.
  Fuente: .blueprint/docs/frontend/frontend-rules.md

[GUIDE] Comentario explicando QUÉ hace el código en server/src/services/ideas.ts:67
  Regla: Los comentarios solo deben explicar el PORQUÉ, no el QUÉ.
  Fuente: convención del equipo
```

### 5. Resumen final

Al terminar, mostrar:

```
## Resultado de auditoría

Archivos revisados: N
Violaciones encontradas: X

- BLOCKER: N  ← deben resolverse antes del commit
- STRICT:  N  ← deben resolverse o justificarse antes del PR
- GUIDE:   N  ← recomendaciones, pueden ignorarse con declaración

[APROBADO / REQUIERE CORRECCIONES]
```

Si hay BLOCKERs: el código **no puede commitearse** hasta resolverlos.
Si solo hay STRICTs: el desarrollador debe confirmar que los revisó antes del PR.
Si solo hay GUIDEs: puede continuar con una declaración en el resumen del PR.

---

## Restricciones absolutas

- NO modificar ningún archivo de código
- NO modificar ningún archivo del blueprint
- NO sugerir refactors más allá de lo que viola una regla
- NO opinar sobre estilo, performance ni legibilidad si no hay una regla explícita en el blueprint que lo cubra
- Si encontrás código potencialmente inseguro pero no hay regla explícita → reportarlo como observación separada fuera del listado principal
- Reportar ausencias también: si falta manejo de error donde el blueprint lo requiere, es una violación

---

## Integración con pre-commit (opcional)

Este skill puede correrse automáticamente desde un hook de Husky. El hook no llama al skill directamente (Claude Code no es un linter), pero el desarrollador puede correrlo manualmente como parte de su flujo antes de `git commit`.

Para flujo automático de linting técnico (ESLint, TypeScript), ver `.blueprint/docs/conventions/enforcement.md`.
