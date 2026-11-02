export type Direction = "ltr" | "rtl";

export interface CommonLabels {
  select: string;
  loading: string;
  close: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
}

export const DEFAULT_COMMON_LABELS: CommonLabels = {
  select: "Select...",
  loading: "Loading...",
  close: "Close",
  edit: "Edit",
  delete: "Delete",
  save: "Save",
  cancel: "Cancel",
};

export interface AuthFormLabels {
  signIn: string;
  signUp: string;
  resetPassword: string;
  email: string;
  emailLabel: string;
  password: string;
  passwordLabel: string;
  forgotPassword: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  rememberedPassword: string;
  or: string;
  signInWithGoogle: string;
  signUpWithGoogle: string;
}

export const DEFAULT_AUTH_FORM_LABELS: AuthFormLabels = {
  signIn: "Sign In",
  signUp: "Sign Up",
  resetPassword: "Reset Password",
  email: "Email",
  emailLabel: "Email",
  password: "Password",
  passwordLabel: "Password",
  forgotPassword: "Forgot your password?",
  alreadyHaveAccount: "Already have an account?",
  dontHaveAccount: "Don't have an account?",
  rememberedPassword: "Remembered your password?",
  or: "or",
  signInWithGoogle: "Sign in with Google",
  signUpWithGoogle: "Sign up with Google",
};

export interface TableLabels {
  selectAll: string;
  selectRow: string;
  selectedCount: string;
  clearSelection: string;
  selectAllRows: string;
  applyAll: string;
  applyToAllRows: string;
  applyToSelectedRows: string;
  apply: string;
  cancel: string;
  copyCellToColumn: string;
  sortAscending: string;
  sortDescending: string;
  clearSort: string;
  emptyTitle: string;
  emptyDescription: string;
  searchPlaceholder: string;
  rowsPerPage: string;
  pageOf: string;
  showingRange: string;
  previousPage: string;
  nextPage: string;
  expandRow: string;
  collapseRow: string;
  modified: string;
  densityCompact: string;
  densityComfortable: string;
  densitySpacious: string;
  mobileActionsLabel: string;
}

export const DEFAULT_TABLE_LABELS: TableLabels = {
  selectAll: "Select all rows",
  selectRow: "Select row",
  selectedCount: "{count} selected",
  clearSelection: "Clear selection",
  selectAllRows: "Select all {count} rows",
  applyAll: "Apply all",
  applyToAllRows: "All rows ({count})",
  applyToSelectedRows: "Selected rows ({count})",
  apply: "Apply",
  cancel: "Cancel",
  copyCellToColumn: "Apply this value to column",
  sortAscending: "Sort ascending",
  sortDescending: "Sort descending",
  clearSort: "Clear sort",
  emptyTitle: "No rows to display",
  emptyDescription: "There are no matching records for the current view.",
  searchPlaceholder: "Search rows...",
  rowsPerPage: "Rows per page:",
  pageOf: "Page {page} of {totalPages}",
  showingRange: "Showing {start}–{end} of {total}",
  previousPage: "Previous page",
  nextPage: "Next page",
  expandRow: "Expand row details",
  collapseRow: "Collapse row details",
  modified: "Modified",
  densityCompact: "Compact",
  densityComfortable: "Comfortable",
  densitySpacious: "Spacious",
  mobileActionsLabel: "Table controls",
};

export interface PeerbotsLabels {
  common?: Partial<CommonLabels>;
  auth?: Partial<AuthFormLabels>;
  table?: Partial<TableLabels>;
  [key: string]: Record<string, string> | undefined;
}

export interface PeerbotsI18nContextValue {
  dir: Direction;
  lang?: string;
  labels?: PeerbotsLabels;
}
