---
"@peerbots/core": minor
---

Add single-JSON collection export/import with paid Marketplace copy protection, template & collection reordering/archiving helpers, `InlineEditableSection` with accessible `<Label>` fields, and `CodeView` identity locks:

- **Collection Export/Import & Marketplace Copy Guards**: Add `PeerbotsCollectionFile`, `isCollectionJson`, `serializeCollectionJson` (excluding archived templates by default unless `includeArchived: true`), `exportCollectionAsJson`, `parseCollectionJson`, `isPaidMarketplaceCopy`, and `canExportCollection`, plus multi-template collection auto-detection in `parseTemplateText` / `parseTemplateFile`.
- **Template & Collection Reordering and Archiving**: Add `archived?: boolean` to `TemplateInfo`, `Template`, and `Content["data"]`, along with pure helpers `partitionByArchived`, `reorderTemplatesInfo`, `moveTemplateInList`, and `setTemplateInfoArchived`.
- **`InlineEditableSection` Pattern Component**: Add reusable inline view/edit pattern component with associated `<Label>` elements (`titleLabel`, `descriptionLabel`, `titleTooltip`, `descriptionTooltip`) supporting both standalone description editing and Method C scoped collection editing.
- **`CodeView` Identity Preservation**: Lock `template.id` and `template.contentID` during `CodeView` edits (`useCodeViewDraft`) and `parseCodeToTemplate` so pasted PTTF/JSON cannot overwrite template identity or collection provenance.
- **Icons & `FlowView` Lazy Import**: Add `archiveBox` and `gripVertical` icons to `IconRegistry`, and restore Vite-resolvable `import("@peerbots/core/flow")` in `PeerbotsButtonDisplay`.
