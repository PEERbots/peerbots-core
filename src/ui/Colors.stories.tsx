import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "UI/Colors",
  tags: ["autodocs"],
};

export default meta;

export const Variations: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-8 p-4 bg-white">
      <div>
        <h3 className="text-sm font-medium text-black uppercase tracking-wider border-b pb-1 mb-4">
          Theme Colors
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <ColorItem name="Primary" variable="var(--color-primary)" />
          <ColorItem name="Secondary" variable="var(--color-secondary)" />
          <ColorItem name="Accent" variable="var(--color-accent)" />
          <ColorItem name="Danger" variable="var(--color-danger)" />
          <ColorItem name="Light BG" variable="var(--color-light-bg)" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-black uppercase tracking-wider border-b pb-1 mb-4">
          Extended Accent Colors
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ColorItem name="Accent HC" variable="var(--color-accent-hc)" />
          <ColorItem name="Accent Two" variable="var(--color-accent-two)" />
          <ColorItem
            name="Accent Two HC"
            variable="var(--color-accent-two-hc)"
          />
          <ColorItem name="Accent Three" variable="var(--color-accent-three)" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-black uppercase tracking-wider border-b pb-1 mb-4">
          UI Elements
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ColorItem name="Sidebar BG" variable="var(--sidebar-bg)" />
          <ColorItem name="Dark Primary" variable="var(--color-dark-primary)" />
        </div>
      </div>
    </div>
  ),
};

function ColorItem({ name, variable }: { name: string; variable: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-20 w-full rounded-md shadow-inner border border-gray-100"
        style={{ backgroundColor: variable }}
      />
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-900">{name}</span>
        <code className="text-xs text-gray-500">{variable}</code>
      </div>
    </div>
  );
}
