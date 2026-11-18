import { useMemo } from "react";
import {
  analyzeTemplateCode,
  formatTemplateToJsonCode,
  type CodeDiagnostic,
} from "../../../../templates/codeFormat";
import type { Template } from "../../../../templates/types";
import { cn } from "../../../utils";
import {
  adaptJsonLines,
  adaptPttfLines,
  highlightJsonRaw,
  type ExplainedPttfLine,
} from "./pttfAdapter";

export interface UseCodeViewDraftOptions {
  draftCode: string;
  format: "shorthand" | "json";
  template: Template;
  selectedButtonId: string | null;
  editorCursorLine: number;
  hoveredTokenIdx: number | null;
}

function getLineHighlightClass(
  isCursorLine: boolean,
  hasError: boolean,
  hasWarning: boolean,
  isSelected: boolean,
): string {
  if (isCursorLine) {
    if (hasError) return "pb:bg-red-500/15 pb:ring-1 pb:ring-red-400/70";
    if (hasWarning) return "pb:bg-amber-500/15 pb:ring-1 pb:ring-amber-400/70";
    return "pb:bg-white/10 pb:ring-1 pb:ring-peerbots-teal/60";
  }
  if (hasError) return "pb:bg-red-500/10";
  if (hasWarning) return "pb:bg-amber-500/10";
  if (isSelected) return "pb:bg-peerbots-teal/15";
  return "";
}

const IMMUTABLE_TEMPLATE_KEYS = [
  "id",
  "contentID",
  "contentName",
  "copyOf",
  "copyDate",
  "sourceContentId",
] as const;

function preserveTemplateIdentityAndAssociation(
  original: Template,
  draft: Partial<Template>,
): Template {
  return {
    ...original,
    title: typeof draft.title === "string" ? draft.title : original.title,
    ...(draft.description !== undefined
      ? { description: draft.description }
      : original.description !== undefined
        ? { description: original.description }
        : {}),
    buttons: draft.buttons ?? original.buttons,
    hierarchy: {
      ...(draft.hierarchy ?? original.hierarchy),
      root: Array.isArray(draft.hierarchy?.root)
        ? draft.hierarchy.root
        : original.hierarchy.root,
    },
    ...(original.id !== undefined ? { id: original.id } : {}),
    ...(original.contentID !== undefined
      ? { contentID: original.contentID }
      : {}),
    ...(original.contentName !== undefined
      ? { contentName: original.contentName }
      : {}),
    ...(original.copyOf !== undefined ? { copyOf: original.copyOf } : {}),
    ...(original.copyDate !== undefined ? { copyDate: original.copyDate } : {}),
    ...(original.sourceContentId !== undefined
      ? { sourceContentId: original.sourceContentId }
      : {}),
  };
}

/**
 * Parses the active `CodeView` draft (PTTF shorthand or JSON), indexes
 * diagnostics by line, and builds the syntax-highlighted `<pre>` overlay lines.
 */
