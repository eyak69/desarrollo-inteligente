# Prompt para refactor

Refactor a realizar: [TITULO]

## Reglas duras

- [BLOCKER] Refactor = cambio interno **sin cambiar comportamiento**.
- [BLOCKER] Cobertura previa: si el código a refactorizar no tiene tests,
  primero se agregan tests de comportamiento, después se refactoriza.
- [BLOCKER] No cambiar APIs públicas, contratos de DB, ni shape de respuestas
  como parte del refactor. Si hace falta, abrir tarea aparte.
- [STRICT] No mezclar con bug fix ni con feature.

## Antes de tocar código

La IA debe presentar:

1. **Motivación.** Qué problema concreto resuelve este refactor.
2. **Alcance acotado.** Lista cerrada de archivos a tocar.
3. **Riesgos.** Qué cosas podrían romperse.
4. **Estrategia de tests.** Qué tests ya existen, cuáles agrega.
5. **Plan en pasos.** Idealmente, refactor en commits chicos verificables.

## Al terminar

- Tests siguen verdes.
- Cambios funcionales: **ninguno** (declararlo explícitamente).
- Diff de tamaño razonable. Si quedó gigante, sugerir partir en PRs.
- Pendientes.
