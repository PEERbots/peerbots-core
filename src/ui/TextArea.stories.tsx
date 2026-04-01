import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./TextArea";
import { Heading, Text } from "./Typography";

const meta: Meta<typeof TextArea> = {
  title: "UI/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4 pb:max-w-lg">
      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          Styles & Sizes
        </Heading>
        <div className="pb:space-y-6">
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:font-bold">
              With Predefined Value
            </Text>
            <TextArea defaultValue="This is some predefined text in the textarea." />
          </div>
          <div className="pb:space-y-1">
            <Text variant="small" className="pb:font-bold">
              Large (10 rows)
            </Text>
            <TextArea
              rows={10}
              placeholder="A larger textarea for more content..."
            />
          </div>
        </div>
      </div>

      <div className="pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black pb:uppercase">
          States
        </Heading>
        <div className="pb:space-y-1">
          <Text variant="small" className="pb:font-bold">
            Disabled
          </Text>
          <TextArea
            disabled
            placeholder="Cannot type here"
            defaultValue="Read only content"
          />
        </div>
      </div>
    </div>
  ),
};
