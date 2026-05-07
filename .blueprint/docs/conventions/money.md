# Dinero

## Almacenamiento

- [BLOCKER] **Nunca usar `FLOAT` ni `DOUBLE` para dinero.**
- [BLOCKER] Guardar montos como `DECIMAL(precision, scale)` adecuado a la
  moneda. Default razonable: `DECIMAL(18, 4)`.
- [STRICT] Alternativa válida: guardar **enteros en la unidad mínima**
  (centavos para ARS/USD). Si se elige esta vía, dejar comentario en el
  schema y mantener la convención en todo el proyecto.

## Moneda

- [BLOCKER] Toda columna de monto va acompañada de la moneda en código ISO 4217:
  columna `currency CHAR(3)` (`USD`, `ARS`, `EUR`).
- [BLOCKER] No mezclar monedas en sumas sin conversión explícita.
- [STRICT] Tasas de conversión se guardan con timestamp y origen.

## API

```json
{
  "amount": "1234.56",
  "currency": "USD"
}
```

- [STRICT] `amount` viaja como **string** para no perder precisión en JSON.
  El frontend parsea con `Number` o con una libería decimal según haga falta.
- [GUIDE] Para operaciones complejas en frontend, usar `decimal.js` o similar
  (con autorización si no está ya en el stack).

## Display

- [STRICT] Usar `Intl.NumberFormat(locale, { style: 'currency', currency })`.
- [STRICT] Tabular numbers en columnas de monto (ver typography).
- [STRICT] Alinear montos a la derecha en tablas.

## Cálculos

- [BLOCKER] No calcular totales financieros del lado cliente para confirmar
  una operación. La autoridad es siempre el backend.
- [STRICT] Si se calcula en frontend para preview (UX), recalcular en backend
  antes de persistir y usar el del backend.
