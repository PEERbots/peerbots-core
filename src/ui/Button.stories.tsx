import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Heading } from "./Typography";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger", "ghost", "ghostly-danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    isLoading: { control: "boolean" },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
  },
};

export const Variations: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black italic">
          Variants
        </Heading>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="ghostly-danger">Ghostly Danger</Button>
        </div>
      </div>

      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black italic">
          Sizes
        </Heading>
        <div className="flex flex-wrap gap-4 items-end">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black italic">
          States
        </Heading>
        <div className="flex flex-wrap gap-4 items-center">
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black italic">
          With Icons
        </Heading>
        <div className="flex flex-wrap gap-4 items-center">
          <Button leftIcon={<Icon name="cloudArrowUp" />}>Upload</Button>
          <Button variant="secondary" rightIcon={<Icon name="chevronRight" />}>
            Next
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Heading level={4} className="text-sm font-medium text-black italic">
          Icon Only
        </Heading>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">
            <Icon name="plus" />
          </Button>
          <Button size="md">
            <Icon name="plus" />
          </Button>
          <Button size="lg">
            <Icon name="plus" />
          </Button>
          <Button variant="ghost" size="sm" aria-label="Close">
            <Icon name="close" />
          </Button>
        </div>
      </div>
    </div>
  ),
};
