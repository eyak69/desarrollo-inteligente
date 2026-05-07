# Enforcement — Cómo se aplican las reglas

Las reglas del blueprint solo son efectivas si hay mecanismos que las hagan
cumplir automáticamente. Este archivo documenta qué herramientas enforzan qué reglas.

## ESLint

Enforza reglas de código en tiempo de desarrollo y en CI.

### Plugins requeridos

| Plugin | Qué enforza |
|--------|-------------|
| `eslint-plugin-react-hooks` | Reglas de hooks: dependencias correctas en `useEffect`, orden de hooks. |
| `eslint-plugin-react` | Componentes funcionales, PropTypes innecesarios (ya los cubre TS). |
| `@typescript-eslint/eslint-plugin` | `no-explicit-any`, consistencia de tipos, reglas TS estrictas. |
| `eslint-plugin-import` | Imports ordenados, sin importaciones de módulos no declarados en `package.json`. |

### Reglas clave a configurar

```js
rules: {
  "@typescript-eslint/no-explicit-any": "error",          // [BLOCKER] sin any
  "react-hooks/rules-of-hooks": "error",                   // hooks en el lugar correcto
  "react-hooks/exhaustive-deps": "warn",                   // deps de useEffect completas
  "no-console": ["warn", { allow: ["warn", "error"] }],   // no console.log en prod
  "import/no-extraneous-dependencies": "error",            // solo deps declaradas en package.json
}
```

- [BLOCKER] ESLint debe correr en el pipeline de CI y fallar el build si hay errores.
- [STRICT] Las warnings se revisan en cada PR. No se ignoran indefinidamente.
- [GUIDE] Usar `// eslint-disable-next-line` solo con comentario que explique el motivo. Nunca deshabilitar un archivo completo.

## Pre-commit hooks (Husky + lint-staged)

Enforzan formato y lint antes de que el código entre al repositorio.

### Configuración mínima

```json
// package.json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

- [STRICT] El pre-commit hook no puede saltarse con `--no-verify` salvo emergencia documentada.
- [GUIDE] Prettier formatea automáticamente. No perder tiempo en revisiones de estilo en PRs.

## TypeScript compiler (`tsc --noEmit`)

- [BLOCKER] `tsc --noEmit` debe correr en CI y fallar si hay errores de tipo.
- [BLOCKER] `strict: true` en `tsconfig.json` del frontend y del backend.

## Tests en CI

- [BLOCKER] `vitest run` debe pasar antes de mergear cualquier PR a `develop` o `main`.
- [BLOCKER] No comentar tests para desbloquear el CI. Ver `docs/testing/testing-rules.md`.

## Resumen: qué enforza cada herramienta

| Regla | Herramienta | Momento |
|-------|-------------|---------|
| Sin `any` | ESLint + `tsc` | Pre-commit + CI |
| Deps correctas en `useEffect` | ESLint react-hooks | Pre-commit + CI |
| Formato de código | Prettier | Pre-commit |
| Sin imports fantasma | ESLint import | Pre-commit + CI |
| Sin errores de tipo | `tsc --noEmit` | CI |
| Tests pasan | Vitest | CI |
| Sin secretos en código | Revisión manual en PR | PR review |
| Soft delete aplicado | Code review + tests de integración | PR review |
