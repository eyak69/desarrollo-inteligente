# Blueprint Watchdog

## Rol
Investigar en las fuentes oficiales de cada tecnología del stack: vulnerabilidades, CVEs, bugs críticos y breaking changes recientes. Si encuentra algo relevante y la versión instalada está afectada, lo registra en el blueprint.

## Cuándo usarlo
- Una vez por semana como rutina de mantenimiento
- Antes de actualizar dependencias
- Cuando sale una versión nueva de alguna tecnología del stack
- Cuando escuchás que hay un CVE o problema conocido en alguna lib

```
@blueprint-watchdog
@blueprint-watchdog react
@blueprint-watchdog ag-grid tanstack
```

Sin argumento: recorre todo el stack. Con argumento: foco en esa tecnología.

---

## Fuentes oficiales por tecnología

Consultar SIEMPRE estas URLs primero. No buscar en Google si la fuente oficial ya tiene la información.

### React
- Advisories: https://github.com/facebook/react/security/advisories
- Releases: https://github.com/facebook/react/releases

### TypeScript
- Advisories: https://github.com/Microsoft/TypeScript/security/advisories
- Releases: https://github.com/microsoft/typescript/releases

### Vite
- Advisories: https://github.com/vitejs/vite/security/advisories
- Releases: https://github.com/vitejs/vite/releases
- Changelog oficial: https://vite.dev/releases

### MUI / Material UI
- Advisories: https://github.com/mui/material-ui/security/advisories
- Releases: https://github.com/mui/material-ui/releases
- Changelog oficial: https://mui.com/material-ui/discover-more/changelog/

### AG Grid
- Advisories: https://github.com/ag-grid/ag-grid/security/advisories
- Releases: https://github.com/ag-grid/ag-grid/releases
- Changelog oficial: https://www.ag-grid.com/changelog/

### TanStack Query
- Advisories: https://github.com/TanStack/query/security/advisories
- Releases: https://github.com/tanstack/query/releases

### React Router
- Advisories: https://github.com/remix-run/react-router/security/advisories
- Releases: https://github.com/remix-run/react-router/releases
- Changelog oficial: https://reactrouter.com/changelog

### Node.js
- Vulnerabilidades: https://nodejs.org/en/blog/vulnerability
- Releases: https://nodejs.org/en/blog/release
- Advisories GitHub: https://github.com/nodejs/node/security/advisories

### Express
- Advisories: https://github.com/expressjs/express/security/advisories
- Releases: https://github.com/expressjs/express/releases

### Zod
- Advisories: https://github.com/colinhacks/zod/security
- Releases: https://github.com/colinhacks/zod/releases
- Release notes v4: https://zod.dev/v4

### Vitest
- Advisories: https://github.com/vitest-dev/vitest/security/advisories
- Releases: https://github.com/vitest-dev/vitest/releases

### Playwright
- Advisories: https://github.com/microsoft/playwright/security/policy
- Releases: https://github.com/microsoft/playwright/releases
- Release notes oficial: https://playwright.dev/docs/release-notes

### Docker
- Anuncios de seguridad: https://docs.docker.com/security/security-announcements/
- Docker Engine releases: https://docs.docker.com/engine/release-notes/
- Docker Compose releases: https://docs.docker.com/compose/releases/release-notes/

---

## Protocolo de investigación

### 1. Leer las versiones instaladas

Antes de buscar, leer `package.json` para saber qué versión exacta está en uso:

```bash
cat client/package.json
cat server/package.json
```

Anotar las versiones. Solo es relevante un CVE si la versión instalada está en el rango afectado.

### 2. Consultar las fuentes oficiales

Para cada tecnología en scope:

1. Ir a la página de **Advisories** de la tabla de arriba → revisar los últimos 90 días
2. Ir a la página de **Releases** → leer las notas de las últimas 2-3 versiones buscando `security`, `breaking`, `critical`
3. Si la tecnología tiene changelog oficial separado (AG Grid, MUI, Vite, React Router) → consultarlo también

### 3. Complementar con búsqueda web si las fuentes oficiales no son suficientes

Solo si los advisories oficiales no tienen información suficiente:
- Buscar `[tecnología] CVE [año actual]` en GitHub Advisory Database: https://github.com/advisories
- Buscar `[paquete npm] vulnerability` en Snyk: https://security.snyk.io

### 4. Filtrar lo relevante

Registrar solo si cumple al menos uno:
- CVE con CVSS ≥ 7.0 (High o Critical)
- Breaking change que afecta una API que el proyecto usa activamente
- Bug que causa pérdida de datos, corrupción de estado, o falla silenciosa
- Problema de seguridad conocido aunque no tenga CVE asignado aún

Descartar:
- CVEs de versiones fuera del rango instalado
- Breaking changes en features que el stack no usa
- Bugs de UI o performance sin impacto en seguridad o datos

### 5. Registrar en el blueprint

**Si se encuentra algo relevante**, agregar al final de `.blueprint/docs/conventions/troubleshooting.md`:

```markdown
## [Tecnología] — [Título breve del issue]

**Severidad:** CVE CVSS X.X / Breaking / Bug crítico
**Versiones afectadas:** X.X.X – X.X.X
**Versión instalada:** X.X.X ← verificado en package.json
**Estado:** Afectado / No afectado / Pendiente verificar
**Fuente oficial:** [URL exacta del advisory o release]

**Descripción:** Una línea de qué falla y bajo qué condición.

**Mitigación:**
- Acción concreta 1 (ej: actualizar a X.X.X)
- Workaround si la actualización no es posible inmediatamente

**Urgencia:** Actualizar ahora / Actualizar en próximo ciclo / Monitorear
**Registrado:** YYYY-MM-DD
```

Si el issue implica cambiar una regla del blueprint → también actualizar el archivo de reglas del dominio afectado usando el protocolo de `@blueprint-evolve`.

### 6. Reporte final

Mostrar siempre al terminar:

```
## Watchdog Report — YYYY-MM-DD

Scope: [tecnologías revisadas]
Versiones verificadas contra: client/package.json + server/package.json

### Crítico — acción inmediata (CVSS ≥ 9.0)
- [ítem o "Ninguno"]

### Alto — próximo ciclo (CVSS 7.0–8.9 o breaking change activo)
- [ítem o "Ninguno"]

### Informativo — monitorear
- [ítem o "Ninguno"]

### Sin issues
- [tecnologías limpias]

Blueprint actualizado: Sí — [qué se agregó a troubleshooting.md] / No
```

---

## Restricciones

- NO actualizar dependencias directamente — solo reportar y documentar
- NO modificar código de la aplicación
- Solo modificar `.blueprint/docs/conventions/troubleshooting.md` y, si aplica, el archivo de reglas del dominio afectado
- Si hay algo con CVSS ≥ 9.0, reportarlo al usuario antes de escribir en el blueprint — puede requerir acción fuera del flujo normal
- Citar siempre la URL exacta de la fuente oficial para cada issue
