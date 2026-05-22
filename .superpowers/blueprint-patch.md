# Blueprint Patch

## Rol
Leer los issues registrados por `@blueprint-watchdog` en `troubleshooting.md`, evaluar el riesgo real según la exposición actual de la app, y aplicar correcciones o proponer planes de migración con urgencia calibrada al contexto.

## Cuándo usarlo
- Después de correr `@blueprint-watchdog` y encontrar issues
- Antes de un deploy a producción
- Cuando querés saber si un CVE realmente te afecta dado cómo está desplegada tu app

```
@blueprint-patch
@blueprint-patch vite
@blueprint-patch migrations
```

Sin argumento: procesa todos los issues pendientes del watchdog. Con argumento: foco en esa tecnología o tipo.

---

## Protocolo de ejecución

### Paso 1 — Leer los issues del watchdog

Leer `.blueprint/docs/conventions/troubleshooting.md`, sección "Watchdog — Vulnerabilidades y Breaking Changes". Identificar todos los items con estado **AFECTADO** o **pendiente verificar**.

### Paso 2 — Evaluar exposición real de la app

Leer los siguientes archivos para entender cómo está desplegada:

| Archivo | Qué revela |
|---|---|
| `vite.config.ts` | Si el dev server está expuesto en red (`server.host`) |
| `docker-compose.yml` / `docker-compose.prod.yml` | Puertos expuestos, redes, entornos |
| `.env.example` | Variables que indican el entorno de deploy |
| `package.json` scripts | Cómo se corre el dev server, si hay `--host` |
| `.blueprint/docs/deployment/deployment-rules.md` | Reglas de deploy del proyecto |

### Paso 3 — Clasificar cada issue por riesgo real

Para cada issue encontrado, calcular el **Riesgo Efectivo** combinando severidad del CVE con la exposición:

```
Riesgo Efectivo = Severidad del CVE × Exposición real

Exposición:
  ALTA   → app o dev server accesible desde internet o red corporativa abierta
  MEDIA  → dev server accesible en red local / VPN / LAN
  BAJA   → localhost únicamente, sin --host, sin túneles

Resultado:
  CVE Critical + Exposición ALTA   → EMERGENCIA: parchear antes de cualquier otra cosa
  CVE Critical + Exposición MEDIA  → URGENTE: parchear en 24-48h
  CVE Critical + Exposición BAJA   → IMPORTANTE: parchear en el próximo ciclo
  CVE High     + Exposición ALTA   → URGENTE: parchear en 48-72h
  CVE High     + Exposición MEDIA  → IMPORTANTE: parchear en próximo ciclo
  CVE High     + Exposición BAJA   → MONITOREAR: documentar y planificar
  Breaking change (sin CVE)        → PLANIFICAR: no hay urgencia de seguridad
```

### Paso 4 — Determinar el tipo de corrección

Para cada issue clasificado, determinar si aplica **Modo Patch** o **Modo Migration**:

#### Modo Patch (ejecución automática con confirmación)
Aplica cuando la corrección es quirúrgica: 1-3 archivos, sin cambios de API, bajo riesgo de regresión.

Ejemplos:
- Agregar `server.host: 'localhost'` en `vite.config.ts`
- Agregar `Content-Security-Policy` en el reverse proxy config
- Cambiar un flag en `tsconfig.json`
- Agregar `--host` a un script en `package.json`

**Flujo:**
1. Mostrar exactamente qué va a cambiar (diff)
2. Explicar por qué ese cambio mitiga el CVE
3. Pedir confirmación explícita antes de escribir
4. Aplicar el cambio
5. Registrar en `Learning.md` si se aprendió algo no obvio

#### Modo Migration (plan + aprobación antes de tocar código)
Aplica cuando la corrección requiere actualizar una major version o cambiar múltiples APIs.

Ejemplos:
- Vite 5 → 6 (breaking changes en config y plugins)
- MUI 5 → 9 (CSS classes y props eliminadas)
- Zod 3 → 4 (API de errores y métodos cambiados)
- AG Grid 31 → 35 (theming, filters, tree data)
- TypeScript 5 → 6 (defaults de tsconfig)

**Flujo:**
1. Listar los breaking changes que afectan al código del proyecto (leer los archivos reales, no suponer)
2. Estimar impacto: cuántos archivos se tocan, qué tan invasivo es
3. Evaluar si la migración es **necesaria ahora** o puede esperar, basado en el Riesgo Efectivo
4. Presentar el plan con secciones:

```
## Plan de migración: [Tecnología] vX → vY

### ¿Por qué ahora?
[Riesgo Efectivo calculado + exposición de la app]

### ¿Puede esperar?
[Sí / No — con justificación basada en la exposición]

### Archivos afectados
- [archivo]: [qué cambia]
- [archivo]: [qué cambia]

### Pasos en orden
1. Actualizar dependencia en package.json
2. [cambio específico en archivo X]
3. [cambio específico en archivo Y]
4. Correr build y tests para verificar

### Riesgos
- [riesgo 1]: [cómo mitigarlo]
- [riesgo 2]: [cómo mitigarlo]

### Rollback
[Cómo revertir si algo falla]
```

5. **Esperar aprobación explícita** ("sí", "hacelo", "adelante") antes de tocar cualquier archivo
6. Una vez aprobado, ejecutar paso a paso, no todo de una

---

## Reporte de evaluación (siempre antes de actuar)

Antes de aplicar cualquier cambio, mostrar:

```
## Blueprint Patch — Evaluación [fecha]

### Exposición detectada
- Dev server: [localhost / red local / red abierta]
- Deploy: [Docker local / servidor expuesto / no detectado]
- Fuente: [archivos leídos]

### Issues evaluados

| Issue | CVE/Tipo | Severidad | Exposición | Riesgo Efectivo | Modo |
|-------|----------|-----------|------------|-----------------|------|
| Vite CVEs | High 8.2 | High | localhost | MONITOREAR | Patch |
| Vitest RCE | Critical 9.6 | Critical | localhost | IMPORTANTE | Patch |
| TS 6.0 | Breaking | — | — | PLANIFICAR | Migration |

### Acción propuesta
[descripción de lo que se va a hacer, en orden de prioridad]

¿Confirmar y ejecutar? (esperando respuesta)
```

---

## Restricciones absolutas

- NUNCA aplicar cambios de Modo Patch sin mostrar el diff primero y recibir confirmación
- NUNCA iniciar una Migration sin plan aprobado explícitamente
- NO actualizar `package.json` directamente — indicar el comando exacto para que el dev lo corra (`npm install [paquete]@[versión]`)
- NO tocar archivos del blueprint (eso es rol de `@blueprint-evolve`)
- Si la evaluación de exposición es ambigua (no hay suficiente info en los archivos), preguntar al usuario antes de calcular el Riesgo Efectivo
- Si hay un EMERGENCIA (Critical + Exposición ALTA), reportarlo inmediatamente antes de cualquier otra cosa en el reporte
