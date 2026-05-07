# Decision Log

Registrar aquí decisiones importantes del proyecto.

Formato:

```
## YYYY-MM-DD — Decisión

### Contexto
Qué problema se quería resolver.

### Decisión
Qué se decidió.

### Motivo
Por qué se eligió esta opción.

### Consecuencias
Qué ventajas y riesgos trae.
```

---

## 2026-05-06 — Stack frontend: React + MUI + AG Grid

### Contexto
Necesitamos un stack replicable para sistemas administrativos con grillas
de datos complejas, formularios pesados y múltiples proyectos paralelos.

### Decisión
React + TypeScript + Vite + MUI + AG Grid + TanStack Query + React Router.

### Motivo
MUI cubre el 90% de los componentes de backoffice con accesibilidad y dark
mode sin trabajo extra. AG Grid es el estándar para grillas empresariales con
server-side, master-detail y tree data. TanStack Query elimina el boilerplate
de cache y estados de carga. El conjunto es ampliamente conocido y reduce
la curva de onboarding.

### Consecuencias
Se prohíben frameworks alternativos (Next.js, Remix, Tailwind, Redux, etc.)
salvo autorización explícita. El beneficio es consistencia entre proyectos;
el costo es menor flexibilidad para proyectos con necesidades muy distintas.

---

## 2026-05-06 — Stack backend: Node.js + Express + Zod

### Contexto
Necesitamos un backend ligero, tipado, con validación robusta de entradas y
fácil de escalar horizontalmente en Docker.

### Decisión
Node.js + Express + TypeScript + Zod para validación. Sin ORM: SQL
parametrizado a mano o con query builder controlado.

### Motivo
Express es predecible y sin magia. Zod provee validación con inferencia de
tipos en un solo lugar. Evitar ORM en reportes complejos previene SQL generado
subóptimo que es difícil de optimizar.

### Consecuencias
Más código boilerplate para queries simples, pero control total sobre el SQL
en operaciones críticas de performance. Se prohíben NestJS, Prisma, Sequelize
salvo autorización.

---

## 2026-05-06 — Estrategia de paginación: offset/limit para grillas, cursor para feeds

### Contexto
Dos patrones de listado con necesidades distintas: grillas administrativas con
orden arbitrario y filtros, y feeds/infinite scroll con datasets que mutan.

### Decisión
Offset/limit para grillas (compatibilidad con AG Grid server-side). Cursor
para feeds e infinite scroll.

### Motivo
AG Grid server-side espera `startRow`/`endRow` que se mapea naturalmente a
offset/limit. Los feeds con cursor son más estables ante inserciones concurrentes.

### Consecuencias
Backend debe soportar ambos contratos. El adapter de AG Grid traduce su
modelo a los parámetros estándar del blueprint.

---

## 2026-05-06 — Severidad de reglas: BLOCKER / STRICT / GUIDE

### Contexto
Las reglas de un blueprint sin jerarquía se ignoran de forma inconsistente:
o se siguen todas dogmáticamente o se omiten cuando hay presión de tiempo.

### Decisión
Sistema de tres niveles: BLOCKER (innegociable, requiere editar el blueprint
para cambiar), STRICT (requiere justificación y aprobación humana explícita),
GUIDE (puede desviarse con declaración).

### Motivo
Permite que la IA y los devs tomen decisiones autónomas en áreas de bajo
riesgo sin necesitar aprobación, mientras protege las áreas críticas
(seguridad, dinero, autenticación) de desviaciones accidentales.

### Consecuencias
Requiere que cada regla nueva declare su severidad. Las reglas sin declaración
se tratan como STRICT por defecto.

---

## 2026-05-06 — Formularios: React Hook Form + Zod

### Contexto
El stack frontend necesita una estrategia unificada para formularios. Las
opciones evaluadas fueron: estado manual con `useState` por campo, Formik,
y React Hook Form.

### Decisión
React Hook Form con `zodResolver`. El mismo schema Zod que valida el backend
se reutiliza (o se replica) en el frontend para validación síncrona.

### Motivo
React Hook Form tiene mejor performance que Formik (uncontrolled inputs,
mínimo re-render). Integrar Zod via `zodResolver` elimina la duplicación
de reglas de validación: un solo schema define el tipo TypeScript y las
reglas de error. Formik fue descartado por verbosidad y peor integración
con TypeScript estricto.

### Consecuencias
`useState` por campo está prohibido en formularios. Todo formulario nuevo
debe usar `useForm` + `zodResolver`. El costo es aprender la API de RHF,
que difiere de formularios controlados tradicionales.

---

## 2026-05-06 — Estado cliente: Context API (sin Redux ni Zustand)

### Contexto
TanStack Query cubre el estado de servidor. Queda definir cómo manejar el
estado de UI global (usuario autenticado, tema, notificaciones).

### Decisión
React Context con Providers específicos por dominio. Redux y Zustand están
prohibidos salvo autorización explícita.

### Motivo
El estado global de UI en estos proyectos es bajo volumen y poco frecuente
en actualizaciones. Context es suficiente y no agrega dependencias. Redux
agrega boilerplate significativo sin beneficio para este perfil de app.
Zustand es más liviano pero introduce una dependencia y un patrón
que el equipo no conoce de forma uniforme.

### Consecuencias
Si un proyecto escala a estado global complejo (muchas actualizaciones
frecuentes, varios slices), será necesario reevaluar. Se documenta la
decisión para que esa conversación sea consciente, no accidental.

---

## 2026-05-06 — Naming: snake_case en DB, camelCase en API y frontend

### Contexto
La base de datos usa `snake_case` por convención SQL estándar. El frontend
y las APIs REST modernas usan `camelCase`. Había que decidir dónde ocurre
la transformación.

### Decisión
La transformación `snake_case → camelCase` ocurre en el repository o service
del backend. El controller y el frontend siempre trabajan con `camelCase`.

### Motivo
Centralizar la transformación en una sola capa evita que el frontend conozca
el esquema interno de la base de datos. Si se renombra una columna, solo
cambia el repository. El controller y el frontend no necesitan actualizarse.

### Consecuencias
Los repositorios tienen la responsabilidad explícita del mapeo. Knex no hace
esto automáticamente: se configura con `postProcessResponse` o se mapea
manualmente en cada método.

---

## 2026-05-06 — Estrategia de borrado: Soft Delete obligatorio

### Contexto
En sistemas administrativos, los registros borrados suelen necesitarse para
auditoría, recuperación de errores o historial. El borrado físico es
irreversible.

### Decisión
Todos los borrados son lógicos (`deleted_at = NOW()`). El borrado físico
está prohibido salvo tablas temporales o logs de sistema, y requiere
justificación en este log.

### Motivo
Facilita auditoría, permite recovery de errores sin restaurar backups, y
simplifica la lógica de "papelera" si se necesita en el futuro. El costo
de storage es mínimo para el volumen de datos que manejan estos proyectos.

### Consecuencias
Todos los queries de listado deben filtrar `WHERE deleted_at IS NULL`.
`BaseRepository` encapsula este filtro para evitar omisiones accidentales.
