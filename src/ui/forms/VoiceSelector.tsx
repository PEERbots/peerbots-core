import React, { useMemo } from "react";
import { getLanguageName } from "../../helpers/languageUtils";
import {
  findMatchingVoice,
  formatVoiceDisplayName,
  type VoiceDescriptor,
} from "../../helpers/voiceHelpers";
import { usePeerbotsI18n } from "../../i18n";
import { cn } from "../utils";
import { Field } from "./Field";
import { Select } from "./Select";

/**
 * Localized UI labels used by `<VoiceSelector>`.
 */
export interface VoiceSelectorLabels {
  /** Label for the language `<Select>` field. */
  language: string;
  /** Label for the voice `<Select>` field. */
  voice: string;
  /** Placeholder shown when no language is selected. */
  languagePlaceholder: string;
  /** Placeholder shown when no voice is selected. */
  voicePlaceholder: string;
}

/**
 * Default English labels for `<VoiceSelector>`.
 */
export const DEFAULT_VOICE_SELECTOR_LABELS: VoiceSelectorLabels = {
  language: "Language",
  voice: "Voice",
  languagePlaceholder: "Select language...",
  voicePlaceholder: "Select voice...",
};

/**
 * Props for `<VoiceSelector>` — paired Language + TTS Voice `<Select>` fields compatible with Web Speech API `SpeechSynthesisVoice` descriptors.
 */
export interface VoiceSelectorProps {
  /** Available TTS voice descriptors (e.g. from `window.speechSynthesis.getVoices()`). */
  voices: readonly VoiceDescriptor[];
  /** Currently selected `voiceURI` identifier. */
  selectedVoiceUri?: string | null;
  /** Currently selected human-readable language filter (e.g. `"English"`). */
  selectedLanguage?: string | null;
  /** Callback invoked when the user picks a voice `voiceURI`. */
  onVoiceChange: (voiceUri: string) => void;
  /** Optional callback invoked when the language filter changes. */
  onLanguageChange?: (language: string) => void;
  /** Disables both dropdowns when `true`. */
  disabled?: boolean;
  /** Optional localized label overrides. */
  labels?: Partial<VoiceSelectorLabels>;
  /** Additional wrapper classes. */
  className?: string;
}

export function VoiceSelector({
  voices,
  selectedVoiceUri,
  selectedLanguage,
  onVoiceChange,
  onLanguageChange,
  disabled = false,
  labels,
  className,
}: VoiceSelectorProps) {
  const { labels: contextLabels } = usePeerbotsI18n();
  const baseId = React.useId();
  const languageSelectId = `${baseId}-language`;
  const voiceSelectId = `${baseId}-voice`;

  const resolvedLabels: VoiceSelectorLabels = {
    language:
      labels?.language ??
      contextLabels?.voice?.language ??
      DEFAULT_VOICE_SELECTOR_LABELS.language,
    voice:
      labels?.voice ??
      contextLabels?.voice?.voice ??
      DEFAULT_VOICE_SELECTOR_LABELS.voice,
    languagePlaceholder:
      labels?.languagePlaceholder ??
      contextLabels?.common?.select ??
      DEFAULT_VOICE_SELECTOR_LABELS.languagePlaceholder,
    voicePlaceholder:
      labels?.voicePlaceholder ??
      contextLabels?.common?.select ??
      DEFAULT_VOICE_SELECTOR_LABELS.voicePlaceholder,
  };

  const languages = useMemo(() => {
    return Array.from(new Set(voices.map((v) => getLanguageName(v.lang))))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .map((langName) => ({
        label: langName,
        value: langName,
      }));
  }, [voices]);

  const filteredVoices = useMemo(() => {
    return voices
      .filter(
        (v) =>
          !selectedLanguage || getLanguageName(v.lang) === selectedLanguage,
      )
      .map((v) => ({
        displayName: formatVoiceDisplayName(v.name || v.voiceURI),
        voiceURI: v.voiceURI,
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
      .map((voice) => ({
        label: voice.displayName,
        value: voice.voiceURI,
      }));
  }, [voices, selectedLanguage]);

  const activeVoiceValue = useMemo(() => {
    if (!selectedVoiceUri) return "";
    const matched = findMatchingVoice(
      filteredVoices.map((v) => ({ name: v.label, voiceURI: v.value })),
      selectedVoiceUri,
    );
    return matched ? matched.voiceURI : selectedVoiceUri;
  }, [selectedVoiceUri, filteredVoices]);

  return (
    <div className={cn("pb:flex pb:flex-col pb:gap-3", className)}>
      <Field label={resolvedLabels.language}>
        <Select
          id={languageSelectId}
          aria-label={resolvedLabels.language}
          placeholder={resolvedLabels.languagePlaceholder}
          disabled={disabled}
          value={selectedLanguage || ""}
          onChange={(val) => {
            if (val !== null && onLanguageChange) {
              onLanguageChange(String(val));
            }
          }}
          options={languages}
        />
      </Field>
      <Field label={resolvedLabels.voice}>
        <Select
          id={voiceSelectId}
          aria-label={resolvedLabels.voice}
          placeholder={resolvedLabels.voicePlaceholder}
          disabled={disabled}
          value={activeVoiceValue}
          onChange={(val) => {
            if (val !== null) {
              onVoiceChange(String(val));
            }
          }}
          options={filteredVoices}
        />
      </Field>
    </div>
  );
}
