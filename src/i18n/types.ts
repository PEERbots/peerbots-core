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
  /** Link text switching from sign-in to password reset (default: `"Forgot your password?"`). */
  forgotPassword: string;
  /** Prompt shown above the sign-in switcher in sign-up mode (default: `"Already have an account?"`). */
  alreadyHaveAccount: string;
  /** Prompt shown above the sign-up switcher in sign-in mode (default: `"Don't have an account?"`). */
  dontHaveAccount: string;
  /** Prompt shown in reset-password mode to return to sign-in (default: `"Remembered your password?"`). */
  rememberedPassword: string;
  /** Divider conjunction between credential fields and OAuth buttons (default: `"or"`). */
  or: string;
  /** Label for the Google OAuth button in sign-in mode (default: `"Sign in with Google"`). */
  signInWithGoogle: string;
  /** Label for the Google OAuth button in sign-up mode (default: `"Sign up with Google"`). */
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
 * Namespaced dictionary of localized UI labels supplied to `PeerbotsI18nProvider`.
 * Built-in components read partial overrides from `common` and `auth` (falling back to
 * {@link DEFAULT_COMMON_LABELS} and {@link DEFAULT_AUTH_FORM_LABELS}), while host apps
 * may attach arbitrary custom string namespaces via `[namespace]`.
 */
export interface PeerbotsLabels {
  /** Optional partial overrides for shared UI control labels (`select`, `close`, `save`, etc.). */
  common?: Partial<CommonLabels>;
  /** Optional partial overrides for `AuthFormUI` labels. */
  auth?: Partial<AuthFormLabels>;
  /** Extensible custom label namespaces for host application modules. */
  [key: string]: Record<string, string> | undefined;
}

/**
 * Resolved internationalization state exposed by `usePeerbotsI18n()`.
 */
export interface PeerbotsI18nContextValue {
  /** Active resolved layout direction (`"ltr"` or `"rtl"`). */
  dir: Direction;
  /** Optional BCP-47 language tag (e.g., `"en"`, `"es"`, `"ar"`). */
  lang?: string;
  /** Optional localized label overrides keyed by namespace (`common`, `auth`, or custom). */
  labels?: PeerbotsLabels;
}
