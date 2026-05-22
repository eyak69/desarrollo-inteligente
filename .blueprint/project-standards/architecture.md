# Arquitectura oficial

## Estructura recomendada

```text
/client
  /src
    /components       👉 componentes del design system reutilizables (sin lógica de negocio)
    /features         👉 módulos de negocio (ver convención abajo)
    /layouts          👉 AppShell, wrappers de página
    /services         👉 llamadas HTTP (TanStack Query hooks o funciones fetch)
    /routes           👉 definición de rutas (React Router)
    /hooks            👉 hooks globales reutilizables
    /types            👉 tipos e interfaces compartidos
    /utils            👉 helpers puros reutilizables en serio (no dumping ground)

/server
  /src
    /modules          👉 módulos de negocio verticales (Vertical Slice Architecture)
      /orders
        orders.controller.ts
        orders.service.ts
        orders.repository.ts
        orders.schema.ts
        orders.events.ts
        orders.spec.ts    👉 pruebas unitarias/integración estrictamente colocalizadas
    /infrastructure
      /persistence      👉 adaptadores de DB (ej. /knex, /typeorm)
      /storage          👉 servicios para manejo de archivos locales/S3 y volúmenes Docker
      /context          👉 RequestContext, AsyncLocalStorage
    /core
      /events           👉 Event Bus / EventEmitter global para desacoplamiento
      /middlewares      👉 auth, permisos, errores, requestId, Rate Limiter/WAF
```

## Convención de `/features` (Frontend) y `/modules` (Backend)

Cada feature/módulo es una carpeta autónoma que agrupa todo lo relacionado con un dominio de negocio.

- **[STRICT] Pruebas Colocalizadas**: Todo archivo lógico (`.ts`, `.tsx`) debe tener su contraparte `.spec.ts` en la misma carpeta. Se prohíbe una carpeta `/tests` global paralela que replique la estructura del proyecto. Si no hay test repetible, no está terminado.
- **[STRICT] Cero Acoplamiento Síncrono (Backend)**: Un módulo no importa servicios de otro módulo para flujos secundarios. Si se crea una orden, `orders.service.ts` emite un evento `OrderCreated` a través del Event Bus. El módulo de emails escucha y reacciona de forma asíncrona.
- **[STRICT] Aislamiento Frontend**: Un feature no importa de otro feature directamente. Si necesita datos de otro dominio, lo hace a través de `/services` o de un hook compartido en `/hooks`.
- **[STRICT] Exportaciones Limpias**: El `index.ts` del feature exporta solo lo que otros módulos necesitan. Los componentes internos jamás se exportan.

## Reglas de capas y Resiliencia

- UI separada de lógica de negocio.
- **[BLOCKER] Backend valida todo (Zero Trust Paradigm)**: Zod valida entradas en el controller antes de llegar al service. El Frontend es inseguro por diseño. Jamás confiar en inputs externos.
- **[BLOCKER] Fallo Elegante (Graceful Degradation)**: Servicios de terceros o flujos asíncronos fallidos no abortan la respuesta HTTP principal. Deben capturar la excepción en silencio, implementar Exponential Backoff y registrarse en logs.
- Controllers no contienen SQL complejo ni lógica de negocio.
- Repositories manejan acceso a datos exclusivo.

## Infraestructura Efímera y Persistencia (Docker)

- **[BLOCKER] Sistema de Archivos Efímero**: Cualquier archivo subido por el usuario (`/uploads`) o logs físicos (`/logs`) generados por el servidor deben ser guardados en rutas montadas explícitamente como Volúmenes Persistentes en el `docker-compose.yml`. Si el contenedor muere y la data local se pierde, la arquitectura falló.

## Mapeo DB 👉 API

- **[BLOCKER]** La transformación `snake_case` (DB) 👉 `camelCase` (API) ocurre en el repository o service, nunca en el controller ni en el frontend.

## Variables de entorno del frontend y Seguridad

- **[BLOCKER]** Solo datos no sensibles pueden ir en variables `VITE_PUBLIC_*`. Nunca claves privadas, secrets, ni tokens de API con permisos de escritura. Todo secreto reside en `.env` exclusivo de Backend.
- **[STRICT]** Toda variable de entorno usada debe estar documentada en `.env.example` con un comentario que explique su función.
- **[BLOCKER]** Variables de entorno del servidor nunca se exponen al cliente, ni como respuesta de API ni embebidas en el bundle.

## Lecciones Avanzadas de Arquitectura FSD

- **[BLOCKER] Zero Trust en Deserialización (Frontend)**: El Frontend jamás debe creerle a ciegas al Backend. La capa de Servicios UI no puede usar un simple Type Casting en TypeScript (ej: `as Moneda[]`). Se debe forzar el uso de validadores como Zod, o métodos defensivos como `Array.isArray()` en la respuesta de Axios. Si no validamos la forma física del dato recibido, el renderizador colapsará con errores tipo `data.slice is not a function`.
- **[STRICT] Path Aliasing Obligatorio**: Ningún proyecto bajo aislamiento vertical (FSD) debe arrancar sin Alias Absolutos de Rutas. En el `tsconfig.json` y en Vite/Webpack se deben configurar alias como `@features/`, `@infrastructure/` y `@core/`. Esto previene el infierno de las rutas relativas rotas (`../../../../`) al mover carpetas enteras de lugar.
- **[STRICT] Persistencia Polimórfica (Strangler Fig)**: Migrar de un ORM monolítico a un Query Builder jamás ocurre en un día. La carpeta `infrastructure/persistence/` debe actuar como un contenedor de sub-directorios separados (ej. `/typeorm` y `/knex`) para que el código legacy pueda ser consumido por un `IRepository` agnóstico y 'estrangulado' gradualmente en producción sin provocar el colapso del ecosistema completo.
