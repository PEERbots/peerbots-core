export type Direction = "ltr" | "rtl";

export interface CommonLabels {
  select: string;
  loading: string;
  close: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  applyAll?: string;
}

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

export interface VoiceLabels {
  language: string;
  voice: string;
  languagePlaceholder: string;
  voicePlaceholder: string;
}

export interface LanguageLabels {
  language: string;
  beta: string;
  new: string;
}

export interface ControlLabels {
  selectButton: string;
  selectAll: string;
  selectedCount: string;
  sendMessage: string;
  buttonTitle: string;
  sync: string;
  syncTitleSpeechAria: string;
  labelColor: string;
  buttonType: string;
  message: string;
  log: string;
  details: string;
  speech: string;
  speechDetails: string;
  robotColor: string;
  emotion: string;
  moveUp: string;
  moveDown: string;
  deleteButton: string;
  applyAll: string;
}

export const DEFAULT_CONTROL_LABELS: ControlLabels = {
  selectButton: "Select button",
  selectAll: "Clear selected buttons",
  selectedCount: "{count} selected",
  sendMessage: "Send message",
  buttonTitle: "Title",
  sync: "Sync",
  syncTitleSpeechAria: "Sync button title and speech",
  labelColor: "Label Color",
  buttonType: "Type",
  message: "Message",
  log: "Log",
  details: "Event details",
  speech: "Speech phrase",
  speechDetails: "Speech / Details",
  robotColor: "Face Color",
  emotion: "Emotion",
  moveUp: "Move up",
  moveDown: "Move down",
  deleteButton: "Delete button",
  applyAll: "Apply all...",
};

export interface PeerbotsLabels {
  common?: Partial<CommonLabels>;
  auth?: Partial<AuthFormLabels>;
  voice?: Partial<VoiceLabels>;
  language?: Partial<LanguageLabels>;
  control?: Partial<ControlLabels>;
  [key: string]: Record<string, string | undefined> | undefined;
}

export interface PeerbotsI18nContextValue {
  dir: Direction;
  lang?: string;
  labels?: PeerbotsLabels;
}
