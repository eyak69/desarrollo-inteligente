# Prompt para bug fix

Bug a corregir: [TITULO]

## Antes de tocar código

La IA debe responder, **antes** de modificar nada:

1. **Reproducción.** Pasos exactos. Si no se puede reproducir, decirlo y proponer
   cómo obtener más datos antes de seguir.
2. **Diagnóstico.** Causa raíz, no síntoma. ¿Por qué pasa?
3. **Alcance.** ¿Hay otros lugares donde el mismo bug pueda manifestarse?
4. **Plan de fix.** Archivos a tocar, mínima superficie.
5. **Test que reproduce el bug.** Se escribe **primero** (red), antes del fix.

## Reglas

- [BLOCKER] Cambiar la **causa**, no maquillar el síntoma.
- [STRICT] Tocar la mínima cantidad de archivos posible.
- [STRICT] No mezclar refactor con bug fix. Si aparecen ganas de refactorizar,
  dejarlo en "pendientes" y abrir tarea aparte.
- [BLOCKER] El test de regresión queda en el repo.

## Al terminar

- Causa raíz en una línea.
- Archivos modificados.
- Test de regresión agregado.
- Cómo verificar (pasos manuales si aplica).
- Pendientes / sospechas para investigar después.
