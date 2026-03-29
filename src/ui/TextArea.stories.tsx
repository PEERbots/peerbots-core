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
    <div className="flex flex-col gap-12 p-4 max-w-lg">
      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          Styles & Sizes
        </Heading>
        <div className="space-y-6">
          <div className="space-y-1">
            <Text variant="small" className="font-bold">
              With Predefined Value
            </Text>
            <TextArea defaultValue="This is some predefined text in the textarea." />
          </div>
          <div className="space-y-1">
            <Text variant="small" className="font-bold">
              Large (10 rows)
            </Text>
            <TextArea
              rows={10}
              placeholder="A larger textarea for more content..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black uppercase">
          States
        </Heading>
        <div className="space-y-1">
          <Text variant="small" className="font-bold">
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
