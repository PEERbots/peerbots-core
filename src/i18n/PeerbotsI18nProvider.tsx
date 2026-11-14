import React, { createContext, useContext, useEffect, useMemo } from "react";
import type {
  Direction,
  PeerbotsLabels,
  PeerbotsI18nContextValue,
} from "./types";

const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];

/**
 * Returns `true` when the given BCP-47 language tag (e.g., `"ar"`, `"he-IL"`, `"fa"`, `"ur"`)
 * uses a right-to-left (`"rtl"`) writing system.
 */
export const isRTL = (lang?: string): boolean => {
  if (!lang) return false;
  const baseLang = lang.split("-")[0].toLowerCase();
  return RTL_LANGUAGES.includes(baseLang);
};

const defaultContextValue: PeerbotsI18nContextValue = {
  dir: "ltr",
  lang: "en",
};

const PeerbotsI18nContext =
  createContext<PeerbotsI18nContextValue>(defaultContextValue);

/**
 * React hook returning the active {@link PeerbotsI18nContextValue} (`dir`, `lang`, and `labels`)
 * from the nearest enclosing {@link PeerbotsI18nProvider}.
 */
export const usePeerbotsI18n = (): PeerbotsI18nContextValue => {
  return useContext(PeerbotsI18nContext);
};

/**
 * Props for {@link PeerbotsI18nProvider}.
 */
export interface PeerbotsI18nProviderProps {
  /** Subtree of `@peerbots/core` and application components to receive i18n context. */
  children: React.ReactNode;
  /**
   * Explicit layout direction (`"ltr"` or `"rtl"`), or `"auto"` (default) to infer
   * direction automatically from `lang` via {@link isRTL}.
   */
  dir?: Direction | "auto";
  /** Optional BCP-47 language tag (e.g., `"en"`, `"ar-EG"`) synchronized to `<html lang>`. */
  lang?: string;
  /** Optional partial localized string overrides grouped by namespace (`common`, `auth`, etc.). */
  labels?: PeerbotsLabels;
}

/**
 * Root internationalization provider for `@peerbots/core` applications.
 * Resolves `"ltr"` / `"rtl"` direction, synchronizes `document.documentElement.dir` and `lang`,
 * and supplies localized {@link PeerbotsLabels} to descendant components.
 */
export const PeerbotsI18nProvider: React.FC<PeerbotsI18nProviderProps> = ({
  children,
  dir,
  lang,
  labels,
}) => {
  const resolvedDir: Direction = useMemo(() => {
    if (dir && dir !== "auto") return dir;
    if (lang && isRTL(lang)) return "rtl";
    return "ltr";
  }, [dir, lang]);

  useEffect(() => {
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.dir = resolvedDir;
      if (lang) {
        document.documentElement.lang = lang;
      }
    }
  }, [resolvedDir, lang]);

  // Synchronize during SSR / initial pass if document exists
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.dir = resolvedDir;
    if (lang) {
      document.documentElement.lang = lang;
    }
  }

  const contextValue = useMemo<PeerbotsI18nContextValue>(
    () => ({
      dir: resolvedDir,
      lang,
      labels,
    }),
    [resolvedDir, lang, labels],
  );

  return (
    <PeerbotsI18nContext.Provider value={contextValue}>
      <div dir={resolvedDir} className="pb:contents">
        {children}
      </div>
    </PeerbotsI18nContext.Provider>
  );
};

/**
 * Convenience alias for {@link PeerbotsI18nProvider}.
 */
export { PeerbotsI18nProvider as PeerbotsProvider };
