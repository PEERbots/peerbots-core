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
    <div className="pb:grid pb:grid-cols-6 pb:gap-4 pb:p-4">
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
        <div key={name} className="pb:flex pb:flex-col pb:items-center">
          <Icon name={name as IconName} />
          <Text variant="small">{name}</Text>
        </div>
      ))}
    </div>
  ),
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-12 pb:p-4">
      <div className="pb:space-y-4">
        <Text variant="small" className="pb:font-bold pb:underline pb:uppercase">
          Different Sizes
        </Text>
        <div className="pb:flex pb:items-end pb:gap-4">
          <Icon size="sm">{CheckPath}</Icon>
          <Icon size="md">{CheckPath}</Icon>
          <Icon size="lg">{CheckPath}</Icon>
          <Icon size="xl">{CheckPath}</Icon>
        </div>
      </div>
      <div className="pb:space-y-4">
        <Text variant="small" className="pb:font-bold pb:underline pb:uppercase">
          Different Content & Colors
        </Text>
        <div className="pb:flex pb:gap-4">
          <Icon className="pb:text-red-500">{XPath}</Icon>
          <Icon className="pb:text-primary">{CheckPath}</Icon>
        </div>
      </div>
      <div className="pb:space-y-4">
        <Text variant="small" className="pb:font-bold pb:underline pb:uppercase">
          Using Named Icons
        </Text>
        <div className="pb:flex pb:gap-4">
          <Icon name="check" className="pb:text-green-500" />
          <Icon name="x" className="pb:text-red-500" />
          <Icon name="plus" className="pb:text-blue-500" />
        </div>
      </div>
    </div>
  ),
};
