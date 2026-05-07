# Reglas de Notificaciones (Feedback Visual)

El Blueprint utiliza un sistema de notificaciones no obstructivas (Toasts) para informar al usuario sobre el resultado de sus acciones sin interrumpir el flujo de trabajo.

## Estándar Tecnológico

- [BLOCKER] **Motor:** [Sonner](https://sonner.emilkowal.ski/). No usar `alert()`, `window.confirm()` ni librerías alternativas de toast.
- [STRICT] **Configuración obligatoria:** `theme="dark"`, posición `top-right`, `richColors={true}`.

```tsx
// En el root de la app (App.tsx o Layout.tsx)
import { Toaster } from 'sonner';

<Toaster theme="dark" position="top-right" richColors />
```

## Jerarquía de Notificaciones

### 1. Éxito (`toast.success`) — [STRICT]
- **Cuándo usar:** Al completar con éxito una acción de escritura (Crear, Editar, Borrar).
- **Cuándo NO usar:** En acciones de solo lectura (cargar datos, navegar).
- **Contenido:** Mensaje corto y directo. Usar `description` para contexto adicional.

### 2. Error (`toast.error`) — [BLOCKER]
- **Cuándo usar:** Cuando una operación falla por validación de servidor, pérdida de conexión o error interno.
- **Contenido:** Explicar brevemente qué falló y, si es posible, cómo solucionarlo.
- **[BLOCKER] Prohibido:** Mostrar mensajes técnicos de DB, stack traces o rutas internas.

### 3. Promesa (`toast.promise`) — [GUIDE]
- **Cuándo usar:** En operaciones de larga duración (subida de archivos pesados, generación de reportes).
- **Contenido:** Mostrar estado "Cargando", "Éxito" y "Error" de forma reactiva a la promesa.

## Reglas de UX

- [STRICT] **No saturar:** No disparar toasts por acciones triviales de lectura ("Datos cargados", "Cargando...").
- [STRICT] **Auto-cierre:** Toasts de éxito se cierran solos a los **4 segundos** (`duration: 4000`).
- [STRICT] **Persistencia en errores críticos:** Errores que requieren acción del usuario usan `duration: Infinity` para forzar lectura manual.
- [STRICT] **Accesibilidad:** Mensajes concisos, sin jerga técnica, con verbo de acción claro ("Guardado", "No se pudo guardar").

## Ejemplo de implementación

```typescript
import { toast } from 'sonner';

// Éxito tras mutación
toast.success('Cambios guardados', {
  description: 'La configuración se actualizó correctamente.',
  duration: 4000,
});

// Error de API
toast.error('No se pudo guardar', {
  description: error.message ?? 'El servidor no responde. Intentá de nuevo.',
  duration: Infinity, // el usuario debe cerrarlo manualmente
});

// Operación larga con promesa
toast.promise(uploadFile(file), {
  loading: 'Subiendo archivo...',
  success: 'Archivo subido correctamente',
  error: 'Error al subir el archivo',
});
```