export function useCodeViewDraft({
  draftCode,
  format,
  template,
  selectedButtonId,
  editorCursorLine,
  hoveredTokenIdx,
}: UseCodeViewDraftOptions) {
  const parsedDraft = useMemo((): {
    template: Template | null;
    diagnostics: CodeDiagnostic[];
    buttonCount: number;
    rootCount: number;
    draftLines: ExplainedPttfLine[];
  } => {
    if (format === "shorthand") {
      const res = analyzeTemplateCode(draftCode, {
        id: template.id,
        title: template.title,
        description: template.description,
      });
      const preservedTemplate = preserveTemplateIdentityAndAssociation(
        template,
        res.template,
      );
      return {
        template: preservedTemplate,
        diagnostics: res.diagnostics,
        buttonCount: Object.keys(preservedTemplate.buttons).length,
        rootCount: preservedTemplate.hierarchy.root.length,
        draftLines: adaptPttfLines(res.lines, selectedButtonId),
      };
    }

    try {
      const obj = JSON.parse(draftCode) as Partial<Template> &
        Record<string, unknown>;
      if (!obj || typeof obj !== "object" || !obj.buttons || !obj.hierarchy) {
        return {
          template: null,
          diagnostics: [
            {
              lineNumber: 1,
              severity: "error",
              message: 'JSON must include "buttons" and "hierarchy" objects.',
            },
          ],
          buttonCount: 0,
          rootCount: 0,
          draftLines: [],
        };
      }
      const diagnostics: CodeDiagnostic[] = [];
      const rawLines = draftCode.split(/\r?\n/);
      for (const key of IMMUTABLE_TEMPLATE_KEYS) {
        if (
          Object.prototype.hasOwnProperty.call(obj, key) &&
          obj[key] !== template[key]
        ) {
          const lineIdx = rawLines.findIndex((l) =>
            new RegExp(`^\\s*"${key}"\\s*:`).test(l),
          );
          diagnostics.push({
            lineNumber: lineIdx >= 0 ? lineIdx + 1 : 1,
            severity: "warning",
            message: `Template "${key}" and content association cannot be changed in Code View and will be preserved.`,
          });
        }
      }
      const nextTemplate = preserveTemplateIdentityAndAssociation(
        template,
        obj,
      );
      const jsonFormatted = formatTemplateToJsonCode(nextTemplate);
      return {
        template: nextTemplate,
        diagnostics,
        buttonCount: Object.keys(nextTemplate.buttons).length,
        rootCount: nextTemplate.hierarchy.root.length,
        draftLines: adaptJsonLines(jsonFormatted.lines, selectedButtonId),
      };
    } catch (err) {
      return {
        template: null,
        diagnostics: [
          {
            lineNumber: 1,
            severity: "error",
            message:
              err instanceof Error
                ? `Invalid JSON: ${err.message}`
                : "Invalid JSON.",
          },
        ],
        buttonCount: 0,
        rootCount: 0,
        draftLines: [],
      };
    }
  }, [draftCode, format, template, selectedButtonId]);

  const diagnosticsByLine = useMemo(() => {
    const map = new Map<number, CodeDiagnostic[]>();
    for (const diag of parsedDraft.diagnostics) {
      const existing = map.get(diag.lineNumber) ?? [];
      existing.push(diag);
      map.set(diag.lineNumber, existing);
    }
    return map;
  }, [parsedDraft.diagnostics]);

  const highlightedDraftLines = useMemo(() => {
    if (format === "json") {
      return draftCode.split(/\r?\n/).map((line, i) => {
        const lineNum = i + 1;
        const isCursorLine = lineNum === editorCursorLine;
        const matchedLine = parsedDraft.draftLines[i];
        const canUseStructuredTokens =
          matchedLine &&
          matchedLine.tokens.map((t) => t.text).join("") === line;
        const lineDiags = diagnosticsByLine.get(lineNum) ?? [];
        const hasError = lineDiags.some((d) => d.severity === "error");
        const hasWarning = lineDiags.some((d) => d.severity === "warning");

        return (
          <div
            key={i}
            className={cn(
              "pb:rounded pb:px-1",
              getLineHighlightClass(
                isCursorLine,
                hasError,
                hasWarning,
                Boolean(matchedLine?.isSelected),
              ),
            )}
          >
            {line.length === 0
              ? " "
              : canUseStructuredTokens
                ? matchedLine.tokens.map((tok, j) => {
                    const isTokenHovered =
                      isCursorLine && hoveredTokenIdx === j;
                    return (
                      <span
                        key={j}
                        className={cn(
                          tok.className,
                          "pb:rounded-xs pb:transition-colors",
                          isTokenHovered &&
                            "pb:bg-white/20 pb:underline pb:decoration-peerbots-teal pb:underline-offset-4",
                        )}
                      >
                        {tok.text}
                      </span>
                    );
                  })
                : highlightJsonRaw(line).map((seg, j) => (
                    <span key={j} className={seg.className}>
                      {seg.text}
                    </span>
                  ))}
          </div>
        );
      });
    }

    return parsedDraft.draftLines.map((line, i) => {
      const isCursorLine = line.lineNumber === editorCursorLine;
      const lineDiags = diagnosticsByLine.get(line.lineNumber) ?? [];
      const hasError = lineDiags.some((d) => d.severity === "error");
      const hasWarning = lineDiags.some((d) => d.severity === "warning");
      const isEmpty =
        line.tokens.length === 0 ||
        line.tokens.every((t) => t.text.length === 0);
      return (
        <div
          key={i}
          className={cn(
            "pb:rounded pb:px-1",
            getLineHighlightClass(
              isCursorLine,
              hasError,
              hasWarning,
              Boolean(line.isSelected),
            ),
          )}
        >
          {isEmpty
            ? " "
            : line.tokens.map((tok, j) => {
                const isTokenHovered = isCursorLine && hoveredTokenIdx === j;
                return (
                  <span
                    key={j}
                    className={cn(
                      tok.className,
                      "pb:rounded-xs pb:transition-colors",
                      isTokenHovered &&
                        "pb:bg-white/20 pb:underline pb:decoration-peerbots-teal pb:underline-offset-4",
                    )}
                  >
                    {tok.text}
                  </span>
                );
              })}
        </div>
      );
    });
  }, [
    draftCode,
    format,
    parsedDraft.draftLines,
    diagnosticsByLine,
    editorCursorLine,
    hoveredTokenIdx,
  ]);

  return {
    parsedDraft,
    diagnosticsByLine,
    highlightedDraftLines,
  };
}
