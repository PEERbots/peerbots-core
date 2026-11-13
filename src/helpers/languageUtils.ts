import type { Direction } from "../i18n/types";

export interface LanguageOption {
  code: string;
  name: string;
  englishName?: string;
  dir?: Direction;
}

export const DEFAULT_SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  {
    code: "en",
    name: "English",
    englishName: "English",
    dir: "ltr",
  },
  {
    code: "es",
    name: "Español",
    englishName: "Spanish",
    dir: "ltr",
  },
  {
    code: "fr",
    name: "Français",
    englishName: "French",
    dir: "ltr",
  },
  {
    code: "ar",
    name: "العربية",
    englishName: "Arabic",
    dir: "rtl",
  },
] as const;

const displayNamesCache = new Map<string, Intl.DisplayNames>();

function getDisplayNamesInstance(locale: string): Intl.DisplayNames | null {
  const cached = displayNamesCache.get(locale);
  if (cached) {
    return cached;
  }
  if (typeof Intl === "undefined" || typeof Intl.DisplayNames !== "function") {
    return null;
  }
  try {
    const instance = new Intl.DisplayNames([locale], { type: "language" });
    displayNamesCache.set(locale, instance);
    return instance;
  } catch {
    return null;
  }
}

/**
 * Resolves a BCP-47 language tag (e.g. `"en-US"`, `"es-ES"`, `"ar"`) into a
 * human-readable language name (e.g. `"English"`, `"Spanish"`, `"Arabic"`).
 */
export function getLanguageName(code: string, displayLocale = "en"): string {
  if (!code) {
    return "";
  }
  try {
    const baseCode = code.trim().split(/[-_]/)[0];
    if (!baseCode) {
      return code;
    }
    const displayNames = getDisplayNamesInstance(displayLocale);
    return displayNames?.of(baseCode) || code;
  } catch {
    return code;
  }
}
