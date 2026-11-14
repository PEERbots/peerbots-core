/**
 * Column header sequence used by modern Peerbots {@link Palette} CSV files
 * (`title,color,emotion,speech,goal,subgoal,proficiency`).
 */
export const MODERN_PALETTE_CSV_HEADERS = [
  "title",
  "color",
  "emotion",
  "speech",
  "goal",
  "subgoal",
  "proficiency",
] as const;

/**
 * Column header sequence used by legacy Peerbots CSV spreadsheets with numeric `0-7` color and emotion indices
 * (`TITLE(text),COLOR(0-7),EMOTION(0-7),SPEECH(text),GOAL(text),SUBGOAL(text),PROFICIENCY(text)`).
 */
export const LEGACY_PALETTE_CSV_HEADERS = [
  "TITLE(text)",
  "COLOR(0-7)",
  "EMOTION(0-7)",
  "SPEECH(text)",
  "GOAL(text)",
  "SUBGOAL(text)",
  "PROFICIENCY(text)",
] as const;

/**
 * Parses an RFC-4180 compliant CSV string into a 2D array of string cells,
 * handling quoted fields, escaped quotes (`""`), embedded newlines, and UTF-8 BOM.
 */
export function parseCsvRows(csvText: string): string[][] {
  const cleaned = csvText.startsWith("\uFEFF") ? csvText.slice(1) : csvText;
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (inQuotes) {
      if (ch === '"') {
        if (cleaned[i + 1] === '"') {
          currentCell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      currentRow.push(currentCell);
      currentCell = "";
    } else if (ch === "\r" || ch === "\n") {
      if (ch === "\r" && cleaned[i + 1] === "\n") {
        i++;
      }
      currentRow.push(currentCell);
      currentCell = "";
      if (currentRow.some((cell) => cell.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentCell += ch;
    }
  }

  if (inQuotes) {
    throw new Error("Malformed CSV: unterminated quoted field.");
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    if (currentRow.some((cell) => cell.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function escapeCsvCell(
  value: string | number | boolean | null | undefined,
): string {
  const str = value === undefined || value === null ? "" : String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Serializes headers and data rows into an RFC-4180 CSV string (`\r\n` line endings).
 */
export function serializeCsvRows(
  headers: readonly string[],
  rows: readonly (readonly (string | number | boolean | null | undefined)[])[],
): string {
  const lines = [
    headers.map((h) => escapeCsvCell(h)).join(","),
    ...rows.map((row) => row.map((cell) => escapeCsvCell(cell)).join(",")),
  ];
  return lines.join("\r\n");
}

/**
 * Detects whether a CSV string uses the modern Palette header schema,
 * the legacy Peerbots `0-7` header schema, or a generic CSV layout.
 */
export function detectCsvFormat(
  csvText: string,
): "modern" | "legacy" | "generic" {
  const rows = parseCsvRows(csvText);
  if (rows.length === 0) {
    return "generic";
  }
  const headerSet = new Set(rows[0].map((h) => h.trim().toLowerCase()));
  if (
    headerSet.has("title(text)") ||
    headerSet.has("color(0-7)") ||
    headerSet.has("emotion(0-7)") ||
    headerSet.has("speech(text)")
  ) {
    return "legacy";
  }
  if (MODERN_PALETTE_CSV_HEADERS.every((h) => headerSet.has(h))) {
    return "modern";
  }
  return "generic";
}
