# Blueprint Maestro de Desarrollo Inteligente

Este documento registra la evolución técnica, los errores detectados y las decisiones de alto nivel tomadas durante el desarrollo de este entorno de ideación y base para futuros sistemas.

---

## [2026-05-06] - Inicialización y Consolidación del Blueprint

### 🏛️ Decisiones de Arquitectura

1.  **Encapsulación en `.blueprint/`**:
    - **Decisión:** Se movieron todas las carpetas de gobernanza (`docs`, `design-system`, `project-standards`, etc.) a un directorio oculto llamado `.blueprint/`.
    - **Motivo:** Reducir el ruido cognitivo en la raíz del proyecto y facilitar la portabilidad del estándar a otros repositorios.
    - **Riesgo:** Requiere actualización de rutas en los prompts de IA.

2.  **Integración de Stitch como Fuente de Verdad Visual**:
    - **Decisión:** Se estableció **Stitch** como la herramienta mandatoria para el diseño de interfaces.
    - **Motivo:** Garantizar que la IA no improvise estilos y que el prototipado mobile-first sea riguroso antes de codificar.

3.  **Login Mixto (Hybrid Auth)**:
    - **Decisión:** Se integró el soporte para Google OAuth junto con Email/Password.
    - **Motivo:** Necesidad de modernizar el acceso manteniendo la soberanía de los datos mediante una vinculación de cuentas por email.

4.  **Automatización de Despliegue (CI/CD)**:
    - **Decisión:** Se definió el uso de GitHub Actions para el despliegue automático a producción tras el merge en `main`.
    - **Motivo:** Cumplir con la Regla 14 de reproducibilidad y despliegue rápido.

### 🔒 Seguridad y Eficiencia

1.  **Blindaje de Sesiones:** Se reforzó el uso de Cookies `httpOnly`, `secure` y `sameSite`. Se prohibió explícitamente el uso de `localStorage` para tokens JWT.
2.  **Protección contra Fuerza Bruta:** Se añadió la obligatoriedad de **Rate Limiting** en todos los endpoints sensibles.
3.  **Sincronización de Base de Datos:** Se estableció que una tarea no está "Terminada" hasta que las **Migraciones** hayan sido ejecutadas y validadas en el servidor de producción.

### 💡 Aprendizajes y "Gotchas"

- **Riesgo de Rutas Relativas:** Al mover las carpetas a `.blueprint/`, los prompts de sistema deben ser actualizados inmediatamente para evitar que la IA "alucine" archivos inexistentes.
- **Downtime por Migraciones:** Se identificó que las migraciones en tablas masivas requieren una estrategia de "Online Migrations" para no bloquear la producción.

---

## [2026-05-06] - Instalación de la Base (v0.2.1)

### 🏛️ Decisiones de Arquitectura

1.  **Conectividad Híbrida (Docker-Host)**:
    - **Decisión:** El backend se configuró para usar `host.docker.internal` al conectar con MariaDB.
    - **Motivo:** Permitir el uso de la base de datos MariaDB instalada localmente por el usuario (`localhost`) desde contenedores Docker.

2.  **Stack Frontend Pro:**
    - **Decisión:** Se inicializó el cliente con MUI, AG Grid y TanStack Query.
    - **Motivo:** Cumplir con la capacidad de manejo de grandes volúmenes de datos y UI empresarial desde el inicio.

### 🔒 Seguridad y Eficiencia

1.  **Validación de Entorno con Zod:** El servidor no arranca si faltan variables críticas en el `.env`. Esto previene fallos silenciosos en producción.
2.  **Zero Trust en DB:** Las credenciales nunca tocan el código; se inyectan vía `process.env`.

---

## [2026-05-06] - Laboratorio de Ideas: ABM y Persistencia (v0.3.0)

### 🏛️ Decisiones de Arquitectura

1.  **Orquestación de Base de Datos**:
    - **Decisión:** Se implementó un script de inicialización (`create-db.js`) que asegura la existencia de la base de datos antes de las migraciones.
    - **Motivo:** Evitar fallos de despliegue en entornos nuevos o recreados (Regla 14).

2.  **CRUD con Estado Reactivo**:
    - **Decisión:** Uso de **TanStack Query Mutations** para el ABM.
    - **Motivo:** Mantener la UI (AG Grid) sincronizada con el servidor sin recargas forzadas.

---

## [2026-05-06] - UI Premium Obsidian y Resiliencia (v0.7.0)

### 🏛️ Decisiones de Arquitectura

1.  **Arquitectura Dual Responsiva**: Sustitución de AG Grid en móviles por **Obsidian Cards** (Stitch ID `7c76`) para una experiencia táctil premium.
2.  **Resiliencia de Red**: Implementación de timeouts y validación de tipos para prevenir el error `EMPTY_RESPONSE` en conexiones híbridas Docker-Host.
3.  **Conectividad Híbrida**: Configuración de `host.docker.internal` para consumo de MariaDB nativo desde contenedores.

---

## [2026-05-07] - Infraestructura de Testing y Resiliencia (v0.8.0)

### 🏛️ Decisiones de Arquitectura

1.  **Unificación de Testing con Vitest**:
    - **Decisión:** Se adoptó **Vitest** como motor único de ejecución de pruebas para el monorepo (Client & Server).
    - **Motivo:** Velocidad de ejecución y compatibilidad nativa con TypeScript/ESM sin la sobrecarga de configuración de Jest.
2.  **Validación de Carga con k6**:
    - **Decisión:** Implementación de **k6** para pruebas de carga.
    - **Motivo:** Permite definir escenarios de carga mediante código JS, facilitando la integración en el ciclo de vida del desarrollador y CI/CD.
3.  **Implementación de Soft Delete (Borrado Lógico)**:
    - **Decisión:** Se sustituyó el borrado físico por una columna `deleted_at`.
    - **Motivo:** Preservar la integridad referencial y permitir la recuperación de datos ante errores accidentales del usuario.
4.  **Refactorización a Knex Query Builder**:
    - **Decisión:** Se abandonaron las consultas SQL raw en favor del Query Builder de Knex en el repositorio de ideas.
    - **Motivo:** Mejor manejo de valores opcionales (evitando errores de bindings indefinidos) y mayor seguridad contra inyecciones SQL.

