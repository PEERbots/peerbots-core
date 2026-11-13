---
"@peerbots/core": minor
---

Add `@peerbots/core/templates` pure serializable template, message, palette, and hierarchy schemas (`Template`, `Message`, `RobotControlButton`, `PeerbotsEmotion`, `ProvenanceRef`), cycle-safe hierarchy helpers (`flattenHierarchy`, `getRootButtonIds`, `getDirectChildIds`, `getParentMap`, `isRootButton`, `extractMessageButtons`), sibling reordering (`figureOutNewOrder`, `reorderHierarchySiblings`), bulk authoring (`processBulkAuthorContent`, `parseBulkAuthorItem`, `extractEmotion`), canonical example fixtures, and zero-dependency RFC-4180 CSV & JSON template/palette I/O (`parseTemplateJson`, `parseTemplateCsv`, `parseTemplateText`, `parseTemplateFile`, `parsePaletteCsv`, `parsePaletteCsvToTemplate`, `parseLegacyCsvToTemplate`, `detectCsvFormat`, `colorToLegacyIndex`, `emotionToLegacyIndex`, `convertPaletteToCSV`, `convertPaletteToTemplate`, `convertTemplateToPalette`, `ParseTemplateOptions`).
