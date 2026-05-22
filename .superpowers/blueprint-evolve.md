# Blueprint Evolve

## Rol
Actualizar el Blueprint cuando se aprende algo nuevo, cambia una decisión, o aparece un antipatrón. Solo toca archivos dentro de `.blueprint/`. Nunca toca código de la aplicación.

## Cuándo usarlo
- Después de resolver un problema no cubierto por el blueprint
- Cuando una decisión de arquitectura cambió
- Cuando encontraste un antipatrón que se repite
- Para registrar una excepción justificada a una regla STRICT

```
@blueprint-evolve agregar a Learning.md: los soft deletes deben filtrarse también en los índices de DB
@blueprint-evolve actualizar decision-log: decidimos usar cursor pagination para el feed de actividad
@blueprint-evolve nueva regla en frontend-rules: los modales siempre deben tener foco atrapado (STRICT)
```

---

## Protocolo de ejecución

### 1. Identificar el tipo de cambio

| Tipo | Destino |
|------|---------|
| Lección aprendida de una sesión | `Learning.md` |
| Decisión arquitectónica o de stack | `docs/decision-log.md` |
| Regla nueva en un dominio | Archivo `.md` del dominio correspondiente |
| Corrección de regla existente | Archivo `.md` donde está la regla |
| Antipatrón recurrente | `docs/conventions/troubleshooting.md` |

### 2. Leer el archivo destino antes de modificarlo

Siempre leer el archivo existente para:
- No duplicar contenido ya presente
- Respetar el formato y tono del documento
- Ubicar dónde insertar el nuevo contenido

### 3. Escribir con el formato correcto

**Learning.md** — entrada nueva al final:
```markdown
## Aprendizaje N — Título breve

**Contexto:** qué situación lo generó
**Lección:** qué se aprendió exactamente
**Regla derivada:** [STRICT/GUIDE] descripción de la regla
**Archivo afectado:** si corresponde actualizar otro doc del blueprint
```

**decision-log.md** — entrada nueva al final:
```markdown
## YYYY-MM-DD — Título de la decisión

### Contexto
Qué problema se quería resolver.

### Decisión
Qué se decidió.

### Motivo
Por qué se eligió esta opción.

### Consecuencias
Qué ventajas y riesgos trae.
```

**Regla nueva en un archivo existente** — agregar con severidad explícita:
```markdown
- [BLOCKER/STRICT/GUIDE] Descripción de la regla.
```

### 4. Actualizar índices si corresponde

- Si se crea un archivo nuevo en el blueprint → agregarlo a `index.md` y a `README.md`
- Si se agrega una sección importante → verificar que `index.md` la refleje

### 5. Confirmar el cambio

Al finalizar, reportar:
- Archivo(s) modificado(s) con path relativo
- Qué se agregó/cambió
- Si el cambio requiere sincronizar NotebookLM (usar `@notebooklm-connect` por separado)

---

## Restricciones absolutas

- Solo modificar archivos dentro de `.blueprint/`
- NO tocar código de la aplicación (`client/`, `server/`, etc.)
- NO reescribir secciones existentes sin indicación explícita — solo agregar o corregir puntualmente
- NO cambiar la severidad de reglas BLOCKER sin autorización explícita del humano
- NO eliminar entradas del `decision-log.md` ni del `Learning.md` — son registro histórico
- Si el cambio solicitado implica bajar una regla de BLOCKER a STRICT o GUIDE, **frenar y pedir confirmación**
