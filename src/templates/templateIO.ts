import { flattenHierarchy } from "./hierarchy";
import {
  PEERBOTS_COLORS,
  PEERBOTS_EMOTIONS,
  type LoggedEvent,
  type Message,
  type MetaData,
  type Palette,
  type PaletteButton,
  type PeerbotsColor,
  type PeerbotsEmotion,
  type RobotControlButton,
  type Template,
  type TemplateHierarchy,
} from "./types";

export const MAX_TEMPLATE_FILE_BYTES = 2 * 1024 * 1024; // 2 MB

export const MODERN_PALETTE_CSV_HEADERS = [
  "title",
  "color",
  "emotion",
  "speech",
  "goal",
  "subgoal",
  "proficiency",
] as const;

export const LEGACY_PALETTE_CSV_HEADERS = [
  "TITLE(text)",
  "COLOR(0-7)",
  "EMOTION(0-7)",
  "SPEECH(text)",
  "GOAL(text)",
  "SUBGOAL(text)",
  "PROFICIENCY(text)",
] as const;

const LEGACY_COLOR_INDEX_MAP: Record<number, PeerbotsColor> = {
  0: "Light Blue",
  1: "Blue",
  2: "Green",
  3: "Red",
  4: "Purple",
  5: "Pink",
  6: "Yellow",
  7: "Orange",
  8: "Grey",
  9: "Black",
  10: "White",
};

const LEGACY_EMOTION_INDEX_MAP: Record<number, PeerbotsEmotion> = {
  0: "Neutral",
  1: "Surprised",
  2: "Happy",
  3: "Sad",
  4: "Concerned",
  5: "Sleepy",
  6: "Neutral",
  7: "Neutral",
};

export function normalizePeerbotsColor(
  input?: string | number | null,
): PeerbotsColor {
  if (input === undefined || input === null) {
    return "Light Blue";
  }
  if (typeof input === "number") {
    return LEGACY_COLOR_INDEX_MAP[input] ?? "Light Blue";
  }
  const trimmed = input.trim();
  if (!trimmed) {
    return "Light Blue";
  }
  if (/^\d+$/.test(trimmed)) {
    const idx = Number.parseInt(trimmed, 10);
    return LEGACY_COLOR_INDEX_MAP[idx] ?? "Light Blue";
  }
  const lower = trimmed.toLowerCase();
  if (lower === "gray") {
    return "Grey";
  }
  const matched = PEERBOTS_COLORS.find((c) => c.toLowerCase() === lower);
  return matched ?? "Light Blue";
}

export function normalizeEmotion(
  input?: string | number | null,
): PeerbotsEmotion {
  if (input === undefined || input === null) {
    return "Neutral";
  }
  if (typeof input === "number") {
    return LEGACY_EMOTION_INDEX_MAP[input] ?? "Neutral";
  }
  const trimmed = input.trim();
  if (!trimmed) {
    return "Neutral";
  }
  if (/^\d+$/.test(trimmed)) {
    const idx = Number.parseInt(trimmed, 10);
    return LEGACY_EMOTION_INDEX_MAP[idx] ?? "Neutral";
  }
  const lower = trimmed.toLowerCase();
  if (lower === "sleep") {
    return "Sleepy";
  }
  const matched = PEERBOTS_EMOTIONS.find((e) => e.toLowerCase() === lower);
  return matched ?? "Neutral";
}

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

