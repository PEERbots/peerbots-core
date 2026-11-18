/**
 * Document and component layout reading direction (`"ltr"` left-to-right or `"rtl"` right-to-left).
 */
export type Direction = "ltr" | "rtl";

/**
 * Shared localized action and status strings consumed across `@peerbots/core` UI primitives
 * (such as `Select`, `Dialog`, `CopyButton`, and editable panels).
 */
export interface CommonLabels {
  /** Placeholder prompt for unselected dropdowns/selects (default: `"Select..."`). */
  select: string;
  /** Accessible status text shown while async content is loading (default: `"Loading..."`). */
  loading: string;
  /** Accessible label for dismiss/close buttons on dialogs and popovers (default: `"Close"`). */
  close: string;
  /** Label for edit action triggers (default: `"Edit"`). */
  edit: string;
  /** Label for destructive delete triggers (default: `"Delete"`). */
  delete: string;
  /** Label for form/dialog save confirmation buttons (default: `"Save"`). */
  save: string;
  /** Label for form/dialog cancel buttons (default: `"Cancel"`). */
  cancel: string;
  /** Optional bulk-apply trigger label for multi-selected items (default: `"Apply to selected..."`). */
  applyAll?: string;
}

/**
 * Default English (`en`) strings for the `common` i18n label namespace.
 */
export const DEFAULT_COMMON_LABELS: CommonLabels = {
  select: "Select...",
  loading: "Loading...",
  close: "Close",
  edit: "Edit",
  delete: "Delete",
  save: "Save",
  cancel: "Cancel",
  applyAll: "Apply to selected...",
};

/**
 * Localized strings consumed by the `AuthFormUI` sign-in, sign-up, and password-reset pattern.
 */
export interface AuthFormLabels {
  /** Heading and submit button label for sign-in mode (default: `"Sign In"`). */
  signIn: string;
  /** Heading and submit button label for account registration mode (default: `"Sign Up"`). */
  signUp: string;
  /** Heading and submit button label for password recovery mode (default: `"Reset Password"`). */
  resetPassword: string;
  /** Placeholder text for the email input field (default: `"Email"`). */
  email: string;
  /** Visible `<Label>` text associated with the email input field (default: `"Email"`). */
  emailLabel: string;
  /** Placeholder text for the password input field (default: `"Password"`). */
  password: string;
  /** Visible `<Label>` text associated with the password input field (default: `"Password"`). */
  passwordLabel: string;
  /** Link prompt to switch into password-reset mode (default: `"Forgot your password?"`). */
  forgotPassword: string;
  /** Link prompt to switch from sign-up back to sign-in (default: `"Already have an account?"`). */
  alreadyHaveAccount: string;
  /** Link prompt to switch from sign-in to sign-up (default: `"Don't have an account?"`). */
  dontHaveAccount: string;
  /** Link prompt to switch from password-reset back to sign-in (default: `"Remembered your password?"`). */
  rememberedPassword: string;
  /** Divider text between OAuth and email/password forms (default: `"or"`). */
  or: string;
  /** OAuth button label for Google sign-in (default: `"Sign in with Google"`). */
  signInWithGoogle: string;
  /** OAuth button label for Google registration (default: `"Sign up with Google"`). */
  signUpWithGoogle: string;
}

/**
 * Default English (`en`) strings for the `auth` i18n label namespace.
 */
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

/**
 * Localized strings consumed by `Table`, `DataTable`, `TableToolbar`, `TableBulkActionBar`,
 * `TableColumnApplyAllPopover`, and `TablePagination`.
 */
