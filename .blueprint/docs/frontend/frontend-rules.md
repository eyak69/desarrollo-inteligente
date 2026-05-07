# Reglas frontend

## React

- [STRICT] Componentes pequeños y enfocados: un componente hace una cosa. Si supera ~150 líneas, evaluar separación.
- [BLOCKER] TypeScript estricto: `strict: true` en `tsconfig`. Sin `any` salvo excepción documentada. Ver sección TypeScript abajo.
- [BLOCKER] Props tipadas: nunca `props: any` ni `props: object`.
- [STRICT] Separar componentes de servicios: los componentes no hacen fetch directo. Los fetches van en hooks de TanStack Query.

## Datos (TanStack Query)

- [STRICT] Usar TanStack Query para todo estado de servidor. No reinventar
  cache manual con `useState` + `useEffect` para datos remotos.
- [STRICT] No usar `useEffect` para disparar fetches. Para eso existe
  `useQuery` y `useMutation`.
- [STRICT] No duplicar cache: si dos componentes necesitan los mismos datos,
  comparten el mismo query key, no cada uno hace su fetch.
- [STRICT] Manejar siempre los tres estados: `isPending` (loading), error,
  y data. No renderizar solo el happy path.
- [STRICT] Configurar `staleTime` según el tipo de dato:

  | Tipo de dato | `staleTime` | Ejemplo |
  |---|---|---|
  | Configuración / catálogos (no cambian) | `Infinity` | roles, países, monedas |
  | Datos de referencia (cambian poco) | `300_000` (5 min) | usuarios, categorías |
  | Datos transaccionales (cambian seguido) | `30_000` (30 seg) | listados, búsquedas |
  | Datos en tiempo real | `0` | notificaciones, estado de pedido activo |
- [STRICT] Usar `isPending` (no `isLoading`) en TanStack Query v5+.
  `isLoading` fue renombrado en v5.

## Cuándo usar `useEffect`

`useEffect` es correcto cuando se sincroniza con un sistema externo al ciclo
de React. Casos legítimos:

- [GUIDE] Suscribirse a eventos del DOM o del navegador (`resize`, `scroll`, WebSocket).
- [GUIDE] Integrar con librerías externas que requieren un nodo del DOM (mapas, charts que no son React).
- [GUIDE] Ejecutar código al montar/desmontar que no es un fetch (ej: inicializar un timer, registrar un listener, actualizar `document.title`).

`useEffect` es **incorrecto** para:

- [STRICT] Fetching de datos — usar `useQuery`.
- [STRICT] Derivar estado de otro estado — calcular en render o con `useMemo`.
- [STRICT] Sincronizar `useState` entre componentes — elevar el estado o usar
  contexto.
- [STRICT] Responder a un evento del usuario — hacer eso en el handler,
  no en un efecto que observa cambios de estado.

## Estado del cliente (UI state)

TanStack Query maneja el estado de servidor. Para el resto:

- [STRICT] Estado de UI local (open/closed, tab activa, scroll position): `useState` en el componente más cercano. No elevar innecesariamente.
- [STRICT] Estado compartido entre componentes hermanos: elevar al ancestro común más cercano, no usar una librería global.
- [GUIDE] Estado global de UI (tema, usuario autenticado, notificaciones): React Context con un Provider específico. No usar Redux ni Zustand salvo autorización explícita.
- [BLOCKER] No mezclar estado de servidor con estado de cliente: si el dato viene de la API, vive en TanStack Query. Si es puramente de UI, vive en `useState` o Context.

## Formularios

Las dos validaciones son **obligatorias y complementarias** — no son alternativas entre sí:

- [STRICT] **Validación frontend (Zod + React Hook Form):** Para UX inmediata, sin round-trip al servidor. Muestra errores junto al campo en tiempo real.
- [BLOCKER] **Validación backend (Zod en middleware):** Para seguridad. El frontend puede ser manipulado o bypasseado. El backend nunca confía en datos del cliente.
- [STRICT] Usar **React Hook Form** para todos los formularios. No `useState` por campo ni Formik.
- [STRICT] La validación del schema de formulario se define con **Zod** y se conecta via `zodResolver`. Un solo schema define el tipo TypeScript y las reglas de validación.
- [STRICT] Usar los componentes oficiales del design system (`TextField`, `SelectField`, etc.) para formularios, no inputs nativos sueltos.
- [STRICT] Mostrar errores de campo junto al campo, no solo al final del form.
- [STRICT] Mostrar errores de API (del servidor) en un `Alert` visible, no silenciarlos.
- Template de referencia: `templates/files/form-template.tsx`

## TypeScript

- [BLOCKER] `strict: true` en `tsconfig`. Sin `any` salvo excepción documentada con un comentario que explique el motivo.
- [BLOCKER] Props tipadas: nunca `props: any` ni `props: object`.
- [STRICT] No usar type assertions (`as X`) para silenciar errores. Corregir el tipo.
- [STRICT] Interfaces para shapes de objetos (`IdeaDTO`). Types para unions, aliases y utility types.
- [GUIDE] Preferir inferencia de tipos sobre anotaciones explícitas donde TypeScript puede inferir correctamente.

## Mobile

- [STRICT] Todo componente debe ser responsive. Probar en 360px.
- [STRICT] No depender de hover para mostrar información o acciones. Toda acción debe ser accesible por tap.
- [STRICT] Botones táctiles: mínimo 44×44px de área efectiva (incluye padding).
- [STRICT] Tablas adaptadas: ver `mobile-rules.md`.
