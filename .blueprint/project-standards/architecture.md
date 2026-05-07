# Arquitectura oficial

## Estructura recomendada

```
/client
  /src
    /components       ← componentes del design system reutilizables (sin lógica de negocio)
    /features         ← módulos de negocio (ver convención abajo)
    /layouts          ← AppShell, wrappers de página
    /services         ← llamadas HTTP (TanStack Query hooks o funciones fetch)
    /routes           ← definición de rutas (React Router)
    /hooks            ← hooks globales reutilizables
    /types            ← tipos e interfaces compartidos
    /utils            ← helpers puros reutilizables en serio (no dumping ground)

/server
  /src
    /routes           ← registro de rutas Express
    /controllers      ← recibe request, llama service, devuelve response
    /services         ← lógica de negocio, orquestación
    /repositories     ← acceso a datos (SQL, queries)
    /schemas          ← schemas Zod de validación de entrada
    /middleware       ← auth, permisos, errores, requestId
    /config           ← variables de entorno validadas con Zod al arrancar
```

## Convención de `/features`

Cada feature es una carpeta autónoma que agrupa todo lo relacionado con un
dominio de negocio. Estructura interna sugerida:

```
/features/orders/
  index.ts             ← barrel export (solo lo público del feature)
  OrdersPage.tsx       ← componente de página
  OrderDetail.tsx      ← componente de detalle
  useOrders.ts         ← hook de datos (TanStack Query)
  useOrderDetail.ts
  orders.types.ts      ← tipos específicos del feature
  orders.utils.ts      ← helpers internos del feature
```

- [STRICT] Un feature no importa de otro feature directamente. Si necesita
  datos de otro dominio, lo hace a través de `/services` o de un hook
  compartido en `/hooks`.
- [STRICT] Los helpers internos de un feature van en el feature, no en
  `/utils` global, salvo que sean genuinamente reutilizables en más de
  un feature.
- [STRICT] El `index.ts` del feature exporta solo lo que otros módulos
  necesitan. Los componentes internos no se exportan.

## Reglas de capas

- UI separada de lógica de negocio.
- Servicios API separados de componentes.
- Backend valida todo.
- Frontend no decide permisos.
- Repositories manejan acceso a datos.
- Controllers no contienen SQL complejo ni lógica de negocio.
- Services contienen reglas de negocio; no conocen `req`/`res`.
- Schemas Zod validan entradas en el controller antes de llegar al service.
- Middleware maneja auth, permisos y errores de forma centralizada.

## Mapeo DB → API

- [BLOCKER] La transformación `snake_case` (DB) → `camelCase` (API) ocurre
  en el repository o service, nunca en el controller ni en el frontend.

## Variables de entorno del frontend

- [BLOCKER] Solo datos no sensibles pueden ir en variables `VITE_PUBLIC_*`.
  Nunca claves privadas, secrets, ni tokens de API con permisos de escritura.
- [STRICT] Toda variable de entorno usada en frontend debe estar documentada
  en `.env.example` con un comentario que explique para qué sirve.
- [BLOCKER] Variables de entorno del servidor nunca se exponen al cliente,
  ni como respuesta de API ni embebidas en el bundle.
