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
