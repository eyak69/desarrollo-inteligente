# Superpowers — Skills de Claude Code

Skills disponibles para este proyecto. Se invocan escribiendo `@nombre-del-skill` en el chat de Claude Code.

---

## Blueprint

Skills para trabajar con la documentación interna del proyecto (`.blueprint/`).

### `@blueprint-consult`
**Cuándo:** Antes o durante el desarrollo, cuando tenés una duda sobre cómo hacer algo.

Consulta el blueprint y responde con la regla exacta, su severidad `[BLOCKER/STRICT/GUIDE]` y el archivo fuente. No toca ningún archivo. Si la respuesta no está en el blueprint, lo dice explícitamente en lugar de inventar.

```
@blueprint-consult ¿cómo estructuro el service para validar ownership?
@blueprint-consult ¿qué staleTime corresponde para datos transaccionales?
@blueprint-consult ¿cuándo usar ConfirmDialog vs toast con Undo?
```

---

### `@blueprint-enforce`
**Cuándo:** Gate obligatorio antes de hacer commit o abrir un PR.

Audita los archivos modificados (`git status`) contra las reglas del blueprint. Lista cada violación con severidad, ubicación exacta en el código y referencia al archivo del blueprint que se rompe. No modifica nada — solo reporta.

- **BLOCKER** encontrado → no commitear hasta corregir
- **STRICT** encontrado → justificar antes del PR
- **GUIDE** encontrado → puede continuar con declaración

```
@blueprint-enforce                        ← audita git status completo
@blueprint-enforce client/src/features/   ← audita un directorio
@blueprint-enforce server/src/routes/ideas.ts
```

---

### `@blueprint-evolve`
**Cuándo:** Después de resolver algo no cubierto por el blueprint, o cuando una decisión cambió.

Actualiza el blueprint con el aprendizaje: agrega entradas a `Learning.md`, registra decisiones en `decision-log.md`, agrega reglas nuevas a los archivos de dominio. Solo toca `.blueprint/` — nunca el código de la app.

```
@blueprint-evolve agregar a Learning.md: los índices de DB también deben filtrar soft deletes
@blueprint-evolve registrar en decision-log: decidimos usar cursor pagination para el feed
@blueprint-evolve nueva regla en frontend-rules: los modales deben tener foco atrapado [STRICT]
```

---

### `@blueprint-watchdog`
**Cuándo:** Una vez por semana, antes de actualizar dependencias, o cuando sale una versión nueva del stack.

Consulta las fuentes oficiales de seguridad de cada tecnología del stack (GitHub Security Advisories, changelogs oficiales). Filtra CVEs que afecten las versiones instaladas, breaking changes activos y bugs críticos. Registra los issues relevantes en `.blueprint/docs/conventions/troubleshooting.md`.

```
@blueprint-watchdog             ← revisa todo el stack
@blueprint-watchdog vite        ← foco en una tecnología
@blueprint-watchdog ag-grid tanstack
```

---

### `@blueprint-patch`
**Cuándo:** Después de correr `@blueprint-watchdog` y encontrar issues, o antes de un deploy.

Lee los issues del watchdog, evalúa el **riesgo real** cruzando la severidad del CVE con la exposición actual de la app (localhost vs red local vs internet), y propone la acción correcta calibrada al contexto.

Opera en dos modos:
- **Patch** — correcciones quirúrgicas (1-3 archivos, config, flags). Muestra el diff y espera confirmación antes de aplicar.
- **Migration** — actualización de major version. Genera un plan detallado con archivos afectados, riesgos y rollback. Espera aprobación explícita antes de tocar cualquier cosa.

```
@blueprint-patch                ← procesa todos los issues pendientes
@blueprint-patch vite           ← foco en una tecnología
@blueprint-patch migrations     ← solo las migraciones de major version
```

---

## Integraciones externas

### `@notebooklm-connect`
**Cuándo:** Para sincronizar el blueprint con el notebook de NotebookLM, o para consultar documentación via IA de Google.

Maneja la instalación, autenticación (vía Chrome DevTools Protocol) y operación del cliente NotebookLM. Cubre el flujo completo desde setup inicial hasta agregar fuentes y chatear con el notebook.

```
@notebooklm-connect             ← listar notebooks disponibles
@notebooklm-connect sync        ← subir blueprint actualizado al notebook
```

---

## Flujo recomendado

```
Arrancar feature
  └─ @blueprint-consult ¿cómo hago X?

Desarrollar

Gate pre-commit
  └─ @blueprint-enforce
       ├─ Sin issues → commitear
       ├─ STRICT → justificar y commitear
       └─ BLOCKER → corregir primero

Si aprendiste algo nuevo
  └─ @blueprint-evolve → registrar

Mantenimiento semanal
  └─ @blueprint-watchdog
       └─ Si hay issues → @blueprint-patch
            ├─ Patch → confirmar y aplicar
            └─ Migration → revisar plan → aprobar → ejecutar
```
