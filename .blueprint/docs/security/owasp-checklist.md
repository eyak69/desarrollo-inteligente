# Checklist OWASP práctico

Antes de dar una feature por terminada:

## Control de acceso

- ¿El backend valida el usuario?
- ¿El backend valida el rol?
- ¿El backend valida que el recurso pertenezca al usuario?
- ¿Se evita IDOR?

## Inputs

- ¿Todos los inputs se validan?
- ¿Hay límites de longitud?
- ¿Hay tipos esperados?
- ¿Hay sanitización cuando corresponde?

## Errores

- ¿No se muestran stack traces?
- ¿No se muestran SQL ni rutas internas?
- ¿El usuario ve mensajes claros pero no sensibles?

## Dependencias

- ¿Se revisaron vulnerabilidades?
- ¿La librería es necesaria?
- ¿Tiene mantenimiento?

## Datos

- ¿Se devuelve solo lo necesario?
- ¿No se exponen campos internos?
- ¿No se exponen secretos?

## Frontend

- ¿Funciona sin exponer seguridad?
- ¿No guarda tokens inseguros?
- ¿No usa dangerouslySetInnerHTML?
