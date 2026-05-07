# Checklist de Code Review

Para usar al revisar un PR (humano o IA). El reviewer no aprueba si algún
BLOCKER queda sin resolver.

## Diseño

- [ ] El cambio es del tamaño correcto (no PR gigante mezclando todo).
- [ ] Respeta la arquitectura (capas: routes → controllers → services → repositories).
- [ ] Reutiliza componentes y servicios existentes en lugar de duplicar.
- [ ] No introduce librerías nuevas sin discusión previa.

## Stack y blueprint

- [ ] No cambia el stack oficial.
- [ ] Sigue convenciones de naming (`docs/conventions/naming.md`).
- [ ] Si toca UI, usa el design system.
- [ ] Si toca API, sigue formato estándar de errores y paginación.

## Seguridad (BLOCKER)

- [ ] Permisos validados en backend.
- [ ] Inputs validados con Zod.
- [ ] SQL parametrizado.
- [ ] No expone stack ni nombres internos en errores.
- [ ] No loguea passwords, tokens, ni datos sensibles.
- [ ] No agrega secretos al repo.

## Datos

- [ ] No carga datasets >1000 registros en frontend.
- [ ] Listados con paginación server-side.
- [ ] Migración (si aplica) tiene `up` y `down`.

## Frontend

- [ ] Mobile-first verificado en 360 px.
- [ ] Estados loading / empty / error / success implementados.
- [ ] Accesibilidad mínima: labels, foco, contraste, teclado.
- [ ] No hardcodea colores ni tamaños fuera del theme.

## Tests

- [ ] Tests existentes pasan.
- [ ] Tests nuevos cubren happy path + 1 error + 1 permiso si aplica.
- [ ] Si fue bug fix, hay test de regresión.

## Operación

- [ ] Variables de entorno nuevas documentadas en `.env.example`.
- [ ] Logs útiles (con `requestId`, sin secretos).
- [ ] Si hay migración, está integrada al flujo de deploy.