function escapeCsvCell(value: string | number | boolean | null | undefined): string {
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

export interface SerializePaletteCsvOptions {
  format?: "modern" | "legacy";
}

export function convertPaletteToCSV(
  palette: Palette,
  options?: SerializePaletteCsvOptions,
): string {
  const headers =
    options?.format === "legacy"
      ? LEGACY_PALETTE_CSV_HEADERS
      : MODERN_PALETTE_CSV_HEADERS;

  const dataRows = palette.buttons.map((row) => [
    row.title,
    row.color,
    row.emotion,
    row.speech,
    row.goal,
    row.subgoal,
    row.proficiency,
  ]);

  return serializeCsvRows(headers, dataRows);
}

export const serializePaletteCsv = convertPaletteToCSV;

export function convertPaletteButtonToRobotControlButton(
  paletteButton: PaletteButton,
): RobotControlButton {
  const color = normalizePeerbotsColor(paletteButton.color);
  const emotion = normalizeEmotion(paletteButton.emotion);
  return {
    type: "Message",
    labelColor: color,
    details: {
      title: paletteButton.title,
      color,
      speech: paletteButton.speech,
      emotion,
      metadata: {
        goal: paletteButton.goal || "None",
        subgoal: paletteButton.subgoal || "None",
        proficiency: paletteButton.proficiency || "None",
      },
    },
  };
}

export function convertRobotControlButtonToPaletteButton(
  robotControlButton: RobotControlButton,
): PaletteButton {
  switch (robotControlButton.type) {
    case "Message":
      return {
        title: robotControlButton.details.title,
        speech: robotControlButton.details.speech,
        color: normalizePeerbotsColor(robotControlButton.details.color),
        emotion: normalizeEmotion(robotControlButton.details.emotion),
        goal: robotControlButton.details.metadata?.goal
          ? String(robotControlButton.details.metadata.goal)
          : "None",
        subgoal: robotControlButton.details.metadata?.subgoal
          ? String(robotControlButton.details.metadata.subgoal)
          : "None",
        proficiency: robotControlButton.details.metadata?.proficiency
          ? String(robotControlButton.details.metadata.proficiency)
          : "None",
      };
    case "Log":
      return {
        title: robotControlButton.details.title,
        speech: robotControlButton.details.details ?? "",
        color: "Light Blue",
        emotion: "Neutral",
        goal: "None",
        subgoal: "None",
        proficiency: "None",
      };
  }
}

export function convertPaletteToTemplate(palette: Palette): Template {
  return {
    title: palette.title,
    buttons: Object.fromEntries(
      palette.buttons.map((button, index) => [
        index.toString(),
        convertPaletteButtonToRobotControlButton(button),
      ]),
    ),
    hierarchy: {
      root: Array.from({ length: palette.buttons.length }, (_, i) =>
        i.toString(),
      ),
    },
  };
}

/**
 * Converts a canonical `Template` into a flat `Palette`, traversing the entire
 * hierarchy via `flattenHierarchy` (cycle-safe and duplicate-safe across nested children).
 */
export function convertTemplateToPalette<TRef>(
  template: Template<TRef>,
): Palette {
  const flattened = flattenHierarchy(template.hierarchy);
  const buttons: PaletteButton[] = [];

  for (const { buttonId } of flattened) {
    const button = template.buttons[buttonId];
    if (!button) continue;
    buttons.push(convertRobotControlButtonToPaletteButton(button));
  }

  return {
    title: template.title,
    buttons,
  };
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/\.(json|csv)$/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "template"
  );
}

function normalizeKeywords(raw: unknown): string[] | undefined {
  if (!raw) return undefined;
  if (Array.isArray(raw)) {
    const cleaned = raw.map((item) => String(item).trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : undefined;
  }
  if (typeof raw === "string") {
    const split = raw
      .split(/[;,]/)
      .map((item) => item.trim())
      .filter(Boolean);
    return split.length > 0 ? split : undefined;
  }
  return undefined;
}

function normalizeMetadata(raw: unknown): MetaData | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return undefined;
  }
  const entries: [string, string | number][] = [];
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof val === "string" || typeof val === "number") {
      entries.push([key, val]);
    } else if (typeof val === "boolean") {
      entries.push([key, val ? "true" : "false"]);
    }
  }
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function parseBooleanLike(raw: unknown): boolean {
  if (raw === true || raw === 1) return true;
  if (typeof raw === "string") {
    return raw.trim().toLowerCase() === "true";
  }
  return false;
}

