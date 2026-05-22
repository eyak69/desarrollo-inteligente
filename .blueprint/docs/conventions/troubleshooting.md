# Troubleshooting — Problemas frecuentes

Soluciones a los errores y preguntas más comunes del proyecto.

---

## TypeScript

### `Type 'X' is not assignable to type 'Y'`
Verificar que el tipo del repositorio (`XDB`) no esté saliendo de la capa de datos. El controller y el service deben recibir el tipo de dominio (`X`) o un DTO (`XDTO`), no el tipo de DB.

### `Object is possibly 'undefined'`
Con `strict: true`, TypeScript no permite acceder a propiedades de valores que pueden ser `null` o `undefined` sin chequeo previo. Usar optional chaining (`?.`) o un guard explícito. No usar `as X` para silenciar el error.

### `No overload matches this call` en `useForm`
Verificar que el tipo genérico de `useForm<T>` coincide con el tipo inferido del schema Zod: `type T = z.infer<typeof schema>`.

---

## TanStack Query

### Los datos no se actualizan después de una mutación
Falta invalidar el query key correspondiente en `onSuccess`:
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['nombre-del-recurso'] });
}
```

### `isLoading` siempre es `false`
En TanStack Query v5, `isLoading` fue renombrado a `isPending`. Usar `isPending`.

### El componente muestra datos viejos al volver a la pantalla
El `staleTime` configurado es mayor al tiempo transcurrido. Para datos transaccionales, usar `staleTime: 0` o un valor bajo (≤30s). Ver [frontend-rules.md](../frontend/frontend-rules.md).

---

## Formularios (React Hook Form)

### Los errores de validación no aparecen
Verificar que el campo está registrado con `{...register('nombreCampo')}` y que `errors.nombreCampo?.message` está siendo pasado como `helperText` al componente.

### El submit no llama a `onSubmit`
Si hay errores de validación, `handleSubmit` bloquea el submit. Revisar la consola de React — puede haber errores de schema Zod que no se están mostrando. También verificar que el `<form>` tiene `onSubmit={handleSubmit(onSubmit)}`.

### `zodResolver` no valida correctamente
Verificar que `@hookform/resolvers` está instalado (`npm list @hookform/resolvers`) y que se importa correctamente: `import { zodResolver } from '@hookform/resolvers/zod'`.

---

## Base de datos / Soft Delete

### Un listado muestra registros borrados
El método `getAll()` del repositorio no está filtrando `deleted_at IS NULL`. Verificar que el repositorio extiende `BaseRepository` y no sobreescribe `getAll()` sin el filtro.

### Error de unicidad al crear un registro con email ya existente (borrado)
El email existe en un registro con `deleted_at` no nulo. Dos opciones:
1. Usar índice compuesto `(email, deleted_at)` para permitir el mismo email en registros borrados.
2. Verificar la existencia incluyendo borrados y decidir si reactivar el registro o rechazar la operación.

### Las migraciones fallan en producción
1. Verificar que la migración tiene tanto `up` como `down`.
2. Correr `knex migrate:status` para ver cuáles migraciones están pendientes.
3. Nunca editar una migración ya ejecutada en producción — crear una migración nueva.

---

## ESLint / Pre-commit

### El pre-commit hook no se ejecuta
Verificar que Husky está instalado: `npm run prepare` desde la raíz. Si el hook existe pero no corre, verificar permisos: `chmod +x .husky/pre-commit`.

### `react-hooks/exhaustive-deps` warning en `useEffect`
Agregar la dependencia faltante al array o, si la dependencia es una función, envolverla en `useCallback`. No suprimir el warning con `// eslint-disable` sin entender la causa.

### `no-explicit-any` error
Reemplazar `any` con el tipo correcto. Si el tipo viene de una librería externa sin types, usar `unknown` y hacer un type guard. Si es absolutamente inevitable, documentar el motivo en un comentario una línea antes del `eslint-disable`.

---

## Paginación

### `page=0` devuelve resultados incorrectos
La paginación es **1-based**: `page=1` es la primera página. El offset se calcula como `(page - 1) * pageSize`. Si `page=0` llega al backend, Zod debe rechazarlo con `z.number().int().min(1)`.

### AG Grid muestra página vacía al cargar
AG Grid server-side envía `startRow=0` para la primera página. Convertir a `page=1` con `Math.floor(startRow / pageSize) + 1` en el adapter.

---

## Docker / Deploy

### El contenedor no levanta (healthcheck fallando)
Verificar que el endpoint `/health` responde 200 y que la DB está accesible desde dentro del contenedor. Revisar los logs: `docker logs <container_id>`.

### Las migraciones no corren en el deploy
El script de deploy debe ejecutar `npm run migrate` antes de iniciar el servidor. Verificar el orden en el `Dockerfile` o en el script de entrypoint.

### Variables de entorno no disponibles en el contenedor
Las variables deben inyectarse en runtime, no en la imagen. Verificar que el `docker-compose.yml` o el orquestador tiene las variables configuradas. Nunca incluirlas en el `Dockerfile`.

---

## Watchdog — Vulnerabilidades y Breaking Changes

*Última revisión: 2026-05-22*

---

### Node.js — Fin del Ciclo de Vida (EOL) de Node 20

