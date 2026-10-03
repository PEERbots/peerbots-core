import React, { createContext, useContext, useEffect, useMemo } from "react";
import type {
  Direction,
  PeerbotsLabels,
  PeerbotsI18nContextValue,
} from "./types";

const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];

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

export const usePeerbotsI18n = (): PeerbotsI18nContextValue => {
  return useContext(PeerbotsI18nContext);
};

export interface PeerbotsI18nProviderProps {
  children: React.ReactNode;
  dir?: Direction | "auto";
  lang?: string;
  labels?: PeerbotsLabels;
}

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

export { PeerbotsI18nProvider as PeerbotsProvider };