function normalizeFlatButtonItem(
  raw: Record<string, unknown>,
): RobotControlButton | null {
  // Support canonical RobotControlButton item inside an array or dictionary
  if (
    (raw.type === "Message" || raw.type === "Log") &&
    raw.details &&
    typeof raw.details === "object"
  ) {
    return normalizeCanonicalButton(raw);
  }

  const speech = String(
    raw.speech ?? raw.text ?? raw.message ?? "",
  ).trim();
  const title = String(
    raw.title ?? raw.name ?? raw.label ?? speech,
  ).trim();

  if (!title || !speech) {
    return null;
  }

  const color = normalizePeerbotsColor(
    raw.color as string | number | undefined,
  );
  const labelColor = normalizePeerbotsColor(
    (raw.labelColor ?? raw.color) as string | number | undefined,
  );
  const emotion = normalizeEmotion(
    raw.emotion as string | number | undefined,
  );
  const category =
    typeof raw.category === "string" && raw.category.trim()
      ? raw.category.trim()
      : undefined;
  const keywords = normalizeKeywords(raw.keywords);
  const isFallback = parseBooleanLike(raw.isFallback);

  const existingMeta = normalizeMetadata(raw.metadata) ?? {};
  if (typeof raw.goal === "string" && raw.goal.trim()) {
    existingMeta.goal = raw.goal.trim();
  }
  if (typeof raw.subgoal === "string" && raw.subgoal.trim()) {
    existingMeta.subgoal = raw.subgoal.trim();
  }
  if (typeof raw.proficiency === "string" && raw.proficiency.trim()) {
    existingMeta.proficiency = raw.proficiency.trim();
  }
  const metadata =
    Object.keys(existingMeta).length > 0 ? existingMeta : undefined;

  const details: Message = {
    title,
    speech,
    color,
    emotion,
    ...(metadata ? { metadata } : {}),
    ...(category ? { category } : {}),
    ...(keywords ? { keywords } : {}),
    ...(isFallback ? { isFallback: true } : {}),
  };

  return {
    type: "Message",
    labelColor,
    details,
  };
}

function normalizeCanonicalButton(
  raw: Record<string, unknown>,
): RobotControlButton | null {
  if (!raw.details || typeof raw.details !== "object") {
    return normalizeFlatButtonItem(raw);
  }

  const detailsObj = raw.details as Record<string, unknown>;
  const labelColor = normalizePeerbotsColor(
    (raw.labelColor ?? detailsObj.color) as string | number | undefined,
  );

  if (raw.type === "Log") {
    const title = String(detailsObj.title ?? "").trim();
    if (!title) {
      return null;
    }
    const metadata = normalizeMetadata(detailsObj.metadata);
    const logDetails: LoggedEvent = {
      title,
      ...(detailsObj.details !== undefined
        ? { details: String(detailsObj.details) }
        : {}),
      ...(metadata ? { metadata } : {}),
    };
    return {
      type: "Log",
      labelColor,
      details: logDetails,
    };
  }

  const speech = String(
    detailsObj.speech ?? detailsObj.text ?? detailsObj.message ?? "",
  ).trim();
  const title = String(
    detailsObj.title ?? detailsObj.name ?? detailsObj.label ?? speech,
  ).trim();
  if (!title || !speech) {
    return null;
  }

  const color = normalizePeerbotsColor(
    detailsObj.color as string | number | undefined,
  );
  const emotion = normalizeEmotion(
    detailsObj.emotion as string | number | undefined,
  );
  const metadata = normalizeMetadata(detailsObj.metadata);
  const category =
    typeof detailsObj.category === "string" && detailsObj.category.trim()
      ? detailsObj.category.trim()
      : undefined;
  const keywords = normalizeKeywords(detailsObj.keywords);
  const isFallback =
    parseBooleanLike(detailsObj.isFallback) ||
    parseBooleanLike(metadata?.isFallback);

  return {
    type: "Message",
    labelColor,
    details: {
      title,
      speech,
      color,
      emotion,
      ...(metadata ? { metadata } : {}),
      ...(category ? { category } : {}),
      ...(keywords ? { keywords } : {}),
      ...(isFallback ? { isFallback: true } : {}),
    },
  };
}

function normalizeHierarchy(
  rawHierarchy: unknown,
  validButtonKeys: Set<string>,
): TemplateHierarchy {
  if (
    !rawHierarchy ||
    typeof rawHierarchy !== "object" ||
    Array.isArray(rawHierarchy)
  ) {
    return { root: Array.from(validButtonKeys) };
  }

  const record = rawHierarchy as Record<string, unknown>;
  const hierarchy: TemplateHierarchy = {
    root: Array.isArray(record.root)
      ? record.root
          .map((id) => String(id))
          .filter((id) => validButtonKeys.has(id))
      : Array.from(validButtonKeys),
  };

  for (const [key, value] of Object.entries(record)) {
    if (key === "root" || !validButtonKeys.has(key) || !Array.isArray(value)) {
      continue;
    }
    hierarchy[key] = value
      .map((id) => String(id))
      .filter((id) => validButtonKeys.has(id));
  }

  return hierarchy;
}

