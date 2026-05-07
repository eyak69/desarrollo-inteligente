# Prompt para crear migración de DB

Crear la migración: [DESCRIPCION_BREVE]

## Antes de codificar (obligatorio)

Leer:
- `/.blueprint/docs/database/database-rules.md`
- `/.blueprint/docs/conventions/naming.md`
- `/.blueprint/docs/conventions/dates-timezones.md` (si involucra fechas)
- `/.blueprint/docs/conventions/money.md` (si involucra dinero)

## Especificación

- Cambios estructurales:
  - Tablas a crear / modificar:
  - Columnas (nombre, tipo, nullable, default, FK):
  - Índices a crear:
  - Constraints (unique, check):
- Datos:
  - ¿Requiere backfill? ¿Cómo?
  - ¿Requiere seed?
- Compatibilidad:
  - ¿Es backwards compatible con la versión actual de la app?
  - ¿Necesita un deploy en dos fases (expand + contract)?

## Plan que la IA debe presentar

1. Archivo de migración `up` y `down`.
2. Estrategia para producción (cero downtime si la tabla es grande).
3. Riesgos (locks largos, FK que rompen inserts, default que reescribe la tabla).
4. Cómo probar (correr `up`, correr `down`, volver a correr `up`).

## Reglas no negociables

- [BLOCKER] Toda migración tiene su `down`.
- [BLOCKER] Tipos correctos: `DECIMAL` para dinero, `TIMESTAMP` UTC para instantes,
  `DATE` para fechas sin hora.
- [BLOCKER] FK indexadas.
- [BLOCKER] Columnas obligatorias en tablas críticas: `created_at`, `updated_at`,
  `created_by`, `updated_by`. `deleted_at` si hay borrado lógico.
- [BLOCKER] Naming: tablas en `snake_case` plural, columnas en `snake_case`.
- [STRICT] No hacer `ALTER` de columna con cambio de tipo en tablas grandes
  sin plan documentado.

## Al terminar

- Archivo de migración con `up` y `down`.
- Comando exacto para correrla.
- Plan de rollback en producción.
