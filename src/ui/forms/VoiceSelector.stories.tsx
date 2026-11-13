import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import type { VoiceDescriptor } from "../../helpers/voiceHelpers";
import { VoiceSelector } from "./VoiceSelector";

const SAMPLE_VOICES: VoiceDescriptor[] = [
  {
    name: "com.apple.voice.compact.en-US.Samantha",
    voiceURI: "com.apple.voice.compact.en-US.Samantha",
    lang: "en-US",
  },
  {
    name: "AWS - Joanna",
    voiceURI: "aws:Joanna",
    lang: "en-US",
  },
  {
    name: "com.apple.voice.compact.es-ES.Monica",
    voiceURI: "com.apple.voice.compact.es-ES.Monica",
    lang: "es-ES",
  },
  {
    name: "com.apple.voice.compact.ar-001.Maged",
    voiceURI: "com.apple.voice.compact.ar-001.Maged",
    lang: "ar-001",
  },
];

const meta: Meta<typeof VoiceSelector> = {
  title: "Forms/VoiceSelector",
  component: VoiceSelector,
};

export default meta;
type Story = StoryObj<typeof VoiceSelector>;

function InteractiveVoiceSelector(
  props: Partial<React.ComponentProps<typeof VoiceSelector>>,
) {
  const [language, setLanguage] = useState<string>("English");
  const [voiceUri, setVoiceUri] = useState<string>("aws:Joanna");

  return (
    <div className="pb:max-w-sm">
      <VoiceSelector
        voices={SAMPLE_VOICES}
        selectedLanguage={language}
        selectedVoiceUri={voiceUri}
        onLanguageChange={(nextLang) => {
          setLanguage(nextLang);
          const firstForLang = SAMPLE_VOICES.find((v) =>
            nextLang === "Spanish"
              ? v.lang.startsWith("es")
              : nextLang === "Arabic"
                ? v.lang.startsWith("ar")
                : v.lang.startsWith("en"),
          );
          if (firstForLang) {
            setVoiceUri(firstForLang.voiceURI);
          }
        }}
        onVoiceChange={setVoiceUri}
        {...props}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <InteractiveVoiceSelector />,
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4">
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Default Interactive Voice Selector
        </span>
        <InteractiveVoiceSelector />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Custom Labels
        </span>
        <InteractiveVoiceSelector
          labels={{
            language: "Speech Language",
            voice: "Robot Voice",
          }}
        />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Disabled State
        </span>
        <InteractiveVoiceSelector disabled />
      </div>
    </div>
  ),
};