function normalizeSingleTemplateObject(
  rawTemplate: Record<string, unknown>,
  fallbackTitle: string,
  templateIndex: number,
): Template | null {
  const title = String(
    rawTemplate.title ?? rawTemplate.name ?? fallbackTitle,
  ).trim() || fallbackTitle;
  const explicitId =
    typeof rawTemplate.id === "string" && rawTemplate.id.trim()
      ? rawTemplate.id.trim()
      : `${slugify(title)}${templateIndex > 0 ? `-${templateIndex + 1}` : ""}`;
  const description =
    typeof rawTemplate.description === "string" &&
    rawTemplate.description.trim()
      ? rawTemplate.description.trim()
      : undefined;

  const buttons: { [key: string]: RobotControlButton } = {};
  let hierarchy: TemplateHierarchy;

  const rawButtonsField =
    rawTemplate.buttons ?? rawTemplate.options ?? rawTemplate.messages;

  if (
    rawButtonsField &&
    typeof rawButtonsField === "object" &&
    !Array.isArray(rawButtonsField)
  ) {
    // Canonical Template dictionary shape: { buttons: { [key]: RobotControlButton }, hierarchy }
    for (const [key, val] of Object.entries(
      rawButtonsField as Record<string, unknown>,
    )) {
      if (!val || typeof val !== "object" || Array.isArray(val)) continue;
      const normalized = normalizeCanonicalButton(
        val as Record<string, unknown>,
      );
      if (normalized) {
        buttons[key] = normalized;
      }
    }
    const validKeys = new Set(Object.keys(buttons));
    if (validKeys.size === 0) {
      return null;
    }
    hierarchy = normalizeHierarchy(rawTemplate.hierarchy, validKeys);
  } else if (Array.isArray(rawButtonsField)) {
    // Flat button-list shape: { buttons: [ { id?, title, speech, ... } ] }
    const rootKeys: string[] = [];
    rawButtonsField.forEach((item, idx) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return;
      const record = item as Record<string, unknown>;
      const normalized = normalizeFlatButtonItem(record);
      if (!normalized) return;

      const baseKey =
        typeof record.id === "string" && record.id.trim()
          ? record.id.trim()
          : idx.toString();
      let uniqueKey = baseKey;
      let suffix = 2;
      while (uniqueKey in buttons) {
        uniqueKey = `${baseKey}-${suffix}`;
        suffix++;
      }
      buttons[uniqueKey] = normalized;
      rootKeys.push(uniqueKey);
    });

    if (rootKeys.length === 0) {
      return null;
    }
    hierarchy = rawTemplate.hierarchy
      ? normalizeHierarchy(rawTemplate.hierarchy, new Set(rootKeys))
      : { root: rootKeys };
  } else {
    return null;
  }

  return {
    id: explicitId,
    title,
    ...(description ? { description } : {}),
    ...(typeof rawTemplate.contentID === "string"
      ? { contentID: rawTemplate.contentID }
      : {}),
    ...(typeof rawTemplate.contentName === "string"
      ? { contentName: rawTemplate.contentName }
      : {}),
    ...(typeof rawTemplate.sourceContentId === "string"
      ? { sourceContentId: rawTemplate.sourceContentId }
      : {}),
    buttons,
    hierarchy,
  };
}

/**
 * Parses and validates canonical `Template` JSON (`buttons` dictionary + `hierarchy`),
 * wrapped `{ templates }` / `OrderedTemplatesObject` JSON, array-of-templates JSON,
 * or flat button-list JSON into canonical `Template[]`.
 */
