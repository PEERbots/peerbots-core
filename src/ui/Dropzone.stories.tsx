import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Dropzone } from "./Dropzone";
import { Heading } from "./Typography";

const meta: Meta<typeof Dropzone> = {
  title: "UI/Dropzone",
  component: Dropzone,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    accept: { control: "text" },
    maxSizeMB: { control: "number" },
    disabled: { control: "boolean" },
    title: { control: "text" },
    subtitle: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Dropzone>;

export const Default: Story = {
  args: {
    title: "Click or drag file to upload",
    subtitle: "PNG, JPG, WEBP up to 10MB",
    accept: "image/*",
    maxSizeMB: 10,
  },
};

export const InteractiveState: Story = {
  render: () => {
    const [preview, setPreview] = useState<string | null>(null);

    return (
      <div className="pb:w-96 pb:p-4">
        <Dropzone
          accept="image/*"
          previewUrl={preview}
          title="Upload creation photo"
          subtitle="Drag high-res photo or click to browse"
          onFileSelect={(file) => {
            const url = URL.createObjectURL(file);
            setPreview(url);
          }}
          onFileRemove={() => setPreview(null)}
        />
      </div>
    );
  },
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4 pb:w-96">
      <div className="pb:space-y-2">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black">
          Image Dropzone
        </Heading>
        <Dropzone
          accept="image/*"
          title="Upload avatar"
          subtitle="PNG or JPG up to 5MB"
        />
      </div>

      <div className="pb:space-y-2">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black">
          With Existing Image Preview
        </Heading>
        <Dropzone
          previewUrl="https://images.unsplash.com/photo-1508759078412-70b92305a610?auto=format&fit=crop&w=600&q=80"
          onFileRemove={() => {}}
        />
      </div>

      <div className="pb:space-y-2">
        <Heading level={4} className="pb:text-sm pb:font-medium pb:text-black">
          Disabled State
        </Heading>
        <Dropzone disabled title="Upload disabled" subtitle="Submissions are closed" />
      </div>
    </div>
  ),
};
