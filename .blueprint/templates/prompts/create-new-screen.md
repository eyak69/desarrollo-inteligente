# Prompt para crear pantalla nueva

Crear la pantalla: [NOMBRE]

## Antes de codificar (obligatorio)

Leer:
- `/.blueprint/project-standards/architecture.md`
- `/.blueprint/project-standards/stack.md`
- `/.blueprint/design-system/components.md`
- `/.blueprint/design-system/layout.md`
- `/.blueprint/design-system/mobile-first.md`
- `/.blueprint/docs/frontend/frontend-rules.md`
- `/.blueprint/docs/conventions/naming.md`
- `/.blueprint/docs/accessibility/a11y-rules.md`

## Especificación

- Nombre de la pantalla / feature folder:
- Endpoint(s) que consume:
- Campos que muestra:
- Acciones del usuario (botones, forms, navegación):
- Permisos requeridos (qué rol puede ver/operar):
- Estados a manejar: loading / empty / error / success
- ¿Tiene formulario? (si sí, usar React Hook Form + Zod)
- ¿Tiene listado? (si sí, paginar server-side)
- ¿Tiene grilla AG Grid?

## Plan que la IA debe presentar antes de codificar

1. Estructura de archivos a crear dentro de `/features/[nombre]/`.
2. Componentes del design system que va a usar (sin inventar nuevos).
3. Query keys de TanStack Query que va a registrar.
4. Cómo maneja los 4 estados: loading, empty, error, success.
5. Cómo implementa mobile-first (viewport mínimo 360px).
6. Tests que va a escribir.

## Reglas no negociables

- [BLOCKER] No inventar endpoints. Consumir solo los que existen o los que se especifican aquí.
- [BLOCKER] No cambiar el stack ni instalar librerías nuevas.
- [BLOCKER] Usar AppShell + PageContainer del design system para el layout.
- [BLOCKER] Manejar loading, empty, error y success. No renderizar solo el happy path.
- [STRICT] Usar componentes oficiales del design system — no inputs nativos sueltos.
- [STRICT] Mobile-first: diseñar desde 360px. Probar en ese viewport antes de dar por terminado.
- [STRICT] Formularios con React Hook Form + Zod. Ver template: `templates/files/form-template.tsx`.
- [STRICT] Datos remotos con TanStack Query. No `useState` + `useEffect` para fetches.
- [STRICT] Accesibilidad mínima: labels, contraste 4.5:1, navegación por teclado.
- [GUIDE] Si la pantalla tiene tabla con muchos datos, usar AG Grid server-side, no renderizar todo en memoria.

## Al terminar

- Archivos creados / modificados.
- Cómo probar manualmente (pasos exactos).
- Cómo probar en 360px (viewport mobile).
- Tests agregados.
- Pendientes / asunciones.
