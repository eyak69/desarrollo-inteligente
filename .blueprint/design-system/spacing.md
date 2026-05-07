# Spacing

Sistema de espaciado base **4 px**, alineado al `theme.spacing` de MUI con
unidad = 4 (`createTheme({ spacing: 4 })`). Es decir, `theme.spacing(2)` = 8 px.

## Escala

| Token | px  | MUI    | Uso                                          |
|-------|-----|--------|----------------------------------------------|
| 0     | 0   | 0      | reset                                        |
| 1     | 4   | 1      | gap mínimo (icono + texto)                   |
| 2     | 8   | 2      | espacio entre items relacionados             |
| 3     | 12  | 3      | inputs internos                              |
| 4     | 16  | 4      | padding base de componentes                  |
| 5     | 20  | 5      | separación de elementos hermanos             |
| 6     | 24  | 6      | padding de cards / paneles                   |
| 8     | 32  | 8      | separación entre secciones                   |
| 10    | 40  | 10     | bloques mayores                              |
| 12    | 48  | 12     | padding de página en desktop                 |
| 16    | 64  | 16     | espacios generosos / hero                    |

## Reglas

- [STRICT] No usar valores fuera de la escala. Si un caso requiere algo
  intermedio, primero revisar si la jerarquía visual está bien.
- [BLOCKER] No usar `margin` para "centrar" cosas. Usar layout (flex/grid).
- [STRICT] El padding interno de un componente no se mezcla con el margin
  externo del padre: el contenedor decide el ritmo.

## Touch targets

- [BLOCKER] Botones e ítems táctiles: mínimo **44 × 44 px** efectivos
  (incluyendo padding). Aplica también a íconos clickables.

## Mobile

- Padding de página: **16 px** (`spacing 4`).
- Gap entre cards: **12 px** (`spacing 3`).
- Form fields: gap vertical **16 px** (`spacing 4`).

## Desktop

- Padding de página: **24–48 px** (`spacing 6` a `12`).
- Gap entre paneles: **24 px** (`spacing 6`).
