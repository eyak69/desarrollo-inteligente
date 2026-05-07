# Definition of Done

Una tarea no está terminada hasta que **todos** los puntos aplicables están
marcados. Si alguno no aplica, escribir "N/A" con un motivo de una línea.

## Funcional

- [ ] Cumple los criterios de aceptación.
- [ ] Maneja loading, empty, error y success.
- [ ] Mobile-first verificado en 360 px.
- [ ] Edge cases identificados y testeados (vacío, máximo, errores).

## Calidad

- [ ] Tests unitarios mínimos.
- [ ] Tests de integración para flujos críticos.
- [ ] Lint y typecheck en verde.
- [ ] CI en verde en el PR.

## Seguridad

- [ ] Permisos validados en backend.
- [ ] Inputs validados.
- [ ] Sin secretos commiteados.
- [ ] Sin info sensible en logs.

## Datos

- [ ] Migraciones con `up`/`down` si aplica.
- [ ] Migraciones corren en deploy.
- [ ] Backfill testeado en datos reales (staging) si aplica.

## Operación

- [ ] Variables nuevas en `.env.example`.
- [ ] Logs con `requestId`.
- [ ] `/health` sigue verde tras el deploy.
- [ ] Documentación / `Learning.md` actualizado si aplica.

## Cierre

- [ ] PR mergeado a `develop` (o donde corresponda).
- [ ] Tag/release si llegó a `main`.
- [ ] Notificado al equipo si hay cambios visibles para usuarios.
