---
"@peerbots/core": patch
---

Fix `CodeView` side-by-side explainer layout on desktop and cap editor height:
- Fix Tailwind v4 prefix-order typos (`lg:pb:*`, `sm:pb:*`, `hover:pb:*`, `focus:pb:*`, `disabled:pb:*` → `pb:lg:*`, `pb:sm:*`, `pb:hover:*`, `pb:focus:*`, `pb:disabled:*`) across `CodeView`, `CodeExplainerPanel`, `CodeEditorSurface`, `CodeInteractiveLines`, and `CodeAutocompletePopup` so the 7/5 side-by-side desktop grid actually compiles and renders.
- Cap `CodeEditorSurface` at `pb:max-h-[32rem]` and `CodeExplainerPanel` at `pb:lg:max-h-[36rem] pb:lg:overflow-y-auto` so long templates scroll inside the editor while the explainer stays visible beside it without vertical page scrolling.
