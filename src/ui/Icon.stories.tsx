import type { Meta, StoryObj } from "@storybook/react";
import { Icon, IconName } from "./Icon";
import { Text } from "./Typography";

const meta: Meta<typeof Icon> = {
  title: "UI/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    name: {
      control: "select",
      options: [
        "arrowDown",
        "arrowDownToLine",
        "arrowDownTray",
        "arrowPath",
        "arrowRightOnRectangle",
        "arrowUp",
        "arrowUpFromLine",
        "arrowUpTray",
        "arrowsPointingIn",
        "arrowsPointingOut",
        "arrowsRightLeft",
        "arrowsUpDown",
        "check",
        "checkCircle",
        "chevronDownSmall",
        "chevronDownTable",
        "chevronRight",
        "chevronUpSmall",
        "chevronUpTable",
        "clipboard",
        "close",
        "cloudArrowUp",
        "code",
        "document",
        "edit",
        "envelope",
        "exclamationCircle",
        "exclamationTriangle",
        "export",
        "externalLink",
        "eye",
        "folder",
        "google",
        "home",
        "import",
        "lock",
        "lockClosed",
        "magnifyingGlassPlus",
        "megaphone",
        "minus",
        "pencilSquare",
        "pencilSquareContinued",
        "play",
        "plus",
        "questionMarkCircle",
        "search",
        "shoppingCart",
        "speakerWave",
        "squares",
        "tableCells",
        "userCircle",
        "x",
        "xCircle",
        "zap",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

const CheckPath = <path d="M20 6 9 17l-5-5" />;
const XPath = <path d="M18 6 6 18M6 6l12 12" />;

export const Default: Story = {
  args: {
    children: CheckPath,
    className: "text-green-500",
  },
};

export const NamedIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4 p-4">
      {[
        "arrowDown",
        "arrowDownToLine",
        "arrowDownTray",
        "arrowPath",
        "arrowRightOnRectangle",
        "arrowUp",
        "arrowUpFromLine",
        "arrowUpTray",
        "arrowsPointingIn",
        "arrowsPointingOut",
        "arrowsRightLeft",
        "arrowsUpDown",
        "check",
        "checkCircle",
        "chevronDownSmall",
        "chevronDownTable",
        "chevronRight",
        "chevronUpSmall",
        "chevronUpTable",
        "clipboard",
        "close",
        "cloudArrowUp",
        "code",
        "document",
        "edit",
        "envelope",
        "exclamationCircle",
        "exclamationTriangle",
        "export",
        "externalLink",
        "eye",
        "folder",
        "google",
        "home",
        "import",
        "lock",
        "lockClosed",
        "magnifyingGlassPlus",
        "megaphone",
        "minus",
        "pencilSquare",
        "pencilSquareContinued",
        "play",
        "plus",
        "questionMarkCircle",
        "search",
        "shoppingCart",
        "speakerWave",
        "squares",
        "tableCells",
        "userCircle",
        "x",
        "xCircle",
        "zap",
      ].map((name) => (
        <div key={name} className="flex flex-col items-center">
          <Icon name={name as IconName} />
          <Text variant="small">{name}</Text>
        </div>
      ))}
    </div>
  ),
};

export const Variations: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-4">
      <div className="space-y-4">
        <Text variant="small" className="font-bold underline uppercase">
          Different Sizes
        </Text>
        <div className="flex items-end gap-4">
          <Icon size="sm">{CheckPath}</Icon>
          <Icon size="md">{CheckPath}</Icon>
          <Icon size="lg">{CheckPath}</Icon>
          <Icon size="xl">{CheckPath}</Icon>
        </div>
      </div>
      <div className="space-y-4">
        <Text variant="small" className="font-bold underline uppercase">
          Different Content & Colors
        </Text>
        <div className="flex gap-4">
          <Icon className="text-red-500">{XPath}</Icon>
          <Icon className="text-primary">{CheckPath}</Icon>
        </div>
      </div>
      <div className="space-y-4">
        <Text variant="small" className="font-bold underline uppercase">
          Using Named Icons
        </Text>
        <div className="flex gap-4">
          <Icon name="check" className="text-green-500" />
          <Icon name="x" className="text-red-500" />
          <Icon name="plus" className="text-blue-500" />
        </div>
      </div>
    </div>
  ),
};
