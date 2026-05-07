# NotebookLM Connect

## Resumen Operativo
Skill completa para instalar, autenticar y operar NotebookLM vía MCP o cliente Python directo. Cubre el setup inicial desde cero y la conexión desde código. Aplica ante cualquier tarea que involucre notebooks: listar, crear, agregar fuentes o chatear.

**Principio Core:** El cliente Python es SINCRÓNICO y exige tres argumentos separados. Chrome debe arrancarse con flags de debugging para que el auth funcione. Todo esto ya falló en producción — seguí el patrón exacto.

## La Ley de Hierro

> Sin `~/.notebooklm-mcp/auth.json` no hay conexión. Si no existe, ejecutá el flujo de autenticación completo antes de cualquier otra cosa. No hay workaround.

---

## A) Instalación

### Verificar si ya está instalado
```bash
pip show notebooklm-mcp-server
```
Si aparece `Version: X.X.X` → ya instalado, salteá este paso.

### Instalar (priorizar uv, fallback pip)
```bash
# Con uv (preferido):
uv pip install notebooklm-mcp-server

# Con pip si uv no está disponible:
"C:\Users\Cristian\AppData\Local\Programs\Python\Python313\Scripts\pip.exe" install notebooklm-mcp-server
```

### Verificar ejecutables post-instalación
```bash
ls "C:\Users\Cristian\AppData\Local\Programs\Python\Python313\Scripts\notebooklm-mcp.exe"
ls "C:\Users\Cristian\AppData\Local\Programs\Python\Python313\Scripts\notebooklm-mcp-auth.exe"
```
Ambos deben existir. Si falta alguno, la instalación falló.

---

## B) Configuración MCP en Antigravity

### Archivo correcto (único)
```
C:\Users\Cristian\.gemini\antigravity\mcp_config.json
```

### Entrada a agregar
```json
{
  "mcpServers": {
    "notebooklm": {
      "command": "C:\\Users\\Cristian\\AppData\\Local\\Programs\\Python\\Python313\\Scripts\\notebooklm-mcp.exe",
      "args": []
    }
  }
}
```

Si ya hay otras entradas (ej: `stitch`), mergear dentro del mismo objeto `mcpServers` — no reemplazar.

### Verificar que el servidor arranca
```bash
"C:\Users\Cristian\AppData\Local\Programs\Python\Python313\Scripts\notebooklm-mcp.exe"
# Salida esperada: FastMCP X.X.X / Starting MCP server 'notebooklm' / transport 'stdio'
```

---

## C) Autenticación (flujo completo con Chrome)

> El auth usa Chrome DevTools Protocol. Chrome DEBE arrancarse con flags específicos o la conexión falla con 403 Forbidden.

### Paso 1 — Cerrar Chrome existente
```powershell
Stop-Process -Name chrome -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
```

### Paso 2 — Localizar Chrome (ruta real en este sistema)
```
C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
```
**Atención:** NO está en `Program Files` (64-bit) sino en `Program Files (x86)`. Si falla, verificar con:
```powershell
$paths = @(
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)
foreach ($p in $paths) { if (Test-Path $p) { Write-Host "ENCONTRADO: $p" } }
```

### Paso 3 — Lanzar Chrome con debugging habilitado
```powershell
Start-Process "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" -ArgumentList "--remote-debugging-port=9222","--remote-allow-origins=*","--user-data-dir=C:\Users\Cristian\AppData\Local\Google\Chrome\User Data"
Start-Sleep -Seconds 4
```

### Paso 4 — Verificar que Chrome responde en el puerto
```bash
curl -s http://localhost:9222/json/version
# Debe retornar JSON con "Browser": "Chrome/..."
```
Si no responde: Chrome no arrancó bien. Repetir pasos 1-3.

### Paso 5 — Ejecutar el auth
```bash
"C:\Users\Cristian\AppData\Local\Programs\Python\Python313\Scripts\notebooklm-mcp-auth.exe"
```

**Salida esperada al éxito:**
```
NotebookLM MCP Authentication
========================================
Connected to Chrome debugger
Checking login status...
Extracting cookies...
Auth tokens cached to C:\Users\Cristian\.notebooklm-mcp\auth.json

SUCCESS!
Cookies: 27 extracted
CSRF Token: Yes
Session ID: XXXXXXXXXXXXXXXXX
```

