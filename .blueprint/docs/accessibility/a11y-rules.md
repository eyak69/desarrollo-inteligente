# Accesibilidad (WCAG 2.1 AA)

Objetivo concreto: cumplir WCAG 2.1 nivel AA en todas las pantallas. Si no
podés afirmar que cumplís estos puntos, la feature no está terminada.

## Teclado

- [BLOCKER] Toda acción posible con mouse debe ser posible con teclado.
- [BLOCKER] Foco visible en todo elemento interactivo (ver `radius-elevation.md`).
- [BLOCKER] Orden de tab lógico (DOM order = orden visual).
- [BLOCKER] Modales atrapan el foco al abrir y lo restauran al cerrar (focus trap).
- [STRICT] Atajos típicos: `Esc` cierra modales/popovers; `Enter` envía forms;
  `Space` activa botones.

## Lectores de pantalla

- [BLOCKER] Todo input tiene `<label>` asociado. Placeholder no reemplaza label.
- [BLOCKER] Botones de solo ícono tienen `aria-label`.
- [BLOCKER] Imágenes informativas tienen `alt`. Imágenes decorativas: `alt=""`.
- [STRICT] Estados loading/empty/error tienen `role="status"` o `role="alert"`
  según corresponda.
- [STRICT] Tablas usan `<th scope="col">` y, si aplica, `<caption>`.

## Contraste

- [BLOCKER] Texto: 4.5:1 mínimo. Texto grande: 3:1. (Ver `colors.md`.)
- [BLOCKER] Componentes interactivos y estados (foco, error, hover): 3:1
  contra el fondo adyacente.

## Motion

- [BLOCKER] Respetar `prefers-reduced-motion: reduce`. Animaciones largas o
  con movimiento lateral se desactivan o se reducen drásticamente.
- [STRICT] Nada parpadea más de 3 veces por segundo.

## Forms

- [BLOCKER] Errores asociados al input por `aria-describedby`.
- [BLOCKER] Mensajes de error explican qué está mal y cómo arreglarlo.
- [STRICT] Campos requeridos marcados visualmente y con `aria-required="true"`.
- [STRICT] No usar solo color para indicar error (usar ícono + texto).

## Idioma

- [STRICT] `<html lang="...">` correcto. Si una sección está en otro idioma,
  usar `lang` en ese bloque.

## Testing

- [STRICT] Pasar `eslint-plugin-jsx-a11y` sin errores.
- [STRICT] Tests con React Testing Library usan queries accesibles
  (`getByRole`, `getByLabelText`) por sobre `getByTestId`.
- [GUIDE] Smoke a11y con `axe-core` en pantallas críticas.
