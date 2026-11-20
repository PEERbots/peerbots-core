---
"@peerbots/core": patch
---

Use `@theme static` in `src/styles/theme.css` so Tailwind v4 emits all Peerbots theme CSS custom properties in both the standalone `@peerbots/core/theme` stylesheet (`dist/styles/theme.css`) and the prefixed `--pb-*` tokens in the main bundle instead of tree-shaking unused theme tokens.