export interface TableLabels {
  /** Accessible label for the header select-all checkbox. */
  selectAll: string;
  /** Accessible label prefix for individual row selection checkboxes. */
  selectRow: string;
  /** Status template showing selected count (`"{count} selected"`). */
  selectedCount: string;
  /** Button label to clear active row selection. */
  clearSelection: string;
  /** Button template to select every row across the dataset (`"Select all {count} rows"`). */
  selectAllRows: string;
  /** Trigger label for column-level bulk apply popovers (`"Apply all"`). */
  applyAll: string;
  /** Scope radio label targeting all rows (`"All rows ({count})"`). */
  applyToAllRows: string;
  /** Scope radio label targeting only selected rows (`"Selected rows ({count})"`). */
  applyToSelectedRows: string;
  /** Confirmation button label inside column apply popovers. */
  apply: string;
  /** Cancel button label inside column apply popovers. */
  cancel: string;
  /** Accessible label for per-cell copy-down-to-column triggers. */
  copyCellToColumn: string;
  /** Accessible label for ascending column sort triggers. */
  sortAscending: string;
  /** Accessible label for descending column sort triggers. */
  sortDescending: string;
  /** Accessible label to clear active column sorting. */
  clearSort: string;
  /** Default empty-state heading when a table has zero rows. */
  emptyTitle: string;
  /** Default empty-state description when a table has zero rows. */
  emptyDescription: string;
  /** Placeholder text for `TableToolbar` search inputs. */
  searchPlaceholder: string;
  /** Label preceding the page-size selector in `TablePagination`. */
  rowsPerPage: string;
  /** Current page indicator template (`"Page {page} of {totalPages}"`). */
  pageOf: string;
  /** Visible item range summary template (`"Showing {start}–{end} of {total}"`). */
  showingRange: string;
  /** Accessible label for the previous-page pagination button. */
  previousPage: string;
  /** Accessible label for the next-page pagination button. */
  nextPage: string;
  /** Accessible label for row-detail expand buttons. */
  expandRow: string;
  /** Accessible label for row-detail collapse buttons. */
  collapseRow: string;
  /** Status badge label indicating dirty/unsaved row edits. */
  modified: string;
  /** Label for compact table row density. */
  densityCompact: string;
  /** Label for comfortable table row density. */
  densityComfortable: string;
  /** Label for spacious table row density. */
  densitySpacious: string;
  /** Accessible region label for responsive mobile table action bars. */
  mobileActionsLabel: string;
}

/**
 * Default English (`en`) strings for the `table` i18n label namespace.
 */
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

/**
 * Localized strings consumed by `VoiceSelector`.
 */
export interface VoiceLabels {
  /** Field label for the speech synthesis language dropdown. */
  language: string;
  /** Field label for the speech synthesis voice dropdown. */
  voice: string;
  /** Placeholder text when no language is selected. */
  languagePlaceholder: string;
  /** Placeholder text when no voice is selected. */
  voicePlaceholder: string;
}

/**
 * Localized strings consumed by `LanguageSelector`.
 */
export interface LanguageLabels {
  /** Field or trigger label for the application locale selector. */
  language: string;
  /** Badge text marking beta-status translations. */
  beta: string;
  /** Badge text marking newly added translations. */
  new: string;
}

/**
 * Localized strings consumed by Peerbots template control views (`PeerbotsButtonDisplay`,
 * `ButtonView`, `TableView`, `FlowView`, and deprecated `PeerbotsButtonRow`).
 */