**Severidad:** Media / Deuda técnica (Arquitectura y seguridad)
**Versiones afectadas:** Node.js v20.x y anteriores
**Versión instalada:** Node.js v20.x (definida en docker-compose y Dockerfile usando `node:20-slim`)
**Estado:** **AFECTADO**
**Fuente oficial:** [Node.js Release Schedule](https://nodejs.org/en/blog/release)

**Descripción:** Node.js 20 alcanzó oficialmente su fin de ciclo de vida (EOL) el 30 de abril de 2026. A partir de esta fecha, ya no recibe parches de seguridad, corrección de errores ni actualizaciones oficiales por parte de la comunidad.

**Mitigación:**
- Planificar la migración a Node.js 22 LTS (LTS activa y soportada en 2026).
- En el próximo ciclo de mantenimiento, actualizar los archivos [client/Dockerfile](file:///c:/Users/Cristian/OneDrive/Antigravity/desarrollo%20inteligente/client/Dockerfile) y [server/Dockerfile](file:///c:/Users/Cristian/OneDrive/Antigravity/desarrollo%20inteligente/server/Dockerfile) para usar la imagen base `FROM node:22-slim`.

**Urgencia:** Planificar migración en próximo ciclo.

---

### Vite / Vitest — Conflicto e Incompatibilidad de Peer Dependencies (DX)

**Severidad:** Deuda técnica y consistencia de desarrollo (DX)
**Versiones afectadas:** Vitest v4.x y Vite v5.x
**Versión instalada:** Vitest `4.1.5` / Vite `5.4.21` (verificado en package.json y lockfiles)
**Estado:** **AFECTADO**
**Fuente oficial:** [Vitest GitHub Releases](https://github.com/vitest-dev/vitest/releases)

**Descripción:** La versión de Vitest `4.1.5` instalada en el monorepo declara explícitamente en sus peer dependencies a `"vite": "^6.0.0 || ^7.0.0 || ^8.0.0"`. Sin embargo, el frontend utiliza `"vite": "^5.2.12"` (resuelta a `5.4.21`). Esto genera un conflicto de dependencias que impide ejecuciones limpias de `npm install` sin forzar la instalación (`--legacy-peer-deps` o `--force`), violando la Regla 14 de DX.

**Mitigación:**
- **Opción A (Recomendada):** Actualizar el ecosistema del frontend a Vite 6.x para restablecer la coherencia con Vitest 4.x.
- **Opción B:** Realizar downgrade de `vitest` a la versión `3.0.5` o posterior de la rama v3 (que da soporte a Vite 5.x) para limpiar los warnings de npm.

**Urgencia:** Planificar actualización/downgrade en próximo ciclo de dependencias.

---

### Vite — Vulnerabilidades en Dev Server (CVE-2025-31125 / CVE-2026-39363 / CVE-2026-39364)

**Severidad:** Informativa (No afectado actualmente)
**Versiones afectadas:** 
- CVE-2025-31125: Vite v5 < 5.4.16, v6 < 6.0.13/6.1.3/6.2.4
- CVE-2026-39363 y CVE-2026-39364: Vite v6 < 6.4.2, v7 < 7.3.2, v8 < 8.0.5
**Versión instalada:** Vite `5.4.21` (verificado en package-lock.json)
**Estado:** **NO AFECTADO** (parchada en la rama v5 desde la 5.4.16; las de v6/v7/v8 no afectan a la v5)
**Fuente oficial:** [Vite Security Advisories](https://github.com/vitejs/vite/security/advisories)

**Descripción:** Vulnerabilidades que permiten leer archivos arbitrarios de la máquina de desarrollo a través del WebSocket del dev server o saltarse restricciones de `server.fs.deny` inyectando query params específicos (`?raw`, `?inline`).

**Mitigación:**
- Aunque la versión instalada actual (5.4.21) tiene los parches del CVE-2025-31125, se debe evitar configurar `server.host` para exponer el servidor a la red si no es necesario.
- Si se actualiza a Vite 6.x en el futuro, se debe migrar directamente a una versión segura (v6.4.2 o superior) para no introducir CVE-2026-39363/4.

**Urgencia:** Monitorear durante futuros upgrades.

---

### AG Grid — Prototype Pollution en deep merge (CVE-2024-38996)

**Severidad:** Informativa (No afectado actualmente)
**Versiones afectadas:** AG Grid <= 31.3.2
**Versión instalada:** `31.3.4` (verificado en client/package-lock.json para `ag-grid-community` y `ag-grid-react`)
**Estado:** **NO AFECTADO** (el lockfile resolvió la versión v31.3.4 que contiene la mitigación)
**Fuente oficial:** [AG Grid Security Advisories](https://github.com/ag-grid/ag-grid/security/advisories)

**Descripción:** Una falla en la función `_.mergeDeep` permite a un atacante inyectar propiedades maliciosas (`__proto__`), resultando en Denegación de Servicio (DoS) o potencial Ejecución de Código Arbitrario si se procesan datos no sanitizados del usuario.

**Mitigación:**
- Mantener la versión instalada en v31.3.4+. No degradar dependencias de AG Grid a versiones inferiores a 31.3.3.

**Urgencia:** Monitorear.

---

### Express / path-to-regexp — Regular Expression Denial of Service (CVE-2026-4867)

**Severidad:** Informativa (No afectado actualmente)
**Versiones afectadas:** path-to-regexp < 0.1.13
**Versión instalada:** `0.1.13` (resuelta de forma transitiva a través de `express` v4.22.1 en server/package-lock.json)
**Estado:** **NO AFECTADO**
**Fuente oficial:** [path-to-regexp Security Advisories](https://github.com/pillarjs/path-to-regexp/security/advisories)

**Descripción:** ReDoS de alta severidad (CVSS 7.5) que causa backtracking catastrófico si se configuran rutas con 3 o más parámetros en un solo segmento (ej: `/:a-:b-:c`) cuando el servidor procesa URLs maliciosas.

**Mitigación:**
- Asegurar que la dependencia transitiva `path-to-regexp` esté bloqueada en `0.1.13` o superior en el lockfile.
- Evitar rutas con 3 o más parámetros dinámicos adyacentes por segmento de red.

**Urgencia:** Monitorear.
