# Fechas y zonas horarias

## Reglas duras

- [BLOCKER] **DB siempre en UTC.** Tipo `TIMESTAMP` (MySQL/MariaDB) o `TIMESTAMP WITH TIME ZONE` (Oracle), guardando UTC.
- [BLOCKER] **API siempre en ISO 8601 con offset.** Ejemplo: `"2026-05-06T14:30:00Z"` o `"2026-05-06T11:30:00-03:00"`.
- [BLOCKER] **Frontend convierte a la TZ del usuario para mostrar.** Nunca asume TZ del servidor.
- [STRICT] La TZ del usuario sale de su perfil; si no hay, usar `Intl.DateTimeFormat().resolvedOptions().timeZone`.

## Tipos

| Concepto              | Tipo en DB        | Tipo en API           |
|-----------------------|-------------------|-----------------------|
| Instante              | `TIMESTAMP` (UTC) | string ISO con offset |
| Fecha sin hora (DOB)  | `DATE`            | `"YYYY-MM-DD"`        |
| Hora sin fecha        | `TIME`            | `"HH:mm:ss"`          |

- [STRICT] No usar `TIMESTAMP` para fechas que conceptualmente no tienen hora
  (cumpleaños, vencimiento contable). Usar `DATE`.

## Formato de display

- [STRICT] Usar `Intl.DateTimeFormat` con la locale del usuario. No formatear
  con strings manuales tipo `"DD/MM/YYYY"`.
- [STRICT] Mostrar TZ junto al timestamp solo cuando sea ambiguo
  (logs, auditoría, eventos cross-país).

## Comparaciones y rangos

- [BLOCKER] Filtros "del día X" se traducen en backend a un rango
  `[X 00:00 TZ_usuario, X+1 00:00 TZ_usuario]` convertido a UTC. No comparar
  con `DATE(timestamp)` sin TZ.
- [STRICT] El backend recibe la TZ del usuario en la query o en un header
  `X-User-Timezone` cuando importa.

## Librerías

- [GUIDE] `date-fns` o `luxon` permitidos para operar fechas.
  No usar `moment.js` (deprecado, pesado).
- [STRICT] Si ya hay una librería elegida en el proyecto, no agregar otra.
