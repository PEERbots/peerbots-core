---
"@peerbots/core": patch
---

Fix Tailwind v4 `pb:` prefix ordering across `@peerbots/core` and restore `CodeView` side-by-side explainer layout:
- Audit and fix all Tailwind v4 prefix-order typos (`<variant>:pb:*` → `pb:<variant>:*` and `pb:pb:*` → `pb:*`) across `CodeView`, `CodeExplainerPanel`, `CodeEditorSurface`, `CodeInteractiveLines`, `CodeAutocompletePopup`, `FlowView`, `Dialog`, `Popover`, `Button`, `EmotionSelector`, `Input`, `NumberField`, `Select`, `Slider`, `Switch`, `CodeBlock`, `Icon`, `Typography`, `Accordion`, `Card`, `Collapsible`, `TableChrome`, `TablePrimitives`, `TableViewRow`, `Stepper`, `TabSelection`, and docs/stories so responsive, hover, focus, disabled, data-state, and RTL utilities compile properly.
- Cap `CodeEditorSurface` at `pb:max-h-[32rem]` and `CodeExplainerPanel` at `pb:lg:max-h-[36rem] pb:lg:overflow-y-auto` so long templates scroll inside the editor while the explainer stays visible beside it on desktop without vertical page scrolling.
