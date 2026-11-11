import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { LanguageSelector } from "./LanguageSelector";

const meta: Meta<typeof LanguageSelector> = {
  title: "Forms/LanguageSelector",
  component: LanguageSelector,
};

export default meta;
type Story = StoryObj<typeof LanguageSelector>;

function InteractiveLanguageSelector(
  props: Partial<React.ComponentProps<typeof LanguageSelector>>,
) {
  const [lang, setLang] = useState("en");
  return <LanguageSelector value={lang} onChange={setLang} {...props} />;
}

export const Default: Story = {
  render: () => (
    <div className="pb:max-w-xs">
      <InteractiveLanguageSelector />
    </div>
  ),
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4">
      <div className="pb:max-w-xs">
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Default Select Variant
        </span>
        <InteractiveLanguageSelector variant="default" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Topbar Pill Variant (With Beta Badge)
        </span>
        <InteractiveLanguageSelector variant="topbar" badge="beta" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Topbar Pill Variant (Without Badge)
        </span>
        <InteractiveLanguageSelector variant="topbar" badge={false} />
      </div>
      <div className="pb:max-w-xs">
        <span className="pb:text-xs pb:font-bold pb:text-gray-700 pb:block pb:mb-2">
          Sidebar Expanded & Collapsed Variants
        </span>
        <div className="pb:flex pb:items-center pb:gap-4">
          <div className="pb:w-56 pb:border pb:border-gray-200 pb:rounded-lg">
            <InteractiveLanguageSelector variant="sidebar" badge="new" />
          </div>
          <div className="pb:border pb:border-gray-200 pb:rounded-lg">
            <InteractiveLanguageSelector
              variant="sidebar"
              isCollapsed
              badge="beta"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
