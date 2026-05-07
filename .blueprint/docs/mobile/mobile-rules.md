# Reglas mobile

## Breakpoints

| Nombre  | Rango           | MUI key |
|---------|-----------------|---------|
| Mobile  | 360px – 767px   | `xs`    |
| Tablet  | 768px – 1023px  | `sm`    |
| Desktop | 1024px+         | `md`+   |

- [STRICT] Diseñar desde **360px** de ancho mínimo. No asumir más.
- [STRICT] No usar `@media` hardcodeado. Usar `theme.breakpoints.up/down/between`.

## Pantallas

- Mobile-first: el layout base es mobile; desktop es el override.
- Formularios en una columna en mobile. Dos columnas solo desde `sm` con
  justificación explícita.
- Botones de acción principal: ancho completo (`fullWidth`) en mobile.
- Navegación: Drawer lateral con hamburger. No sidebar fijo en mobile.
- Acciones críticas (guardar, confirmar) siempre visibles sin scroll.
- Evitar modales grandes en mobile. Usar Drawer o pantalla completa para
  edición compleja.

## Touch targets

- [BLOCKER] Mínimo **44 × 44 px** efectivos en todo elemento táctil
  (botones, íconos clickables, items de lista). Incluye padding invisible.
- [STRICT] No depender de hover para revelar acciones. En mobile no existe hover.
- [STRICT] Espaciado mínimo entre targets táctiles adyacentes: **8px** para
  evitar toques accidentales.

## Tablas en mobile

- [STRICT] Las grillas con más de 4 columnas deben tener versión mobile.
- Opciones válidas (en orden de preferencia):
  1. Convertir filas a cards con campos clave.
  2. Columnas fijas con scroll horizontal controlado y explicit overflow.
  3. Detalle expandible por fila.
- [STRICT] Evitar scroll horizontal salvo excepción justificada con comentario
  en el código.
- Usar botón "Ver detalle" para datos secundarios, no mostrar todo en la fila.

## Formularios

- Labels siempre visibles. Placeholder no reemplaza al label.
- Inputs grandes y claros: `size="medium"` de MUI como mínimo en mobile.
- Teclado virtual: usar `inputMode` correcto (`numeric`, `email`, `tel`, etc.).
- Campos de fecha: usar DatePicker con input nativo en mobile cuando sea posible.
- Gap vertical entre fields: **16px** (`spacing 4`).

## Performance mobile

- [STRICT] No cargar imágenes de alta resolución en mobile. Usar `srcset` o
  versiones optimizadas.
- [GUIDE] Lazy load de rutas y componentes pesados.
- [STRICT] No bloquear el hilo principal con operaciones síncronas pesadas
  (parseo, cálculos) en mobile.

## UX

- Feedback inmediato en toda acción (loading, toast, skeleton).
- Loading visible durante transiciones de pantalla.
- Errores entendibles: mensaje claro, sin jerga técnica.
- Confirmaciones para acciones destructivas (delete, cancelar pedido, etc.).
- [STRICT] Formularios largos deben indicar progreso si tienen más de 2 pasos.