### 🔒 Seguridad y Eficiencia

1.  **Protección de Datos en Test:** Se estableció la regla de no ejecutar pruebas de carga contra la base de datos de producción o desarrollo local sin un esquema de aislamiento (Uso de transacciones o DBs efímeras).
2.  **Índices para Soft Delete:** Se añadió un índice en la columna `deleted_at` para asegurar que las consultas de listado (filtrando nulos) mantengan un rendimiento O(log n).

### 💡 Aprendizajes y "Gotchas"

- **Impacto de Docker en Latencia:** Las pruebas de carga iniciales deben considerar que `host.docker.internal` añade un salto de red virtualizado que no representa fielmente el entorno de producción Cloud.
- **Fragilidad de SQL Raw:** El uso de `db.raw` con MySQL2 es propenso a errores si los objetos de entrada contienen campos opcionales (`undefined`). El Query Builder de Knex gestiona estos casos de forma más transparente convirtiendo `undefined` en `NULL` o simplemente omitiendo la columna si no es requerida.

---

## Próximos Pasos (Deuda Técnica)
- [x] Configurar el archivo `.github/workflows/deploy.yml`.
- [x] Ejecutar migraciones y seeds iniciales.
- [x] Sincronizar UI con Pantalla Final de Stitch (`7c76`).
- [x] Implementar **Soft Delete** en la tabla `ideas`.
- [x] Agregar un sistema de **Notificaciones (Toasts)** para feedback del ABM.
- [x] Implementar **Bottom Navigation** funcional.
- [x] Implementar política **Zero Interruption** (Acción Directa + Undo).
- [x] Blindar persistencia Docker (Volumes para Logs/Uploads).
- [/] Implementar cobertura de tests funcionales (>80% en servicios críticos).
- [ ] Implementar Smoke Tests de carga para endpoints de escritura.

---

## [2026-05-07] - Consolidación Zero Interruption y Estética Premium (v1.5.0)

### 🏛️ Decisiones de Arquitectura

1.  **Erradicación de Diálogos Nativos**:
    - **Decisión:** Prohibición absoluta de `alert()` y `confirm()`. Sustitución por **Acción Directa + Undo** y `ConfirmDialog` premium.
    - **Motivo:** Eliminar la fricción cognitiva y mejorar la percepción de velocidad de la app.
2.  **Estandarización de Generación (Stitch Maxima)**:
    - **Decisión:** Creación de un "Master Prompt" para Stitch.
    - **Motivo:** Asegurar que cualquier generación futura de la IA respete el estándar Obsidian Premium sin intervención manual constante.

### 🔒 Seguridad y Eficiencia

1.  **Persistencia Blindada (Docker)**: Se declararon volúmenes específicos para `/logs` y `/uploads` en el host. Esto cumple con la Regla 4 de "lo que no está en un volumen, no existe".

### 💡 Aprendizajes y "Gotchas"

- **Importaciones en Hot Reload:** Un error de importación (`alpha` de MUI) puede causar un "White Screen" instantáneo que es difícil de detectar si no se revisa la consola del navegador inmediatamente tras el despliegue. **Lección:** Siempre validar las importaciones al aplicar estilos de alto nivel.
- **Backdrop Filter Performance:** El uso masivo de `backdrop-filter: blur()` puede impactar el rendimiento en dispositivos móviles antiguos. Se debe monitorear el FPS en terminales de gama baja.

---

## [2026-05-08] - Interacción en Lote y Gobernanza de Selección (v1.6.0)

### 🏛️ Decisiones de Arquitectura

1.  **Regla de Lote (Batch Rule)**:
    - **Decisión:** Implementación de selección múltiple mandatoria para grillas y listas con borrado unificado.
    - **Motivo:** Cumplir con la necesidad del usuario de gestionar grandes volúmenes de datos con una sola confirmación (Eficiencia Operativa).
2.  **Confirmación de Seguridad Unificada**:
    - **Decisión:** Se unificó el borrado individual y masivo bajo el `ConfirmDialog` premium.
    - **Motivo:** Proteger al usuario de borrados accidentales sin romper la estética Obsidian.

### 🔒 Seguridad y Eficiencia

1.  **Barras Contextuales (Fixed HUD)**: Se implementó una barra de acciones que solo aparece cuando hay selección activa, reduciendo el ruido visual (Zero Distraction).
2.  **Mutaciones en Paralelo**: La mutación de borrado utiliza `Promise.all` para procesar múltiples IDs de forma eficiente hacia el backend.

### 💡 Aprendizajes y "Gotchas"

- **Gestión de Estado Complejo:** Mantener sincronizada la selección entre AG Grid (Desktop) y Cards (Mobile) requiere un estado de selección agnóstico a la vista.
- **Docker Build & Cache:** Al modificar dependencias o importaciones críticas, es imperativo correr `docker-compose up --build` para asegurar que el bundle de Vite se regenere correctamente (Regla 14).

---

## [2026-05-08] - Gobernanza Automatizada y Hard Gates (v2.0.0)

### 🏛️ Decisiones de Arquitectura

1.  **Gobernanza mediante Linter (Hard Gates)**:
    - **Decisión:** Implementación de **Husky** + **lint-staged** con reglas de bloqueo total para `alert`, `confirm` y `prompt`.
    - **Motivo:** Eliminar la dependencia de la "buena voluntad" del desarrollador. El sistema ahora impide físicamente que código no conforme llegue al repositorio (Regla 13).
2.  **Consolidación de Design Tokens**:
    - **Decisión:** Refactorización de `client/src/theme.ts` para centralizar los tokens de **Glassmorphism** y la paleta **Obsidian**.
    - **Motivo:** Prevenir la deriva visual. Cualquier cambio en la estética base se propaga automáticamente a toda la app.
3.  **Conversión Total a ESM (Modern Stack)**:
    - **Decisión:** Migración de todos los scripts de soporte (`create-db.js`, config files) a **ECMAScript Modules (ESM)**.
    - **Motivo:** Mantener coherencia con el estándar de Vite y Node 20+, eliminando el uso de `require()` (Regla 5).

### 🔒 Seguridad y Eficiencia

