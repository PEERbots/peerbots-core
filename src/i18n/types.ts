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

export interface PeerbotsLabels {
  common?: Partial<CommonLabels>;
  auth?: Partial<AuthFormLabels>;
  [key: string]: Record<string, string> | undefined;
}

export interface PeerbotsI18nContextValue {
  dir: Direction;
  lang?: string;
  labels?: PeerbotsLabels;
}
