import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { InlineEditableSection } from "./InlineEditableSection";

const meta: Meta<typeof InlineEditableSection> = {
  title: "Patterns/InlineEditableSection",
  component: InlineEditableSection,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InlineEditableSection>;

export const Default: Story = {
  args: {
    description:
      "Social greetings and morning check-in activities for elementary classrooms.",
    emptyDescriptionText: "No description set.",
    onSave: () => {},
  },
};

export const Variations: Story = {
  render: () => {
    const [title, setTitle] = useState("Classroom Greetings Pack");
    const [desc, setDesc] = useState(
      "A reusable collection of social greeting templates.",
    );

    return (
      <div className="space-y-6 max-w-xl">
        <div className="p-4 border border-gray-200 rounded-xl bg-white">
          <InlineEditableSection
            editableTitle
            title={title}
            description={desc}
            titleAriaLabel="Collection Name"
            descriptionAriaLabel="Collection Description"
            onSave={(values) => {
              setTitle(values.title);
              setDesc(values.description);
            }}
          />
        </div>

        <div className="p-4 border border-gray-200 rounded-xl bg-white">
          <InlineEditableSection
            description=""
            emptyDescriptionText="No description set."
            onSave={() => {}}
          />
        </div>
      </div>
    );
  },
};