1.  **Diccionario de Datos (Regla 20)**: Se creó el `.blueprint/docs/database/database-dictionary.md` para documentar la semántica y el ciclo de vida de cada tabla, asegurando la trazabilidad a largo plazo.
2.  **Zero-Error Policy**: Se alcanzó un estado de "0 errores de linting" en todo el monorepo. Cualquier futura violación de las reglas de arquitectura (ej. uso de `any` injustificado) será detectada inmediatamente.
3.  **Sanitización de Node Globals**: Se configuró `languageOptions.globals` en ESLint para distinguir correctamente entre contextos de Navegador y Node, evitando falsos positivos de "undefined variables".

### 💡 Aprendizajes y "Gotchas"

- **Cascading Renders en React:** El uso de `useEffect` para inicializar estados de formularios desde props puede causar renders en cascada. **Solución:** Usar una `key` única en el componente para forzar un remount limpio cuando cambian los datos iniciales, eliminando la necesidad de efectos sincronizadores (Regla 12).
- **Corrupción de Archivos por Redirección:** En PowerShell, la redirección de salida (`>`) puede generar archivos en UTF-16LE, causando errores en herramientas que esperan UTF-8 (como los linters). **Lección:** Usar `-Encoding UTF8` o herramientas nativas de bash si es posible.
- **Resiliencia de Scripts de Inicio:** El script `create-db.js` debe ser idempotente. No basta con `CREATE DATABASE`, se debe usar `IF NOT EXISTS` para no romper el ciclo de despliegue continuo (Regla 14).

---

## [2026-05-08] - Remediación Arquitectónica (v2.1.0)

### 🏛️ Decisiones de Arquitectura

1.  **Centralización de Errores (AppError Pattern)**:
    - **Decisión:** Implementación de una clase `AppError` y un middleware global.
    - **Motivo:** Eliminar la inconsistencia de `res.status(500).json({})` dispersos por los controladores. Ahora la API responde con un formato predecible y códigos semánticos.
2.  **Validación vía Decorador (Middleware-First)**:
    - **Decisión:** Traslado de la validación Zod de los controladores a un middleware `validateBody`.
    - **Motivo:** Cumplir con el principio de Single Responsibility. El controlador solo recibe datos que el sistema ya garantiza como válidos.
3.  **Mapeo Estricto en Repositorios (DTO Pattern)**:
    - **Decisión:** El método `toDTO()` en el Repositorio es ahora el único punto de conversión `snake_case` -> `camelCase`.
    - **Motivo:** Proteger la lógica de negocio y el frontend de cambios estructurales en la base de datos (Regla 232).
4.  **Paginación Mandatoria (Regla 36)**:
    - **Decisión:** Refactorización de `BaseRepository` para incluir `getPaged` y forzar su uso en el endpoint de listado de ideas.
    - **Motivo:** Garantizar la escalabilidad y resiliencia del sistema ante el crecimiento de datos (Blocker Rule).

### 🔒 Seguridad y Eficiencia

1.  **Zero Error Policy (Refined)**: Se eliminaron advertencias de `any` en los componentes core de error y persistencia, sustituyéndolos por `unknown` y tipos de registro estrictos.
2.  **Fail-Fast Validation**: El sistema aborta la petición en el middleware de validación, ahorrando ciclos de CPU al no llegar nunca a la capa de servicio con datos corruptos.

### 💡 Aprendizajes y "Gotchas"

- **Contrato del Frontend:** Implementar paginación en el backend sin actualizar el frontend causa una ruptura inmediata (White Screen). **Lección:** Las remediaciones arquitectónicas en el monorepo deben ser atómicas y cubrir ambas capas simultáneamente.
- **Middleware Chain:** El middleware de errores DEBE ser el último en registrarse en Express (`app.use(errorMiddleware)` al final). Si se registra antes de las rutas, no captura ninguna excepción.

---

## [2026-05-08] - Corrección de Persistencia de Formulario y Estabilidad (v2.2.0)

### 🏛️ Decisiones de Arquitectura

1.  **Estrategia de Reinicio de Estado (Dynamic Key)**:
    - **Decisión:** Se implementó el uso de una `key` dinámica (`new-${dialogKey}`) para el componente `IdeaDialog` en `IdeasPage.tsx`.
    - **Motivo:** React reutiliza las instancias de los componentes si la `key` no cambia. Al forzar una `key` nueva cada vez que se abre el panel de "Nueva Idea", garantizamos que el componente se remonte desde cero, limpiando cualquier estado residual de cargas anteriores de forma nativa y eficiente.
    - **Alternativa Descartada:** Usar un `useEffect` para limpiar el estado manualmente es propenso a errores y genera un render adicional (flicker).

### 🔒 Seguridad y Eficiencia

1.  **Blindaje de Autocompletado**: Se añadió `autoComplete="off"` a los campos del formulario. Esto evita que el navegador persista datos en la caché visual del input, eliminando el "dato fantasma" reportado por el usuario.
2.  **Sincronización de Tipado en Queries**: Se corrigió el error `[object Object]` en las peticiones de `TanStack Query` asegurando que las funciones de consulta (`queryFn`) no reciban el objeto de contexto de React Query como primer argumento accidentalmente.

### 💡 Aprendizajes y "Gotchas"

- **Preservación de Estado en Diálogos:** En aplicaciones SPA, los diálogos que se abren/cierran sin desmontarse son el principal foco de fugas de datos (data leakage) entre formularios. La **Regla de Oro** es: Si el diálogo representa una entidad nueva cada vez, debe tener una `key` que lo identifique como tal para que React maneje el ciclo de vida por nosotros.

---
### 🔒 Seguridad y Eficiencia

1.  **Validación de Entorno con Zod:** El servidor no arranca si faltan variables críticas en el `.env`. Esto previene fallos silenciosos en producción.
2.  **Zero Trust en DB:** Las credenciales nunca tocan el código; se inyectan vía `process.env`.

---

## [2026-05-06] - Laboratorio de Ideas: ABM y Persistencia (v0.3.0)

### 🏛️ Decisiones de Arquitectura

1.  **Orquestación de Base de Datos**:
    - **Decisión:** Se implementó un script de inicialización (`create-db.js`) que asegura la existencia de la base de datos antes de las migraciones.
    - **Motivo:** Evitar fallos de despliegue en entornos nuevos o recreados (Regla 14).

