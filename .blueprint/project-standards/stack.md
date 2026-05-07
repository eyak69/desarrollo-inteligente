# Stack oficial

## Frontend

- React
- TypeScript
- Vite
- MUI / Material UI
- AG Grid
- TanStack Query
- React Router

## Backend

- Node.js
- Express
- TypeScript
- Zod
- SQL parametrizado / Query Builder controlado

## Base de datos

- MySQL / MariaDB / Oracle según proyecto.
- SQL pesado escrito a mano, parametrizado y optimizado.
- No ocultar reportes complejos detrás de ORM si eso complica performance.

## Testing

- Vitest
- React Testing Library
- Playwright

## Deploy

- Docker
- Variables de entorno
- Reverse proxy
- HTTPS obligatorio en producción

## No usar salvo autorización explícita

- Next.js
- Redux
- Tailwind
- Sequelize
- Prisma
- NestJS
- Librerías UI alternativas
- Frameworks experimentales

## Reglas de Integridad Técnica

- **Integridad de Dependencias:** Prohibido importar librerías (`import`) que no estén declaradas en el `package.json`. Se debe verificar la existencia y compatibilidad de versiones antes de codificar.
- **Cero Errores de Compilación:** No se entrega código que cause fallos en el entorno de desarrollo o construcción (Vite/TSC).

## Regla madre

No tomar decisiones de stack.
El stack ya está definido.
