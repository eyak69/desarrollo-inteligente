# Troubleshooting — Problemas frecuentes

Soluciones a los errores y preguntas más comunes del proyecto.

---

## TypeScript

### `Type 'X' is not assignable to type 'Y'`
Verificar que el tipo del repositorio (`XDB`) no esté saliendo de la capa de datos. El controller y el service deben recibir el tipo de dominio (`X`) o un DTO (`XDTO`), no el tipo de DB.

### `Object is possibly 'undefined'`
Con `strict: true`, TypeScript no permite acceder a propiedades de valores que pueden ser `null` o `undefined` sin chequeo previo. Usar optional chaining (`?.`) o un guard explícito. No usar `as X` para silenciar el error.

### `No overload matches this call` en `useForm`
Verificar que el tipo genérico de `useForm<T>` coincide con el tipo inferido del schema Zod: `type T = z.infer<typeof schema>`.

---

## TanStack Query

### Los datos no se actualizan después de una mutación
Falta invalidar el query key correspondiente en `onSuccess`:
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['nombre-del-recurso'] });
}
```

### `isLoading` siempre es `false`
En TanStack Query v5, `isLoading` fue renombrado a `isPending`. Usar `isPending`.

### El componente muestra datos viejos al volver a la pantalla
El `staleTime` configurado es mayor al tiempo transcurrido. Para datos transaccionales, usar `staleTime: 0` o un valor bajo (≤30s). Ver [frontend-rules.md](../frontend/frontend-rules.md).

---

## Formularios (React Hook Form)

### Los errores de validación no aparecen
Verificar que el campo está registrado con `{...register('nombreCampo')}` y que `errors.nombreCampo?.message` está siendo pasado como `helperText` al componente.

### El submit no llama a `onSubmit`
Si hay errores de validación, `handleSubmit` bloquea el submit. Revisar la consola de React — puede haber errores de schema Zod que no se están mostrando. También verificar que el `<form>` tiene `onSubmit={handleSubmit(onSubmit)}`.

### `zodResolver` no valida correctamente
Verificar que `@hookform/resolvers` está instalado (`npm list @hookform/resolvers`) y que se importa correctamente: `import { zodResolver } from '@hookform/resolvers/zod'`.

---

## Base de datos / Soft Delete

### Un listado muestra registros borrados
El método `getAll()` del repositorio no está filtrando `deleted_at IS NULL`. Verificar que el repositorio extiende `BaseRepository` y no sobreescribe `getAll()` sin el filtro.

### Error de unicidad al crear un registro con email ya existente (borrado)
El email existe en un registro con `deleted_at` no nulo. Dos opciones:
1. Usar índice compuesto `(email, deleted_at)` para permitir el mismo email en registros borrados.
2. Verificar la existencia incluyendo borrados y decidir si reactivar el registro o rechazar la operación.

### Las migraciones fallan en producción
1. Verificar que la migración tiene tanto `up` como `down`.
2. Correr `knex migrate:status` para ver cuáles migraciones están pendientes.
3. Nunca editar una migración ya ejecutada en producción — crear una migración nueva.

---

## ESLint / Pre-commit

### El pre-commit hook no se ejecuta
Verificar que Husky está instalado: `npm run prepare` desde la raíz. Si el hook existe pero no corre, verificar permisos: `chmod +x .husky/pre-commit`.

### `react-hooks/exhaustive-deps` warning en `useEffect`
Agregar la dependencia faltante al array o, si la dependencia es una función, envolverla en `useCallback`. No suprimir el warning con `// eslint-disable` sin entender la causa.

### `no-explicit-any` error
Reemplazar `any` con el tipo correcto. Si el tipo viene de una librería externa sin types, usar `unknown` y hacer un type guard. Si es absolutamente inevitable, documentar el motivo en un comentario una línea antes del `eslint-disable`.

---

## Paginación

### `page=0` devuelve resultados incorrectos
La paginación es **1-based**: `page=1` es la primera página. El offset se calcula como `(page - 1) * pageSize`. Si `page=0` llega al backend, Zod debe rechazarlo con `z.number().int().min(1)`.

### AG Grid muestra página vacía al cargar
AG Grid server-side envía `startRow=0` para la primera página. Convertir a `page=1` con `Math.floor(startRow / pageSize) + 1` en el adapter.

---

## Docker / Deploy

### El contenedor no levanta (healthcheck fallando)
Verificar que el endpoint `/health` responde 200 y que la DB está accesible desde dentro del contenedor. Revisar los logs: `docker logs <container_id>`.

### Las migraciones no corren en el deploy
El script de deploy debe ejecutar `npm run migrate` antes de iniciar el servidor. Verificar el orden en el `Dockerfile` o en el script de entrypoint.

### Variables de entorno no disponibles en el contenedor
Las variables deben inyectarse en runtime, no en la imagen. Verificar que el `docker-compose.yml` o el orquestador tiene las variables configuradas. Nunca incluirlas en el `Dockerfile`.
