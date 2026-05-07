# Tipografía

## Fuente

- **Familia oficial:** `Inter`, fallback `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- **Tabular numbers:** activar `font-feature-settings: "tnum"` en columnas
  numéricas y montos para alineación correcta.
- [STRICT] No mezclar fuentes. Si se necesita una segunda fuente (ej. mono para
  código o logs), justificarlo y definirla en el tema centralizado, no en el
  componente.
- [BLOCKER] No usar fuentes de Google Fonts cargadas en el componente. Cargar
  en el HTML base o via `@fontsource/inter` en el bundle.

## Escala tipográfica (MUI variants)

| Variant      | px   | Weight | Line-height | Uso                                      |
|--------------|------|--------|-------------|------------------------------------------|
| `h1`         | 32   | 700    | 1.2         | Título de página principal (único por pantalla) |
| `h2`         | 24   | 700    | 1.3         | Sección principal                        |
| `h3`         | 20   | 600    | 1.35        | Subsección, título de card               |
| `h4`         | 18   | 600    | 1.4         | Título de panel, grupo de formulario     |
| `h5`         | 16   | 600    | 1.4         | Label de sección compacta               |
| `h6`         | 14   | 600    | 1.4         | Subtítulo pequeño                        |
| `subtitle1`  | 16   | 500    | 1.5         | Subtítulo de card o modal               |
| `subtitle2`  | 14   | 500    | 1.5         | Subtítulo secundario                    |
| `body1`      | 16   | 400    | 1.5         | Cuerpo principal                        |
| `body2`      | 14   | 400    | 1.5         | Cuerpo secundario, descripciones        |
| `caption`    | 12   | 400    | 1.4         | Labels de campo, hints, fechas en tabla |
| `overline`   | 11   | 500    | 1.6         | Etiquetas de categoría en mayúsculas    |
| `button`     | 14   | 600    | 1          | Texto de botones (MUI lo aplica solo)   |

- [STRICT] No crear variantes tipográficas fuera de esta escala. Si hace falta
  un tamaño diferente, revisar si la jerarquía visual está bien planteada.
- [STRICT] No usar `fontSize` arbitrario en `sx`. Usar la variant correcta o
  `theme.typography.*`.

## Pesos permitidos

`400` (regular), `500` (medium), `600` (semibold), `700` (bold).

- [STRICT] No usar `300` ni `800+`. Inter los tiene pero rompen la consistencia
  del sistema.

## Mobile

- `h1` reduce a **24px** en mobile (breakpoint `xs`).
- `h2` reduce a **20px**.
- `body1` y `body2` mantienen su tamaño; la jerarquía se ajusta por peso y
  espaciado, no por reducción agresiva de tamaño.
- [STRICT] Tamaño mínimo de texto legible en pantalla: **12px**. No usar
  `caption` (12px) para texto interactivo.

## Configuración en tema

```ts
createTheme({
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 },
    // ... resto de variants
  },
})
```

- [BLOCKER] La escala tipográfica vive en `createTheme`, no distribuida en
  componentes.
