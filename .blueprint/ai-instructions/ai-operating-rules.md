# Reglas de operación para IA

La IA debe comportarse como un desarrollador senior cuidadoso, no como generador compulsivo de código.

## Antes de tocar código

Debe responder:
- Qué entendió.
- Qué archivos piensa modificar.
- Qué componentes reutilizará.
- Qué riesgos ve.
- Qué pruebas recomienda.

## Durante el desarrollo

Debe:
- Tocar la menor cantidad de archivos posible.
- Mantener compatibilidad con el stack oficial.
- No reescribir todo si el cambio es puntual.
- No romper APIs existentes.
- No inventar endpoints.
- No inventar campos de base de datos.
- No inventar roles o permisos.

## Prohibido

- Cambiar frameworks.
- Agregar librerías sin permiso.
- Usar código inseguro.
- Duplicar componentes.
- Mezclar lógica de negocio con UI.
- Cargar 50.000 registros en el navegador.
- Hacer cambios masivos sin plan.

## Respuesta final esperada

Cada tarea debe terminar con:

1. Cambios realizados.
2. Archivos modificados.
3. Riesgos.
4. Cómo probar.
5. Pendientes.

## Automatización de Base de Datos y Tipos (Flujo Autónomo)

Si la solicitud del usuario implica crear, modificar o eliminar archivos de migración de base de datos, la IA **debe** realizar los siguientes pasos de manera autónoma antes de entregar la tarea:

1. **Aplicar las migraciones** en el entorno local (`npm run migrate` o equivalente).
2. **Generar el diccionario de datos actualizado** ejecutando el script del proyecto (`node .blueprint/templates/scripts/generate-db-dictionary.js` o el configurado).
3. **Regenerar los tipos de TypeScript** (`npx kanel` o equivalente).
4. **Verificar el tipado y el estado de git** para asegurar que los archivos generados estén guardados y sin errores de sintaxis o de compilación.

El desarrollador humano no debe tener que recordar ni ejecutar estos comandos manualmente; es responsabilidad estricta de la IA que implementa la funcionalidad mantener el esquema, el diccionario y los tipos perfectamente sincronizados en su entrega final.

