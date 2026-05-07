# Blueprint

Versión: **0.2.0**
Última actualización: 2026-05-06

Este blueprint es el contrato de cómo se construyen los proyectos del equipo y cómo
debe comportarse cualquier IA que escriba código sobre ellos (Antigravity, Claude,
Cursor, etc.). Es un conjunto de reglas, no un framework. No se ejecuta: se lee
y se obedece.

## Cómo se usa

1. Copiar la carpeta `.blueprint/` a la raíz del repositorio.
2. Configurar la IA del proyecto para que cargue como prompt de sistema el archivo
   `.blueprint/00-start-here/antigravity-master-prompt.md`. Ese archivo se
   encarga de incluir todo lo demás en el orden correcto.
3. Antes de empezar una tarea grande, usar el template correspondiente de
   `.blueprint/templates/prompts/`.
4. Antes de cerrar la tarea, pasar el checklist correspondiente de
   `.blueprint/templates/checklists/`.

## Cómo se actualiza

- Cada cambio sube el número de versión en `VERSION` y queda registrado en
  `CHANGELOG.md` con fecha y resumen.
- Cambios de reglas **BLOCKER** o cambios de stack requieren acuerdo explícito
  del equipo. No los toca la IA por su cuenta.
- Las reglas tienen severidad (ver `.blueprint/ai-instructions/rule-severity.md`).
  No todas las reglas pesan igual.

## Estructura

```
.blueprint/
├── 00-start-here/
│   └── antigravity-master-prompt.md   # entrada única para la IA
├── ai-instructions/
│   ├── ai-operating-rules.md
│   └── rule-severity.md               # cómo se interpreta cada regla
├── project-standards/
│   ├── stack.md
│   └── architecture.md
├── design-system/
│   ├── design-principles.md
│   ├── colors.md                      # tokens hex concretos
│   ├── typography.md                  # escala completa
│   ├── spacing.md                     # escala 4/8 px
│   ├── radius-elevation.md
│   ├── components.md
│   ├── layout.md
│   ├── grid-rules.md
│   ├── mobile-first.md
│   └── theme.example.ts               # tema MUI listo para copiar
├── docs/
│   ├── frontend/frontend-rules.md
│   ├── backend/backend-rules.md
│   ├── database/database-rules.md
│   ├── mobile/mobile-rules.md
│   ├── performance/performance-rules.md
│   ├── security/security-rules.md
│   ├── security/owasp-checklist.md
│   ├── testing/testing-rules.md
│   ├── deployment/deployment-rules.md
│   ├── git/git-rules.md
│   ├── conventions/
│   │   ├── naming.md
│   │   ├── http-errors.md
│   │   ├── api-error-format.md
│   │   ├── pagination.md
│   │   ├── dates-timezones.md
│   │   └── money.md
│   ├── observability/logging.md
│   ├── uploads/file-uploads.md
│   └── accessibility/a11y-rules.md
└── templates/
    ├── prompts/
    │   ├── create-new-screen.md
    │   ├── migrate-screen-to-design-system.md
    │   ├── create-new-endpoint.md
    │   ├── create-new-migration.md
    │   ├── bug-fix.md
    │   └── refactor.md
    ├── checklists/
    │   ├── new-feature-checklist.md
    │   ├── code-review-checklist.md
    │   └── definition-of-done.md
    └── files/
        └── env.example.md
```

## Filosofía en una línea

La IA actúa como un dev senior cuidadoso que primero entiende, después propone,
después modifica, después prueba, después resume. No como un generador
compulsivo de código.