2.  **CRUD con Estado Reactivo**:
    - **Decisión:** Uso de **TanStack Query Mutations** para el ABM.
    - **Motivo:** Mantener la UI (AG Grid) sincronizada con el servidor sin recargas forzadas.

---

## [2026-05-06] - UI Premium Obsidian y Resiliencia (v0.7.0)

### 🏛️ Decisiones de Arquitectura

1.  **Arquitectura Dual Responsiva**: Sustitución de AG Grid en móviles por **Obsidian Cards** (Stitch ID `7c76`) para una experiencia táctil premium.
2.  **Resiliencia de Red**: Implementación de timeouts y validación de tipos para prevenir el error `EMPTY_RESPONSE` en conexiones híbridas Docker-Host.
3.  **Conectividad Híbrida**: Configuración de `host.docker.internal` para consumo de MariaDB nativo desde contenedores.

---

## [2026-05-07] - Infraestructura de Testing y Resiliencia (v0.8.0)

### 🏛️ Decisiones de Arquitectura

1.  **Unificación de Testing con Vitest**:
    - **Decisión:** Se adoptó **Vitest** como motor único de ejecución de pruebas para el monorepo (Client & Server).
    - **Motivo:** Velocidad de ejecución y compatibilidad nativa con TypeScript/ESM sin la sobrecarga de configuración de Jest.
2.  **Validación de Carga con k6**:
    - **Decisión:** Implementación de **k6** para pruebas de carga.
    - **Motivo:** Permite definir escenarios de carga mediante código JS, facilitando la integración en el ciclo de vida del desarrollador y CI/CD.
3.  **Implementación de Soft Delete (Borrado Lógico)**:
    - **Decisión:** Se sustituyó el borrado físico por una columna `deleted_at`.
    - **Motivo:** Preservar la integridad referencial y permitir la recuperación de datos ante errores accidentales del usuario.
4.  **Refactorización a Knex Query Builder**:
    - **Decisión:** Se abandonaron las consultas SQL raw en favor del Query Builder de Knex en el repositorio de ideas.
    - **Motivo:** Mejor manejo de valores opcionales (evitando errores de bindings indefinidos) y mayor seguridad contra inyecciones SQL.

### 🔒 Seguridad y Eficiencia

1.  **Protección de Datos en Test:** Se estableció la regla de no ejecutar pruebas de carga contra la base de datos de producción o desarrollo local sin un esquema de aislamiento (Uso de transacciones o DBs efímeras).
2.  **Índices para Soft Delete:** Se añadió un índice en la columna `deleted_at` para asegurar que las consultas de listado (filtrando nulos) mantengan un rendimiento O(log n).

### 💡 Aprendizajes y "Gotchas"

- **Impacto de Docker en Latencia:** Las pruebas de carga iniciales deben considerar que `host.docker.internal` añade un salto de red virtualizado que no representa fielmente el entorno de producción Cloud.
- **Fragilidad de SQL Raw:** El uso de `db.raw` con MySQL2 es propenso a errores si los objetos de entrada contienen campos opcionales (`undefined`). El Query Builder de Knex gestiona estos casos de forma más transparente convirtiendo `undefined` en `NULL` o simplemente omitiendo la columna si no es requerida.

---

## Próximos Pasos (Deuda Técnica)
- [x] Configurar el archivo `.github/workflows/deploy.yml`.
- [x] Ejecutar migraciones y seeds iniciales.
- [x] Sincronizar UI con Pantalla Final de Stitch (`7c76`).
- [x] Implementar **Soft Delete** en la tabla `ideas`.
- [x] Agregar un sistema de **Notificaciones (Toasts)** para feedback del ABM.
- [x] Implementar **Bottom Navigation** funcional.
- [x] Implementar política **Zero Interruption** (Acción Directa + Undo).
- [x] Blindar persistencia Docker (Volumes para Logs/Uploads).
- [/] Implementar cobertura de tests funcionales (>80% en servicios críticos).
- [ ] Implementar Smoke Tests de carga para endpoints de escritura.

---

## [2026-05-07] - Consolidación Zero Interruption y Estética Premium (v1.5.0)

### 🏛️ Decisiones de Arquitectura

1.  **Erradicación de Diálogos Nativos**:
    - **Decisión:** Prohibición absoluta de `alert()` y `confirm()`. Sustitución por **Acción Directa + Undo** y `ConfirmDialog` premium.
    - **Motivo:** Eliminar la fricción cognitiva y mejorar la percepción de velocidad de la app.
2.  **Estandarización de Generación (Stitch Maxima)**:
    - **Decisión:** Creación de un "Master Prompt" para Stitch.
    - **Motivo:** Asegurar que cualquier generación futura de la IA respete el estándar Obsidian Premium sin intervención manual constante.

### 🔒 Seguridad y Eficiencia

1.  **Persistencia Blindada (Docker)**: Se declararon volúmenes específicos para `/logs` y `/uploads` en el host. Esto cumple con la Regla 4 de "lo que no está en un volumen, no existe".

### 💡 Aprendizajes y "Gotchas"

- **Importaciones en Hot Reload:** Un error de importación (`alpha` de MUI) puede causar un "White Screen" instantáneo que es difícil de detectar si no se revisa la consola del navegador inmediatamente tras el despliegue. **Lección:** Siempre validar las importaciones al aplicar estilos de alto nivel.
- **Backdrop Filter Performance:** El uso masivo de `backdrop-filter: blur()` puede impactar el rendimiento en dispositivos móviles antiguos. Se debe monitorear el FPS en terminales de gama baja.

---

## [2026-05-08] - Interacción en Lote y Gobernanza de Selección (v1.6.0)

### 🏛️ Decisiones de Arquitectura

1.  **Regla de Lote (Batch Rule)**:
    - **Decisión:** Implementación de selección múltiple mandatoria para grillas y listas con borrado unificado.
    - **Motivo:** Cumplir con la necesidad del usuario de gestionar grandes volúmenes de datos con una sola confirmación (Eficiencia Operativa).
2.  **Confirmación de Seguridad Unificada**:
    - **Decisión:** Se unificó el borrado individual y masivo bajo el `ConfirmDialog` premium.
    - **Motivo:** Proteger al usuario de borrados accidentales sin romper la estética Obsidian.

