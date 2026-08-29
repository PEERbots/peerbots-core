import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Dropzone } from "./Dropzone";
import { Heading } from "../foundations/Typography";

const meta: Meta<typeof Dropzone> = {
  title: "Media & Files/Dropzone",
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
    showPreview: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Dropzone>;

export const Default: Story = {
  args: {
    title: "Click or drag file to upload",
    subtitle: "PNG, JPG, WEBP, or MP4 up to 10MB",
    accept: "image/*,video/*",
    maxSizeMB: 10,
    showPreview: true,
  },
};

export const WithImagePreview: Story = {
  args: {
    previewUrl:
      "https://images.unsplash.com/photo-1508759078412-70b92305a610?auto=format&fit=crop&w=800&q=80",
    title: "Upload photo",
    subtitle: "PNG, JPG up to 10MB",
  },
};

export const InteractiveState: Story = {
  render: () => {
    return (
      <div className="pb:w-96 pb:p-4 pb:space-y-4">
        <Heading level={4} className="pb:text-sm pb:font-bold pb:text-gray-900">
          Interactive Photo Upload (Auto-Preview)
        </Heading>
        <Dropzone
          accept="image/*"
          title="Upload creation photo"
          subtitle="Drag high-res photo or click to browse"
          maxSizeMB={10}
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
          Empty Dropzone
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
          previewUrl="https://images.unsplash.com/photo-1508759078412-70b92305a610?auto=format&fit=crop&w=800&q=80"
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
