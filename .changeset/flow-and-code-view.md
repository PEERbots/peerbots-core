---
"@peerbots/core": minor
---

Add modeless `FlowView` authoring, `!` `Log` buttons, right-click `ButtonView` edit popover, PTTF spec/formatter/parser with `templateIO` `.pttf` auto-detection, interactive `CodeView`, UI refinements, and the `peerbots-content-authoring` skill:

- **FlowView & ButtonView (`#30`)**: Modeless `FlowView` authoring with stabilized layout preservation, inline node editing, `Log` button support with `pencilNote` default `logIcon` (and `chatBubble` for Message), right-click `ButtonEditPopoverContent`, `ButtonView` `columns` option (`1 | 2 | 3 | 4 | "responsive"`), `PeerbotsButtonEditor`, `TemplateAnalysisPanel`, and `BasePanel`.
- **PTTF & `templateIO` (`#31`)**: `docs/TEMPLATE_TEXT_FORMAT_SPEC.md`, `src/templates/pttf/*` (`formatTemplateToCode`, `analyzeTemplateCode`, `parseCodeToTemplate`, `getCodeAutocompleteContext`), and `parseTemplatePttf` / `serializeTemplatePttf` + `.pttf` auto-detection in `parseTemplateText` / `parseTemplateFile`.
- **Code UI & `CodeView` (`#31`)**: Domain-neutral `src/ui/patterns/code/*` (`CodeExplainerPanel`, `CodeEditorSurface`, `CodeInteractiveLines`, `CodeAutocompletePopup`, `CodeStatusBar`) and unified `CodeView` with live syntax highlighting, inline autocomplete, line diagnostics, `Unsaved` / `Discard`, and `Ctrl/Cmd+Z` undo.
- **UI & Forms (`#31`)**: `PasswordInput` (with visibility toggle, used in `AuthFormUI`), `Alert` floating overlay placement (`placement="floating"`), `CodeBlock` syntax highlighting, `VoiceSelector` auto-populating `window.speechSynthesis.getVoices()` and passing `VoiceDescriptor` in `onVoiceChange`, `TableView` auto-growing `TextArea` cells & selection-gated `Apply All`, and compact collapsed `LanguageSelector` (`β` indicator).
- **Content Authoring Skill (`#31`)**: Bundled `skills/peerbots-content-authoring` (`@peerbots/core/skills/peerbots-content-authoring`) and Storybook `Content Authoring Skill` guide covering PTTF and the Peerbots Content Authoring Guidelines.