### 🔒 Seguridad y Eficiencia

1.  **Barras Contextuales (Fixed HUD)**: Se implementó una barra de acciones que solo aparece cuando hay selección activa, reduciendo el ruido visual (Zero Distraction).
2.  **Mutaciones en Paralelo**: La mutación de borrado utiliza `Promise.all` para procesar múltiples IDs de forma eficiente hacia el backend.

### 💡 Aprendizajes y "Gotchas"

- **Gestión de Estado Complejo:** Mantener sincronizada la selección entre AG Grid (Desktop) y Cards (Mobile) requiere un estado de selección agnóstico a la vista.
- **Docker Build & Cache:** Al modificar dependencias o importaciones críticas, es imperativo correr `docker-compose up --build` para asegurar que el bundle de Vite se regenere correctamente (Regla 14).

---

## [2026-05-08] - Gobernanza Automatizada y Hard Gates (v2.0.0)

### 🏛️ Decisiones de Arquitectura

1.  **Gobernanza mediante Linter (Hard Gates)**:
    - **Decisión:** Implementación de **Husky** + **lint-staged** con reglas de bloqueo total para `alert`, `confirm` y `prompt`.
    - **Motivo:** Eliminar la dependencia de la "buena voluntad" del desarrollador. El sistema ahora impide físicamente que código no conforme llegue al repositorio (Regla 13).
2.  **Consolidación de Design Tokens**:
    - **Decisión:** Refactorización de `client/src/theme.ts` para centralizar los tokens de **Glassmorphism** y la paleta **Obsidian**.
    - **Motivo:** Prevenir la deriva visual. Cualquier cambio en la estética base se propaga automáticamente a toda la app.
3.  **Conversión Total a ESM (Modern Stack)**:
    - **Decisión:** Migración de todos los scripts de soporte (`create-db.js`, config files) a **ECMAScript Modules (ESM)**.
    - **Motivo:** Mantener coherencia con el estándar de Vite y Node 20+, eliminando el uso de `require()` (Regla 5).

### 🔒 Seguridad y Eficiencia

1.  **Diccionario de Datos (Regla 20)**: Se creó el `.blueprint/docs/database/database-dictionary.md` para documentar la semántica y el ciclo de vida de cada tabla, asegurando la trazabilidad a largo plazo.
2.  **Zero-Error Policy**: Se alcanzó un estado de "0 errores de linting" en todo el monorepo. Cualquier futura violación de las reglas de arquitectura (ej. uso de `any` injustificado) será detectada inmediatamente.
3.  **Sanitización de Node Globals**: Se configuró `languageOptions.globals` en ESLint para distinguir correctamente entre contextos de Navegador y Node, evitando falsos positivos de "undefined variables".

### 💡 Aprendizajes y "Gotchas"

- **Cascading Renders en React:** El uso de `useEffect` para inicializar estados de formularios desde props puede causar renders en cascada. **Solución:** Usar una `key` única en el componente para forzar un remount limpio cuando cambian los datos iniciales, eliminando la necesidad de efectos sincronizadores (Regla 12).
- **Corrupción de Archivos por Redirección:** En PowerShell, la redirección de salida (`>`) puede generar archivos en UTF-16LE, causando errores en herramientas que esperan UTF-8 (como los linters). **Lección:** Usar `-Encoding UTF8` o herramientas nativas de bash si es posible.
- **Resiliencia de Scripts de Inicio:** El script `create-db.js` debe ser idempotente. No basta con `CREATE DATABASE`, se debe usar `IF NOT EXISTS` para no romper el ciclo de despliegue continuo (Regla 14).

---

## [2026-05-08] - Remediación Arquitectónica (v2.1.0)

### 🏛️ Decisiones de Arquitectura

1.  **Centralización de Errores (AppError Pattern)**:
    - **Decisión:** Implementación de una clase `AppError` y un middleware global.
    - **Motivo:** Eliminar la inconsistencia de `res.status(500).json({})` dispersos por los controladores. Ahora la API responde con un formato predecible y códigos semánticos.
2.  **Validación vía Decorador (Middleware-First)**:
    - **Decisión:** Traslado de la validación Zod de los controladores a un middleware `validateBody`.
    - **Motivo:** Cumplir con el principio de Single Responsibility. El controlador solo recibe datos que el sistema ya garantiza como válidos.
3.  **Mapeo Estricto en Repositorios (DTO Pattern)**:
    - **Decisión:** El método `toDTO()` en el Repositorio es ahora el único punto de conversión `snake_case` -> `camelCase`.
    - **Motivo:** Proteger la lógica de negocio y el frontend de cambios estructurales en la base de datos (Regla 232).
4.  **Paginación Mandatoria (Regla 36)**:
    - **Decisión:** Refactorización de `BaseRepository` para incluir `getPaged` y forzar su uso en el endpoint de listado de ideas.
    - **Motivo:** Garantizar la escalabilidad y resiliencia del sistema ante el crecimiento de datos (Blocker Rule).

### 🔒 Seguridad y Eficiencia

1.  **Zero Error Policy (Refined)**: Se eliminaron advertencias de `any` en los componentes core de error y persistencia, sustituyéndolos por `unknown` y tipos de registro estrictos.
2.  **Fail-Fast Validation**: El sistema aborta la petición en el middleware de validación, ahorrando ciclos de CPU al no llegar nunca a la capa de servicio con datos corruptos.

### 💡 Aprendizajes y "Gotchas"

- **Contrato del Frontend:** Implementar paginación en el backend sin actualizar el frontend causa una ruptura inmediata (White Screen). **Lección:** Las remediaciones arquitectónicas en el monorepo deben ser atómicas y cubrir ambas capas simultáneamente.
- **Middleware Chain:** El middleware de errores DEBE ser el último en registrarse en Express (`app.use(errorMiddleware)` al final). Si se registra antes de las rutas, no captura ninguna excepción.

---

## [2026-05-08] - Corrección de Persistencia de Formulario y Estabilidad (v2.2.0)

### 🏛️ Decisiones de Arquitectura

