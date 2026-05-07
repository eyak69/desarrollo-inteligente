# Reglas frontend

## React

- Componentes pequeños y enfocados: un componente hace una cosa.
- TypeScript estricto: `strict: true` en `tsconfig`. Sin `any` salvo
  excepción documentada.
- Props tipadas: nunca `props: any` ni `props: object`.
- Separar componentes de servicios: los componentes no hacen fetch directo.

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
  - Datos de configuración / catálogos: `staleTime: Infinity` o largo (≥5min).
  - Datos transaccionales: `staleTime: 0` o corto (≤30s).
- [STRICT] Usar `isPending` (no `isLoading`) en TanStack Query v5+.
  `isLoading` fue renombrado en v5.

## Cuándo usar `useEffect`

`useEffect` es correcto cuando se sincroniza con un sistema externo al ciclo
de React. Casos legítimos:

- Suscribirse a eventos del DOM o del navegador (`resize`, `scroll`, WebSocket).
- Integrar con librerías externas que requieren un nodo del DOM (mapas, charts
  que no son React).
- Ejecutar código al montar/desmontar que no es un fetch (ej: inicializar un
  timer, registrar un listener).

`useEffect` es **incorrecto** para:

- [STRICT] Fetching de datos — usar `useQuery`.
- [STRICT] Derivar estado de otro estado — calcular en render o con `useMemo`.
- [STRICT] Sincronizar `useState` entre componentes — elevar el estado o usar
  contexto.
- [STRICT] Responder a un evento del usuario — hacer eso en el handler,
  no en un efecto que observa cambios de estado.

## Formularios

- Validar en frontend para UX inmediata (sin round-trip).
- [BLOCKER] Validar en backend para seguridad: el frontend puede ser
  manipulado, el backend no.
- Mostrar errores claros: mensaje junto al campo, no solo al final del form.
- [STRICT] Usar los componentes oficiales del design system (`TextField`,
  `SelectField`, etc.) para formularios, no inputs nativos sueltos.

## Mobile

- [STRICT] Todo componente debe ser responsive. Probar en 360px.
- No depender de hover para mostrar información o acciones.
- Botones táctiles: mínimo 44×44px efectivos.
- Tablas adaptadas: ver `mobile-rules.md`.
