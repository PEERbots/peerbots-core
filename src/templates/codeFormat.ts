/**
 * Peerbots Template Text Format (PTTF) & JSON code utilities.
 *
 * Modularized under `./pttf/`:
 * - `types.ts` — Token, line, diagnostic, and autocomplete types
 * - `format.ts` — `formatTemplateToCode` & `serializeTemplateToCode`
 * - `parse.ts` — `analyzeTemplateCode` & `parseCodeToTemplate`
 * - `jsonFormat.ts` — `formatTemplateToJsonCode`
 * - `autocomplete.ts` — `getCodeAutocompleteContext`
 */
export * from "./pttf/types";
export * from "./pttf/format";
export * from "./pttf/parse";
export * from "./pttf/jsonFormat";
export * from "./pttf/autocomplete";