1.  **Estrategia de Reinicio de Estado (Dynamic Key)**:
    - **Decisión:** Se implementó el uso de una `key` dinámica (`new-${dialogKey}`) para el componente `IdeaDialog` en `IdeasPage.tsx`.
    - **Motivo:** React reutiliza las instancias de los componentes si la `key` no cambia. Al forzar una `key` nueva cada vez que se abre el panel de "Nueva Idea", garantizamos que el componente se remonte desde cero, limpiando cualquier estado residual de cargas anteriores de forma nativa y eficiente.
    - **Alternativa Descartada:** Usar un `useEffect` para limpiar el estado manualmente es propenso a errores y genera un render adicional (flicker).

### 🔒 Seguridad y Eficiencia

1.  **Blindaje de Autocompletado**: Se añadió `autoComplete="off"` a los campos del formulario. Esto evita que el navegador persista datos en la caché visual del input, eliminando el "dato fantasma" reportado por el usuario.
2.  **Sincronización de Tipado en Queries**: Se corrigió el error `[object Object]` en las peticiones de `TanStack Query` asegurando que las funciones de consulta (`queryFn`) no reciban el objeto de contexto de React Query como primer argumento accidentalmente.

### 💡 Aprendizajes y "Gotchas"

- **Preservación de Estado en Diálogos:** En aplicaciones SPA, los diálogos que se abren/cierran sin desmontarse son el principal foco de fugas de datos (data leakage) entre formularios. La **Regla de Oro** es: Si el diálogo representa una entidad nueva cada vez, debe tener una `key` que lo identifique como tal para que React maneje el ciclo de vida por nosotros.

---

## Próximos Pasos (Deuda Técnica)
- [x] Implementar **Gobernanza Automatizada (Husky + ESLint v9)**.
- [x] Centralizar **Design Tokens** en `theme.ts`.
- [x] Crear **Diccionario de Datos (Regla 20)**.
- [x] Alcanzar **Zero Linting Errors** (Status: Clean).
- [x] Implementar **Remediación Arquitectónica (Gold Standard)**.
- [x] Corregir **Persistencia de Formulario (UX Fix)**.
- [ ] Implementar Smoke Tests de carga para endpoints de escritura.
- [ ] Implementar Filtros Dinámicos (Search/Status) en el backend (paginados).


## Decisiones Arquitectónicas Recientes

### Refactorización a Vertical Slice Architecture & Event-Driven Design
Se reescribió el documento architecture.md para mitigar deuda técnica inminente en el backend. Se eliminó la estructura monolítica por capas (/controllers, /services) en favor de módulos verticales cohesivos (/modules) para asegurar un desacoplamiento estricto. Además, se implementó el uso de un Event Bus (/core/events) para procesos asíncronos y secundarios (Graceful Degradation), evitando cuellos de botella bloqueantes. Por último, se hizo obligatoria la colocalización estricta de pruebas (.spec.ts) para garantizar la cobertura del código de negocio crítico.


### Normalización y Nomenclatura Estándar de Base de Datos
Se estableció la convención oficial de nomenclatura para bases de datos relacionales en database-rules.md. Se adoptó el estándar de facto de la industria: nombres de tablas en **plural** y campos en **snake_case** (ej: users, created_at, user_id para llaves foráneas). Esto elimina colisiones con palabras reservadas SQL y simplifica los mapeos dinámicos en los repositorios.

---

## [2026-05-22] - Auditoría de Discrepancias y Deuda Técnica Detectada (v2.2.0)

### 🏛️ Decisiones de Arquitectura y Diagnóstico de Brechas

Se realizó una auditoría profunda de la aplicación de Ideas actual comparándola contra las directrices establecidas en los estándares del proyecto (`.blueprint/`). Se determinó que la app opera bajo una deuda técnica que debe abordarse de forma planificada para no degradar el sistema al incorporar nuevas funcionalidades.

1.  **Backend Estructurado por Capas (Legacy Monolith)**:
    -   **Brecha:** El backend actual utiliza la estructura tradicional (`/controllers`, `/services`, `/repositories`, `/schemas`, `/routes`) en lugar del estándar de **Vertical Slices** bajo `/server/src/modules/ideas/`.
    -   **Riesgo:** Acoplamiento estrecho de lógica a medida que el sistema crezca, dificultando la modularidad y escalabilidad independiente.

2.  **Inconsistencia en Pruebas Unitarias y de Integración**:
    -   **Brecha:** Los archivos de test se encuentran dispersos en las carpetas de capas utilizando la extensión `.test.ts` (ej: `idea.controller.test.ts`) en lugar de estar colocalizados bajo `.spec.ts` en la carpeta del módulo.
    -   **Riesgo:** Aumento del esfuerzo cognitivo del desarrollador (DX) para ubicar y mantener las pruebas, favoreciendo la pérdida de cobertura.

3.  **Desnormalización de Base de Datos (Esquema Plano)**:
    -   **Brecha:** La base de datos actual cuenta únicamente con una tabla plana `ideas` y carece de las relaciones relacionales de Tercera Forma Normal (3NF) que involucren tablas como `users` (para autoría y auditoría) y `categories` (para clasificación estructurada).
    -   **Riesgo:** Inconsistencias lógicas de datos y duplicidad cuando se agreguen flujos de análisis de categorías o esquemas multi-inquilino de seguridad.

4.  **Configuración de Despliegue Docker Optimizada para Desarrollo**:
    -   **Brecha:** Los Dockerfiles ejecutan comandos de desarrollo (`npm run dev`) y montan el código fuente local de manera directa, lo que es óptimo para DX local pero inviable para un entorno de producción seguro y de alto rendimiento.
    -   **Riesgo:** Exposición de herramientas de desarrollo y dependencias no productivas en producción, incrementando la superficie de ataque e impacto en recursos del sistema.

### 💡 Alternativas de Mitigación Propuestas para Futuro Desarrollo

-   **Alternativa A (Recomendada): Refactorización Atómica a Vertical Slices y DB Relacional (3NF)**:
    -   *Estrategia:* Mover el backend al módulo `/server/src/modules/ideas/`, colocalizar pruebas renombradas a `.spec.ts` y crear migraciones Knex para normalizar las tablas relacionales (`users`, `categories`) agregando las claves foráneas en la tabla `ideas`.
    -   *Riesgo:* Requiere ajustar la interfaz de usuario en el frontend para procesar los nuevos DTOs relacionales.
