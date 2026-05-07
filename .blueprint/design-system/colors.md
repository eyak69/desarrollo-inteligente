# Colores

## Reglas

- [BLOCKER] Usar tema centralizado de MUI (`createTheme` + `ThemeProvider`).
- [BLOCKER] Prohibido hardcodear colores hex/rgb dentro de componentes. Todo
  pasa por `theme.palette.*` o el token correspondiente.
- [STRICT] Dark mode debe estar contemplado desde el día uno, no agregado como
  parche. Toda regla de color de este documento aplica tanto a light como a
  dark mode.
- [STRICT] No usar `sx={{ color: '#...' }}` ni `style={{ color: '...' }}`.
  Usar `color="primary"`, `color="text.secondary"`, o el token equivalente.
- [BLOCKER] No modificar la paleta base de MUI directamente. Extender solo
  a través de `createTheme`.

## Paleta base (light mode)

| Token                  | Rol                                                   |
|------------------------|-------------------------------------------------------|
| `primary.main`         | Acción principal, botones primarios, links activos    |
| `primary.light`        | Hover de primary, backgrounds suaves de alerta info   |
| `primary.dark`         | Active state, focus ring                              |
| `secondary.main`       | Acciones secundarias, badges, chips                   |
| `error.main`           | Errores, estados destructivos, validaciones fallidas  |
| `warning.main`         | Alertas, estados de precaución                        |
| `success.main`         | Confirmaciones, estados completados                   |
| `info.main`            | Información neutral, tooltips                         |
| `text.primary`         | Texto principal (headings, labels, body)              |
| `text.secondary`       | Texto de apoyo (captions, placeholders activos)       |
| `text.disabled`        | Texto deshabilitado                                   |
| `background.default`   | Fondo de página                                       |
| `background.paper`     | Fondo de cards, modales, dropdowns                    |
| `divider`              | Líneas separadoras, bordes de tabla                   |
| `action.hover`         | Hover sobre filas, items de lista                     |
| `action.selected`      | Item seleccionado en lista/grid                       |
| `action.disabled`      | Elementos deshabilitados                              |

## Dark mode

- En dark mode la elevación se logra aclarando el `surface` (`background.paper`
  más claro que `background.default`), no oscureciendo sombras.
- Los tokens de paleta mantienen los mismos nombres; solo cambian los valores.
- [STRICT] Nunca hardcodear un color pensando solo en light mode.
- [STRICT] Usar `theme.palette.mode` para lógica condicional si es
  estrictamente necesario, no `window.matchMedia`.

## Contraste mínimo (WCAG 2.1 AA)

- [BLOCKER] Texto normal sobre fondo: relación mínima **4.5:1**.
- [BLOCKER] Texto grande (≥18pt o ≥14pt bold) sobre fondo: mínimo **3:1**.
- [BLOCKER] Componentes interactivos y estados (foco, hover, error): mínimo
  **3:1** contra el fondo adyacente.
- Verificar contraste en ambos modos (light y dark) antes de mergear.

## Semántica de color

- [STRICT] No usar color como único diferenciador de estado. Siempre acompañar
  con ícono, texto o patrón (aplica especialmente a error/success/warning).
- [STRICT] Rojo (`error`) solo para estados de error reales, no para acciones
  de eliminación que no son destructivas.
- [GUIDE] Para estados de fila en tablas (vencido, pendiente, activo) usar
  `alpha(color, 0.08)` como background para no sobrecargar visualmente.
