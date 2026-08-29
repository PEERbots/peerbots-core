import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "./FileUpload";
import { Heading } from "./Typography";

const meta: Meta<typeof FileUpload> = {
  title: "Media & Files/FileUpload",
  component: FileUpload,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    accept: { control: "text" },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    buttonText: { control: "text" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  args: {
    buttonText: "Choose File",
    placeholder: "No file chosen",
    accept: "image/*",
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4 pb:w-96">
      <div className="pb:space-y-2">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black">
          Single Image Upload
        </Heading>
        <FileUpload accept="image/*" maxSizeBytes={5 * 1024 * 1024} />
      </div>

      <div className="pb:space-y-2">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black">
          Multiple Files with Custom Button
        </Heading>
        <FileUpload
          multiple
          buttonText="Browse Files"
          buttonVariant="primary"
          placeholder="Select one or more documents"
        />
      </div>

      <div className="pb:space-y-2">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black">
          Disabled State
        </Heading>
        <FileUpload disabled />
      </div>
    </div>
  ),
};
