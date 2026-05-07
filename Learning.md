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
- [ ] Agregar un sistema de **Notificaciones (Toasts)** para feedback del ABM.
- [ ] Implementar **Bottom Navigation** funcional.
- [/] Implementar cobertura de tests funcionales (>80% en servicios críticos).
- [ ] Implementar Smoke Tests de carga para endpoints de escritura.

---

## 🏛️ Hito: Unificación de Gobernanza (v1.3.1)

Se ha realizado una auditoría completa del Blueprint. El usuario ha elevado el estándar aplicando etiquetas de severidad (`[BLOCKER]`, `[STRICT]`) a todas las capas de documentación.

### Mejoras Realizadas:
1.  **Refactorización de Datos:** `BaseRepository` ahora usa Inyección de Dependencias (Knex por constructor), permitiendo entornos de test más flexibles y aislados.
2.  **Blindaje de UI:** Se han establecido prohibiciones explícitas contra `alert()` y `window.confirm()` en favor de Sonner, documentando duraciones y jerarquías.
3.  **Sincronización Código-Doc:** Se ha validado que el código real refleja exactamente lo que dice la documentación de arquitectura.
