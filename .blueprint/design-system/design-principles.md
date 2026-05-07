# Principios del Design System

Objetivo:
Que todas las aplicaciones parezcan parte del mismo producto.

## Estilo visual

- Moderno.
- Empresarial.
- Limpio.
- Sobrio.
- Mobile-first.
- Productivo.
- Orientado a datos.
- Inspiración: fintech, dashboards administrativos, sistemas tipo backoffice premium.

## Reglas

- No inventar estilos por pantalla.
- No mezclar estilos visuales.
- No usar colores arbitrarios.
- No crear botones distintos para cada módulo.
- No crear tablas distintas si ya existe una tabla oficial.
- No cambiar tipografía sin autorización.

## Herramientas obligatorias

- [STRICT] **Stitch:** Herramienta oficial de Antigravity para generación de pantallas, prototipos y componentes visuales. Toda pantalla nueva se diseña primero en Stitch antes de implementarse en código.
- [STRICT] **Consistencia de proyecto:** El proyecto en Stitch lleva el mismo nombre que el proyecto en Antigravity para mantener trazabilidad diseño ↔ código.
- [STRICT] **Fidelidad de implementación:** Toda pantalla generada en Stitch debe implementarse estrictamente según lo definido en esta documentación (Layout, Componentes, Mobile-First). No se improvisan variaciones visuales en código.
- [GUIDE] **Flujo de trabajo:** Diseño en Stitch → revisión → implementación en React con componentes del design system. El código nunca adelanta al diseño en features nuevas.

## Prioridades

1. Claridad.
2. Consistencia.
3. Velocidad de uso.
4. Seguridad.
5. Accesibilidad.
6. Mobile-first.
