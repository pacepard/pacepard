# Form blocks design spec

Tailwind-equivalent tokens and SCSS usage for short-answer and form blocks.

## Tokens (CSS variables)

- **Radii:** `0.5rem` (rounded-lg) for inputs
- **Shadows:** `0 1px 2px rgba(0, 0, 0, 0.05)` (shadow-sm) for inputs and required badge
- **Spacing:** `1rem` vertical margin between blocks; `0.5rem` between label and input; `0.75rem` horizontal input padding; `2.5rem` right padding for icon/badge
- **Border:** `1px solid` — light: `var(--tt-gray-light-a-300, #d1d5db)`; dark: `var(--tt-gray-dark-a-300)`
- **Label (filled):** `var(--tt-gray-light-a-800, #1f2937)`; dark: `var(--tt-gray-dark-a-200)`
- **Label (placeholder / empty):** `var(--tt-gray-light-a-400, #9ca3af)`; dark: `var(--tt-gray-dark-a-500)`
- **Required asterisk (inline after label):** `#000`; dark: `var(--tt-gray-dark-a-100)`
- **Input placeholder:** same as label placeholder
- **End-of-input icon:** light: `var(--tt-gray-light-a-400)`; dark: `var(--tt-gray-dark-a-500)`
- **Required badge (circle):** light bg `var(--tt-gray-light-a-200)`, text `var(--tt-gray-light-a-700)`; dark bg `var(--tt-gray-dark-a-600)`, text `var(--tt-gray-dark-a-100)`
- **Error:** `var(--tt-red-600)` / `var(--tt-red-400)` dark; invalid border `var(--tt-red-500)` / `var(--tt-red-400)` dark

## Input Title / Input Label

- **Input Title:** Renders as H2; default level 2. Font-size 1.25em, font-weight 700. Reuse `.tiptap.ProseMirror h2` from heading-node (or mirror in node view).
- **Input Label:** Renders as H4; default level 4. Font-size 1em, font-weight 600 (semibold). Reuse `.tiptap.ProseMirror h4` from heading-node.
- Both use `content: "inline*"` and `data-type="input-title"` / `data-type="input-label"`; same keymaps as textblock (Enter, Backspace, etc.).

## UI rules

- **Label without required:** Text only; placeholder = light grey, filled = dark.
- **Label with required:** Text + inline black asterisk `*` immediately after (no space).
- **Input:** White (light) / dark surface (dark); type-specific icon at right end inside border; required badge top-right when required.
- **Light and dark:** All form block elements have matching dark mode overrides.
