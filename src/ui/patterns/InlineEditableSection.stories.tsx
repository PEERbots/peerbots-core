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
      <div className="pb:space-y-6 pb:max-w-xl">
        <div className="pb:p-4 pb:border pb:border-gray-200 pb:rounded-xl pb:bg-white">
          <InlineEditableSection
            editableTitle
            title={title}
            description={desc}
            titleLabel="Collection Name"
            descriptionLabel="Collection Description"
            titleAriaLabel="Collection Name"
            descriptionAriaLabel="Collection Description"
            onSave={(values) => {
              setTitle(values.title);
              setDesc(values.description);
            }}
          />
        </div>

        <div className="pb:p-4 pb:border pb:border-gray-200 pb:rounded-xl pb:bg-white">
          <InlineEditableSection
            description=""
            descriptionLabel="Template Description"
            emptyDescriptionText="No description set."
            onSave={() => {}}
          />
        </div>
      </div>
    );
  },
};