Si el usuario no está logueado en NotebookLM, Chrome navegará a la página de login — el usuario debe iniciar sesión con su cuenta Google y luego el CLI extrae las cookies automáticamente.

### Error conocido — 403 Forbidden
```
WebSocketBadStatusException: Handshake status 403 Forbidden
Rejected an incoming WebSocket connection from http://localhost:9222
```
**Causa:** Chrome arrancó sin el flag `--remote-allow-origins=*`.
**Fix:** Cerrar Chrome y relanzar con el paso 3 completo.

---

## D) Verificación final — Listar notebooks desde Python

```python
import sys
sys.path.insert(0, 'C:/Users/Cristian/AppData/Local/Programs/Python/Python313/Lib/site-packages')

from notebooklm_mcp.auth import load_cached_tokens
from notebooklm_mcp.api_client import NotebookLMClient

tokens = load_cached_tokens()
client = NotebookLMClient(tokens.cookies, tokens.csrf_token, tokens.session_id)
notebooks = client.list_notebooks()

print(f'Total cuadernos: {len(notebooks)}')
for nb in notebooks:
    print(f'  - {nb.title} ({nb.source_count} fuentes) — id: {nb.id}')
```

Ejecutar con:
```bash
"C:\Users\Cristian\AppData\Local\Programs\Python\Python313\python.exe" script.py
```

---

## Antipatrones — Los 3 fallos observados en producción (2026-04-28)

```python
# ❌ FALLO 1: pasar el objeto AuthTokens completo al cliente
client = NotebookLMClient(tokens)
# → AttributeError: 'AuthTokens' object has no attribute 'items'
# ✅ FIX: NotebookLMClient(tokens.cookies, tokens.csrf_token, tokens.session_id)

# ❌ FALLO 2: tratar los métodos como async
notebooks = await client.list_notebooks()
# → TypeError: object list can't be used in 'await' expression
# ✅ FIX: notebooks = client.list_notebooks()  (sincrónico, sin await)

# ❌ FALLO 3: serializar objetos Notebook directamente
json.dumps(client.list_notebooks())
# → TypeError: Object of type Notebook is not JSON serializable
# ✅ FIX: acceder a campos directamente: nb.id, nb.title, nb.sources, etc.
```

---

## Operaciones del cliente

### Campos del objeto Notebook
```python
nb.id           # UUID string — usar para identificar el notebook en otras operaciones
nb.title        # str
nb.source_count # int
nb.sources      # list[dict] con claves 'id' y 'title'
nb.is_owned     # bool
nb.is_shared    # bool
nb.created_at   # str ISO 8601
nb.modified_at  # str ISO 8601
```

### Crear notebook
```python
nuevo = client.create_notebook(title="Mi Notebook")
print(nuevo.id)
```

### Agregar fuente URL
```python
client.add_source(notebook_id=nb.id, url="https://ejemplo.com/doc")
```

### Agregar fuente texto
```python
client.add_source(notebook_id=nb.id, text="Contenido...", title="Mi fuente")
```

### Chatear
```python
respuesta = client.chat(notebook_id=nb.id, message="¿De qué trata?")
print(respuesta)
```

---

## Re-autenticación (token dura ~1 semana)

Cuando la API devuelva redirección a `accounts.google.com` o error de auth:
Repetir pasos C completo (cerrar Chrome → relanzar con flags → ejecutar auth).

---

## Paths del sistema (referencia rápida)

| Artefacto | Path |
|-----------|------|
| Chrome | `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe` |
| Python | `C:\Users\Cristian\AppData\Local\Programs\Python\Python313\python.exe` |
| pip/scripts | `C:\Users\Cristian\AppData\Local\Programs\Python\Python313\Scripts\` |
| auth.json | `C:\Users\Cristian\.notebooklm-mcp\auth.json` |
| mcp_config | `C:\Users\Cristian\.gemini\antigravity\mcp_config.json` |

---

*Skill construida desde sesión real el 2026-04-28. Todos los errores y soluciones fueron observados en producción.*
