# Reporte de Desviaciones y Plan de Remediación

Este documento detalla las fallas técnicas detectadas en la demo **Laboratorio de Ideas** frente al **Blueprint Maestro** y los pasos para su corrección.

## 🔴 Desviaciones Críticas (Blockers/Strict)

### 1. Fuga de Lógica en Controladores
- **Falla:** La validación de esquemas (Zod) y el manejo de respuestas de error están hardcodeados en el controlador.
- **Impacto:** Código repetitivo, difícil de mantener y propenso a inconsistencias en las respuestas de error de la API.
- **Acción:** Mover validaciones a `validate.middleware.ts` y usar un manejador de errores global.

### 2. Mapeo Incorrecto de Datos
- **Falla:** El servicio realiza el mapeo de `snake_case` (DB) a `camelCase` (Frontend).
- **Impacto:** El repositorio devuelve objetos "sucios" (DB model) en lugar de DTOs limpios, violando la Regla 232.
- **Acción:** Mover el mapeo al `IdeaRepository` mediante un método `toDTO()`.

### 3. Ausencia de Paginación Mandatoria
- **Falla:** El endpoint de listado no tiene límites.
- **Impacto:** Riesgo de denegación de servicio (DoS) y saturación de memoria si la tabla crece. Violación de la Regla 36.
- **Acción:** Implementar `limit` y `offset` en la consulta Knex y devolver metadatos de paginación.

## 📋 Lista de Tareas para Reparación

- [ ] **Infraestructura Core:**
    - [ ] Crear `AppError` en `server/src/errors/`.
    - [ ] Implementar `error.middleware.ts` para respuestas estandarizadas.
    - [ ] Implementar `validate.middleware.ts`.
- [ ] **Refactor de Laboratorio de Ideas:**
    - [ ] Adaptar `IdeaRepository` con `toDTO()` y paginación.
    - [ ] Limpiar `IdeaService` de lógica de transporte.
    - [ ] Limpiar `IdeaController` eliminando `try/catch` y `z.parse()`.
    - [ ] Actualizar rutas para usar los nuevos middlewares.

---
*Generado por el Oráculo del Blueprint — 2026-05-08*