-   **Alternativa B: Refactorización Estructural sin Modificación de Esquema (DB Plana)**:
    -   *Estrategia:* Ajustar la estructura del servidor a módulos cohesivos bajo `/server/src/modules/ideas/` con tests colocalizados, pero posponer la normalización de la base de datos a fases posteriores.
    -   *Riesgo:* Mantiene la deuda técnica de datos, acumulando mayor trabajo a futuro en base de datos.

---

## [2026-05-22] - Auditoría de Seguridad y Dependencias (Watchdog v2.3.0)

### 🏛️ Decisiones de Arquitectura y Diagnóstico de Seguridad

1.  **Monitoreo del Ciclo de Vida de Node.js**:
    -   **Decisión:** Se detectó que Node.js 20 alcanzó su End-of-Life (EOL) el 30 de abril de 2026. Se definió planificar el upgrade de la imagen base de los contenedores Docker en el próximo ciclo de mantenimiento.
    -   **Motivo:** Evitar la exposición a futuras vulnerabilidades sin parches oficiales en el servidor Node.
    -   **Riesgo:** Posible incompatibilidad menor con APIs obsoletas de Node en dependencias de terceros si se realiza un upgrade directo.

2.  **Mitigación de Conflicto de Dependencias (Vitest v4 vs Vite v5)**:
    -   **Decisión:** Se diagnosticó un conflicto en las `peerDependencies` del frontend, donde `vitest` v4.1.5 requiere Vite 6+, pero se tiene Vite v5.4.21. Se decidió mantener la versión actual resuelta debido a que los tests se ejecutan correctamente, pero se documentó como riesgo de inconsistencia para instalaciones limpias sin `--legacy-peer-deps`.
    -   **Motivo:** Evitar refactorizaciones costosas que rompan el build actual del cliente mientras se prepara el upgrade coordinado a Vite 6.x.

### 🔒 Seguridad y Eficiencia

1.  **Diagnóstico Real de Vulnerabilidades**:
    -   Se verificó que el uso del lockfile (`package-lock.json`) resolvió versiones parchadas y seguras para dependencias críticas reportadas previamente con vulnerabilidades:
        -   **Vite:** v5.4.21 instalada (libre de CVE-2025-31125, el cual fue parchado en v5.4.16).
        -   **AG Grid:** v31.3.4 instalada (libre del Prototype Pollution CVE-2024-38996, que afecta a <=31.3.2).
        -   **path-to-regexp (Express):** v0.1.13 instalada (libre del ReDoS CVE-2026-4867, corregido en v0.1.13).
        -   **body-parser (Express):** v1.20.5 instalada (libre de DoS CVE-2025-13466, que afecta a v2.2.0).

2.  **Riesgo en Configuración de Desarrollo Docker**:
    -   Se identificó que el dev server del cliente corre con la opción `--host` en Docker. Aunque la versión actual de Vite está mitigada, exponer públicamente el dev server en redes abiertas sigue siendo un factor de riesgo en caso de degradaciones involuntarias de versión.

### 💡 Aprendizajes y "Gotchas"

-   **El Lockfile como Escudo Temporal:** Aunque un `package.json` defina dependencias permisivas con rangos (ej: `^5.2.12` o `^31.3.2`), el `package-lock.json` nos protege asegurando que los entornos no instalen versiones aleatorias vulnerables. Sin embargo, no se debe depender ciegamente del lockfile a largo plazo; las dependencias del `package.json` deben ser actualizadas explícitamente y fijadas para garantizar la seguridad.
-   **Actualización Estricta de EOL:** Mantener imágenes de Docker ancladas a una versión específica es una buena práctica de persistencia y DX (reproducibilidad), pero debe revisarse anualmente para evitar ejecutar código sobre plataformas EOL (como Node 20 en 2026).

---

## [2026-05-22] - Automatización del Esquema y Tipado TypeScript (v2.4.0)

### 🏛️ Decisiones de Arquitectura

1.  **Independencia y Portabilidad de Scripts de Gobernanza**:
    -   **Decisión:** Se refactorizó el script `generate-db-dictionary.js` para usar `process.cwd()` y variables de entorno para resolver la ruta del `.env` y el archivo Markdown final.
    -   **Motivo:** Resolver la deuda técnica de rutas relativas rígidas (`../../../../.env`). Ahora el script puede copiarse y ejecutarse desde la raíz de cualquier proyecto sin romperse, manteniendo su portabilidad como plantilla.
    -   **Riesgo:** Requiere que el comando se ejecute desde la raíz del proyecto o que se defina la variable `ENV_PATH` si se ejecuta desde directorios internos.

2.  **Configuración de Kanel Integrada con Knex**:
    -   **Decisión:** Se creó el archivo `kanel.config.js` de ejemplo utilizando el plugin `@kanel/knex`.
    -   **Motivo:** Evitar el acoplamiento a una base de datos específica (PostgreSQL). Al usar Knex, Kanel puede autogenerar interfaces y tipos TypeScript de forma agnóstica para MySQL/MariaDB, SQLite o Postgres basándose en la configuración existente en el proyecto de backend.
    -   **Alternativas Analizadas:**
        *   *Alternativa 1 (Kysely + kysely-codegen):* Excelente tipado nativo sin dependencias pesadas en tiempo de ejecución, pero requiere migrar Knex a Kysely, lo que rompería el stack actual.
        *   *Alternativa 2 (Schemats/knex-types):* Herramientas más ligeras, pero con menor mantenimiento comunitario en comparación con Kanel en la actualidad.

### 🔒 Seguridad y Eficiencia

1.  **Enfoque Zero Trust en Conexiones**: Las plantillas de autogeneración de base de datos (`generate-db-dictionary.js`) y generación de tipos (`kanel.config.js`) se alimentan al 100% de variables de entorno sanitizadas (.env), erradicando las credenciales hardcodeadas.
2.  **Gobernanza de Zonas Horarias**: Se estableció en `database-rules.md` el estándar obligatorio de usar UTC (`Z`) tanto en el motor de base de datos como en los conectores del backend (Knex/Kanel) para evitar desfases en registros temporales de auditoría (`created_at`, `updated_at`).

### 💡 Aprendizajes y "Gotchas"

