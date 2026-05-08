# Máxima de Generación Stitch: Estándar Obsidian Premium

Esta máxima debe ser proporcionada a Stitch (o cualquier motor de generación de UI) para asegurar que el diseño sea consistente con el Blueprint del proyecto.

## 1. Identidad Visual (Estética Obsidian Dark)
- **Fondo:** Modo oscuro profundo (#0c0c0e o #050505). No usar grises claros.
- **Glassmorphism Mandatorio:** Todos los contenedores (tarjetas, modales, menús) deben usar fondo semi-transparente con `backdrop-blur` intenso (20px-40px).
- **Bordes:** Prohibido el uso de bordes sólidos de 1px para separar secciones. Usar cambios tonales o sombras suaves/profundas.
- **Esquinas:** Redondeado generoso de 16px (1rem) para tarjetas y modales.
- **Tipografía:** Exclusivamente **Inter** o **Outfit**. Escala editorial con gran contraste entre títulos y cuerpo.

## 2. Política de Interacción "Zero Interruption"
- **Prohibición de Nativos:** Jamás generar pantallas que dependan de `window.alert`, `window.confirm` o `window.prompt`.
- **Acción Directa + Undo:** Para acciones rutinarias (borrar, archivar), la acción debe ser inmediata con una notificación (Toast) que contenga un botón de "DESHACER" prominente.
- **ConfirmDialog Premium:** Solo usar diálogos de confirmación para acciones irreversibles o de alto riesgo (ej. vaciar base de datos). Estos diálogos deben ser modales con efecto de cristal y estética Obsidian.

## 3. Paleta de Colores Funcional
- **Primario:** Azul Eléctrico (#0070f3) o Violeta Premium (#7C3AED) para llamadas a la acción (CTA).
- **Destructivo:** Rojo Intenso (#EF4444) para confirmaciones críticas, usado con moderación.
- **Texto:** Blanco puro (#ffffff) para títulos, Gris Zinc (#A1A1AA) para cuerpo y metadatos.

## 4. Estructura de Pantalla
- **Layout:** Grilla Bento (módulos asimétricos) para dashboards.
- **Espaciado:** Generoso (32px+ entre bloques) para permitir que el diseño "respire".
- **HUD Feel:** La interfaz debe sentirse como un Heads-Up Display, con información flotando en el vacío sobre capas de cristal.
