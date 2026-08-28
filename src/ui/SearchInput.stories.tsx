import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SearchInput } from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "Components/SearchInput",
  component: SearchInput,
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

function ControlledSearchInput(props: React.ComponentProps<typeof SearchInput>) {
  const [val, setVal] = useState(props.value ?? "");
  return (
    <div className="pb:max-w-xs">
      <SearchInput
        {...props}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onClear={() => setVal("")}
      />
      <span className="pb:text-xs pb:text-gray-400 pb:mt-1 pb:block">
        Current value: {val ? `"${val}"` : "empty"}
      </span>
    </div>
  );
}

export const Default: Story = {
  render: () => <ControlledSearchInput placeholder="Search collections..." />,
};

export const Variations: Story = {
  render: () => (
    <div className="pb:flex pb:flex-col pb:gap-6 pb:p-4">
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:block pb:mb-2">Prefilled with Clear Button</span>
        <ControlledSearchInput value="Robot templates" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:block pb:mb-2">Disabled State</span>
        <SearchInput disabled placeholder="Search is disabled" className="pb:max-w-xs" />
      </div>
      <div>
        <span className="pb:text-xs pb:font-bold pb:text-gray-500 pb:block pb:mb-2">Without Clear Button</span>
        <ControlledSearchInput showClearButton={false} placeholder="No clear button..." />
      </div>
    </div>
  ),
};