export interface ControlLabels {
  /** Accessible label prefix for selecting an individual template button row. */
  selectButton: string;
  /** Accessible label for selecting all buttons in `TableView`. */
  selectAll: string;
  /** Status template showing selected button count (`"{count} selected"`). */
  selectedCount: string;
  /** Tooltip and accessible label prefix for triggering/playing a button's robot action. */
  sendMessage: string;
  /** Column header and field label for a button's controller display title. */
  buttonTitle: string;
  /** Short label for title/speech synchronization toggles. */
  sync: string;
  /** Toolbar switch label for keeping button `speech`/`details` synced with `title`. */
  syncSpeechWithTitle: string;
  /** Screen-reader `aria-label` describing the title-to-speech sync switch. */
  syncTitleSpeechAria: string;
  /** Column header and field label for the controller UI button color (`button.labelColor`). */
  labelColor: string;
  /** Column header and field label for the button variant (`"Message"` vs `"Log"`). */
  buttonType: string;
  /** Display name for spoken/expressive `"Message"` buttons. */
  message: string;
  /** Display name for silent session-logging `"Log"` buttons. */
  log: string;
  /** Field label and placeholder for `"Log"` button event notes (`details.details`). */
  details: string;
  /** Field label and placeholder for `"Message"` button spoken phrase (`details.speech`). */
  speech: string;
  /** Combined column header for spoken speech or log details (`"Speech / Details"`). */
  speechDetails: string;
  /** Column header and field label for the robot face color (`button.details.color`). */
  robotColor: string;
  /** Column header and field label for the robot face expression (`button.details.emotion`). */
  emotion: string;
  /** Column header for per-row reorder and delete actions. */
  actions: string;
  /** Accessible label prefix for moving a button earlier among its hierarchy siblings. */
  moveUp: string;
  /** Accessible label prefix for moving a button later among its hierarchy siblings. */
  moveDown: string;
  /** Accessible label prefix for deleting a template button. */
  deleteButton: string;
  /** Trigger label for bulk column apply popovers. */
  applyAll: string;
  /** Panel label for `FlowView` graph orientation controls. */
  flowLayout: string;
  /** Option label for vertical top-to-bottom (`"TB"`) `FlowView` DAG layout. */
  topBottom: string;
  /** Option label for horizontal left-to-right (`"LR"`) `FlowView` DAG layout. */
  leftRight: string;
  /** Accessible label for the `Buttons | Table | Flow` view mode switcher. */
  selectView: string;
  /** Option label for `ButtonView` grid mode. */
  buttonsView: string;
  /** Option label for `TableView` spreadsheet editor mode. */
  tableView: string;
  /** Option label for `FlowView` node-graph mode. */
  flowView: string;
  /** Empty-state title when a template contains zero buttons. */
  emptyTemplateTitle: string;
  /** Empty-state helper text when a template contains zero buttons. */
  emptyTemplateDescription: string;
  /** Heading for the docked button editor panel. */
  editButton?: string;
  /** Empty-state text when no button is selected in the editor panel. */
  noButtonSelected?: string;
  /** Section label for sibling reorder controls in the button editor panel. */
  reorderButton?: string;
  /** Button label for moving a button earlier among siblings. */
  moveBackwards?: string;
  /** Button label for moving a button later among siblings. */
  moveForwards?: string;
  /** Heading for the template analytics panel. */
  analyzeTemplate?: string;
  /** Empty-state text when no template is selected in the analytics panel. */
  noTemplateSelected?: string;
  /** Section heading for title and speech metrics in the analytics panel. */
  titleAndSpeech?: string;
  /** Summary text for total button count (`"{count} buttons"`). */
  buttonCount?: string;
  /** Summary text for Message button count (`"{count} Messages"`). */
  messagesDistribution?: string;
  /** Summary text for Log button count (`"{count} Logs"`). */
  logsDistribution?: string;
  /** Label for the character-length threshold slider in template analytics. */
  tooLongThreshold?: string;
  /** Metric card heading for title character length. */
  titleLength?: string;
  /** Metric card heading for speech character length. */
  speechLength?: string;
  /** Formatted average metric (`"Avg: {val}"`). */
  average?: string;
  /** Formatted over-threshold count (`"{val} too long"`). */
  tooLong?: string;
  /** Reference line label on length histograms. */
  tooLongLabel?: string;
  /** Switch label for keeping Log button `details` synced with `title`. */
  syncDetailsWithTitle?: string;
  /** Tooltip for the button title field. */
  buttonTitleTooltip?: string;
  /** Tooltip for the robot speech phrase field. */
  speechTooltip?: string;
  /** Tooltip for the log event details field. */
  detailsTooltip?: string;
  /** Tooltip for the robot color selector. */
  robotColorTooltip?: string;
  /** Tooltip for the button label color selector. */
  labelColorTooltip?: string;
  /** Tooltip for the robot facial emotion selector. */
  emotionTooltip?: string;
  /** Tooltip for the analytics "too long" threshold slider. */
  tooLongThresholdTooltip?: string;
}