-   **El Silicio se Quema (Wear Leveling)**: Se documentó en las directivas del Blueprint la regla de no persistir estados intermedios de forma continuada en memoria flash o LittleFS en sistemas IoT/C++, aplicando técnicas de debouncing de 5 segundos para consolidar escrituras y proteger el silicio físico.
-   **Riesgos de Rutas Dinámicas en Scripts**: El uso de `__dirname` para referenciar recursos fuera de la estructura de un paquete genera rigidez. Al automatizar la gobernanza, las herramientas deben orientarse a la raíz del espacio de trabajo utilizando `process.cwd()` para maximizar su portabilidad.

---

## [2026-05-22] - Gobernanza de Ejecución Autónoma por IA (v2.5.0)

### 🏛️ Decisiones de Arquitectura

1.  **Automatización Invisible para el Desarrollador (AI-First Operations)**:
    -   **Decisión:** Mover la responsabilidad de ejecutar las herramientas de base de datos (`generate-db-dictionary.js` y `npx kanel`) desde el desarrollador humano hacia la propia IA. Se agregaron reglas explícitas en `.blueprint/ai-instructions/ai-operating-rules.md` para obligar a los agentes a ejecutar e integrar estas herramientas autónomamente.
    -   **Motivo:** En proyectos donde la IA implementa nuevas funcionalidades de backend y base de datos, el programador humano no debe cargar con el trabajo operativo de recordar comandos de mantenimiento de diccionarios y tipos de datos. La IA debe dejar el entorno en un estado consistente y documentado de forma transparente.
    -   **Alternativas Analizadas:**
        *   *Alternativa 1 (Hooks locales de Git/Husky):* Evita commits sin actualizar el esquema de datos, pero bloquea el flujo si la base de datos local no está encendida durante el commit.
        *   *Alternativa 2 (GitHub Actions CI/CD):* Valida y actualiza en la nube, pero introduce latencia entre lo que escribe la IA en local y lo que llega a producción.
        *   *Alternativa Híbrida Adoptada (Regla Operativa IA + Documentación):* La IA se encarga de la autoejecución local autónoma y se documenta la necesidad de validación en CI/CD para evitar cambios humanos sin procesar.

### 💡 Aprendizajes y "Gotchas"

-   **Deuda Técnica a Largo Plazo**: Si el programador humano realiza un cambio rápido o corrección en el esquema físico directamente en la base de datos local saltándose el flujo de la IA, el diccionario de datos y los tipos TypeScript quedarán desincronizados. La confianza ciega en la automatización de la IA no exime de la necesidad de mantener un test o pipeline de verificación automatizada de esquemas en CI/CD.
-   **Dependencia del Estado de la Base de Datos**: Para que la IA corra autónomamente los scripts, la base de datos de desarrollo debe estar levantada. En entornos nuevos, la IA debe asegurarse de que la BD local responda antes de ejecutar el diccionario y Kanel.

---

## [2026-05-22] - Corrección de ESLint Flat Config y Limpieza de Código Muerto (v2.6.0)

### 🏛️ Decisiones de Arquitectura

1.  **Ajuste Quirúrgico de ESLint Flat Config para Scripts de Node**:
    -   **Decisión:** Se reestructuró el archivo `eslint.config.js` para expandir el bloque de reglas y entornos de Node.js a las carpetas `.blueprint/**/*.js` y `tests/**/*.js`. Se desactivó la regla `@typescript-eslint/no-require-imports` para estas áreas CommonJS.
    -   **Motivo:** ESLint 9 arrojaba 55 errores de compilación falsa debido a que los scripts del Blueprint y de tests de carga usaban globales de Node (`process`, `require`, `module`, `console`) que no estaban declarados en su contexto de lenguaje de navegador por defecto.
    -   **Riesgo:** Si en el futuro se mezclan scripts de Node con componentes del frontend de React en las mismas carpetas de tests sin separar adecuadamente sus extensiones, se podrían desactivar reglas de importación seguras de TS de forma involuntaria.

2.  **Eliminación de Código Muerto y Tipado Limpio**:
    -   **Decisión:** Se limpiaron importaciones y variables declaradas y no utilizadas (`__dirname`, `__filename`, `fileURLToPath` y `path`) en `generate-db-dictionary.js` y `dump-db.js`, y se removieron parámetros ociosos de callbacks y catch blocks (`_error`, `_pgType`).
    -   **Motivo:** Reducir el ruido de análisis estático del código y cumplir estrictamente con la regla `@typescript-eslint/no-unused-vars` del proyecto, logrando que el script de linting finalice con un rotundo éxito (0 errores).

### 🔒 Seguridad y Eficiencia

1.  **Blindaje de `.gitignore` contra Contaminación del Historial**:
    -   **Decisión:** Se agregaron exclusiones explícitas para archivos comprimidos binarios (`*.rar`, `*.zip`, `*.tar.gz`, `*.7z`) y reportes dinámicos de texto (`*_report.txt` e `/lint_report.txt`) en el archivo `.gitignore` raíz.
    -   **Motivo:** Prevenir que un comando `git add .` imprudente de la IA o de un desarrollador humano suba binarios pesados (como `blueprint.rar` o `superpowers.rar` actualmente en el directorio de trabajo local) al repositorio de GitHub, previniendo la degradación del rendimiento de clonado de Git.

### 💡 Aprendizajes y "Gotchas"

-   **El Flat Config de ESLint 9 se Aplica en Cascada**: A diferencia de las versiones antiguas de ESLint donde los archivos `.eslintrc` en subcarpetas sobreescribían localmente, el nuevo formato Flat Config aplica las reglas de manera global a menos que se restrinjan rigurosamente con los patrones de la propiedad `files`. Definir el contexto del compilador (`globals.node`) es imperativo para evitar que reglas de TypeScript intenten parsear Node puro.
-   **Omitir Parámetros No Usados en Callbacks y Catch Blocks**: En versiones modernas de JavaScript y TypeScript, no es necesario nombrar variables no utilizadas. El uso de `catch {` (sin parámetro) y la firma de funciones flecha sin variables basura (como en `typeFilter`) mantiene el código limpio y robusto frente a reglas estrictas de linter sin tener que depender de prefijos artificiales como `_`.




