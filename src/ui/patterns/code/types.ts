export interface CodeDiagnosticItem {
  lineNumber: number;
  severity: "error" | "warning";
  message: string;
}

export interface ExplainedCodeSwatch {
  color: string;
  title?: string;
  shape?: "square" | "circle";
}

export interface ExplainedCodeToken {
  kind: string;
  badgeLabel: string;
  text: string;
  explanation: string;
  className: string;
  isStructural?: boolean;
  swatches?: ExplainedCodeSwatch[];
}

export interface ExplainedCodeLine {
  lineNumber: number;
  metaLabel?: string;
  summary: string;
  isInteractive?: boolean;
  isSelected?: boolean;
  tokens: ExplainedCodeToken[];
}

export interface CodeAutocompleteOption {
  label: string;
  insertText: string;
  description: string;
  swatchColor?: string;
}

export interface CodeAutocompleteState {
  heading: string;
  replaceStart: number;
  replaceEnd: number;
  suggestions: CodeAutocompleteOption[];
}
