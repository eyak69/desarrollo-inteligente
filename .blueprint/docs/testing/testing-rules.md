# Testing

## Stack oficial (Implementado v1.0.0)

- **Unitarios / Integración (Frontend & Backend):** [Vitest](https://vitest.dev/). Se eligió por su velocidad y compatibilidad nativa con el entorno Vite/TSX.
- **E2E:** Playwright (Pendiente de implementación).
- **Carga / Stress:** k6.

## Estrategia por capa

### Unitarios
- Lógica pura: helpers, formatters, validaciones, cálculos.
- Hooks con lógica compleja.
- Services del backend (mockeando el repository).

### Integración
- Endpoints críticos: happy path + error + permiso denegado.
- Flujos de formulario completos.
- Interacciones con DB usando una base de test (no mocks de DB salvo
  justificación explícita, porque los mocks no detectan errores de schema).

### E2E (Playwright)
- Flujos críticos de negocio: login, alta de entidad principal, operación
  destructiva con confirmación.
- No reemplaza los tests de integración; los complementa.

## Cobertura mínima aceptable

- [STRICT] No existe un número mágico de porcentaje. El criterio es:
  **happy path + al menos 1 caso de error + al menos 1 caso de permiso**
  por endpoint o flujo crítico.
- [STRICT] Todo bug fix debe venir acompañado de un test de regresión que
  reproduzca el bug antes del fix (red → green).
- [GUIDE] Apuntar a >80% en servicios backend. Por debajo de eso, revisar
  si hay lógica de negocio sin cobertura.

## Queries en React Testing Library

- [STRICT] Usar queries accesibles en este orden de preferencia:
  1. `getByRole` (refleja lo que ve un lector de pantalla)
  2. `getByLabelText`
  3. `getByPlaceholderText`
  4. `getByText`
  5. `getByTestId` (último recurso, solo si no hay otra opción semántica)
- [STRICT] No usar `getByTestId` para elementos que tienen rol o label.

## Qué probar obligatoriamente

- Login y logout.
- Permisos: usuario sin rol no accede a recurso protegido.
- Listados: paginación, filtros, estado vacío.
- Formularios: submit válido, submit con error de validación, error de API.
- Errores de API: que el componente muestra `ErrorState`, no pantalla en blanco.
- Mobile responsive: al menos los flujos críticos en viewport 360px.
- Grillas con datos: que no rompen con página vacía ni con 1000 registros.

## Organización

- Tests unitarios y de integración: junto al archivo que testean
  (`UserService.test.ts` al lado de `UserService.ts`).
- Tests E2E: en `/e2e` en la raíz del proyecto.
- Fixtures y factories: en `/tests/factories` o `/tests/fixtures`.

## Reglas

- [STRICT] Los tests deben pasar en CI antes de mergear. Si un test flakea,
  se arregla o se elimina: no se ignora.
- [BLOCKER] No comentar tests para que pase el CI.
- [STRICT] Un test que solo verifica que la función fue llamada (spy sin
  assert de comportamiento) no cuenta como cobertura real.
- [GUIDE] Preferir tests de comportamiento (qué hace) sobre tests de
  implementación (cómo lo hace internamente).

## Documentación y Evidencia

- [STRICT] **Reporte de Hito:** Cada cambio arquitectónico o funcional importante (v0.x.x) DEBE ir acompañado de un archivo de evidencia (`walkthrough.md`) que documente los tests ejecutados y sus resultados.
- [STRICT] **Captura de Salida:** Los resultados de la consola de los tests (Vitest/k6) deben ser persistidos en la documentación del hito para auditoría técnica.
- [STRICT] **Trazabilidad:** El reporte de tests debe vincularse al ticket, tarea o decisión de arquitectura (`decision-log.md`) que motivó el cambio.
- [GUIDE] **Cobertura Visual:** Para cambios en la UI, el reporte debe incluir capturas de pantalla o grabaciones que demuestren que los componentes responden correctamente a los estados de éxito/error validados en los tests.
- [STRICT] **Sincronización:** Los resultados de las pruebas y las nuevas reglas detectadas deben volcarse al sistema de conocimiento central (NotebookLM) para asegurar que la "buena programación" se mantenga actualizada.
