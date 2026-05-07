# Radius y Elevation

## Border radius

| Token | px  | Uso                                              |
|-------|-----|--------------------------------------------------|
| none  | 0   | tablas, listas densas                            |
| sm    | 4   | inputs, chips, badges                            |
| md    | 8   | botones, cards pequeñas                          |
| lg    | 12  | cards principales, paneles, modales              |
| xl    | 16  | hero, contenedores grandes                       |
| full  | 9999| pills, avatares circulares                       |

- [STRICT] No mezclar más de 2 tokens de radius en una misma pantalla.
- [BLOCKER] No usar radius arbitrarios fuera de la escala.

## Elevation (sombras)

| Token | Sombra (light)                                       | Uso                          |
|-------|------------------------------------------------------|------------------------------|
| 0     | none                                                 | inline, fondos planos        |
| 1     | `0 1px 2px rgba(15,23,42,0.06)`                      | cards, inputs hover          |
| 2     | `0 4px 8px rgba(15,23,42,0.08)`                      | dropdowns, popovers          |
| 3     | `0 8px 16px rgba(15,23,42,0.10)`                     | modales, dialogs             |
| 4     | `0 16px 32px rgba(15,23,42,0.14)`                    | overlays grandes             |

En dark mode la elevación se logra subiendo el `surface` (más claro), no
oscureciendo la sombra. Usar `surface-alt` y bordes `border` para diferenciar
capas.

## Borders

- Color: token `border`.
- Grosor por defecto: **1 px**.
- En foco: **2 px** del color `primary` con offset (no border-thicker, sino
  `outline` o `box-shadow` ring).

## Foco

- [BLOCKER] Todo elemento interactivo debe tener un estado de foco visible.
  Anillo de foco mínimo: `0 0 0 2px primary` o equivalente outline 2px.
- [BLOCKER] Nunca remover `outline` sin reemplazarlo por uno equivalente.
