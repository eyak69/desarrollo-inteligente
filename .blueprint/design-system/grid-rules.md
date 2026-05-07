# Reglas de grillas

Framework oficial:
- AG Grid

## Casos

### ABM simple
Usar DataGrid estándar.

### Maestro detalle
Usar AG Grid Master Detail.

### Árbol
Usar AG Grid Tree Data.

### Datos masivos
Usar server-side row model, paginación o infinite loading.

## Prohibido

- Cargar 50.000 registros completos en React.
- Filtrar datasets enormes solo en frontend.
- Ordenar datasets enormes solo en frontend.
- Hacer grillas manuales para casos complejos.

## Backend requerido

Toda grilla grande debe soportar:
- page
- pageSize
- sort
- filters
- search
- total
