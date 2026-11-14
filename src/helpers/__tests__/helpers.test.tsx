import { describe, expect, it } from "vitest";
import {
  DEFAULT_SUPPORTED_LANGUAGES,
  findMatchingVoice,
  formatVoiceDisplayName,
  getLanguageName,
  languageUtils,
  SEO,
  voiceHelpers,
  type VoiceDescriptor,
} from "../index";
import React from "react";
import { renderToString } from "react-dom/server";

describe("Helpers: languageUtils, voiceHelpers, and SEO", () => {
  describe("languageUtils", () => {
    it("exports DEFAULT_SUPPORTED_LANGUAGES with LTR and RTL entries", () => {
      expect(DEFAULT_SUPPORTED_LANGUAGES.length).toBeGreaterThanOrEqual(4);
      const arabic = DEFAULT_SUPPORTED_LANGUAGES.find((l) => l.code === "ar");
      expect(arabic?.dir).toBe("rtl");
      const english = DEFAULT_SUPPORTED_LANGUAGES.find((l) => l.code === "en");
      expect(english?.dir).toBe("ltr");
      expect(languageUtils.getLanguageName).toBe(getLanguageName);
    });

    it("resolves BCP-47 tags to human-readable names and caches Intl.DisplayNames", () => {
      expect(getLanguageName("")).toBe("");
      expect(getLanguageName("en-US")).toBe("English");
      expect(getLanguageName("en_GB")).toBe("English");
      expect(getLanguageName("es-ES")).toBe("Spanish");
      expect(getLanguageName("ar-EG")).toBe("Arabic");
      expect(getLanguageName("es", "es")).toMatch(/español/i);
    });

    it("falls back gracefully on malformed tags or display locales", () => {
      expect(getLanguageName("-")).toBe("-");
      expect(getLanguageName("!!!")).toBe("!!!");
      expect(getLanguageName("en", "invalid_locale_tag_!!!")).toBe("en");
    });
  });

  describe("voiceHelpers", () => {
    it("exports namespace alias and formats AWS, Google, and Apple voice names", () => {
      expect(voiceHelpers.formatVoiceDisplayName).toBe(formatVoiceDisplayName);
      expect(voiceHelpers.findMatchingVoice).toBe(findMatchingVoice);

      expect(formatVoiceDisplayName("")).toBe("");
      expect(formatVoiceDisplayName("AWS - Joanna")).toBe("Joanna");
      expect(formatVoiceDisplayName("aws:Matthew")).toBe("Matthew");
      expect(formatVoiceDisplayName("Samantha")).toBe("Samantha");
      expect(
        formatVoiceDisplayName("com.google.android.tts:en-us-x-sfg-local"),
      ).toBe("en us x sfg local");
      expect(
        formatVoiceDisplayName("com.apple.ttsbundle.siri_female_en-US_compact"),
      ).toBe("Siri Female");
      expect(
        formatVoiceDisplayName("com.apple.ttsbundle.siri_male_en-US_premium"),
      ).toBe("Siri Male (Premium)");
      expect(
        formatVoiceDisplayName("com.apple.ttsbundle.Samantha-compact"),
      ).toBe("Samantha");
      expect(
        formatVoiceDisplayName("com.apple.ttsbundle.GoodNews-enhanced"),
      ).toBe("Good News (Enhanced)");
      expect(
        formatVoiceDisplayName("com.apple.speech.synthesis.voice.BadNews"),
      ).toBe("Bad News");
      expect(
        formatVoiceDisplayName("com.apple.voice.compact.en-US.Samantha"),
      ).toBe("Samantha");
      expect(
        formatVoiceDisplayName("com.apple.voice.enhanced.en-US.Samantha"),
      ).toBe("Samantha (Enhanced)");
      expect(formatVoiceDisplayName("com.apple.eloquence.en-US.Grandma")).toBe(
        "Grandma",
      );
      expect(
        formatVoiceDisplayName("com.apple.custom.unknown.SuperStar_enhanced"),
      ).toBe("Super Star");
    });

    it("matches voices by URI, exact name, cleaned display name, and case-insensitivity", () => {
      const voices: VoiceDescriptor[] = [
        {
          name: "com.apple.voice.compact.en-US.Samantha",
          voiceURI: "urn:apple:samantha",
          lang: "en-US",
        },
        {
          name: "AWS - Joanna",
          voiceURI: "aws:Joanna",
          lang: "en-US",
        },
        {
          name: "CustomRAW",
          voiceURI: "custom-uri-1",
          lang: "fr-FR",
        },
      ];

      expect(findMatchingVoice(voices, null)).toBeUndefined();
      expect(findMatchingVoice(voices, undefined)).toBeUndefined();
      expect(findMatchingVoice(voices, "")).toBeUndefined();

      expect(findMatchingVoice(voices, "urn:apple:samantha")).toBe(voices[0]);
      expect(findMatchingVoice(voices, "AWS - Joanna")).toBe(voices[1]);
      expect(findMatchingVoice(voices, "Samantha")).toBe(voices[0]);
      expect(findMatchingVoice(voices, "joanna")).toBe(voices[1]);
      expect(findMatchingVoice(voices, "CUSTOM-URI-1")).toBe(voices[2]);
      expect(findMatchingVoice(voices, "nonexistent")).toBeUndefined();
    });
  });

  describe("SEO re-export", () => {
    it("renders SEO metadata tags via helpers index", () => {
      const html = renderToString(
        <SEO title="Controller" url="https://app.peerbots.org/control" />,
      );
      expect(html).toContain("Controller | Peerbots App");
      expect(html).toContain("https://app.peerbots.org/control");
    });
  });
});
