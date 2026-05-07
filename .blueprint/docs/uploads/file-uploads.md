# Uploads de archivos

## Reglas duras

- [BLOCKER] Validar **siempre** en backend: tamaño, MIME real (sniffing por
  bytes, no solo por extensión ni por header), nombre.
- [BLOCKER] Sanitizar el nombre de archivo. Nunca persistir el nombre crudo del
  usuario como path. Usar UUID + extensión derivada del MIME real.
- [BLOCKER] Tamaño máximo configurado por endpoint, default **10 MB**. Topear
  con middleware antes de tocar disco.
- [BLOCKER] Whitelist de MIME por endpoint. Default permitido para "imágenes":
  `image/png`, `image/jpeg`, `image/webp`. Para "documentos":
  `application/pdf`, `text/plain`. Adaptar al caso.
- [BLOCKER] Servir archivos subidos desde un **dominio o path separado**, sin
  cookies de la app, con `Content-Disposition: attachment` cuando aplique.
- [STRICT] Antivirus / sandbox antes de exponer archivos a otros usuarios.
- [STRICT] Renombrar/normalizar imágenes (re-encode) para limpiar metadata
  (EXIF) y posibles payloads.

## Storage

- [STRICT] No guardar archivos grandes en la DB. Usar storage de objetos
  (S3/MinIO/equivalente) o filesystem montado.
- [STRICT] Persistir en DB **solo metadata**: id, owner, mime, size, path,
  hash (SHA-256), uploaded_at.

## Frontend

- [STRICT] Mostrar progreso, tamaño máximo y MIME aceptado **antes** de subir.
- [STRICT] Validar tamaño y MIME aproximado en cliente para UX, pero **no**
  confiar en eso para seguridad.
- [STRICT] Componente único `FileUploadField` reutilizable en el design system.

## URLs firmadas

- [STRICT] Para descarga de archivos privados, usar URLs firmadas con TTL
  corto (≤ 5 min) y permisos al usuario correcto, validados en backend.
- [BLOCKER] Nunca exponer URLs públicas permanentes para contenido privado.
