import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Button } from "../forms/Button";
import { Input } from "../forms/Input";
import { Switch } from "../forms/Switch";
import { Heading, Text } from "../foundations/Typography";
import { Collapsible } from "./Collapsible";
import { SettingsPanel } from "./SettingsPanel";

const COLLAPSIBLE_COMPARISON_MD = `
Single standalone disclosure container wrapping arbitrary React \`children\` (such as an "Advanced Settings" drawer, optional form subsection, or expandable debug panel), scaled via \`size="sm" | "md" | "lg"\`.

| Dimension | \`<Collapsible>\` | \`<Accordion>\` |
|---|---|---|
| **Item Count** | **1 standalone disclosure** wrapping \`children\` | **2+ coordinated items** via \`items={[...]}\` |
| **Sizing Scale** | \`size="sm"\` (compact sidebars), \`"md"\` (default), \`"lg"\` (spacious cards) | Uniform list-level card variants |
| **Mutual Exclusivity** | Independent (\`isOpen\` / \`defaultOpen\`) | Coordinated single-open (\`allowMultiple={false}\`) or multi-open |
| **Canonical Use Case** | Advanced form options, collapsible \`SettingsPanel\`, inspector drawers | FAQ lists, multi-topic help centers |
`.trim();

const meta: Meta<typeof Collapsible> = {
  title: "Layout/Disclosures/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: COLLAPSIBLE_COMPARISON_MD,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  args: {
    title: "Advanced Speech Options",
    size: "md",
    children: (
      <div className="pb:space-y-2">
        <Text size="sm" color="muted">
          Configure optional pitch and rate overrides for this robot character.
        </Text>
        <Input
          aria-label="Fallback utterance"
          placeholder="I did not catch that—could you say it again?"
        />
      </div>
    ),
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Compare `size=\"sm\"` (tailored for dense sidebars), `size=\"md\"` (default), and `size=\"lg\"` (spacious page cards).",
      },
    },
  },
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-4 pb:max-w-xl pb:p-4">
      <Collapsible title="Small (size=&quot;sm&quot;) — Compact Sidebar" size="sm" defaultOpen>
        <Text size="xs" color="muted">
          Compact header and content padding ideal for narrow inspector drawers.
        </Text>
      </Collapsible>
      <Collapsible title="Medium (size=&quot;md&quot;) — Default" size="md" defaultOpen>
        <Text size="sm" color="muted">
          Balanced padding for standard settings forms and dialogs.
        </Text>
      </Collapsible>
      <Collapsible title="Large (size=&quot;lg&quot;) — Spacious Card" size="lg" defaultOpen>
        <Text size="md" color="muted">
          Generous padding for primary page sections and onboarding guides.
        </Text>
      </Collapsible>
    </div>
  ),
};

export const EmbeddedInSettingsPanel: Story = {
  render: () => (
    <div className="pb:max-w-md pb:p-4 pb:bg-gray-50 pb:rounded-2xl">
      <SettingsPanel title="Matcher Configuration">
        <div className="pb:flex pb:items-center pb:justify-between">
          <span className="pb:text-sm pb:font-medium pb:text-gray-800">
            Speak Fallback on Low Confidence
          </span>
          <Switch aria-label="Speak fallback on low confidence" defaultChecked />
        </div>
        <Collapsible title="Developer Diagnostics" size="sm">
          <div className="pb:space-y-2">
            <Text size="xs" color="muted">
              Embedding model: <code>Xenova/all-MiniLM-L6-v2</code> (384-d)
            </Text>
            <Button size="xs" color="neutral">
              Rebuild Vector Index
            </Button>
          </div>
        </Collapsible>
      </SettingsPanel>
    </div>
  ),
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-8 pb:p-4 pb:max-w-xl">
      <div className="pb:space-y-4">
        <Heading
          level={4}
          className="pb:text-sm pb:font-medium pb:text-black pb:uppercase"
        >
          States &amp; Styling
        </Heading>
        <div className="pb:space-y-4">
          <Collapsible title="Initially Open" defaultOpen={true}>
            <div className="pb:space-y-2">
              <p className="pb:text-sm pb:text-gray-700">
                This content is visible by default.
              </p>
              <Input aria-label="Settings value" placeholder="Settings value" />
            </div>
          </Collapsible>
          <Collapsible
            title={
              <span className="pb:font-bold pb:text-peerbots-darkteal">
                Custom Styled Header Node
              </span>
            }
          >
            <div className="pb:space-y-3">
              <p className="pb:text-sm pb:text-gray-700">
                Custom React node passed as the disclosure title.
              </p>
              <Button variant="primary" size="sm">
                Apply Action
              </Button>
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
  ),
};