/**
 * Default English (`en`) strings for the `control` i18n label namespace.
 */
export const DEFAULT_CONTROL_LABELS: ControlLabels = {
  selectButton: "Select button",
  selectAll: "Select all buttons",
  selectedCount: "{count} selected",
  sendMessage: "Send message",
  buttonTitle: "Title",
  sync: "Sync",
  syncSpeechWithTitle: "Sync Speech with Title",
  syncTitleSpeechAria: "Sync button title and speech",
  labelColor: "Label Color",
  buttonType: "Type",
  message: "Message",
  log: "Log",
  details: "Event details",
  speech: "Speech phrase",
  speechDetails: "Speech / Details",
  robotColor: "Robot Color",
  emotion: "Emotion",
  actions: "Actions",
  moveUp: "Move up",
  moveDown: "Move down",
  deleteButton: "Delete button",
  applyAll: "Apply all",
  flowLayout: "Layout",
  topBottom: "↓ Top-Bottom",
  leftRight: "→ Left-Right",
  selectView: "Select view",
  buttonsView: "Buttons",
  tableView: "Table",
  flowView: "Flow",
  emptyTemplateTitle: "No buttons in template",
  emptyTemplateDescription: "Add buttons to this template to preview and edit them.",
  editButton: "Edit Button",
  noButtonSelected: "Select a button to edit its properties.",
  reorderButton: "Reorder",
  moveBackwards: "Backwards",
  moveForwards: "Forwards",
  analyzeTemplate: "Analyze Template",
  noTemplateSelected: "No template selected.",
  titleAndSpeech: "Title & Speech",
  buttonCount: "{count} buttons",
  messagesDistribution: "{count} Messages",
  logsDistribution: "{count} Logs",
  tooLongThreshold: "Too long threshold (chars)",
  titleLength: "Title Length",
  speechLength: "Speech Length",
  average: "Avg: {val}",
  tooLong: "{val} too long",
  tooLongLabel: "Too Long",
  syncDetailsWithTitle: "Sync Details with Title",
  buttonTitleTooltip: "The text that appears on the button.",
  speechTooltip: "The text spoken by the robot.",
  detailsTooltip: "Extra information that is logged.",
  robotColorTooltip: "The color expressed by the robot (face or light color).",
  labelColorTooltip: "The button's color.",
  emotionTooltip: "The facial expression of the robot.",
  tooLongThresholdTooltip: "The number of characters that counts as 'too long'.",
};

/**
 * Aggregated dictionary of optional localized label overrides supplied to `<PeerbotsI18nProvider>`.
 */
export interface PeerbotsLabels {
  /** Shared action/status overrides (`select`, `close`, `save`, `cancel`, etc.). */
  common?: Partial<CommonLabels>;
  /** `AuthFormUI` overrides. */
  auth?: Partial<AuthFormLabels>;
  /** `Table` and `DataTable` overrides. */
  table?: Partial<TableLabels>;
  /** `VoiceSelector` overrides. */
  voice?: Partial<VoiceLabels>;
  /** `LanguageSelector` overrides. */
  language?: Partial<LanguageLabels>;
  /** Template view (`ButtonView`, `TableView`, `FlowView`, `PeerbotsButtonDisplay`) overrides. */
  control?: Partial<ControlLabels>;
  /** Extensible custom namespace dictionary for consumer apps. */
  [key: string]: Record<string, string | undefined> | undefined;
}

/**
 * React context payload exposed by `usePeerbotsI18n()`.
 */
export interface PeerbotsI18nContextValue {
  /** Active layout direction (`"ltr"` or `"rtl"`). */
  dir: Direction;
  /** Optional BCP-47 locale tag (e.g. `"en"`, `"es"`, `"ar"`). */
  lang?: string;
  /** Active localized string overrides merged by components over default English labels. */
  labels?: PeerbotsLabels;
}
