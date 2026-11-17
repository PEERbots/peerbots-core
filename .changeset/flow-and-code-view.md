---
"@peerbots/core": minor
---

Add modeless `FlowView` authoring, `!` `Log` buttons, right-click `ButtonView` edit popover, PTTF spec/formatter/parser with `templateIO` `.pttf` auto-detection, interactive `CodeView`, and domain-neutral `src/ui/patterns/code` primitives:

- **FlowView & ButtonView (`#30`)**: Modeless `FlowView` authoring with inline node editing, `Log` button support with `zap` icon (`logIcon`), right-click `ButtonEditPopoverContent`, `PeerbotsButtonEditor`, `TemplateAnalysisPanel`, and `BasePanel`.
- **PTTF & `templateIO` (`#31`)**: `docs/TEMPLATE_TEXT_FORMAT_SPEC.md`, `src/templates/pttf/*` (`formatTemplateToCode`, `analyzeTemplateCode`, `parseCodeToTemplate`, `getCodeAutocompleteContext`), and `parseTemplatePttf` / `serializeTemplatePttf` + `.pttf` auto-detection in `parseTemplateText` / `parseTemplateFile`.
- **Code UI & `CodeView` (`#31`)**: Domain-neutral `src/ui/patterns/code/*` (`CodeExplainerPanel`, `CodeEditorSurface`, `CodeInteractiveLines`, `CodeAutocompletePopup`, `CodeStatusBar`) and unified `CodeView` with live syntax highlighting, inline autocomplete, line diagnostics, `Unsaved` / `Discard`, and `Ctrl/Cmd+Z` undo.
