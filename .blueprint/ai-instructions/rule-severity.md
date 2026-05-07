# Severidad de reglas

No todas las reglas del blueprint pesan igual. Cada regla cae en uno de estos
tres niveles. Si una regla no declara su severidad, asumir **STRICT**.

## BLOCKER

Innegociable. La IA **no puede** saltarla bajo ningún argumento, ni siquiera con
autorización humana en el chat. Para cambiar una regla BLOCKER hay que editar
el blueprint y subir versión.

Son siempre BLOCKER:

- Todas las reglas de `docs/security/security-rules.md`.
- Todas las reglas de `docs/security/owasp-checklist.md`.
- Reglas que afectan dinero, permisos, autenticación, datos personales, o
  acceso a recursos de otro usuario.
- Reglas explícitas del stack en `project-standards/stack.md` (no cambiar
  framework, no agregar librerías sin permiso).
- "No usar localStorage para tokens".
- "No exponer secretos / no commitear `.env`".
- "Validar permisos en backend".
- "SQL siempre parametrizado".
- "Toda migración debe tener `down`".

## STRICT

La regla aplica por defecto. Para desviarse, la IA debe:

1. Explicar el motivo concreto en el plan, antes de tocar código.
2. Pedir confirmación explícita al humano que pidió la tarea.
3. Dejar registrada la excepción en el commit y en `Learning.md`.

Son STRICT por defecto:

- Reglas de arquitectura (capas, ubicación de archivos).
- Convenciones de naming, paginación, formato de errores, manejo de fechas.
- "Mobile-first en toda pantalla".
- "Componentes oficiales del DS".
- "Manejar loading / empty / error / success".

## GUIDE

Recomendación fuerte. La IA se puede desviar si el contexto lo justifica,
pero debe **declarar** que se desvió y por qué en el resumen final.

Son GUIDE por defecto:

- Recomendaciones de performance que no son críticas (ej: prefetching).
- Sugerencias de UX que no afectan accesibilidad ni seguridad.
- Patrones internos de organización de código dentro de un feature.

## Cómo se marca

Cuando una regla específica de un archivo necesite severidad distinta a la
default del documento, se marca con `[BLOCKER]`, `[STRICT]` o `[GUIDE]` al
inicio de la regla. Ejemplo:

```
- [BLOCKER] No guardar JWT en localStorage.
- [STRICT] Mobile-first.
- [GUIDE] Prefetch de detalle al hacer hover.
```

## Resolución de conflictos

Si dos reglas se contradicen:

1. BLOCKER > STRICT > GUIDE.
2. Si dos reglas del mismo nivel se contradicen, gana la más específica.
3. Si siguen empatadas, gana la del documento más cercano al dominio
   (ej: `security-rules.md` para temas de auth).
4. Si nada de lo anterior resuelve, **frenar y preguntar al humano**.
