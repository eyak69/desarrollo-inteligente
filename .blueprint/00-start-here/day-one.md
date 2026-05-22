# Día 1 — Guía de inicio rápido

Para desarrolladores que se incorporan al proyecto. Completar en orden.

---

## 1. Leer primero (30 min)

En este orden exacto:

1. Este archivo hasta el final.
2. [antigravity-master-prompt.md](antigravity-master-prompt.md) — filosofía y reglas de IA.
3. [../ai-instructions/rule-severity.md](../ai-instructions/rule-severity.md) — qué significa BLOCKER / STRICT / GUIDE.
4. [../project-standards/stack.md](../project-standards/stack.md) — qué tecnologías usamos y cuáles están prohibidas.
5. [../project-standards/architecture.md](../project-standards/architecture.md) — estructura de carpetas y capas.
6. [../docs/conventions/quick-reference.md](../docs/conventions/quick-reference.md) — cheat sheet de referencia rápida.

El resto del blueprint se lee a medida que trabajás en cada área.

---

## 2. Configurar el entorno (15 min)

### Requisitos
- Node.js 22+ (LTS)
- npm 10+
- Docker Desktop

### Setup
```bash
# 1. Instalar dependencias
cd client && npm ci
cd ../server && npm ci

# 2. Configurar variables de entorno
cp server/.env.example server/.env
# Editar server/.env con los valores del equipo

# 3. Levantar la base de datos
docker-compose up -d

# 4. Correr migraciones
cd server && npm run migrate

# 5. Verificar que todo funciona
npm run dev          # servidor en http://localhost:3000
cd ../client && npm run dev  # cliente en http://localhost:5173
```

---

## 3. Configurar TypeScript (verificar que esté bien)

El proyecto usa `strict: true` en ambos `tsconfig.json`. Verificar que no haya errores:

```bash
cd client && npx tsc --noEmit
cd ../server && npx tsc --noEmit
```

### tsconfig.json mínimo requerido (frontend)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true
  }
}
```

### tsconfig.json mínimo requerido (backend)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## 4. Verificar pre-commit hooks

```bash
# Desde la raíz del proyecto
npm run prepare   # instala Husky

# Probar que el hook funciona
git add .
git commit -m "test: verificar hooks"
# Debe correr ESLint y Prettier antes de commitear
```

---

## 5. Correr los tests

```bash
cd server && npm run test     # tests del backend
cd client && npm run test     # tests del frontend
```

Todos deben pasar en verde antes de tu primer commit.

---

## 6. Checklist de primer día

- [ ] Leí los 6 archivos de "Leer primero".
- [ ] El proyecto levanta sin errores.
- [ ] `tsc --noEmit` pasa sin errores en client y server.
- [ ] Los tests pasan en verde.
- [ ] El pre-commit hook se activa al commitear.
- [ ] Tengo acceso a GitHub Secrets del proyecto (pedirlo al tech lead).
- [ ] Entiendo la diferencia entre `[BLOCKER]`, `[STRICT]` y `[GUIDE]`.
- [ ] Sé dónde registrar excepciones a las reglas (`Learning.md`).

---

## Dónde encontrar qué

| Pregunta | Dónde mirar |
|----------|-------------|
| ¿Cómo se llama esto en el código? | [conventions/naming.md](../docs/conventions/naming.md) |
| ¿Qué HTTP status code uso? | [conventions/http-errors.md](../docs/conventions/http-errors.md) |
| ¿Cómo hago un formulario? | [templates/files/form-template.tsx](../templates/files/form-template.tsx) |
| ¿Cómo pagino un listado? | [conventions/pagination.md](../docs/conventions/pagination.md) |
| ¿Qué librerías puedo instalar? | [project-standards/stack.md](../project-standards/stack.md) |
| ¿Cómo manejo errores de API? | [conventions/api-error-format.md](../docs/conventions/api-error-format.md) |
| ¿Qué tengo que verificar antes de mergear? | [templates/checklists/definition-of-done.md](../templates/checklists/definition-of-done.md) |
| ¿Cómo hago un commit? | [docs/git/git-rules.md](../docs/git/git-rules.md) |
| Algo no funciona | [docs/conventions/troubleshooting.md](../docs/conventions/troubleshooting.md) |
