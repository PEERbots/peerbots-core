import type { CodeDiagnostic } from "../../../../templates/codeFormat";
import type {
  RobotControlButton,
  Template,
} from "../../../../templates/types";
import type { CodeLineActionItem } from "../../code/types";
import type { ExplainedPttfLine } from "./pttfAdapter";

export interface PlayableButtonLine extends CodeLineActionItem {
  buttonId: string;
  button: RobotControlButton;
}

/**
 * Validates that a parsed button object has the minimum safe shape required
 * before invoking `onButtonAction` (prevents malformed JSON button objects
 * from crashing downstream robot/face handlers).
 */
export function isValidPlayableButton(
  candidate: unknown,
): candidate is RobotControlButton {
  if (!candidate || typeof candidate !== "object") {
    return false;
  }
  const btn = candidate as Record<string, unknown>;
  if (btn.type !== "Message" && btn.type !== "Log") {
    return false;
  }
  if (!btn.details || typeof btn.details !== "object") {
    return false;
  }
  const details = btn.details as Record<string, unknown>;
  if (typeof details.title !== "string") {
    return false;
  }
  if (
    btn.type === "Message" &&
    details.speech !== undefined &&
    typeof details.speech !== "string"
  ) {
    return false;
  }
  if (
    btn.type === "Log" &&
    details.details !== undefined &&
    typeof details.details !== "string"
  ) {
    return false;
  }
  return true;
}

interface JsonButtonLineScanResult {
  /** Exact 1-based starting line number for each unique button key inside top-level `buttons`. */
  buttonStartLines: Map<string, number>;
  /** Button keys that appeared more than once inside `buttons`. */
  duplicateButtonIds: Set<string>;
  /** Line numbers where more than one button starts (e.g. minified JSON). */
  ambiguousLines: Set<number>;
}

/**
 * Lightweight line-tracking JSON scanner that locates the exact 1-based line
 * number of every direct key inside the top-level `"buttons"` object—without
 * relying on regexes or pretty-printed formatting.
 */
export function findJsonButtonStartLines(
  jsonText: string,
): JsonButtonLineScanResult {
  const buttonStartLines = new Map<string, number>();
  const duplicateButtonIds = new Set<string>();
  const lineCounts = new Map<number, number>();
  const ambiguousLines = new Set<number>();

  // Track container stack: "object" | "array", plus the active key name at each object level
  const containers: Array<"object" | "array"> = [];
  let inButtonsObject = false;
  let buttonsDepth = -1;
  let expectingKey = false;
  let pendingTopLevelKey: string | null = null;
  let pendingButtonKey: { id: string; line: number } | null = null;

  let line = 1;
  let i = 0;
  const len = jsonText.length;

  const readString = (): { value: string; startLine: number } | null => {
    if (jsonText[i] !== '"') return null;
    const startLine = line;
    i += 1; // skip opening quote
    let raw = "";
    while (i < len) {
      const ch = jsonText[i];
      if (ch === "\\") {
        if (i + 1 < len) {
          raw += ch + jsonText[i + 1];
          if (jsonText[i + 1] === "\n") line += 1;
          i += 2;
          continue;
        }
        return null;
      }
      if (ch === '"') {
        i += 1; // skip closing quote
        try {
          const parsed = JSON.parse(`"${raw}"`) as string;
          return { value: parsed, startLine };
        } catch {
          return { value: raw, startLine };
        }
      }
      if (ch === "\n") line += 1;
      raw += ch;
      i += 1;
    }
    return null;
  };

  while (i < len) {
    const ch = jsonText[i];
    if (ch === "\n") {
      line += 1;
      i += 1;
      continue;
    }
    if (ch === " " || ch === "\t" || ch === "\r") {
      i += 1;
      continue;
    }

    if (ch === '"') {
      const str = readString();
      if (!str) break;
      const depth = containers.length;
      const currentContainer = containers[depth - 1];

      if (currentContainer === "object" && expectingKey) {
        if (depth === 1) {
          pendingTopLevelKey = str.value;
        } else if (inButtonsObject && depth === buttonsDepth) {
          pendingButtonKey = { id: str.value, line: str.startLine };
        }
        expectingKey = false;
      }
      continue;
    }

    if (ch === "{") {
      const parentDepth = containers.length;
      if (parentDepth === 1 && pendingTopLevelKey === "buttons") {
        inButtonsObject = true;
        buttonsDepth = parentDepth + 1;
        pendingTopLevelKey = null;
      } else if (
        inButtonsObject &&
        parentDepth === buttonsDepth &&
        pendingButtonKey
      ) {
        const { id, line: keyLine } = pendingButtonKey;
        if (buttonStartLines.has(id)) {
          duplicateButtonIds.add(id);
        } else {
          buttonStartLines.set(id, keyLine);
          const count = (lineCounts.get(keyLine) ?? 0) + 1;
          lineCounts.set(keyLine, count);
          if (count > 1) {
            ambiguousLines.add(keyLine);
          }
        }
        pendingButtonKey = null;
      }
      containers.push("object");
      expectingKey = true;
      i += 1;
      continue;
    }

    if (ch === "[") {
      if (containers.length === 1) {
        pendingTopLevelKey = null;
      }
      if (inButtonsObject && containers.length === buttonsDepth) {
        pendingButtonKey = null;
      }
      containers.push("array");
      expectingKey = false;
      i += 1;
      continue;
    }

    if (ch === "}") {
      if (inButtonsObject && containers.length === buttonsDepth) {
        inButtonsObject = false;
        buttonsDepth = -1;
        pendingButtonKey = null;
      }
      containers.pop();
      expectingKey = false;
      i += 1;
      continue;
    }

    if (ch === "]") {
      containers.pop();
      expectingKey = false;
      i += 1;
      continue;
    }

    if (ch === ",") {
      const currentContainer = containers[containers.length - 1];
      expectingKey = currentContainer === "object";
      if (containers.length === 1) {
        pendingTopLevelKey = null;
      }
      if (inButtonsObject && containers.length === buttonsDepth) {
        pendingButtonKey = null;
      }
      i += 1;
      continue;
    }

    if (ch === ":") {
      expectingKey = false;
      i += 1;
      continue;
    }

    // Other JSON tokens (numbers, booleans, null)
    i += 1;
  }

  return { buttonStartLines, duplicateButtonIds, ambiguousLines };
}

