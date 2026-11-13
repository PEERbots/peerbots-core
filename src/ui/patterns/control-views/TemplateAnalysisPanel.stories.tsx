import type { Meta, StoryObj } from "@storybook/react-vite";
import { EXAMPLE_LOG_AND_SPEAK_TEMPLATE } from "../../../templates/examples";
import { TemplateAnalysisPanel } from "./TemplateAnalysisPanel";

const meta: Meta<typeof TemplateAnalysisPanel> = {
  title: "Patterns/Template Views/TemplateAnalysisPanel",
  component: TemplateAnalysisPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Pure, store-agnostic template analytics panel displaying button counts, title/speech character-length distributions against an adjustable threshold, and emotion/color distribution charts.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TemplateAnalysisPanel>;

const sampleTemplate = EXAMPLE_LOG_AND_SPEAK_TEMPLATE;

export const Default: Story = {
  render: () => (
    <div className="pb:w-80 pb:border pb:border-gray-200 pb:rounded-lg pb:p-3 pb:bg-gray-50">
      <TemplateAnalysisPanel template={sampleTemplate} onClose={() => {}} />
    </div>
  ),
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-wrap pb:gap-6">
      <div className="pb:w-80 pb:border pb:border-gray-200 pb:rounded-lg pb:p-3 pb:bg-gray-50">
        <TemplateAnalysisPanel
          template={sampleTemplate}
          defaultThreshold={25}
          onClose={() => {}}
        />
      </div>
      <div className="pb:w-80 pb:border pb:border-gray-200 pb:rounded-lg pb:p-3 pb:bg-gray-50">
        <TemplateAnalysisPanel template={null} onClose={() => {}} />
      </div>
    </div>
  ),
};