export function parseTemplateJson(
  jsonText: string,
  fileName = "uploaded-template.json",
): Template[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    throw new Error(
      `Invalid JSON in "${fileName}": ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const baseTitle = fileName.replace(/\.(json|csv)$/i, "") || "Imported Template";
  const rawTemplateObjects: Record<string, unknown>[] = [];

  if (Array.isArray(parsed)) {
    const looksLikeTemplateList = parsed.some(
      (item) =>
        item &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        ("buttons" in item || "options" in item || "messages" in item),
    );
    if (looksLikeTemplateList) {
      for (const item of parsed) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          rawTemplateObjects.push(item as Record<string, unknown>);
        }
      }
    } else {
      rawTemplateObjects.push({
        id: slugify(baseTitle),
        title: baseTitle,
        buttons: parsed,
      });
    }
  } else if (parsed && typeof parsed === "object") {
    const record = parsed as Record<string, unknown>;
    if (Array.isArray(record.templates)) {
      for (const item of record.templates) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          rawTemplateObjects.push(item as Record<string, unknown>);
        }
      }
    } else if (
      record.templates &&
      typeof record.templates === "object" &&
      !Array.isArray(record.templates)
    ) {
      const templatesMap = record.templates as Record<string, unknown>;
      const orderedIds = Array.isArray(record.order)
        ? record.order.map(String)
        : Object.keys(templatesMap);
      for (const id of orderedIds) {
        const item = templatesMap[id];
        if (item && typeof item === "object" && !Array.isArray(item)) {
          rawTemplateObjects.push({
            id,
            ...(item as Record<string, unknown>),
          });
        }
      }
    } else {
      rawTemplateObjects.push(record);
    }
  }

  const templates: Template[] = [];
  rawTemplateObjects.forEach((rawTemplate, idx) => {
    const normalized = normalizeSingleTemplateObject(
      rawTemplate,
      baseTitle,
      idx,
    );
    if (normalized) {
      templates.push(normalized);
    }
  });

  if (templates.length === 0) {
    throw new Error(
      `No valid template buttons found in "${fileName}".`,
    );
  }

  return templates;
}

/**
 * Serializes one or more canonical `Template` objects to JSON.
 */
export function serializeTemplateJson<TRef>(
  templateOrList: Template<TRef> | Template<TRef>[],
  pretty = true,
): string {
  return JSON.stringify(templateOrList, null, pretty ? 2 : undefined);
}

function getCaseInsensitiveField(
  row: Record<string, string>,
  candidates: readonly string[],
): string | undefined {
  for (const candidate of candidates) {
    const target = candidate.toLowerCase();
    for (const [key, val] of Object.entries(row)) {
      if (key.trim().toLowerCase() === target) {
        return val;
      }
    }
  }
  return undefined;
}

/**
 * Parses either modern Palette CSV (`title,color,emotion,speech,goal,subgoal,proficiency`)
 * or legacy Peerbots CSV (`TITLE(text),COLOR(0-7),EMOTION(0-7),SPEECH(text),GOAL(text),SUBGOAL(text),PROFICIENCY(text)`)
 * into a canonical `Palette`.
 */
export function parsePaletteCsv(
  csvText: string,
  title = "Imported Palette",
): Palette {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) {
    throw new Error(
      `CSV "${title}" must include a header row and at least one button row.`,
    );
  }

  const headers = rows[0].map((h) => h.trim());
  const buttons: PaletteButton[] = [];

  for (let r = 1; r < rows.length; r++) {
    const values = rows[r];
    const rowRecord: Record<string, string> = {};
    headers.forEach((header, idx) => {
      rowRecord[header] = (values[idx] ?? "").trim();
    });

    const rawSpeech =
      getCaseInsensitiveField(rowRecord, [
        "speech",
        "SPEECH(text)",
        "text",
        "message",
      ]) ?? "";
    const rawTitle =
      getCaseInsensitiveField(rowRecord, [
        "title",
        "TITLE(text)",
        "name",
        "label",
      ]) ?? rawSpeech;

    const trimmedTitle = rawTitle.trim();
    const trimmedSpeech = rawSpeech.trim();
    if (!trimmedTitle && !trimmedSpeech) {
      continue;
    }

    const rawColor = getCaseInsensitiveField(rowRecord, [
      "color",
      "COLOR(0-7)",
    ]);
    const rawEmotion = getCaseInsensitiveField(rowRecord, [
      "emotion",
      "EMOTION(0-7)",
    ]);
    const rawGoal = getCaseInsensitiveField(rowRecord, ["goal", "GOAL(text)"]);
    const rawSubgoal = getCaseInsensitiveField(rowRecord, [
      "subgoal",
      "SUBGOAL(text)",
    ]);
    const rawProficiency = getCaseInsensitiveField(rowRecord, [
      "proficiency",
      "PROFICIENCY(text)",
    ]);

    buttons.push({
      title: trimmedTitle || trimmedSpeech,
      speech: trimmedSpeech || trimmedTitle,
      color: normalizePeerbotsColor(rawColor),
      emotion: normalizeEmotion(rawEmotion),
      goal: rawGoal?.trim() || "None",
      subgoal: rawSubgoal?.trim() || "None",
      proficiency: rawProficiency?.trim() || "None",
    });
  }

  if (buttons.length === 0) {
    throw new Error(`No valid button rows found in CSV "${title}".`);
  }

  return {
    title,
    buttons,
  };
}

/**
 * Parses a modern Palette CSV, legacy Peerbots CSV, or extended agent CSV
 * (including optional `id`, `category`, `keywords`, `isFallback` columns) into canonical `Template[]`.
 */
export function parseTemplateCsv(
  csvText: string,
  fileName = "uploaded-template.csv",
): Template[] {
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) {
    throw new Error(
      `CSV file "${fileName}" must include a header row and at least one button row.`,
    );
  }

  const baseTitle = fileName.replace(/\.(json|csv)$/i, "") || "Imported Palette";
  const headers = rows[0].map((h) => h.trim());
  const rawButtons: Record<string, unknown>[] = [];

  for (let r = 1; r < rows.length; r++) {
    const values = rows[r];
    const rowRecord: Record<string, string> = {};
    headers.forEach((header, idx) => {
      rowRecord[header] = (values[idx] ?? "").trim();
    });

    rawButtons.push({
      id: getCaseInsensitiveField(rowRecord, ["id"]),
      title: getCaseInsensitiveField(rowRecord, [
        "title",
        "TITLE(text)",
        "name",
        "label",
      ]),
      speech: getCaseInsensitiveField(rowRecord, [
        "speech",
        "SPEECH(text)",
        "text",
        "message",
      ]),
      color: getCaseInsensitiveField(rowRecord, ["color", "COLOR(0-7)"]),
      emotion: getCaseInsensitiveField(rowRecord, ["emotion", "EMOTION(0-7)"]),
      goal: getCaseInsensitiveField(rowRecord, ["goal", "GOAL(text)"]) || "None",
      subgoal:
        getCaseInsensitiveField(rowRecord, ["subgoal", "SUBGOAL(text)"]) ||
        "None",
      proficiency:
        getCaseInsensitiveField(rowRecord, [
          "proficiency",
          "PROFICIENCY(text)",
        ]) || "None",
      category: getCaseInsensitiveField(rowRecord, ["category"]),
      keywords: getCaseInsensitiveField(rowRecord, ["keywords"]),
      isFallback: getCaseInsensitiveField(rowRecord, ["isFallback"]),
    });
  }

  const normalized = normalizeSingleTemplateObject(
    {
      id: slugify(baseTitle),
      title: baseTitle,
      buttons: rawButtons,
    },
    baseTitle,
    0,
  );

  if (!normalized) {
    throw new Error(
      `No valid template buttons found in CSV "${fileName}".`,
    );
  }

  return [normalized];
}

async function readFileAsText(file: File): Promise<string> {
  if (typeof file.text === "function") {
    return file.text();
  }
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () =>
      reject(new Error(`Unable to read template file "${file.name}".`));
    reader.readAsText(file);
  });
}

/**
 * Validates size (`<= MAX_TEMPLATE_FILE_BYTES`) and parses an uploaded `.json` or `.csv`
 * `File` into canonical `Template[]`.
 */
export async function parseTemplateFile(file: File): Promise<Template[]> {
  if (file.size > MAX_TEMPLATE_FILE_BYTES) {
    throw new Error(
      `Template file "${file.name}" exceeds the 2 MB maximum allowed size.`,
    );
  }
  const content = await readFileAsText(file);
  if (file.name.toLowerCase().endsWith(".csv")) {
    return parseTemplateCsv(content, file.name);
  }
  return parseTemplateJson(content, file.name);
}