export interface BuildPlayableLinesOptions {
  format: "shorthand" | "json";
  draftCode: string;
  isEditable: boolean;
  disabled?: boolean;
  parsedTemplate: Template | null;
  diagnostics: CodeDiagnostic[];
  lines: ExplainedPttfLine[];
  selectedButtonId?: string | null;
}

/**
 * Builds a lineNumber -> PlayableButtonLine map for gutter Play buttons in
 * CodeView (both Shorthand and JSON, locked or unlocked), suppressing Play on
 * malformed, erroring, duplicate, or ambiguous lines.
 */
export function buildPlayableButtonLineMap({
  format,
  draftCode,
  isEditable,
  disabled = false,
  parsedTemplate,
  diagnostics,
  lines,
  selectedButtonId = null,
}: BuildPlayableLinesOptions): Map<number, PlayableButtonLine> {
  const result = new Map<number, PlayableButtonLine>();
  if (disabled) {
    return result;
  }

  const errorLines = new Set<number>();
  let hasAnyError = false;
  for (const diag of diagnostics) {
    if (diag.severity === "error") {
      hasAnyError = true;
      errorLines.add(diag.lineNumber);
    }
  }

  if (format === "shorthand") {
    for (const line of lines) {
      if (
        line.kind !== "button" ||
        !line.buttonId ||
        !line.button ||
        errorLines.has(line.lineNumber) ||
        !isValidPlayableButton(line.button)
      ) {
        continue;
      }
      const label = line.button.details.title.trim() || line.buttonId;
      result.set(line.lineNumber, {
        lineNumber: line.lineNumber,
        buttonId: line.buttonId,
        button: line.button,
        label,
        isSelected:
          Boolean(selectedButtonId) && line.buttonId === selectedButtonId,
      });
    }
    return result;
  }

  // JSON format
  if (isEditable) {
    // If JSON has any parse/schema error, suppress all Play icons so stale
    // line numbers can never point at the wrong button.
    if (!parsedTemplate || hasAnyError) {
      return result;
    }

    const { buttonStartLines, duplicateButtonIds, ambiguousLines } =
      findJsonButtonStartLines(draftCode);

    for (const [buttonId, lineNumber] of buttonStartLines.entries()) {
      if (
        !buttonId ||
        duplicateButtonIds.has(buttonId) ||
        ambiguousLines.has(lineNumber) ||
        errorLines.has(lineNumber)
      ) {
        continue;
      }
      const button = parsedTemplate.buttons?.[buttonId];
      if (!isValidPlayableButton(button)) {
        continue;
      }
      const label = button.details.title.trim() || buttonId;
      result.set(lineNumber, {
        lineNumber,
        buttonId,
        button,
        label,
        isSelected: Boolean(selectedButtonId) && buttonId === selectedButtonId,
      });
    }
    return result;
  }

  // Locked / read-only JSON view: use the first line of each button in normalized lines
  const seenButtonIds = new Set<string>();
  for (const line of lines) {
    if (
      !line.buttonId ||
      !line.button ||
      seenButtonIds.has(line.buttonId) ||
      !isValidPlayableButton(line.button)
    ) {
      continue;
    }
    seenButtonIds.add(line.buttonId);
    const label = line.button.details.title.trim() || line.buttonId;
    result.set(line.lineNumber, {
      lineNumber: line.lineNumber,
      buttonId: line.buttonId,
      button: line.button,
      label,
      isSelected:
        Boolean(selectedButtonId) && line.buttonId === selectedButtonId,
    });
  }

  return result;
}
